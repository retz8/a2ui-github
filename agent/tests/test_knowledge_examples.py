"""Conformance gate for the curated GitHub-domain idiom examples in `agent/knowledge/`.

Each example file is a named-field envelope `{name, intent, messages}` whose `messages`
is a complete A2UI message sequence in the exact wire format the live agent must emit.
This test globs the example files and validates every component entry in each sequence
against the shipped Primer catalog, reusing the deterministic agent's `validate_payload`
(the same probe the emitted-event conformance test uses). It is the phase spec's L0
"examples validated against the catalog schema" check, delivered early (task 7.1).
"""

from __future__ import annotations

import json
from pathlib import Path

import pytest

from deterministic_agent.catalog import validate_payload

_EXAMPLES_DIR = Path(__file__).resolve().parents[1] / "knowledge" / "examples"
_EXAMPLE_FILES = sorted(_EXAMPLES_DIR.glob("*.json"))

# Decisions 5, 6, 8 fix the set at exactly four curated examples; guard the count so a
# dropped or stray file fails loudly rather than silently shrinking the corpus.
_EXPECTED_COUNT = 4


def test_expected_example_count():
    assert len(_EXAMPLE_FILES) == _EXPECTED_COUNT, (
        f"expected {_EXPECTED_COUNT} example files in {_EXAMPLES_DIR}, "
        f"found {[p.name for p in _EXAMPLE_FILES]}"
    )


@pytest.mark.parametrize("path", _EXAMPLE_FILES, ids=lambda p: p.stem)
def test_example_envelope_shape(path: Path):
    example = json.loads(path.read_text(encoding="utf-8"))
    assert set(example) >= {"name", "intent", "messages"}, (
        f"{path.name}: envelope must carry name, intent, messages"
    )
    assert isinstance(example["name"], str) and example["name"], f"{path.name}: name must be non-empty"
    assert isinstance(example["intent"], str) and example["intent"], f"{path.name}: intent must be non-empty"
    assert isinstance(example["messages"], list) and example["messages"], (
        f"{path.name}: messages must be a non-empty list"
    )


@pytest.mark.parametrize("path", _EXAMPLE_FILES, ids=lambda p: p.stem)
def test_example_messages_conform_to_catalog(path: Path):
    example = json.loads(path.read_text(encoding="utf-8"))
    # `validate_payload` strips the framework-owned `id` envelope field and validates each
    # component against the catalog with strict_integrity=False. The examples are complete
    # surfaces (createSurface + a root component), but the catalog component schema does not
    # model `id`; stripping it to satisfy the schema removes the very field the root/orphan
    # topology check keys on, so strict_integrity would then report a spurious missing root.
    # Non-strict validation is therefore the only self-consistent mode here — it is exactly
    # what the deterministic agent's own emitted-payload conformance test relies on.
    validate_payload(example["messages"])  # must not raise
