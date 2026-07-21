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
