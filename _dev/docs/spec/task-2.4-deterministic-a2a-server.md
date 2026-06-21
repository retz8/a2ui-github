# Task 2.4 — Deterministic A2A server

Covers TODO sub-task **2.4** within Phase 2 (parent spec: `phase-2-complete-component-slice.md`). Stands up a minimal, deterministic A2A server in `agent/` that returns canned, catalog-conformant A2UI on the Button `event` action — the Python side of the Phase 2 vertical slice. Realizes Phase 2 locked decision 6 (minimal agent = deterministic A2A server) and decision 8 (server consumes the `catalog.json` contract).

## Scope

- A new uv-managed `agent/` workspace and its deterministic A2A server, with a custom `AgentExecutor` returning a canned A2UI response keyed off the incoming action.
- The canned `submit` response exercises both an `updateDataModel` (two-way data binding on the Button) and an `updateComponents` (label swap), echoing the incoming surface.
- pytest at the executor level plus a `catalog.json` conformance check on the emitted A2UI.

Out of scope: the live FE↔server round-trip and real A2A client middleware wiring (sub-task 2.5); any ADK/LLM/MCP agent logic (Phase 5).

## Locked decisions

### 1. Pull in `a2ui-agent-sdk` now

The server depends on the official `a2ui-agent-sdk` (imported as `a2ui`) from the outset. It transitively installs ADK/genai, but none of the LLM/runner surface is used — only its A2A part helpers (`create_a2ui_part`, `is_a2ui_part`, `get_a2ui_datapart`), its extension helpers (`get_a2ui_agent_extension`, `try_activate_a2ui_extension`), and its schema layer (`A2uiSchemaManager`, `CatalogConfig.from_path`, `A2uiValidator`). Phase 5 reuses the same SDK for the real agent. This pins the environment to Python 3.14 (the SDK's `requires-python`) and `a2a-sdk >=0.3.0,<0.4.0`.

### 2. `agent/` layout — one uv project, two sibling modules

`agent/` is a single uv project (one venv, Python 3.14) sitting outside the yarn workspaces, per SPEC §7. It hosts two sibling modules: `deterministic_agent/`, built now and kept permanently as the token-free local-testing / new-component harness; and `a2ui_github_agent/`, reserved for Phase 5 and not created now. The canned A2UI lives as `.json` fixture files in a fixtures directory under `deterministic_agent/` (mirroring `client/src/fixtures/`), selected by an event-name → fixture mapping that stays extensible — adding a response is dropping a `.json` and adding a mapping entry.

### 3. Canned `submit` response

On the `submit` action the executor returns two A2UI v0.9 messages, both echoing the incoming `surfaceId` dynamically (stamped from the received action, never hardcoded):

- `updateDataModel { surfaceId, path: "/submitted", value: true }` — drives the Button's bound `disabled` (a `DynamicBoolean`), exercising two-way data binding on the Button component itself.
- `updateComponents { surfaceId, components: [{ id: "label", component: "Text", text: "✅ Sent — server received submit" }] }` — swaps the button label to a confirmation.

The root stays a `Button` (no component type-swap), and the response is `updateComponents`/`updateDataModel` only — never a re-`createSurface`, since the surface already exists in the client processor. The driven Button prop is `disabled`. The paired client `button-event` fixture gains `disabled: { path: "/submitted" }` plus an initial `updateDataModel` setting `/submitted = false`; initial render stays pixel-identical, so the 2.3 Playwright baseline is unaffected. Unknown event names return a single `Text` fallback ("Unhandled event: <name>") and never crash.

### 4. Conformance via full SDK validation

Conformance is full SDK validation against our own `catalog.json`. The catalog is loaded via `CatalogConfig.from_path` pointed at the sibling package file, located by a repo-root-anchored path (not a brittle relative `../` chain and not a copy into `agent/`), guarded by a marker assertion. An `A2uiSchemaManager(version=VERSION_0_9, …)` is built over it and the emitted payload is validated with `A2uiValidator(catalog).validate(...)` under strict validation. There is zero schema vendoring on our side — the SDK bundles `common_types` / `server_to_client`. `VERSION_0_9` is correct, as v0.9.1 is a patch within the 0.9 line.

### 5. Tests — executor-level, in-process

Tests drive the executor directly, in-process, with no live HTTP in CI. A mocked `RequestContext` carries the action `DataPart`, a captured `EventQueue` collects enqueued events, and after `execute` runs the emitted A2UI payload is reconstructed from the task-status message parts (filtered by `is_a2ui_part`). pytest runs in async auto mode. Two files share a run-once helper: one asserting the emitted payload (the two messages, the echoed `surfaceId`, the unknown-event fallback), and one feeding the emitted payload to `A2uiValidator` for conformance. The live FE↔server round-trip is sub-task 2.5 (plus Claude Chrome), not 2.4.

### 6. Server wiring

The entrypoint builds an `A2AStarletteApplication` over a `DefaultRequestHandler` + `InMemoryTaskStore`, served by `uvicorn`, with `click` host/port and a default port of `10002` (matching the reference middleware URL so 2.5 connects unchanged). No `StaticFiles` mount. The `AgentCard` advertises `streaming=True`, declares the a2ui extension via `get_a2ui_agent_extension(VERSION_0_9, accepts_inline_catalogs=False, supported_catalog_ids=[PRIMER_CATALOG_ID])` (catalog id taken from the same schema manager), and carries one minimal `AgentSkill`. The executor always returns the canned UI on the action — no text-fallback branch and no extension-gated branching.

### 7. CORS

CORS uses an `allow_origin_regex` covering both local dev and the VSCode devtunnel used for military-unit access — a general `*.<region>.devtunnels.ms` pattern alongside `localhost`, not a hardcoded tunnel id.

## Invariants

- The server consumes the catalog only in its declarative `catalog.json` form, and its emitted A2UI must validate against it.
- "Green" extends Phase 1's bar plus a green `pytest` in the uv-managed `agent/`.
- No ADK/LLM/MCP logic, no API key — the response is canned and deterministic.

## Open items

- `a2ui_github_agent/` (the real Phase 5 agent) — reserved, not created in this task.
