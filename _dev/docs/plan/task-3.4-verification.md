# Task 3.4 — Verification (materialization smoke test + agnosticism) Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Prove the `adapter-template/` baseline materializes into a green, token-free instance, and that the template carries no accidental Primer/GitHub shaping — the one place Phase 3 proves "green."

**Architecture:** A single ugly orchestrator script, `adapter-template/smoke-test.mjs`, copies the template into an OS temp dir, fills it with the reference instance's own values via the template's own `fill.mjs`, then runs the full JS/TS + Python verify against the copy and asserts zero residual tokens / init files still present. A final stage greps the *original* template's build surface for library/domain identifiers. The real `adapter-template/` is never mutated. The script lives inside `adapter-template/` (travels with the template at the post-Phase-7 extraction), is run manually (`node adapter-template/smoke-test.mjs`), and is wired into nothing.

**Tech Stack:** Node 22 ESM, `node:fs`/`node:child_process`/`node:os`; Yarn 4.13.0 (node-modules linker, via corepack); `uv` for the Python agent; ESLint flat config.

## Global Constraints

- The smoke test lives at `adapter-template/smoke-test.mjs` — inside the template, beside `fill.mjs`. **Not** at the reference repo root, **not** under `_dev/`, **not** a vitest unit test.
- Run manually as `node adapter-template/smoke-test.mjs`. **Do not** add a root `package.json` script and **do not** wire it into `build:all`/`test:all`/`verify:all`.
- The script operates only on a **throwaway copy** in `os.tmpdir()`. The real `adapter-template/` is read-only to it.
- Reference fill values (verbatim — the reference instance's own values):
  ```json
  {
    "adapterPkg": "primer-a2ui-adapter",
    "agentPkg": "a2ui-github-agent",
    "Library": "Primer",
    "libraryPkg": "@primer/react",
    "version": "v0.9.1",
    "repoSlug": "retz8/a2ui-github",
    "Domain": "GitHub maintainer triage",
    "mcp": "GitHub MCP"
  }
  ```
- Definition of done (spec decision #9): (a) materialize → `build:all`/`typecheck:all`/`lint:all`/`test:all` + agent `uv sync`/`uv run pytest` all green, **zero `{{...}}` tokens** remain, **init files still present** (`fill.mjs` + `.claude/skills/init/SKILL.md`); (b) agnosticism grep over the template's code+config → no library/domain identifiers outside the one allowlisted `catalog-id.ts` host comment.
- `fill.mjs` already excludes the init machinery (`fill.mjs`, `init.values.json`, `.claude/skills/init`) from its fill+assert — that is what lets the smoke test assert both "0 tokens left" and "init files present" at once. Do not change `fill.mjs`.
- Work directly on `main` (no worktree). Conventional commits: `<type>(phase-3): …`.

---

### Task 1: ESLint `.venv` ignore carry-in (+ smoke-script ignore)

Carried in from 3.1: `eslint .` must survive the agent's `.venv` (created by `uv sync`) in both the reference repo and any materialized instance. Also keep the reference `eslint .` green over the new `smoke-test.mjs` (it is plain Node orchestration, not linted source).

**Files:**
- Modify: `eslint.config.mjs:8` (reference repo root)
- Modify: `adapter-template/eslint.config.mjs:8` (template)

**Interfaces:**
- Consumes: nothing.
- Produces: both flat configs ignore `**/.venv/**`; the reference config additionally ignores `adapter-template/smoke-test.mjs`. (The template config does **not** need the smoke-script ignore — the script is never copied into a materialized instance; see Task 2's copy filter.)

- [ ] **Step 1: Write the failing check** — create a dummy venv file that would trip lint in the reference repo.

```bash
mkdir -p agent/.venv/lib
printf 'var x = 1\n' > agent/.venv/lib/dummy.js
```

- [ ] **Step 2: Run lint to verify it fails**

Run: `yarn lint:all`
Expected: FAIL — eslint reports errors in `agent/.venv/lib/dummy.js` (e.g. `no-var` / `no-unused-vars`).

- [ ] **Step 3: Add the ignores**

Reference `eslint.config.mjs` — change line 8 from:

```js
    ignores: ['**/dist/**', '**/node_modules/**', '.yarn/**', '**/*.d.ts', 'adapter-template/fill.mjs'],
```

to:

```js
    ignores: ['**/dist/**', '**/node_modules/**', '**/.venv/**', '.yarn/**', '**/*.d.ts', 'adapter-template/fill.mjs', 'adapter-template/smoke-test.mjs'],
```

Template `adapter-template/eslint.config.mjs` — change line 8 from:

```js
    ignores: ['**/dist/**', '**/node_modules/**', '.yarn/**', '**/*.d.ts', 'fill.mjs'],
```

to:

```js
    ignores: ['**/dist/**', '**/node_modules/**', '**/.venv/**', '.yarn/**', '**/*.d.ts', 'fill.mjs'],
```

- [ ] **Step 4: Run lint to verify it passes**

Run: `yarn lint:all`
Expected: PASS — the dummy venv file is now ignored (0 errors).

- [ ] **Step 5: Remove the dummy and confirm still green**

```bash
rm -rf agent/.venv/lib/dummy.js
yarn lint:all
```
Expected: PASS.

- [ ] **Step 6: Commit**

```bash
git add eslint.config.mjs adapter-template/eslint.config.mjs
git commit -m "fix(phase-3): ignore **/.venv/** and smoke-test.mjs in eslint (task 3.4)"
```

---

### Task 2: `smoke-test.mjs` — copy the template to a temp instance

First slice of the orchestrator: copy `adapter-template/` to an OS temp dir, excluding build artifacts and the verification machinery, while **keeping** the init machinery (`fill.mjs`, `.claude/skills/init/`). The copy must look exactly like a fresh template clone minus the smoke test itself.

**Files:**
- Create: `adapter-template/smoke-test.mjs`

**Interfaces:**
- Consumes: nothing.
- Produces: `copyTemplate(): string` returns the absolute temp-instance path. Module-level `SRC` (the template dir = the script's own dir) and `SELF` (this script's basename) are reused by later tasks. `main()` is the entry point that later tasks extend.

- [ ] **Step 1: Write the script's copy stage**

Create `adapter-template/smoke-test.mjs`:

```js
#!/usr/bin/env node
// Materialization smoke test for the a2ui-app template (Phase 3 task 3.4).
//
// Copies adapter-template/ to an OS temp dir, fills it with the reference
// instance's own values via the template's own fill.mjs, runs the full
// JS/TS + Python verify against the copy, and asserts zero residual {{...}}
// tokens with the init machinery still present. A final stage greps the
// ORIGINAL template's build surface for accidental library/domain identifiers.
//
// Run manually:  node adapter-template/smoke-test.mjs
// Never mutates the real adapter-template/. Wired into nothing.

import {cpSync, mkdtempSync, existsSync, rmSync} from 'node:fs';
import {tmpdir} from 'node:os';
import {join, basename, dirname} from 'node:path';
import {fileURLToPath} from 'node:url';

const SRC = dirname(fileURLToPath(import.meta.url)); // adapter-template/
const SELF = basename(fileURLToPath(import.meta.url)); // smoke-test.mjs

// Build artifacts / VCS / package caches — never copied.
const COPY_EXCLUDE_NAMES = new Set(['node_modules', '.venv', 'dist', '.git', '.yarn']);

// Copy everything except artifacts and the verification machinery (this script
// + any *.values.json). The init machinery (fill.mjs, .claude/skills/init) IS
// copied — a fresh clone has it, and the smoke test asserts it survives fill.
function copyTemplate() {
  const dest = mkdtempSync(join(tmpdir(), 'a2ui-smoke-'));
  cpSync(SRC, dest, {
    recursive: true,
    filter: (s) => {
      const name = basename(s);
      if (COPY_EXCLUDE_NAMES.has(name)) return false;
      if (name === SELF) return false;
      if (name.endsWith('.values.json')) return false;
      return true;
    },
  });
  return dest;
}

async function main() {
  const dir = copyTemplate();
  console.log(`smoke: copied template → ${dir}`);
  // Sanity: init machinery copied, verification machinery not.
  if (!existsSync(join(dir, 'fill.mjs'))) throw new Error('copy missing fill.mjs');
  if (!existsSync(join(dir, '.claude/skills/init/SKILL.md'))) throw new Error('copy missing init skill');
  if (existsSync(join(dir, SELF))) throw new Error('smoke-test.mjs should not be copied');
  console.log('smoke: copy stage OK');
  rmSync(dir, {recursive: true, force: true});
}

main().catch((err) => {
  console.error(`smoke: FAILED — ${err.message}`);
  process.exit(1);
});
```

- [ ] **Step 2: Run the copy stage**

Run: `node adapter-template/smoke-test.mjs`
Expected: prints `smoke: copied template → /var/folders/.../a2ui-smoke-XXXXXX`, then `smoke: copy stage OK`, exit 0. (The temp dir is removed at the end of this stage; later tasks move cleanup to the end of the full run.)

- [ ] **Step 3: Commit**

```bash
git add adapter-template/smoke-test.mjs
git commit -m "test(phase-3): smoke-test.mjs copy stage (task 3.4)"
```

---

### Task 3: Fill the temp instance with reference values

Write the reference values into the copy and run the template's own `fill.mjs` against it. The fill is the exact mechanical step a real init performs; the smoke test drives it non-interactively.

**Files:**
- Modify: `adapter-template/smoke-test.mjs`

**Interfaces:**
- Consumes: `copyTemplate()` from Task 2.
- Produces: module-level `REF_VALUES` object; `runFill(dir: string): void` — writes `init.values.json` into `dir`, runs `node fill.mjs init.values.json` there, throws unless stdout contains `0 tokens left`.

- [ ] **Step 1: Add the fill stage**

Add to the imports at the top of `adapter-template/smoke-test.mjs`:

```js
import {writeFileSync} from 'node:fs';
import {execSync} from 'node:child_process';
```

Add after the `copyTemplate` function:

```js
// The reference instance's own values — filling with these proves the template
// reproduces the post-Phase-2 shape.
const REF_VALUES = {
  adapterPkg: 'primer-a2ui-adapter',
  agentPkg: 'a2ui-github-agent',
  Library: 'Primer',
  libraryPkg: '@primer/react',
  version: 'v0.9.1',
  repoSlug: 'retz8/a2ui-github',
  Domain: 'GitHub maintainer triage',
  mcp: 'GitHub MCP',
};

function runFill(dir) {
  writeFileSync(join(dir, 'init.values.json'), JSON.stringify(REF_VALUES, null, 2));
  const out = execSync('node fill.mjs init.values.json', {cwd: dir, encoding: 'utf8'});
  if (!out.includes('0 tokens left')) {
    throw new Error(`fill did not report success:\n${out}`);
  }
  console.log(`smoke: ${out.trim()}`);
}
```

- [ ] **Step 2: Wire it into `main` (drop the early cleanup)**

Replace the body of `main()` with:

```js
async function main() {
  const dir = copyTemplate();
  console.log(`smoke: copied template → ${dir}`);
  if (!existsSync(join(dir, 'fill.mjs'))) throw new Error('copy missing fill.mjs');
  if (!existsSync(join(dir, '.claude/skills/init/SKILL.md'))) throw new Error('copy missing init skill');
  if (existsSync(join(dir, SELF))) throw new Error('smoke-test.mjs should not be copied');

  runFill(dir);
  // Sanity: the token-named adapter dir was renamed by fill.
  if (!existsSync(join(dir, 'primer-a2ui-adapter'))) {
    throw new Error('fill did not rename {{adapterPkg}} → primer-a2ui-adapter');
  }
  console.log('smoke: fill stage OK');

  rmSync(dir, {recursive: true, force: true});
}
```

- [ ] **Step 3: Run the fill stage**

Run: `node adapter-template/smoke-test.mjs`
Expected: prints `smoke: fill: done — N file(s) filled, M path(s) renamed, 0 tokens left.` then `smoke: fill stage OK`, exit 0.

- [ ] **Step 4: Commit**

```bash
git add adapter-template/smoke-test.mjs
git commit -m "test(phase-3): smoke-test.mjs fill stage (task 3.4)"
```

---

### Task 4: Assert zero residual tokens + init files present

The two structural assertions of DoD (a): no `{{...}}` left in the materialized tree (outside the init machinery `fill.mjs` deliberately leaves alone), and the init machinery still present (self-delete did not fire).

**Files:**
- Modify: `adapter-template/smoke-test.mjs`

**Interfaces:**
- Consumes: the filled `dir` from `runFill`.
- Produces: `assertMaterialized(dir: string): void` — throws on any residual token (contents or path name) outside the excluded init machinery, or any missing init file.

- [ ] **Step 1: Add the assertion stage**

Add to the imports:

```js
import {readFileSync, readdirSync, statSync} from 'node:fs';
import {relative, sep} from 'node:path';
```

Add after `runFill`:

```js
const TOKEN_RE = /\{\{[^}]+\}\}/;
// Mirror fill.mjs's exclusions: init machinery keeps its literal {{...}} docs.
const ASSERT_EXCLUDE_NAMES = new Set(['node_modules', '.venv', 'dist', '.git', '.yarn']);
const ASSERT_EXCLUDE_RELPATHS = new Set(['.claude/skills/init', 'fill.mjs', 'init.values.json']);

function walkAll(dir, root, acc) {
  for (const name of readdirSync(dir)) {
    const abs = join(dir, name);
    const relp = relative(root, abs).split(sep).join('/');
    if (ASSERT_EXCLUDE_NAMES.has(name) || ASSERT_EXCLUDE_RELPATHS.has(relp)) continue;
    const st = statSync(abs);
    acc.push({abs, relp, dir: st.isDirectory()});
    if (st.isDirectory()) walkAll(abs, root, acc);
  }
  return acc;
}

function assertMaterialized(dir) {
  const offenders = [];
  for (const {abs, relp, dir: isDir} of walkAll(dir, dir, [])) {
    if (TOKEN_RE.test(basename(abs))) offenders.push(`${relp} (name)`);
    if (!isDir) {
      const body = readFileSync(abs, 'utf8');
      if (!body.includes('\0') && TOKEN_RE.test(body)) offenders.push(`${relp} (content)`);
    }
  }
  if (offenders.length > 0) {
    throw new Error(`residual {{...}} tokens in materialized instance:\n  - ${offenders.join('\n  - ')}`);
  }
  // Init machinery must survive fill (self-delete is a separate adopter-only step).
  for (const f of ['fill.mjs', 'init.values.json', '.claude/skills/init/SKILL.md']) {
    if (!existsSync(join(dir, f))) throw new Error(`init machinery missing after fill: ${f}`);
  }
  console.log('smoke: assertions OK — 0 tokens left, init machinery present');
}
```

- [ ] **Step 2: Wire into `main`** — add the call after the rename sanity check, before `rmSync`:

```js
  assertMaterialized(dir);
```

- [ ] **Step 3: Run**

Run: `node adapter-template/smoke-test.mjs`
Expected: prints `smoke: assertions OK — 0 tokens left, init machinery present`, exit 0.

- [ ] **Step 4: Commit**

```bash
git add adapter-template/smoke-test.mjs
git commit -m "test(phase-3): smoke-test.mjs token + init-file assertions (task 3.4)"
```

---

### Task 5: Verify the materialized instance builds (JS/TS + Python)

The core of DoD (a): the filled instance compiles, typechecks, lints, and tests on both toolchains. This is the slow stage — it installs dependencies into the temp instance.

**Files:**
- Modify: `adapter-template/smoke-test.mjs`

**Interfaces:**
- Consumes: the asserted `dir`.
- Produces: `verifyInstance(dir: string): void` — runs the JS/TS chain then the agent's Python chain in `dir`, inheriting stdio; throws (via `execSync`) on the first non-zero exit.

- [ ] **Step 1: Add the verify stage**

Add after `assertMaterialized`:

```js
function run(cmd, cwd) {
  console.log(`\nsmoke: $ ${cmd}   (cwd: ${cwd})`);
  execSync(cmd, {cwd, stdio: 'inherit'});
}

function verifyInstance(dir) {
  // JS/TS workspace. No yarn.lock ships in the template, so this generates one.
  run('yarn install', dir);
  run('yarn build:all', dir);
  run('yarn typecheck:all', dir);
  run('yarn lint:all', dir);
  run('yarn test:all', dir);
  // Python agent. uv sync creates agent/.venv (ignored by the template eslint).
  const agent = join(dir, 'agent');
  run('uv sync', agent);
  run('uv run pytest', agent);
  console.log('\nsmoke: verify stage OK — JS/TS + agent green');
}
```

- [ ] **Step 2: Wire into `main`** — add after `assertMaterialized(dir)`, before `rmSync`:

```js
  verifyInstance(dir);
```

- [ ] **Step 3: Run the full verify (slow — installs deps)**

Run: `node adapter-template/smoke-test.mjs`
Expected: each `yarn …` / `uv …` command runs to completion; the workspaces build, typecheck clean, lint clean, vitest passes; `uv sync` resolves and `uv run pytest` passes. Final line `smoke: verify stage OK — JS/TS + agent green`, exit 0.

Note: `yarn install` and `uv sync` may need network the first time (warm caches make it offline). `test:all` runs `vitest run` only — Playwright (`test:e2e`) is **not** in scope and must not be invoked.

- [ ] **Step 4: Commit**

```bash
git add adapter-template/smoke-test.mjs
git commit -m "test(phase-3): smoke-test.mjs full materialize-then-build verify (task 3.4)"
```

---

### Task 6: Agnosticism grep + final cleanup

DoD (b): grep the *original* template's build surface (adapter/client/agent/root config) for library/domain identifiers; the only allowed hit is the `catalog-id.ts` GitHub-host comment (the §6 host invariant, not the domain). Then finalize the run output and temp cleanup.

**Files:**
- Modify: `adapter-template/smoke-test.mjs`

**Interfaces:**
- Consumes: module-level `SRC`.
- Produces: `checkAgnosticism(): void` — scans `SRC` code/config files for `/primer/i` and `/github/i`, throws on any hit outside the allowlist.

- [ ] **Step 1: Add the agnosticism stage**

Add after `verifyInstance`:

```js
// Build-surface file types only (prose .md is out of scope per spec decision #9).
const CODE_EXT = new Set(['.ts', '.tsx', '.js', '.mjs', '.cjs', '.json', '.py', '.toml']);
// Tooling/skills + verification machinery are not the build surface.
const AGNO_EXCLUDE_NAMES = new Set(['node_modules', '.venv', 'dist', '.git', '.yarn', '.claude']);
// Accidental-shaping identifiers: the reference library (Primer) and domain (GitHub).
const SHAPING_RE = /primer|github/i;
// The one allowed hit: catalog-id.ts references hosting catalog.json in a GitHub repo
// (the github.com host invariant, not the {{Domain}}).
const AGNO_ALLOW_RELPATHS = new Set(['{{adapterPkg}}/src/catalog-id.ts']);

function extname(name) {
  const i = name.lastIndexOf('.');
  return i < 0 ? '' : name.slice(i);
}

function checkAgnosticism() {
  const offenders = [];
  const walk = (dir) => {
    for (const name of readdirSync(dir)) {
      if (AGNO_EXCLUDE_NAMES.has(name)) continue;
      const abs = join(dir, name);
      const relp = relative(SRC, abs).split(sep).join('/');
      const st = statSync(abs);
      if (st.isDirectory()) {
        walk(abs);
      } else if (CODE_EXT.has(extname(name)) && !AGNO_ALLOW_RELPATHS.has(relp)) {
        const body = readFileSync(abs, 'utf8');
        body.split('\n').forEach((line, i) => {
          if (SHAPING_RE.test(line)) offenders.push(`${relp}:${i + 1}: ${line.trim()}`);
        });
      }
    }
  };
  walk(SRC);
  if (offenders.length > 0) {
    throw new Error(`template is library/domain-shaped (build surface):\n  - ${offenders.join('\n  - ')}`);
  }
  console.log('smoke: agnosticism OK — no Primer/GitHub identifiers on the build surface');
}
```

- [ ] **Step 2: Finalize `main`** — replace `main()` so cleanup is guarded and the agnosticism check runs against the original source:

```js
async function main() {
  checkAgnosticism(); // operates on the original template, independent of the copy

  const dir = copyTemplate();
  console.log(`smoke: copied template → ${dir}`);
  try {
    if (!existsSync(join(dir, 'fill.mjs'))) throw new Error('copy missing fill.mjs');
    if (!existsSync(join(dir, '.claude/skills/init/SKILL.md'))) throw new Error('copy missing init skill');
    if (existsSync(join(dir, SELF))) throw new Error('smoke-test.mjs should not be copied');

    runFill(dir);
    if (!existsSync(join(dir, 'primer-a2ui-adapter'))) {
      throw new Error('fill did not rename {{adapterPkg}} → primer-a2ui-adapter');
    }
    assertMaterialized(dir);
    verifyInstance(dir);

    rmSync(dir, {recursive: true, force: true});
    console.log('\nsmoke: SMOKE TEST PASSED');
  } catch (err) {
    console.error(`\nsmoke: left temp instance for inspection → ${dir}`);
    throw err;
  }
}
```

- [ ] **Step 3: Run the complete smoke test**

Run: `node adapter-template/smoke-test.mjs`
Expected: agnosticism line first, then copy → fill → assertions → full verify all green, ending `smoke: SMOKE TEST PASSED`, exit 0. The temp instance is removed on success.

- [ ] **Step 4: Confirm a failure leaves the temp dir (manual spot check, optional)**

Temporarily break agnosticism to prove the guard works, then revert:

```bash
# expect a non-zero exit and a "left temp instance" line — then revert immediately
node -e "require('node:fs').appendFileSync('adapter-template/client/src/main.tsx', '// primer\n')"
node adapter-template/smoke-test.mjs; echo "exit=$?"
git checkout -- adapter-template/client/src/main.tsx
```
Expected: `exit=1` and `template is library/domain-shaped` reported. (Revert leaves the tree clean.)

- [ ] **Step 5: Commit**

```bash
git add adapter-template/smoke-test.mjs
git commit -m "test(phase-3): smoke-test.mjs agnosticism check + finalize (task 3.4)"
```

---

## Self-Review

**Spec coverage (decision #9 + the carry-in):**
- DoD (a) materialize-then-build → Tasks 2–5 (copy, fill, assert tokens/init, build both toolchains). ✓
- DoD (a) "zero `{{...}}` tokens" + "init files still present" → Task 4. ✓
- DoD (b) agnosticism grep → Task 6. ✓
- `.venv` eslint-ignore carry-in, in reference + template together → Task 1. ✓
- Smoke test inside `adapter-template/`, run manually, wired into nothing → Global Constraints + Task 2. ✓
- Operates on a temp copy, never mutates the template → `copyTemplate`/temp dir throughout. ✓
- Self-delete never fired → asserted by "init machinery present" (Task 4); the smoke test drives fill→verify only. ✓

**Placeholder scan:** No TBD/TODO/"handle edge cases"/"similar to Task N" — every step shows the actual code or command. ✓

**Type consistency:** `copyTemplate`/`runFill`/`assertMaterialized`/`verifyInstance`/`checkAgnosticism`/`run`/`walkAll` are defined once and called with matching signatures; `SRC`/`SELF`/`REF_VALUES`/`TOKEN_RE` are module-level and reused consistently. The `**/.venv/**` ignore string and the `'adapter-template/smoke-test.mjs'` ignore are spelled identically to the existing entries they sit beside. ✓

**Notes for the implementer:**
- `execSync` throws on non-zero exit, so each `run(...)` is its own assertion — no explicit exit-code checks needed.
- The copy filter keeps `fill.mjs` and `.claude/skills/init/` (init machinery) but drops `smoke-test.mjs` and `*.values.json` (verification machinery) — that split is what makes both the "0 tokens" and "init present" assertions hold.
- `checkAgnosticism()` runs against the original `adapter-template/` (via `SRC`), not the temp copy — it is a property of the shipped template, and runs first so a shaped template fails fast before the slow build.
