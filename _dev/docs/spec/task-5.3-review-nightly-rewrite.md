# Task 5.3 — `review-nightly` rewrite

Covers Phase 5 sub-task **5.3** (`_dev/TODO.md`; phase spec `phase-5-autonomous-run-layer.md`). Rewrites `review-nightly` as the morning triage/merge counterpart to the autonomous producer, adds a re-delegation mechanism back into the 5.2 producer, and finalizes the single harness doc. Ships in `../daily-work-harness`; project-agnostic; consumes and closes against the 5.1 issue/label contract.

## Scope

- The rewritten **`review-nightly`** skill — build the morning inbox, review one item at a time on its live branch, and drive each to a terminal outcome (merge / fix / re-delegate / reject / re-queue).
- A **new PR label `autonomous-revise-ready`** and the **producer amendment** that lets the nightly routine resume an already-open PR — a reconciliation into 5.2's committed artifacts.
- Finalizing **`autonomous-workflow.md`** (new Review section, `autonomous-revise-ready` in Labels, Produce amended) and shrinking `daily-workflow.md`'s autonomous-PR section to a pointer.

Out of scope: any validation walk (phase spec §6 — done means artifacts exist, are mutually consistent, and are project-agnostic).

## Locked decisions

### 1. The inbox — four label-driven lanes

The inbox is built from labels, not branch globs, via two GitHub queries: open PRs carrying an outcome label, and open issues carrying `blocked:setup`. It presents **four lanes** as one clear, grouped terminal list, oldest-first within each lane:

- **`review-ready`** PRs → case-1 (merge candidate),
- **`needs-input`** PRs → case-2 (blocked on a decision),
- **`needs-attention`** PRs → fix or reject (gates red / mechanical error),
- **`blocked:setup`** issues → report + offer re-queue (no PR).

Label-keying is what makes the inbox uniform across `kind:spec` (`phase-<N>/<M>-*`) and `kind:standalone` (`task/<kebab>`) work. If all lanes are empty, say so and stop.

### 2. Interaction model — pick-one, resolve, return

The human picks one item; the skill drives just that item to its terminal state, then returns to a refreshed inbox. Oldest-first walking is offered, but each item still gets its own review and its own explicit go-ahead. Never auto-pick, never auto-merge, never auto-act. No batch fast-path.

### 3. Review substrate — the live PR branch

To review any PR, the skill checks out the **live PR branch in a worktree off that branch**. Reviewing happens on the actual branch state, not a static diff, and the same worktree is the channel for any fix. The worktree is created when the PR is picked and cleaned up on the terminal action.

### 4. Review modes — mechanical / local / both

On a checked-out PR the skill offers three review modes as distinct confidence tools:

1. **Mechanical only** — hand the diff + the task bar to `code-review` (or a review subagent), spec-anchored.
2. **Local only** — run the project's gates / app on the checked-out branch.
3. **Both** — mechanical first, then local.

The mechanical review judges three things: does the change fulfill the task as its bar defines it; real bugs in the diff; scope creep (touched `_dev/` beyond its own plan doc, or another task's surface). Findings are surfaced to the human, who decides; the review never auto-decides.

### 5. Review bar by kind

- **`kind:spec`** — the **task-level `task-<N.M>` spec is the primary bar**; the phase spec is umbrella context, not the priority.
- **`kind:standalone`** — the **issue body** is the bar (there is no spec file).

### 6. Case-1 (`review-ready`) — merge

After review, on the human's go-ahead: merge with a merge commit and delete the branch; the PR's `Closes #<N>` auto-closes the issue. Then reconcile onto `main` and:

- **`kind:spec`** → hand to `daily-work-harness:wrap-up` for the `N.M` tick on `main` (and the "last sub-task → mark phase `[done]`?" prompt).
- **`kind:standalone`** → no tick (it never touched `_dev/TODO.md`).

A `review-ready` PR that **fails the human's review** is not a separate case — it drops into the shared fix path (decision 9).

### 7. Case-2 (`needs-input`) — resolve the blocker on the branch

The PR carries a structured **Decision needed** writeup. The flow: read the blocker + partial work + the task bar → **clarify with the human** (escalate to a full `grill-me` if the decision is deep/multi-branch, otherwise a lightweight Q&A) → then encode the resolution **on the PR branch**, not on `main`.

The spec change **rides the PR branch**: in the checked-out worktree the skill edits the governing spec (`kind:spec`; this may **create a task-level `task-<N.M>` spec**, promoting a thin phase-spec handle into a real spec). The change reaches `main` **only via the eventual PR merge**, together with the code — never as a standalone `main` edit. This extends 5.2 §11's established exception ("the branch is the only `_dev/`-editing channel for autonomous work") from plan docs to case-2 spec changes.

### 8. Resolution is recorded as a comment

The resolution is recorded as a **comment on the issue** (both kinds), never a body edit — the comment carries the narrative a resuming routine and the next human review need. It has a fixed three-part structure:

1. **progress so far**,
2. **why the previous attempt was wrong / blocked**,
3. **the resolved decision / direction**.

For **`kind:spec`**, a **comment is also left on the PR** stating what is resolved alongside the spec change. For **`kind:standalone`** (no spec file), the issue comment *is* the decision record; nothing on the branch changes definition-wise.

A resuming routine reads the issue comment(s) plus, for `kind:spec`, the updated spec on the branch.

### 9. The fork after review — fix-live vs re-delegate

Case-2 (after the spec change), `needs-attention`, and a `review-ready` PR that failed review all share one fork:

- **Fix live** — in the already-checked-out worktree, apply the fix, commit, push (the PR updates in place, no history rewrite), then re-review and merge. `needs-attention` and failed-`review-ready` take this with no spec-change precursor.
- **Re-delegate** — hand the PR back to the routine (decision 10).

`rebase-with-main` is **not extended**; the fix arm only adds commits and pushes. If `main` genuinely moved, the existing `rebase-with-main` already applies unchanged.

### 10. Re-delegation — `autonomous-revise-ready`

Re-delegation flips the PR's outcome label to a **new PR label `autonomous-revise-ready`** ("a human resolved the blocker; the routine may resume this branch"). It is PR-side, in the same family as the three outcome labels and mutually exclusive with them — flipping to it clears `needs-input` / `needs-attention`. The PR stays open, its branch preserved; the spec change (spec kind) is pushed on the branch first. Both `needs-input` and `needs-attention` can be re-delegated this way.

### 11. Producer amendment — resume an open PR (5.2 reconciliation)

5.3 edits 5.2's committed artifacts (`nightly-routine-prompt.md` and the Produce section of `autonomous-workflow.md`) to add a **second queue source**: each fire also selects **open PRs labeled `autonomous-revise-ready`**. For such a PR the routine's subagent checks out the **existing branch** (not a fresh one), reads the issue resolution comment plus — for `kind:spec` — the updated spec from the branch, continues the work, re-runs gates, and on a clean pass **flips `autonomous-revise-ready` → `review-ready`** so it lands back in case-1. This preserves the partial work instead of reproducing from scratch.

### 12. `needs-attention` — shared fix/reject menu, no spec change

`needs-attention` (gates red / mid-run mechanical error) carries a **Failure** writeup and involves no design ambiguity, so **no spec change**. It routes straight to the shared menu: fix-live, re-delegate, or reject.

### 13. Reject

Rejecting a PR (any lane) closes the PR and deletes its branch, but **leaves the issue open with `autonomous-ready` stripped** — the task may still be wanted, just not this attempt, and the routine will not re-grab it.

### 14. `blocked:setup` lane — report and offer re-queue

For `blocked:setup` issues (no PR), `review-nightly` **surfaces the parsed blocker comment** so the human sees exactly what setup is broken. It is **not an active fixer** — the setup fix is operator work outside the harness. Its only action is a convenience exit: once the human confirms the setup is fixed, **offer to re-queue** the issue, which strips `blocked:setup` **and** ensures `autonomous-ready` is present (full queued state). If the task is misguided, the human can reject (close the issue) instead.

### 15. Doc finalization

- **`autonomous-workflow.md`** — Labels table gains `autonomous-revise-ready`; the Produce section is amended for the second queue source (decision 11); a new **Review section** maps the four lanes, the per-PR decision menu (merge / fix-live / re-delegate / verify / reject), case-2's spec-change-on-branch + comment precursor, and the `blocked:setup` report-and-re-queue.
- **`daily-workflow.md`** — its existing autonomous-PR section shrinks to a one-line pointer to `autonomous-workflow.md`.
- **`review-nightly` reads** `## Contract` + `## Review` at runtime (section-scoped, mirroring how 5.2 re-scoped `delegate-task` to read only `## Contract`) — not the whole doc, not `daily-workflow.md`.

### 16. Blast radius

The change is scoped to: the rewritten `review-nightly` skill; `autonomous-workflow.md`; `daily-workflow.md`; and `nightly-routine-prompt.md` (the 5.2 amendment). The Produce amendment lands in both `autonomous-workflow.md` and `nightly-routine-prompt.md` (source + derived copy, kept consistent per DoD §6). No other 5.2 artifact and no other harness skill is touched; `rebase-with-main` is untouched.

## Invariants

- **Project-agnostic.** `review-nightly`, the label, and the doc changes must be reusable by any harness-adopting repo — reading each project's rules from its `CLAUDE.md` / `_dev/`, operating on the project's own GitHub repo, with no a2ui-github / Primer / component-only assumptions.
- **`autonomous-revise-ready` is one more mutually-exclusive PR label** — it never coexists with `review-ready` / `needs-input` / `needs-attention`.
- **The producer prompt is the derived copy; `autonomous-workflow.md` is the authoring source.** Their consistency is the phase DoD §6 check.

## Open items

- None flagged as unresolved during the grill.
