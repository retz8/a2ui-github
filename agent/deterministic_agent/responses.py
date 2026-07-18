"""Maps an incoming A2UI action to a canned A2UI response, echoing the surfaceId."""

from __future__ import annotations

import json
from pathlib import Path

_FIXTURES_DIR = Path(__file__).resolve().parent / "fixtures"
_EVENT_FIXTURES = {
    "submit": "submit.json",
    "approve": "approve.json",
    "token-remove": "token-remove.json",
    "issue-label-remove": "issue-label-remove.json",
    "select": "select.json",
    "toggle": "toggle.json",
    "search": "search.json",
    "pin": "pin.json",
    "remove": "remove.json",
    "save": "save.json",
    "copy": "copy.json",
    "select-item": "select-item.json",
    "delete": "delete.json",
    "retry-subtree": "retry-subtree.json",
    "dialog-close": "dialog-close.json",
    "popover-dismiss": "popover-dismiss.json",
    "confirm-delete": "confirm-delete.json",
    "save-changes": "save-changes.json",
    "cd-confirm-delete": "cd-confirm-delete.json",
    "cd-cancel-delete": "cd-cancel-delete.json",
    "panel-open": "panel-open.json",
    "panel-close": "panel-close.json",
}
# The operation key whose object carries the surfaceId we stamp.
_OPERATION_KEYS = ("updateComponents", "updateDataModel", "createSurface")

# Demo view labels for the SegmentedControl `change` event: segment indices → names in the
# `segmentedcontrol-event` fixture. The `change` response is built dynamically from the event's
# `context.selectedIndex` (not a canned fixture) so the demo reflects the actually-selected segment.
_VIEW_NAMES = ("Preview", "Raw", "Blame")


def _change_response(action: dict, surface_id: str) -> list[dict]:
    index = action.get("context", {}).get("selectedIndex", 0)
    name = (
        _VIEW_NAMES[index]
        if isinstance(index, int) and 0 <= index < len(_VIEW_NAMES)
        else f"index {index}"
    )
    return [
        {
            "version": "v0.9",
            "updateDataModel": {"surfaceId": surface_id, "path": "/view", "value": index},
        },
        {
            "version": "v0.9",
            "updateComponents": {
                "surfaceId": surface_id,
                "components": [
                    {
                        "id": "status",
                        "component": "Text",
                        "text": f"✅ Now showing: {name} — server received index {index}",
                    }
                ],
            },
        },
    ]


def _select_assigned_response(action: dict, surface_id: str) -> list[dict]:
    """ActionList.Item `select`: echo the item's optimistic `context.assigned` write, then confirm.

    The `select` event name is shared with the Radio/Select `select.json` fixture, but the
    ActionList.Item variant echoes the received selection dynamically (like `change` echoes
    `selectedIndex`), so it is built here rather than from a static fixture. Dispatch is keyed on
    the presence of `context.assigned`, which only the ActionList item event carries; the Radio
    `select` (context `{value}`) still falls through to `select.json`.
    """
    assigned = action.get("context", {}).get("assigned", False)
    return [
        {
            "version": "v0.9",
            "updateDataModel": {"surfaceId": surface_id, "path": "/assigned", "value": assigned},
        },
        {
            "version": "v0.9",
            "updateComponents": {
                "surfaceId": surface_id,
                "components": [
                    {
                        "id": "status",
                        "component": "Text",
                        "text": "✅ Assigned to you — server confirmed",
                    }
                ],
            },
        },
    ]


def _load_fixture(name: str) -> list[dict]:
    with open(_FIXTURES_DIR / name, encoding="utf-8") as f:
        return json.load(f)


def _stamp_surface(messages: list[dict], surface_id: str) -> list[dict]:
    for msg in messages:
        for key in _OPERATION_KEYS:
            if key in msg:
                msg[key]["surfaceId"] = surface_id
    return messages


def _fallback(name: str, surface_id: str) -> list[dict]:
    return [
        {
            "version": "v0.9",
            "updateComponents": {
                "surfaceId": surface_id,
                "components": [
                    {"id": "label", "component": "Text", "text": f"Unhandled event: {name}"}
                ],
            },
        }
    ]


def build_response(action: dict) -> list[dict]:
    name = action.get("name", "")
    surface_id = action.get("surfaceId", "")
    if name == "change":
        return _change_response(action, surface_id)
    if name == "select" and "assigned" in action.get("context", {}):
        return _select_assigned_response(action, surface_id)
    if name == "select" and "tab" in action.get("context", {}):
        # UnderlineNav.Item `select` (context `{tab}`): confirm the selection and refresh the
        # selected tab's count. Shares the `select` event name with the Radio (context `{value}`)
        # and ActionList.Item (context `{assigned}`) variants; keyed on `tab`, which only this event
        # carries. The response is fully canned (targets `tab-pulls`), so it loads a static fixture.
        return _stamp_surface(_load_fixture("underline-nav-select.json"), surface_id)
    fixture = _EVENT_FIXTURES.get(name)
    if fixture is None:
        return _fallback(name, surface_id)
    return _stamp_surface(_load_fixture(fixture), surface_id)
