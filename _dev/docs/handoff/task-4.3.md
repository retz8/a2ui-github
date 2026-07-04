# Handoff — Task 4.3 (Agent-fixture surface)

**State:** `[WIP]`, planning complete, **implementation not started**. No worktree, no code touched. All artifacts on `main`.

**Artifacts:**
- Spec: `_dev/docs/spec/task-4.3-agent-fixture-surface.md` (11 locked decisions).
- Plan: `_dev/docs/plan/task-4.3-agent-fixture-surface.md` (3 tasks, models the 4.2 plan).

**What 4.3 does:** append an `## Agent section` to both `SKILL.md` files (design + build/test procedures for the deterministic-agent fixture surface), validated by read-through against Button's shipped agent artifacts. `Text` has no event → no agent section.

**Next action — start implementation:**
1. Create worktree `phase-4/3-agent-fixture-surface` off `main` via `daily-work-harness:rebase-with-main`.
2. Execute the plan's 3 tasks (subagent-driven or inline — undecided):
   - **T1** Design skill Agent section (prose) — per-event canned-response design + coupling + one event-response table.
   - **T2** Refactor `agent/tests/test_conformance.py` to parametrize over `_EVENT_FIXTURES` (sole product-code change; run green).
   - **T3** Build skill Agent section (prose) — fixture→mapping→coupling-edit loop, 1:1 test structure, five build notes, round-trip bless.
3. Worktree carries only `.claude/skills/**` + `agent/tests/test_conformance.py`; `_dev/` stays on `main`.

**Open threads:** none — all design decisions locked in the grill; execution style (subagent-driven vs inline) is the only open choice.
