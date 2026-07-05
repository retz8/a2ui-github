# Task 5.1 — `/delegate-task` + the issue/label contract

Covers Phase 5 sub-task **5.1** (`_dev/TODO.md`; phase spec `phase-5-autonomous-run-layer.md`). Defines the GitHub-issue + label contract that couples the autonomous layer, and the human-facing `/delegate-task` skill that writes it. Ships in `../daily-work-harness`; project-agnostic; supports arbitrary task types.

## Scope

- The **issue/label contract** — the label vocabulary, issue schema, and lifecycle states that the nightly routine (5.2) reads and `review-nightly` (5.3) closes against.
- The **`/delegate-task`** human-facing skill that projects a task into a GitHub issue conforming to that contract.
- Seeding the single harness doc **`autonomous-workflow.md`** with the contract as its authoritative section.
- Two light entry-point edits to existing human-flow skills so `/delegate-task` is reachable in the daily flow.

## Locked decisions

### 1. Task kinds and unit

A delegated issue is one of two kinds, carried as a label: **`kind:spec`** (definition lives in a committed spec file + a TODO `N.M` line; the producer reads the spec) or **`kind:standalone`** (self-contained; the full definition is in the issue body). One issue = one PR = one merge — the issue is the atomic unit; anything larger is decomposed into more issues first.

### 2. Label taxonomy

Two carriers, and they never overlap: **issue labels = queue / classification / dependency; PR labels = run outcome.**

Issue labels:
- **`autonomous-ready`** — the selector. The human's gate saying "safe to run unattended"; the routine's single filter.
- **`kind:spec` / `kind:standalone`** — how to read the task.
- **`blocked-by:#<N>`** (zero or more) — one per unmet dependency.

PR labels — every produced PR carries **exactly one**:
- **`review-ready`** — produced clean, ready for human merge (→ `review-nightly` case-1).
- **`needs-input`** — the run got stuck on a decision it cannot make (→ case-2).
- **`needs-attention`** — the run failed mechanically (gates red / errored). Fix by hand or close; never merge.

`autonomous-ready` and `review-ready` are the paired gates: the human gates entry, the machine gates exit.

### 3. Inferred states (no label)

Most lifecycle states are inferred from issue + PR existence rather than labelled:
- **queued** = open issue, `autonomous-ready`, no linked PR, no `blocked-by:*` remaining.
- **produced** = an open PR exists; its outcome label says mergeable / blocked / failed. Produced PRs are never drafts — the outcome label alone gates merge, and any open PR is the "one open PR per task" signal that stops re-grabbing.
- **done** = issue closed (its PR merged).

No `status:in-progress` label — the open PR is that signal.

### 4. Dependency mechanics via `blocked-by:#<N>`

A task's dependencies are expressed as `blocked-by:#<N>` labels — one per blocking issue. A task is unblocked only when **zero** `blocked-by:*` labels remain; the routine skips any `autonomous-ready` issue that still carries one.

Auto-clear on dependency close: when a dependency issue closes, the repo label `blocked-by:#<N>` is deleted, which strips it from every dependent at once — no body-scanning, no per-PR walk. This forces a delegation ordering: a dependency must be delegated first so its issue number exists to reference.

### 5. Issue schema

Title:
- `kind:spec` → `[N.M] <sub-task title>`.
- `kind:standalone` → an imperative title.

Body sections:
- **Task** — `kind:standalone` carries the full definition here; `kind:spec` states "Phase N sub-task N.M".
- **References** (`kind:spec`) — the spec that defines the sub-task (the task-level `task-<N.M>` spec if one exists, else the phase spec), plus the plan-doc path if one exists. Referenced **by path, not embedded** — the spec lives in the repo and would drift if copied.
- **Plan skill** — present only when planning is judged necessary; names the skill to produce a plan first.
- **Execution skill** — present only when a specific skill should drive the work; otherwise the routine runs freeform.
- **Branch** — `phase-<N>/<M>-<kebab>` for `kind:spec`, `task/<kebab>` for `kind:standalone`.
- **Depends on** — the blocking issue numbers, mirroring the `blocked-by:#<N>` labels; omitted if none.

The PR auto-wires back to the issue (`Closes #N`) so a merge closes the issue.

### 6. Skills are issue-authoritative

The issue body is the **sole** authority on which skills run. The routine invokes exactly the named skills and nothing else; if no skill is named, it runs freeform. The routine never guesses skills. This keeps each autonomous run deterministic and reviewable.

### 7. `/delegate-task` picks skills from the project

Because `/delegate-task` is human-facing and interactive, it **proposes** the plan and execution skills by reading the project (its `CLAUDE.md` and installed skills) and the **human confirms or overrides** before the issue is written. The contract stays project-agnostic — the body fields are just skill-name strings — while the values are chosen per-delegation per-project.

### 8. Plan necessity is judged, not defaulted

"No plan doc" does not default to inserting a Plan-skill section. `/delegate-task` judges whether planning is *warranted*:
- plan doc exists → execute it (Execution skill only);
- no plan doc, planning not warranted (small, well-scoped) → **propose direct execution**, no Plan-skill section;
- no plan doc, planning warranted (multi-step, needs decomposition) → **propose the Plan-skill section**.

The bias is toward the leaner option unless the task genuinely needs a plan. `/delegate-task` proposes; the human confirms/overrides.

### 9. `/delegate-task` flow

Interactive, human-gated. Invoked with an `N.M` argument (`kind:spec` path) or with none / a free-form description (`kind:standalone` path). The shape:
- **Resolve target + kind.** `kind:spec` reads the TODO line + phase spec (+ plan doc if present), assuming the line is already `[WIP]` (picked up). `kind:standalone` interviews for the full definition.
- **Readiness gate.** Confirm the task is defined enough for an unattended run. For `kind:spec` the phase spec must exist, else refuse; if the definition is only a thin phase-spec handle, surface the choice to the human — grill/plan now this session, or proceed trusting the Plan-skill to plan from the phase spec. "No plan doc" is not "not ready"; "not ready" means the definition itself is too thin for even planning to land, which is kicked back to an interactive grill/spec. For `kind:standalone` the interview captures the definition; a large one may reference a spec/plan path instead. This gate normally passes trivially because `/delegate-task` is usually invoked right after a grill/spec in the same session.
- **Dedupe.** Refuse if the task already has an open issue (`kind:spec` keys on `[N.M]` / the `(#N)` already in TODO; `kind:standalone` cannot auto-dedupe — human judgment). Enforces one-open-issue-per-task at the source.
- **Judge skills** (decisions 7–8).
- **Dependencies.** Capture the blocking issue numbers and apply the `blocked-by:#<N>` labels.
- **Human-gate preview.** Show the assembled issue (title, body, labels) before anything hits GitHub.
- **Create** the issue with `autonomous-ready`, the `kind:*` label, and any `blocked-by:#<N>`.
- **Wire TODO** (`kind:spec` only): append `(#<new>)` to the `[WIP]` line on `main`.
- **Report** the issue.

### 10. Repo target and label bootstrapping

Issues are created in the current repo's `origin` — the adopting project's own GitHub repo, no hardcode. Labels are ensured (idempotent create) on use by whichever skill applies them — `/delegate-task` ensures the issue-side labels, the routine ensures the PR-side outcome labels. No separate install step. The full vocabulary is listed in `autonomous-workflow.md`.

### 11. Canonical contract home — `autonomous-workflow.md`

5.1 creates the single harness doc `autonomous-workflow.md` at the harness repo root beside `daily-workflow.md`, and writes the issue/label contract into it as the authoritative section. `/delegate-task` **references** the contract rather than restating it — one definition, three referrers — so the writer/reader/closer stay identical. The doc is read in full by the skills (as `daily-workflow.md` is today), so it is kept concise and low-token. It grows incrementally across the phase: 5.1 seeds the contract, 5.2 adds the produce section, 5.3 adds the review section and finalizes.

### 12. TODO in-flight signal and entry-point edits

Delegating a `kind:spec` sub-task appends `(#N)` to its already-`[WIP]` TODO line; completion ticks it `[x]` via `review-nightly` → `wrap-up`. `kind:standalone` does not touch TODO.

Two entry-point edits ship in 5.1:
- **`pick-up-task`** reads a `[WIP]` line carrying `(#N)` as **delegated** (in flight autonomously): excludes it from the startable set and skips the handoff read for it (delegated work has no handoff doc), but still lists delegated sub-tasks in an in-flight section. This disambiguates the two `[WIP]` flavors — `(#N)` = delegated, bare `[WIP]` = locally in-progress.
- **`grill-to-spec`** gains a closing fork — after a spec is written, suggest delegating to the nightly routine (via `/delegate-task`) or working it this session.

## Invariants

- **Project-agnostic.** `/delegate-task`, the contract, and `autonomous-workflow.md` must be reusable by any harness-adopting repo — reading each project's rules from its `CLAUDE.md` / `_dev/` and creating issues in that project's own repo, with no a2ui-github / Primer / component-only assumptions.
- **The contract supports arbitrary task types.** `kind:spec` references a repo spec; `kind:standalone` carries its full definition in the issue body. The producer keys off the issue and its labels, not an assumption that every issue maps to a TODO sub-task with a spec file.
- **One definition, three referrers.** The contract lives once in `autonomous-workflow.md`; writer, reader, and closer reference it rather than copying it.
