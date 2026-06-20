# Task 2.1 — Adapter catalog foundation + `Text` Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Stand up `PRIMER_CATALOG` from scratch in `primer-a2ui-adapter` and carry one leaf component, `Text`, end-to-end through both schema representations (runtime zod + declarative `catalog.json`) with a parity test, plus the registered `consoleLog` function.

**Architecture:** Build a real `Catalog<ReactComponentImplementation>` over `@a2ui/web_core/v0_9`'s `CommonSchemas` (NOT over `basicCatalog`). Each component is authored as a presentational Primer wrapper (plain props) wired into the catalog via the generic binder `createComponentImplementation`. The component is described twice — runtime zod (`ComponentApi`) and hand-authored `catalog.json` — kept in lockstep by a structural parity test (the zod→`catalog.json` generator is deferred to Phase 3).

**Tech Stack:** TypeScript (ESM), zod v3, `@a2ui/web_core@^0.10.1` + `@a2ui/react@^0.10.1` (both via the `/v0_9` subpath), `@primer/react@^38`, React 19, Vitest + jsdom + Testing Library, `tsc` build.

## Global Constraints

- **Protocol surface only via `/v0_9` subpath:** import from `@a2ui/web_core/v0_9` and `@a2ui/react/v0_9`. Never the bare (v0.8) entry.
- **Never redefine shared A2UI primitives:** compose `CommonSchemas` in zod; `$ref` the hosted `common_types.json` in `catalog.json`. Hosted base URL: `https://a2ui.org/specification/v0_9/common_types.json`.
- **From scratch, not over `basicCatalog`:** `basicCatalog` is reference-only; do not compose on it or inherit its commons.
- **Strict Primer translation:** a component's schema carries exactly its real Primer prop surface (plus the synthetic `text` content prop). Do NOT add `accessibility` or a layout `weight` base just because the basic catalog does. `ComponentApi.schema` is props-only — it MUST NOT include `component` or `id` (the framework owns those).
- **Closure:** zod schemas end with `.strict()`; `catalog.json` components/functions use `unevaluatedProperties: false`.
- **`Text` prop surface:** `{ text (req), as?, size?, weight?, whiteSpace? }`. `weight` is Primer's **font** weight (NOT renamed). `as` is a local curated `z.enum`.
- **Versions (peerDeps):** `@a2ui/react ^0.10.1`, `@a2ui/web_core ^0.10.1`, `@primer/react ^38.28.0`, `react ^19.2.7`, `react-dom ^19.2.7`, `zod ^3.25.76`.
- **Commits:** conventional, `<type>(phase-2): …`. This task is implementation code only — never touch `_dev/`.
- **Run commands** from the repo root via `yarn workspace primer-a2ui-adapter <script>` (Yarn 4 workspace).

---

### Task 1: Package setup — deps, peer deps, jsdom test config

Configure the package so React/Primer/zod code compiles and a Testing-Library + jsdom render test can run. No product code yet; the deliverable is that the existing suite stays green under the new config.

**Files:**
- Modify: `primer-a2ui-adapter/package.json`
- Modify: `primer-a2ui-adapter/tsconfig.json`
- Modify: `primer-a2ui-adapter/vitest.config.ts`
- Create: `primer-a2ui-adapter/vitest.setup.ts`

**Interfaces:**
- Consumes: nothing.
- Produces: a jsdom Vitest environment with `@testing-library/jest-dom` matchers; peerDeps declared; `.test.tsx` excluded from the `tsc` build.

- [ ] **Step 1: Add peer deps + dev deps and align Vitest to v4**

In `primer-a2ui-adapter/package.json`, add a `peerDependencies` block and extend `devDependencies`. Final relevant sections:

```json
  "peerDependencies": {
    "@a2ui/react": "^0.10.1",
    "@a2ui/web_core": "^0.10.1",
    "@primer/react": "^38.28.0",
    "react": "^19.2.7",
    "react-dom": "^19.2.7",
    "zod": "^3.25.76"
  },
  "devDependencies": {
    "@a2ui/react": "^0.10.1",
    "@a2ui/web_core": "^0.10.1",
    "@primer/react": "^38.28.0",
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
```

- [ ] **Step 2: Exclude `.test.tsx` from the build**

In `primer-a2ui-adapter/tsconfig.json`, extend `exclude` so test files (now including `.tsx`) are not emitted:

```json
  "exclude": ["dist", "**/*.test.ts", "**/*.test.tsx"]
```

(The base `tsconfig.base.json` already sets `"jsx": "react-jsx"` and DOM libs — no other tsconfig change is needed.)

- [ ] **Step 3: Switch Vitest to jsdom + React plugin + jest-dom setup**

Replace `primer-a2ui-adapter/vitest.config.ts` with:

```ts
import {defineConfig} from 'vitest/config';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    setupFiles: ['./vitest.setup.ts'],
  },
});
```

Create `primer-a2ui-adapter/vitest.setup.ts`:

```ts
import '@testing-library/jest-dom/vitest';
```

- [ ] **Step 4: Install**

Run: `yarn install`
Expected: completes without errors; lockfile updates.

- [ ] **Step 5: Verify the existing suite + build still pass under the new config**

Run: `yarn workspace primer-a2ui-adapter test`
Expected: PASS — the existing `catalog.test.ts` smoke assertions still pass (the placeholder `PRIMER_CATALOG` is unchanged at this point).

Run: `yarn workspace primer-a2ui-adapter build`
Expected: PASS — `tsc` emits `dist/` with no errors.

- [ ] **Step 6: Commit**

```bash
git add primer-a2ui-adapter/package.json primer-a2ui-adapter/tsconfig.json primer-a2ui-adapter/vitest.config.ts primer-a2ui-adapter/vitest.setup.ts ../yarn.lock
git commit -m "chore(phase-2): set up React/Primer deps and jsdom test config in adapter"
```

---

### Task 2: `Text` zod schema (`TextApi`)

The runtime, render-time source of truth for `Text` — props-only, composing `CommonSchemas` for the content prop and local enums for the Primer styling props.

**Files:**
- Create: `primer-a2ui-adapter/src/components/text/text.schema.ts`
- Test: `primer-a2ui-adapter/src/components/text/text.schema.test.ts`

**Interfaces:**
- Consumes: `CommonSchemas.DynamicString` from `@a2ui/web_core/v0_9`.
- Produces: `TextApi: { name: 'Text'; schema: ZodObject }` and `type TextProps = z.infer<typeof TextApi.schema>`. Enum members — `as`: `['span','p','div','label','strong','em','small']`; `size`: `['small','medium','large']`; `weight`: `['light','normal','medium','semibold']`; `whiteSpace`: `['normal','nowrap','pre','pre-wrap','pre-line']`.

- [ ] **Step 1: Write the failing test**

Create `primer-a2ui-adapter/src/components/text/text.schema.test.ts`:

```ts
import {describe, it, expect} from 'vitest';
import {TextApi} from './text.schema';

describe('TextApi.schema', () => {
  it('accepts a minimal valid Text (text only)', () => {
    expect(TextApi.schema.safeParse({text: 'hi'}).success).toBe(true);
  });

  it('accepts all four styling props', () => {
    const result = TextApi.schema.safeParse({
      text: 'hi',
      as: 'p',
      size: 'large',
      weight: 'semibold',
      whiteSpace: 'nowrap',
    });
    expect(result.success).toBe(true);
  });

  it('requires text', () => {
    expect(TextApi.schema.safeParse({size: 'large'}).success).toBe(false);
  });

  it('rejects unknown props (strict)', () => {
    expect(TextApi.schema.safeParse({text: 'hi', color: 'red'}).success).toBe(false);
  });

  it('rejects out-of-enum values', () => {
    expect(TextApi.schema.safeParse({text: 'hi', size: 'huge'}).success).toBe(false);
  });

  it('accepts a data-binding for text (DynamicString)', () => {
    expect(TextApi.schema.safeParse({text: {path: '/title'}}).success).toBe(true);
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `yarn workspace primer-a2ui-adapter test text.schema`
Expected: FAIL — cannot resolve `./text.schema`.

- [ ] **Step 3: Write the schema**

Create `primer-a2ui-adapter/src/components/text/text.schema.ts`:

```ts
import {z} from 'zod';
import {CommonSchemas} from '@a2ui/web_core/v0_9';

/**
 * Runtime (zod) representation of Primer Text, props-only.
 *
 * - `text` is the synthetic content prop (Primer Text takes content via React
 *   children, but A2UI children are component IDs, so content needs a value prop).
 * - `as`/`size`/`weight`/`whiteSpace` are Primer's real prop surface, lifted verbatim.
 *   `weight` is Primer's FONT weight (the protocol's layout `weight` is intentionally
 *   not carried — see _dev/docs/a2ui-findings.md).
 * - `.strict()` forbids any prop outside this surface.
 */
export const TextApi = {
  name: 'Text',
  schema: z
    .object({
      text: CommonSchemas.DynamicString,
      as: z.enum(['span', 'p', 'div', 'label', 'strong', 'em', 'small']).optional(),
      size: z.enum(['small', 'medium', 'large']).optional(),
      weight: z.enum(['light', 'normal', 'medium', 'semibold']).optional(),
      whiteSpace: z.enum(['normal', 'nowrap', 'pre', 'pre-wrap', 'pre-line']).optional(),
    })
    .strict(),
} as const;

export type TextProps = z.infer<typeof TextApi.schema>;
```

- [ ] **Step 4: Run test to verify it passes**

Run: `yarn workspace primer-a2ui-adapter test text.schema`
Expected: PASS (6 tests).

- [ ] **Step 5: Commit**

```bash
git add primer-a2ui-adapter/src/components/text/text.schema.ts primer-a2ui-adapter/src/components/text/text.schema.test.ts
git commit -m "feat(phase-2): add Text zod schema composing CommonSchemas"
```

---

### Task 3: `TextView` presentational component + binder wiring + folder barrel

The Primer render and its generic-binder wiring. `TextView` is a pure-props React component (unit-testable directly); `TextComponent` wires it into the catalog. The folder `index.ts` is the controlled export surface — it exposes `TextComponent` + `TextApi`, not `TextView`.

**Files:**
- Create: `primer-a2ui-adapter/src/components/text/text.tsx`
- Create: `primer-a2ui-adapter/src/components/text/index.ts`
- Test: `primer-a2ui-adapter/src/components/text/text.test.tsx`

**Interfaces:**
- Consumes: `TextApi`, `TextProps` from `./text.schema`; `createComponentImplementation`, `type ReactComponentImplementation` from `@a2ui/react/v0_9`; `Text as PrimerText` from `@primer/react`.
- Produces: `TextComponent: ReactComponentImplementation` and (module-level, for the in-folder test) `TextView`. `index.ts` re-exports `TextComponent` and `TextApi` only. Primer `Text` renders `as` → the element tag, and emits `data-size` / `data-weight` / `data-white-space` attributes.

- [ ] **Step 1: Write the failing test**

Create `primer-a2ui-adapter/src/components/text/text.test.tsx`:

```tsx
import {describe, it, expect, afterEach} from 'vitest';
import {render, screen, cleanup} from '@testing-library/react';
import {TextView} from './text';

afterEach(cleanup);

describe('TextView', () => {
  it('renders the text content', () => {
    render(<TextView text="Hello world" />);
    expect(screen.getByText('Hello world')).toBeInTheDocument();
  });

  it('renders as a span by default', () => {
    render(<TextView text="Hi" />);
    expect(screen.getByText('Hi').tagName).toBe('SPAN');
  });

  it('honors the as prop', () => {
    render(<TextView text="Para" as="p" />);
    expect(screen.getByText('Para').tagName).toBe('P');
  });

  it('passes size/weight/whiteSpace to Primer as data-* attributes', () => {
    render(
      <TextView text="Styled" size="large" weight="semibold" whiteSpace="nowrap" />,
    );
    const el = screen.getByText('Styled');
    expect(el).toHaveAttribute('data-size', 'large');
    expect(el).toHaveAttribute('data-weight', 'semibold');
    expect(el).toHaveAttribute('data-white-space', 'nowrap');
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `yarn workspace primer-a2ui-adapter test text.test`
Expected: FAIL — cannot resolve `./text`.

- [ ] **Step 3: Write `TextView` + binder wiring**

Create `primer-a2ui-adapter/src/components/text/text.tsx`:

```tsx
import {Text as PrimerText} from '@primer/react';
import {createComponentImplementation} from '@a2ui/react/v0_9';
import {TextApi, type TextProps} from './text.schema';

/** Resolved props: `text` is a plain string after the binder resolves the DynamicString. */
type TextViewProps = Omit<TextProps, 'text'> & {text: string};

export function TextView({text, as, size, weight, whiteSpace}: TextViewProps) {
  return (
    <PrimerText as={as} size={size} weight={weight} whiteSpace={whiteSpace}>
      {text}
    </PrimerText>
  );
}

/** Catalog entry: the generic binder resolves props, then renders TextView. */
export const TextComponent = createComponentImplementation(TextApi, ({props}) => (
  <TextView
    text={props.text}
    as={props.as}
    size={props.size}
    weight={props.weight}
    whiteSpace={props.whiteSpace}
  />
));
```

- [ ] **Step 4: Create the folder barrel (controlled export surface)**

Create `primer-a2ui-adapter/src/components/text/index.ts`:

```ts
export {TextComponent} from './text';
export {TextApi} from './text.schema';
export type {TextProps} from './text.schema';
```

- [ ] **Step 5: Run test to verify it passes**

Run: `yarn workspace primer-a2ui-adapter test text.test`
Expected: PASS (4 tests).

(If Primer logs a missing-`ThemeProvider` warning, ignore it — these assertions do not depend on theme. Only wrap the render in `ThemeProvider`/`BaseStyles` if a hard error occurs.)

- [ ] **Step 6: Verify the build still compiles**

Run: `yarn workspace primer-a2ui-adapter build`
Expected: PASS — `text.tsx` and `index.ts` emit cleanly; `text.test.tsx` is excluded.

- [ ] **Step 7: Commit**

```bash
git add primer-a2ui-adapter/src/components/text/text.tsx primer-a2ui-adapter/src/components/text/index.ts primer-a2ui-adapter/src/components/text/text.test.tsx
git commit -m "feat(phase-2): add Primer TextView and generic-binder wiring"
```

---

### Task 4: `consoleLog` function

The local effect function registered in the catalog (first invoked by `Button` in 2.2/2.3). `returnType: void`; single `message` arg.

**Files:**
- Create: `primer-a2ui-adapter/src/functions/console-log.ts`
- Test: `primer-a2ui-adapter/src/functions/console-log.test.ts`

**Interfaces:**
- Consumes: `createFunctionImplementation` from `@a2ui/web_core/v0_9`; `z` from `zod`.
- Produces: `consoleLog: FunctionImplementation` with `name: 'consoleLog'`, `returnType: 'void'`, `schema: z.object({message: z.string()})`; `execute` calls `console.log('[A2UI]', message)`.

- [ ] **Step 1: Write the failing test**

Create `primer-a2ui-adapter/src/functions/console-log.test.ts`:

```ts
import {describe, it, expect, vi} from 'vitest';
import type {DataContext} from '@a2ui/web_core/v0_9';
import {consoleLog} from './console-log';

describe('consoleLog function', () => {
  it('declares its api', () => {
    expect(consoleLog.name).toBe('consoleLog');
    expect(consoleLog.returnType).toBe('void');
  });

  it('validates its args (message required)', () => {
    expect(consoleLog.schema.safeParse({message: 'hi'}).success).toBe(true);
    expect(consoleLog.schema.safeParse({}).success).toBe(false);
  });

  it('logs the message when executed', () => {
    const spy = vi.spyOn(console, 'log').mockImplementation(() => undefined);
    consoleLog.execute({message: 'hello'}, {} as DataContext);
    expect(spy).toHaveBeenCalledWith('[A2UI]', 'hello');
    spy.mockRestore();
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `yarn workspace primer-a2ui-adapter test console-log`
Expected: FAIL — cannot resolve `./console-log`.

- [ ] **Step 3: Write the function**

Create `primer-a2ui-adapter/src/functions/console-log.ts`:

```ts
import {z} from 'zod';
import {createFunctionImplementation} from '@a2ui/web_core/v0_9';

/**
 * A local client-side effect function. The Phase 2 functionCall path terminates here.
 * zod arg is the RESOLVED `message: string`; the catalog.json wire form types it as a
 * DynamicString (literal or binding) — see _dev/docs/a2ui-findings.md.
 */
export const consoleLog = createFunctionImplementation(
  {
    name: 'consoleLog',
    returnType: 'void',
    schema: z.object({message: z.string()}),
  },
  ({message}) => {
    console.log('[A2UI]', message);
  },
);
```

- [ ] **Step 4: Run test to verify it passes**

Run: `yarn workspace primer-a2ui-adapter test console-log`
Expected: PASS (3 tests).

- [ ] **Step 5: Commit**

```bash
git add primer-a2ui-adapter/src/functions/console-log.ts primer-a2ui-adapter/src/functions/console-log.test.ts
git commit -m "feat(phase-2): register consoleLog effect function"
```

---

### Task 5: Assemble `PRIMER_CATALOG`

Replace the placeholder with a real `Catalog` instance and update the smoke test to the real shape (its `components`/`functions` are `Map`s).

**Files:**
- Modify: `primer-a2ui-adapter/src/catalog.ts`
- Modify: `primer-a2ui-adapter/src/catalog.test.ts`

**Interfaces:**
- Consumes: `Catalog` (value/class) from `@a2ui/web_core/v0_9`; `type ReactComponentImplementation` from `@a2ui/react/v0_9` (it is NOT re-exported by web_core); `PRIMER_CATALOG_ID` from `./catalog-id`; `TextComponent` from `./components/text`; `consoleLog` from `./functions/console-log`.
- Produces: `PRIMER_CATALOG: Catalog<ReactComponentImplementation>` with `id === PRIMER_CATALOG_ID`, `components` keyed `'Text'`, `functions` keyed `'consoleLog'`. `src/index.ts` (barrel exporting `PRIMER_CATALOG`/`PRIMER_CATALOG_ID`) is unchanged and still valid.

- [ ] **Step 1: Rewrite the smoke test to the real Catalog shape**

Replace `primer-a2ui-adapter/src/catalog.test.ts` with:

```ts
import {describe, it, expect} from 'vitest';
import {PRIMER_CATALOG, PRIMER_CATALOG_ID} from './index';

describe('PRIMER_CATALOG', () => {
  it('carries the catalog id', () => {
    expect(PRIMER_CATALOG.id).toBe(PRIMER_CATALOG_ID);
  });

  it('registers the Text component', () => {
    expect(PRIMER_CATALOG.components.has('Text')).toBe(true);
  });

  it('registers the consoleLog function', () => {
    expect(PRIMER_CATALOG.functions.has('consoleLog')).toBe(true);
  });

  it('exposes a function invoker', () => {
    expect(typeof PRIMER_CATALOG.invoker).toBe('function');
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `yarn workspace primer-a2ui-adapter test catalog.test`
Expected: FAIL — the placeholder `PRIMER_CATALOG` has no `.components.has` (it is a plain object).

- [ ] **Step 3: Build the real catalog**

Replace `primer-a2ui-adapter/src/catalog.ts` with:

```ts
import {Catalog} from '@a2ui/web_core/v0_9';
import type {ReactComponentImplementation} from '@a2ui/react/v0_9';
import {PRIMER_CATALOG_ID} from './catalog-id';
import {TextComponent} from './components/text';
import {consoleLog} from './functions/console-log';

/** From-scratch Primer-native catalog: id, component implementations, functions. */
export const PRIMER_CATALOG = new Catalog<ReactComponentImplementation>(
  PRIMER_CATALOG_ID,
  [TextComponent],
  [consoleLog],
);
```

- [ ] **Step 4: Run test to verify it passes**

Run: `yarn workspace primer-a2ui-adapter test catalog.test`
Expected: PASS (4 tests).

- [ ] **Step 5: Verify the build compiles**

Run: `yarn workspace primer-a2ui-adapter build`
Expected: PASS.

- [ ] **Step 6: Commit**

```bash
git add primer-a2ui-adapter/src/catalog.ts primer-a2ui-adapter/src/catalog.test.ts
git commit -m "feat(phase-2): assemble PRIMER_CATALOG with Text and consoleLog"
```

---

### Task 6: Hand-author `catalog.json` + zod↔JSON parity test

Write the declarative agent/server contract and guard it against the zod source with a structural parity test. TDD order: write the parity test first (it fails against the placeholder `catalog.json`), then author `catalog.json` to satisfy it.

**Files:**
- Modify: `primer-a2ui-adapter/catalogs/v0.9.1/catalog.json`
- Test: `primer-a2ui-adapter/src/catalog.parity.test.ts`

**Interfaces:**
- Consumes: `TextApi` from `./components/text`; `consoleLog` from `./functions/console-log`; the JSON file read via `fs` + `import.meta.url`.
- Produces: a `catalog.json` whose `components.Text.properties` (minus envelope field `component`), `required`, per-prop `enum`s, `functions.consoleLog.args.properties`, and `$defs.anyComponent`/`$defs.anyFunction` `oneOf` refs all match the zod source.

- [ ] **Step 1: Write the failing parity test**

Create `primer-a2ui-adapter/src/catalog.parity.test.ts`:

```ts
import {describe, it, expect} from 'vitest';
import {readFileSync} from 'node:fs';
import {z} from 'zod';
import {TextApi} from './components/text';
import {consoleLog} from './functions/console-log';

const catalog = JSON.parse(
  readFileSync(new URL('../catalogs/v0.9.1/catalog.json', import.meta.url), 'utf8'),
) as {
  components: Record<string, {properties: Record<string, {enum?: string[]}>; required: string[]}>;
  functions: Record<string, {args: {properties: Record<string, unknown>}}>;
  $defs: {anyComponent: {oneOf: {$ref: string}[]}; anyFunction: {oneOf: {$ref: string}[]}};
};

// Envelope fields the framework owns; present in catalog.json but never in the props-only zod schema.
const ENVELOPE_FIELDS = ['component', 'id'];

function unwrap(field: z.ZodTypeAny): z.ZodTypeAny {
  let f = field;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  while (f instanceof z.ZodOptional || f instanceof z.ZodDefault) {
    f = f instanceof z.ZodOptional ? f.unwrap() : (f._def as any).innerType;
  }
  return f;
}

function enumValues(field: z.ZodTypeAny): string[] | null {
  const f = unwrap(field);
  return f instanceof z.ZodEnum ? [...f.options] : null;
}

function refName(ref: string): string {
  return ref.split('/').pop() as string;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const textShape = (TextApi.schema as z.ZodObject<any>).shape as Record<string, z.ZodTypeAny>;

describe('Text: zod ↔ catalog.json parity', () => {
  const jsonProps = catalog.components.Text.properties;
  const jsonPropNames = Object.keys(jsonProps).filter((k) => !ENVELOPE_FIELDS.includes(k));

  it('property-name sets match (excluding envelope fields)', () => {
    expect(jsonPropNames.sort()).toEqual(Object.keys(textShape).sort());
  });

  it('required sets match (excluding envelope fields)', () => {
    const jsonRequired = catalog.components.Text.required
      .filter((k) => !ENVELOPE_FIELDS.includes(k))
      .sort();
    const zodRequired = Object.entries(textShape)
      .filter(([, v]) => !v.isOptional())
      .map(([k]) => k)
      .sort();
    expect(jsonRequired).toEqual(zodRequired);
  });

  it('enum value sets match per styling prop', () => {
    for (const key of ['as', 'size', 'weight', 'whiteSpace']) {
      const zodEnum = enumValues(textShape[key]);
      expect(zodEnum, `zod enum for ${key}`).not.toBeNull();
      const jsonEnum = jsonProps[key]?.enum ?? [];
      expect([...jsonEnum].sort(), `json enum for ${key}`).toEqual([...(zodEnum as string[])].sort());
    }
  });

  it('anyComponent oneOf covers exactly the declared components', () => {
    const refNames = catalog.$defs.anyComponent.oneOf.map((r) => refName(r.$ref)).sort();
    expect(refNames).toEqual(Object.keys(catalog.components).sort());
  });
});

describe('consoleLog: zod ↔ catalog.json parity', () => {
  it('function name appears in functions and anyFunction', () => {
    expect(Object.keys(catalog.functions)).toContain(consoleLog.name);
    const refNames = catalog.$defs.anyFunction.oneOf.map((r) => refName(r.$ref));
    expect(refNames).toContain(consoleLog.name);
  });

  it('arg-name sets match', () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const zodArgs = Object.keys((consoleLog.schema as z.ZodObject<any>).shape).sort();
    const jsonArgs = Object.keys(catalog.functions.consoleLog.args.properties).sort();
    expect(jsonArgs).toEqual(zodArgs);
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `yarn workspace primer-a2ui-adapter test catalog.parity`
Expected: FAIL — the placeholder `catalog.json` has empty `components`/`functions` and no `$defs`.

- [ ] **Step 3: Author `catalog.json`**

Replace `primer-a2ui-adapter/catalogs/v0.9.1/catalog.json` with:

```json
{
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "$id": "https://github.com/retz8/a2ui-github/blob/main/primer-a2ui-adapter/catalogs/v0.9.1/catalog.json",
  "catalogId": "https://github.com/retz8/a2ui-github/blob/main/primer-a2ui-adapter/catalogs/v0.9.1/catalog.json",
  "components": {
    "Text": {
      "type": "object",
      "description": "Primer Text. Renders text with Primer typography props.",
      "properties": {
        "component": {"const": "Text"},
        "text": {
          "$ref": "https://a2ui.org/specification/v0_9/common_types.json#/$defs/DynamicString",
          "description": "The text content to display."
        },
        "as": {
          "type": "string",
          "enum": ["span", "p", "div", "label", "strong", "em", "small"],
          "default": "span",
          "description": "The HTML element to render."
        },
        "size": {
          "type": "string",
          "enum": ["small", "medium", "large"],
          "description": "Primer font size."
        },
        "weight": {
          "type": "string",
          "enum": ["light", "normal", "medium", "semibold"],
          "description": "Primer font weight."
        },
        "whiteSpace": {
          "type": "string",
          "enum": ["normal", "nowrap", "pre", "pre-wrap", "pre-line"],
          "description": "CSS white-space behavior."
        }
      },
      "required": ["component", "text"],
      "unevaluatedProperties": false
    }
  },
  "functions": {
    "consoleLog": {
      "type": "object",
      "description": "Logs a message to the browser console. A local client-side effect.",
      "properties": {
        "call": {"const": "consoleLog"},
        "args": {
          "type": "object",
          "properties": {
            "message": {
              "$ref": "https://a2ui.org/specification/v0_9/common_types.json#/$defs/DynamicString",
              "description": "The message to log."
            }
          },
          "required": ["message"],
          "additionalProperties": false
        },
        "returnType": {"const": "void"}
      },
      "required": ["call", "args"],
      "unevaluatedProperties": false
    }
  },
  "$defs": {
    "anyComponent": {
      "oneOf": [{"$ref": "#/components/Text"}]
    },
    "anyFunction": {
      "oneOf": [{"$ref": "#/functions/consoleLog"}]
    }
  }
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `yarn workspace primer-a2ui-adapter test catalog.parity`
Expected: PASS (6 tests).

- [ ] **Step 5: Commit**

```bash
git add primer-a2ui-adapter/catalogs/v0.9.1/catalog.json primer-a2ui-adapter/src/catalog.parity.test.ts
git commit -m "feat(phase-2): hand-author Text catalog.json with zod parity test"
```

---

### Task 7: Whole-package + whole-repo green

Confirm the full task is green end-to-end and nothing downstream regressed.

**Files:** none (verification only).

- [ ] **Step 1: Full adapter suite**

Run: `yarn workspace primer-a2ui-adapter test`
Expected: PASS — schema (6) + TextView (4) + consoleLog (3) + catalog (4) + parity (6).

- [ ] **Step 2: Adapter typecheck + build**

Run: `yarn workspace primer-a2ui-adapter typecheck`
Expected: PASS.

Run: `yarn workspace primer-a2ui-adapter build`
Expected: PASS.

- [ ] **Step 3: Whole-repo orchestration**

Run: `yarn lint:all && yarn typecheck:all && yarn build:all && yarn test:all`
Expected: PASS across all workspaces. The `client` imports only `PRIMER_CATALOG_ID` (unchanged), so its build/tests remain green; no client edits are expected. (Exact script names per the root `package.json` from Phase 1.4 — adjust if a script is named differently, e.g. `yarn build:all`.)

- [ ] **Step 4: Final commit (only if Step 3 surfaced a necessary fix)**

```bash
git add -A
git commit -m "chore(phase-2): keep whole repo green for Text catalog slice"
```

---

## Notes for the implementer

- **Do not re-introduce the basic catalog's commons** (`accessibility`, layout `weight`). The strict five-prop surface is deliberate (see `_dev/docs/a2ui-findings.md`).
- **`weight` is Primer's font weight here** — not the protocol's numeric layout weight. This is intentional and documented.
- **No zod→`catalog.json` generator** — `catalog.json` is hand-authored and the parity test is the drift guard. The generator is Phase 3.
- If `createComponentImplementation`'s inferred `props` type fights you, the resolved `props.text` is a `string`; pass fields explicitly into `TextView` (as written) rather than spreading.
