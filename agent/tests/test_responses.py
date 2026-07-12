from deterministic_agent.responses import build_response

SUBMIT = {"name": "submit", "surfaceId": "button-event", "sourceComponentId": "root", "context": {}}
SELECT = {
    "name": "select",
    "surfaceId": "radio-event",
    "sourceComponentId": "root",
    "context": {"value": "option-1"},
}


def test_submit_returns_data_model_then_components_with_surface_echoed():
    msgs = build_response(SUBMIT)
    assert len(msgs) == 2

    dm = msgs[0]["updateDataModel"]
    assert dm["surfaceId"] == "button-event"
    assert dm["path"] == "/submitted"
    assert dm["value"] is True

    uc = msgs[1]["updateComponents"]
    assert uc["surfaceId"] == "button-event"
    assert uc["components"] == [
        {"id": "label", "component": "Text", "text": "✅ Sent — server received submit"}
    ]


TOKEN_REMOVE = {
    "name": "token-remove",
    "surfaceId": "token-remove-event",
    "sourceComponentId": "root",
    "context": {},
}
ISSUE_LABEL_REMOVE = {
    "name": "issue-label-remove",
    "surfaceId": "issuelabeltoken-remove-event",
    "sourceComponentId": "root",
    "context": {},
}
TOGGLE = {
    "name": "toggle",
    "surfaceId": "toggleswitch-event",
    "sourceComponentId": "root",
    "context": {"checked": True},
}


def test_token_remove_returns_data_model_then_status_swap_with_surface_echoed():
    msgs = build_response(TOKEN_REMOVE)
    assert len(msgs) == 2

    dm = msgs[0]["updateDataModel"]
    assert dm["surfaceId"] == "token-remove-event"
    assert dm["path"] == "/removed"
    assert dm["value"] is True

    uc = msgs[1]["updateComponents"]
    assert uc["surfaceId"] == "token-remove-event"
    assert uc["components"] == [
        {"id": "status", "component": "Text", "text": "✅ Removed — server received token-remove"}
    ]


def test_issue_label_remove_returns_data_model_then_status_swap_with_surface_echoed():
    msgs = build_response(ISSUE_LABEL_REMOVE)
    assert len(msgs) == 2

    dm = msgs[0]["updateDataModel"]
    assert dm["surfaceId"] == "issuelabeltoken-remove-event"
    assert dm["path"] == "/removed"
    assert dm["value"] is True

    uc = msgs[1]["updateComponents"]
    assert uc["surfaceId"] == "issuelabeltoken-remove-event"
    assert uc["components"] == [
        {
            "id": "status",
            "component": "Text",
            "text": "✅ Removed — server received issue-label-remove",
        }
    ]


def test_select_returns_data_model_then_components_with_surface_echoed():
    msgs = build_response(SELECT)
    assert len(msgs) == 2

    dm = msgs[0]["updateDataModel"]
    assert dm["surfaceId"] == "radio-event"
    assert dm["path"] == "/selected"
    assert dm["value"] is True

    uc = msgs[1]["updateComponents"]
    assert uc["surfaceId"] == "radio-event"
    assert uc["components"] == [
        {"id": "status", "component": "Text", "text": '✅ Selected — server received "option-1"'}
    ]


def test_toggle_reverts_setting_then_swaps_status_with_surface_echoed():
    msgs = build_response(TOGGLE)
    assert len(msgs) == 2

    # The server stays authoritative over the two-way-bound path: it writes /setting back to
    # false, overriding the optimistic local flip.
    dm = msgs[0]["updateDataModel"]
    assert dm["surfaceId"] == "toggleswitch-event"
    assert dm["path"] == "/setting"
    assert dm["value"] is False

    uc = msgs[1]["updateComponents"]
    assert uc["surfaceId"] == "toggleswitch-event"
    assert uc["components"] == [
        {
            "id": "status",
            "component": "Text",
            "text": "⚠️ Could not save — reverted by server",
        }
    ]


APPROVE = {
    "name": "approve",
    "surfaceId": "iconbutton-event",
    "sourceComponentId": "root",
    "context": {},
}


def test_approve_writes_approved_then_swaps_icon_with_surface_echoed():
    msgs = build_response(APPROVE)
    assert len(msgs) == 2

    # The /approved write is visible only through the button's `disabled <- /approved` binding —
    # after approve the button locks, proving two-way binding on the button itself.
    dm = msgs[0]["updateDataModel"]
    assert dm["surfaceId"] == "iconbutton-event"
    assert dm["path"] == "/approved"
    assert dm["value"] is True

    uc = msgs[1]["updateComponents"]
    assert uc["surfaceId"] == "iconbutton-event"
    assert uc["components"] == [
        {"id": "approve-icon", "component": "Icon", "name": "check-circle-fill"}
    ]


def test_unknown_event_returns_single_text_fallback_with_surface_echoed():
    msgs = build_response({"name": "wat", "surfaceId": "s9", "context": {}})
    assert len(msgs) == 1
    uc = msgs[0]["updateComponents"]
    assert uc["surfaceId"] == "s9"
    assert uc["components"][0]["component"] == "Text"
    assert uc["components"][0]["text"] == "Unhandled event: wat"
