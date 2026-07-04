# Phase 4 — Catalog-component authoring skills

Covers the TODO `## Phase 4 — Catalog-component authoring skill`. Captures the repeatable component-authoring workflow — proven by hand in Phase 2 — as project Claude skills, split along the human-input boundary. This is a high-level phase spec; each sub-task's real scope is settled in its own grill and the handles below do not restrict it.

## Scope

- The Phase-2-proven loop for adding one component to the catalog end-to-end across the three surfaces (adapter, client, deterministic agent), captured as **two coupled project skills** rather than one: a **Design** skill (interactive, human-gated) and a **Build & Test** skill (autonomous-capable).
- The skills are validated against the already-shipped `Text`/`Button` components — no new component is authored in this phase.

Out of scope: authoring any new catalog component (that is the Phase 6 build-out); the autonomous-run layer (Phase 5), which consumes the Build & Test skill.

## Locked decisions

### 1. Two coupled skills, split at the human-input boundary

The workflow is captured as two skills, not one. The split lands where three boundaries coincide: **human-input vs. none**, **interactive vs. autonomous**, and **design vs. mechanical**.

- **Design** — interactive, human-gated. Captures the decision-needing part of each surface.
- **Build & Test** — autonomous-capable, no human input. Mechanically materializes each surface. This is what the Phase-5 nightly routine runs.

The two skills depend on each other through a handoff artifact (decision 2).

### 2. The handoff contract — the component decision doc

The Design skill produces a per-component decision doc; the human reviews it; the Build & Test skill consumes it. The doc must fully pin the surface so the Build & Test skill runs deterministically with no human to resolve ambiguity. This same completeness bar is the Phase-5 precondition: an autonomous run consumes a pre-supplied decision doc and never makes the design call itself.

### 3. Decision-doc location is a project convention

The skills refer to "the project's component-decision location," not a hardcoded path — it is a write target for a per-run output, so it is reconfigurable on extraction. For this project that location is `_dev/docs/new-components/<component-name>.md`. It is a planning-time artifact written on `main` (a sibling to `_dev/docs/plan/` and `_dev/docs/spec/`), and it is kept.

### 4. One shared decision doc per component; surfaces append

Each component has a single decision doc — the component's design record, distinct from the sub-task plans in `_dev/docs/plan/`. Its core is the adapter prop-surface table; the client and agent surfaces append their sections to the same doc.

### 5. The Design skill's core — the prop-surface decision checklist

The prop-surface design is the judgment step and the bulk of a component's design. The Design skill structures it as **input → design call → locked output**:

- **Two inputs:** the component's official documentation URL (human-provided — the documented surface and the prose semantics that feed de-branded descriptions), and the component's real prop surface resolved from its installed type declarations (agent-resolved — the exhaustive true surface, driving the carry/drop/defer triage).
- **The design call (human gate):** the agent runs the checklist against both inputs and proposes a prop-surface table — each prop as carry/drop/defer, synthetic-or-not, its A2UI type, and its description. The human locks it.
- **The output** is the locked table, recorded in the decision doc.

The real-prop resolution method is prescribed concretely but kept design-system-agnostic — no design-system- or path-specific detail baked into the steps.

### 6. Skills are self-contained; authoring conventions are embedded

The prop-surface checklist embeds the catalog-authoring conventions directly rather than pointing out for them, so each skill travels self-contained on extraction. Only `a2ui-sdk-design`'s **spec-navigation** guidance stays a pointer — a distinct job (navigating the external protocol repo), not part of the per-component loop. The skills carry no dependency on `_dev/docs` findings.

### 7. No zod→`catalog.json` generator

No generator is authored. The existing structural parity test is the drift guard between the two hand-authored schema representations. The skills capture the loop with the parity test.

### 8. Validation is a paper-walk against the shipped `Text`/`Button`

Each skill is "done" when walking it against the already-shipped `Text` and `Button` reproduces the existing green repo artifacts — the Design skill reproduces their design decisions, the Build & Test skill reproduces their code artifacts. This is the acceptance gate, with no throwaway component.

### 9. Output model — incremental writing into two `SKILL.md` files

Each surface sub-task writes its steps directly into the two `SKILL.md` files: its design steps into the Design skill's `SKILL.md`, its build/test steps into the Build & Test skill's `SKILL.md`. By the end of the last surface sub-task, the body of both files is substantially written; the finalize sub-task completes each skill and runs the end-to-end walk. Surface procedures are sections within each `SKILL.md`, not separate per-surface reference docs. Worked-example code appears as teaching-sized inline snippets, not a full reproduction of both components; the full ground truth stays in the repo for the validation walk.

### 10. Decomposition — by surface, sequential, each feeding both skills

The surface stays the unit of work; the two skills are the unit of output. Each surface sub-task carries that surface's design procedure (into the Design skill) and its build/test procedure (into the Build & Test skill):

- **4.1** — adapter surface; establishes the decision-doc contract.
- **4.2** — client surface.
- **4.3** — agent-fixture surface.
- **4.4** — finalize both skills (frontmatter, overview, orchestration) and run the full end-to-end walk against `Text` + `Button`.

Order is strictly sequential — **4.1 → 4.2 → 4.3 → 4.4** — because the surface sub-tasks share a write target (the two `SKILL.md` files).

### 11. File layout — two skill folders

Two skills live at `.claude/skills/design-catalog-component/` and `.claude/skills/build-catalog-component/` (working names). Each is a `SKILL.md` carrying its surface sections; `references/` is not used per surface, and remains available only as a pressure valve for heavy snippets at finalize. The single `new-catalog-component` folder is retired.

## Invariants

- Sub-task handles in this spec are non-restrictive — a sub-task may expand or shrink in its own grill.
- No new catalog component is authored in this phase; validation runs against the existing `Text`/`Button`.
- The Build & Test skill takes no human input; anything requiring a human decision belongs in the Design skill and its decision doc.

## Open items

- None.
