from deterministic_agent.responses import build_response

SUBMIT = {"name": "submit", "surfaceId": "button-event", "sourceComponentId": "root", "context": {}}


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


def test_unknown_event_returns_single_text_fallback_with_surface_echoed():
    msgs = build_response({"name": "wat", "surfaceId": "s9", "context": {}})
    assert len(msgs) == 1
    uc = msgs[0]["updateComponents"]
    assert uc["surfaceId"] == "s9"
    assert uc["components"][0]["component"] == "Text"
    assert uc["components"][0]["text"] == "Unhandled event: wat"
