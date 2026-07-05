# Task 5.2 — Autonomous producing routine

Covers Phase 5 sub-task **5.2** (`_dev/TODO.md`; phase spec `phase-5-autonomous-run-layer.md`). Defines the nightly producing routine — a self-contained prompt that reads open, labeled issues, produces a gated PR per task, and grows `autonomous-workflow.md` with the produce half of the contract. Ships in `../daily-work-harness`; project-agnostic; consumes the 5.1 issue/label contract.

## Scope

- The routine **prompt** shipped as a plain `.md` in the harness repo, registered as a nightly cloud Routine via `/schedule`.
- The **produce section** of `autonomous-workflow.md` (the local-facing map) plus the `blocked:setup` label addition and a "Routine setup" operator checklist.
- The contract-first **restructure** of `autonomous-workflow.md` and the re-scoping of `delegate-task`'s read of it.

Out of scope: `review-nightly` (5.3); standing up a live schedule for a specific project (documented setup, not graded).

## Locked decisions

### 1. Artifact form — a self-contained prompt, not a skill

The routine ships as a plain prompt `.md` (`nightly-routine-prompt.md`) at the harness repo root, beside `daily-workflow.md` / `autonomous-workflow.md`. It is the canonical record copy; the live routine is that prompt content registered as a Claude cloud Routine via `/schedule`. It is not a slash-command skill — the producer is never invoked interactively.

Because a Routine runs against a fresh clone of the *project* repo with **no harness plugin installed**, the prompt cannot reference `${CLAUDE_PLUGIN_ROOT}` or read `autonomous-workflow.md` at runtime. It is **self-contained**: it restates the producer-facing slice of the contract inline. `autonomous-workflow.md` stays the authoring source of truth; the prompt is the derived copy, and their consistency is the DoD §6 check. Overlap between the two is accepted.

### 2. Prompt structure — orchestrator + verbatim per-issue procedure

The prompt is two delimited parts. An **orchestrator** section (build the task queue, dispatch a subagent per issue, collect outcomes, print the end-of-run tally) and a **per-issue production procedure** block — the full, self-contained producer contract. The orchestrator passes the per-issue block **verbatim** to each subagent along with the issue number, so every subagent receives the whole autonomous workflow scoped to run its one issue. The producer contract is defined once (the block) and handed down to each subagent.

### 3. Drain the queue via subagent-per-issue

The routine's first act is to list **all** eligible issues into a task queue — open, `autonomous-ready`, unblocked (no `blocked-by:*`), no open PR, not `blocked:setup` — then work them, one subagent per issue. Draining the whole queue is the point of the nightly run. The queue is built once at the start of the fire.

### 4. Durable per-task-PR checkpoint; resumable across fires

Each issue is fully finished — commit, push, open PR — before the next begins. A completed task's open PR trips the one-open-PR-per-task guarantee, so it is never re-grabbed; incomplete tasks stay queued and resume on the next fire. The drain is therefore naturally resumable with no checkpoint state beyond GitHub itself, surviving context/token exhaustion or a mid-run stop. A hard crash (the run dies) leaves nothing and the issue is re-grabbed next fire; a task that dies mid-work before its PR is pushed is redone from a fresh branch on the retry (the PR is opened as the subagent's last atomic step). Subagent-per-issue also keeps the orchestrator's context lean — it accumulates only one-line outcome summaries, not each task's full work.

### 5. The routine uses no harness skills

The producer invokes only the **issue-named** project Plan/Exec skills (or runs freeform if none named). The harness plugin skills (`delegate-task`, `pick-up-task`, `wrap-up`, `review-nightly`, `grill-to-spec`, `rebase-with-main`) are the local human-side flow and none run inside the cloud producer. The prompt carries an inline workflow explanation and a one-line note that the routine has **no access** to the harness plugin skills — only repo-committed skills.

### 6. Precondition check lives in the subagent — fail fast

After selecting and reading its issue, the subagent verifies preconditions before doing any work: the named skills resolve as repo-committed skills, referenced spec/plan paths exist in the clone, and the issue body is parseable. On any precondition failure it takes the `blocked:setup` path (decision 8) and does no work. The check lives in the subagent because it is reading the issue anyway.

### 7. Gates — light instruction, project-discovered

The per-issue procedure instructs the subagent to run the project's documented verification gates before opening the PR and record what ran plus results in the PR's gate block. Because subagents run inside the cloned project, `CLAUDE.md` auto-loads and points them at the project's run commands — no elaborate discovery machinery in the prompt. Gates that **run and fail** → `needs-attention`; gates that **can't run at all** (env not provisioned, command absent) → `blocked:setup`.

### 8. Terminal-outcome taxonomy

- **Clean run** → non-draft PR, `review-ready` (PR label).
- **Blocked on a decision** → non-draft PR with partial work, `needs-input` (PR label).
- **Work done, gates red / mechanical error mid-run** → non-draft PR, `needs-attention` (PR label).
- **Precondition failure** (decision 6) → **`blocked:setup`** issue label + a generic comment, **no PR**, excluded from re-grab.
- **Hard crash** → nothing; the issue is re-grabbed next fire.

Every produced PR is non-draft and carries exactly one outcome label.

### 9. `blocked:setup` — new issue label

An issue-side label (queue/classification side; never overlaps a PR label) meaning "the routine tried and could not even start; skip until a human fixes project setup." It is **human-cleared** — the operator fixes the setup and removes the label to re-queue. The routine ensures the label exists on use, applies it, and posts one generic structured comment describing the blocker and the fix; because the label excludes the issue from the selector, it is one-shot (no re-comment, no retry loop). The comment is general — it covers any precondition failure, not only a missing skill — and is human-readable under a fixed heading so `review-nightly` (5.3) can report it directly.

### 10. `needs-input` bar

The subagent biases hard toward proceeding: anything inferable from the spec, repo conventions, or existing patterns is decided with best judgment and recorded as an assumption in the PR. It emits `needs-input` only when a decision is material to the output, genuinely underdetermined by spec + conventions, and costly if wrong. `needs-input` is distinct from `blocked:setup`: it is an ambiguous *task definition* needing a human design/spec decision (`review-nightly` case-2), so it is always a non-draft PR — the anchor the spec-change conversation attaches to — carrying a structured writeup of the ambiguity and the exact input needed.

### 11. `_dev/` writes on the branch

The only `_dev/` artifact the routine may write is the **plan doc** (when the issue names a Plan skill), created on the PR branch, merged with the code so `review-nightly` can review approach-vs-spec. This is a deliberate, scoped exception to "`_dev/` lives on `main` only," forced because the cloud run has no separate `main`-editing channel. The routine never touches `_dev/TODO.md`, specs, or handoffs.

### 12. PR shape

Title mirrors the issue (`[N.M] <title>` for spec, the imperative title for standalone). The body includes a `## Related issue` section carrying **`Closes #<N>`** (the auto-close keyword is kept, per the 5.1 contract), a summary, a gates block, and conditional sections per outcome (recorded assumptions; a "decision needed" writeup for `needs-input`; a failure writeup for `needs-attention`). The subagent writes the body; the orchestrator only tallies the outcome.

### 13. Orchestrator end-of-run report

At the end of a fire the orchestrator prints a compact tally — one row per issue with its outcome and PR (or `blocked:setup` / no PR) — to the cloud session log for a morning glance. GitHub state remains the source of truth; `review-nightly` reads labels and PRs, not the log.

### 14. `autonomous-workflow.md` grows the produce half

5.2 adds to the doc: `blocked:setup` in the Labels section; a **Produce section** (what the routine is, the selector, the terminal-outcome taxonomy, the PR-shape summary, the `blocked:setup` comment format, a pointer to `nightly-routine-prompt.md` as the executable); and a **"Routine setup"** operator checklist. The setup checklist covers unrestricted branch push (required because Routines default to `claude/`-prefixed branches, but the contract uses `phase-<N>/<M>-*` / `task/<kebab>`), an environment setup script that installs project deps so gates can run, the project's Plan/Exec skills committed to `.claude/skills/`, and `/schedule` registration. Setup is ungraded — DoD §6 grades artifacts, consistency, and agnosticism, not a live schedule.

### 15. Contract-first doc restructure + re-scoped `delegate-task` read

`autonomous-workflow.md` is restructured contract-first: a `## Contract` section (the unit, labels, states, issue schema — the coupling all referrers share), then Produce (5.2), Review (5.3), and Routine setup. `delegate-task` writes against the contract only and does not need the produce/review operational detail, so its read pointer is re-scoped from "read in full" to reading just the `## Contract` section via a concrete extraction command rather than added descriptive prose. This is the light-additive reconciliation the doc's growth forces.

## Invariants

- **Project-agnostic.** The prompt, the produce section, and the setup checklist must be reusable by any harness-adopting repo — reading each project's rules from its `CLAUDE.md` / `_dev/`, invoking issue-named project skills, and creating PRs in the project's own repo, with no a2ui-github / Primer / component-only assumptions.
- **The prompt is the derived copy; `autonomous-workflow.md` is the authoring source.** Their overlap is intentional and their consistency is the phase DoD §6 check.
- Sub-task handles in the phase spec are non-restrictive.

## Open items

- None flagged as unresolved during the grill.
