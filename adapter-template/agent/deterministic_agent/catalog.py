"""Locates the sibling {{adapterPkg}} catalog.json and validates A2UI against it."""

from __future__ import annotations

import copy
import functools
from pathlib import Path

from a2ui.schema.catalog import A2uiCatalog, CatalogConfig
from a2ui.schema.constants import VERSION_0_9
from a2ui.schema.manager import A2uiSchemaManager

_CATALOG_RELPATH = ("{{adapterPkg}}", "catalogs", "{{version}}", "catalog.json")


def _repo_root() -> Path:
    # catalog.py -> deterministic_agent -> agent -> <repo root>
    root = Path(__file__).resolve().parents[2]
    assert (root / "{{adapterPkg}}").is_dir(), (
        f"expected the monorepo root containing {{adapterPkg}} at {root}"
    )
    return root


def catalog_json_path() -> Path:
    path = _repo_root().joinpath(*_CATALOG_RELPATH)
    assert path.is_file(), f"catalog.json not found at {path}"
    return path


@functools.lru_cache(maxsize=1)
def _schema_manager() -> A2uiSchemaManager:
    return A2uiSchemaManager(
        version=VERSION_0_9,
        catalogs=[CatalogConfig.from_path("adapter", str(catalog_json_path()))],
    )


def get_catalog() -> A2uiCatalog:
    return _schema_manager().get_selected_catalog()


def supported_catalog_ids() -> list[str]:
    return [get_catalog().catalog_id]


def validate_payload(payload: list[dict]) -> None:
    """Raises if the payload's components do not conform to the adapter catalog.

    `id` is the framework-owned component envelope field (not modeled by the
    catalog, like the JS parity test's excluded ['component', 'id']); it is
    stripped before validation. strict_integrity=False skips root/orphan
    topology checks, since the surface root lives in the client fixture, not
    the server's partial update.
    """
    probe = copy.deepcopy(payload)
    for message in probe:
        update = message.get("updateComponents")
        if isinstance(update, dict):
            for component in update.get("components", []):
                component.pop("id", None)
    get_catalog().validator.validate(probe, strict_integrity=False)
