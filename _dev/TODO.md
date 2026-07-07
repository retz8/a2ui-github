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

## Phase 4 — Catalog-component authoring skills [done]
Capture the repeatable component-authoring workflow (proven by hand in Phase 2) as TWO coupled project skills — `design-catalog-component` (interactive, human-gated) and `build-catalog-component` (autonomous-capable) — coupled through the per-component decision doc; validate by walking against the shipped `Text`/`Button`. Spec: `_dev/docs/spec/phase-4-catalog-authoring-skill.md`. Handles below are non-restrictive — each sub-task's scope is settled in its own grill.

Each surface sub-task (4.1–4.3) writes its design steps into the Design `SKILL.md` and its build/test steps into the Build & Test `SKILL.md` — building up both skills incrementally; 4.4 finalizes each.

- [x] **4.1** Adapter surface — adapter design procedure (prop-surface decision checklist → decision doc; establishes the decision-doc contract) + adapter build/test procedure, validated against the `Text`/`Button` adapter artifacts.
- [x] **4.2** Client surface — client design + build/test procedures, validated against the `Text`/`Button` client artifacts.
- [x] **4.3** Agent-fixture surface — agent design + build/test procedures, validated against `Button`'s deterministic fixture.
- [x] **4.4** Finalize both skills + end-to-end validation — `SKILL.md` frontmatter/overview/orchestration for each skill, and the full end-to-end walk (design → decision doc → build all three) against `Text` + `Button`.

Order: 4.1 → 4.2 → 4.3 → 4.4, strictly sequential — the surface sub-tasks share a write target (the two `SKILL.md` files). 4.1 establishes the decision-doc contract the later surfaces append to.

## Phase 5 — Autonomous-run layer [done]
Build the autonomous half of the daily-work harness properly and make it project-agnostic, shipped in `../daily-work-harness` (not this repo), ready for the Phase-6 build-out. Spec: `_dev/docs/spec/phase-5-autonomous-run-layer.md`. Handles below are non-restrictive — each sub-task's scope is settled in its own grill.

- [x] **5.1** `/delegate-task` + issue/label contract — the human-facing skill projecting a task (spec'd `N.M`, or standalone hotfix/chore) into a GitHub issue with fixed format + labels; defines the protocol the other pieces consume, including "blocked/needs-input" as a first-class state (label on a real, non-draft PR).
- [x] **5.2** Autonomous producing routine — a project-agnostic `.md` prompt in the harness repo that reads open labeled issues, runs one task, and opens a gated `phase-<N>/<M>-*` PR linked to its issue; `/schedule` registers it as a nightly cloud Routine.
- [x] **5.3** `review-nightly` rewrite — the morning triage/merge counterpart: case-1 (ready → merge → close PR+issue → `wrap-up` tick) and case-2 (blocked → spec change + PR comment → re-delegate or fix via worktree off the PR branch); finalizes the single harness doc.

Order: 5.1 → 5.2 → 5.3, strictly sequential — contract-first, and the consuming side follows the contract the producing side defines. Cross-repo: commits land in `../daily-work-harness`; tracked here, no `a2ui-github` worktree.

## Phase 6 — Catalog build-out [WIP]
Ship every main-entry `@primer/react` component as a validated A2UI catalog leaf (the Phase-7 agent composes screens from them). Leaf vocabulary only — no screen composition here. Spec: `_dev/docs/spec/phase-6-catalog-build-out.md`. Inventory: `_dev/docs/primer-react-full-list.md`.

**Component sub-tasks use a divergent track** (not 6.1/6.3/6.4): sole planning route is `design-catalog-component` → decision doc at `_dev/docs/new-components/<component>.md` (not a `task-<N.M>` spec); `delegate-task` points References at that doc, names `build-catalog-component` as Execution skill, no Plan skill. Per spec §5.

- [x] **6.1** Registry-driven catalog smoke-test refactor — replace per-component `has()` assertions with one exact-set assertion against the parity registry; update Build skill steps 5/7 to that single touch-point. First, before any component.
- [x] **6.2** `Icon` — wraps `@primer/octicons-react`; unblocks Button's icon backfill + every leading/trailing visual. (#3)
- [x] **6.3** `Text` client-fixture backfill — bring `Text` fixtures/baselines to the exhaustive per-prop standard. (#4)
- [ ] **6.4** Button revisit — add deferred `Button.icon` (`ComponentId` child, now that `Icon` exists) + backfill Button fixtures/baselines.

### L0 — content leaves (no child slots)
- [ ] **6.5** `Heading`
- [ ] **6.6** `Link`
- [ ] **6.7** `BranchName`
- [ ] **6.8** `RelativeTime`
- [ ] **6.9** `Label`
- [ ] **6.10** `StateLabel`
- [ ] **6.11** `CounterLabel`
- [ ] **6.12** `Token`
- [ ] **6.13** `Avatar`
- [ ] **6.14** `Spinner`
- [ ] **6.15** `ProgressBar`
- [ ] **6.16** `Checkbox`
- [ ] **6.17** `Radio`
- [ ] **6.18** `ToggleSwitch`
- [ ] **6.19** `Textarea`
- [ ] **6.20** `SkeletonBox`
- [ ] **6.21** `Truncate`
- [ ] **6.22** `KeybindingHint`

### L1 — single-type containers / simple slotters
- [ ] **6.23** `Stack`
- [ ] **6.24** `Flash`
- [ ] **6.25** `Details`
- [ ] **6.26** `LabelGroup`
- [ ] **6.27** `AvatarStack`
- [ ] **6.28** `ButtonGroup`
- [ ] **6.29** `IconButton`
- [ ] **6.30** `TextInput`
- [ ] **6.31** `Select`
- [ ] **6.32** `SegmentedControl`
- [ ] **6.33** `Pagination`

### L2 — composite / multi-slot / overlay
- [ ] **6.34** `PageLayout`
- [ ] **6.35** `SplitPageLayout`
- [ ] **6.36** `PageHeader`
- [ ] **6.37** `Header`
- [ ] **6.38** `ActionList`
- [ ] **6.39** `ActionMenu`
- [ ] **6.40** `ActionBar`
- [ ] **6.41** `NavList`
- [ ] **6.42** `SubNav`
- [ ] **6.43** `UnderlineNav`
- [ ] **6.44** `Breadcrumbs`
- [ ] **6.45** `TreeView`
- [ ] **6.46** `Timeline`
- [ ] **6.47** `FormControl`
- [ ] **6.48** `CheckboxGroup`
- [ ] **6.49** `RadioGroup`
- [ ] **6.50** `SelectPanel`
- [ ] **6.51** `Autocomplete`
- [ ] **6.52** `Dialog`
- [ ] **6.53** `ConfirmationDialog`
- [ ] **6.54** `Overlay`
- [ ] **6.55** `AnchoredOverlay`
- [ ] **6.56** `Popover`

Order: 6.1 first → 6.2 `Icon` → 6.3 → 6.4 → L0 → L1 → L2. Within a layer, sub-tasks are parallel-eligible (no coupling); cross-layer, a later slotter may defer a slot rather than wait and backfill once the referenced leaf exists (`deferred-catalog-work.md`).

## Phase 7 — Agent
The agent that generates A2UI surfaces from the catalog, against the live GitHub repo.

## Phase 8 — Demo integration
The full maintainer-triage arc running end-to-end on the live a2ui repo.

## Post-Phase 8 — Template finalization
Additively fold the catalog-authoring skill (Phase 4) and the agent scaffold (Phase 7) into the template repo; finalize as the adoptable A2UI template — its first real use. Plan: `_dev/docs/templatization-plan.md`.

## Backlog
- Registry-driven catalog smoke test (at Phase 6 start): replace the per-component `has()` assertions in `catalog.test.ts` with one exact-set assertion against the parity test's `COMPONENTS`/`FUNCTIONS` registry; update the Build skill's steps 5/7 to the single registry touch-point in the same change.
- Client fixture backfill: the shipped `Text`/`Button` client fixtures + Playwright baselines lag the exhaustive per-prop standard the catalog-authoring skills now prescribe — `Button` ships 3 of 11 prop-walk fixtures, `Text` 2 of 6. Backfill the missing fixtures + baselines. Sets enumerated in `_dev/docs/new-components/{text,button}.md`.
- Diff viewer (stretch)
- Agent template memory
- Read + write loop on a seeded sandbox repo
