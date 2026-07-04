# a2ui-github — Dev TODO

## Phase 1 — Bootstrap [done]
Stand up the monorepo workspace and a green build. Spec: `_dev/docs/spec/phase-1-bootstrap.md`.

- [x] **1.1** Yarn 4 workspace root — corepack/yarn 4.13.0, `.yarnrc.yml` (node-modules linker, no private scope), root `package.json` (private + workspaces), `tsconfig.base.json`, prettier + ESLint flat config, `.gitignore`, green `yarn install`; public README (project description, install/build, in-dev mark).
- [x] **1.2** `primer-a2ui-adapter` skeleton — package (tsc build + vitest), placeholder `catalog-id.ts` / `catalog.ts` / `catalogs/v0.9.1/catalog.json` (`TODO(phase-2)` stubs), `index.ts` barrel, empty `components/`, one smoke test; green build/typecheck/lint/test.
- [x] **1.3** `client` skeleton — Vite + React 19 + TS, Primer `ThemeProvider`+`BaseStyles`, imports adapter placeholder (proves workspace edge), `@a2ui/react`+`@a2ui/web_core` installed, static "bootstrap OK" page, one smoke test; green.
- [x] **1.4** Root orchestration — `build:all` / `test:all` / `lint:all` / typecheck via `yarn workspaces foreach --topological-dev`; verify whole-repo green.

Order: 1.1 first. 1.2 and 1.3 are parallel-eligible after 1.1 (1.3's adapter-import check needs 1.2's `index.ts` present first). 1.4 last (needs 1.2 + 1.3 green).

## Phase 2 — Test space & first catalog component [done]
One component (`Text` + `Button`) taken completely through the stack — render and interaction — as a vertical slice that proves the adapter renders and reacts correctly. Spec: `_dev/docs/spec/phase-2-complete-component-slice.md`.

- [x] **2.1** Adapter catalog foundation + `Text` — from-scratch `PRIMER_CATALOG` over `CommonSchemas` (not `basicCatalog`); `Text` zod schema + Primer render; the local `console.log` function registered; hand-authored `catalog.json` (`$ref` common_types, basic-style `$defs` envelope incl. `anyFunction`); zod↔`catalog.json` parity test; adapter render test. The first component end-to-end.
- [x] **2.2** Adapter `Button` (both action shapes) — `Button` zod schema (`child` → `Text`, `variant`, `action`) + Primer render; extends catalog + `catalog.json` + parity test; adapter render test. Also harden the parity test (carried from the 2.1 review): assert the `component`/`call` discriminator consts equal their keys, assert `returnType.const`, assert args required-ness, and loop over components/functions instead of copy-pasting per-entry assertions.
- [x] **2.3** Client test space + path-1 + Playwright baselines — replace the bootstrap page with the canned-fixture harness (`MessageProcessor` → `A2uiSurface`, `catalogId = PRIMER_CATALOG_ID`); vitest render tests; path-1 (`functionCall` runs locally); path-2 with mocked transport; Playwright visual-regression baselines for `Text`/`Button`.
- [x] **2.4** Deterministic A2A server — `agent/` (uv): `A2AStarletteApplication` + custom `AgentExecutor` returning canned A2UI on the Button `event`; pytest for the executor + `catalog.json` conformance of its output. No ADK/LLM/MCP.
- [x] **2.5** Event round-trip integration + manual verify — wire the real A2A client middleware as the `actionHandler` (event → wire → server → response back into the same processor → re-render); the genuine FE↔server manual wire round-trip; Claude Chrome live confirmation.

Order: 2.1 → 2.2 → (2.3 ∥ 2.4) → 2.5. 2.3 and 2.4 are parallel-eligible after 2.2 (both depend only on the catalog, not each other); 2.5 needs 2.3 + 2.4.

## Phase 3 — Templatization baseline [done]
Lift an FE + deterministic-agent baseline template from the post-Phase-2 shape — a checkpoint extraction, not a release. Spec: `_dev/docs/spec/phase-3-templatization-baseline.md`. Plan: `_dev/docs/templatization-plan.md`.

- [x] **3.1** Templatized code tree — create `adapter-template/` and extract the adapter + client + deterministic-agent scaffolds: domain content stripped (empty `components/`/`fixtures/`, stubbed executor, no `console-log`), placeholdered in contents **and** paths (token-named adapter dir), root build config carried. Structural completeness; green is proven in 3.4.
- [x] **3.2** Templatized docs + `.claude/` — `SPEC.md` (placeholders + §3 authoring stub), `CLAUDE.md` (placeholders + pinned-ref fetch recipe parameterized by `{{version}}` + harness pointer, sync-spec machinery dropped), `README`, and a clean `settings.json` (no hook, harness not pre-enabled).
- [x] **3.3** Init skill — data-driven mechanical fill core (token scan → content+path substitution → dir rename → no-`{{...}}`-left assertion), plus the Claude-Code steps: §3 interview, `a2ui-sdk-design` fetch and harness install (both authored, live-run deferred), guarded self-delete.
- [x] **3.4** Verification — materialization smoke test (copy → fill with Primer/a2ui-github values → full `build:all`/`typecheck`/`lint`/`test:all` + agent `uv sync`/`pytest` green, zero tokens left, init files still present) + the agnosticism grep. The only place "green" is proven. Includes adding `**/.venv/**` to the eslint `ignores` (in reference + template together) so `eslint .` survives the agent venv — deferred from 3.1.

Order: (3.1 ∥ 3.2) → 3.3 → 3.4. 3.1 and 3.2 are parallel-eligible (code vs prose surfaces). 3.3 needs the placeholder inventory 3.1+3.2 define; 3.4 needs both the template content and a runnable init.

## Phase 4 — Catalog-component authoring skills [WIP]
Capture the repeatable component-authoring workflow (proven by hand in Phase 2) as TWO coupled project skills — `design-catalog-component` (interactive, human-gated) and `build-catalog-component` (autonomous-capable) — coupled through the per-component decision doc; validate by walking against the shipped `Text`/`Button`. Spec: `_dev/docs/spec/phase-4-catalog-authoring-skill.md`. Handles below are non-restrictive — each sub-task's scope is settled in its own grill.

Each surface sub-task (4.1–4.3) writes its design steps into the Design `SKILL.md` and its build/test steps into the Build & Test `SKILL.md` — building up both skills incrementally; 4.4 finalizes each.

- [x] **4.1** Adapter surface — adapter design procedure (prop-surface decision checklist → decision doc; establishes the decision-doc contract) + adapter build/test procedure, validated against the `Text`/`Button` adapter artifacts.
- [WIP] **4.2** Client surface — client design + build/test procedures, validated against the `Text`/`Button` client artifacts.
- [ ] **4.3** Agent-fixture surface — agent design + build/test procedures, validated against `Button`'s deterministic fixture.
- [ ] **4.4** Finalize both skills + end-to-end validation — `SKILL.md` frontmatter/overview/orchestration for each skill, and the full end-to-end walk (design → decision doc → build all three) against `Text` + `Button`.

Order: 4.1 → 4.2 → 4.3 → 4.4, strictly sequential — the surface sub-tasks share a write target (the two `SKILL.md` files). 4.1 establishes the decision-doc contract the later surfaces append to.

## Phase 5 — Autonomous-run layer
Near-rewrite of the daily-work harness's autonomous mechanism, shipped in `../daily-work-harness` (not this repo), ready for the Phase-6 build-out. Spec: `_dev/docs/spec/phase-5-autonomous-run-layer.md`. Handles below are non-restrictive — 5.1 in particular may ship more than named.

- [ ] **5.1** Autonomous producing routine — the nightly routine that picks a startable `N.M` off `main`, runs it, and opens a gated `phase-<N>/<M>-*` PR; GitHub issue/label machinery folded in; establishes the autonomous-run protocol.
- [ ] **5.2** `review-nightly` rewrite — the morning triage/merge counterpart consuming that protocol.

Order: 5.1 → 5.2 (the consuming side follows the contract the producing side defines). Cross-repo: commits land in `../daily-work-harness`; tracked here, no `a2ui-github` worktree.

## Phase 6 — Catalog build-out
The Primer primitives and GitHub-semantic components the demo needs.

## Phase 7 — Agent
The agent that generates A2UI surfaces from the catalog, against the live GitHub repo.

## Phase 8 — Demo integration
The full maintainer-triage arc running end-to-end on the live a2ui repo.

## Post-Phase 8 — Template finalization
Additively fold the catalog-authoring skill (Phase 4) and the agent scaffold (Phase 7) into the template repo; finalize as the adoptable A2UI template — its first real use. Plan: `_dev/docs/templatization-plan.md`.

## Backlog
- Registry-driven catalog smoke test (at Phase 6 start): replace the per-component `has()` assertions in `catalog.test.ts` with one exact-set assertion against the parity test's `COMPONENTS`/`FUNCTIONS` registry; update the Build skill's steps 5/7 to the single registry touch-point in the same change.
- Diff viewer (stretch)
- Agent template memory
- Read + write loop on a seeded sandbox repo
