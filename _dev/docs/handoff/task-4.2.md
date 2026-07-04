# Handoff — Task 4.2 (Client surface)

**State:** spec'd + planned on `main`. No implementation, no worktree.

- Spec: `_dev/docs/spec/task-4.2-client-surface.md` (11 locked decisions, no open items).
- Plan: `_dev/docs/plan/task-4.2-client-surface.md` (3 tasks, self-review clean).
- `4.2` is `[WIP]` in `_dev/TODO.md`.

## What 4.2 is

Append a **Client section** to both `.claude/skills/{design,build}-catalog-component/SKILL.md`, capturing the per-component client loop (fixtures → integration tests → visual baseline). Prose-only **except** one product-code change. Validated by read-through against the shipped `Text`/`Button` client artifacts under `client/`.

## Next action — start implementation

Create worktree `phase-4/2-client-surface` off `main` (via `rebase-with-main`); it carries only `.claude/skills/**` + `client/tests/fixtures.test.ts`, never `_dev/`. Then execute the plan's three tasks:

1. **Design Client section** → `design-catalog-component/SKILL.md`: prop-walk fixture-set brainstorm + client decision-doc format (fixture table + prop-coverage map + canned values).
2. **Refactor `client/tests/fixtures.test.ts`** — derive from `FIXTURES` (drop hardcoded count + name-list). The **sole product-code change**; actually run green.
3. **Build Client section** → `build-catalog-component/SKILL.md`: infra-assumption preamble + 7-step loop (fixtures → barrel → structural auto-cover → render/action tests → selector auto-cover → Claude-Chrome bless → baseline freeze).

Order: Task 1 → 2 → 3 (Task 3 consumes Task 1's format and assumes Task 2's refactor).

## Key decisions to carry (see spec for the full 11)

- Coverage **exhaustive over state-bearing props**, single-axis by default; couple only when semantically required. Button's under-coverage is a known gap — **backfill deferred** (Phase 6 / backlog), not done in 4.2.
- Client/agent boundary: 4.2 = mock-bounded client loop (`functionCall` local, `event` → injected handler); wire is fixed infra; **4.3 owns server transport**.
- Claude-Chrome bless **precedes** the baseline freeze; skill keeps the step, **Phase-5 nightly prompt owns skipping it** (skip-bless ⇒ skip-freeze).
- Reuse 4.1's three-stage design-call gate + append-convention — do **not** re-author them; Client section is a pure append.
