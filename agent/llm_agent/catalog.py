"""Live-agent catalog access: examples-wired schema manager + strict surface validation."""

from __future__ import annotations

import copy
import functools
from pathlib import Path

from a2ui.schema.catalog import A2uiCatalog
from a2ui.schema.manager import A2uiSchemaManager
from a2ui.schema.validator import analyze_topology, extract_component_ref_fields

from catalog_common import build_schema_manager

# agent/knowledge/examples — the 7.1 curated idiom examples, registered as the
# catalog's examples path so generate_system_prompt(include_examples=True) finds them.
EXAMPLES_DIR = Path(__file__).resolve().parents[1] / "knowledge" / "examples"


@functools.lru_cache(maxsize=1)
def live_schema_manager() -> A2uiSchemaManager:
    return build_schema_manager(examples_path=str(EXAMPLES_DIR))


def live_catalog() -> A2uiCatalog:
    return live_schema_manager().get_selected_catalog()


def _strip_framework_ids(messages: list[dict]) -> list[dict]:
    """Returns a deep copy with the framework-owned `id` envelope stripped.

    The Primer catalog component schemas do not model `id` (it is the framework's
    component envelope), so component-schema conformance must run on id-stripped
    components. Topology, in contrast, keys on `id` and runs on the id-retained tree.
    """
    probe = copy.deepcopy(messages)
    for message in probe:
        update = message.get("updateComponents") if isinstance(message, dict) else None
        if isinstance(update, dict):
            for component in update.get("components", []):
                if isinstance(component, dict):
                    component.pop("id", None)
    return probe


def validate_surface(payload: list[dict] | dict) -> None:
    """Validates a *complete* A2UI surface against the Primer catalog, on the live
    agent's own terms.

    Two passes, because the catalog does not model the framework-owned `id` field:

    1. Component conformance — id-stripped, non-strict: every component matches its
       catalog schema (no undeclared properties, known component types, correct types).
    2. Completeness/topology — on the id-retained tree: the payload declares a
       createSurface, contains a component with id='root', and every component is
       reachable from the root (no dangling references, no orphans).

    This is stronger than the deterministic agent's non-strict partial-update probe,
    which deliberately skips the root/orphan checks (its root lives in a client fixture).
    Raises ValueError on any conformance, completeness, or topology failure.
    """
    messages = payload if isinstance(payload, list) else [payload]
    catalog = live_catalog()

    # Pass 1: component-schema conformance.
    catalog.validator.validate(_strip_framework_ids(messages), strict_integrity=False)

    # Pass 2: completeness + topology on the id-retained tree.
    has_create = any(
        isinstance(m, dict) and "createSurface" in m for m in messages
    )
    if not has_create:
        raise ValueError("incomplete surface: no createSurface message")

    components: list[dict] = []
    for message in messages:
        update = message.get("updateComponents") if isinstance(message, dict) else None
        if isinstance(update, dict):
            components.extend(
                c for c in update.get("components", []) if isinstance(c, dict)
            )
    if not components:
        raise ValueError("incomplete surface: no components in updateComponents")

    ids = {c.get("id") for c in components}
    if "root" not in ids:
        raise ValueError("incomplete surface: no component with id='root'")

    ref_map = extract_component_ref_fields(catalog)
    analyze_topology("root", components, ref_map, raise_on_orphans=True)
