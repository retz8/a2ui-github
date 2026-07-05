# Task 5.1 — `/delegate-task` + issue/label contract — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Ship the human-facing `/delegate-task` skill, the GitHub issue/label contract it writes, and the entry-point wiring — in the `daily-work-harness` plugin repo.

**Architecture:** Five Markdown deliverables in `../daily-work-harness`: a new concise contract doc (`autonomous-workflow.md`), a new skill (`skills/delegate-task/SKILL.md`) that *references* that doc, two surgical edits to existing skills (`pick-up-task`, `grill-to-spec`), and a README + version bump. The contract is defined **once** in `autonomous-workflow.md`; every other piece references it — no copies.

**Tech Stack:** Claude Code plugin skills (Markdown + YAML frontmatter). No runtime code. Verification is structural consistency + project-agnosticism (phase DoD §6), not unit tests.

## Global Constraints

- **Repo:** all commits land in `/Users/jiohin/Desktop/future-of-sw/daily-work-harness` (its own git), on `main`. **No `a2ui-github` worktree.** Use `git -C /Users/jiohin/Desktop/future-of-sw/daily-work-harness …` for every git step (bash cwd resets between calls).
- **This plan doc + the task spec live on `main` in `a2ui-github`'s `_dev/`** — do not copy them into the harness repo.
- **Source of truth:** design is locked in `a2ui-github/_dev/docs/spec/task-5.1-delegate-task-and-contract.md`. Do not re-decide anything; implement it.
- **One definition, three referrers:** the label vocabulary + issue schema are defined **only** in `autonomous-workflow.md`. `delegate-task` and the edited skills *reference* it (they may name a label they *apply*, but must not re-list/redefine the vocabulary or schema).
- **Project-agnostic:** no `a2ui-github`, `primer`, `Primer`, or component-only assumptions anywhere in these artifacts. Skill names, spec paths, and the target repo come from the current project at runtime.
- **Concise docs:** `autonomous-workflow.md` is read *in full* by the skills (like `daily-workflow.md`). Keep it tight — tables over prose, no padding. Target density ≈ `daily-workflow.md` (~55 lines).
- **Version bump forces cache refresh:** bump `plugin.json` version (per repo commit history) so the installed plugin cache picks up the change.
- **Commit convention:** conventional commits, `feat(phase-5): …` / `docs(phase-5): …`.
- **Scope boundary:** 5.1 seeds the contract only. Do **not** write the produce (5.2) or review (5.3) sections of `autonomous-workflow.md`, and do **not** touch `daily-workflow.md` (its autonomous-PR section shrinks to a pointer in 5.3).

---

### Task 1: Seed `autonomous-workflow.md` with the issue/label contract

**Files:**
- Create: `../daily-work-harness/autonomous-workflow.md`

**Interfaces:**
- Produces: the canonical label vocabulary (`autonomous-ready`, `kind:spec`, `kind:standalone`, `blocked-by:#<N>`, `review-ready`, `needs-input`, `needs-attention`), the issue title/body schema, and the lifecycle-state definitions that Tasks 2–4 reference.

- [ ] **Step 1: Write the contract doc**

Create `../daily-work-harness/autonomous-workflow.md` with exactly this content (tables are the contract — copy verbatim; the intro/connective lines may be lightly reworded but keep them tight):

```markdown
# Autonomous workflow

The map of the autonomous half of the daily-work harness: a delegated task becomes a GitHub issue, a nightly routine produces a gated PR, and `review-nightly` merges it back. `daily-work-harness:delegate-task` reads this doc in full, so it stays concise. The produce and review sections land with the 5.2 / 5.3 sub-tasks.

## The unit

A delegated task is one GitHub **issue** = one PR = one merge, created in the project's own `origin` repo. Two kinds:

- **`kind:spec`** — the definition is a committed spec + a `_dev/TODO.md` `N.M` line; the producer reads the spec.
- **`kind:standalone`** — self-contained; the full definition is in the issue body.

## Labels

Issue and PR labels never overlap: **issue labels = queue / classification / dependency; PR labels = run outcome.**

Issue labels:

| Label | Meaning |
|---|---|
| `autonomous-ready` | the selector — the human's "safe to run unattended" gate; the routine's filter |
| `kind:spec` \| `kind:standalone` | how to read the task |
| `blocked-by:#<N>` (0+) | one per unmet dependency |

PR labels — every produced PR carries **exactly one**:

| Label | Meaning | review-nightly |
|---|---|---|
| `review-ready` | produced clean, ready for merge | case-1 |
| `needs-input` | run stuck on a decision it can't make | case-2 |
| `needs-attention` | run failed mechanically (gates red / errored) | fix or close |

`autonomous-ready` (entry) and `review-ready` (exit) are the paired gates: the human gates entry, the machine gates exit.

## States

Most states are inferred, not labelled:

- **queued** — open issue, `autonomous-ready`, no linked PR, no `blocked-by:*` remaining.
- **blocked** — carries ≥1 `blocked-by:#<N>`; the routine skips it.
- **in-progress / produced** — an open non-draft PR exists (also the one-open-PR-per-task signal that stops re-grabbing).
- **done** — issue closed (its PR merged).

### `blocked-by:#<N>`

Dependencies are `blocked-by:#<N>` labels, one per blocking issue; unblocked = zero remain. When a dependency issue closes, its `blocked-by:#<N>` label is deleted repo-wide, which strips it from every dependent at once. Ordering follows: a dependency is delegated first so its number exists to reference.

## Issue schema

Title:

- `kind:spec` → `[N.M] <sub-task title>`
- `kind:standalone` → an imperative title

Body:

| Section | Content |
|---|---|
| **Task** | `kind:standalone`: the full definition. `kind:spec`: "Phase N sub-task N.M". |
| **References** | `kind:spec` only — the spec path (+ plan-doc path if it exists). By path, never embedded. |
| **Plan skill** | present only when planning is warranted; names the skill to plan first |
| **Execution skill** | present only when a specific skill should drive the work; else the routine runs freeform |
| **Branch** | `phase-<N>/<M>-<kebab>` (spec) \| `task/<kebab>` (standalone) |
| **Depends on** | the blocking issue numbers, mirroring `blocked-by:#<N>`; omitted if none |

The issue body is the **sole authority** on which skills run — the routine invokes exactly the named skills, freeform if none. The PR auto-wires `Closes #<N>` so a merge closes the issue.
```

- [ ] **Step 2: Verify the doc is complete and concise**

Run: `grep -oE 'autonomous-ready|kind:spec|kind:standalone|blocked-by|review-ready|needs-input|needs-attention' ../daily-work-harness/autonomous-workflow.md | sort -u`
Expected: all 7 label tokens present.

Run: `wc -l ../daily-work-harness/autonomous-workflow.md`
Expected: roughly 55–75 lines (concise, table-driven). If much longer, trim prose.

- [ ] **Step 3: Verify agnosticism**

Run: `grep -rniE 'a2ui|primer' ../daily-work-harness/autonomous-workflow.md || echo CLEAN`
Expected: `CLEAN`.

- [ ] **Step 4: Commit**

```bash
git -C /Users/jiohin/Desktop/future-of-sw/daily-work-harness add autonomous-workflow.md
git -C /Users/jiohin/Desktop/future-of-sw/daily-work-harness commit -m "docs(phase-5): seed autonomous-workflow.md with the issue/label contract"
```

---

### Task 2: Author the `delegate-task` skill

**Files:**
- Create: `../daily-work-harness/skills/delegate-task/SKILL.md`

**Interfaces:**
- Consumes: the contract in `autonomous-workflow.md` (Task 1) — labels, schema, states.
- Produces: the `daily-work-harness:delegate-task` slash command that Tasks 3–4 point to.

- [ ] **Step 1: Write the skill**

Create `../daily-work-harness/skills/delegate-task/SKILL.md` with this content. The flow is locked in spec §9 (readiness gate, dedupe, judged plan necessity, human gate, TODO wiring). The body **references** the contract doc and must not re-list the label/schema tables.

```markdown
---
name: delegate-task
description: Project a task — a spec'd `N.M` sub-task, or a standalone hotfix/chore — into a GitHub issue conforming to the autonomous-run contract, for the nightly routine to pick up. Use when the user invokes `/delegate-task` or asks to delegate / hand off a task to the autonomous routine.
---

# delegate-task

Projects a task into a GitHub issue the nightly routine can run unattended. **Read `${CLAUDE_PLUGIN_ROOT}/autonomous-workflow.md` in full first** — it defines the issue/label contract this skill writes. Interactive and human-gated; run from the repo root (`main`). Issues are created in the project's own `origin` repo.

## Workflow

1. **Resolve target + kind.**
   - Invoked with `N.M` → **`kind:spec`**. Read its `_dev/TODO.md` line (assume it is already `[WIP]`, picked up) + the phase spec, plus `_dev/docs/plan/task-<N.M>-*.md` if present.
   - Invoked with no argument or a free-form description → **`kind:standalone`**. Interview for the full definition; derive a kebab title.

2. **Readiness gate.** Confirm the task is defined enough to run unattended.
   - `kind:spec`: the phase spec must exist — if not, stop ("spec the phase first"). If the definition is only a thin phase-spec handle, surface the choice: grill / `superpowers:writing-plans` **now, this session**, or proceed trusting the Plan-skill section to let the routine plan from the phase spec. "No plan doc" is **not** "not ready"; "not ready" is a definition too thin for even planning to land — kick that back to a grill/spec.
   - `kind:standalone`: the interview captures the definition; a large one may reference a spec/plan path instead of inlining it.
   - This gate normally passes trivially — `/delegate-task` is usually invoked right after a grill/spec in the same session.

3. **Dedupe.** List open issues. Refuse if the task already has one — one open issue per task (`kind:spec` keys on the `[N.M]` title / the `(#N)` in the TODO line; `kind:standalone` cannot auto-dedupe, so use judgment).

4. **Judge skills — propose, the human confirms or overrides.**
   - **Plan:** plan doc exists → none, execute it. No plan doc and planning **not** warranted (small, well-scoped) → propose **direct execution**, no Plan-skill section. No plan doc and planning warranted (multi-step, needs decomposition) → propose a **Plan skill**. Bias toward the leaner option.
   - **Execution:** propose the execution skill that fits the project (read its `CLAUDE.md` + installed skills), or none for freeform.

5. **Dependencies.** Ask for the blocking issue numbers; ensure each `blocked-by:#<N>` label exists and apply it. A dependency must already be delegated so its number exists.

6. **Preview — the human gate.** Assemble the full issue (title, body per the contract's schema, labels) and show it. **Nothing hits GitHub until the user approves.**

7. **Create.** Ensure the issue-side labels exist (`autonomous-ready`, the `kind:*`, any `blocked-by:#<N>`), then create the issue with them in `origin`.

8. **Wire TODO** (`kind:spec` only): append `(#<new>)` to the sub-task's `[WIP]` line in `_dev/TODO.md` on `main`.

9. **Report** the issue URL, then stop.

## Notes

- The label vocabulary, issue schema, and states live in `autonomous-workflow.md` — this skill **writes** them, it does not redefine them.
- `/delegate-task` only creates the issue. The routine produces the PR; `daily-work-harness:review-nightly` closes the issue + PR.
- Project-agnostic: skill names, spec paths, and the target repo all come from the current project — never hardcode.
```

- [ ] **Step 2: Verify the skill references the contract and does not copy it**

Run: `grep -c 'autonomous-workflow.md' ../daily-work-harness/skills/delegate-task/SKILL.md`
Expected: ≥ 1 (it references the doc).

Run: `grep -c '| Label | Meaning |' ../daily-work-harness/skills/delegate-task/SKILL.md`
Expected: `0` (the label table exists only in the contract doc, not copied here).

- [ ] **Step 3: Verify agnosticism**

Run: `grep -rniE 'a2ui|primer' ../daily-work-harness/skills/delegate-task/SKILL.md || echo CLEAN`
Expected: `CLEAN`.

- [ ] **Step 4: Commit**

```bash
git -C /Users/jiohin/Desktop/future-of-sw/daily-work-harness add skills/delegate-task/SKILL.md
git -C /Users/jiohin/Desktop/future-of-sw/daily-work-harness commit -m "feat(phase-5): add delegate-task skill"
```

---

### Task 3: Wire delegation into `pick-up-task`

**Files:**
- Modify: `../daily-work-harness/skills/pick-up-task/SKILL.md`

**Interfaces:**
- Consumes: the `(#N)` delegated-marker convention (spec §12) and the `daily-work-harness:delegate-task` command (Task 2).

- [ ] **Step 1: Exclude delegated sub-tasks from the startable set (step 2, "Spec'd phase" bullet)**

Find this line:

```
   - **Spec'd phase** (spec exists, ≥1 unchecked `N.M`): read the phase spec **in full** + TODO, compute the **startable** sub-tasks (next-in-order plus any parallel-eligible per the spec), and present **all** of them — even if only one. **Never auto-pick a sub-task.** Let the user choose.
```

Replace it with:

```
   - **Spec'd phase** (spec exists, ≥1 unchecked `N.M`): read the phase spec **in full** + TODO, compute the **startable** sub-tasks (next-in-order plus any parallel-eligible per the spec), and present **all** of them — even if only one. A `[WIP]` sub-task carrying `(#N)` is **delegated** (running autonomously) — exclude it from the startable set, but list it under a **delegated / in-flight** heading so its issue/PR stays visible. **Never auto-pick a sub-task.** Let the user choose.
```

- [ ] **Step 2: Handle the delegated `[WIP]` on resume (step 2, "`[WIP]` resume" bullet)**

Find this line:

```
   - **`[WIP]` resume:** first read the matching handoff doc (`_dev/docs/handoff/phase-<N>.md` for spec work, `task-<N.M>.md` for sub-task work) and, for a sub-task, its `_dev/docs/plan/task-<N.M>-*.md` if present. Report where it stands, then continue the matching track.
```

Replace it with:

```
   - **`[WIP]` resume:** first read the matching handoff doc (`_dev/docs/handoff/phase-<N>.md` for spec work, `task-<N.M>.md` for sub-task work) and, for a sub-task, its `_dev/docs/plan/task-<N.M>-*.md` if present. Report where it stands, then continue the matching track. A delegated `[WIP]` (one carrying `(#N)`) has **no handoff doc** — it is in flight autonomously; point the user to its issue/PR (or `daily-work-harness:review-nightly`) instead of resuming it locally.
```

- [ ] **Step 3: Add delegation as a sub-task route (step 4)**

Find this line:

```
   - **On go-ahead**, offer three routes (planning stays on `main`): (a) `grill-me` deeper, (b) `superpowers:writing-plans` → `_dev/docs/plan/task-<N.M>-*.md`, (c) Claude Code plan mode → implementation.
```

Replace it with:

```
   - **On go-ahead**, offer these routes (planning stays on `main`): (a) `grill-me` deeper, (b) `superpowers:writing-plans` → `_dev/docs/plan/task-<N.M>-*.md`, (c) Claude Code plan mode → implementation, (d) `daily-work-harness:delegate-task` → hand the sub-task to the nightly routine.
```

- [ ] **Step 4: Verify the edits**

Run: `grep -c 'delegated' ../daily-work-harness/skills/pick-up-task/SKILL.md`
Expected: ≥ 2 (startable exclusion + resume note).

Run: `grep -c 'delegate-task' ../daily-work-harness/skills/pick-up-task/SKILL.md`
Expected: ≥ 1 (route d).

- [ ] **Step 5: Commit**

```bash
git -C /Users/jiohin/Desktop/future-of-sw/daily-work-harness add skills/pick-up-task/SKILL.md
git -C /Users/jiohin/Desktop/future-of-sw/daily-work-harness commit -m "feat(phase-5): pick-up-task reads delegated [WIP](#N) + offers delegate route"
```

---

### Task 4: Add the closing delegate/work-now fork to `grill-to-spec`

**Files:**
- Modify: `../daily-work-harness/skills/grill-to-spec/SKILL.md`

**Interfaces:**
- Consumes: the `daily-work-harness:delegate-task` command (Task 2).

- [ ] **Step 1: Add the closing fork to the Process**

Find this line (step 4 of `## Process`):

```
4. Report the written path in one line. The user will redirect if revisions are needed.
```

Replace it with:

```
4. Report the written path in one line. The user will redirect if revisions are needed.
5. **Closing fork.** After the path is reported, offer the two ways forward — **delegate** the task to the nightly routine (`daily-work-harness:delegate-task`) or **work it this session**. This single fork is the only next-step this skill gives; nothing more.
```

- [ ] **Step 2: Carve the fork out of the "never does" rule**

Find this line (under `## What this skill never does`):

```
- Add "recommended next steps."
```

Replace it with:

```
- Add "recommended next steps" beyond the single closing delegate / work-now fork.
```

- [ ] **Step 3: Verify the edits**

Run: `grep -c 'delegate-task' ../daily-work-harness/skills/grill-to-spec/SKILL.md`
Expected: ≥ 1.

Run: `grep -c 'Closing fork' ../daily-work-harness/skills/grill-to-spec/SKILL.md`
Expected: `1`.

- [ ] **Step 4: Commit**

```bash
git -C /Users/jiohin/Desktop/future-of-sw/daily-work-harness add skills/grill-to-spec/SKILL.md
git -C /Users/jiohin/Desktop/future-of-sw/daily-work-harness commit -m "feat(phase-5): grill-to-spec offers closing delegate/work-now fork"
```

---

### Task 5: README, version bump, and DoD verification

**Files:**
- Modify: `../daily-work-harness/README.md`
- Modify: `../daily-work-harness/.claude-plugin/plugin.json:3`

**Interfaces:**
- Consumes: all artifacts from Tasks 1–4.

- [ ] **Step 1: List the new skill and doc in the README**

Find this line (under `## Skills`):

```
- **review-nightly** — triage the open `phase-<N>/<M>-*` PRs an autonomous run left on the remote: review each against its phase spec, then merge or close.
```

Replace it with:

```
- **review-nightly** — triage the open `phase-<N>/<M>-*` PRs an autonomous run left on the remote: review each against its phase spec, then merge or close.
- **delegate-task** — project a task into a GitHub issue conforming to the autonomous-run contract, for the nightly routine to pick up.
```

Then find this line:

```
The workflow model these fit is documented in [`daily-workflow.md`](./daily-workflow.md).
```

Replace it with:

```
The workflow model these fit is documented in [`daily-workflow.md`](./daily-workflow.md); the autonomous half is in [`autonomous-workflow.md`](./autonomous-workflow.md).
```

- [ ] **Step 2: Bump the plugin version**

In `../daily-work-harness/.claude-plugin/plugin.json`, change `"version": "0.1.3"` → `"version": "0.1.4"` (forces the installed-plugin cache to refresh, per repo convention).

- [ ] **Step 3: Verify plugin JSON is valid**

Run: `python3 -m json.tool ../daily-work-harness/.claude-plugin/plugin.json > /dev/null && python3 -m json.tool ../daily-work-harness/.claude-plugin/marketplace.json > /dev/null && echo VALID`
Expected: `VALID`.

- [ ] **Step 4: DoD verification (phase spec §6)**

(1) Artifacts exist:

Run: `ls ../daily-work-harness/autonomous-workflow.md ../daily-work-harness/skills/delegate-task/SKILL.md`
Expected: both paths listed, no error.

(2) Mutually consistent — the contract is defined once, referenced elsewhere:

Run: `grep -l '| Label | Meaning |' ../daily-work-harness/autonomous-workflow.md ../daily-work-harness/skills/*/SKILL.md`
Expected: only `autonomous-workflow.md` (the vocabulary table exists nowhere else).

Run: `grep -rl 'autonomous-workflow.md' ../daily-work-harness/skills/delegate-task/SKILL.md`
Expected: the delegate-task skill (it references the doc).

(3) Project-agnostic across everything touched:

Run: `grep -rniE 'a2ui|primer' ../daily-work-harness/autonomous-workflow.md ../daily-work-harness/skills/delegate-task/SKILL.md ../daily-work-harness/skills/pick-up-task/SKILL.md ../daily-work-harness/skills/grill-to-spec/SKILL.md ../daily-work-harness/README.md || echo CLEAN`
Expected: `CLEAN`.

- [ ] **Step 5: Commit**

```bash
git -C /Users/jiohin/Desktop/future-of-sw/daily-work-harness add README.md .claude-plugin/plugin.json
git -C /Users/jiohin/Desktop/future-of-sw/daily-work-harness commit -m "docs(phase-5): list delegate-task + autonomous-workflow in README; bump to 0.1.4"
```

- [ ] **Step 6: Reload the plugin and confirm the command exists**

Reload the plugin cache (restart the session or re-run `/plugin` install) so `0.1.4` is picked up, then confirm `/daily-work-harness:delegate-task` is offered. This is manual — note it in the wrap-up if the cache hasn't refreshed yet.

---

## Self-Review

**Spec coverage** — every spec decision maps to a task:

- §1 kinds/unit → Task 1 (doc "The unit").
- §2 label taxonomy, §3 inferred states, §4 `blocked-by` mechanics, §5 issue schema → Task 1 (doc tables).
- §6 skills issue-authoritative → Task 1 (doc "sole authority" line) + Task 2 (skill Notes).
- §7 skills from project / human-confirm, §8 judged plan necessity → Task 2 (Workflow step 4).
- §9 `/delegate-task` flow → Task 2 (Workflow steps 1–9).
- §10 repo target + label bootstrapping → Task 2 (steps 1/7) + Task 1 (doc "origin").
- §11 canonical home `autonomous-workflow.md` → Task 1 (create) + Task 2 (reference, no copy).
- §12 TODO in-flight signal + entry edits → Task 2 (step 8) + Task 3 (pick-up-task) + Task 4 (grill-to-spec).
- Invariants (agnostic; arbitrary task types; one-definition-three-referrers) → verified in Tasks 1–5 agnosticism greps + Task 5 DoD consistency grep.

No gaps.

**Placeholder scan:** none — every artifact's full content or exact edit string is given.

**Naming consistency:** label tokens (`autonomous-ready`, `kind:spec`, `kind:standalone`, `blocked-by:#<N>`, `review-ready`, `needs-input`, `needs-attention`), the `(#N)` TODO marker, and the `daily-work-harness:delegate-task` command string are identical across Tasks 1–5.
```