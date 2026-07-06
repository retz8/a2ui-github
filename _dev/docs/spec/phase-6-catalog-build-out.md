# Phase 6 — Catalog build-out

The phase that ships the Primer leaf catalog the Phase-7 agent composes screens from.
Parent: `_dev/TODO.md` Phase 6; SPEC.md §1 (leaf-only catalog), §3 (demo), §4 (catalog level).
Component inventory this phase draws from: `_dev/docs/primer-react-full-list.md`.

## Scope

- Ship, as validated A2UI catalog leaves, **every main-entry `@primer/react` component** (with the
  exclusions below) — not a demo-derived subset. The catalog is the deliverable; the agent that
  composes it is Phase 7.
- **Leaf vocabulary only.** No screen composition, no hand-composed demo screens in this phase. The
  5-beat demo arc (SPEC §3) is a Phase-7/8 concern and does **not** gate Phase 6.
- Each component is validated in isolation by the existing Phase-4 build gates (adapter schema +
  render tests · client fixtures + Playwright baselines + bless · agent conformance where the
  component emits events) — not by any assembled screen.
- Also in scope: three existing threads that must land inside this phase — the registry-driven
  catalog smoke-test refactor, the `Text`/`Button` client-fixture backfill, and the deferred
  `Button.icon` backfill.

## Locked decisions

### 1. Deliverable frame — validated leaf vocabulary, composition deferred

Phase 6 ships the leaf catalog only. Screen composition (PR-list, PR-detail, diff, etc.) is the
agent's job in Phase 7, per SPEC §1's "the agent composes views from primitives — never a bespoke
component." The demo arc informs nothing in this phase's selection or validation.

### 2. Ship set — all main-entry components, three exclusions, plus Icon

Ship all 58 `@primer/react` **main-entry** components minus three: `CircleBadge` and
`TextInputWithTokens` (deprecated even though main-entry — shipping them would teach the agent to
compose avoid-flagged components) and `Portal` (a rendering utility, not a composable leaf). Add
**`Icon`**, wrapping `@primer/octicons-react` (Primer's own `Octicon` is deprecated-only). `Text`
and `Button` are already shipped. Experimental-, deprecated-, and next-entry components are out of
scope; the catalog "grows lazily" (SPEC §4) if a later flow needs one.

### 3. Ordering — dependency layers, Icon first, deferral as the release valve

The only real inter-component coupling is an **element-typed slot prop** — a component that renders
another in a slot (Button's `icon`, ActionList's leading/trailing visual, Timeline's badge,
FormControl's wrapped input). Build the referenced leaf before its slotter so the slot binds a real
`ComponentId` rather than being deferred. Three layers:

- **L0 — content leaves (no child slots), built first, `Icon` leading the whole phase:** Icon,
  Heading, Link, BranchName, RelativeTime, Label, StateLabel, CounterLabel, Token, Avatar, Spinner,
  ProgressBar, Checkbox, Radio, ToggleSwitch, Textarea, SkeletonBox, Truncate, KeybindingHint.
- **L1 — single-type containers / simple slotters:** Stack, Flash, Details, LabelGroup, AvatarStack,
  ButtonGroup, IconButton, TextInput, Select, SegmentedControl, Pagination.
- **L2 — composite / multi-slot / overlay:** PageLayout, SplitPageLayout, PageHeader, Header,
  ActionList, ActionMenu, ActionBar, NavList, SubNav, UnderlineNav, Breadcrumbs, TreeView, Timeline,
  FormControl, CheckboxGroup, RadioGroup, SelectPanel, Autocomplete, Dialog, ConfirmationDialog,
  Overlay, AnchoredOverlay, Popover.

Order within a layer is free (no coupling) — those are the parallel batches. Cross-layer, a later
component may still **defer** a slot rather than wait, and backfill it once the referenced leaf
exists (`deferred-catalog-work.md` is the register).

### 4. Granularity — one component per `6.M`, design-interactive / build-automated

Each component is one `6.M` sub-task, grouped under the L0/L1/L2 headings, intra-layer ones
parallel-eligible. The human input is the ~10-min interactive design step; the build is automated.
Per-component flow: interactive `design-catalog-component` session (on `main`) → decision doc → 
`delegate-task` → nightly `build-catalog-component` → `review-nightly` merge → tick. Phase 6 builds
**no new infrastructure**; if a component needs infra that doesn't exist (e.g. overlay rendering for
Dialog), that is a deferral, per the build skill's "consumes, never builds infra" rule.

### 5. Component-sub-task workflow divergence (component `6.M` only)

Component sub-tasks follow a different track from the normal three-route one; `6.1/6.3/6.4` (the
non-component tasks) keep the normal track. For a component sub-task:

- **Planning route is `design-catalog-component`, sole option** — not the generic
  grill / writing-plans / plan-mode trio. Its internal human-gated prompt is the grill.
- **The contract artifact is the decision doc** under `_dev/docs/new-components/<component>.md` (the
  design↔build contract), **not** a `task-<N.M>` spec under `_dev/docs/spec/`.
- **`delegate-task` for a component points** its issue **References** at that decision-doc path, names
  **`build-catalog-component`** as the Execution skill, and names **no Plan skill**.

This is forced entirely through **this spec plus the existing autonomous contract's `References` +
`Execution skill` fields** (the issue body is the sole authority on which skills the nightly routine
runs). **No edit to the nightly prompt or any harness skill** — a component-specific nightly paragraph
would duplicate the contract routing and cost the harness its project-agnosticism.

### 6. Opening (non-component) sub-tasks and the two backfills

- **`6.1` — registry-driven catalog smoke-test refactor, first.** Replace the per-component `has()`
  assertions in the catalog smoke test with one exact-set assertion against the parity registry, and
  update the Build skill's steps 5/7 to that single touch-point. Must precede all components so
  adding ~55 of them isn't ~55 `has()` edits and skill contradictions. (From the Phase-6 backlog.)
- **`6.2` — `Icon`.** First component; unblocks the Button icon backfill and every leading/trailing
  visual.
- **`6.3` — `Text` client-fixture backfill.** Bring `Text`'s fixtures/baselines up to the exhaustive
  per-prop standard the Phase-4 skills now prescribe. No dependency; placed early to prove the
  standard on the simplest component. (From the backlog.)
- **`6.4` — Button revisit.** Add the deferred `Button.icon` prop as a `ComponentId` child (now that
  `Icon` exists) and backfill Button's fixtures/baselines to the exhaustive standard, in one
  sub-task. Also fold in the one-line `deferred-catalog-work.md` label fix ("Phase 5 → Phase 6").
  (From `deferred-catalog-work.md` + the backlog.)

Then the remaining L0 components, then L1, then L2.

## Invariants

- The demo arc never gates Phase 6; no screen is assembled here.
- Descriptions and decisions are settled in each component's design session, not pre-decided in this
  spec.
- Deferral (recorded in `deferred-catalog-work.md`) is the standing release valve for any missing
  slot-referenced component or missing infrastructure.

## Open items

- **Per-component compound/subcomponent mapping** (e.g. `ActionList.Item`, `Dialog.Body`,
  `Timeline.Badge`) — how each Primer compound surface maps to a leaf schema (single schema with
  children, or deferral) is left to that component's own `design-catalog-component` session, not
  pre-decided here.
</content>
