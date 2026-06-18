---
name: pick-up-task
description: Pick up or resume work from `_dev/TODO.md` — dispatches to spec work or sub-task work per the daily-work harness. Use when the user invokes `/pick-up-task` or asks to grab/resume a phase or sub-task.
---

# pick-up-task

The session's dispatcher. **Read [`_dev/harness/daily-workflow.md`](../../../_dev/harness/daily-workflow.md) in full first** — it defines the model, the phase states, and the tracks. Run from the repo root (`main`).

## Workflow

1. **Read state.** `_dev/TODO.md` (phase headings, `[WIP]`/`[done]` markers, `N.M` checkboxes) and `_dev/docs/spec/`. Pick the earliest non-`[done]` phase; a `[WIP]` phase is resumed before any later phase. If the user named a phase or sub-task, use it.

2. **Route on phase state:**
   - **Fresh phase** (no `[WIP]`, no `_dev/docs/spec/phase-<N>-*.md`): mark `## Phase N` `[WIP]` on `main`, then go to **Spec track**.
   - **Spec'd phase** (spec exists, ≥1 unchecked `N.M`): go to **Sub-task track**.
   - **`[WIP]` resume:** first read the matching handoff doc (`_dev/docs/handoff/phase-<N>.md` for spec work, `task-<N.M>.md` for sub-task work) and, for a sub-task, its `_dev/docs/plan/task-<N.M>-*.md` if present. Report where it stands, then continue the matching track.

3. **Spec track** (on `main`): hand to `grill-me` → `grill-to-spec` (writes `_dev/docs/spec/phase-<N>-*.md`) → inline numbered `N.M` sub-tasks into `_dev/TODO.md`, including which can run in parallel. Pickup stops; the user drives the grill.

4. **Sub-task track:**
   - Read the phase spec **in full** + TODO. Compute the **startable** sub-tasks (next-in-order plus any parallel-eligible per the spec). **Present all of them — even if only one. Never auto-pick.** Let the user choose.
   - Present a summary of the chosen sub-task drawn from the phase spec.
   - Offer three choices (planning stays on `main`): (a) `grill-me` deeper, (b) `superpowers:writing-plans` → `_dev/docs/plan/task-<N.M>-*.md`, (c) Claude Code plan mode → implementation.
   - **Only when implementation begins**, create or resume the worktree off `main` (`phase-<N>/<M>-<kebab>`) and run `rebase-with-main`. The worktree holds code only; `_dev/` stays on `main`.

5. **Stop.** Pickup ends here; the user drives what happens next. Closing a session is `wrap-up`'s job, not this skill's.

## Notes

- `_dev/` (TODO, specs, plans, handoffs) is always edited on `main` — never on a sub-task branch.
- `[WIP]` sits on the `## Phase N` heading; never strip it for a phase you are not working.
