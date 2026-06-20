# a2ui-github — Dev TODO

## Phase 1 — Bootstrap [done]
Stand up the monorepo workspace and a green build. Spec: `_dev/docs/spec/phase-1-bootstrap.md`.

- [x] **1.1** Yarn 4 workspace root — corepack/yarn 4.13.0, `.yarnrc.yml` (node-modules linker, no private scope), root `package.json` (private + workspaces), `tsconfig.base.json`, prettier + ESLint flat config, `.gitignore`, green `yarn install`; public README (project description, install/build, in-dev mark).
- [x] **1.2** `primer-a2ui-adapter` skeleton — package (tsc build + vitest), placeholder `catalog-id.ts` / `catalog.ts` / `catalogs/v0.9.1/catalog.json` (`TODO(phase-2)` stubs), `index.ts` barrel, empty `components/`, one smoke test; green build/typecheck/lint/test.
- [x] **1.3** `client` skeleton — Vite + React 19 + TS, Primer `ThemeProvider`+`BaseStyles`, imports adapter placeholder (proves workspace edge), `@a2ui/react`+`@a2ui/web_core` installed, static "bootstrap OK" page, one smoke test; green.
- [x] **1.4** Root orchestration — `build:all` / `test:all` / `lint:all` / typecheck via `yarn workspaces foreach --topological-dev`; verify whole-repo green.

Order: 1.1 first. 1.2 and 1.3 are parallel-eligible after 1.1 (1.3's adapter-import check needs 1.2's `index.ts` present first). 1.4 last (needs 1.2 + 1.3 green).

## Phase 2 — Test space & first catalog component [WIP]
One component (`Text` + `Button`) taken completely through the stack — render and interaction — as a vertical slice that proves the adapter renders and reacts correctly. Spec: `_dev/docs/spec/phase-2-complete-component-slice.md`.

- [x] **2.1** Adapter catalog foundation + `Text` — from-scratch `PRIMER_CATALOG` over `CommonSchemas` (not `basicCatalog`); `Text` zod schema + Primer render; the local `console.log` function registered; hand-authored `catalog.json` (`$ref` common_types, basic-style `$defs` envelope incl. `anyFunction`); zod↔`catalog.json` parity test; adapter render test. The first component end-to-end.
- [x] **2.2** Adapter `Button` (both action shapes) — `Button` zod schema (`child` → `Text`, `variant`, `action`) + Primer render; extends catalog + `catalog.json` + parity test; adapter render test. Also harden the parity test (carried from the 2.1 review): assert the `component`/`call` discriminator consts equal their keys, assert `returnType.const`, assert args required-ness, and loop over components/functions instead of copy-pasting per-entry assertions.
- [WIP] **2.3** Client test space + path-1 + Playwright baselines — replace the bootstrap page with the canned-fixture harness (`MessageProcessor` → `A2uiSurface`, `catalogId = PRIMER_CATALOG_ID`); vitest render tests; path-1 (`functionCall` runs locally); path-2 with mocked transport; Playwright visual-regression baselines for `Text`/`Button`.
- [ ] **2.4** Deterministic A2A server — `agent/` (uv): `A2AStarletteApplication` + custom `AgentExecutor` returning canned A2UI on the Button `event`; pytest for the executor + `catalog.json` conformance of its output. No ADK/LLM/MCP.
- [ ] **2.5** Event round-trip integration + manual verify — wire the real A2A client middleware as the `actionHandler` (event → wire → server → response back into the same processor → re-render); the genuine FE↔server manual wire round-trip; Claude Chrome live confirmation.

Order: 2.1 → 2.2 → (2.3 ∥ 2.4) → 2.5. 2.3 and 2.4 are parallel-eligible after 2.2 (both depend only on the catalog, not each other); 2.5 needs 2.3 + 2.4.

## Phase 2.5 — Templatization baseline
Lift an FE-only baseline template from the post-Phase-2 shape — a checkpoint extraction, not a release. Plan: `_dev/docs/templatization-plan.md`.

## Phase 3 — Catalog-writing harness
The repeatable component-authoring workflow, captured as a project skill. Also set up the daily-work harness's deferred autonomous layer (nightly routine + its GitHub issue/label machinery) here, ready for Phase 4.

## Phase 4 — Catalog build-out
The Primer primitives and GitHub-semantic components the demo needs.

## Phase 5 — Agent
The agent that generates A2UI surfaces from the catalog, against the live GitHub repo.

## Phase 6 — Demo integration
The full maintainer-triage arc running end-to-end on the live a2ui repo.

## Post-Phase 6 — Template finalization
Additively fold the catalog-writing skill (Phase 3) and the agent scaffold (Phase 5) into the template repo; finalize as the adoptable A2UI template — its first real use. Plan: `_dev/docs/templatization-plan.md`.

## Backlog
- Diff viewer (stretch)
- Agent template memory
- Read + write loop on a seeded sandbox repo
