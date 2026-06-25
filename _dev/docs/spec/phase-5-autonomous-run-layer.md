# Phase 5 — Autonomous-run layer

Covers the TODO `## Phase 5 — Autonomous-run layer`. Reworks the daily-work harness's autonomous mechanism so it is ready for the Phase-6 build-out. This is a high-level phase spec; each sub-task's real scope is settled in its own grill and the handles below do not restrict it.

## Scope

- A near-rewrite of the harness's autonomous mechanism: the nightly producing routine and the paired `review-nightly` skill, both of which exist today only as light, incomplete versions.
- The mechanism is documented in a single harness doc, mirroring how `daily-workflow.md` documents the daily-work harness.

Out of scope: the catalog-component authoring skill (Phase 4); the catalog build-out itself (Phase 6).

## Locked decisions

### 1. Ships in `../daily-work-harness`, not this repo

The autonomous layer lands in the `daily-work-harness` plugin repo, on that repo's own git — not in `a2ui-github`. It is tracked here as Phase-5 sub-tasks (TODO checkboxes + this spec) so it is visible in the phase sequence and each sub-task gets its own grill, but the implementation commits land in the plugin repo. This sub-task track does not use an `a2ui-github` worktree.

### 2. Near-rewrite, deep-grilled per sub-task

Both pieces (the producing routine and `review-nightly`) are near-rewritten rather than patched. The deep design of each is deferred to its own sub-task grill; this phase spec only names the pieces.

### 3. Single harness doc

The reworked mechanism is explained in one harness doc, the way `daily-workflow.md` explains the daily-work harness.

### 4. Protocol is refined in real use during Phase 6

This phase builds the autonomous layer; the autonomous-run protocol is refined for real once the Phase-6 catalog build-out runs work through it. Phase 5 is not the place where the protocol is finalized under load.

### 5. Decomposition — producing side then consuming side

- **5.1** — autonomous producing routine: the nightly routine that picks a startable `N.M` off `main`, runs the work, and opens a gated `phase-<N>/<M>-*` PR. The GitHub issue/label machinery is folded in here, and the autonomous-run protocol is (re)established here.
- **5.2** — `review-nightly` rewrite: the morning triage/merge counterpart that consumes that protocol.

Order: 5.1 → 5.2 (the consuming side follows the contract the producing side defines).

## Invariants

- Sub-task handles in this spec are non-restrictive — a sub-task may expand or shrink in its own grill. 5.1 in particular may ship more than what is named here.

## Open items

- None flagged in the grill beyond the per-sub-task design deferred to each sub-task's grill.
