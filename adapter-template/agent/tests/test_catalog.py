from deterministic_agent.catalog import (
    catalog_json_path,
    get_catalog,
    supported_catalog_ids,
)


def test_catalog_path_points_at_sibling_package():
    path = catalog_json_path()
    assert path.is_file()
    assert path.parts[-3:] == ("catalogs", "{{version}}", "catalog.json")


def test_catalog_id_is_a_hosted_url():
    cid = get_catalog().catalog_id
    assert cid.startswith("https://github.com/")
    assert cid.endswith("catalogs/{{version}}/catalog.json")
    assert supported_catalog_ids() == [cid]
