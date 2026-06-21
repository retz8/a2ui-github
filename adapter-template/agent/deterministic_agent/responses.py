"""Maps an incoming A2UI action to a canned response, echoing the surfaceId.

Empty-but-wired: there are no canned responses yet. Add your event fixtures to
`_EVENT_FIXTURES` (event name -> fixture filename in `fixtures/`) and drop the
fixture JSON alongside. Until then every action gets a component-free
proof-of-receipt, so the round-trip is observable without a catalog component.
"""

from __future__ import annotations

import json
from pathlib import Path

_FIXTURES_DIR = Path(__file__).resolve().parent / "fixtures"
# Map event names to fixture filenames here, e.g. {"my_event": "my_event.json"}.
_EVENT_FIXTURES: dict[str, str] = {}
# The operation key whose object carries the surfaceId we stamp.
_OPERATION_KEYS = ("updateComponents", "updateDataModel", "createSurface")


def _load_fixture(name: str) -> list[dict]:
    with open(_FIXTURES_DIR / name, encoding="utf-8") as f:
        return json.load(f)


def _stamp_surface(messages: list[dict], surface_id: str) -> list[dict]:
    for msg in messages:
        for key in _OPERATION_KEYS:
            if key in msg:
                msg[key]["surfaceId"] = surface_id
    return messages


def _proof_of_receipt(surface_id: str) -> list[dict]:
    # Component-free acknowledgement: proves the event reached the server and a
    # response round-tripped, without referencing any catalog component.
    return [
        {
            "version": "v0.9",
            "updateDataModel": {"surfaceId": surface_id, "path": "/received", "value": True},
        }
    ]


def build_response(action: dict) -> list[dict]:
    name = action.get("name", "")
    surface_id = action.get("surfaceId", "")
    fixture = _EVENT_FIXTURES.get(name)
    if fixture is None:
        return _proof_of_receipt(surface_id)
    return _stamp_surface(_load_fixture(fixture), surface_id)
