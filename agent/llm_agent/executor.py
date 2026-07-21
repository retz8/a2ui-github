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

from llm_agent.catalog import validate_surface
from llm_agent.responder import LlmResponder

logger = logging.getLogger(__name__)

MAX_ATTEMPTS = 2  # one initial + one retry; tunable (spec decision 6)
APOLOGY_TEXT = (
    "Sorry — I couldn't compose a valid interface for that request. Please try rephrasing."
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

        correction: str | None = None
        for attempt in range(1, self._max_attempts + 1):
            # Catalog-less v0.9 parser: incremental structural heal + yield only.
            # Validation is at-end (validate_surface); the parser must not reject the
            # id-bearing wire format the catalog does not model (spec decision 6).
            parser = A2uiStreamParserV09(catalog=None)
            accumulated = ""
            async for token in self._responder.stream(prompt, correction):
                accumulated += token
                for response_part in parser.process_chunk(token):
                    parts = self._parts_for(response_part)
                    if parts:
                        await updater.update_status(
                            TaskState.working,
                            new_agent_parts_message(parts, task.context_id, task.id),
                        )

            payload = _collect_payload(accumulated)
            try:
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
                continue

            await updater.update_status(TaskState.completed, final=True)
            return

        # Attempts exhausted -> plain-text apology.
        await updater.update_status(
            TaskState.completed,
            new_agent_parts_message(
                [Part(root=TextPart(text=APOLOGY_TEXT))], task.context_id, task.id
            ),
            final=True,
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
