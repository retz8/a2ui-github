# Templatized Code Tree (Task 3.1) Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Extract `adapter-template/` — an empty-but-wired adapter + client + deterministic-agent + root-config scaffold — from the post-Phase-2 reference instance, and neutralize the reference instance's library-named identifiers so the two do not drift.

**Architecture:** Work in two layers. First, rename library-coupled identifiers *in the reference instance itself* (`primer-a2ui-adapter`, `client`, `agent`) to library-neutral forms and confirm the reference stays green. Then copy the neutralized tree into `adapter-template/`, strip every piece of domain content, replace library/repo identity with `{{...}}` placeholders in file contents and paths, and reduce the test suites to a plumbing-smoke layer. The template is not buildable in this task — it contains `{{...}}` tokens; "green" is proven later in Task 3.4 after materialization.

**Tech Stack:** Yarn 4 workspaces, TypeScript, React 19, Vite/Vitest, Playwright, Python 3.14 + uv, pytest, the `@a2ui/*` and `@a2a-js/sdk` packages.

## Global Constraints

- **Protocol pinned to v0.9.** Never tokenize the protocol forms: `@a2ui/*/v0_9` import namespaces, the string `version="v0.9"` / `"v0.9"`, and Python `VERSION_0_9` stay **literal** in every file.
- **Token set (exactly six):** `{{Library}}` (Pascal display name — **prose only, never in the 3.1 code tree**), `{{libraryPkg}}` (= `@primer/react`), `{{adapterPkg}}` (= `primer-a2ui-adapter`, **including the directory name**), `{{agentPkg}}` (= `a2ui-github-agent`, the agent uv-project name only), `{{version}}` (= `v0.9.1`, catalog dir/path/catalog-id only), `{{repoSlug}}` (= `retz8/a2ui-github`).
- **Frozen literals, never tokenized:** `github.com/blob/main` in the catalog-id; the `deterministic_agent/` Python module name and all `from deterministic_agent …` imports; the `client/` and `agent/` directory names.
- **Zero domain content in the template:** no `Text`/`Button`, no fixtures, no canned responses, no `console-log`, no component-specific tests.
- **Library-agnostic:** the template must never be accidentally Primer-shaped, including API-shaped spots (theme providers, CSS-inline configs) that a package-name token alone would not neutralize. Those become marked seams.
- **`_dev/` stays on `main`.** This task touches code only, in a worktree off `main`. Do not edit anything under `_dev/`.
- **Commit convention:** `<type>(phase-3): …`.
- **Reference green command:** `yarn verify:all` (build + typecheck + lint + test) from the repo root, plus `cd agent && uv run pytest` for the Python agent.

---

## File Structure

**Reference instance (Task 1 — rename in place):**
- `primer-a2ui-adapter/src/{catalog.ts, catalog-id.ts, index.ts, catalog.test.ts}` — `PRIMER_CATALOG`/`PRIMER_CATALOG_ID` → `CATALOG`/`CATALOG_ID`.
- `client/src/test-space/FixtureView.tsx`, `client/tests/{round-trip-render.test.tsx, fixtures.test.ts}` — same import rename.
- `agent/deterministic_agent/catalog.py` — `CatalogConfig.from_path("primer", …)` → `from_path("adapter", …)`.

**Template (Tasks 2–5 — `adapter-template/` new tree):**
- Task 2 — root: `adapter-template/{package.json, tsconfig.base.json, eslint.config.mjs, .prettierrc, .prettierignore, .gitignore, .yarnrc.yml, .editorconfig}`.
- Task 3 — adapter: `adapter-template/{{adapterPkg}}/…` (token-named dir).
- Task 4 — client: `adapter-template/client/…`.
- Task 5 — agent: `adapter-template/agent/…`.

**Out of scope (other sub-tasks):** `SPEC.md`, `CLAUDE.md`, the root `README.md`, `.claude/`, the init skill (3.2/3.3); the materialize-then-build verification and agnosticism grep that *prove* green (3.4). Per-package README *files* are carried here mechanically (tokens substituted, skeleton/phase notes dropped); their substantive setup-requirements prose is authored in 3.2.

---

## Task 1: Neutralize identifiers in the reference instance

Rename the library-named catalog symbols and the Python catalog label to library-neutral forms across the reference instance, keeping all domain content (Text/Button/consoleLog) intact. Deliverable: the reference instance still passes `verify:all` + `pytest` under the new names.

**Files:**
- Modify: `primer-a2ui-adapter/src/catalog-id.ts`, `primer-a2ui-adapter/src/catalog.ts`, `primer-a2ui-adapter/src/index.ts`, `primer-a2ui-adapter/src/catalog.test.ts`
- Modify: `client/src/test-space/FixtureView.tsx`, `client/tests/round-trip-render.test.tsx`, `client/tests/fixtures.test.ts`
- Modify: `agent/deterministic_agent/catalog.py`

**Interfaces:**
- Produces: `CATALOG` and `CATALOG_ID` exported from `primer-a2ui-adapter` (replacing `PRIMER_CATALOG` / `PRIMER_CATALOG_ID`). These names carry into the template in Task 3.

- [ ] **Step 1: Find every occurrence of the old symbols**

Run: `grep -rn "PRIMER_CATALOG" primer-a2ui-adapter/src client/src client/tests`
Expected: matches in `catalog.ts`, `catalog-id.ts`, `index.ts`, `catalog.test.ts`, `FixtureView.tsx`, `round-trip-render.test.tsx`, `fixtures.test.ts`.

- [ ] **Step 2: Rename the exported constant `PRIMER_CATALOG_ID` → `CATALOG_ID`**

In `primer-a2ui-adapter/src/catalog-id.ts`, rename the export (keep the URL value and the `TODO(phase-2)` comment unchanged):

```ts
// TODO(phase-2): finalize the hosted catalog URL once hosting is decided.
export const CATALOG_ID =
  'https://github.com/retz8/a2ui-github/blob/main/primer-a2ui-adapter/catalogs/v0.9.1/catalog.json';
```

- [ ] **Step 3: Rename `PRIMER_CATALOG` → `CATALOG` and update its import of the id**

`primer-a2ui-adapter/src/catalog.ts` becomes:

```ts
import {Catalog} from '@a2ui/web_core/v0_9';
import type {ReactComponentImplementation} from '@a2ui/react/v0_9';
import {CATALOG_ID} from './catalog-id';
import {TextComponent} from './components/text';
import {ButtonComponent} from './components/button';
import {consoleLog} from './functions/console-log';

/** From-scratch catalog over CommonSchemas: id, component implementations, functions. */
export const CATALOG = new Catalog<ReactComponentImplementation>(
  CATALOG_ID,
  [TextComponent, ButtonComponent],
  [consoleLog],
);
```

- [ ] **Step 4: Update the barrel**

`primer-a2ui-adapter/src/index.ts` becomes:

```ts
export {CATALOG} from './catalog';
export {CATALOG_ID} from './catalog-id';
```

- [ ] **Step 5: Update the adapter test names**

`primer-a2ui-adapter/src/catalog.test.ts` — rename the imports/usages (keep the Text/Button/consoleLog assertions, since the reference still has them):

```ts
import {describe, it, expect} from 'vitest';
import {CATALOG, CATALOG_ID} from './index';

describe('CATALOG', () => {
  it('carries the catalog id', () => {
    expect(CATALOG.id).toBe(CATALOG_ID);
  });

  it('registers the Text component', () => {
    expect(CATALOG.components.has('Text')).toBe(true);
  });

  it('registers the Button component', () => {
    expect(CATALOG.components.has('Button')).toBe(true);
  });

  it('registers the consoleLog function', () => {
    expect(CATALOG.functions.has('consoleLog')).toBe(true);
  });

  it('exposes a function invoker', () => {
    expect(typeof CATALOG.invoker).toBe('function');
  });
});
```

- [ ] **Step 6: Update the client consumers**

In `client/src/test-space/FixtureView.tsx`, change the import and both usages:
- `import {PRIMER_CATALOG} from 'primer-a2ui-adapter';` → `import {CATALOG} from 'primer-a2ui-adapter';`
- `new MessageProcessor([PRIMER_CATALOG], handler)` → `new MessageProcessor([CATALOG], handler)`

In `client/tests/round-trip-render.test.tsx`:
- `import {PRIMER_CATALOG} from 'primer-a2ui-adapter';` → `import {CATALOG} from 'primer-a2ui-adapter';`
- `new MessageProcessor([PRIMER_CATALOG])` → `new MessageProcessor([CATALOG])`

In `client/tests/fixtures.test.ts`:
- `import {PRIMER_CATALOG_ID} from 'primer-a2ui-adapter';` → `import {CATALOG_ID} from 'primer-a2ui-adapter';`
- `expect(m.createSurface.catalogId).toBe(PRIMER_CATALOG_ID);` → `expect(m.createSurface.catalogId).toBe(CATALOG_ID);`

- [ ] **Step 7: Neutralize the Python catalog label**

In `agent/deterministic_agent/catalog.py`, in `_schema_manager()`:
- `CatalogConfig.from_path("primer", str(catalog_json_path()))` → `CatalogConfig.from_path("adapter", str(catalog_json_path()))`

- [ ] **Step 8: Confirm no old symbol remains**

Run: `grep -rn "PRIMER_CATALOG\|from_path(\"primer\"" primer-a2ui-adapter/src client/src client/tests agent/deterministic_agent`
Expected: no output.

- [ ] **Step 9: Run the TypeScript green check**

Run: `yarn verify:all`
Expected: PASS — build, typecheck, lint, and all vitest suites green.

- [ ] **Step 10: Run the Python green check**

Run: `cd agent && uv run pytest && cd ..`
Expected: PASS — all agent tests green.

- [ ] **Step 11: Commit**

```bash
git add primer-a2ui-adapter/src client/src client/tests agent/deterministic_agent/catalog.py
git commit -m "refactor(phase-3): neutralize catalog identifiers in the reference instance"
```

---

## Task 2: Scaffold `adapter-template/` root

Create the template directory and copy the root build configuration, tokenizing repo/workspace identity. Deliverable: a root config tree that an engineer can read as the workspace root, with all six tokens' root-level occurrences in place.

**Files:**
- Create: `adapter-template/package.json`, `adapter-template/tsconfig.base.json`, `adapter-template/eslint.config.mjs`, `adapter-template/.prettierrc`, `adapter-template/.prettierignore`, `adapter-template/.gitignore`, `adapter-template/.yarnrc.yml`, `adapter-template/.editorconfig`

**Interfaces:**
- Produces: the workspaces array `["{{adapterPkg}}", "client"]` and the root scripts (`build:all`, `verify:all`, …) that Tasks 3–5 and 3.4 rely on.

- [ ] **Step 1: Create the directory**

Run: `mkdir -p adapter-template`
Expected: no output.

- [ ] **Step 2: Write `adapter-template/package.json`**

Copy `package.json`, with the root `name` neutralized (it is private/cosmetic — applying the established neutralize-identity principle) and the workspaces tokenized:

```json
{
  "name": "a2ui-app",
  "private": true,
  "packageManager": "yarn@4.13.0",
  "workspaces": [
    "{{adapterPkg}}",
    "client"
  ],
  "scripts": {
    "build:all": "yarn workspaces foreach -A --topological-dev run build",
    "typecheck:all": "yarn workspaces foreach -A --topological-dev run typecheck",
    "test:all": "yarn workspaces foreach -A --topological-dev run test",
    "lint:all": "eslint .",
    "verify:all": "yarn build:all && yarn typecheck:all && yarn lint:all && yarn test:all",
    "format": "prettier --write .",
    "format:check": "prettier --check .",
    "lint": "eslint ."
  },
  "devDependencies": {
    "@eslint/js": "^9.39.1",
    "eslint": "^9.39.1",
    "eslint-plugin-react-hooks": "^7.1.1",
    "eslint-plugin-react-refresh": "^0.5.3",
    "globals": "^16.5.0",
    "prettier": "^3.6.2",
    "typescript": "~5.9.3",
    "typescript-eslint": "^8.46.0"
  }
}
```

- [ ] **Step 3: Copy the literal-carry config files verbatim**

Copy each of these from the repo root into `adapter-template/` unchanged (they carry no library/repo/domain identity):

```bash
cp tsconfig.base.json adapter-template/tsconfig.base.json
cp eslint.config.mjs adapter-template/eslint.config.mjs
cp .prettierrc adapter-template/.prettierrc
cp .prettierignore adapter-template/.prettierignore
cp .gitignore adapter-template/.gitignore
cp .yarnrc.yml adapter-template/.yarnrc.yml
cp .editorconfig adapter-template/.editorconfig
```

- [ ] **Step 4: Verify no stray identity leaked into the root**

Run: `grep -rn "primer\|a2ui-github\|retz8" adapter-template`
Expected: no output (the only identity at the root is the tokenized `{{adapterPkg}}` in `package.json`).

- [ ] **Step 5: Commit**

```bash
git add adapter-template
git commit -m "feat(phase-3): scaffold adapter-template root config"
```

---

## Task 3: Adapter package in the template (empty-but-wired)

Create the token-named adapter package with an empty catalog envelope, an empty `components/` directory, and the trimmed envelope smoke test. Deliverable: the adapter scaffold with zero domain content and the spec-reference seam.

**Files:**
- Create: `adapter-template/{{adapterPkg}}/package.json`, `adapter-template/{{adapterPkg}}/tsconfig.json`, `adapter-template/{{adapterPkg}}/vitest.config.ts`, `adapter-template/{{adapterPkg}}/vitest.setup.ts`, `adapter-template/{{adapterPkg}}/README.md`
- Create: `adapter-template/{{adapterPkg}}/src/catalog.ts`, `…/src/catalog-id.ts`, `…/src/index.ts`, `…/src/catalog.test.ts`
- Create: `adapter-template/{{adapterPkg}}/src/components/README.md` (empty-dir marker)
- Create: `adapter-template/{{adapterPkg}}/catalogs/{{version}}/catalog.json`

**Interfaces:**
- Consumes: `CATALOG` / `CATALOG_ID` naming from Task 1.
- Produces: package importable as `{{adapterPkg}}`, exporting `CATALOG` and `CATALOG_ID`; consumed by the client in Task 4.

- [ ] **Step 1: Create the directory tree**

Run: `mkdir -p "adapter-template/{{adapterPkg}}/src/components" "adapter-template/{{adapterPkg}}/catalogs/{{version}}"`
Expected: no output. (The brace-named directory is intentional — it is renamed to the real package name at materialization in 3.4.)

- [ ] **Step 2: Write the tokenized `package.json`**

`adapter-template/{{adapterPkg}}/package.json` — copy from `primer-a2ui-adapter/package.json`, replacing the `name` with `{{adapterPkg}}` and every `@primer/react` with `{{libraryPkg}}`:

```json
{
  "name": "{{adapterPkg}}",
  "version": "0.0.0",
  "type": "module",
  "sideEffects": false,
  "main": "./dist/index.js",
  "module": "./dist/index.js",
  "types": "./dist/index.d.ts",
  "exports": {
    ".": {
      "import": {
        "types": "./dist/index.d.ts",
        "default": "./dist/index.js"
      }
    }
  },
  "files": [
    "dist",
    "catalogs"
  ],
  "scripts": {
    "build": "tsc -p tsconfig.json",
    "typecheck": "tsc --noEmit",
    "test": "vitest run"
  },
  "peerDependencies": {
    "@a2ui/react": "^0.10.1",
    "@a2ui/web_core": "^0.10.1",
    "{{libraryPkg}}": "^38.28.0",
    "react": "^19.2.7",
    "react-dom": "^19.2.7",
    "zod": "^3.25.76"
  },
  "devDependencies": {
    "@a2ui/react": "^0.10.1",
    "@a2ui/web_core": "^0.10.1",
    "{{libraryPkg}}": "^38.28.0",
    "@testing-library/dom": "^10.4.1",
    "@testing-library/jest-dom": "^6.9.1",
    "@testing-library/react": "^16.3.2",
    "@types/react": "^19.2.17",
    "@types/react-dom": "^19.2.3",
    "@vitejs/plugin-react": "^6.0.2",
    "jsdom": "^29.1.1",
    "react": "^19.2.7",
    "react-dom": "^19.2.7",
    "typescript": "~5.9.3",
    "vitest": "^4.1.9",
    "zod": "^3.25.76"
  }
}
```

- [ ] **Step 3: Copy `tsconfig.json` and `vitest.setup.ts` verbatim**

```bash
cp primer-a2ui-adapter/tsconfig.json "adapter-template/{{adapterPkg}}/tsconfig.json"
cp primer-a2ui-adapter/vitest.setup.ts "adapter-template/{{adapterPkg}}/vitest.setup.ts"
```

- [ ] **Step 4: Write `vitest.config.ts` with the Primer CSS-inline stripped to a seam**

`adapter-template/{{adapterPkg}}/vitest.config.ts` — the reference inlines `@primer/react` to transform its CSS imports under jsdom; remove that library-specific hack and leave a marker:

```ts
import {defineConfig} from 'vitest/config';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    setupFiles: ['./vitest.setup.ts'],
    css: true,
    // If your design system ships CSS imports that Vite externalizes under
    // jsdom (tests fail loading its CSS), inline it here:
    //   server: {deps: {inline: [/your-design-system/]}}
  },
});
```

- [ ] **Step 5: Write the empty catalog envelope `catalog.json`**

`adapter-template/{{adapterPkg}}/catalogs/{{version}}/catalog.json` (pure data — no inline comment):

```json
{
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "$id": "https://github.com/{{repoSlug}}/blob/main/{{adapterPkg}}/catalogs/{{version}}/catalog.json",
  "catalogId": "https://github.com/{{repoSlug}}/blob/main/{{adapterPkg}}/catalogs/{{version}}/catalog.json",
  "components": {},
  "functions": {},
  "$defs": {}
}
```

- [ ] **Step 6: Write `catalog-id.ts` with the reframed marker comment**

`adapter-template/{{adapterPkg}}/src/catalog-id.ts`:

```ts
// The canonical hosted URL identifying this catalog. The {{repoSlug}}/blob/main
// skeleton assumes catalog.json is hosted in your GitHub repo on the default
// branch — change it if you host the catalog elsewhere.
export const CATALOG_ID =
  'https://github.com/{{repoSlug}}/blob/main/{{adapterPkg}}/catalogs/{{version}}/catalog.json';
```

- [ ] **Step 7: Write the empty `catalog.ts` with the spec-reference seam**

`adapter-template/{{adapterPkg}}/src/catalog.ts`:

```ts
import {Catalog} from '@a2ui/web_core/v0_9';
import type {ReactComponentImplementation} from '@a2ui/react/v0_9';
import {CATALOG_ID} from './catalog-id';

// Empty-but-wired catalog. Register your component implementations (2nd arg) and
// local functions (3rd arg) here as you author them. Component and function
// schema format: the official A2UI v0.9 specification —
// https://a2ui.org/specification/v0_9/
export const CATALOG = new Catalog<ReactComponentImplementation>(CATALOG_ID, [], []);
```

- [ ] **Step 8: Write the barrel `index.ts`**

`adapter-template/{{adapterPkg}}/src/index.ts`:

```ts
export {CATALOG} from './catalog';
export {CATALOG_ID} from './catalog-id';
```

- [ ] **Step 9: Write the empty-`components/` marker**

`adapter-template/{{adapterPkg}}/src/components/README.md`:

```md
# components/

Add your catalog component implementations here, then register them in
`../catalog.ts` (and add their schemas to `../../catalogs/{{version}}/catalog.json`).
```

- [ ] **Step 10: Write the trimmed envelope smoke test**

`adapter-template/{{adapterPkg}}/src/catalog.test.ts` — drop the Text/Button/consoleLog assertions; assert the envelope wires up empty:

```ts
import {describe, it, expect} from 'vitest';
import {CATALOG, CATALOG_ID} from './index';

describe('CATALOG', () => {
  it('carries the catalog id', () => {
    expect(CATALOG.id).toBe(CATALOG_ID);
  });

  it('starts with no components', () => {
    expect(CATALOG.components.size).toBe(0);
  });

  it('exposes a function invoker', () => {
    expect(typeof CATALOG.invoker).toBe('function');
  });
});
```

> Note: `Catalog.components` is exposed as a Map in `@a2ui/web_core` (the reference test calls `.has(...)` on it). If `.size` is not present on the materialized build, switch to `.has('x')` → `false`; this test only runs after materialization in 3.4.

- [ ] **Step 11: Write the tokenized per-package README (mechanical carry; setup prose deferred to 3.2)**

`adapter-template/{{adapterPkg}}/README.md` — drop the 🚧-skeleton/phase notes, tokenize identity, leave a 3.2 marker:

```md
# {{adapterPkg}}

The publishable A2UI catalog/adapter mapping A2UI components to {{Library}}
React wrappers, built over [`@a2ui/react`](https://www.npmjs.com/package/@a2ui/react).

<!-- setup requirements & usage prose: authored in 3.2 -->

## Commands

```bash
yarn workspace {{adapterPkg}} run build      # tsc → dist/
yarn workspace {{adapterPkg}} run typecheck
yarn workspace {{adapterPkg}} run test       # vitest
```
```

- [ ] **Step 12: Verify the adapter scaffold carries no domain content or stray identity**

Run: `grep -rni "primer\|button\|console-log\|consolelog\|retz8\|a2ui-github" "adapter-template/{{adapterPkg}}"`
Expected: no output. (`Text` may appear only inside the word "context"; if `grep -rniw "text"` returns hits, inspect them.)

- [ ] **Step 13: Commit**

```bash
git add adapter-template
git commit -m "feat(phase-3): empty-but-wired adapter scaffold in adapter-template"
```

---

## Task 4: Client package in the template (empty-but-wired)

Create the client with the app shell stripped to a theme-provider seam, an empty `fixtures/` set, a `TestSpace` that tolerates zero fixtures, the surviving transport/app-shell smoke tests, and Playwright scaffolding with a non-screenshot smoke. Deliverable: the client scaffold with no fixtures, no Primer API shape, and a green-able smoke layer (proven in 3.4).

**Files:**
- Create: `adapter-template/client/package.json`, `…/index.html`, `…/tsconfig.json`, `…/vite.config.ts`, `…/playwright.config.ts`, `…/README.md`
- Create: `…/src/main.tsx`, `…/src/App.tsx`, `…/src/setupTests.ts`, `…/src/vite-env.d.ts`
- Create: `…/src/a2a/createA2AActionHandler.ts`, `…/src/a2a/messages.ts`
- Create: `…/src/test-space/TestSpace.tsx`, `…/src/test-space/FixtureView.tsx`
- Create: `…/src/fixtures/types.ts`, `…/src/fixtures/index.ts`, `…/src/fixtures/README.md` (empty-dir marker)
- Create: `…/src/App.test.tsx`, `…/tests/a2a-sdk.smoke.test.ts`, `…/tests/a2a.test.ts`
- Create: `…/e2e/smoke.spec.ts`

**Interfaces:**
- Consumes: `{{adapterPkg}}` exporting `CATALOG` (Task 3).
- Produces: the app shell + transport handler; nothing downstream in 3.1 consumes it.

- [ ] **Step 1: Create the directory tree**

Run: `mkdir -p adapter-template/client/src/a2a adapter-template/client/src/test-space adapter-template/client/src/fixtures adapter-template/client/tests adapter-template/client/e2e`
Expected: no output.

- [ ] **Step 2: Write the tokenized `package.json`**

`adapter-template/client/package.json` — copy from `client/package.json`, replacing `@primer/react` with `{{libraryPkg}}` and `primer-a2ui-adapter` with `{{adapterPkg}}` (name stays the literal `client`):

```json
{
  "name": "client",
  "private": true,
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "tsc --noEmit && vite build",
    "typecheck": "tsc --noEmit",
    "test": "vitest run",
    "preview": "vite preview",
    "test:e2e": "playwright test"
  },
  "dependencies": {
    "@a2a-js/sdk": "^0.3.13",
    "@a2ui/react": "^0.10.1",
    "@a2ui/web_core": "^0.10.1",
    "{{libraryPkg}}": "^38.28.0",
    "{{adapterPkg}}": "workspace:^",
    "react": "^19.2.7",
    "react-dom": "^19.2.7",
    "react-is": "^19.2.0",
    "zod": "^3.25.76"
  },
  "devDependencies": {
    "@playwright/test": "^1.61.0",
    "@testing-library/dom": "^10.4.1",
    "@testing-library/jest-dom": "^6.9.1",
    "@testing-library/react": "^16.3.2",
    "@types/react": "^19.2.17",
    "@types/react-dom": "^19.2.3",
    "@types/react-is": "^19.0.0",
    "@vitejs/plugin-react": "^6.0.2",
    "jsdom": "^29.1.1",
    "typescript": "~5.9.3",
    "vite": "^8.0.16",
    "vitest": "^4.1.9"
  }
}
```

- [ ] **Step 3: Copy the literal-carry files verbatim**

These carry no library/repo identity:

```bash
cp client/src/main.tsx adapter-template/client/src/main.tsx
cp client/src/setupTests.ts adapter-template/client/src/setupTests.ts
cp client/src/vite-env.d.ts adapter-template/client/src/vite-env.d.ts
cp client/tsconfig.json adapter-template/client/tsconfig.json
cp client/playwright.config.ts adapter-template/client/playwright.config.ts
cp client/src/a2a/createA2AActionHandler.ts adapter-template/client/src/a2a/createA2AActionHandler.ts
cp client/src/fixtures/types.ts adapter-template/client/src/fixtures/types.ts
cp client/tests/a2a-sdk.smoke.test.ts adapter-template/client/tests/a2a-sdk.smoke.test.ts
```

- [ ] **Step 4: Write the neutralized `index.html`**

`adapter-template/client/index.html` — generic title:

```html
<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>A2UI client</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>
```

- [ ] **Step 5: Write `vite.config.ts` with the Primer CSS-inline stripped to a seam**

`adapter-template/client/vite.config.ts`:

```ts
import react from '@vitejs/plugin-react';
import {configDefaults, defineConfig} from 'vitest/config';

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./src/setupTests.ts'],
    exclude: [...configDefaults.exclude, 'e2e/**'],
    // If your design system ships CSS imports that Vite externalizes under
    // jsdom (tests fail loading its CSS), inline it here:
    //   server: {deps: {inline: ['your-design-system']}}
  },
});
```

- [ ] **Step 6: Write `App.tsx` with the provider stripped to a seam**

`adapter-template/client/src/App.tsx`:

```tsx
import {useCallback} from 'react';
import type {ActionListener, A2uiMessage} from '@a2ui/web_core/v0_9';
import {createA2AActionHandler} from './a2a/createA2AActionHandler';
import {TestSpace} from './test-space/TestSpace';

const SERVER_URL = import.meta.env.VITE_A2A_SERVER_URL ?? 'http://localhost:10002';

export function App() {
  const makeActionHandler = useCallback(
    (apply: (messages: A2uiMessage[]) => void): ActionListener =>
      createA2AActionHandler({apply, serverUrl: SERVER_URL}),
    [],
  );

  // Wrap <TestSpace/> in your design system's theme/style provider here — e.g.
  // Primer <ThemeProvider><BaseStyles>, MUI <ThemeProvider>, Chakra
  // <ChakraProvider>. See the client README for setup requirements.
  return <TestSpace makeActionHandler={makeActionHandler} />;
}
```

- [ ] **Step 7: Write `messages.ts` with phase-flavored comments neutralized**

`adapter-template/client/src/a2a/messages.ts` — copy from `client/src/a2a/messages.ts`, keeping all code; reword the two doc comments to drop phase references and become adopter guidance:
- The `extractA2uiMessages` doc paragraph "Phase 2's deterministic server returns a single completed Task …" → "The deterministic server returns a single completed Task whose status message carries the A2UI as version-tagged DataParts. A direct agent Message reply is also supported."
- The trailing `TODO(phase-6): streaming …` comment → "When your agent generates progressively, call this per chunk over `sendMessageStream`'s stream events (Task | TaskStatusUpdateEvent) instead of against one terminal Task."

- [ ] **Step 8: Write `FixtureView.tsx` with the tokenized catalog import**

`adapter-template/client/src/test-space/FixtureView.tsx` — copy from `client/src/test-space/FixtureView.tsx`, changing only the adapter import:
- `import {CATALOG} from 'primer-a2ui-adapter';` → `import {CATALOG} from '{{adapterPkg}}';`

(The rest — `MessageProcessor`, `A2uiSurface`, surface subscriptions — is unchanged plumbing.)

- [ ] **Step 9: Write `fixtures/types.ts` is already copied; write the empty `fixtures/index.ts`**

`adapter-template/client/src/fixtures/index.ts`:

```ts
import type {Fixture} from './types';

export type {Fixture} from './types';

// Add your canned A2UI fixtures here as you author components, e.g.:
//   import {myFixture} from './my-fixture';
//   export const FIXTURES: Fixture[] = [myFixture];
export const FIXTURES: Fixture[] = [];

export function getFixture(name: string | null): Fixture | undefined {
  return FIXTURES.find(f => f.name === name) ?? FIXTURES[0];
}
```

- [ ] **Step 10: Write the empty-`fixtures/` marker**

`adapter-template/client/src/fixtures/README.md`:

```md
# fixtures/

Add canned A2UI message fixtures here (one per file), then register them in
`./index.ts`. Each fixture is known-good A2UI fed to the test space as a dev
oracle — no agent needed.
```

- [ ] **Step 11: Write `TestSpace.tsx` tolerant of zero fixtures**

`adapter-template/client/src/test-space/TestSpace.tsx` — the reference assumes ≥1 fixture (`FIXTURES[0].name`, `getFixture(...).name`); guard the empty case so the shell renders without a fixture:

```tsx
import {useState} from 'react';
import type {ActionListener, A2uiMessage} from '@a2ui/web_core/v0_9';
import {FIXTURES, getFixture} from '../fixtures';
import {FixtureView} from './FixtureView';

function readFixtureFromUrl(): string | undefined {
  if (typeof window === 'undefined') return FIXTURES[0]?.name;
  const param = new URLSearchParams(window.location.search).get('fixture');
  return getFixture(param)?.name;
}

export function TestSpace({
  makeActionHandler,
}: {
  makeActionHandler?: (apply: (messages: A2uiMessage[]) => void) => ActionListener;
} = {}) {
  const [selected, setSelected] = useState(readFixtureFromUrl);

  const onSelect = (name: string) => {
    setSelected(name);
    if (typeof window !== 'undefined') {
      const url = new URL(window.location.href);
      url.searchParams.set('fixture', name);
      window.history.replaceState({}, '', url);
    }
  };

  const fixture = getFixture(selected ?? null);

  return (
    <main>
      <label>
        Fixture:{' '}
        <select
          data-testid="fixture-select"
          value={fixture?.name ?? ''}
          onChange={e => onSelect(e.target.value)}
        >
          {FIXTURES.map(f => (
            <option key={f.name} value={f.name}>
              {f.name}
            </option>
          ))}
        </select>
      </label>

      {fixture ? (
        <FixtureView key={fixture.name} fixture={fixture} makeActionHandler={makeActionHandler} />
      ) : (
        <p data-testid="no-fixtures">
          No fixtures yet — add one in <code>src/fixtures/</code>.
        </p>
      )}
    </main>
  );
}
```

- [ ] **Step 12: Write the App-shell smoke test**

`adapter-template/client/src/App.test.tsx` — copy from `client/src/App.test.tsx` unchanged (it asserts only the `fixture-select` mount, which holds with empty fixtures):

```tsx
import {describe, it, expect, afterEach} from 'vitest';
import {render, screen, cleanup} from '@testing-library/react';
import {App} from './App';

afterEach(cleanup);

describe('App', () => {
  it('mounts the test space with a fixture selector', () => {
    render(<App />);
    expect(screen.getByTestId('fixture-select')).toBeInTheDocument();
  });
});
```

- [ ] **Step 13: Write the scrubbed transport test `a2a.test.ts`**

`adapter-template/client/tests/a2a.test.ts` — copy from `client/tests/a2a.test.ts`, with one change: in the `createA2AActionHandler` describe block, replace the `component: 'Text'` `updateComponents` mock payload with a component-free `updateDataModel` payload, so no catalog literal lurks. The block's `a2uiMsg` and the `apply` assertion become:

```ts
  const a2uiMsg = {
    version: 'v0.9',
    updateDataModel: {surfaceId: 'button-event', path: '/received', value: true},
  };
```

(`okResponse` already wraps `a2uiMsg`; `expect(apply).toHaveBeenCalledWith([a2uiMsg])` then asserts the component-free payload. Every other describe block — `buildActionMessageParams`, `extractA2uiMessages`, `agentCardUrl` — is copied unchanged; they already use `updateDataModel` or pure transport data.)

- [ ] **Step 14: Write the Playwright non-screenshot smoke**

`adapter-template/client/e2e/smoke.spec.ts`:

```ts
import {test, expect} from '@playwright/test';

// Non-screenshot smoke: the app shell mounts. Add per-component visual baselines
// with expect(page).toHaveScreenshot() as you author components.
test('app shell mounts with a fixture selector', async ({page}) => {
  await page.goto('/');
  await expect(page.getByTestId('fixture-select')).toBeVisible();
});
```

- [ ] **Step 15: Write the tokenized client README (mechanical carry; setup prose deferred to 3.2)**

`adapter-template/client/README.md` — keep the generic harness/dev-tunnel/manual-verify structure but drop fixture/component specifics and tokenize identity. Author a trimmed version:

```md
# client

A thin React + {{Library}} app that renders A2UI surfaces through
[`{{adapterPkg}}`](../{{adapterPkg}}) and round-trips `event` actions to the
deterministic A2A server in [`agent/`](../agent).

The fixture-driven test space is a **dev oracle**: known-good A2UI loaded locally,
so no LLM is involved during development. `functionCall` actions run locally;
`event` actions go over A2A to the server and the response feeds back into the
same processor to re-render.

<!-- setup requirements (theme provider, vite CSS-inline) & full usage prose:
     authored in 3.2 -->

## Commands

```bash
yarn workspace client run dev        # vite dev server
yarn workspace client run build
yarn workspace client run typecheck
yarn workspace client run test       # vitest (jsdom + RTL)
yarn workspace client run test:e2e   # playwright smoke
```

## A2A server URL

The client sends `event` actions to `VITE_A2A_SERVER_URL` (default
`http://localhost:10002`).
```

- [ ] **Step 16: Verify the client scaffold carries no domain content or stray identity**

Run: `grep -rni "primer\|button-\|console-log\|consolelog\|retz8\|a2ui-github\|Hello from" adapter-template/client`
Expected: no output.

- [ ] **Step 17: Commit**

```bash
git add adapter-template
git commit -m "feat(phase-3): empty-but-wired client scaffold in adapter-template"
```

---

## Task 5: Agent package in the template (empty-but-wired)

Create the deterministic-agent scaffold: server/executor/responses plumbing with a component-free proof-of-receipt stub, empty fixtures, the tokenized uv-project name, and the trimmed pytest smoke layer. Deliverable: the agent scaffold with no canned responses and no repo/phase identity.

**Files:**
- Create: `adapter-template/agent/pyproject.toml`, `adapter-template/agent/.python-version`, `adapter-template/agent/README.md`
- Create: `adapter-template/agent/deterministic_agent/__init__.py`, `…/__main__.py`, `…/server.py`, `…/executor.py`, `…/responses.py`, `…/catalog.py`
- Create: `adapter-template/agent/deterministic_agent/fixtures/README.md` (empty-dir marker)
- Create: `adapter-template/agent/tests/__init__.py`, `…/helpers.py`, `…/test_smoke.py`, `…/test_server.py`, `…/test_catalog.py`, `…/test_executor.py`

**Interfaces:**
- Consumes: the catalog.json path under `{{adapterPkg}}/catalogs/{{version}}/` (Task 3).
- Produces: `build_response(action) -> list[dict]` returning a component-free `updateDataModel` proof-of-receipt; `DeterministicAgentExecutor`; `build_app`/`build_agent_card`.

- [ ] **Step 1: Create the directory tree**

Run: `mkdir -p adapter-template/agent/deterministic_agent/fixtures adapter-template/agent/tests`
Expected: no output.

- [ ] **Step 2: Copy the literal-carry files verbatim**

```bash
cp agent/.python-version adapter-template/agent/.python-version
cp agent/deterministic_agent/__init__.py adapter-template/agent/deterministic_agent/__init__.py
cp agent/deterministic_agent/__main__.py adapter-template/agent/deterministic_agent/__main__.py
cp agent/deterministic_agent/server.py adapter-template/agent/deterministic_agent/server.py
cp agent/deterministic_agent/executor.py adapter-template/agent/deterministic_agent/executor.py
cp agent/tests/__init__.py adapter-template/agent/tests/__init__.py
cp agent/tests/helpers.py adapter-template/agent/tests/helpers.py
cp agent/tests/test_smoke.py adapter-template/agent/tests/test_smoke.py
```

- [ ] **Step 3: Write the tokenized `pyproject.toml`**

`adapter-template/agent/pyproject.toml` — `name` → `{{agentPkg}}`, description neutralized (no repo, no phase):

```toml
[project]
name = "{{agentPkg}}"
version = "0.1.0"
description = "Deterministic A2A server — a token-free local A2UI round-trip harness."
readme = "README.md"
requires-python = ">=3.14"
dependencies = [
    "a2ui-agent-sdk>=0.2.4,<0.3.0",
    "a2a-sdk[http-server]>=0.3.0,<0.4.0",
    "uvicorn>=0.40.0",
    "click>=8.1.8",
]

[tool.uv]
package = false

[dependency-groups]
dev = [
    "pytest>=9.0.0",
    "pytest-asyncio>=1.3.0",
]

[tool.pytest.ini_options]
asyncio_mode = "auto"
pythonpath = ["."]
testpaths = ["tests"]
filterwarnings = [
    # Third-party: starlette's TestClient deprecates its httpx backend. Not our code.
    "ignore:Using `httpx` with `starlette.testclient` is deprecated",
]
```

- [ ] **Step 4: Neutralize phase/domain wording in `server.py`**

In `adapter-template/agent/deterministic_agent/server.py` (copied in Step 2), edit the agent-card builder only:
- `description="Deterministic Phase 2 A2A server returning canned A2UI (no LLM)."` → `description="Deterministic A2A server returning a component-free acknowledgement (no LLM)."`
- the skill: `description="Returns a fixed, catalog-conformant A2UI surface for known UI events."` → `description="Acknowledges incoming UI events (stub — replace with your canned responses)."`
- the skill `examples=["submit"]` → `examples=[]`

(Everything else — CORS regex, ports, extension wiring, `base_url` handling — is unchanged plumbing.)

- [ ] **Step 5: Write the tokenized `catalog.py`**

`adapter-template/agent/deterministic_agent/catalog.py` — copy from `agent/deterministic_agent/catalog.py` with the relpath and assertion tokenized and the label already neutral (from Task 1):
- `_CATALOG_RELPATH = ("primer-a2ui-adapter", "catalogs", "v0.9.1", "catalog.json")` → `_CATALOG_RELPATH = ("{{adapterPkg}}", "catalogs", "{{version}}", "catalog.json")`
- the `_repo_root()` assertion `(root / "primer-a2ui-adapter").is_dir()` and its message → `(root / "{{adapterPkg}}").is_dir()`, message `f"expected the monorepo root containing {{adapterPkg}} at {root}"`
- `CatalogConfig.from_path("adapter", str(catalog_json_path()))` — keep as-is (neutralized in Task 1).

(`validate_payload` is kept verbatim — it is wired plumbing the adopter uses for conformance once they have components, even though nothing in the empty template calls it.)

- [ ] **Step 6: Write the stubbed `responses.py` (component-free proof-of-receipt)**

`adapter-template/agent/deterministic_agent/responses.py`:

```python
"""Maps an incoming A2UI action to a canned response, echoing the surfaceId.

Empty-but-wired: there are no canned responses yet. Add your event fixtures to
`_EVENT_FIXTURES` (event name -> fixture filename in `fixtures/`) and drop the
fixture JSON alongside. Until then every action gets a component-free
proof-of-receipt, so the round-trip is observable without a catalog component.
"""

from __future__ import annotations

import json
from pathlib import Path

_FIXTURES_DIR = Path(__file__).resolve().parent / "fixtures"
# Map event names to fixture filenames here, e.g. {"submit": "submit.json"}.
_EVENT_FIXTURES: dict[str, str] = {}
# The operation key whose object carries the surfaceId we stamp.
_OPERATION_KEYS = ("updateComponents", "updateDataModel", "createSurface")


def _load_fixture(name: str) -> list[dict]:
    with open(_FIXTURES_DIR / name, encoding="utf-8") as f:
        return json.load(f)


def _stamp_surface(messages: list[dict], surface_id: str) -> list[dict]:
    for msg in messages:
        for key in _OPERATION_KEYS:
            if key in msg:
                msg[key]["surfaceId"] = surface_id
    return messages


def _proof_of_receipt(surface_id: str) -> list[dict]:
    # Component-free acknowledgement: proves the event reached the server and a
    # response round-tripped, without referencing any catalog component.
    return [
        {
            "version": "v0.9",
            "updateDataModel": {"surfaceId": surface_id, "path": "/received", "value": True},
        }
    ]


def build_response(action: dict) -> list[dict]:
    name = action.get("name", "")
    surface_id = action.get("surfaceId", "")
    fixture = _EVENT_FIXTURES.get(name)
    if fixture is None:
        return _proof_of_receipt(surface_id)
    return _stamp_surface(_load_fixture(fixture), surface_id)
```

- [ ] **Step 7: Write the empty-`fixtures/` marker**

`adapter-template/agent/deterministic_agent/fixtures/README.md`:

```md
# fixtures/

Add canned A2UI response fixtures here (one JSON file per event), then map each
event name to its filename in `../responses.py` (`_EVENT_FIXTURES`). The
surfaceId is stamped onto each operation at response time.
```

- [ ] **Step 8: Write the proof-of-receipt executor smoke test**

`adapter-template/agent/tests/test_executor.py` — replace the submit/Text-fallback tests with one proof-of-receipt assertion:

```python
from tests.helpers import run_executor


async def test_executor_echoes_component_free_proof_of_receipt():
    payload = await run_executor({"name": "anything", "surfaceId": "s1", "context": {}})
    assert payload == [
        {
            "version": "v0.9",
            "updateDataModel": {"surfaceId": "s1", "path": "/received", "value": True},
        }
    ]
```

- [ ] **Step 9: Write the neutralized `test_server.py`**

`adapter-template/agent/tests/test_server.py` — copy from `agent/tests/test_server.py`, keeping the port/CORS/streaming-extension/base-url assertions verbatim. The card-content assertion `test_agent_card_advertises_streaming_and_the_a2ui_v09_extension` references no domain string, so it copies unchanged; keep `supported_catalog_ids()` usage as-is.

- [ ] **Step 10: Write the trimmed `test_catalog.py`**

`adapter-template/agent/tests/test_catalog.py` — keep only the path/id/`supported_catalog_ids` plumbing assertions; drop the Text validate/reject cases:

```python
from deterministic_agent.catalog import (
    catalog_json_path,
    get_catalog,
    supported_catalog_ids,
)


def test_catalog_path_points_at_sibling_package():
    path = catalog_json_path()
    assert path.is_file()
    assert path.parts[-3:] == ("catalogs", "{{version}}", "catalog.json")


def test_catalog_id_is_a_hosted_url():
    cid = get_catalog().catalog_id
    assert cid.startswith("https://github.com/")
    assert cid.endswith("catalogs/{{version}}/catalog.json")
    assert supported_catalog_ids() == [cid]
```

- [ ] **Step 11: Write the tokenized agent README (mechanical carry; setup prose deferred to 3.2)**

`adapter-template/agent/README.md` — drop the reserved-`a2ui_github_agent`-slot line and the Phase 2 references; keep the generic uv/test/run structure:

```md
# agent/ — Deterministic A2A server

uv-managed Python project (outside the yarn workspaces). Hosts
`deterministic_agent/`: a canned-response A2A server that closes the event
round-trip without an LLM — a token-free local test harness. Your real domain
agent lives in a separate module slot alongside it.

<!-- setup & usage prose: authored in 3.2 -->

## Setup

```bash
uv sync
```

## Test

```bash
uv run pytest
```

## Run the server

```bash
uv run python -m deterministic_agent --host localhost --port 10002
```
```

- [ ] **Step 12: Verify the agent scaffold carries no domain content or stray identity**

Run: `grep -rni "primer\|a2ui-github\|retz8\|phase 2\|phase-2\|submit\|✅" adapter-template/agent`
Expected: no output.

- [ ] **Step 13: Verify the proof-of-receipt stub is wired and fixtures are empty**

Run: `grep -n "_EVENT_FIXTURES: dict\[str, str\] = {}" adapter-template/agent/deterministic_agent/responses.py && ls adapter-template/agent/deterministic_agent/fixtures`
Expected: the empty-dict line prints, and `fixtures/` lists only `README.md` (no `submit.json`).

- [ ] **Step 14: Commit**

```bash
git add adapter-template
git commit -m "feat(phase-3): empty-but-wired deterministic-agent scaffold in adapter-template"
```

---

## Task 6: Structural agnosticism self-check

A final 3.1-level structural gate over the whole `adapter-template/` tree: no leftover library/repo/domain identity outside placeholders, no protocol token confusion, and the manifest is structurally complete. This is *not* the 3.4 green bar (no materialize/build/test runs here) — it is the "did the extraction leave anything Primer-shaped" sweep.

**Files:**
- No new files; inspection + a final commit only.

- [ ] **Step 1: Sweep for hardcoded library/repo/domain identifiers outside placeholders**

Run: `grep -rni "primer\|retz8\|a2ui-github\|\bbutton\b\|console-log\|consolelog\|deterministic phase" adapter-template | grep -v "{{"`
Expected: no output. Investigate any hit — it is either a token that should be `{{...}}` or domain content that should have been stripped. (`deterministic_agent` is the allowed frozen module name; it will not match these patterns.)

- [ ] **Step 2: Confirm the protocol forms stayed literal, not tokenized**

Run: `grep -rn "{{version}}" adapter-template | grep -E "v0_9|version=|VERSION_0_9"`
Expected: no output (no `{{version}}` ever sits where a protocol form belongs).

Run: `grep -rn "v0_9\|VERSION_0_9" adapter-template`
Expected: matches only in `client/src/**` imports, `agent/deterministic_agent/server.py`, and `agent/deterministic_agent/catalog.py` — all literal.

- [ ] **Step 3: Confirm every token in the set is present and no unknown token leaked**

Run: `grep -rho "{{[a-zA-Z]*}}" adapter-template | sort -u`
Expected exactly these lines: `{{Library}}`, `{{adapterPkg}}`, `{{agentPkg}}`, `{{libraryPkg}}`, `{{repoSlug}}`, `{{version}}`. Any other token is a bug.

- [ ] **Step 4: Confirm the token-named adapter directory and empty dirs exist with markers**

Run: `ls -d "adapter-template/{{adapterPkg}}/src/components" adapter-template/client/src/fixtures adapter-template/agent/deterministic_agent/fixtures && find "adapter-template/{{adapterPkg}}/src/components" adapter-template/client/src/fixtures adapter-template/agent/deterministic_agent/fixtures -name README.md`
Expected: the three directories list, and a `README.md` marker is found in each.

- [ ] **Step 5: Confirm no stripped domain artifacts were copied in**

Run: `find adapter-template -name "*.tsx" -path "*components*" -o -name "button*" -o -name "text*" -o -name "submit.json" -o -name "visual.spec.ts" -o -name "*-snapshots*"`
Expected: no output (no component sources, no fixtures, no visual baselines).

- [ ] **Step 6: Commit the self-check checkpoint**

```bash
git commit --allow-empty -m "chore(phase-3): structural agnosticism self-check for adapter-template"
```

---

## Self-Review notes (coverage map spec → tasks)

- Spec §1 token set → Tasks 2–5 apply all six; Task 6 Step 3 enforces the exact set.
- Spec §2 frozen literals / v0.9 pin → Global Constraints + Task 6 Step 2.
- Spec §3 neutralized identifiers, swept in both → Task 1 (reference) + Tasks 3–5 (template inherit `CATALOG`/`CATALOG_ID`/`from_path("adapter")`).
- Spec §4 empty catalog envelope + spec-ref comment in `catalog.ts`, no `$comment` → Task 3 Steps 5–7.
- Spec §5 component-free proof-of-receipt + emptied machinery + agent identity → Task 5 Steps 3–8.
- Spec §6 catalog-id URL decomposition + reframed TODO → Task 3 Steps 5–6.
- Spec §7 client seams (provider, vite inline) + `{{libraryPkg}}` only in package.json → Task 4 Steps 5–6, plus the adapter vitest inline in Task 3 Step 4.
- Spec §8 test survival (kept / scrubbed / trimmed / replaced / stripped) → Tasks 3, 4, 5 surviving tests; stripped tests simply never copied.
- Spec §9 Playwright scaffolding + non-screenshot smoke, no PNGs → Task 4 Steps 3 (config), 14 (smoke).
- Spec §10 marker conventions + empty-dir markers + neutral `index.html` title → Task 3 Step 9, Task 4 Steps 4 & 10, Task 5 Step 7.
- Spec §11 README ownership split → Tasks 3/4/5 carry tokenized per-package READMEs with a `<!-- … 3.2 -->` marker; root README/SPEC/CLAUDE untouched.
- Spec Open item (empty-catalog loader acceptance) → carried as a note on Task 3 Step 10; resolved when 3.4 materializes and runs the loader.
