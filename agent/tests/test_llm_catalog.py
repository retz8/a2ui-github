import pytest

from llm_agent.catalog import EXAMPLES_DIR, live_catalog, live_schema_manager, validate_surface


def test_examples_dir_exists_with_curated_examples():
    assert EXAMPLES_DIR.is_dir()
    assert sorted(p.name for p in EXAMPLES_DIR.glob("*.json"))


def test_live_schema_manager_loads_examples():
    sm = live_schema_manager()
    catalog = sm.get_selected_catalog()
    examples = sm.load_examples(catalog)
    assert "---BEGIN" in examples  # examples path resolved and rendered


def _good_surface() -> list[dict]:
    from catalog_common import supported_catalog_ids

    return [
        {
            "version": "v0.9",
            "createSurface": {
                "surfaceId": "s1",
                "catalogId": supported_catalog_ids()[0],
            },
        },
        {
            "version": "v0.9",
            "updateComponents": {
                "surfaceId": "s1",
                "components": [
                    {
                        "id": "root",
                        "component": "Stack",
                        "direction": "vertical",
                        "gap": "normal",
                        "children": ["greeting"],
                    },
                    {"id": "greeting", "component": "Text", "text": "hello"},
                ],
            },
        },
    ]


def test_validate_surface_accepts_a_complete_surface():
    validate_surface(_good_surface())  # must not raise


def test_validate_surface_rejects_an_undeclared_property():
    payload = _good_surface()
    payload[1]["updateComponents"]["components"][0]["bogus"] = 1
    with pytest.raises(ValueError):
        validate_surface(payload)


def test_validate_surface_rejects_a_missing_root():
    payload = _good_surface()
    payload[1]["updateComponents"]["components"][0]["id"] = "not-root"
    with pytest.raises(ValueError):
        validate_surface(payload)


def test_validate_surface_rejects_an_orphan_component():
    payload = _good_surface()
    payload[1]["updateComponents"]["components"].append(
        {"id": "orphan", "component": "Text", "text": "unreachable"}
    )
    with pytest.raises(ValueError):
        validate_surface(payload)


def test_curated_examples_validate_as_complete_surfaces():
    import json

    for path in sorted(EXAMPLES_DIR.glob("*.json")):
        messages = json.loads(path.read_text(encoding="utf-8"))["messages"]
        validate_surface(messages)  # every 7.1 example is a valid complete surface


def _templated_surface() -> list[dict]:
    """A list-template surface with correct relative item bindings and data."""
    from catalog_common import supported_catalog_ids

    return [
        {
            "version": "v0.9",
            "createSurface": {
                "surfaceId": "s1",
                "catalogId": supported_catalog_ids()[0],
            },
        },
        {
            "version": "v0.9",
            "updateComponents": {
                "surfaceId": "s1",
                "components": [
                    {
                        "id": "root",
                        "component": "Stack",
                        "direction": "vertical",
                        "gap": "normal",
                        "children": ["prs"],
                    },
                    {
                        "id": "prs",
                        "component": "ActionList",
                        "children": {"componentId": "row", "path": "/pulls"},
                    },
                    {"id": "row", "component": "ActionList.Item", "children": ["title"]},
                    {"id": "title", "component": "Text", "text": {"path": "title"}},
                ],
            },
        },
        {
            "version": "v0.9",
            "updateDataModel": {
                "surfaceId": "s1",
                "path": "/",
                "value": {"pulls": [{"title": "PR one"}, {"title": "PR two"}]},
            },
        },
    ]


def test_validate_surface_accepts_a_template_with_relative_bindings():
    validate_surface(_templated_surface())  # must not raise


def test_validate_surface_rejects_a_binding_on_a_literal_prop():
    # Icon.name is enum-typed — pass 1's strict type check rejects a binding there
    # (regression for the live run that streamed {"path": "/iconName"} to the client).
    payload = _good_surface()
    payload[1]["updateComponents"]["components"][0]["children"] = ["greeting", "ic"]
    payload[1]["updateComponents"]["components"].append(
        {"id": "ic", "component": "Icon", "name": {"path": "/iconName"}}
    )
    with pytest.raises(ValueError, match="not of type 'string'"):
        validate_surface(payload)


def test_binding_on_literal_prop_is_rejected_even_when_later_overwritten():
    # The client renders incrementally: a poisoned occurrence crashes it even if a
    # later message rewrites the same id with a literal, so every occurrence must fail.
    payload = _good_surface()
    payload[1]["updateComponents"]["components"][0]["children"] = ["greeting", "ic"]
    payload[1]["updateComponents"]["components"].append(
        {"id": "ic", "component": "Icon", "name": {"path": "/iconName"}}
    )
    payload.append(
        {
            "version": "v0.9",
            "updateComponents": {
                "surfaceId": "s1",
                "components": [{"id": "ic", "component": "Icon", "name": "alert"}],
            },
        }
    )
    with pytest.raises(ValueError, match="not of type 'string'"):
        validate_surface(payload)


def test_validate_surface_rejects_an_absolute_item_path_with_relative_hint():
    payload = _templated_surface()
    payload[1]["updateComponents"]["components"][3]["text"] = {"path": "/title"}
    with pytest.raises(ValueError, match="RELATIVE"):
        validate_surface(payload)


def test_validate_surface_rejects_an_unresolvable_binding():
    payload = _templated_surface()
    payload[1]["updateComponents"]["components"][3]["text"] = {"path": "missing"}
    with pytest.raises(ValueError, match="does not resolve"):
        validate_surface(payload)


def test_validate_surface_rejects_a_template_path_that_is_not_a_list():
    payload = _templated_surface()
    payload[2]["updateDataModel"]["value"] = {"pulls": "not-a-list"}
    with pytest.raises(ValueError, match="does not resolve to a list"):
        validate_surface(payload)
