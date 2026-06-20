# Phase 2 — Complete component slice (Text + Button)

Covers the TODO `## Phase 2 — Test space & first catalog component`. Phase 2 takes one component all the way through the stack — rendering *and* interaction — as a complete vertical slice, realizing the catalog/adapter and renderer described in SPEC.md §4–§6.

## Scope

- A from-scratch Primer-native catalog containing two components, `Text` and `Button`, with `Button` composing a `Text` child.
- `Button` is implemented **completely** — Primer UI plus both A2UI action paths exercised end-to-end.
- A client test space that renders canned A2UI surfaces through the catalog, and reacts to actions.
- A minimal deterministic A2A server that closes the agent-event round-trip.
- Verification spanning the JS and Python boundaries, plus a real-browser visual check.

Out of scope: any LLM/agent generation of A2UI (the Phase 2 server is deterministic); ADK, GitHub MCP, and the real agent (Phase 5); a zod→`catalog.json` generator and scaled visual-regression (Phase 3).

## Locked decisions

### 1. Phase framing — prove the adapter renders and reacts, not that an LLM generates

Phase 2 (with Phase 3) proves that the A2UI adapter works correctly — that known-good A2UI **renders** correctly and **reacts** correctly. It does **not** test that an LLM generates correct A2UI; that is Phase 5. Hand-authored, known-correct A2UI is the test oracle.

### 2. Not transport-free — a complete vertical slice

Phase 2 is reframed from "render-only" to a complete implementation of one component: UI *and* interaction. Because a complete `Button` must exercise its action round-trip, Phase 2 includes a transport and a server. (This revises the initial transport-free framing.)

### 3. Catalog built from scratch, Primer-native

`PRIMER_CATALOG` is built from scratch to directly reflect the Primer design system, per the A2UI guidance to build catalogs that reflect a client's design system rather than mapping the Basic Catalog through an adapter. The package is not a runtime Basic→Primer mapper. `basicCatalog` is a reference only — not a base composed over, and not inherited wholesale (its functions/theme schema are likewise reference, not inherited).

### 4. Components: `Text` + `Button`, Button childs Text

Exactly two components this phase: `Text` (leaf) and `Button`. `Button` uses a `child` reference to a `Text`, so the slice also proves `buildChild` composition. Multi-component build-out is Phase 4.

### 5. Complete Button = both action paths

A2UI's `Action` is a `oneOf` of `event` and `functionCall`; a complete `Button` handles and is tested on both:
- **`functionCall`** — a function registered in our catalog, executed locally by the renderer's invoker. No server. The Phase 2 function is a simple `console.log` effect.
- **`event`** — dispatched over A2A to the server, which returns canned A2UI that re-renders.

### 6. Minimal agent = deterministic A2A server

The event path terminates at a minimal **deterministic** A2A server living in `agent/` (uv-managed): real A2A transport and server boundary, but a canned response — **no ADK, no LLM, no GitHub MCP, no API key**. This pulls the `agent/` workspace and its Python/A2A toolchain forward from Phase 5 into Phase 2. Phase 5 then becomes replacing the deterministic executor with the real ADK + LLM + GitHub-MCP agent; ADK, MCP, and the model key stay deferred.

### 7. Two schema representations, dual-authored and parity-tested

Each component is described twice, for two consumers:
- **Runtime zod** (composed from web_core's `CommonSchemas`) — the render-time source of truth; the React generic binder requires it.
- **Declarative `catalog.json`** — the agent/server contract; hand-authored, using `$ref` to the canonical hosted `common_types.json` and mirroring the Basic Catalog's `$defs` envelope (including `anyFunction`, since the phase registers a function).

Shared primitives are never redefined — `$ref` common_types in JSON, `CommonSchemas` in zod. The two representations are kept consistent by a schema-parity test (the discipline carried over from the spartan adapter). A zod→`catalog.json` generator is deferred to the Phase 3 harness.

### 8. The catalog is the single shared contract

The adapter's catalog is one contract consumed in two forms: the **client** consumes the runtime zod form (render + binder); the **server** consumes the declarative `catalog.json` form. The server's emitted A2UI must conform to `catalog.json` — verified by a conformance test, closing the loop zod ↔ `catalog.json` ↔ server output.

### 9. Test-space topology — hybrid (canned-local in, A2A for events)

One `MessageProcessor`. Initial surfaces are canned fixtures loaded **locally** (the spec `{name, messages[]}` shape, `catalogId = PRIMER_CATALOG_ID`) — the cleanest render-correctness oracle. `functionCall` actions run locally; `event` actions go out through the A2A client middleware to the deterministic server, and the response feeds back into the same processor to re-render. The server only responds to actions; it does not generate the initial surface (that is Phase 5).

### 10. Verification bar

- **vitest:** catalog composition, the zod↔`catalog.json` parity test, `Text`/`Button` render, and both action paths with the transport mocked on the client side.
- **pytest:** the deterministic executor, plus `catalog.json` conformance of its output.
- **Playwright:** committed visual-regression with baseline snapshots of the Primer-rendered `Text`/`Button` — regression protection from day one.
- **Claude Chrome:** dev-time live confirmation of Primer styling during the build.
- **Manual:** the genuine FE↔server wire round-trip (not in CI).

"Green" extends Phase 1's bar across the yarn workspaces, plus a green `pytest` in the uv-managed `agent/`.

## Invariants

- Phase 2 + Phase 3 prove the adapter (render + react), never LLM generation.
- Never redefine shared A2UI primitives: `$ref` common_types in `catalog.json`, compose `CommonSchemas` in zod.
- The catalog is the single contract both client and server consume.
- v0.9 is always reached via the `/v0_9` import subpath; the bare (v0.8) entry is never used.

## Open items

- zod→`catalog.json` generator — deferred to the Phase 3 catalog-writing harness.
- Scaled visual-regression (beyond Phase 2's baselines) — Phase 3.
- Initial-surface-from-agent (server-driven first surface) — Phase 5.
