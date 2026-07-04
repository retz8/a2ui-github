# Phase 4 — Catalog-component authoring skill

Covers the TODO `## Phase 4 — Catalog-component authoring skill`. Captures the repeatable component-authoring workflow — proven by hand in Phase 2 — as a project Claude skill. This is a high-level phase spec; each sub-task's real scope is settled in its own grill and the handles below do not restrict it.

## Scope

- A new project skill, working name `new-catalog-component`, that captures the repeatable loop for adding one component to the catalog end-to-end across the three Phase-2 surfaces (adapter, client, deterministic agent).
- The skill is validated against the already-shipped `Text`/`Button` components — no new component is authored in this phase.

Out of scope: authoring any new catalog component (that is the Phase 6 build-out); the autonomous-run layer (Phase 5).

## Locked decisions

### 1. A new, separate project skill — not an extension of `a2ui-sdk-design`

The workflow is captured as its own project skill (`new-catalog-component`), distinct from the existing `a2ui-sdk-design` skill. `a2ui-sdk-design` is design-principles/spec-navigation guidance that originates from the official a2ui project; the new skill is the procedure for shipping a component. The two have different jobs and different trigger moments.

### 2. `a2ui-sdk-design` is a lightweight reference, not a source to fold in

The new skill references `a2ui-sdk-design` only as a pointer to where the official spec and docs live. It does not copy from it, restate it, or fold it in.

### 3. Validation is a paper-walk against the shipped `Text`/`Button`

The skill is "done" when walking it against the already-shipped `Text` and `Button` reproduces the existing green repo artifacts. This is the acceptance gate — a paper validation against the two complete Phase-2 components, with no throwaway component and no early Phase-6 spend.

### 4. No zod→`catalog.json` generator

The Phase-2 open item deferring a zod→`catalog.json` generator "to the catalog-writing harness" is deprecated and dropped. The official a2ui project ships no such generator; the existing schema-parity test is sufficient. The skill captures the loop with the parity test, not a generator.

### 5. Decomposition — by surface, mirroring Phase 2

The phase decomposes by the three Phase-2 surfaces (adapter / client / agent), each a digestible, self-validating unit, then a final assembly:

- **4.1** — adapter-authoring procedure, validated against the `Text`/`Button` adapter artifacts.
- **4.2** — client-authoring procedure, validated against the `Text`/`Button` client artifacts.
- **4.3** — agent-fixture procedure, validated against `Button`'s deterministic fixture.
- **4.4** — skill assembly into the coherent `SKILL.md` plus the full end-to-end validation walk against `Text` + `Button`.

### 6. File layout — `SKILL.md` + per-surface reference docs

The skill lives at `.claude/skills/new-catalog-component/`. Each surface procedure is its own reference doc under `references/`; the top-level `SKILL.md` is the overview and the orchestration that routes to them. This layout is fixed across all four sub-tasks — not a per-sub-task choice:

- **4.1** → `references/adapter.md`
- **4.2** → `references/client.md`
- **4.3** → `references/agent-fixture.md`
- **4.4** → `SKILL.md` (frontmatter, overview, orchestration) + the end-to-end validation walk.

## Invariants

- Sub-task handles in this spec are non-restrictive — a sub-task may expand or shrink in its own grill.
- No new catalog component is authored in this phase; validation runs against the existing `Text`/`Button`.

## Open items

- None.
