# Task 5.2 — Autonomous producing routine — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Ship the nightly producing routine — a self-contained prompt that drains the issue queue into gated PRs — plus the produce half of `autonomous-workflow.md`, in the `daily-work-harness` plugin repo.

**Architecture:** Four Markdown deliverables in `../daily-work-harness`: the contract-first restructure of `autonomous-workflow.md` (adding `blocked:setup`), its new **Produce** section, a new self-contained routine prompt (`nightly-routine-prompt.md`), and a re-scoped read pointer in `delegate-task`, plus README + version bump. The routine prompt is the derived, self-contained copy; `autonomous-workflow.md` is the authoring source of truth, and their consistency is the graded criterion.

**Tech Stack:** Claude Code plugin artifacts (Markdown + YAML frontmatter) and a cloud-Routine prompt. No runtime code. Verification is structural consistency + project-agnosticism (phase DoD §6), not unit tests.

## Global Constraints

- **Repo:** all commits land in `/Users/jiohin/Desktop/future-of-sw/daily-work-harness` (its own git), on `main`. **No `a2ui-github` worktree.** Use `git -C /Users/jiohin/Desktop/future-of-sw/daily-work-harness …` for every git step (bash cwd resets between calls).
- **This plan doc + the task spec live on `main` in `a2ui-github`'s `_dev/`** — do not copy them into the harness repo.
- **Source of truth:** design is locked in `a2ui-github/_dev/docs/spec/task-5.2-nightly-routine.md`. Do not re-decide anything; implement it.
- **Self-contained prompt:** `nightly-routine-prompt.md` runs in a fresh cloud clone with **no harness plugin**. It must **not** reference `${CLAUDE_PLUGIN_ROOT}`, `autonomous-workflow.md`, or any `daily-work-harness:*` / `superpowers:*` skill as a runtime dependency. Everything the routine needs is inline in the prompt.
- **Authoring source vs derived copy:** the label vocabulary, outcome taxonomy, PR shape, and `blocked:setup` behaviour are defined in `autonomous-workflow.md`; `nightly-routine-prompt.md` restates the producer-facing slice. The two must stay consistent — identical label tokens, identical outcome names.
- **Project-agnostic:** no `a2ui-github`, `primer`, `Primer`, `yarn`, `uv`, or component-only assumptions in any artifact. Gate commands, skill names, spec paths, and branch names all come from the project / the issue at runtime.
- **Concise docs:** `autonomous-workflow.md` is read by section, so keep the Produce section tight — tables over prose, density ≈ the existing Contract section.
- **Version bump forces cache refresh:** bump `plugin.json` version so the installed plugin cache picks up the change.
- **Commit convention:** conventional commits, `feat(phase-5): …` / `docs(phase-5): …`.
- **Scope boundary:** 5.2 seeds the **Produce** section only. Do **not** write the **Review** section of `autonomous-workflow.md` (5.3), and do **not** touch `review-nightly` or `daily-workflow.md`.

---

### Task 1: Restructure `autonomous-workflow.md` contract-first + add `blocked:setup`

**Files:**
- Modify: `../daily-work-harness/autonomous-workflow.md`

**Interfaces:**
- Produces: a `## Contract` umbrella section (subsections: the unit, labels, states, dependencies, issue schema) that `delegate-task` (Task 4) reads via an extraction command; the `blocked:setup` issue label that Tasks 2–3 reference.

- [ ] **Step 1: Overwrite the file with the contract-first structure**

Replace the entire contents of `../daily-work-harness/autonomous-workflow.md` with exactly this (the Produce section is appended in Task 2):

```markdown
# Autonomous workflow

The map of the autonomous half of the daily-work harness: a delegated task becomes a GitHub issue, a nightly routine produces a gated PR, and `review-nightly` merges it back. The **Contract** section below is the coupling all three pieces share; the **Produce** section maps the nightly routine. Kept concise — its readers read it by section.

## Contract

The issue/label contract the writer (`delegate-task`), the producer (the nightly routine), and the closer (`review-nightly`) all conform to.

### The unit

A delegated task is one GitHub **issue** = one PR = one merge, created in the project's own `origin` repo. Two kinds:

- **`kind:spec`** — the definition is a committed spec + a `_dev/TODO.md` `N.M` line; the producer reads the spec.
- **`kind:standalone`** — self-contained; the full definition is in the issue body.

### Labels

Issue and PR labels never overlap: **issue labels = queue / classification / dependency; PR labels = run outcome.**

Issue labels:

| Label | Meaning |
|---|---|
| `autonomous-ready` | the selector — the human's "safe to run unattended" gate; the routine's filter |
| `kind:spec` \| `kind:standalone` | how to read the task |
| `blocked-by:#<N>` (0+) | one per unmet dependency; auto-cleared when the dependency closes |
| `blocked:setup` | the routine hit a setup blocker — a missing skill / path, a malformed issue, or an environment that can't run the gates; human-cleared |

PR labels — every produced PR carries **exactly one**:

| Label | Meaning | review-nightly |
|---|---|---|
| `review-ready` | produced clean, ready for merge | case-1 |
| `needs-input` | run stuck on a decision it can't make | case-2 |
| `needs-attention` | run failed mechanically (gates red / errored) | fix or close |

`autonomous-ready` (entry) and `review-ready` (exit) are the paired gates: the human gates entry, the machine gates exit.

### States

Most states are inferred, not labelled:

- **queued** — open issue, `autonomous-ready`, no linked PR, no `blocked-by:*` remaining, not `blocked:setup`.
- **blocked** — carries ≥1 `blocked-by:#<N>`, or `blocked:setup`; the routine skips it.
- **produced** — an open PR exists; its outcome label (`review-ready` / `needs-input` / `needs-attention`) says whether it's mergeable, blocked on input, or failed. Produced PRs are never drafts — the label alone gates merge, and any open PR stops re-grabbing (the one-open-PR-per-task guarantee).
- **done** — issue closed (its PR merged).

### Dependencies — `blocked-by:#<N>`

Dependencies are `blocked-by:#<N>` labels, one per blocking issue; unblocked = zero remain. When a dependency issue closes, its `blocked-by:#<N>` label is deleted repo-wide, which strips it from every dependent at once. Ordering follows: a dependency is delegated first so its number exists to reference.

### Issue schema

Title:

- `kind:spec` → `[N.M] <sub-task title>`
- `kind:standalone` → an imperative title

Body:

| Section | Content |
|---|---|
| **Task** | `kind:standalone`: the full definition. `kind:spec`: "Phase N sub-task N.M". |
| **References** | `kind:spec` only — the spec that defines the sub-task: the task-level `task-<N.M>` spec if one exists, else the phase spec (+ plan-doc path if it exists). By path, never embedded. |
| **Plan skill** | present only when planning is warranted; names the skill to plan first |
| **Execution skill** | present only when a specific skill should drive the work; else the routine runs freeform |
| **Branch** | `phase-<N>/<M>-<kebab>` (spec) \| `task/<kebab>` (standalone) |
| **Depends on** | the blocking issue numbers, mirroring `blocked-by:#<N>`; omitted if none |

The issue body is the **sole authority** on which skills run — the routine invokes exactly the named skills, freeform if none. The PR auto-wires `Closes #<N>` so a merge closes the issue.
```

- [ ] **Step 2: Verify the contract-first structure**

Run: `grep -nE '^## Contract$|^### The unit$|^### Labels$|^### States$|^### Dependencies|^### Issue schema$' ../daily-work-harness/autonomous-workflow.md`
Expected: all six headings present, `## Contract` before the five `###` subsections.

Run: `grep -c 'blocked:setup' ../daily-work-harness/autonomous-workflow.md`
Expected: ≥ 2 (Labels row + States "blocked").

- [ ] **Step 3: Verify agnosticism**

Run: `grep -rniE 'a2ui|primer' ../daily-work-harness/autonomous-workflow.md || echo CLEAN`
Expected: `CLEAN`.

- [ ] **Step 4: Commit**

```bash
git -C /Users/jiohin/Desktop/future-of-sw/daily-work-harness add autonomous-workflow.md
git -C /Users/jiohin/Desktop/future-of-sw/daily-work-harness commit -m "docs(phase-5): restructure autonomous-workflow.md contract-first + add blocked:setup"
```

---

### Task 2: Add the **Produce** section to `autonomous-workflow.md`

**Files:**
- Modify: `../daily-work-harness/autonomous-workflow.md`

**Interfaces:**
- Consumes: the `## Contract` section (Task 1) — labels, states, schema.
- Produces: the `## Produce` section (with `### Outcomes`, `### PR shape`, `### Routine setup`) that `nightly-routine-prompt.md` (Task 3) is kept consistent with, and the `## Produce` heading that Task 4's extraction command uses as its terminator.

- [ ] **Step 1: Append the Produce section**

Append exactly this to the end of `../daily-work-harness/autonomous-workflow.md` (after the Issue schema section):

```markdown

## Produce

The nightly routine is a self-contained prompt registered as a Claude cloud Routine via `/schedule`, run against a fresh clone of the project repo with **no harness plugin present**. The executable is [`nightly-routine-prompt.md`](./nightly-routine-prompt.md); this section is the map it is kept consistent with.

Each fire **drains the queue**: it lists every **eligible** issue — open, `autonomous-ready`, no `blocked-by:*`, no `blocked:setup`, no open PR — oldest first, then works them one at a time, **a subagent per issue**. Each issue is finished (commit → push → open PR) before the next starts, so a completed task's open PR is a durable checkpoint: the run is resumable across fires, and unreached issues roll to the next fire.

### Outcomes

Running one issue ends in exactly one terminal outcome:

| Outcome | Artifact | Label | Re-grabbed? |
|---|---|---|---|
| clean | non-draft PR | `review-ready` (PR) | no — open PR |
| blocked on a decision | non-draft PR, partial work | `needs-input` (PR) | no — open PR |
| gates red / mid-run error | non-draft PR | `needs-attention` (PR) | no — open PR |
| precondition failure | issue comment, no PR | `blocked:setup` (issue) | no — label excludes it |
| hard crash | none | none | yes, next fire |

A **precondition failure** is a setup blocker the routine can't fix itself — a named skill not committed to the clone, a referenced spec/plan path absent, an unparseable issue body, or an environment that cannot run the project's gates. The routine applies `blocked:setup` and leaves one comment (blocker + fix), then stops without a PR:

```
## ⛔ blocked:setup — autonomous run could not start
- **Blocker:** <one line: which precondition failed>
- **Details:** <the skill name / missing path / absent field>
- **Fix:** <what to do, then remove the `blocked:setup` label to re-queue>
```

### PR shape

Every produced PR is **non-draft**, its title mirrors the issue, and its body carries a `## Related issue` section with `Closes #<N>` (a merge closes the issue), a summary, a gates block, and one per-outcome section: recorded assumptions (`review-ready`), a **Decision needed** writeup (`needs-input`), or a **Failure** writeup (`needs-attention`). Exactly one outcome label is applied.

### Routine setup

Per-project operator setup, done once when adopting the routine (ungraded):

- Register `nightly-routine-prompt.md`'s content via `/schedule` as a **Remote** routine (not a local/desktop task — Remote runs fully autonomously with no approval prompts), on a nightly cadence, on a capable model (e.g. Opus).
- Enable **unrestricted branch pushes** for the repo — Routines default to `claude/`-prefixed branches, but the contract uses `phase-<N>/<M>-*` / `task/<kebab>`.
- Provide an environment **setup script** that installs the project's dependencies so gates can run, plus any network hosts the gates need beyond the default allowlist.
- Ensure the project's Plan/Execution skills are committed under `.claude/skills/` — the routine has no access to plugin skills, only repo-committed ones.
```

- [ ] **Step 2: Verify the section and its subsections**

Run: `grep -nE '^## Produce$|^### Outcomes$|^### PR shape$|^### Routine setup$' ../daily-work-harness/autonomous-workflow.md`
Expected: all four headings present, in this order, after `## Contract`.

Run: `grep -oE 'review-ready|needs-input|needs-attention|blocked:setup' ../daily-work-harness/autonomous-workflow.md | sort -u`
Expected: all four outcome/label tokens present.

- [ ] **Step 3: Verify agnosticism**

Run: `grep -rniE 'a2ui|primer|yarn|uv sync' ../daily-work-harness/autonomous-workflow.md || echo CLEAN`
Expected: `CLEAN`.

- [ ] **Step 4: Commit**

```bash
git -C /Users/jiohin/Desktop/future-of-sw/daily-work-harness add autonomous-workflow.md
git -C /Users/jiohin/Desktop/future-of-sw/daily-work-harness commit -m "docs(phase-5): add Produce section to autonomous-workflow.md"
```

---

### Task 3: Create `nightly-routine-prompt.md`

**Files:**
- Create: `../daily-work-harness/nightly-routine-prompt.md`

**Interfaces:**
- Consumes: the produce behaviour mapped in `autonomous-workflow.md`'s Produce section (Task 2) — restated self-contained here (no runtime reference to the doc).
- Produces: the registered routine prompt; the executable the Produce section points at.

- [ ] **Step 1: Write the routine prompt**

Create `../daily-work-harness/nightly-routine-prompt.md` with exactly this content. It is self-contained: no `${CLAUDE_PLUGIN_ROOT}`, no reference to `autonomous-workflow.md` or any plugin skill.

````markdown
# Nightly producing routine

You are the autonomous producing routine of the daily-work harness. You run unattended in a fresh clone of a project repository, on its default branch. There is **no harness plugin here** — you cannot read any `daily-work-harness:*` or `superpowers:*` skill unless it is committed under `.claude/skills/` in this repo, and there is no shared workflow doc to open. Everything you need is in this prompt. Read the project's `CLAUDE.md` for its rules and gate commands.

**You run fully autonomously — no human is at the keyboard.** Never wait for confirmation or approval: make the decision, record it as an assumption, and proceed. Surface a blocker only through the `needs-input` or `blocked:setup` outcomes defined below — never by pausing.

Work against the repo's own `origin`; commits and PRs go through the connected GitHub identity. Use conventional commits. Ensure any label you apply exists on the repo first (idempotent create).

## Orchestrator

1. **Build the queue.** List open issues that are labelled `autonomous-ready`, carry **no** `blocked-by:*` label, carry **no** `blocked:setup` label, and have **no** open linked PR. Order oldest issue number first. If the queue is empty, report "nothing queued" and stop.

2. **Drain the queue.** For each issue in order, **dispatch a subagent** and give it (a) the entire "## Per-issue production procedure" section below, verbatim, and (b) the issue number. The subagent produces one PR — or takes the `blocked:setup` path — and returns a one-line outcome. Do **not** do the per-issue work in this orchestrator context; delegate it, so your context holds only the queue and the returned summaries.

3. **Finish before moving on.** Start the next issue only after the current subagent returns. Each issue is fully checkpointed on GitHub (an open PR, or a `blocked:setup` label) before the next begins, so the run is resumable if it is cut short.

4. **Report.** When the queue is drained, print a tally — one row per issue: `#<issue> → PR #<n>, <outcome>`, or `#<issue> → blocked:setup`, or `#<issue> → no PR (<reason>)`. This is a convenience summary; GitHub state is the source of truth.

## Per-issue production procedure

You are producing **one** issue end to end. You are given its number. Produce exactly one non-draft PR, or take the `blocked:setup` path. Return a one-line outcome to the orchestrator.

1. **Read the issue.** Note its kind (`kind:spec` or `kind:standalone`), the named Plan and Execution skills (if any), the referenced spec/plan paths (`kind:spec`), and the branch name from the body.

2. **Precondition check — fail fast.** Before any work, verify: every named skill resolves as a committed skill under `.claude/skills/`; every referenced spec/plan path exists in this clone; the issue body is well-formed (has a `kind:*` label and a Branch). If **any** check fails, take the **blocked:setup path** and stop:
   - Apply the `blocked:setup` label to the issue.
   - Post one comment:
     ```
     ## ⛔ blocked:setup — autonomous run could not start
     - **Blocker:** <one line: which precondition failed>
     - **Details:** <the skill name / missing path / absent field>
     - **Fix:** <what to do, then remove the `blocked:setup` label to re-queue>
     ```
   - Do **not** create a branch or open a PR. Return `blocked:setup`.

3. **Create the branch** named in the issue, from the default branch. If a branch of that name already exists from a prior failed run, delete and recreate it so you start clean.

4. **Do the work.** Invoke **exactly** the named skills — the Plan skill first (if named), then the Execution skill (if named). Run freeform if none are named. Invoke no skill the issue did not name. If a Plan skill runs, its plan doc is written **on this branch** — it is the only `_dev/` file you may write. Never touch `_dev/TODO.md`, specs, or handoffs. Decide anything inferable from the spec, the repo's conventions, or existing patterns with best judgment and record it as an assumption; escalate to `needs-input` only for a decision that is **material, genuinely underdetermined, and costly if wrong**. If you escalate to `needs-input`, stop implementation here — skip the gate branching in step 5 and go to step 6 to open the PR with the **Decision needed** section (its Gates block records whatever ran, or "not run — blocked before completion").

5. **Run the gates.** Run the project's documented verification gates (from its `CLAUDE.md` / subproject READMEs); capture what ran and the result. Then branch on the outcome: gates **green** → continue to step 6 (`review-ready`); gates **ran and failed** → continue to step 6 with the **Failure** section and label `needs-attention`; gates **cannot run at all** (environment not provisioned, command absent) → apply the `blocked:setup` label + comment as in step 2 (Blocker = "gates could not run"); the branch you created may be left as-is (a re-queue recreates it). Return `blocked:setup`.

6. **Commit, push, and open the PR.** Commit your work (conventional commits) and push the branch. The PR is always **non-draft**: base = default branch, head = the issue's branch, title mirrors the issue. If the branch has no commits yet (a `needs-input` that blocked before implementation), make an empty commit first (`git commit --allow-empty`) so a PR can open. Body:
   ```
   ## Related issue
   Closes #<issue>

   ## Summary
   <what the task was and what this PR does>

   ## Gates
   <the gates that ran and their result>

   <then the section(s) for this outcome:>

   ## Assumptions            (review-ready / needs-input — judgment calls made)
   - <assumption + why>

   ## Decision needed        (needs-input only)
   - **Ambiguity:** <what is underdetermined>
   - **Options considered:** <the plausible readings>
   - **Input needed:** <the exact question the human must answer>
   - **Partial work:** <what was done, or "none — blocked before implementation">

   ## Failure                (needs-attention only)
   - **What failed:** <the mechanical failure / red gate>
   - <the failing output, trimmed>
   ```

7. **Label the PR.** Apply **exactly one** outcome label:
   - `review-ready` — clean, gates green.
   - `needs-input` — blocked on a decision (body has "Decision needed").
   - `needs-attention` — gates red or a mechanical error mid-run (body has "Failure").
   Return `PR #<n>, <label>`.
````

- [ ] **Step 2: Verify self-containment**

Run: `grep -cE 'CLAUDE_PLUGIN_ROOT|autonomous-workflow\.md' ../daily-work-harness/nightly-routine-prompt.md`
Expected: `0` (no `${CLAUDE_PLUGIN_ROOT}` path and no reference to the contract doc — the `daily-work-harness:*` / `superpowers:*` namespaces appearing in the "you don't have these skills" note are intentional and fine).

Run: `grep -nE '^## Orchestrator$|^## Per-issue production procedure$' ../daily-work-harness/nightly-routine-prompt.md`
Expected: both headings present.

- [ ] **Step 3: Verify label/outcome consistency with the doc**

Run: `for t in autonomous-ready blocked-by blocked:setup review-ready needs-input needs-attention; do grep -q "$t" ../daily-work-harness/nightly-routine-prompt.md || echo "MISSING $t"; done; echo done`
Expected: only `done` (every contract token the producer uses is present).

- [ ] **Step 4: Verify agnosticism**

Run: `grep -rniE 'a2ui|primer|yarn|uv sync' ../daily-work-harness/nightly-routine-prompt.md || echo CLEAN`
Expected: `CLEAN`.

- [ ] **Step 5: Commit**

```bash
git -C /Users/jiohin/Desktop/future-of-sw/daily-work-harness add nightly-routine-prompt.md
git -C /Users/jiohin/Desktop/future-of-sw/daily-work-harness commit -m "feat(phase-5): add nightly-routine-prompt.md"
```

---

### Task 4: Re-scope `delegate-task`'s read to the Contract section

**Files:**
- Modify: `../daily-work-harness/skills/delegate-task/SKILL.md:8`

**Interfaces:**
- Consumes: the `## Contract` / `## Produce` headings in `autonomous-workflow.md` (Tasks 1–2) that bound the extraction command.

- [ ] **Step 1: Replace the read pointer with an extraction command**

Find this line (line 8):

```
Projects a task into a GitHub issue the nightly routine can run unattended. **Read `${CLAUDE_PLUGIN_ROOT}/autonomous-workflow.md` in full first** — it defines the issue/label contract this skill writes. Interactive and human-gated; run from the repo root (`main`). Issues are created in the project's own `origin` repo.
```

Replace it with:

```
Projects a task into a GitHub issue the nightly routine can run unattended. **First read the contract** — `sed -n '/^## Contract/,/^## Produce/p' ${CLAUDE_PLUGIN_ROOT}/autonomous-workflow.md` — the issue/label contract this skill writes. Interactive and human-gated; run from the repo root (`main`). Issues are created in the project's own `origin` repo.
```

- [ ] **Step 2: Verify the edit and that the extraction command is well-formed**

Run: `grep -c "sed -n '/^## Contract/,/^## Produce/p'" ../daily-work-harness/skills/delegate-task/SKILL.md`
Expected: `1`.

Run: `grep -c 'in full first' ../daily-work-harness/skills/delegate-task/SKILL.md`
Expected: `0` (the old full-read pointer is gone).

Run: `sed -n '/^## Contract/,/^## Produce/p' ../daily-work-harness/autonomous-workflow.md | grep -c '| Label | Meaning |'`
Expected: `1` (the command actually surfaces the label vocabulary — the Contract section it points at).

- [ ] **Step 3: Commit**

```bash
git -C /Users/jiohin/Desktop/future-of-sw/daily-work-harness add skills/delegate-task/SKILL.md
git -C /Users/jiohin/Desktop/future-of-sw/daily-work-harness commit -m "refactor(phase-5): delegate-task reads only the Contract section"
```

---

### Task 5: README, version bump, and DoD verification

**Files:**
- Modify: `../daily-work-harness/README.md:44-46`
- Modify: `../daily-work-harness/.claude-plugin/plugin.json:3`

**Interfaces:**
- Consumes: all artifacts from Tasks 1–4.

- [ ] **Step 1: List the routine prompt in the README**

Find these lines (44–46):

```
- **delegate-task** — project a task into a GitHub issue conforming to the autonomous-run contract, for the nightly routine to pick up.

The workflow model these fit is documented in [`daily-workflow.md`](./daily-workflow.md); the autonomous half is in [`autonomous-workflow.md`](./autonomous-workflow.md).
```

Replace them with:

```
- **delegate-task** — project a task into a GitHub issue conforming to the autonomous-run contract, for the nightly routine to pick up.

The workflow model these fit is documented in [`daily-workflow.md`](./daily-workflow.md); the autonomous half is in [`autonomous-workflow.md`](./autonomous-workflow.md). The nightly producing routine registered via `/schedule` is [`nightly-routine-prompt.md`](./nightly-routine-prompt.md).
```

- [ ] **Step 2: Bump the plugin version**

In `../daily-work-harness/.claude-plugin/plugin.json`, change `"version": "0.1.4"` → `"version": "0.1.5"`.

- [ ] **Step 3: Verify plugin JSON is valid**

Run: `python3 -m json.tool ../daily-work-harness/.claude-plugin/plugin.json > /dev/null && echo VALID`
Expected: `VALID`.

Run: `grep -c '"version": "0.1.5"' ../daily-work-harness/.claude-plugin/plugin.json`
Expected: `1`.

- [ ] **Step 4: DoD verification (phase spec §6)**

(1) Artifacts exist:

Run: `ls ../daily-work-harness/nightly-routine-prompt.md ../daily-work-harness/autonomous-workflow.md`
Expected: both paths listed, no error.

(2) Mutually consistent — the contract is defined once, and the producer restates the same tokens:

Run: `grep -l '| Label | Meaning |' ../daily-work-harness/autonomous-workflow.md ../daily-work-harness/skills/*/SKILL.md ../daily-work-harness/nightly-routine-prompt.md`
Expected: only `autonomous-workflow.md` (the vocabulary table exists nowhere else — the prompt restates tokens, not the table).

Run: `for t in autonomous-ready blocked:setup review-ready needs-input needs-attention; do a=$(grep -c "$t" ../daily-work-harness/autonomous-workflow.md); p=$(grep -c "$t" ../daily-work-harness/nightly-routine-prompt.md); [ "$a" -ge 1 ] && [ "$p" -ge 1 ] && echo "$t ok" || echo "$t MISMATCH (doc=$a prompt=$p)"; done`
Expected: every token `ok` (present in both the authoring doc and the derived prompt).

(3) Project-agnostic across everything touched:

Run: `grep -rniE 'a2ui|primer|yarn|uv sync' ../daily-work-harness/autonomous-workflow.md ../daily-work-harness/nightly-routine-prompt.md ../daily-work-harness/skills/delegate-task/SKILL.md ../daily-work-harness/README.md || echo CLEAN`
Expected: `CLEAN`.

- [ ] **Step 5: Commit**

```bash
git -C /Users/jiohin/Desktop/future-of-sw/daily-work-harness add README.md .claude-plugin/plugin.json
git -C /Users/jiohin/Desktop/future-of-sw/daily-work-harness commit -m "docs(phase-5): list nightly-routine-prompt in README; bump to 0.1.5"
```

- [ ] **Step 6: Reload the plugin (manual)**

Reload the plugin cache (restart the session or re-run `/plugin` install) so `0.1.5` is picked up, and confirm the re-scoped `delegate-task` read works. This is manual — note it in the wrap-up if the cache hasn't refreshed yet. Standing up a live `/schedule` routine is per-project operator setup (Produce → Routine setup), not a graded step.

---

## Self-Review

**Spec coverage** — every spec decision maps to a task:

- §1 self-contained prompt, no plugin at runtime → Task 3 (create) + Task 3 Step 2 (self-containment grep).
- §2 orchestrator + verbatim per-issue block → Task 3 (both sections).
- §3 drain the queue, subagent-per-issue → Task 3 Orchestrator steps 1–2 + Task 2 Produce intro.
- §4 durable per-task-PR checkpoint / resumable → Task 3 Orchestrator step 3 + Task 2 Produce intro.
- §5 no harness skills; note on skill access → Task 3 preamble + step 4.
- §6 precondition check in the subagent → Task 3 per-issue step 2.
- §7 gates light / project-discovered; run-fail vs can't-run split → Task 3 per-issue steps 4–5.
- §8 terminal-outcome taxonomy → Task 2 (Outcomes table) + Task 3 (steps 2, 5, 7).
- §9 `blocked:setup` label + generic comment → Task 1 (Labels/States) + Task 2 (comment format) + Task 3 (step 2).
- §10 `needs-input` bar + structured writeup → Task 3 (step 4 escalation + step 6 "Decision needed").
- §11 `_dev/` writes: plan doc on branch only → Task 3 (step 4).
- §12 PR shape (title, `## Related issue` + `Closes #<N>`, conditional body) → Task 2 (PR shape) + Task 3 (step 6).
- §13 orchestrator end-of-run tally → Task 3 Orchestrator step 4.
- §14 doc grows Produce + `blocked:setup` in Labels + Routine setup checklist → Task 1 + Task 2.
- §15 contract-first restructure + re-scoped `delegate-task` read via command → Task 1 + Task 4.
- Invariants (agnostic; authoring-source vs derived copy consistency) → Task 5 DoD greps (2)+(3).

No gaps.

**Placeholder scan:** none — every artifact's full content or exact edit string is given. The `<…>` angle-bracket slots inside the prompt/PR-body/comment templates are intentional fill-at-runtime fields authored by the routine, not plan placeholders.

**Naming consistency:** label tokens (`autonomous-ready`, `kind:spec`, `kind:standalone`, `blocked-by:#<N>`, `blocked:setup`, `review-ready`, `needs-input`, `needs-attention`), the section headings (`## Contract`, `## Produce`, `### Outcomes`, `### PR shape`, `### Routine setup`, `## Orchestrator`, `## Per-issue production procedure`), the `## Related issue` + `Closes #<N>` PR anchor, and the `nightly-routine-prompt.md` filename are identical across Tasks 1–5.
```

