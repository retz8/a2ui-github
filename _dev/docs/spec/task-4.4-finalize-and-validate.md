# Task 4.4 — Finalize both skills + end-to-end validation

Covers TODO item **4.4** under Phase 4 (`_dev/docs/spec/phase-4-catalog-authoring-skill.md`). The three surface sub-tasks (4.1–4.3) wrote the body of both `SKILL.md` files; this task completes their scaffolding, restructures both for concision, and runs the acceptance walk against the shipped `Text`/`Button`.

## Scope

- Finalize the scaffolding of both skills — frontmatter, overview, orchestration — around the already-written surface sections.
- Restructure both `SKILL.md` files to remove verbosity and repetition surfaced against the `writing-skills` norms.
- Run the phase's acceptance gate (spec #8): validate both skills against the already-shipped `Text` and `Button`, producing two kept decision docs and correcting the skills where the walk reveals defects.

## Locked decisions

### 1. Skill names are final

`design-catalog-component` and `build-catalog-component` are locked verbatim as both the folder names and the frontmatter `name` — no rename.

### 2. Frontmatter descriptions are trigger-only

Each `description` states **when to use** the skill and nothing about its workflow — a workflow summary in the description causes agents to follow it instead of reading the skill (`writing-skills` SDO rule). Each description cross-references the other skill (kept from the earlier draft). Design is framed as the interactive, human-gated counterpart; Build as the autonomous counterpart / what an autonomous run executes. Locked wording:

- **design:** `Use when adding a new component to the A2UI catalog and its design decisions need a human in the loop — the interactive, human-gated counterpart to build-catalog-component.`
- **build:** `Use when materializing a new A2UI catalog component from a completed component decision doc, with no human input — the autonomous counterpart to design-catalog-component; what an autonomous run executes.`

### 3. Overview section — mental model + decision-doc location, no procedure

Each skill opens with an overview carrying: the mental model (a catalog component is one leaf spanning the adapter, client, and deterministic-agent surfaces; the workflow is two coupled skills split at the human-input boundary; which half this skill is), and the decision-doc location convention pulled up from mid-body to a single canonical statement here. No procedure or sequencing in the overview.

### 4. Orchestration section — placement and content

A dedicated `##` orchestration section sits second, after the overview and before the surface sections. It states: the fixed surface order (adapter → client → agent) and why (data dependency — client fixtures derive from the locked adapter table, agent responses from that table's `event`-shaped `Action` rows); the skip rule (a component that doesn't reach a surface gets no section — canonically, no `event` action → no agent section); and the symmetric handoff — Design ends with the human locking the complete doc and handing to Build, Build begins by consuming that locked doc.

### 5. Handoff granularity — all-of-Design → single review → all-of-Build

The Design→Build handoff is all-then-all: Design produces the complete decision doc (all applicable surface sections), a single human review/lock follows, then Build materializes all surfaces. Not interleaved per surface. Build's orchestration also states the Phase-5 framing: the decision doc's completeness bar is what lets an autonomous run execute Build end-to-end.

### 6. Restructure to remove verbosity (level "b": hoist + cut + extract)

Both files are far over the `writing-skills` concision norms because run-wide invariants are restated per surface, meta-narration describes the writing instead of instructing, and heavy code dominates. The restructure:

- **Hoist run-wide invariants into orchestration, stated once** — the human-gate definition, the append-convention, "no human input / Design decided, Build transcribes," the infra-assumption, the auto-cover/no-op principle, and "descriptions copied verbatim." Surface sections stop re-declaring them.
- **Cut meta-narration** — sentences that describe the document rather than instruct.
- **Remove repo-history footnotes from the skills** — a2ui-github-specific notes (the shipped repo predating the exhaustive-fixture standard; `button-event`'s incidental binding) break self-containment; they move to the Build read-comparison notes / handoff, where the walk needs them anyway.

### 7. `references/` scope — Build only, one file

Build gets `references/worked-example.md`, organized by surface (adapter / client / agent), holding the full `Text`+`Button` artifacts (complete test files, full `catalog.json` component and function entries, full fixtures, the Python response/mapping). Each Build `SKILL.md` step keeps one trimmed mapping example inline. Design stays single-file — after the hoist+cut it carries no heavy reference to extract.

### 8. The `a2ui-sdk-design` spec-navigation pointer

Left where it is in the Design skill; not added to Build (Build never navigates the protocol spec). The finalize sections introduce no new pointers.

### 9. Validation walk — clean-context delegation of the Design half

After both `SKILL.md` files are finalized and restructured, the Design walk is delegated to fresh `general-purpose` subagents so the skill's self-containment is genuinely tested (the authors would otherwise reproduce the shipped decisions from memory). Two subagents run in parallel, one per component (`Text`, `Button`), each given only the finalized skill and the shipped repo. Each produces its component decision doc plus a self-flagged list of `not sure` rows. The subagent self-resolves every design call — there is no human gate in the walk.

### 10. Walk scope — Design delegated, Build read-comparison in-context

The generative Design half is delegated (needs clean context). The Build half is a structured read-comparison performed in this context (not regenerate-and-diff): confirm the Build skill's steps, followed against the decision docs, reproduce the shipped files, reconciling the documented divergences explicitly. Regeneration is reserved only if a read-comparison leaves genuine doubt about a step.

### 11. Grading tiers — checklist hard, gate soft

Checklist-determined rows must match the shipped design decisions exactly; a miss is a skill defect and the skill is fixed in place. Human-gate (`not sure`) rows are graded soft: a divergent self-resolution on a genuinely undeterminable row is expected residue, not a defect. A row the skill treats as clear-cut coming out `not sure` means the checklist needs sharpening.

### 12. Kept decision docs

The walk produces two kept decision docs at the project's component-decision location: `_dev/docs/new-components/text.md` and `_dev/docs/new-components/button.md`. These are the project's first real decision docs and the Design walk's durable acceptance evidence.

### 13. Kept-doc reconciliation to shipped

The final kept docs must match the shipped components on every code-affecting row so that Build-from-doc reproduces the shipped code. When a subagent self-resolves a gate row differently from shipped (acceptable for skill-grading), the kept doc is still reconciled to the shipped choice with a one-line note. Skill grade and kept-doc content are separate axes: grade is checklist-hard/gate-soft; kept-doc content matches shipped on all code-affecting rows.

### 14. Correction loop and re-run policy

On a checklist-row defect: fix the SKILL in place, then re-run that component's Design subagent once against the fixed skill so the kept doc is genuinely skill-produced. Cap at roughly two rounds; if a checklist row still diverges, surface it rather than loop silently.

### 15. Recording

The walk's findings — defect list, fixes applied — are recorded in the task-4.4 handoff / wrap-up session record. No separate permanent validation report. The permanent artifacts are the corrected `SKILL.md` files (plus Build's `references/worked-example.md`) and the two kept decision docs.

### 16. Sequencing

Both skills are finalized and restructured first, in this context; the clean-context validation walk is delegated only after. The restructure and the walk reinforce each other — the clean-context walk is the `writing-skills` technique-skill test of the leaner skills.

## Invariants

- The skills stay self-contained and portable (phase spec #6): no dependency on `_dev/docs` findings; only `a2ui-sdk-design` spec-navigation remains a pointer.
- No new catalog component is authored; validation runs against the existing `Text`/`Button`.
- The Build skill takes no human input; anything needing a human decision stays in the Design skill and its decision doc.

## Open items

- None.
