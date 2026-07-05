# Task 5.3 — `review-nightly` rewrite (implementation plan)

## Context

Phase 5 builds the autonomous half of the daily-work harness. 5.1 defined the issue/label contract + `/delegate-task`; 5.2 built the nightly producing routine that turns queued issues into gated PRs. **5.3 is the morning counterpart** — the human triage/merge skill that closes the loop — plus the doc that maps it.

The current `review-nightly` skill was stale against the 5.1/5.2 contract: inbox by branch-glob (`phase-<N>/<M>-*`), classified by draft-ness, knew only `[needs-attention]` drafts, ignored `kind:standalone`, ignored `blocked:setup`, no case-2 (blocked) path. This task rewrites it against the label contract, adds a **re-delegation mechanism** back into the 5.2 producer (a new `autonomous-revise-ready` PR label + a second producer queue source), and finalizes `autonomous-workflow.md` with a Review section.

Decisions are locked in `_dev/docs/spec/task-5.3-review-nightly-rewrite.md`. **Implementation commits land in `../daily-work-harness`** (the plugin repo's own git) — no `a2ui-github` worktree (phase-spec §1).

## Files modified (all in `../daily-work-harness`)

1. `skills/review-nightly/SKILL.md` — full rewrite: four-lane label inbox, live-branch worktree review (mechanical / local / both), case-1 merge, case-2 resolve+fork, needs-attention, blocked:setup, reject. Reads `## Contract` + `## Review` sections.
2. `nightly-routine-prompt.md` — 5.2 amendment: second queue source (`autonomous-revise-ready` PRs) + resume-on-existing-branch path; flip label → `review-ready` on a clean pass.
3. `autonomous-workflow.md` — `autonomous-revise-ready` in Labels + a re-queued state; Produce selector amended for the second queue source; new `## Review` section (final top-level section).
4. `daily-workflow.md` — autonomous-PR section shrunk to a one-line pointer.
5. `README.md` — `review-nightly` bullet → four-lane triage.
6. `.claude-plugin/plugin.json` — `0.1.6` → `0.1.7`.

Reused patterns: the section-scoped doc read from `delegate-task` (`sed -n '/^## Contract/,/^## Produce/p'`); the worktree-off-branch convention; `wrap-up`'s tick interface (its merge clause no-ops when the branch is already merged).

## Key design (from the spec)

- **Inbox** — label-keyed, two queries, four lanes: `review-ready` / `needs-input` / `needs-attention` PRs + `blocked:setup` issues. Pick-one → resolve → return; never auto-act.
- **Review substrate** — the live PR branch, checked out in a worktree off that branch; review modes mechanical / local / both; bar = task-level `task-<N.M>` spec (spec kind) or issue body (standalone).
- **Case-1** — merge (merge commit, `Closes #<N>`); `kind:spec` → `wrap-up` tick, `kind:standalone` → no tick.
- **Case-2** — resolve on the PR branch (spec change rides the branch, reaches `main` only at merge); resolution recorded as a 3-part issue comment (progress / why-wrong / decision) + a PR comment for spec kind; then fork.
- **Fork** — fix-live (worktree push → re-review → merge) or re-delegate (flip → `autonomous-revise-ready`, routine resumes on the branch). Shared by needs-attention and failed-review PRs; `rebase-with-main` untouched.
- **Reject** — close PR + delete branch, issue left open with `autonomous-ready` stripped.
- **blocked:setup** — report-only; offer re-queue (strip `blocked:setup` + ensure `autonomous-ready`).
- **Producer amendment** — second queue source + resume: check out existing branch, read issue resolution comment + spec-from-branch (spec kind), continue, re-run gates, flip label.

## Verification (done — no validation walk; DoD §6 = artifacts exist, mutually consistent, agnostic)

1. Contract single-source — `autonomous-revise-ready` defined once (Labels), referenced elsewhere; skill/prompt reference the vocabulary, don't redefine it. ✅
2. `sed` section-reads return the intended `## Contract` and `## Review` blocks (Review is last). ✅
3. Doc↔prompt twin — the resume/flip wording matches in `autonomous-workflow.md` Produce and `nightly-routine-prompt.md`. ✅
4. No stale-model residue in the rewritten skill (no branch-glob, no draft classification, no phase-spec-only bar). ✅
5. Agnosticism grep across changed files → zero project-specific terms. ✅
6. Cross-repo hygiene — commits land in `../daily-work-harness`; a2ui-github carries only the spec + TODO tick. ✅

## Wrap-up

- Commit harness changes in `../daily-work-harness` (`feat(phase-5): …`, version bump included).
- `daily-work-harness:wrap-up`: tick **5.3** in `_dev/TODO.md`; last Phase-5 sub-task → prompt to mark `## Phase 5` `[done]`.
