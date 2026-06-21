# Deterministic A2A Server (Task 2.4) Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Stand up a uv-managed `agent/` workspace whose deterministic A2A server returns canned, catalog-conformant A2UI when the Button `submit` event arrives, closing the Phase 2 event round-trip on the Python side.

**Architecture:** A new `agent/` uv project (outside the yarn workspaces) hosts a `deterministic_agent/` module: an `AgentExecutor` reads the incoming A2UI action from the A2A request, looks up a canned `.json` response keyed by event name, stamps the originating `surfaceId` onto each message, and emits them as A2UI `DataPart`s on the task's final status. A second module slot (`a2ui_github_agent/`) is reserved for Phase 5 and not built here. Conformance is enforced by validating the emitted A2UI against the sibling `primer-a2ui-adapter/catalogs/v0.9.1/catalog.json` through the `a2ui-agent-sdk` validator.

**Tech Stack:** Python 3.14, uv, `a2ui-agent-sdk` (from PyPI; brings `a2a-sdk`, `google-adk`, `jsonschema`), `a2a-sdk[http-server]`, `uvicorn`, `click`, `pytest`, `pytest-asyncio`.

## Global Constraints

- **Python 3.14** floor (`requires-python = ">=3.14"`), set by `a2ui-agent-sdk`.
- **`a2ui-agent-sdk` installed from PyPI** (the default index). Do NOT add a `[tool.uv.sources]` path into the sibling `../A2UI` fork — that clone is not a stable dependency for this repo.
- **`a2a-sdk[http-server]>=0.3.0,<0.4.0`**.
- **`agent/` lives outside the yarn workspaces** — it is uv-managed only; do not add it to the root `package.json` `workspaces`.
- **No ADK/LLM/MCP/API key** — the response is canned and deterministic. Use only the SDK's `a2a.parts`, `a2a.extension`, and `schema` helpers; never an LLM runner.
- **Protocol version literal is `"v0.9"`** on every emitted and consumed message; the SDK version constant is **`VERSION_0_9`** (`"0.9"`) — this matches the catalog's `$ref` namespace, the client wire version, and the extension URI `https://a2ui.org/a2a-extension/a2ui/v0.9`. Do not use `VERSION_0_9_1`.
- **Conformance uses `RELAXED_VALIDATION`** (keeps catalog schema checks; tolerates the missing surface root, which legitimately lives in the client fixture, not the server response).
- **Default server port `10002`**; CORS allows localhost and `*.<region>.devtunnels.ms`.
- **Commit convention:** `feat(phase-2): …` / `test(phase-2): …` / `chore(phase-2): …`.
- **`_dev/` is never touched on a worktree branch** — this plan produces code only (the `agent/` tree plus one `client/` fixture edit).

---

### Task 1: uv project scaffold + green pytest

Creates the `agent/` uv project, the `deterministic_agent/` package dir, the test dir, and a smoke test proving the environment installs and pytest runs.

**Files:**
- Create: `agent/pyproject.toml`
- Create: `agent/.python-version`
- Create: `agent/README.md`
- Create: `agent/deterministic_agent/__init__.py` (empty)
- Create: `agent/tests/__init__.py` (empty)
- Create: `agent/tests/test_smoke.py`

**Interfaces:**
- Consumes: nothing.
- Produces: an installable uv project where `import deterministic_agent` works and `uv run pytest` is green. Later tasks add modules under `deterministic_agent/` and tests under `tests/`.

- [ ] **Step 1: Write `agent/pyproject.toml`**

```toml
[project]
name = "a2ui-github-agent"
version = "0.1.0"
description = "Deterministic A2A server for the a2ui-github Phase 2 slice (and a permanent token-free local-test harness)."
readme = "README.md"
requires-python = ">=3.14"
dependencies = [
    "a2ui-agent-sdk",
    "a2a-sdk[http-server]>=0.3.0,<0.4.0",
    "uvicorn>=0.40.0",
    "click>=8.1.8",
]

[tool.uv]
package = false

[dependency-groups]
dev = [
    "pytest>=9.0.0",
    "pytest-asyncio>=1.3.0",
]

[tool.pytest.ini_options]
asyncio_mode = "auto"
pythonpath = ["."]
testpaths = ["tests"]
```

- [ ] **Step 2: Write `agent/.python-version`**

```
3.14
```

- [ ] **Step 3: Write `agent/README.md`**

````markdown
# agent/ — Deterministic A2A server

uv-managed Python project (outside the yarn workspaces). Hosts `deterministic_agent/`:
a canned-response A2A server that closes the Phase 2 event round-trip without an LLM.
A second module slot, `a2ui_github_agent/`, is reserved for the Phase 5 real agent.

## Setup

```bash
uv sync
```

## Test

```bash
uv run pytest
```

## Run the server (manual / Phase 2.5)

```bash
uv run python -m deterministic_agent --host localhost --port 10002
```
````

- [ ] **Step 4: Write the smoke test `agent/tests/test_smoke.py`**

```python
def test_package_imports():
    import deterministic_agent  # noqa: F401
```

- [ ] **Step 5: Install and run the smoke test**

Run (from `agent/`): `uv sync && uv run pytest tests/test_smoke.py -v`
Expected: dependency resolution succeeds; `test_package_imports` PASSES.

- [ ] **Step 6: Commit**

```bash
git add agent/pyproject.toml agent/.python-version agent/README.md agent/deterministic_agent/__init__.py agent/tests/__init__.py agent/tests/test_smoke.py agent/uv.lock
git commit -m "chore(phase-2): scaffold uv-managed agent/ project for deterministic A2A server"
```

---

### Task 2: Catalog access + conformance validator helper

Adds the repo-root-anchored path to the sibling `catalog.json`, builds the SDK schema manager over it, and exposes a `validate_payload` helper. This is the single place that knows where the catalog lives and how to validate against it.

**Files:**
- Create: `agent/deterministic_agent/catalog.py`
- Test: `agent/tests/test_catalog.py`

**Interfaces:**
- Consumes: the sibling file `primer-a2ui-adapter/catalogs/v0.9.1/catalog.json` (read-only).
- Produces:
  - `catalog_json_path() -> pathlib.Path` — absolute path to the sibling catalog, asserted to exist.
  - `get_catalog() -> A2uiCatalog` — the SDK catalog object (`.catalog_id` is the GitHub URL from `catalog.json`).
  - `supported_catalog_ids() -> list[str]` — `[get_catalog().catalog_id]`, for the AgentCard.
  - `validate_payload(payload: list[dict]) -> None` — raises if `payload` does not conform to the catalog (RELAXED config).

- [ ] **Step 1: Write the failing test `agent/tests/test_catalog.py`**

```python
import pytest
from deterministic_agent.catalog import (
    catalog_json_path,
    get_catalog,
    supported_catalog_ids,
    validate_payload,
)


def test_catalog_path_points_at_sibling_package():
    path = catalog_json_path()
    assert path.is_file()
    assert path.parts[-3:] == ("catalogs", "v0.9.1", "catalog.json")


def test_catalog_id_is_the_primer_catalog_url():
    cid = get_catalog().catalog_id
    assert cid.startswith("https://github.com/")
    assert cid.endswith("primer-a2ui-adapter/catalogs/v0.9.1/catalog.json")
    assert supported_catalog_ids() == [cid]


def test_validate_accepts_a_known_good_text_update():
    payload = [
        {
            "version": "v0.9",
            "updateComponents": {
                "surfaceId": "s1",
                "components": [{"id": "label", "component": "Text", "text": "ok"}],
            },
        }
    ]
    validate_payload(payload)  # must not raise


def test_validate_rejects_an_undeclared_property():
    payload = [
        {
            "version": "v0.9",
            "updateComponents": {
                "surfaceId": "s1",
                "components": [
                    {"id": "label", "component": "Text", "text": "x", "bogus": 1}
                ],
            },
        }
    ]
    with pytest.raises(Exception):
        validate_payload(payload)
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `uv run pytest tests/test_catalog.py -v`
Expected: FAIL with `ModuleNotFoundError: No module named 'deterministic_agent.catalog'`.

- [ ] **Step 3: Write `agent/deterministic_agent/catalog.py`**

```python
"""Locates the sibling primer-a2ui-adapter catalog.json and validates A2UI against it."""

from __future__ import annotations

import functools
from pathlib import Path

from a2ui.core.validating import RELAXED_VALIDATION
from a2ui.schema.catalog import CatalogConfig
from a2ui.schema.constants import VERSION_0_9
from a2ui.schema.manager import A2uiSchemaManager

_CATALOG_RELPATH = ("primer-a2ui-adapter", "catalogs", "v0.9.1", "catalog.json")


def _repo_root() -> Path:
    # catalog.py -> deterministic_agent -> agent -> <repo root>
    root = Path(__file__).resolve().parents[2]
    assert (root / "primer-a2ui-adapter").is_dir(), (
        f"expected the monorepo root containing primer-a2ui-adapter at {root}"
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
        catalogs=[CatalogConfig.from_path("primer", str(catalog_json_path()))],
    )


def get_catalog():
    return _schema_manager().get_selected_catalog()


def supported_catalog_ids() -> list[str]:
    return [get_catalog().catalog_id]


def validate_payload(payload: list[dict]) -> None:
    """Raises if the payload does not conform to the Primer catalog (RELAXED config)."""
    get_catalog().validator.validate(payload, config=RELAXED_VALIDATION)
```

- [ ] **Step 4: Run the test to verify it passes**

Run: `uv run pytest tests/test_catalog.py -v`
Expected: all four tests PASS.

- [ ] **Step 5: Commit**

```bash
git add agent/deterministic_agent/catalog.py agent/tests/test_catalog.py
git commit -m "feat(phase-2): locate sibling catalog.json + SDK conformance validator"
```

---

### Task 3: Canned response builder + `submit` fixture

Adds the event-name → fixture mapping, the `submit.json` response template, and the `build_response` function that stamps the originating `surfaceId` onto each message. Unknown events fall back to a single confirmation `Text`.

**Files:**
- Create: `agent/deterministic_agent/responses.py`
- Create: `agent/deterministic_agent/fixtures/submit.json`
- Test: `agent/tests/test_responses.py`

**Interfaces:**
- Consumes: nothing from earlier tasks.
- Produces: `build_response(action: dict) -> list[dict]` — given an A2UI client action `{name, surfaceId, ...}`, returns a list of A2UI v0.9 message dicts with `surfaceId` stamped into each message's operation object.

- [ ] **Step 1: Write the `submit` fixture `agent/deterministic_agent/fixtures/submit.json`**

```json
[
  {
    "version": "v0.9",
    "updateDataModel": { "path": "/submitted", "value": true }
  },
  {
    "version": "v0.9",
    "updateComponents": {
      "components": [
        { "id": "label", "component": "Text", "text": "✅ Sent — server received submit" }
      ]
    }
  }
]
```

- [ ] **Step 2: Write the failing test `agent/tests/test_responses.py`**

```python
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


def test_unknown_event_returns_single_text_fallback_with_surface_echoed():
    msgs = build_response({"name": "wat", "surfaceId": "s9", "context": {}})
    assert len(msgs) == 1
    uc = msgs[0]["updateComponents"]
    assert uc["surfaceId"] == "s9"
    assert uc["components"][0]["component"] == "Text"
    assert uc["components"][0]["text"] == "Unhandled event: wat"
```

- [ ] **Step 3: Run the test to verify it fails**

Run: `uv run pytest tests/test_responses.py -v`
Expected: FAIL with `ModuleNotFoundError: No module named 'deterministic_agent.responses'`.

- [ ] **Step 4: Write `agent/deterministic_agent/responses.py`**

```python
"""Maps an incoming A2UI action to a canned A2UI response, echoing the surfaceId."""

from __future__ import annotations

import json
from pathlib import Path

_FIXTURES_DIR = Path(__file__).resolve().parent / "fixtures"
_EVENT_FIXTURES = {"submit": "submit.json"}
# The operation key whose object carries the surfaceId we stamp.
_OPERATION_KEYS = ("updateComponents", "updateDataModel", "createSurface")


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
    fixture = _EVENT_FIXTURES.get(name)
    if fixture is None:
        return _fallback(name, surface_id)
    return _stamp_surface(_load_fixture(fixture), surface_id)
```

- [ ] **Step 5: Run the test to verify it passes**

Run: `uv run pytest tests/test_responses.py -v`
Expected: both tests PASS.

- [ ] **Step 6: Commit**

```bash
git add agent/deterministic_agent/responses.py agent/deterministic_agent/fixtures/submit.json agent/tests/test_responses.py
git commit -m "feat(phase-2): canned submit response builder + fixture with surfaceId echo"
```

---

### Task 4: The deterministic AgentExecutor + test harness

Adds the `AgentExecutor` that reads the incoming action, builds the canned response, wraps each message as an A2UI `DataPart`, and emits them on the task's final status. Adds a shared test helper that runs the executor in-process and reconstructs the emitted A2UI payload.

**Files:**
- Create: `agent/deterministic_agent/executor.py`
- Create: `agent/tests/helpers.py`
- Test: `agent/tests/test_executor.py`

**Interfaces:**
- Consumes: `build_response` (Task 3).
- Produces:
  - `class DeterministicAgentExecutor(AgentExecutor)` with `async def execute(self, context, event_queue)` and `async def cancel(...)`.
  - `tests/helpers.py::run_executor(action: dict) -> list[dict]` (async) — drives `execute` with a mocked `RequestContext` carrying `action`, captures the `EventQueue`, and returns the reconstructed A2UI message list.

- [ ] **Step 1: Write the shared helper `agent/tests/helpers.py`**

```python
"""In-process harness: run the executor and reconstruct its emitted A2UI payload."""

from __future__ import annotations

from unittest.mock import AsyncMock, MagicMock

from a2a.server.agent_execution import RequestContext
from a2a.server.events import EventQueue
from a2a.types import DataPart, Message, Part, Role
from a2ui.a2a.parts import get_a2ui_datapart, is_a2ui_part

from deterministic_agent.executor import DeterministicAgentExecutor


def _incoming_message(action: dict) -> Message:
    return Message(
        message_id="test-msg",
        role=Role.user,
        parts=[Part(root=DataPart(data={"version": "v0.9", "action": action}))],
        kind="message",
    )


def _parts_from_event(event) -> list:
    status = getattr(event, "status", None)
    message = getattr(status, "message", None) if status is not None else None
    return list(getattr(message, "parts", []) or [])


async def run_executor(action: dict) -> list[dict]:
    context = MagicMock(spec=RequestContext)
    context.message = _incoming_message(action)
    context.current_task = None

    queue = MagicMock(spec=EventQueue)
    queue.enqueue_event = AsyncMock()

    await DeterministicAgentExecutor().execute(context, queue)

    payload: list[dict] = []
    for call in queue.enqueue_event.call_args_list:
        event = call.args[0]
        for part in _parts_from_event(event):
            if is_a2ui_part(part):
                payload.append(get_a2ui_datapart(part).data)
    return payload
```

- [ ] **Step 2: Write the failing test `agent/tests/test_executor.py`**

```python
from tests.helpers import run_executor

SUBMIT = {"name": "submit", "surfaceId": "button-event", "sourceComponentId": "root", "context": {}}


async def test_submit_emits_data_model_then_components_echoing_surface():
    payload = await run_executor(SUBMIT)
    assert [next(k for k in m if k != "version") for m in payload] == [
        "updateDataModel",
        "updateComponents",
    ]
    assert payload[0]["updateDataModel"] == {
        "surfaceId": "button-event",
        "path": "/submitted",
        "value": True,
    }
    assert payload[1]["updateComponents"]["surfaceId"] == "button-event"
    assert payload[1]["updateComponents"]["components"] == [
        {"id": "label", "component": "Text", "text": "✅ Sent — server received submit"}
    ]


async def test_unknown_event_emits_single_text_fallback():
    payload = await run_executor({"name": "nope", "surfaceId": "s2", "context": {}})
    assert len(payload) == 1
    assert payload[0]["updateComponents"]["components"][0]["text"] == "Unhandled event: nope"
```

- [ ] **Step 3: Run the test to verify it fails**

Run: `uv run pytest tests/test_executor.py -v`
Expected: FAIL with `ModuleNotFoundError: No module named 'deterministic_agent.executor'`.

- [ ] **Step 4: Write `agent/deterministic_agent/executor.py`**

```python
"""Deterministic AgentExecutor: returns canned A2UI for the incoming action."""

from __future__ import annotations

from a2a.server.agent_execution import AgentExecutor, RequestContext
from a2a.server.events import EventQueue
from a2a.server.tasks import TaskUpdater
from a2a.types import DataPart, Part, Task, TaskState, UnsupportedOperationError
from a2a.utils import new_agent_parts_message, new_task
from a2a.utils.errors import ServerError
from a2ui.a2a.parts import create_a2ui_part

from deterministic_agent.responses import build_response


def _extract_action(context: RequestContext) -> dict | None:
    message = context.message
    if not message or not message.parts:
        return None
    for part in message.parts:
        root = part.root
        if isinstance(root, DataPart) and root.data.get("version") == "v0.9":
            action = root.data.get("action")
            if isinstance(action, dict):
                return action
    return None


class DeterministicAgentExecutor(AgentExecutor):
    """Returns a canned, catalog-conformant A2UI response on every action."""

    async def execute(self, context: RequestContext, event_queue: EventQueue) -> None:
        action = _extract_action(context) or {"name": "", "surfaceId": ""}
        messages = build_response(action)
        parts: list[Part] = [create_a2ui_part(msg, version="v0.9") for msg in messages]

        task = context.current_task
        if not task:
            task = new_task(context.message)
            await event_queue.enqueue_event(task)

        updater = TaskUpdater(event_queue, task.id, task.context_id)
        await updater.update_status(
            TaskState.completed,
            new_agent_parts_message(parts, task.context_id, task.id),
            final=True,
        )

    async def cancel(self, context: RequestContext, event_queue: EventQueue) -> Task | None:
        raise ServerError(error=UnsupportedOperationError())
```

- [ ] **Step 5: Run the test to verify it passes**

Run: `uv run pytest tests/test_executor.py -v`
Expected: both tests PASS.

- [ ] **Step 6: Commit**

```bash
git add agent/deterministic_agent/executor.py agent/tests/helpers.py agent/tests/test_executor.py
git commit -m "feat(phase-2): deterministic AgentExecutor emitting canned A2UI parts"
```

---

### Task 5: Conformance test on the emitted A2UI

Feeds the executor's actual emitted payload through the catalog validator, closing the loop catalog.json ↔ server output. Includes a negative case so the test has teeth.

**Files:**
- Test: `agent/tests/test_conformance.py`

**Interfaces:**
- Consumes: `tests/helpers.py::run_executor` (Task 4), `deterministic_agent.catalog.validate_payload` (Task 2).
- Produces: nothing (test-only).

- [ ] **Step 1: Write the failing test `agent/tests/test_conformance.py`**

```python
import pytest

from deterministic_agent.catalog import validate_payload
from tests.helpers import run_executor

SUBMIT = {"name": "submit", "surfaceId": "button-event", "sourceComponentId": "root", "context": {}}


async def test_emitted_submit_payload_conforms_to_catalog():
    payload = await run_executor(SUBMIT)
    validate_payload(payload)  # must not raise


async def test_emitted_unknown_event_fallback_conforms_to_catalog():
    payload = await run_executor({"name": "nope", "surfaceId": "s2", "context": {}})
    validate_payload(payload)  # must not raise


def test_validator_rejects_non_conformant_component():
    bad = [
        {
            "version": "v0.9",
            "updateComponents": {
                "surfaceId": "s1",
                "components": [{"id": "x", "component": "NotARealComponent", "text": "y"}],
            },
        }
    ]
    with pytest.raises(Exception):
        validate_payload(bad)
```

- [ ] **Step 2: Run the test to verify the positive cases pass and the negative raises**

Run: `uv run pytest tests/test_conformance.py -v`
Expected: all three PASS (the third passes because `validate_payload` raises on the unknown component, as asserted).

- [ ] **Step 3: Commit**

```bash
git add agent/tests/test_conformance.py
git commit -m "test(phase-2): catalog.json conformance of the executor's emitted A2UI"
```

---

### Task 6: Server wiring (AgentCard + app factory + `__main__`)

Adds the runnable server: an AgentCard advertising the a2ui extension, an app factory wiring the executor into `A2AStarletteApplication` with CORS, and a `__main__` entrypoint. The factory functions are unit-tested without starting uvicorn.

**Files:**
- Create: `agent/deterministic_agent/server.py`
- Create: `agent/deterministic_agent/__main__.py`
- Test: `agent/tests/test_server.py`

**Interfaces:**
- Consumes: `DeterministicAgentExecutor` (Task 4), `supported_catalog_ids` (Task 2).
- Produces:
  - `DEFAULT_PORT: int = 10002`
  - `CORS_ORIGIN_REGEX: str`
  - `build_agent_card(base_url: str) -> AgentCard`
  - `build_app(host: str, port: int)` — the Starlette app with CORS and the A2A routes.

- [ ] **Step 1: Write the failing test `agent/tests/test_server.py`**

```python
import re

from deterministic_agent.server import (
    CORS_ORIGIN_REGEX,
    DEFAULT_PORT,
    build_agent_card,
)
from deterministic_agent.catalog import supported_catalog_ids


def test_default_port_is_10002():
    assert DEFAULT_PORT == 10002


def test_cors_regex_allows_localhost_and_devtunnel_but_not_arbitrary():
    pattern = re.compile(CORS_ORIGIN_REGEX)
    assert pattern.match("http://localhost:5173")
    assert pattern.match("https://vnw20xbg-5173.asse.devtunnels.ms")
    assert not pattern.match("https://evil.com")


def test_agent_card_advertises_streaming_and_the_a2ui_v09_extension():
    card = build_agent_card("http://localhost:10002")
    assert card.capabilities.streaming is True
    uris = [ext.uri for ext in card.capabilities.extensions]
    assert "https://a2ui.org/a2a-extension/a2ui/v0.9" in uris
    a2ui_ext = next(e for e in card.capabilities.extensions if e.uri.endswith("a2ui/v0.9"))
    assert a2ui_ext.params["supportedCatalogIds"] == supported_catalog_ids()
```

> Note: if the extension `params` key differs from `"supportedCatalogIds"`, read it from `a2ui.a2a.extension`'s `AGENT_EXTENSION_SUPPORTED_CATALOG_IDS_KEY` constant and assert against that constant instead of the string literal.

- [ ] **Step 2: Run the test to verify it fails**

Run: `uv run pytest tests/test_server.py -v`
Expected: FAIL with `ModuleNotFoundError: No module named 'deterministic_agent.server'`.

- [ ] **Step 3: Write `agent/deterministic_agent/server.py`**

```python
"""A2A server wiring for the deterministic agent."""

from __future__ import annotations

from a2a.server.apps import A2AStarletteApplication
from a2a.server.request_handlers import DefaultRequestHandler
from a2a.server.tasks import InMemoryTaskStore
from a2a.types import AgentCapabilities, AgentCard, AgentSkill
from a2ui.a2a.extension import get_a2ui_agent_extension
from a2ui.schema.constants import VERSION_0_9
from starlette.middleware.cors import CORSMiddleware

from deterministic_agent.catalog import supported_catalog_ids
from deterministic_agent.executor import DeterministicAgentExecutor

DEFAULT_PORT = 10002
CORS_ORIGIN_REGEX = r"^(http://localhost:\d+|https://[a-z0-9-]+\.[a-z]+\.devtunnels\.ms)$"


def build_agent_card(base_url: str) -> AgentCard:
    extension = get_a2ui_agent_extension(
        VERSION_0_9,
        accepts_inline_catalogs=False,
        supported_catalog_ids=supported_catalog_ids(),
    )
    capabilities = AgentCapabilities(streaming=True, extensions=[extension])
    skill = AgentSkill(
        id="canned_a2ui",
        name="Canned A2UI responder",
        description="Returns a fixed, catalog-conformant A2UI surface for known UI events.",
        tags=["a2ui", "deterministic"],
        examples=["submit"],
    )
    return AgentCard(
        name="Deterministic A2UI Agent",
        description="Deterministic Phase 2 A2A server returning canned A2UI (no LLM).",
        url=base_url,
        version="0.1.0",
        default_input_modes=["text", "text/plain"],
        default_output_modes=["text", "text/plain"],
        capabilities=capabilities,
        skills=[skill],
    )


def build_app(host: str, port: int):
    base_url = f"http://{host}:{port}"
    handler = DefaultRequestHandler(
        agent_executor=DeterministicAgentExecutor(),
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

- [ ] **Step 4: Write `agent/deterministic_agent/__main__.py`**

```python
import click
import uvicorn

from deterministic_agent.server import DEFAULT_PORT, build_app


@click.command()
@click.option("--host", default="localhost")
@click.option("--port", default=DEFAULT_PORT)
def main(host: str, port: int) -> None:
    uvicorn.run(build_app(host, port), host=host, port=port)


if __name__ == "__main__":
    main()
```

- [ ] **Step 5: Run the test to verify it passes**

Run: `uv run pytest tests/test_server.py -v`
Expected: all tests PASS. If the `supportedCatalogIds` param key assertion fails, apply the note under Step 1 (use the SDK constant) and re-run.

- [ ] **Step 6: Verify the whole agent suite is green and the server boots**

Run: `uv run pytest -v`
Expected: every test across all files PASSES.

Run (smoke the entrypoint, then Ctrl-C): `uv run python -m deterministic_agent --port 10002`
Expected: uvicorn starts and serves; `curl -s http://localhost:10002/.well-known/agent-card.json` returns the agent card JSON including the `a2ui/v0.9` extension. Stop the server after confirming.

- [ ] **Step 7: Commit**

```bash
git add agent/deterministic_agent/server.py agent/deterministic_agent/__main__.py agent/tests/test_server.py
git commit -m "feat(phase-2): runnable A2A server — agent card, a2ui extension, CORS, uvicorn entrypoint"
```

---

### Task 7: Pair the client `button-event` fixture with the data-binding round-trip

Updates the client fixture so the Button's `disabled` is bound to `/submitted` (initialized `false`), so that in 2.5 the server's `updateDataModel` visibly disables the button. Initial render stays pixel-identical, so the 2.3 Playwright baseline is unaffected.

**Files:**
- Modify: `client/src/fixtures/button-event.ts`
- Test (existing, must stay green): `client/tests/actions.test.tsx`, `client/tests/render.test.tsx`

**Interfaces:**
- Consumes: nothing from the Python tasks (this is the client counterpart; they agree only on the literals `surfaceId = "button-event"` and the data path `/submitted`).
- Produces: a `button-event` fixture whose root Button has `disabled: {path: '/submitted'}` and an initial data model `/submitted = false`.

- [ ] **Step 1: Update `client/src/fixtures/button-event.ts`**

```ts
import {PRIMER_CATALOG_ID} from 'primer-a2ui-adapter';
import type {Fixture} from './types';

export const buttonEventFixture: Fixture = {
  name: 'button-event',
  messages: [
    {version: 'v0.9', createSurface: {surfaceId: 'button-event', catalogId: PRIMER_CATALOG_ID}},
    {
      version: 'v0.9',
      updateComponents: {
        surfaceId: 'button-event',
        components: [
          {
            id: 'root',
            component: 'Button',
            child: 'label',
            variant: 'primary',
            disabled: {path: '/submitted'},
            action: {event: {name: 'submit', context: {}}},
          },
          {id: 'label', component: 'Text', text: 'Send event'},
        ],
      },
    },
    {
      version: 'v0.9',
      updateDataModel: {surfaceId: 'button-event', path: '/', value: {submitted: false}},
    },
  ],
};
```

- [ ] **Step 2: Run the client unit tests to confirm they still pass**

Run (per `client/README.md`; from repo root): `yarn workspace client test`
Expected: `actions.test.tsx` path-2 still asserts the handler receives `{name:'submit', surfaceId:'button-event', sourceComponentId:'root'}`, and render tests pass. All green.

- [ ] **Step 3: Confirm the Playwright baseline is unaffected**

Run (per `client/README.md`): the client e2e/visual command (e.g. `yarn workspace client e2e`).
Expected: the `button-event` snapshot still matches (button renders enabled, pixel-identical). If it reports a diff, do NOT update the baseline blindly — investigate why a disabled-binding initialized to `false` changed the render, and resolve before proceeding.

- [ ] **Step 4: Commit**

```bash
git add client/src/fixtures/button-event.ts
git commit -m "feat(phase-2): bind button-event Button.disabled to /submitted for the server round-trip"
```

---

## Self-Review

**Spec coverage:**
- Decision 1 (pull in `a2ui-agent-sdk`; SDK helpers; Python 3.14 / a2a-sdk pins) → Task 1 (`pyproject.toml`, Global Constraints).
- Decision 2 (one uv project, `deterministic_agent/` now + `a2ui_github_agent/` reserved; `.json` fixtures keyed by event name) → Tasks 1 & 3. (`a2ui_github_agent/` is intentionally not created — it is a reserved slot per the spec's open item.)
- Decision 3 (canned `submit` = `updateDataModel(/submitted=true)` + `updateComponents` label swap, surfaceId echoed, root stays Button, unknown→Text fallback; paired client fixture binds `disabled`) → Tasks 3, 4, 7.
- Decision 4 (full SDK validation against sibling `catalog.json`, repo-root-anchored path, zero vendoring) → Tasks 2 & 5. (Config is `RELAXED_VALIDATION`, see note below.)
- Decision 5 (executor-level tests via mocked `RequestContext` + captured `EventQueue`, `pytest-asyncio`, two files sharing a run-once helper; no live HTTP in CI) → Tasks 4 & 5 (+ `helpers.py`).
- Decision 6 (server wiring: `A2AStarletteApplication` + `DefaultRequestHandler` + `InMemoryTaskStore` + uvicorn, click, port 10002, no static mount, extension-declaring AgentCard, always-UI executor) → Tasks 4 & 6.
- Decision 7 (CORS regex for localhost + devtunnel) → Task 6.
- Invariant "green = Phase 1 bar + green pytest in agent/" → Task 6 Step 6.

**Deviation flagged for the implementer/user:** the spec text said validation runs under STRICT. Planning surfaced that STRICT (`allow_missing_root=False`, `allow_dangling_references=False`) rejects our intentionally partial update-only payload (the surface root lives in the client fixture, not the server response). The plan uses **`RELAXED_VALIDATION`**, which preserves the catalog *schema* checks (the conformance guarantee that matters — proven by the negative tests in Tasks 2 & 5) while tolerating the absent root. This realizes the spec's intent ("emitted A2UI conforms to catalog.json") for a partial fragment.

**Placeholder scan:** no TBD/“handle errors”/“similar to”/uncoded steps — every code step carries complete code.

**Type consistency:** `build_response(action) -> list[dict]` (Task 3) is consumed by the executor (Task 4) and indirectly by `run_executor` (Task 4 helper) feeding Tasks 4 & 5; `validate_payload(list[dict])` (Task 2) consumed by Task 5; `build_agent_card`/`build_app`/`DEFAULT_PORT`/`CORS_ORIGIN_REGEX` (Task 6) consumed by its own test and `__main__`. The literals `surfaceId="button-event"` and path `/submitted` agree across the Python fixture (Task 3) and the client fixture (Task 7).
