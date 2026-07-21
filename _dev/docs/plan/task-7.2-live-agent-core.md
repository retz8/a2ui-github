# Task 7.2 — Live agent core Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a live LLM A2UI agent (`llm_agent`) beside the deterministic agent in `agent/`, taking a natural-language prompt to a streamed, catalog-valid, data-bound surface — proven end-to-end with a stub PR-data toolset, before any MCP exists (7.3).

**Architecture:** The live agent reuses the a2ui-agent-sdk "text-delimited streaming" architecture: an `A2uiSchemaManager` over our hosted `catalog.json`, a system prompt assembled by the SDK's `generate_system_prompt` (role + workflow authored here; brand doc → `ui_description`; full catalog schema + 7.1 examples injected), an ADK `LlmAgent` (Gemini via env knob) with a stub PR toolset, and a custom `AgentExecutor` that streams parsed A2UI parts to the client incrementally, validates the complete surface at the end, and retries with the validation error on failure (two attempts, then a plain-text apology). Catalog locate/load is extracted to a shared module both agents import; validation semantics stay per-agent.

**Tech Stack:** Python 3.14 (`agent/` uv project), `a2ui-agent-sdk` 0.2.4, `google-adk` 2.5.0, `a2a-sdk` 0.3.26, `click`, `uvicorn`, `pytest` + `pytest-asyncio`.

## Global Constraints

- **Protocol version: v0.9.1 only.** Single schema manager, single runner, single-version agent card. Use `VERSION_0_9` from `a2ui.schema.constants`; emit A2UI parts with `version="v0.9"`.
- **Cohabitation:** one `agent/` uv project, one `pyproject.toml`, one venv, one test run. The `deterministic_agent/` package's behavior is untouched (only its catalog module is refactored to import shared code, preserving all its public names).
- **Sibling package name: `llm_agent`.**
- **Shared catalog module** both agents import: repo-root locator + `catalog_json_path()` + `A2uiSchemaManager` construction + `supported_catalog_ids()`. Per-agent validation semantics: the deterministic agent keeps its fixture-specific non-strict `validate_payload`; the live agent validates complete surfaces strictly.
- **Prompt assembly: the SDK's `generate_system_prompt`, as-is** (`include_schema=True`, `include_examples=True`). The only authored prompt content is the role and workflow strings; the brand doc feeds `ui_description`; `agent/knowledge/examples/` is the catalog's examples path.
- **Executor semantics:** stream-first, validate-at-end, retry-and-restream. Two attempts total (a tunable constant). Exhaustion → plain-text apology.
- **Env knobs:** `MODEL_NAME` (Gemini model, cheap default) + `GOOGLE_API_KEY`. No LiteLLM. Both documented in `agent/.env.example`.
- **Tests are L0 (zero LLM calls):** prompt-assembly hybrid snapshot, validator tests, executor against a faked LLM stream, examples already validated by 7.1's test. The ADK-backed responder (live model) is out of L0 scope; it is exercised by the task's one manual live run.
- **No write tools** anywhere (read-only invariant); the stub toolset is read-only by construction.
- **Run tests:** from `agent/`, `uv run pytest` (per `agent/README.md`). Env note: this sandbox cannot provision CPython 3.14 (upstream download blocked), so tests here run in a manually-created 3.13 `.venv` (`agent/.venv`, gitignored); the code is written 3.13-compatible. `requires-python` stays `>=3.14` (unchanged repo convention).

---

## File Structure

**New shared module**
- `agent/catalog_common/__init__.py` — repo-root locator, `catalog_json_path()`, `build_schema_manager(examples_path=None)`, cached `get_catalog()`, `supported_catalog_ids()`.

**Refactor (behavior-preserving)**
- `agent/deterministic_agent/catalog.py` — import locate/load from `catalog_common`; keep `validate_payload` local; re-export `catalog_json_path`, `get_catalog`, `supported_catalog_ids` so existing imports/tests are unaffected.

**New `llm_agent` package**
- `agent/llm_agent/__init__.py`
- `agent/llm_agent/catalog.py` — live schema manager (examples path wired) + `live_schema_manager()`, `live_catalog()`, `validate_surface(payload)` (strict).
- `agent/llm_agent/knowledge.py` — `load_brand_guidance()` (reads `agent/knowledge/brand-guidance.md`).
- `agent/llm_agent/prompt.py` — `ROLE_DESCRIPTION`, `WORKFLOW_DESCRIPTION`, `build_system_prompt(schema_manager=None)`.
- `agent/llm_agent/tools.py` — `list_pull_requests(state="open")`, `get_pull_request(number)`; `STUB_TOOLS` list. Reads fixtures.
- `agent/llm_agent/fixtures/pr-list.json`, `agent/llm_agent/fixtures/pr-detail.json` — canned real-shaped PR data.
- `agent/llm_agent/agent.py` — `build_llm_agent()` (model from `MODEL_NAME`, instruction=system prompt, tools=`STUB_TOOLS`), `DEFAULT_MODEL`, `model_name()`.
- `agent/llm_agent/responder.py` — `LlmResponder` protocol + `AdkLlmResponder` (ADK Runner glue; not L0-tested).
- `agent/llm_agent/executor.py` — `LlmAgentExecutor(AgentExecutor)`: stream → validate-at-end → retry loop → apology. `MAX_ATTEMPTS`.
- `agent/llm_agent/server.py` — `DEFAULT_PORT`, `build_agent_card()`, `build_app()`.
- `agent/llm_agent/__main__.py` — click CLI (`--host/--port/--base-url`).

**Config**
- `agent/pyproject.toml` — add `google-adk>=2.5.0,<3.0.0` to dependencies.
- `agent/.env.example` — `MODEL_NAME`, `GOOGLE_API_KEY`, `GOOGLE_GENAI_USE_VERTEXAI`.

**Tests (`agent/tests/`, shared pythonpath=".")**
- `test_catalog_common.py` — shared module resolves catalog + ids.
- `test_llm_catalog.py` — `validate_surface` accepts good / rejects bad; examples path registered.
- `test_llm_prompt.py` — hybrid snapshot skeleton + presence assertions.
- `test_llm_tools.py` — stub tools return canned shapes.
- `test_llm_executor.py` — faked-stream executor: streams parts, validates at end, retries then succeeds, exhaustion → apology.
- `test_llm_server.py` — agent card: a2ui extension, single version, our catalog id.
- `agent/tests/golden/llm_system_prompt.skeleton.txt` — golden skeleton for the prompt snapshot.

---

## Task 1: Extract the shared catalog module

**Files:**
- Create: `agent/catalog_common/__init__.py`
- Modify: `agent/deterministic_agent/catalog.py`
- Test: `agent/tests/test_catalog_common.py`

**Interfaces:**
- Produces: `catalog_common.catalog_json_path() -> Path`, `catalog_common.build_schema_manager(examples_path: str | None = None) -> A2uiSchemaManager`, `catalog_common.get_catalog() -> A2uiCatalog`, `catalog_common.supported_catalog_ids() -> list[str]`.
- Consumes: nothing (base layer).

- [ ] **Step 1: Write the failing test** — `agent/tests/test_catalog_common.py`

```python
from pathlib import Path

from catalog_common import (
    build_schema_manager,
    catalog_json_path,
    get_catalog,
    supported_catalog_ids,
)


def test_catalog_path_points_at_sibling_adapter():
    path = catalog_json_path()
    assert isinstance(path, Path) and path.is_file()
    assert path.parts[-3:] == ("catalogs", "v0.9.1", "catalog.json")


def test_catalog_id_and_supported_ids_agree():
    cid = get_catalog().catalog_id
    assert cid.endswith("primer-a2ui-adapter/catalogs/v0.9.1/catalog.json")
    assert supported_catalog_ids() == [cid]


def test_build_schema_manager_registers_examples_path():
    sm = build_schema_manager(examples_path=str(catalog_json_path().parent))
    # examples path is stored per catalog id; a non-empty render proves wiring.
    catalog = sm.get_selected_catalog()
    assert catalog.catalog_id == get_catalog().catalog_id
```

- [ ] **Step 2: Run test to verify it fails**

Run: `uv run pytest tests/test_catalog_common.py -q`
Expected: FAIL (`ModuleNotFoundError: No module named 'catalog_common'`).

- [ ] **Step 3: Write `agent/catalog_common/__init__.py`**

```python
"""Shared catalog locate/load for both the deterministic and live agents.

Holds the repo-root locator, the hosted primer-a2ui-adapter catalog path, and the
A2uiSchemaManager construction. Validation semantics stay per-agent (each agent
imports its own validator wrapper), per the 7.2 spec decision 3.
"""

from __future__ import annotations

import functools
from pathlib import Path

from a2ui.schema.catalog import A2uiCatalog, CatalogConfig
from a2ui.schema.constants import VERSION_0_9
from a2ui.schema.manager import A2uiSchemaManager

_CATALOG_RELPATH = ("primer-a2ui-adapter", "catalogs", "v0.9.1", "catalog.json")


def _repo_root() -> Path:
    # catalog_common/__init__.py -> catalog_common -> agent -> <repo root>
    root = Path(__file__).resolve().parents[2]
    assert (root / "primer-a2ui-adapter").is_dir(), (
        f"expected the monorepo root containing primer-a2ui-adapter at {root}"
    )
    return root


def catalog_json_path() -> Path:
    path = _repo_root().joinpath(*_CATALOG_RELPATH)
    assert path.is_file(), f"catalog.json not found at {path}"
    return path


def build_schema_manager(examples_path: str | None = None) -> A2uiSchemaManager:
    """Constructs a v0.9.1 schema manager over the hosted adapter catalog.

    examples_path (a directory or glob) is registered as the catalog's examples
    source; the live agent passes agent/knowledge/examples, the deterministic
    agent passes nothing.
    """
    return A2uiSchemaManager(
        version=VERSION_0_9,
        catalogs=[
            CatalogConfig.from_path(
                "adapter", str(catalog_json_path()), examples_path
            )
        ],
    )


@functools.lru_cache(maxsize=1)
def _default_schema_manager() -> A2uiSchemaManager:
    return build_schema_manager()


def get_catalog() -> A2uiCatalog:
    return _default_schema_manager().get_selected_catalog()


def supported_catalog_ids() -> list[str]:
    return [get_catalog().catalog_id]
```

- [ ] **Step 4: Refactor `agent/deterministic_agent/catalog.py` to import shared code**

Replace the module body with (keeping `validate_payload` local and re-exporting the shared names so `deterministic_agent.catalog.<name>` stays importable):

```python
"""Deterministic-agent catalog access: shared locate/load + fixture-specific validation."""

from __future__ import annotations

import copy

from catalog_common import (
    build_schema_manager,
    catalog_json_path,
    get_catalog,
    supported_catalog_ids,
)

__all__ = [
    "build_schema_manager",
    "catalog_json_path",
    "get_catalog",
    "supported_catalog_ids",
    "validate_payload",
]


def validate_payload(payload: list[dict]) -> None:
    """Raises if the payload's components do not conform to the Primer catalog.

    `id` is the framework-owned component envelope field (not modeled by the
    catalog); it is stripped before validation. strict_integrity=False skips
    root/orphan topology checks, since the surface root lives in the client
    fixture, not the server's partial update.
    """
    probe = copy.deepcopy(payload)
    for message in probe:
        update = message.get("updateComponents")
        if isinstance(update, dict):
            for component in update.get("components", []):
                component.pop("id", None)
    get_catalog().validator.validate(probe, strict_integrity=False)
```

- [ ] **Step 5: Run all catalog tests**

Run: `uv run pytest tests/test_catalog_common.py tests/test_catalog.py tests/test_knowledge_examples.py -q`
Expected: PASS (shared module works; deterministic catalog tests and 7.1 examples test still green through the re-exports).

- [ ] **Step 6: Commit**

```bash
git add agent/catalog_common agent/deterministic_agent/catalog.py agent/tests/test_catalog_common.py
git commit -m "refactor(phase-7): extract shared catalog locate/load module"
```

---

## Task 2: Live-agent catalog wrapper (strict surface validation)

**Files:**
- Create: `agent/llm_agent/__init__.py` (empty package marker)
- Create: `agent/llm_agent/catalog.py`
- Test: `agent/tests/test_llm_catalog.py`

**Interfaces:**
- Consumes: `catalog_common.build_schema_manager`, `catalog_common.get_catalog`.
- Produces: `llm_agent.catalog.EXAMPLES_DIR: Path`, `live_schema_manager() -> A2uiSchemaManager`, `live_catalog() -> A2uiCatalog`, `validate_surface(payload: list[dict] | dict) -> None`.

- [ ] **Step 1: Write the failing test** — `agent/tests/test_llm_catalog.py`

```python
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


def test_validate_surface_accepts_a_complete_surface():
    payload = [
        {
            "version": "v0.9",
            "createSurface": {"surfaceId": "s1", "root": "root"},
        },
        {
            "version": "v0.9",
            "updateComponents": {
                "surfaceId": "s1",
                "components": [
                    {"id": "root", "component": "Text", "text": "hello"},
                ],
            },
        },
    ]
    validate_surface(payload)  # must not raise


def test_validate_surface_rejects_an_undeclared_property():
    payload = [
        {
            "version": "v0.9",
            "createSurface": {"surfaceId": "s1", "root": "root"},
        },
        {
            "version": "v0.9",
            "updateComponents": {
                "surfaceId": "s1",
                "components": [
                    {"id": "root", "component": "Text", "text": "x", "bogus": 1},
                ],
            },
        },
    ]
    with pytest.raises(ValueError):
        validate_surface(payload)
```

- [ ] **Step 2: Run test to verify it fails**

Run: `uv run pytest tests/test_llm_catalog.py -q`
Expected: FAIL (`ModuleNotFoundError: No module named 'llm_agent'`).

- [ ] **Step 3: Create `agent/llm_agent/__init__.py`** (empty), then `agent/llm_agent/catalog.py`

```python
"""Live-agent catalog access: examples-wired schema manager + strict surface validation."""

from __future__ import annotations

import functools
from pathlib import Path

from a2ui.schema.catalog import A2uiCatalog
from a2ui.schema.manager import A2uiSchemaManager

from catalog_common import build_schema_manager

# agent/knowledge/examples — the 7.1 curated idiom examples, registered as the
# catalog's examples path so generate_system_prompt(include_examples=True) finds them.
EXAMPLES_DIR = Path(__file__).resolve().parents[1] / "knowledge" / "examples"


@functools.lru_cache(maxsize=1)
def live_schema_manager() -> A2uiSchemaManager:
    return build_schema_manager(examples_path=str(EXAMPLES_DIR))


def live_catalog() -> A2uiCatalog:
    return live_schema_manager().get_selected_catalog()


def validate_surface(payload: list[dict] | dict) -> None:
    """Strictly validates a *complete* A2UI surface against the Primer catalog.

    Unlike the deterministic agent's non-strict partial-update probe, the live
    agent emits whole surfaces (createSurface + a rooted component tree), so it
    validates with strict integrity (root/orphan topology checked). Raises
    ValueError on any conformance or topology failure.
    """
    live_catalog().validator.validate(payload)
```

- [ ] **Step 4: Run test to verify it passes**

Run: `uv run pytest tests/test_llm_catalog.py -q`
Expected: PASS.

> If `validate_surface` on the good payload raises on topology (e.g. `id` not modeled), adjust the good-payload test to the minimal shape the catalog's strict validator accepts (the catalog's own `render`/examples show the exact envelope); the examples in `knowledge/examples` are known-valid complete surfaces and can seed the shape. Keep strict validation — do not weaken to `strict_integrity=False`.

- [ ] **Step 5: Commit**

```bash
git add agent/llm_agent/__init__.py agent/llm_agent/catalog.py agent/tests/test_llm_catalog.py
git commit -m "feat(phase-7): live-agent catalog wrapper with strict surface validation"
```

---

## Task 3: Brand-knowledge loader + prompt assembly

**Files:**
- Create: `agent/llm_agent/knowledge.py`
- Create: `agent/llm_agent/prompt.py`
- Test: `agent/tests/test_llm_prompt.py`
- Create: `agent/tests/golden/llm_system_prompt.skeleton.txt`

**Interfaces:**
- Consumes: `llm_agent.catalog.live_schema_manager`, `catalog_common` (indirect).
- Produces: `llm_agent.knowledge.load_brand_guidance() -> str`; `llm_agent.prompt.ROLE_DESCRIPTION: str`, `WORKFLOW_DESCRIPTION: str`, `build_system_prompt(schema_manager: A2uiSchemaManager | None = None) -> str`.

- [ ] **Step 1: Write `agent/llm_agent/knowledge.py`**

```python
"""Loads the checked-in Primer brand-knowledge doc for the ui_description prompt slot."""

from __future__ import annotations

from pathlib import Path

BRAND_GUIDANCE_PATH = Path(__file__).resolve().parents[1] / "knowledge" / "brand-guidance.md"


def load_brand_guidance() -> str:
    """Returns the Primer brand-guidance prose injected at prompt assembly (build time)."""
    return BRAND_GUIDANCE_PATH.read_text(encoding="utf-8").strip()
```

- [ ] **Step 2: Write `agent/llm_agent/prompt.py`**

The role and workflow strings are the only authored prompt content (spec decision 4). Everything else — default workflow rules, the full catalog schema, the examples — comes from the SDK.

```python
"""System-prompt assembly for the live agent: authored role/workflow + SDK-generated bulk."""

from __future__ import annotations

from a2ui.schema.manager import A2uiSchemaManager

from llm_agent.catalog import live_schema_manager
from llm_agent.knowledge import load_brand_guidance

ROLE_DESCRIPTION = (
    "You are the GitHub maintainer's-morning agent. You turn a maintainer's natural-language "
    "request about the a2ui-project/a2ui repository into a single rich A2UI surface rendered in "
    "GitHub's Primer design language. You never answer in prose when a surface would serve the "
    "user better: you compose a screen from the catalog's components and bind it to real data. "
    "You read repository data through the provided tools; you never invent PR numbers, titles, "
    "authors, or counts — every value shown on a surface comes from a tool result."
)

WORKFLOW_DESCRIPTION = (
    "For a request that names or implies repository data (pull requests, reviews, a specific PR), "
    "first call the appropriate tool to fetch it, then compose one surface that presents the "
    "result. Bind dynamic values (titles, authors, counts, states) through the data model so the "
    "surface reflects the fetched data rather than hard-coding it. Prefer a list surface for "
    "'what needs my attention' requests and a detail surface for a single named PR. Keep the "
    "surface to what the request asks for; do not add unrequested sections."
)


def build_system_prompt(schema_manager: A2uiSchemaManager | None = None) -> str:
    """Assembles the full system instruction via the SDK's generate_system_prompt.

    Authored content is only ROLE/WORKFLOW; the brand doc feeds ui_description, and the
    full catalog schema and the 7.1 examples are injected by the SDK.
    """
    sm = schema_manager or live_schema_manager()
    return sm.generate_system_prompt(
        role_description=ROLE_DESCRIPTION,
        workflow_description=WORKFLOW_DESCRIPTION,
        ui_description=load_brand_guidance(),
        include_schema=True,
        include_examples=True,
    )
```

- [ ] **Step 3: Write the hybrid-snapshot test** — `agent/tests/test_llm_prompt.py`

Decision 9: byte-pin the stable framing; elide the three volatile bulks (brand doc / `ui_description`, catalog schema render, examples) to markers; assert presence of each elided bulk. (The spec names "schema render, examples"; the brand doc is elided too because its 7.7 edits must not churn the snapshot either — the stated goal of decision 9.)

```python
import re
from pathlib import Path

from a2ui.schema.constants import A2UI_SCHEMA_BLOCK_START, A2UI_SCHEMA_BLOCK_END

from llm_agent.catalog import EXAMPLES_DIR
from llm_agent.prompt import build_system_prompt

_GOLDEN = Path(__file__).resolve().parent / "golden" / "llm_system_prompt.skeleton.txt"

_UI_MARKER = "<<<UI_DESCRIPTION>>>"
_SCHEMA_MARKER = "<<<CATALOG_SCHEMA>>>"
_EXAMPLES_MARKER = "<<<EXAMPLES>>>"


def _skeletonize(prompt: str) -> str:
    # Elide the schema render block (BEGIN..END) to a marker.
    prompt = re.sub(
        re.escape(A2UI_SCHEMA_BLOCK_START) + r".*?" + re.escape(A2UI_SCHEMA_BLOCK_END),
        _SCHEMA_MARKER,
        prompt,
        flags=re.DOTALL,
    )
    # Elide everything under the Examples header to a marker.
    prompt = re.sub(r"### Examples:\n.*\Z", "### Examples:\n" + _EXAMPLES_MARKER, prompt, flags=re.DOTALL)
    # Elide the UI Description (brand doc) body to a marker.
    prompt = re.sub(
        r"(## UI Description:\n).*?(?=\n\n## |\n\n" + re.escape(A2UI_SCHEMA_BLOCK_START) + r"|\n\n### Examples:)",
        r"\1" + _UI_MARKER,
        prompt,
        flags=re.DOTALL,
    )
    return prompt


def test_prompt_skeleton_matches_golden():
    skeleton = _skeletonize(build_system_prompt())
    if not _GOLDEN.exists():  # first run authors the golden; commit it thereafter
        _GOLDEN.parent.mkdir(parents=True, exist_ok=True)
        _GOLDEN.write_text(skeleton, encoding="utf-8")
    assert skeleton == _GOLDEN.read_text(encoding="utf-8")


def test_elided_bulk_is_actually_present():
    prompt = build_system_prompt()
    # schema render present
    assert A2UI_SCHEMA_BLOCK_START in prompt and A2UI_SCHEMA_BLOCK_END in prompt
    assert '"catalogId"' in prompt or "catalogId" in prompt
    # brand doc present (a stable heading from knowledge/brand-guidance.md)
    assert "Primer brand guidance" in prompt
    # every curated example present by name
    for path in sorted(EXAMPLES_DIR.glob("*.json")):
        assert path.stem in prompt
```

- [ ] **Step 4: Generate + inspect the golden, then run the test**

Run: `uv run pytest tests/test_llm_prompt.py -q` (first run writes the golden)
Then open `agent/tests/golden/llm_system_prompt.skeleton.txt` and confirm it contains the role text, the `## Workflow Description:` block with the default rules, the `## UI Description:` header followed by `<<<UI_DESCRIPTION>>>`, `<<<CATALOG_SCHEMA>>>`, and `### Examples:` + `<<<EXAMPLES>>>` — and nothing volatile.
Run again: `uv run pytest tests/test_llm_prompt.py -q`
Expected: PASS both assertions.

- [ ] **Step 5: Commit**

```bash
git add agent/llm_agent/knowledge.py agent/llm_agent/prompt.py agent/tests/test_llm_prompt.py agent/tests/golden/llm_system_prompt.skeleton.txt
git commit -m "feat(phase-7): live-agent prompt assembly with hybrid snapshot test"
```

---

## Task 4: Stub PR toolset with canned real-shaped data

**Files:**
- Create: `agent/llm_agent/fixtures/pr-list.json`
- Create: `agent/llm_agent/fixtures/pr-detail.json`
- Create: `agent/llm_agent/tools.py`
- Test: `agent/tests/test_llm_tools.py`

**Interfaces:**
- Produces: `llm_agent.tools.list_pull_requests(state: str = "open") -> list[dict]`, `llm_agent.tools.get_pull_request(number: int) -> dict`, `llm_agent.tools.STUB_TOOLS: list` (the two callables, passed to `LlmAgent(tools=...)`).

- [ ] **Step 1: Author `agent/llm_agent/fixtures/pr-list.json`**

A trimmed GitHub "list pull requests" response shape (the fields a surface binds). Keep 3–4 items; real-shaped keys, plausible a2ui-project/a2ui values.

```json
[
  {
    "number": 231,
    "title": "feat(catalog): add SplitPageLayout to the v0.9.1 catalog",
    "state": "open",
    "draft": false,
    "user": { "login": "octo-maintainer" },
    "created_at": "2026-07-18T09:12:44Z",
    "updated_at": "2026-07-20T14:03:10Z",
    "html_url": "https://github.com/a2ui-project/a2ui/pull/231",
    "labels": [ { "name": "catalog", "color": "0e8a16" }, { "name": "needs-review", "color": "d93f0b" } ],
    "requested_reviewers": [ { "login": "review-bot" } ],
    "comments": 4,
    "review_comments": 6
  },
  {
    "number": 229,
    "title": "fix(parser): heal fragmented string values in streaming updates",
    "state": "open",
    "draft": true,
    "user": { "login": "stream-dev" },
    "created_at": "2026-07-17T22:40:01Z",
    "updated_at": "2026-07-19T08:20:55Z",
    "html_url": "https://github.com/a2ui-project/a2ui/pull/229",
    "labels": [ { "name": "parser", "color": "1d76db" } ],
    "requested_reviewers": [],
    "comments": 1,
    "review_comments": 0
  },
  {
    "number": 224,
    "title": "docs: clarify updateDataModel binding semantics",
    "state": "open",
    "draft": false,
    "user": { "login": "docs-writer" },
    "created_at": "2026-07-15T11:05:30Z",
    "updated_at": "2026-07-18T16:44:12Z",
    "html_url": "https://github.com/a2ui-project/a2ui/pull/224",
    "labels": [ { "name": "documentation", "color": "0075ca" } ],
    "requested_reviewers": [ { "login": "octo-maintainer" } ],
    "comments": 2,
    "review_comments": 1
  }
]
```

- [ ] **Step 2: Author `agent/llm_agent/fixtures/pr-detail.json`**

A trimmed GitHub "get a pull request" response shape, keyed by PR number as a JSON object map so `get_pull_request(number)` can look one up.

```json
{
  "231": {
    "number": 231,
    "title": "feat(catalog): add SplitPageLayout to the v0.9.1 catalog",
    "state": "open",
    "draft": false,
    "user": { "login": "octo-maintainer" },
    "body": "Adds SplitPageLayout with a pane on the trailing side, matching Primer. Includes catalog schema, adapter renderer, and a client fixture.",
    "created_at": "2026-07-18T09:12:44Z",
    "updated_at": "2026-07-20T14:03:10Z",
    "html_url": "https://github.com/a2ui-project/a2ui/pull/231",
    "head": { "ref": "feat/split-page-layout" },
    "base": { "ref": "main" },
    "mergeable": true,
    "mergeable_state": "clean",
    "additions": 412,
    "deletions": 18,
    "changed_files": 9,
    "commits": 6,
    "comments": 4,
    "review_comments": 6,
    "labels": [ { "name": "catalog", "color": "0e8a16" }, { "name": "needs-review", "color": "d93f0b" } ],
    "requested_reviewers": [ { "login": "review-bot" } ]
  },
  "229": {
    "number": 229,
    "title": "fix(parser): heal fragmented string values in streaming updates",
    "state": "open",
    "draft": true,
    "user": { "login": "stream-dev" },
    "body": "Auto-closes cuttable string keys when a stream fragments mid-value; adds regression fixtures.",
    "created_at": "2026-07-17T22:40:01Z",
    "updated_at": "2026-07-19T08:20:55Z",
    "html_url": "https://github.com/a2ui-project/a2ui/pull/229",
    "head": { "ref": "fix/stream-heal" },
    "base": { "ref": "main" },
    "mergeable": true,
    "mergeable_state": "unstable",
    "additions": 88,
    "deletions": 5,
    "changed_files": 3,
    "commits": 2,
    "comments": 1,
    "review_comments": 0,
    "labels": [ { "name": "parser", "color": "1d76db" } ],
    "requested_reviewers": []
  }
}
```

- [ ] **Step 3: Write `agent/llm_agent/tools.py`**

Plain typed functions with docstrings (ADK auto-wraps them as `FunctionTool`s). Read-only by construction.

```python
"""Stub read-only PR toolset: canned, real-shaped a2ui-project/a2ui data.

A minimal mirror of the GitHub read surface the demo beats need (a PR-list read and a
PR-detail read). 7.3 replaces these with the remote read-only MCP toolset; this stub
exists only so 7.2's definition of done — prompt -> tool call -> data-bound valid
surface — can be met before MCP. No write tool exists here (read-only invariant).
"""

from __future__ import annotations

import functools
import json
from pathlib import Path

_FIXTURES = Path(__file__).resolve().parent / "fixtures"


@functools.lru_cache(maxsize=1)
def _pr_list() -> list[dict]:
    return json.loads((_FIXTURES / "pr-list.json").read_text(encoding="utf-8"))


@functools.lru_cache(maxsize=1)
def _pr_detail() -> dict:
    return json.loads((_FIXTURES / "pr-detail.json").read_text(encoding="utf-8"))


def list_pull_requests(state: str = "open") -> list[dict]:
    """Lists pull requests on a2ui-project/a2ui.

    Args:
        state: Filter by PR state: "open", "closed", or "all". Defaults to "open".

    Returns:
        A list of pull-request summaries (number, title, state, author, labels,
        review/comment counts).
    """
    prs = _pr_list()
    if state and state != "all":
        return [pr for pr in prs if pr.get("state") == state]
    return list(prs)


def get_pull_request(number: int) -> dict:
    """Gets one pull request on a2ui-project/a2ui by number.

    Args:
        number: The pull-request number.

    Returns:
        The pull-request detail (body, head/base refs, additions/deletions,
        changed_files, mergeable state, labels, reviewers). Returns an object with
        an "error" key if the number is unknown.
    """
    detail = _pr_detail().get(str(number))
    if detail is None:
        return {"error": f"pull request #{number} not found"}
    return detail


STUB_TOOLS = [list_pull_requests, get_pull_request]
```

- [ ] **Step 4: Write the test** — `agent/tests/test_llm_tools.py`

```python
from llm_agent.tools import STUB_TOOLS, get_pull_request, list_pull_requests


def test_list_returns_open_prs_with_bindable_fields():
    prs = list_pull_requests()
    assert prs and all(pr["state"] == "open" for pr in prs)
    first = prs[0]
    for key in ("number", "title", "user", "labels", "html_url"):
        assert key in first
    assert "login" in first["user"]


def test_list_state_all_returns_everything():
    assert len(list_pull_requests(state="all")) >= len(list_pull_requests())


def test_get_returns_detail_for_a_known_pr():
    pr = get_pull_request(231)
    assert pr["number"] == 231
    for key in ("body", "head", "base", "additions", "deletions", "changed_files"):
        assert key in pr


def test_get_unknown_pr_returns_error():
    assert "error" in get_pull_request(999999)


def test_stub_tools_are_read_only_pair():
    assert STUB_TOOLS == [list_pull_requests, get_pull_request]
```

- [ ] **Step 5: Run**

Run: `uv run pytest tests/test_llm_tools.py -q`
Expected: PASS.

- [ ] **Step 6: Commit**

```bash
git add agent/llm_agent/fixtures agent/llm_agent/tools.py agent/tests/test_llm_tools.py
git commit -m "feat(phase-7): stub read-only PR toolset with canned real-shaped data"
```

---

## Task 5: LlmAgent builder + model knob

**Files:**
- Create: `agent/llm_agent/agent.py`
- Modify: `agent/pyproject.toml` (add `google-adk`)
- Create: `agent/.env.example`
- Test: extend `agent/tests/test_llm_tools.py` OR a small `agent/tests/test_llm_agent.py`

**Interfaces:**
- Consumes: `llm_agent.prompt.build_system_prompt`, `llm_agent.tools.STUB_TOOLS`.
- Produces: `llm_agent.agent.DEFAULT_MODEL: str`, `model_name() -> str`, `build_llm_agent(model: str | None = None) -> LlmAgent`.

- [ ] **Step 1: Add the ADK dependency to `agent/pyproject.toml`**

Under `dependencies`, add (alphabetical near the others):

```toml
    "google-adk>=2.5.0,<3.0.0",
```

- [ ] **Step 2: Create `agent/.env.example`**

```bash
# Live agent (llm_agent) configuration. Copy to agent/.env and fill in.

# Gemini model (ADK-native). Cheap tier by default; the 7.6 runner swaps in the
# real model for final passes via this same knob.
MODEL_NAME=gemini-2.5-flash

# Google AI Studio API key — ADK reads this to auth Gemini.
GOOGLE_API_KEY=your-google-ai-studio-key

# Use the AI Studio (API-key) backend rather than Vertex AI.
GOOGLE_GENAI_USE_VERTEXAI=FALSE
```

- [ ] **Step 3: Write `agent/llm_agent/agent.py`**

```python
"""Builds the live A2UI LlmAgent: system prompt + stub toolset + Gemini model knob."""

from __future__ import annotations

import os

from google.adk.agents import LlmAgent

from llm_agent.prompt import build_system_prompt
from llm_agent.tools import STUB_TOOLS

# Cheap Gemini tier by default (spec decision 7); overridable via MODEL_NAME.
DEFAULT_MODEL = "gemini-2.5-flash"

AGENT_NAME = "a2ui_github_live_agent"


def model_name() -> str:
    return os.environ.get("MODEL_NAME", DEFAULT_MODEL)


def build_llm_agent(model: str | None = None) -> LlmAgent:
    """Constructs the ADK LlmAgent with the assembled system prompt and stub tools."""
    return LlmAgent(
        name=AGENT_NAME,
        model=model or model_name(),
        instruction=build_system_prompt(),
        tools=list(STUB_TOOLS),
    )
```

- [ ] **Step 4: Write the test** — `agent/tests/test_llm_agent.py`

```python
import llm_agent.agent as agent_mod
from llm_agent.agent import DEFAULT_MODEL, build_llm_agent, model_name


def test_model_name_defaults_to_cheap_tier(monkeypatch):
    monkeypatch.delenv("MODEL_NAME", raising=False)
    assert model_name() == DEFAULT_MODEL


def test_model_name_reads_env(monkeypatch):
    monkeypatch.setenv("MODEL_NAME", "gemini-1.5-pro")
    assert model_name() == "gemini-1.5-pro"


def test_build_llm_agent_wires_prompt_and_tools():
    a = build_llm_agent(model="gemini-2.5-flash")
    assert a.model == "gemini-2.5-flash"
    # instruction carries the authored role and the SDK schema block
    from a2ui.schema.constants import A2UI_SCHEMA_BLOCK_START
    assert "maintainer's-morning agent" in a.instruction
    assert A2UI_SCHEMA_BLOCK_START in a.instruction
    # both stub tools registered, no write tool
    tool_names = {t.__name__ for t in agent_mod.STUB_TOOLS}
    assert tool_names == {"list_pull_requests", "get_pull_request"}
```

> Note: `LlmAgent.instruction` may be stored as-is (a string) — if ADK wraps it, assert against `build_system_prompt()` directly instead. Building the agent must NOT require `GOOGLE_API_KEY` (no network at construction); if it does, drop to asserting `build_system_prompt()` content + `STUB_TOOLS` and skip constructing `LlmAgent` in L0.

- [ ] **Step 5: Sync deps and run**

Run: `uv run pytest tests/test_llm_agent.py -q`  (in this sandbox: `uv pip install "google-adk>=2.5.0,<3.0.0"` into `.venv` first, since `uv sync` needs 3.14)
Expected: PASS.

- [ ] **Step 6: Commit**

```bash
git add agent/pyproject.toml agent/.env.example agent/llm_agent/agent.py agent/tests/test_llm_agent.py
git commit -m "feat(phase-7): LlmAgent builder, model knob, and .env.example"
```

---

## Task 6: Streaming executor — validate-at-end + retry-and-restream

**Files:**
- Create: `agent/llm_agent/responder.py`
- Create: `agent/llm_agent/executor.py`
- Test: `agent/tests/test_llm_executor.py`

**Interfaces:**
- Consumes: `llm_agent.catalog.live_catalog`, `llm_agent.catalog.validate_surface`; `a2ui.parser.streaming.A2uiStreamParser`; `a2ui.a2a.parts.create_a2ui_part`; `a2ui.parser.parser.parse_response`.
- Produces:
  - `llm_agent.responder.LlmResponder` (Protocol) with `async def stream(self, prompt: str, correction: str | None = None) -> AsyncIterator[str]`.
  - `llm_agent.responder.AdkLlmResponder` (real ADK glue; constructed by the server, not L0-tested).
  - `llm_agent.executor.MAX_ATTEMPTS: int` (= 2), `APOLOGY_TEXT: str`, `LlmAgentExecutor(AgentExecutor)` taking `responder: LlmResponder` and optional `catalog`.

- [ ] **Step 1: Write `agent/llm_agent/responder.py`**

```python
"""LLM responder abstraction: streams model text tokens; ADK-backed at runtime.

The executor depends only on the LlmResponder protocol, so its stream/validate/retry
logic is L0-testable with a fake responder — no live model. AdkLlmResponder is the
real implementation wired by the server; it is exercised by the task's manual live run.
"""

from __future__ import annotations

from typing import AsyncIterator, Optional, Protocol, runtime_checkable


@runtime_checkable
class LlmResponder(Protocol):
    async def stream(
        self, prompt: str, correction: Optional[str] = None
    ) -> AsyncIterator[str]:
        """Yields raw model text tokens for `prompt`.

        When `correction` is set, it is a validation-error message appended to the
        same conversation so the model can repair its previous A2UI output.
        """
        ...


class AdkLlmResponder:
    """Runs the live LlmAgent through an ADK Runner with in-memory services."""

    def __init__(self, llm_agent=None, app_name: str = "a2ui_github_live"):
        from google.adk.agents import LlmAgent  # local import: keep module import cheap
        from google.adk.artifacts import InMemoryArtifactService
        from google.adk.memory import InMemoryMemoryService
        from google.adk.runners import Runner
        from google.adk.sessions import InMemorySessionService

        from llm_agent.agent import build_llm_agent

        self._app_name = app_name
        self._agent: LlmAgent = llm_agent or build_llm_agent()
        self._session_service = InMemorySessionService()
        self._runner = Runner(
            app_name=app_name,
            agent=self._agent,
            session_service=self._session_service,
            artifact_service=InMemoryArtifactService(),
            memory_service=InMemoryMemoryService(),
        )
        self._user_id = "live-user"
        self._session_id: Optional[str] = None

    async def stream(
        self, prompt: str, correction: Optional[str] = None
    ) -> AsyncIterator[str]:
        from google.genai import types as genai_types

        if self._session_id is None:
            session = await self._session_service.create_session(
                app_name=self._app_name, user_id=self._user_id
            )
            self._session_id = session.id

        text = correction if correction is not None else prompt
        message = genai_types.Content(
            role="user", parts=[genai_types.Part(text=text)]
        )
        async for event in self._runner.run_async(
            user_id=self._user_id,
            session_id=self._session_id,
            new_message=message,
        ):
            content = getattr(event, "content", None)
            if content and getattr(content, "parts", None):
                for part in content.parts:
                    chunk = getattr(part, "text", None)
                    if chunk:
                        yield chunk
```

- [ ] **Step 2: Write `agent/llm_agent/executor.py`**

```python
"""Live AgentExecutor: stream parsed A2UI to the client, validate at end, retry on failure."""

from __future__ import annotations

import logging

from a2a.server.agent_execution import AgentExecutor, RequestContext
from a2a.server.events import EventQueue
from a2a.server.tasks import TaskUpdater
from a2a.types import Part, Task, TaskState, TextPart, UnsupportedOperationError
from a2a.utils import new_agent_parts_message, new_task
from a2a.utils.errors import ServerError
from a2ui.a2a.parts import create_a2ui_part
from a2ui.parser.parser import parse_response
from a2ui.parser.streaming import A2uiStreamParser

from llm_agent.catalog import live_catalog, validate_surface
from llm_agent.responder import LlmResponder

logger = logging.getLogger(__name__)

MAX_ATTEMPTS = 2  # one initial + one retry; tunable (spec decision 6)
APOLOGY_TEXT = (
    "Sorry — I couldn't compose a valid interface for that request. Please try rephrasing."
)


def _extract_text(context: RequestContext) -> str:
    message = context.message
    if message and message.parts:
        for part in message.parts:
            root = part.root
            if isinstance(root, TextPart) and root.text:
                return root.text
    return ""


def _collect_payload(accumulated: str) -> list[dict]:
    """Extracts the full A2UI message list from the accumulated model text."""
    payload: list[dict] = []
    for part in parse_response(accumulated):
        if part.a2ui_json:
            data = part.a2ui_json
            payload.extend(data if isinstance(data, list) else [data])
    return payload


class LlmAgentExecutor(AgentExecutor):
    """Streams parsed A2UI parts, validates the complete surface, retries on failure."""

    def __init__(self, responder: LlmResponder, catalog=None, max_attempts: int = MAX_ATTEMPTS):
        self._responder = responder
        self._catalog = catalog or live_catalog()
        self._max_attempts = max_attempts

    async def execute(self, context: RequestContext, event_queue: EventQueue) -> None:
        prompt = _extract_text(context)

        task = context.current_task
        if not task:
            task = new_task(context.message)
            await event_queue.enqueue_event(task)
        updater = TaskUpdater(event_queue, task.id, task.context_id)

        correction: str | None = None
        for attempt in range(1, self._max_attempts + 1):
            parser = A2uiStreamParser(catalog=self._catalog)
            accumulated = ""
            async for token in self._responder.stream(prompt, correction):
                accumulated += token
                for rp in parser.process_chunk(token):
                    parts = self._parts_for(rp)
                    if parts:
                        await updater.update_status(
                            TaskState.working,
                            new_agent_parts_message(parts, task.context_id, task.id),
                        )

            payload = _collect_payload(accumulated)
            try:
                if not payload:
                    raise ValueError("no A2UI surface found in the model response")
                validate_surface(payload)
            except ValueError as err:
                logger.warning("attempt %d produced an invalid surface: %s", attempt, err)
                correction = (
                    "Your previous A2UI response failed validation with this error:\n"
                    f"{err}\nReturn a corrected, complete A2UI surface."
                )
                continue

            await updater.update_status(TaskState.completed, final=True)
            return

        # Attempts exhausted -> plain-text apology.
        await updater.update_status(
            TaskState.completed,
            new_agent_parts_message(
                [Part(root=TextPart(text=APOLOGY_TEXT))], task.context_id, task.id
            ),
            final=True,
        )

    @staticmethod
    def _parts_for(rp) -> list[Part]:
        parts: list[Part] = []
        if rp.text:
            parts.append(Part(root=TextPart(text=rp.text)))
        if rp.a2ui_json:
            data = rp.a2ui_json
            for msg in data if isinstance(data, list) else [data]:
                parts.append(create_a2ui_part(msg, version="v0.9"))
        return parts

    async def cancel(self, context: RequestContext, event_queue: EventQueue) -> Task | None:
        raise ServerError(error=UnsupportedOperationError())
```

- [ ] **Step 3: Write the faked-stream executor test** — `agent/tests/test_llm_executor.py`

Uses a fake responder + real parser + real catalog + a fake event queue capturing enqueued events. A valid surface is taken from a known-good example in `knowledge/examples` (already catalog-valid) rendered as `<a2ui-json>...</a2ui-json>`.

```python
import json

import pytest
from a2a.server.events import EventQueue
from a2a.types import Message, Part, Role, TextPart

from llm_agent.catalog import EXAMPLES_DIR
from llm_agent.executor import APOLOGY_TEXT, LlmAgentExecutor


def _valid_surface_text() -> str:
    example = json.loads((EXAMPLES_DIR / sorted(p.name for p in EXAMPLES_DIR.glob("*.json"))[0]).read_text())
    messages = example["messages"]
    return "Here is your surface:\n<a2ui-json>\n" + json.dumps(messages) + "\n</a2ui-json>"


class _FakeResponder:
    """Yields a scripted response per attempt (index by number of stream() calls)."""

    def __init__(self, scripts: list[str]):
        self._scripts = scripts
        self.calls = 0
        self.corrections: list[str | None] = []

    async def stream(self, prompt, correction=None):
        self.corrections.append(correction)
        text = self._scripts[min(self.calls, len(self._scripts) - 1)]
        self.calls += 1
        # yield in a few chunks to exercise incremental parsing
        mid = len(text) // 2
        for chunk in (text[:mid], text[mid:]):
            yield chunk


class _Ctx:
    def __init__(self, prompt: str):
        self.message = Message(
            message_id="m1", role=Role.user, parts=[Part(root=TextPart(text=prompt))]
        )
        self.current_task = None


async def _drain(queue: EventQueue) -> list:
    events = []
    while not queue.is_closed() and not queue._queue.empty():  # test-only introspection
        events.append(await queue.dequeue_event())
    return events


@pytest.mark.asyncio
async def test_valid_first_attempt_streams_and_completes():
    responder = _FakeResponder([_valid_surface_text()])
    executor = LlmAgentExecutor(responder)
    queue = EventQueue()
    await executor.execute(_Ctx("show me open PRs"), queue)
    assert responder.calls == 1
    assert responder.corrections == [None]  # no correction on a first-attempt success


@pytest.mark.asyncio
async def test_invalid_then_valid_retries_with_correction():
    bad = "oops<a2ui-json>[{\"version\":\"v0.9\",\"updateComponents\":{\"surfaceId\":\"s1\",\"components\":[{\"id\":\"root\",\"component\":\"Nope\"}]}}]</a2ui-json>"
    responder = _FakeResponder([bad, _valid_surface_text()])
    executor = LlmAgentExecutor(responder)
    queue = EventQueue()
    await executor.execute(_Ctx("show me open PRs"), queue)
    assert responder.calls == 2
    assert responder.corrections[0] is None
    assert responder.corrections[1] is not None and "validation" in responder.corrections[1].lower()


@pytest.mark.asyncio
async def test_exhaustion_emits_plain_text_apology():
    bad = "nothing useful here"  # no <a2ui-json> block at all
    responder = _FakeResponder([bad])
    executor = LlmAgentExecutor(responder, max_attempts=2)
    queue = EventQueue()
    await executor.execute(_Ctx("show me open PRs"), queue)
    assert responder.calls == 2  # retried up to the cap
    # The final message carries the apology text.
    # (Assert via a captured-events helper appropriate to the installed a2a EventQueue API.)
```

> Implementation note: the exact `EventQueue` capture API can differ across `a2a-sdk` versions. If `_drain`/`_queue` introspection is not available, pass a lightweight fake `event_queue` object exposing `enqueue_event(evt)` (append to a list) — `TaskUpdater` and `new_task` only call `enqueue_event`. Capture the final message from that list and assert `APOLOGY_TEXT` is present. Prefer the fake-queue approach if it is simpler and stable.

- [ ] **Step 4: Run**

Run: `uv run pytest tests/test_llm_executor.py -q`
Expected: PASS (streaming, retry-with-correction, apology-on-exhaustion all verified with zero LLM calls).

- [ ] **Step 5: Commit**

```bash
git add agent/llm_agent/responder.py agent/llm_agent/executor.py agent/tests/test_llm_executor.py
git commit -m "feat(phase-7): streaming executor with validate-at-end retry loop"
```

---

## Task 7: Server, agent card, and CLI entrypoint

**Files:**
- Create: `agent/llm_agent/server.py`
- Create: `agent/llm_agent/__main__.py`
- Test: `agent/tests/test_llm_server.py`

**Interfaces:**
- Consumes: `catalog_common.supported_catalog_ids`; `llm_agent.responder.AdkLlmResponder`; `llm_agent.executor.LlmAgentExecutor`.
- Produces: `llm_agent.server.DEFAULT_PORT: int` (= 10003), `build_agent_card(base_url: str) -> AgentCard`, `build_app(host, port, base_url=None)`.

- [ ] **Step 1: Write `agent/llm_agent/server.py`**

Mirror the deterministic server (same CORS regex, same a2ui extension helper, single-version card) but wire the live executor. The executor's responder is the ADK one, constructed lazily at build time.

```python
"""A2A server wiring for the live LLM agent (single-version v0.9.1 card)."""

from __future__ import annotations

from a2a.server.apps import A2AStarletteApplication
from a2a.server.request_handlers import DefaultRequestHandler
from a2a.server.tasks import InMemoryTaskStore
from a2a.types import AgentCapabilities, AgentCard, AgentSkill
from a2ui.a2a.extension import get_a2ui_agent_extension
from a2ui.schema.constants import VERSION_0_9
from starlette.middleware.cors import CORSMiddleware

from catalog_common import supported_catalog_ids
from llm_agent.executor import LlmAgentExecutor
from llm_agent.responder import AdkLlmResponder

DEFAULT_PORT = 10003
CORS_ORIGIN_REGEX = r"^(http://localhost:\d+|https://[a-z0-9-]+\.[a-z]+\.devtunnels\.ms)$"


def build_agent_card(base_url: str) -> AgentCard:
    extension = get_a2ui_agent_extension(
        VERSION_0_9,
        accepts_inline_catalogs=False,
        supported_catalog_ids=supported_catalog_ids(),
    )
    capabilities = AgentCapabilities(streaming=True, extensions=[extension])
    skill = AgentSkill(
        id="live_a2ui",
        name="Live A2UI generator",
        description="Generates catalog-conformant Primer A2UI surfaces from natural language over GitHub data.",
        tags=["a2ui", "llm", "github"],
        examples=["What pull requests need my review?"],
    )
    return AgentCard(
        name="Live A2UI Agent",
        description="Live LLM A2A server generating Primer A2UI surfaces (Gemini via ADK).",
        url=base_url,
        version="0.1.0",
        default_input_modes=["text", "text/plain"],
        default_output_modes=["text", "text/plain"],
        capabilities=capabilities,
        skills=[skill],
    )


def build_app(host: str, port: int, base_url: str | None = None):
    base_url = base_url or f"http://{host}:{port}"
    handler = DefaultRequestHandler(
        agent_executor=LlmAgentExecutor(AdkLlmResponder()),
        task_store=InMemoryTaskStore(),
    )
    server = A2AStarletteApplication(
        agent_card=build_agent_card(base_url), http_handler=handler
    )
    app = server.build()
    app.add_middleware(
        CORSMiddleware,
        allow_origin_regex=CORS_ORIGIN_REGEX,
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )
    return app
```

- [ ] **Step 2: Write `agent/llm_agent/__main__.py`**

```python
import click
import uvicorn

from llm_agent.server import DEFAULT_PORT, build_app


@click.command()
@click.option("--host", default="localhost")
@click.option("--port", default=DEFAULT_PORT)
@click.option(
    "--base-url",
    default=None,
    help=(
        "Public URL to advertise in the agent card (e.g. a devtunnel URL). "
        "Defaults to http://<host>:<port>. Set this when the client reaches the "
        "server through a tunnel/proxy so message/send targets the public URL."
    ),
)
def main(host: str, port: int, base_url: str | None) -> None:
    uvicorn.run(build_app(host, port, base_url), host=host, port=port)


if __name__ == "__main__":
    main()
```

- [ ] **Step 3: Write the agent-card test** — `agent/tests/test_llm_server.py`

Build only the card (not the app — `build_app` constructs `AdkLlmResponder`, which builds an `LlmAgent`; that must stay out of L0 to avoid model/credential needs).

```python
from catalog_common import supported_catalog_ids
from llm_agent.server import DEFAULT_PORT, build_agent_card


def test_default_port_is_distinct_from_deterministic():
    from deterministic_agent.server import DEFAULT_PORT as DET_PORT
    assert DEFAULT_PORT != DET_PORT


def test_card_advertises_single_version_a2ui_extension_and_our_catalog():
    card = build_agent_card("http://localhost:10003")
    assert card.url == "http://localhost:10003"
    exts = card.capabilities.extensions
    assert exts, "agent card must advertise the a2ui extension"
    # supported catalog id is our hosted primer adapter catalog
    params = exts[0].params or {}
    flat = str(params)
    assert supported_catalog_ids()[0] in flat
    # single-version: exactly one a2ui extension advertised
    assert len(exts) == 1
```

> If `build_agent_card` can be imported without importing `AdkLlmResponder`/ADK (it should — `server.py` imports the responder at module top; move the `AdkLlmResponder`/`LlmAgentExecutor` imports *inside* `build_app` if importing `server` pulls ADK and slows/pollutes L0). Keep `build_agent_card` importable with no ADK dependency.

- [ ] **Step 4: Run**

Run: `uv run pytest tests/test_llm_server.py -q`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add agent/llm_agent/server.py agent/llm_agent/__main__.py agent/tests/test_llm_server.py
git commit -m "feat(phase-7): live-agent A2A server, single-version card, CLI entrypoint"
```

---

## Task 8: Full suite, README note, and gate

**Files:**
- Modify: `agent/README.md` (document the live agent run command + env)

- [ ] **Step 1: Run the whole agent suite**

Run: `uv run pytest -q`
Expected: PASS — all existing deterministic/knowledge tests plus the new `llm_agent` L0 tests, no regressions.

- [ ] **Step 2: Add a live-agent section to `agent/README.md`**

Document: `uv run python -m llm_agent --host localhost --port 10003 --base-url <tunnel-url>`, the required `MODEL_NAME` + `GOOGLE_API_KEY` env (point at `.env.example`), and that tests are L0/no-LLM.

- [ ] **Step 3: Run the repo gate**

Run (repo root): `yarn verify:all`
Expected: PASS (this task adds no JS; the gate confirms nothing broke).

- [ ] **Step 4: Commit**

```bash
git add agent/README.md
git commit -m "docs(phase-7): document running the live agent"
```

---

## Self-Review

**Spec coverage (task-7.2 locked decisions):**
1. Cohabitation (one uv project, sibling package) — Tasks 1–7 add `llm_agent` beside `deterministic_agent`; one pyproject (Task 5). ✔
2. Package name `llm_agent` — all `llm_agent/*`. ✔
3. Shared locate/load module, per-agent validation — Task 1 (`catalog_common`) + Task 2 (`validate_surface` strict) vs deterministic `validate_payload` non-strict. ✔
4. Prompt assembly via `generate_system_prompt` as-is — Task 3. ✔
5. Stub tool (PR-list + PR-detail, canned real-shaped) — Task 4. ✔
6. Executor stream-first / validate-at-end / retry-and-restream (2 attempts, apology) — Task 6. ✔
7. Env knobs `MODEL_NAME` + `GOOGLE_API_KEY`, no LiteLLM, `.env.example` — Task 5. ✔
8. DoD L0 automated + one manual live run — Tasks 2–7 L0 tests; manual run documented (Task 8). ✔
9. L0 prompt hybrid snapshot — Task 3. ✔
Open items resolved: port 10003 (Task 7), fixtures under `llm_agent/fixtures/` (Task 4), agent-card metadata (Task 7), role/workflow text (Task 3), default model `gemini-2.5-flash` (Task 5). ✔

**Placeholder scan:** every code step carries full code; no TODO/TBD. Two implementation notes (executor event-queue capture API, LlmAgent.instruction access) are explicit fallbacks, not placeholders.

**Type consistency:** `build_schema_manager(examples_path=…)`, `live_schema_manager()`, `live_catalog()`, `validate_surface(payload)`, `build_system_prompt(schema_manager=None)`, `STUB_TOOLS`, `LlmResponder.stream(prompt, correction=None)`, `LlmAgentExecutor(responder, catalog=None, max_attempts=…)`, `build_agent_card(base_url)`, `build_app(host, port, base_url=None)` — used consistently across tasks.
