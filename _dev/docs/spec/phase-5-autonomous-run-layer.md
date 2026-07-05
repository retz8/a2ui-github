# Phase 5 — Autonomous-run layer

Covers the TODO `## Phase 5 — Autonomous-run layer`. Builds the autonomous half of the daily-work harness properly — today it exists only as a throwaway pasted cloud prompt plus a thin `review-nightly` — and makes the whole autonomous mechanism reusable. This is a high-level phase spec; each sub-task's real scope is settled in its own grill and the handles below do not restrict it.

## Scope

- The delegation entrypoint, the nightly producing routine, and the paired `review-nightly` triage/merge skill — the three pieces that let a delegated task be picked up unattended, produced as a gated PR, and reviewed back into the harness.
- The GitHub-issue + label contract that couples those three pieces.
- The single harness doc that explains the loop, mirroring how `daily-workflow.md` explains the daily-work harness.

Out of scope: the catalog-component authoring skill (Phase 4); the catalog build-out itself (Phase 6).

## Locked decisions

### 1. Ships in `../daily-work-harness`, not this repo

The autonomous layer lands in the `daily-work-harness` plugin repo, on that repo's own git — not in `a2ui-github`. It is tracked here as Phase-5 sub-tasks (TODO checkboxes + this spec) so it is visible in the phase sequence and each sub-task gets its own grill, but the implementation commits land in the plugin repo. This sub-task track does not use an `a2ui-github` worktree.

### 2. Tracking substrate — TODO map + GitHub-issue dispatch

`_dev/TODO.md` stays the phase/sub-task map and the human planning surface; it is no longer the dispatch queue. A GitHub issue becomes the unit of delegated, trackable work. The nightly producer selects from open, labeled issues rather than scanning TODO.md for `[WIP]` markers. `review-nightly` closes the PR and the issue; `wrap-up` (unchanged) owns the TODO.md tick.

### 3. Decomposition — delegate/contract → produce → review

Three sub-tasks, contract-first, strictly sequential (`5.1 → 5.2 → 5.3`): the contract must exist before anything produces or consumes against it, and the consumer follows the producer's PR shape.

- **5.1** — `/delegate-task` + the issue/label contract. The human-facing skill that projects a task into a GitHub issue with a fixed format and labels, and defines the protocol every other piece depends on. It also defines "blocked / needs-input" as a first-class protocol state (a PR outcome label on a real, non-draft PR) so `review-nightly` can sort ready PRs from blocked ones deterministically. The issue schema, fields, and label vocabulary are designed in 5.1's own grill.
- **5.2** — autonomous producing routine. A `.md` prompt shipped in the harness repo that reads open, labeled issues, runs one task's work, and opens a gated `phase-<N>/<M>-*` PR linked to its issue. The `/schedule` skill registers it as a nightly cloud Claude Routine; standing up a live schedule is documented setup, not a graded criterion.
- **5.3** — `review-nightly` rewrite. The morning triage/merge counterpart handling two cases: **case-1 (ready)** — review against the phase spec, merge, close PR + issue, hand to `wrap-up` for the tick; **case-2 (blocked)** — review the blocker, grill/clarify, make the spec change on `main`, leave a comment on the PR recording that change, then fork between re-delegating to the routine or fixing directly via a worktree based off the PR branch (the fix merges back to the PR branch and updates the PR). 5.3 also finalizes the single harness doc.

### 4. Blast radius — light additive to the human-flow skills

The rewrite is scoped to the three autonomous pieces plus the harness doc. `grill-to-spec` gains a closing fork — after a sub-task spec is written, suggest delegating to the nightly routine or working directly this session. `pick-up-task` gains a one-line mention that delegation is an option. `wrap-up` is unchanged. Other harness skills are untouched unless 5.3's grill decides the worktree-off-PR-branch fix extends `rebase-with-main`.

### 5. Single harness doc

The reworked mechanism is explained in one new doc at the harness repo root, beside `daily-workflow.md` — the map of the autonomous loop (delegate → produce → review, the issue/label contract, the case-1/case-2 review shape, and how `/schedule` wires the routine). `daily-workflow.md`'s existing autonomous-PR section shrinks to a pointer. This doc is distinct from the routine prompt of 5.2, and is finalized in 5.3.

### 6. Definition of done

Done means: (1) the artifacts exist, (2) they are mutually consistent — the issue/label contract is identical across its writer (`/delegate-task`), reader (the routine), and closer (`review-nightly`), and (3) they are project-agnostic. No validation walk.

### 7. Protocol refined in Phase 6, not finalized here

This phase builds the autonomous layer; the protocol is refined for real once the Phase-6 catalog build-out runs work through it. If something breaks under real load, it is fixed in Phase 6, not pre-empted here.

## Invariants

- **Project-agnostic.** `/delegate-task`, the routine prompt, and `review-nightly` must be reusable by any repo that adopts the harness — reading each project's rules from its `CLAUDE.md` / `_dev/` rather than hardcoding a2ui-github, Primer, or component-only assumptions.
- **The contract supports arbitrary task types.** A spec'd sub-task issue references its `_dev/docs/spec/task-<N.M>-*.md`; an ad-hoc hotfix or chore carries its full definition in the issue body itself. The producer keys off the issue and its labels, not an assumption that every issue maps to a TODO sub-task with a spec file.
- Sub-task handles in this spec are non-restrictive — a sub-task may expand or shrink in its own grill.

## Open items

- None flagged in the grill beyond the per-sub-task design deferred to each sub-task's grill.
