"""Live AgentExecutor: stream parsed A2UI to the client, validate at end, retry on failure."""

from __future__ import annotations

import logging

from a2a.server.agent_execution import AgentExecutor, RequestContext
from a2a.server.events import EventQueue
from a2a.server.tasks import TaskUpdater
from a2a.types import Part, Task, TaskState, TextPart, UnsupportedOperationError
from a2a.utils import new_agent_parts_message, new_task
from a2a.utils.errors import ServerError
from a2ui.a2a.parts import create_a2ui_part
from a2ui.parser.parser import parse_response
from a2ui.parser.streaming_v09 import A2uiStreamParserV09
from a2ui.schema.constants import VERSION_0_9

from llm_agent.catalog import live_ref_fields, validate_surface
from llm_agent.responder import LlmResponder

logger = logging.getLogger(__name__)

MAX_ATTEMPTS = 2  # one initial + one retry; tunable (spec decision 6)
APOLOGY_TEXT = (
    "Sorry — I couldn't compose a valid interface for that request. Please try rephrasing."
)
UNAVAILABLE_TEXT = (
    "Sorry — the language model is temporarily unavailable. Please try again in a moment."
)


def _extract_text(context: RequestContext) -> str:
    message = context.message
    if message and message.parts:
        for part in message.parts:
            root = part.root
            if isinstance(root, TextPart) and root.text:
                return root.text
    return ""


def _collect_payload(accumulated: str) -> list[dict]:
    """Extracts the full A2UI message list from the accumulated model text.

    Returns an empty list when the response carries no A2UI block (parse_response
    raises in that case); the executor treats an empty payload as a failed attempt.
    """
    try:
        parts = parse_response(accumulated)
    except ValueError:
        return []
    payload: list[dict] = []
    for part in parts:
        if part.a2ui_json:
            data = part.a2ui_json
            payload.extend(data if isinstance(data, list) else [data])
    return payload


class LlmAgentExecutor(AgentExecutor):
    """Streams parsed A2UI parts, validates the complete surface, retries on failure.

    Stream-first / validate-at-end / retry-and-restream (spec decision 6): each parsed
    part is emitted to the client as it arrives while the raw response accumulates; the
    complete payload is validated at the end; on failure the model is re-run with the
    validation error (up to `max_attempts` total); exhaustion yields a plain-text apology.
    """

    def __init__(self, responder: LlmResponder, max_attempts: int = MAX_ATTEMPTS):
        self._responder = responder
        self._max_attempts = max_attempts

    async def execute(self, context: RequestContext, event_queue: EventQueue) -> None:
        prompt = _extract_text(context)

        task = context.current_task
        if not task:
            task = new_task(context.message)
            await event_queue.enqueue_event(task)
        updater = TaskUpdater(event_queue, task.id, task.context_id)
        logger.info(
            "execute start: task=%s context=%s prompt=%r", task.id, task.context_id, prompt
        )

        correction: str | None = None
        model_unavailable = False
        for attempt in range(1, self._max_attempts + 1):
            # Catalog-less v0.9 parser: incremental structural heal + yield only.
            # Validation is at-end (validate_surface); the parser must not reject the
            # id-bearing wire format the catalog does not model (spec decision 6).
            parser = A2uiStreamParserV09(catalog=None)
            # Catalog-less construction leaves the parser's version unset, which arms
            # its v0.8 compatibility shim: every relative binding path in streamed
            # parts gets rewritten absolute ('title' -> '/title'), silently breaking
            # template item bindings on the client. Pin the version to disarm it.
            parser._version = VERSION_0_9
            # It also leaves the ref-field map empty, so the parser's reachability
            # yield cannot traverse the catalog's custom component-reference props
            # (e.g. PageLayout's header/content/pane) and silently drops every
            # component behind them. Hand it the map without the catalog itself.
            parser._ref_fields_map = live_ref_fields()
            accumulated = ""
            stream_error: ValueError | None = None
            created_surfaces: set[str] = set()
            logger.info("attempt %d: calling model", attempt)
            first_token = True
            try:
                async for token in self._responder.stream(prompt, correction):
                    if first_token:
                        logger.info("attempt %d: first model token received", attempt)
                        first_token = False
                    accumulated += token
                    # A malformed A2UI block raises here mid-stream; that is the same
                    # failure class as an invalid surface, so it feeds the same
                    # correction/retry loop instead of escaping as a server error.
                    try:
                        response_parts = parser.process_chunk(token)
                    except ValueError as err:
                        stream_error = err
                        break
                    for response_part in response_parts:
                        created_surfaces |= self._surface_ids(response_part)
                        parts = self._parts_for(response_part)
                        if parts:
                            await updater.update_status(
                                TaskState.working,
                                new_agent_parts_message(parts, task.context_id, task.id),
                            )
            except Exception as err:  # model/infra failure (quota, 5xx, network)
                # Must not abort the SSE stream raw — the client would see a bare
                # network error. Retry with the prompt unchanged; a transient
                # provider error is not a correction-worthy model mistake.
                logger.warning("attempt %d model stream failed: %s", attempt, err)
                model_unavailable = True
                await self._teardown(updater, task, created_surfaces)
                continue
            model_unavailable = False

            payload = _collect_payload(accumulated)
            try:
                if stream_error is not None:
                    raise stream_error
                if not payload:
                    raise ValueError("no A2UI surface found in the model response")
                validate_surface(payload)
            except ValueError as err:
                logger.warning(
                    "attempt %d produced an invalid surface: %s", attempt, err
                )
                correction = (
                    "Your previous A2UI response failed validation with this error:\n"
                    f"{err}\nReturn a corrected, complete A2UI surface."
                )
                await self._teardown(updater, task, created_surfaces)
                continue

            logger.info("attempt %d: surface valid, task %s completed", attempt, task.id)
            await updater.update_status(TaskState.completed, final=True)
            return

        # Attempts exhausted -> plain-text apology, matched to the last failure kind.
        apology = UNAVAILABLE_TEXT if model_unavailable else APOLOGY_TEXT
        await updater.update_status(
            TaskState.completed,
            new_agent_parts_message(
                [Part(root=TextPart(text=apology))], task.context_id, task.id
            ),
            final=True,
        )

    @staticmethod
    def _surface_ids(response_part) -> set[str]:
        """Surface ids created by this part's createSurface messages."""
        data = response_part.a2ui_json
        if not data:
            return set()
        ids = set()
        for msg in data if isinstance(data, list) else [data]:
            surface_id = (msg.get("createSurface") or {}).get("surfaceId")
            if surface_id:
                ids.add(surface_id)
        return ids

    async def _teardown(self, updater: TaskUpdater, task, surface_ids: set[str]) -> None:
        """Deletes surfaces a failed attempt created, so the client is not left with
        a half-streamed zombie surface (and a retry can re-create the same id)."""
        if not surface_ids:
            return
        parts = [
            create_a2ui_part(
                {"version": "v0.9", "deleteSurface": {"surfaceId": sid}},
                version="v0.9",
            )
            for sid in sorted(surface_ids)
        ]
        await updater.update_status(
            TaskState.working,
            new_agent_parts_message(parts, task.context_id, task.id),
        )

    @staticmethod
    def _parts_for(response_part) -> list[Part]:
        parts: list[Part] = []
        if response_part.text:
            parts.append(Part(root=TextPart(text=response_part.text)))
        if response_part.a2ui_json:
            data = response_part.a2ui_json
            for msg in data if isinstance(data, list) else [data]:
                parts.append(create_a2ui_part(msg, version="v0.9"))
        return parts

    async def cancel(
        self, context: RequestContext, event_queue: EventQueue
    ) -> Task | None:
        raise ServerError(error=UnsupportedOperationError())
