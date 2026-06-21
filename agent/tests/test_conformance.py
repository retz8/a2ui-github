import pytest

from deterministic_agent.catalog import validate_payload
from tests.helpers import run_executor

SUBMIT = {"name": "submit", "surfaceId": "button-event", "sourceComponentId": "root", "context": {}}


async def test_emitted_submit_payload_conforms_to_catalog():
    payload = await run_executor(SUBMIT)
    validate_payload(payload)  # must not raise


async def test_emitted_unknown_event_fallback_conforms_to_catalog():
    payload = await run_executor({"name": "nope", "surfaceId": "s2", "context": {}})
    validate_payload(payload)  # must not raise


def test_validator_rejects_non_conformant_component():
    bad = [
        {
            "version": "v0.9",
            "updateComponents": {
                "surfaceId": "s1",
                "components": [{"id": "x", "component": "NotARealComponent", "text": "y"}],
            },
        }
    ]
    with pytest.raises(Exception):
        validate_payload(bad)
