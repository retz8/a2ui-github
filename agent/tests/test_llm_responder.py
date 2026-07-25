"""L0 responder tests: the ADK event-stream dedup helper, no live model.

`_stream_agent_text` is the SSE-safe text extractor `AdkLlmResponder.stream` delegates
to. In SSE mode ADK emits partial chunk events then a final aggregated event repeating
the full text; the helper must emit the text once. These tests feed it fake Event-like
objects so the policy is verified without constructing an ADK Runner.
"""

from types import SimpleNamespace

import pytest

from llm_agent.responder import _stream_agent_text


def _event(text, partial):
    """A minimal ADK-Event stand-in: one text part plus the streaming `partial` flag."""
    return SimpleNamespace(
        content=SimpleNamespace(parts=[SimpleNamespace(text=text)]),
        partial=partial,
    )


async def _aiter(events):
    for event in events:
        yield event


async def _collect(events):
    return [chunk async for chunk in _stream_agent_text(_aiter(events))]


@pytest.mark.asyncio
async def test_sse_stream_drops_the_aggregated_duplicate():
    # SSE: partial chunks followed by a final aggregate carrying the full text again.
    events = [
        _event("Hel", partial=True),
        _event("lo", partial=True),
        _event("Hello", partial=None),  # aggregated final — must be skipped
    ]
    chunks = await _collect(events)
    assert chunks == ["Hel", "lo"]
    assert "".join(chunks) == "Hello"  # full text once, not doubled


@pytest.mark.asyncio
async def test_single_non_partial_event_is_emitted():
    # Non-streaming fallback: one final event, no partials seen — must still be emitted.
    chunks = await _collect([_event("Hello", partial=None)])
    assert chunks == ["Hello"]
