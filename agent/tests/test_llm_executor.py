"""L0 executor tests: faked LLM stream, real parser + catalog, zero model calls."""

import json

import pytest
from a2a.types import DataPart, Message, Part, Role, TextPart

from llm_agent.catalog import EXAMPLES_DIR
from llm_agent.executor import APOLOGY_TEXT, MAX_ATTEMPTS, LlmAgentExecutor


def _valid_surface_text() -> str:
    first = sorted(EXAMPLES_DIR.glob("*.json"))[0]
    messages = json.loads(first.read_text(encoding="utf-8"))["messages"]
    return "Here is your surface:\n<a2ui-json>\n" + json.dumps(messages) + "\n</a2ui-json>"


class _FakeResponder:
    """Yields a scripted response per attempt (indexed by number of stream() calls)."""

    def __init__(self, scripts):
        self._scripts = scripts
        self.calls = 0
        self.corrections = []
        self.prompts = []

    async def stream(self, prompt, correction=None):
        self.corrections.append(correction)
        self.prompts.append(prompt)
        text = self._scripts[min(self.calls, len(self._scripts) - 1)]
        self.calls += 1
        # yield in two chunks to exercise incremental parsing
        mid = len(text) // 2
        for chunk in (text[:mid], text[mid:]):
            yield chunk


class _Ctx:
    def __init__(self, prompt):
        self.message = Message(
            message_id="m1", role=Role.user, parts=[Part(root=TextPart(text=prompt))]
        )
        self.current_task = None


class _ActionCtx:
    """A message carrying one v0.9 A2UI action DataPart (the client's action wire form)."""

    def __init__(self, action):
        self.message = Message(
            message_id="m1",
            role=Role.user,
            parts=[Part(root=DataPart(data={"version": "v0.9", "action": action}))],
        )
        self.current_task = None


class _EmptyCtx:
    """A message carrying a part that is neither usable text nor an A2UI action.

    (A2A rejects a truly empty parts list, so this uses a v0.9 DataPart with no
    `action` key — which the executor must still treat as "nothing to compose".)
    """

    def __init__(self):
        self.message = Message(
            message_id="m1",
            role=Role.user,
            parts=[Part(root=DataPart(data={"version": "v0.9"}))],
        )
        self.current_task = None


class _FakeQueue:
    def __init__(self):
        self.events = []

    async def enqueue_event(self, event):
        self.events.append(event)


def _all_text(queue: _FakeQueue) -> str:
    """Flattens every TextPart across every emitted event/message."""
    chunks = []

    def _scan(obj):
        parts = getattr(obj, "parts", None)
        if parts:
            for p in parts:
                root = getattr(p, "root", p)
                text = getattr(root, "text", None)
                if text:
                    chunks.append(text)

    for event in queue.events:
        _scan(event)  # a Message
        status = getattr(event, "status", None)
        if status is not None:
            _scan(getattr(status, "message", None))
    return "\n".join(chunks)


@pytest.mark.asyncio
async def test_valid_first_attempt_streams_and_completes():
    responder = _FakeResponder([_valid_surface_text()])
    executor = LlmAgentExecutor(responder)
    queue = _FakeQueue()
    await executor.execute(_Ctx("show me open PRs"), queue)
    assert responder.calls == 1
    assert responder.corrections == [None]  # first-attempt success, no correction
    assert queue.events  # streamed something


@pytest.mark.asyncio
async def test_invalid_then_valid_retries_with_correction():
    bad = (
        'oops<a2ui-json>[{"version":"v0.9","createSurface":{"surfaceId":"s1",'
        '"catalogId":"x"},"updateComponents":{"surfaceId":"s1","components":'
        '[{"id":"root","component":"Nope"}]}}]</a2ui-json>'
    )
    responder = _FakeResponder([bad, _valid_surface_text()])
    executor = LlmAgentExecutor(responder)
    queue = _FakeQueue()
    await executor.execute(_Ctx("show me open PRs"), queue)
    assert responder.calls == 2
    assert responder.corrections[0] is None
    assert responder.corrections[1] is not None
    assert "validation" in responder.corrections[1].lower()


@pytest.mark.asyncio
async def test_unparseable_block_mid_stream_retries_then_succeeds():
    # The parser raises ValueError on a block with no valid JSON; that must feed the
    # correction/retry loop, not escape the executor as a server error.
    bad = "<a2ui-json>not json at all</a2ui-json>"
    responder = _FakeResponder([bad, _valid_surface_text()])
    executor = LlmAgentExecutor(responder)
    queue = _FakeQueue()
    await executor.execute(_Ctx("show me open PRs"), queue)
    assert responder.calls == 2
    assert responder.corrections[1] is not None


class _FailingResponder:
    """Raises mid-stream on the first call, then succeeds with a valid surface."""

    def __init__(self, failures=1):
        self._failures = failures
        self.calls = 0

    async def stream(self, prompt, correction=None):
        self.calls += 1
        if self.calls <= self._failures:
            yield "partial "
            raise RuntimeError("503 UNAVAILABLE")
        for chunk in (_valid_surface_text(),):
            yield chunk


def _data_parts(queue: _FakeQueue) -> list[dict]:
    out = []

    def _scan(obj):
        for p in getattr(obj, "parts", None) or []:
            root = getattr(p, "root", p)
            data = getattr(root, "data", None)
            if data is not None:
                out.append(data)

    for event in queue.events:
        _scan(event)
        status = getattr(event, "status", None)
        if status is not None:
            _scan(getattr(status, "message", None))
    return out


@pytest.mark.asyncio
async def test_streaming_traverses_custom_component_reference_props():
    # Reachability: the catalog-less parser has no ref-field map, so components
    # referenced through custom props (PageLayout's header/content/pane — not
    # `children`) were unreachable and silently dropped from the stream. The
    # executor hands the parser the live catalog's ref map to fix that.
    surface = json.dumps(
        [
            {
                "version": "v0.9",
                "createSurface": {"surfaceId": "s", "catalogId": "c"},
            },
            {
                "version": "v0.9",
                "updateComponents": {
                    "surfaceId": "s",
                    "components": [
                        {
                            "id": "root",
                            "component": "PageLayout",
                            "header": "hd",
                            "content": "ct",
                        },
                        {"id": "hd", "component": "Text", "text": "header text"},
                        {"id": "ct", "component": "Text", "text": "content text"},
                    ],
                },
            },
        ]
    )
    responder = _FakeResponder(["<a2ui-json>" + surface + "</a2ui-json>"])
    executor = LlmAgentExecutor(responder)
    queue = _FakeQueue()
    await executor.execute(_Ctx("show the page"), queue)

    streamed_ids = set()
    for d in _data_parts(queue):
        for c in (d.get("updateComponents") or {}).get("components", []):
            streamed_ids.add(c.get("id"))
    assert {"root", "hd", "ct"} <= streamed_ids


@pytest.mark.asyncio
async def test_failed_attempt_tears_down_its_partial_surface():
    # A failed attempt must deleteSurface what it half-streamed: the client would
    # otherwise keep a zombie placeholder surface, and a retry re-creating the same
    # surface id would hit "Surface already exists".
    responder = _FailingResponder(failures=MAX_ATTEMPTS)
    executor = LlmAgentExecutor(responder)
    queue = _FakeQueue()

    async def failing_stream(prompt, correction=None):
        yield '<a2ui-json>[{"version": "v0.9", "createSurface": {"surfaceId": "zomb", "catalogId": "c"}}'
        raise RuntimeError("503 UNAVAILABLE")

    responder.stream = failing_stream
    await executor.execute(_Ctx("show me open PRs"), queue)
    deletes = [d for d in _data_parts(queue) if "deleteSurface" in d]
    assert deletes, "expected a deleteSurface teardown for the failed attempt"
    assert deletes[0]["deleteSurface"]["surfaceId"] == "zomb"


@pytest.mark.asyncio
async def test_model_failure_mid_stream_retries_then_succeeds():
    # A provider error (quota, 5xx, network) must not abort the SSE stream raw;
    # it counts as a failed attempt and the prompt is retried unchanged.
    responder = _FailingResponder(failures=1)
    executor = LlmAgentExecutor(responder)
    queue = _FakeQueue()
    await executor.execute(_Ctx("show me open PRs"), queue)
    assert responder.calls == 2
    assert APOLOGY_TEXT not in _all_text(queue)


@pytest.mark.asyncio
async def test_model_failure_exhaustion_emits_unavailable_text():
    from llm_agent.executor import UNAVAILABLE_TEXT

    responder = _FailingResponder(failures=MAX_ATTEMPTS)
    executor = LlmAgentExecutor(responder)
    queue = _FakeQueue()
    await executor.execute(_Ctx("show me open PRs"), queue)
    assert responder.calls == MAX_ATTEMPTS
    assert UNAVAILABLE_TEXT in _all_text(queue)


@pytest.mark.asyncio
async def test_streamed_parts_preserve_relative_template_bindings():
    # The SDK's catalog-less stream parser arms a v0.8 shim that rewrites relative
    # binding paths absolute ('title' -> '/title'), which breaks template item
    # bindings on the client. The executor pins the parser version to disarm it.
    surface = json.dumps(
        [
            {
                "version": "v0.9",
                "createSurface": {"surfaceId": "s", "catalogId": "c"},
            },
            {
                "version": "v0.9",
                "updateComponents": {
                    "surfaceId": "s",
                    "components": [
                        {
                            "id": "root",
                            "component": "Stack",
                            "direction": "vertical",
                            "gap": "none",
                            "children": {"componentId": "row", "path": "/items"},
                        },
                        {"id": "row", "component": "Text", "text": {"path": "title"}},
                    ],
                },
            },
            {
                "version": "v0.9",
                "updateDataModel": {
                    "surfaceId": "s",
                    "path": "/",
                    "value": {"items": [{"title": "one"}]},
                },
            },
        ]
    )
    responder = _FakeResponder(["<a2ui-json>" + surface + "</a2ui-json>"])
    executor = LlmAgentExecutor(responder)
    queue = _FakeQueue()
    await executor.execute(_Ctx("list items"), queue)

    data_parts = []

    def _scan(obj):
        for p in getattr(obj, "parts", None) or []:
            root = getattr(p, "root", p)
            data = getattr(root, "data", None)
            if data is not None:
                data_parts.append(data)

    for event in queue.events:
        _scan(event)
        status = getattr(event, "status", None)
        if status is not None:
            _scan(getattr(status, "message", None))

    streamed = json.dumps(data_parts)
    assert '"title"' in streamed  # the row component streamed with its binding
    assert "/title" not in streamed  # the relative item binding survived untouched


@pytest.mark.asyncio
async def test_exhaustion_emits_plain_text_apology():
    responder = _FakeResponder(["nothing useful here"])  # no <a2ui-json> block at all
    executor = LlmAgentExecutor(responder)
    queue = _FakeQueue()
    await executor.execute(_Ctx("show me open PRs"), queue)
    assert responder.calls == MAX_ATTEMPTS  # retried up to the cap
    assert APOLOGY_TEXT in _all_text(queue)


@pytest.mark.asyncio
async def test_action_event_is_framed_into_the_model_prompt():
    # An incoming A2UI action DataPart (no TextPart) must resolve to a model turn that
    # names the action and carries its resolved context, not an empty prompt.
    action = {
        "name": "approve",
        "surfaceId": "s1",
        "sourceComponentId": "approve-btn",
        "context": {"prNumber": 42, "assignee": "octocat"},
    }
    responder = _FakeResponder([_valid_surface_text()])
    executor = LlmAgentExecutor(responder)
    queue = _FakeQueue()
    await executor.execute(_ActionCtx(action), queue)

    assert responder.calls == 1  # the action was turned into a real model call
    prompt = responder.prompts[0]
    assert prompt  # not empty
    assert "approve" in prompt  # the action name is framed in
    assert "prNumber" in prompt and "42" in prompt  # resolved context values carried
    assert "assignee" in prompt and "octocat" in prompt
    assert "action" in prompt.lower()  # framed as an activated action


@pytest.mark.asyncio
async def test_empty_message_apologizes_without_calling_the_model():
    # A message with neither text nor an action part must not reach the model (an empty
    # prompt is rejected by the provider); it gets the plain-text apology directly.
    responder = _FakeResponder([_valid_surface_text()])
    executor = LlmAgentExecutor(responder)
    queue = _FakeQueue()
    await executor.execute(_EmptyCtx(), queue)

    assert responder.calls == 0  # no model call at all
    assert APOLOGY_TEXT in _all_text(queue)
