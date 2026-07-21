"""L0 executor tests: faked LLM stream, real parser + catalog, zero model calls."""

import json

import pytest
from a2a.types import Message, Part, Role, TextPart

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

    async def stream(self, prompt, correction=None):
        self.corrections.append(correction)
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
async def test_exhaustion_emits_plain_text_apology():
    responder = _FakeResponder(["nothing useful here"])  # no <a2ui-json> block at all
    executor = LlmAgentExecutor(responder)
    queue = _FakeQueue()
    await executor.execute(_Ctx("show me open PRs"), queue)
    assert responder.calls == MAX_ATTEMPTS  # retried up to the cap
    assert APOLOGY_TEXT in _all_text(queue)
