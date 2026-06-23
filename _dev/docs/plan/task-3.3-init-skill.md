# Task 3.3 — Init skill Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.
>
> **Note (nightly autonomous run):** this plan is authored and executed in a single
> autonomous session. The work is cohesive authoring (one node script + markdown skill
> content + vendored skill copies); it is executed inline with care rather than via fresh
> per-task subagents. "Green" is proven in 3.4, not here — this task is authoring only.

**Goal:** Author the init machinery that materializes a real instance from `adapter-template/`: a standalone non-interactive fill script, the template's permanent vendored `.claude/skills/` set, and the self-deleting init skill that drives the five-phase materialization.

**Architecture:** A standalone node fill script at the template root does the mechanical part (values file → content/path substitution → dir rename → no-token assertion), excluding the init machinery from its own scan so the smoke test (3.4) can assert "zero tokens remain" *and* "init files still present". The init skill (`.claude/skills/init/`) drives the five-phase flow (collect tokens → demo interview → fill + author SPEC §3 → install harness → guarded self-delete) and is the future-CLI seam. The 7 superpowers skills + an edited `a2ui-sdk-design` are vendored as real directories so the cloud nightly routine (skills-only, no plugins) is self-contained.

**Tech Stack:** Node (ESM `.mjs`, node ≥ 22, no deps), Claude Code skills (markdown + frontmatter), Claude Code plugin marketplace settings.

## Global Constraints

- The fill script is **non-interactive** — values in, filled tree out; it never prompts (task 3.3 invariant; phase-3 decision 7).
- **Token set is exactly 8, collected up front, no scan/discovery step:** `adapterPkg`, `agentPkg`, `Library`, `libraryPkg`, `version`, `repoSlug`, `Domain`, `mcp` (task 3.3 decisions 2, 3).
- **Input contract is a values file (JSON), not flags;** it is a transient init input removed on self-delete (decision 4).
- **The fill script lives at the template root** (`adapter-template/fill.mjs`), is added to the eslint `ignores`, and self-delete removes both it and the init skill directory (decision 5).
- **Self-delete exists only in the init skill's terminal step;** the 3.4 smoke test invokes the script directly, never the skill, so self-delete is never triggered and init files survive (decisions 8).
- **`a2ui-sdk-design` is vendored and edited** — Specifications Navigation rewritten to the `{{version}}`-parameterized pinned-ref fetch from `a2ui-project/a2ui`; the `a2ui-github` self-reference and Primer examples genericized to placeholders (decision 9).
- **The superpowers set is vendored as real, de-referenced directories**, not installed; the `superpowers:` refs form a closed set within the vendored skills (decision 10). All vendored skills are permanent — never self-deleted (decision 11).
- The template ships a **self-contained skill set** — no hard reference to a skill outside the vendored set, no reliance on an installed plugin for the vendored skills (invariant).
- Step 4 installs **only** the harness plugin, opt-in default-yes (marketplace `retz8-harness` → `retz8/daily-work-harness`, plugin `daily-work-harness@retz8-harness`).
- Authoring only — the Claude-only steps (demo interview, §3 authoring, harness install) are authored with concrete commands but their live end-to-end run is deferred to post-Phase-7; "green" is proven in 3.4.

---

## File Structure

- `adapter-template/fill.mjs` — **new.** The standalone mechanical-fill script.
- `adapter-template/eslint.config.mjs` — **modify.** Add `fill.mjs` to `ignores`.
- `eslint.config.mjs` (reference root) — **modify.** Add `adapter-template/fill.mjs` to `ignores` so the reference's `eslint .` stays green with the new node script in-tree.
- `adapter-template/.claude/skills/` — **new dir.** Vendored skill set:
  - `a2ui-sdk-design/SKILL.md` — copied from reference, then **edited** (Specifications Navigation + de-branding).
  - `executing-plans/`, `finishing-a-development-branch/`, `requesting-code-review/`, `subagent-driven-development/`, `test-driven-development/`, `using-git-worktrees/`, `writing-plans/` — copied verbatim from `.claude/skills/` (real directories, executable scripts preserved).
  - `init/SKILL.md` — **new.** The init skill.
- `adapter-template/README.md` — **modify.** Add a "First: materialize this template" pointer to the init skill, ahead of the existing yarn instructions.

## Token reference (for the init skill's collection table)

| Token | Referent | Example (reference instance) |
|---|---|---|
| `adapterPkg` | publishable adapter npm package name **and** its directory name | `primer-a2ui-adapter` |
| `agentPkg` | Python agent project name (`pyproject.toml [project].name`) | `github-a2a-agent` |
| `Library` | design-system display name (prose) | `Primer` |
| `libraryPkg` | design-system npm package | `@primer/react` |
| `version` | A2UI spec/catalog version dir token (`vX.Y.Z`) | `v0.9.1` |
| `repoSlug` | GitHub `owner/repo` for the hosted `catalog.json` URL | `retz8/a2ui-github` |
| `Domain` | domain phrase (prose only) | `GitHub maintainer triage` |
| `mcp` | MCP server (prose only) | `GitHub MCP` |

---

### Task 1: Fill script + eslint ignores

**Files:**
- Create: `adapter-template/fill.mjs`
- Modify: `adapter-template/eslint.config.mjs` (add `fill.mjs` to ignores)
- Modify: `eslint.config.mjs` (reference root; add `adapter-template/fill.mjs` to ignores)

**Interfaces:**
- Consumes: a values JSON at `adapter-template/init.values.json` (or path argv[2]) with the 8 bare-named keys → string values.
- Produces: the filled tree (contents + renamed paths); exit 0 on success, exit 1 on missing/empty value or on any residual `{{...}}` token in the scanned set. The init skill and the 3.4 smoke test both invoke it as `node fill.mjs [values.json]`.

**Design notes (the resolved token-vs-assertion contract):**
- The script **excludes init machinery from its scan, fill, rename, and assertion**: `fill.mjs` itself, the values file, and `.claude/skills/init/`. Consequently those files may contain literal `{{token}}` documentation freely, and the post-fill assertion's "zero tokens" guarantee holds over the *filled* set (everything else). The 3.4 smoke test relies on this: the script exits 0 (no tokens in the filled set) while the init files remain present on disk.
- Also excludes VCS/build dirs: `.git`, `node_modules`, `.venv`, `dist`, `.yarn`.
- Content fill happens before renames; renames are applied deepest-first so a parent-dir rename never invalidates a child path.

- [ ] **Step 1: Write `adapter-template/fill.mjs`**

```js
#!/usr/bin/env node
// Mechanical placeholder-fill for the a2ui-app template.
//
// Non-interactive: reads a values JSON, substitutes the 8 known tokens across
// file contents and file/directory names, renames token-named paths, then
// asserts no {{...}} tokens remain. Values in, filled tree out — never prompts.
//
//   node fill.mjs [values.json]      (default values file: ./init.values.json)
//
// This script, the values file, and the init skill (.claude/skills/init) are
// INIT MACHINERY, not template content: they are excluded from the scan, fill,
// rename, and assertion below, and are removed by the init skill's guarded
// self-delete — never by this script. That exclusion is what lets the 3.4 smoke
// test assert both "zero {{...}} tokens remain" and "init files still present".

import {readFileSync, writeFileSync, readdirSync, statSync, renameSync} from 'node:fs';
import {join, relative, basename, dirname, sep} from 'node:path';
import {fileURLToPath} from 'node:url';

const TOKENS = [
  'adapterPkg',
  'agentPkg',
  'Library',
  'libraryPkg',
  'version',
  'repoSlug',
  'Domain',
  'mcp',
];

const ROOT = dirname(fileURLToPath(import.meta.url));
const SELF = basename(fileURLToPath(import.meta.url));
const valuesPath = process.argv[2]
  ? (process.argv[2].startsWith('/') ? process.argv[2] : join(process.cwd(), process.argv[2]))
  : join(ROOT, 'init.values.json');

// --- load + validate the values file -----------------------------------------
let values;
try {
  values = JSON.parse(readFileSync(valuesPath, 'utf8'));
} catch (err) {
  console.error(`fill: cannot read values file at ${valuesPath}: ${err.message}`);
  process.exit(1);
}
const missing = TOKENS.filter(
  (t) => typeof values[t] !== 'string' || values[t].trim() === '',
);
if (missing.length > 0) {
  console.error(`fill: values file is missing non-empty values for: ${missing.join(', ')}`);
  process.exit(1);
}

// --- exclusions (relative to ROOT, POSIX-style) ------------------------------
const EXCLUDED_NAMES = new Set(['.git', 'node_modules', '.venv', 'dist', '.yarn']);
const EXCLUDED_RELPATHS = new Set(['.claude/skills/init']);
const EXCLUDED_FILES = new Set([SELF, basename(valuesPath)]);

const rel = (abs) => relative(ROOT, abs).split(sep).join('/');

function isExcludedDir(abs) {
  return EXCLUDED_NAMES.has(basename(abs)) || EXCLUDED_RELPATHS.has(rel(abs));
}
function isExcludedFile(abs) {
  return EXCLUDED_FILES.has(basename(abs)) || EXCLUDED_RELPATHS.has(rel(abs));
}

// --- token substitution ------------------------------------------------------
const TOKEN_RE = /\{\{[^}]+\}\}/;
function substitute(str) {
  let out = str;
  for (const t of TOKENS) out = out.split('{{' + t + '}}').join(values[t]);
  return out;
}

// --- walk --------------------------------------------------------------------
function walkFiles(dir, acc) {
  for (const name of readdirSync(dir)) {
    const abs = join(dir, name);
    const st = statSync(abs);
    if (st.isDirectory()) {
      if (isExcludedDir(abs)) continue;
      walkFiles(abs, acc);
    } else if (st.isFile()) {
      if (isExcludedFile(abs)) continue;
      acc.push(abs);
    }
  }
  return acc;
}
function walkAllPaths(dir, acc) {
  for (const name of readdirSync(dir)) {
    const abs = join(dir, name);
    const st = statSync(abs);
    if (st.isDirectory()) {
      if (isExcludedDir(abs)) continue;
      acc.push(abs);
      walkAllPaths(abs, acc);
    } else if (st.isFile()) {
      if (isExcludedFile(abs)) continue;
      acc.push(abs);
    }
  }
  return acc;
}

// 1) fill file CONTENTS
let filledFiles = 0;
for (const file of walkFiles(ROOT, [])) {
  const before = readFileSync(file, 'utf8');
  if (before.includes('\0')) continue; // skip binary
  const after = substitute(before);
  if (after !== before) {
    writeFileSync(file, after);
    filledFiles += 1;
  }
}

// 2) rename token-named PATHS, deepest-first
const paths = walkAllPaths(ROOT, []).sort(
  (a, b) => rel(b).split('/').length - rel(a).split('/').length,
);
let renamed = 0;
for (const abs of paths) {
  const name = basename(abs);
  const next = substitute(name);
  if (next !== name) {
    renameSync(abs, join(dirname(abs), next));
    renamed += 1;
  }
}

// 3) assert no tokens remain in the filled set (contents + names)
const offenders = [];
for (const abs of walkAllPaths(ROOT, [])) {
  if (TOKEN_RE.test(basename(abs))) offenders.push(`${rel(abs)} (name)`);
  if (statSync(abs).isFile()) {
    const body = readFileSync(abs, 'utf8');
    if (!body.includes('\0') && TOKEN_RE.test(body)) offenders.push(`${rel(abs)} (content)`);
  }
}
if (offenders.length > 0) {
  console.error('fill: residual {{...}} tokens found in:');
  for (const o of offenders) console.error(`  - ${o}`);
  process.exit(1);
}

console.log(`fill: done — ${filledFiles} file(s) filled, ${renamed} path(s) renamed, 0 tokens left.`);
```

- [ ] **Step 2: Add `fill.mjs` to the template eslint ignores**

In `adapter-template/eslint.config.mjs`, change the ignores line:

```js
    ignores: ['**/dist/**', '**/node_modules/**', '.yarn/**', '**/*.d.ts', 'fill.mjs'],
```

- [ ] **Step 3: Add the script to the reference root eslint ignores**

In `eslint.config.mjs` (repo root), change the ignores line:

```js
    ignores: ['**/dist/**', '**/node_modules/**', '.yarn/**', '**/*.d.ts', 'adapter-template/fill.mjs'],
```

- [ ] **Step 4: Smoke-check the script locally (non-gating sanity)**

Run a throwaway materialization in the scratchpad against the reference values to confirm the script fills + renames + asserts cleanly (does **not** replace 3.4's smoke test):

```bash
T=$(mktemp -d) && cp -r adapter-template "$T/inst"
cat > "$T/inst/init.values.json" <<'JSON'
{ "adapterPkg": "primer-a2ui-adapter", "agentPkg": "github-a2a-agent",
  "Library": "Primer", "libraryPkg": "@primer/react", "version": "v0.9.1",
  "repoSlug": "retz8/a2ui-github", "Domain": "GitHub maintainer triage", "mcp": "GitHub MCP" }
JSON
node "$T/inst/fill.mjs"        # expect: "fill: done — N file(s) filled, M path(s) renamed, 0 tokens left."
# expect: fill.mjs + .claude/skills/init still present; {{adapterPkg}} dir renamed to primer-a2ui-adapter
rm -rf "$T"
```

- [ ] **Step 5: Commit**

```bash
git add adapter-template/fill.mjs adapter-template/eslint.config.mjs eslint.config.mjs
git commit -m "feat(phase-3): add template fill script + eslint ignores (task 3.3)"
```

---

### Task 2: Vendor the permanent skill set

**Files:**
- Create: `adapter-template/.claude/skills/{a2ui-sdk-design,executing-plans,finishing-a-development-branch,requesting-code-review,subagent-driven-development,test-driven-development,using-git-worktrees,writing-plans}/...` (copied from `.claude/skills/`)
- Modify: `adapter-template/.claude/skills/a2ui-sdk-design/SKILL.md` (edit per decision 9)

**Interfaces:**
- Consumes: the reference `.claude/skills/` (already real directories, no symlinks, executable scripts under `subagent-driven-development/scripts/`).
- Produces: the template's self-contained skill set; `a2ui-sdk-design` parameterized by `{{version}}`/`{{Library}}` so the fill script substitutes it at init.

- [ ] **Step 1: Copy the 8 reference skills into the template (preserve executable bits)**

```bash
mkdir -p adapter-template/.claude/skills
for s in a2ui-sdk-design executing-plans finishing-a-development-branch \
         requesting-code-review subagent-driven-development \
         test-driven-development using-git-worktrees writing-plans; do
  cp -r ".claude/skills/$s" "adapter-template/.claude/skills/$s"
done
# sanity: scripts stay executable
ls -l adapter-template/.claude/skills/subagent-driven-development/scripts/
```

- [ ] **Step 2: Edit `adapter-template/.claude/skills/a2ui-sdk-design/SKILL.md`**

Replace the "Specifications Navigation" intro + bullet list (the `../A2UI` sibling-fork / `sync spec` hook / `upstream/main` machinery) with the pinned-ref fetch parameterized by `{{version}}`, mirroring `adapter-template/CLAUDE.md` §2. Genericize the Primer/`a2ui-github` references. Concretely:

- Intro paragraph → no `a2ui-github`, no `../A2UI`, no `upstream/main`:

  > This project is a downstream consumer of the A2UI protocol; it does not vendor the spec. The authoritative specification is published by `a2ui-project/a2ui` and is read at the pinned protocol version `{{version}}` (authority per `CLAUDE.md` §2).

- Replace the "Refresh first / List a tree / Read a file / Search" bullets and the "Authority Rule" with the throwaway shallow-clone recipe (derive the spec dir from `{{version}}` by replacing dots with underscores), matching CLAUDE.md §2:

  ```bash
  tmp=$(mktemp -d) && git clone --depth 1 https://github.com/a2ui-project/a2ui "$tmp"
  # derive the spec dir from {{version}} (e.g. v0.9.1 -> specification/v0_9_1/)
  git -C "$tmp" ls-tree -r --name-only HEAD specification/<v_underscored>/
  git -C "$tmp" show HEAD:specification/<v_underscored>/json/server_to_client.json
  git -C "$tmp" grep <pattern> HEAD -- specification/<v_underscored>/
  rm -rf "$tmp"
  ```
  > For a reproducible read, pin a recorded commit SHA in place of `HEAD`/`--depth 1`. **Authority Rule:** default to `{{version}}` unless the user specifies otherwise.

- "Critical Sources of Truth" item 2 "Use the standard catalog … when authoring the Primer/React catalog in this project" → "… when authoring the `{{Library}}`/React catalog in this project."
- "Critical Sources of Truth" item 4 "the thin React renderer in this project" → keep (already generic).
- De-branding example in "Descriptions target the agent": `"Primer font size."` → `"{{Library}} font size."`; `"Primer Text."` → `"{{Library}} Text."` (keep the teaching point intact).
- "The basic catalog is the reference for the split" paragraph → leave as-is (generic A2UI basic catalog).

- [ ] **Step 3: Verify no stray brand/self refs and the closed `superpowers:` set**

```bash
grep -rniE "a2ui-github|\.\./A2UI|upstream/main|sync spec" adapter-template/.claude/skills/a2ui-sdk-design/   # expect: none
grep -rni "primer" adapter-template/.claude/skills/a2ui-sdk-design/                                            # expect: none
grep -rho "superpowers:[a-z-]*" adapter-template/.claude/skills/ | sort -u                                     # expect: only vendored names
```
The expected `superpowers:` set is a subset of: `using-git-worktrees`, `writing-plans`, `subagent-driven-development`, `executing-plans`, `finishing-a-development-branch`, `requesting-code-review`, `test-driven-development`. (The one soft dangling pointer `../using-superpowers/references/` in `executing-plans` is accepted as-is per task 3.3 open items.)

- [ ] **Step 4: Commit**

```bash
git add adapter-template/.claude/skills
git commit -m "feat(phase-3): vendor permanent skill set into template (task 3.3)"
```

---

### Task 3: The init skill + README pointer

**Files:**
- Create: `adapter-template/.claude/skills/init/SKILL.md`
- Modify: `adapter-template/README.md` (materialize pointer)

**Interfaces:**
- Consumes: `adapter-template/fill.mjs` (Task 1) via `node fill.mjs init.values.json`; the harness marketplace coordinates (`retz8-harness` → `retz8/daily-work-harness`, plugin `daily-work-harness@retz8-harness`).
- Produces: a one-shot, self-deleting skill driving the five-phase materialization. Authored complete; live end-to-end run deferred.

- [ ] **Step 1: Write `adapter-template/.claude/skills/init/SKILL.md`**

Frontmatter:
```markdown
---
name: init
description: Use ONCE on a fresh a2ui-app template clone to materialize a real instance — collect the 8 tokens, interview for the demo, fill placeholders, author SPEC §3, install the daily-work harness (opt-in), then self-delete.
---
```

Body — author the five phases in order, each with concrete commands. Key content:

1. **Collect all 8 tokens → `init.values.json`.** Present the token table (above) and interview the adopter for each value. Then write the values file at the template root with **bare** keys (no braces):
   ```bash
   cat > init.values.json <<'JSON'
   { "adapterPkg": "...", "agentPkg": "...", "Library": "...", "libraryPkg": "...",
     "version": "...", "repoSlug": "...", "Domain": "...", "mcp": "..." }
   JSON
   ```
   Note this step is the **future-CLI seam** — a CLI replaces exactly this step with flags writing the same file.

2. **Demo-arc interview → SPEC §3 narrative.** Interview for: the anchor flow, persona framing, action scope (read-only vs. compose-and-confirm vs. write), the prompt-arc beats (broad → narrow → drill → act), and detail-view depth. Hold the result for step 3 (do not write yet — §3 is authored *after* the fill so the surrounding tokens are already resolved).

3. **Run the fill + author SPEC §3 prose.**
   ```bash
   node fill.mjs init.values.json   # expect "0 tokens left."
   ```
   Then replace the `SPEC.md` §3 "Authoring stub — replaced at init" block with the demo narrative from step 2, specializing the domain-flavored examples by hand (per the templatization plan's care-spots: §1 "diff view", §2 `openPR(...)`, §8 "diff viewer" are domain examples specialized while authoring §3; the §6 github.com host and the §4 `sx` term are **not** tokens — leave them).

4. **Install the daily-work harness (opt-in, default-yes).** Ask the adopter (default yes). If yes, register the marketplace and enable the plugin by writing the instance's `.claude/settings.json`:
   ```json
   {
     "extraKnownMarketplaces": {
       "retz8-harness": { "source": { "source": "github", "repo": "retz8/daily-work-harness" } }
     },
     "enabledPlugins": { "daily-work-harness@retz8-harness": true }
   }
   ```
   (Equivalent interactive form: `/plugin marketplace add retz8/daily-work-harness` then `/plugin install daily-work-harness@retz8-harness`.) If the adopter declines, leave `.claude/settings.json` as `{}` — no `retz8-harness` reference reaches them.

5. **Guarded self-delete.** Only after steps 1–3 succeeded (fill reported "0 tokens left." and §3 was authored), remove the init machinery:
   ```bash
   rm -f fill.mjs init.values.json
   rm -rf .claude/skills/init
   ```
   Guard: do **not** self-delete if the fill script errored or §3 still contains the authoring stub. The vendored skills (`a2ui-sdk-design` + the 7 superpowers skills) are permanent — never delete them.

The skill must state up front: it is **one-shot** (run on a fresh clone), and the mechanical part (steps 1+3-fill) is cleanly separable from the Claude-judgment steps (2, 3-authoring, 4) for the future CLI.

- [ ] **Step 2: Add the materialize pointer to `adapter-template/README.md`**

Insert, immediately after the intro blockquote (`> 🚧 In active development…`) and before `## Getting started`:

```markdown
## First: materialize this template

This repo is an **unfilled template** — it carries `{{...}}` placeholders and an `init` skill that
turns it into a real A2UI app. On a fresh clone, run the **`init` skill** (it collects 8 values,
interviews you for the demo, fills every placeholder via `fill.mjs`, optionally installs the
daily-work harness, then self-deletes). Do this **before** the build steps below.
```

- [ ] **Step 3: Verify the init skill references resolve**

```bash
test -f adapter-template/fill.mjs && echo "fill.mjs present"
grep -q "daily-work-harness@retz8-harness" adapter-template/.claude/skills/init/SKILL.md && echo "harness ref ok"
grep -q "node fill.mjs" adapter-template/.claude/skills/init/SKILL.md && echo "fill invocation ok"
```

- [ ] **Step 4: Commit**

```bash
git add adapter-template/.claude/skills/init/SKILL.md adapter-template/README.md
git commit -m "feat(phase-3): author init skill + README materialize pointer (task 3.3)"
```

---

## Verify before opening (gates)

Per `README.md`, the repo gates are `yarn build:all` / `yarn typecheck:all` / `yarn lint:all` / `yarn test:all` (and `agent/` `uv sync` + `pytest` if agent code changed — it is not here). This task touches no workspace source (only `adapter-template/` + the reference root eslint ignore), so the relevant gate is **`yarn lint:all`** staying green with the new `adapter-template/fill.mjs` (now ignored) and the vendored skills (md/scripts, not linted). Run the full `yarn verify:all` to confirm nothing regressed. The materialization-and-build green is 3.4's job, not this task's.

## Self-Review

1. **Spec coverage** — fill script (decisions 1-5) → Task 1; vendored `a2ui-sdk-design` edit (9) + superpowers set (10, 11) → Task 2; five-phase init incl. guarded self-delete (6, 8) + harness install (step 4) + future-CLI seam (7) → Task 3. Token set of 8 (3) → values table + script `TOKENS`. Values-file contract (4) → Task 1 interface + Task 3 step 1. eslint ignore (5) → Task 1 steps 2-3.
2. **Placeholder scan** — every step carries real code/commands; no TBD/TODO.
3. **Type/name consistency** — `init.values.json` bare-key shape is identical in the script loader, Task 3 step 1, and the smoke-check; the 8 `TOKENS` match the table; the harness coordinates match `.claude/settings.json` in the reference.
