# Task 6.1 — Registry-Driven Catalog Smoke-Test Refactor Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the per-component `has()` assertions in the catalog smoke test with one exact-set assertion per map (components, functions) against a shared registry, and repoint the Build skill's steps 5/7 at that single registry touch-point.

**Architecture:** The `COMPONENTS`/`FUNCTIONS` registry maps move out of `catalog.parity.test.ts` into a new shared module `src/catalog.registry.ts` (a test file can't be imported by another test without re-registering its suites). The parity test and the smoke test both import from it; adding a component to the catalog then requires exactly one registry edit, and both tests auto-cover. The Build skill and its worked-example reference are updated in the same change so the authoring procedure matches the new test shape.

**Tech Stack:** TypeScript, vitest, zod (adapter workspace `primer-a2ui-adapter`); Markdown (skill docs).

## Global Constraints

- Conventional commits: `<type>(phase-6): …` (phase/sub-task work, per CLAUDE.md §3).
- Implementation happens on the worktree branch `phase-6/1-registry-smoke-test` off `main`; `_dev/` is never edited on that branch.
- The exact-set assertion must be exact equality (a stray catalog entry and a missing one both fail) — not a superset/`toContain` check. Per phase spec §6.
- Test + skill edits land in the same change (same sub-task/PR); multiple commits are fine.
- Adapter test command: `yarn workspace primer-a2ui-adapter test` (vitest); typecheck: `yarn workspace primer-a2ui-adapter typecheck`.

---

### Task 1: Extract the shared registry module

**Files:**
- Create: `primer-a2ui-adapter/src/catalog.registry.ts`
- Modify: `primer-a2ui-adapter/src/catalog.parity.test.ts:6-8` (imports) and `:59-62` (inline registry consts)

**Interfaces:**
- Consumes: `TextApi` (`./components/text`), `ButtonApi` (`./components/button`), `consoleLog` (`./functions/console-log`) — all existing exports.
- Produces: `COMPONENTS: {Text: TextApi, Button: ButtonApi}` and `FUNCTIONS: {consoleLog}` (both `as const`), exported from `src/catalog.registry.ts`. Task 2's smoke test imports these by exactly these names.

- [ ] **Step 1: Create the registry module**

Create `primer-a2ui-adapter/src/catalog.registry.ts`:

```ts
import {TextApi} from './components/text';
import {ButtonApi} from './components/button';
import {consoleLog} from './functions/console-log';

// Component registry: zod ComponentApi keyed by component name — the hand-maintained
// expected set the parity test (catalog.parity.test.ts) and the catalog smoke test
// (catalog.test.ts) both derive from. One entry per shipped component.
export const COMPONENTS = {Text: TextApi, Button: ButtonApi} as const;
// Function registry: FunctionImplementation keyed by function name.
export const FUNCTIONS = {consoleLog} as const;
```

Note: `tsconfig.json` includes `src` and excludes only `**/*.test.ts*`, so this module compiles into `dist/` — that is fine (it only re-exports already-shipped objects) and it is deliberately **not** added to the `index.ts` barrel.

- [ ] **Step 2: Point the parity test at the registry**

In `primer-a2ui-adapter/src/catalog.parity.test.ts`, replace the three implementation imports (lines 6–8):

```ts
import {TextApi} from './components/text';
import {ButtonApi} from './components/button';
import {consoleLog} from './functions/console-log';
```

with:

```ts
import {COMPONENTS, FUNCTIONS} from './catalog.registry';
```

and delete the now-duplicate inline consts (lines 59–62):

```ts
// Component registry: zod ComponentApi keyed by component name.
const COMPONENTS = {Text: TextApi, Button: ButtonApi} as const;
// Function registry: FunctionImplementation keyed by function name.
const FUNCTIONS = {consoleLog} as const;
```

(The comment lines move to the registry module, as written in Step 1.) Everything else in the parity test — `describe.each(Object.entries(COMPONENTS))`, `describe.each(Object.entries(FUNCTIONS))` — is untouched and keeps working against the imported maps.

- [ ] **Step 3: Run the adapter suite to verify the refactor is behavior-neutral**

Run: `yarn workspace primer-a2ui-adapter test`
Expected: PASS — same test count as before (no suite added or removed by this task).

Run: `yarn workspace primer-a2ui-adapter typecheck`
Expected: clean exit.

- [ ] **Step 4: Commit**

```bash
git add primer-a2ui-adapter/src/catalog.registry.ts primer-a2ui-adapter/src/catalog.parity.test.ts
git commit -m "refactor(phase-6): extract COMPONENTS/FUNCTIONS parity registry to catalog.registry.ts"
```

---

### Task 2: Exact-set catalog smoke test

**Files:**
- Modify: `primer-a2ui-adapter/src/catalog.test.ts` (full rewrite of the `describe` body)

**Interfaces:**
- Consumes: `COMPONENTS`, `FUNCTIONS` from `./catalog.registry` (Task 1); `CATALOG`, `CATALOG_ID` from `./index` (existing). `CATALOG.components`/`CATALOG.functions` are `ReadonlyMap<string, …>` (from `@a2ui/web_core`'s `Catalog` class), so key sets come from `[...map.keys()]`.
- Produces: nothing consumed by later tasks (Task 3 is docs-only).

- [ ] **Step 1: Replace the per-component `has()` assertions with exact-set assertions**

Rewrite `primer-a2ui-adapter/src/catalog.test.ts` to:

```ts
import {describe, it, expect} from 'vitest';
import {CATALOG, CATALOG_ID} from './index';
import {COMPONENTS, FUNCTIONS} from './catalog.registry';

describe('CATALOG', () => {
  it('carries the catalog id', () => {
    expect(CATALOG.id).toBe(CATALOG_ID);
  });

  it('registers exactly the registry components', () => {
    expect([...CATALOG.components.keys()].sort()).toEqual(Object.keys(COMPONENTS).sort());
  });

  it('registers exactly the registry functions', () => {
    expect([...CATALOG.functions.keys()].sort()).toEqual(Object.keys(FUNCTIONS).sort());
  });

  it('exposes a function invoker', () => {
    expect(typeof CATALOG.invoker).toBe('function');
  });
});
```

The three `registers the …` / `has(…)` tests are gone; the id and invoker tests stay. `toEqual` on sorted key arrays is the exact-set check: an entry present in `CATALOG` but missing from the registry fails, and vice versa.

- [ ] **Step 2: Run the smoke test to verify it passes**

Run: `yarn workspace primer-a2ui-adapter test src/catalog.test.ts`
Expected: PASS — 4 tests.

- [ ] **Step 3: Prove the exact-set assertion can fail (drift check)**

Temporarily edit `primer-a2ui-adapter/src/catalog.registry.ts`, removing `Button: ButtonApi` from `COMPONENTS`:

```ts
export const COMPONENTS = {Text: TextApi} as const;
```

Run: `yarn workspace primer-a2ui-adapter test src/catalog.test.ts`
Expected: FAIL — `registers exactly the registry components` reports `['Button', 'Text']` ≠ `['Text']`. This is precisely the drift (catalog entry not in the registry) the old `has()` style could never catch.

Revert the edit (restore `{Text: TextApi, Button: ButtonApi}`).

Run: `yarn workspace primer-a2ui-adapter test`
Expected: PASS — full adapter suite green again.

- [ ] **Step 4: Commit**

```bash
git add primer-a2ui-adapter/src/catalog.test.ts
git commit -m "refactor(phase-6): exact-set catalog smoke test against the parity registry"
```

---

### Task 3: Repoint the Build skill's steps 5/7 (+ Orchestration bullet, sub-loop, worked example)

**Files:**
- Modify: `.claude/skills/build-catalog-component/SKILL.md:37-42` (Orchestration auto-cover bullet), `:119-120` (step 5), `:125-126` (step 7), `:137-138` (function sub-loop item 5)
- Modify: `.claude/skills/build-catalog-component/references/worked-example.md:252-264` (Parity + smoke section), `:333-334` (function registration sentence)

**Interfaces:**
- Consumes: the file layout Tasks 1–2 produced (`src/catalog.registry.ts` as the single touch-point; `catalog.test.ts` registry-derived).
- Produces: nothing — docs only.

- [ ] **Step 1: Update the Orchestration auto-cover bullet**

In `SKILL.md`, the second Orchestration bullet currently reads:

> **Registry/barrel-derived tests auto-cover — no per-component edit.** Several tests derive
> their assertions from a registry or barrel and pick up a new entry the moment it lands: the
> parity test's `COMPONENTS`/`FUNCTIONS` maps and `anyComponent`/`anyFunction` coverage checks,
> the client structural (`fixtures.test.ts`) and selector (`selector.test.tsx`) tests, and the
> agent conformance test (parametrized over `_EVENT_FIXTURES`). Where a step is one of these,
> it is a genuine no-op called out so the surface is provably complete.

Replace the middle sentence so the list names the registry module and adds the smoke test:

> **Registry/barrel-derived tests auto-cover — no per-component edit.** Several tests derive
> their assertions from a registry or barrel and pick up a new entry the moment it lands: the
> `COMPONENTS`/`FUNCTIONS` registry (`src/catalog.registry.ts`) driving both the parity test
> and the catalog smoke test's exact-set assertions, the `anyComponent`/`anyFunction` coverage
> checks, the client structural (`fixtures.test.ts`) and selector (`selector.test.tsx`) tests,
> and the agent conformance test (parametrized over `_EVENT_FIXTURES`). Where a step is one of
> these, it is a genuine no-op called out so the surface is provably complete.

- [ ] **Step 2: Rewrite step 5 as the single registry touch-point**

Replace:

> **5. Parity registry** — `src/catalog.parity.test.ts`. Add `<Name>Api` to the `COMPONENTS` map.
> Auto-covers (see Orchestration) — no per-component assertion.

with:

> **5. Registry** — `src/catalog.registry.ts`. Add `<Name>Api` to the `COMPONENTS` map — the
> single registry touch-point. Auto-covers (see Orchestration): the parity test's
> `describe.each` and the catalog smoke test's exact-set assertion both derive from this map.

- [ ] **Step 3: Rewrite step 7 as a called-out no-op**

Replace:

> **7. Catalog smoke test** — `src/catalog.test.ts`. Add one `CATALOG.components.has('<Name>')`
> assertion inside the existing `describe('CATALOG', …)` block.

with:

> **7. Catalog smoke test** — `src/catalog.test.ts`. Auto-covers (see Orchestration); no edit —
> its exact-set assertion derives from the registry (step 5).

- [ ] **Step 4: Update the function sub-loop's registry mention**

In the "Optional: local-function sub-loop" paragraph, replace:

> (5) add it to the `FUNCTIONS` parity map (auto-covers)

with:

> (5) add it to the `FUNCTIONS` map in `src/catalog.registry.ts` (auto-covers — parity and
> smoke test)

- [ ] **Step 5: Update the worked example's "Parity + smoke" section**

In `references/worked-example.md`, replace the section (lines 252–264):

> ### Parity + smoke — `catalog.parity.test.ts` / `catalog.test.ts`
>
> Parity: add `<Name>Api` to the `COMPONENTS` registry map
> (`const COMPONENTS = {Text: TextApi, Button: ButtonApi} as const;`). The existing
> `describe.each` loop and `anyComponent` coverage check cover the new entry automatically.
>
> Smoke: add one assertion inside the existing `describe('CATALOG', …)` block:
>
> ```ts
> it('registers the Button component', () => {
>   expect(CATALOG.components.has('Button')).toBe(true);
> });
> ```

with:

> ### Registry — `catalog.registry.ts` (drives parity + smoke)
>
> Add `<Name>Api` to the `COMPONENTS` registry map in `src/catalog.registry.ts`
> (`export const COMPONENTS = {Text: TextApi, Button: ButtonApi} as const;`) — the single
> registry touch-point. The parity test's `describe.each` loop and `anyComponent` coverage
> check, and the smoke test's exact-set assertion, cover the new entry automatically:
>
> ```ts
> it('registers exactly the registry components', () => {
>   expect([...CATALOG.components.keys()].sort()).toEqual(Object.keys(COMPONENTS).sort());
> });
> ```

- [ ] **Step 6: Update the worked example's function-registration sentence**

Replace (line 333–334):

> Register the function in the
> `new Catalog(...)` functions array and add it to the `FUNCTIONS` registry map in the parity test.

with:

> Register the function in the
> `new Catalog(...)` functions array and add it to the `FUNCTIONS` registry map in
> `src/catalog.registry.ts`.

- [ ] **Step 7: Sanity-check for stale references**

Run: `grep -rn "catalog.parity.test.ts\|has('<Name>')\|components.has" .claude/skills/build-catalog-component/`
Expected: no remaining instruction telling an author to edit the parity test directly or to add a `has()` assertion. (A mention of `catalog.parity.test.ts` as a *file that exists* is fine; an instruction to *edit* it as the registry touch-point is not.)

- [ ] **Step 8: Commit**

```bash
git add .claude/skills/build-catalog-component/SKILL.md .claude/skills/build-catalog-component/references/worked-example.md
git commit -m "docs(phase-6): repoint Build skill steps 5/7 at the catalog.registry.ts touch-point"
```
