# Task 2.2 — Adapter `Button` (both action shapes) Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a `Button` component to `PRIMER_CATALOG` — a faithful 1:1 translation of Primer `Button`'s real prop surface — through both schema representations (runtime zod + declarative `catalog.json`), childing a `Text` via `buildChild` and carrying the A2UI `Action` (both `event` and `functionCall` shapes), and harden the zod↔`catalog.json` parity test.

**Architecture:** Mirror the `Text` slice landed in 2.1. `Button` is authored as a presentational Primer wrapper (`ButtonView`, plain resolved props) wired into the catalog via the generic binder `createComponentImplementation`. The binder resolves the `Action` prop to a ready-to-call `() => void` (the renderer decides `event` vs `functionCall` — exercised in 2.3, not here) and the `child` `ComponentId` to a string the render passes to `buildChild`. The component is described twice — runtime zod (`ButtonApi`) and hand-authored `catalog.json` — kept in lockstep by the structural parity test, now generalized to loop over all components/functions.

**Tech Stack:** TypeScript (ESM), zod v3, `@a2ui/web_core@^0.10.1` + `@a2ui/react@^0.10.1` (both via the `/v0_9` subpath), `@primer/react@^38`, React 19, Vitest + jsdom + Testing Library, `tsc` build.

## Global Constraints

- **Protocol surface only via `/v0_9` subpath:** import from `@a2ui/web_core/v0_9` and `@a2ui/react/v0_9`. Never the bare (v0.8) entry.
- **Never redefine shared A2UI primitives:** compose `CommonSchemas` in zod; `$ref` the hosted `common_types.json` in `catalog.json`. Hosted base URL: `https://a2ui.org/specification/v0_9/common_types.json`.
- **From scratch, not over `basicCatalog`:** `basicCatalog` is reference-only; do not compose on it or inherit its commons wholesale.
- **Per-component fidelity (NOT a uniform commons base):** a component's schema carries exactly the props its real Primer/React type exposes. `Button` is typed `ButtonProps & ButtonBaseProps & React.ButtonHTMLAttributes<HTMLButtonElement>`; the `aria-*` slice of that spread is real accessibility surface, so `Button` carries `accessibility` (`CommonSchemas.AccessibilityAttributes`, nested). The rest of the HTML-attribute spread (`type`, `name`, `tabIndex`, `data-*`, …) has no A2UI representation and is dropped; `onClick` maps to `action`. See `_dev/docs/a2ui-findings.md` findings #3 + #5.
- **Bound state vs fixed config:** bound runtime state composes `CommonSchemas.Dynamic*`; fixed authoring-time configuration stays plain `z.boolean()`/`z.string()`; enums stay plain `z.enum` (no `DynamicEnum` exists). See the `a2ui-sdk-design` skill, "Catalog Authoring Conventions".
- **`catalog.json` descriptions target the agent, never name the renderer/design-system:** "Font size.", not "Primer font size." (skill convention). The prop surface + enum values stay a faithful 1:1 of the real Primer API; only the description prose is de-branded.
- **Schema is props-only:** `ComponentApi.schema` MUST NOT include `component` or `id` (the framework owns those envelope fields).
- **Closure:** zod schemas end with `.strict()`; `catalog.json` components/functions use `unevaluatedProperties: false`.
- **`Button` prop surface (locked):** required `child` (`ComponentId`) + `action` (`Action`); optional `variant`/`size`/`alignContent` (enums), `disabled`/`loading`/`inactive` (`DynamicBoolean`), `count` (`DynamicString`), `block`/`labelWrap` (`z.boolean`), `loadingAnnouncement` (`z.string`), `accessibility` (`AccessibilityAttributes`). Element-typed props (`icon`, `leadingVisual`, `trailingVisual`, `trailingAction`) are deferred to Phase 4 — see `_dev/docs/deferred-catalog-work.md`.
- **Versions (peerDeps already declared in 2.1):** `@a2ui/react ^0.10.1`, `@a2ui/web_core ^0.10.1`, `@primer/react ^38.28.0`, `react ^19.2.7`, `react-dom ^19.2.7`, `zod ^3.25.76`.
- **Commits:** conventional, `<type>(phase-2): …`. This task is implementation code only — never touch `_dev/` (TODO tick, findings, skill, and the deferred-work doc are maintained on `main`, outside this worktree).
- **Run commands** from the repo root via `yarn workspace primer-a2ui-adapter <script>` (Yarn 4 workspace).

---

### Task 1: `Button` zod schema (`ButtonApi`)

The runtime, render-time source of truth for `Button` — props-only, composing `CommonSchemas` for the protocol props (`ComponentId`, `Action`, the `Dynamic*` state props, `AccessibilityAttributes`) and local enums for the Primer styling props.

**Files:**
- Create: `primer-a2ui-adapter/src/components/button/button.schema.ts`
- Test: `primer-a2ui-adapter/src/components/button/button.schema.test.ts`

**Interfaces:**
- Consumes: `CommonSchemas` from `@a2ui/web_core/v0_9`; `z` from `zod`.
- Produces: `ButtonApi: { name: 'Button'; schema: ZodObject }` and `type ButtonProps = z.infer<typeof ButtonApi.schema>`. Enum members — `variant`: `['default','primary','invisible','danger','link']`; `size`: `['small','medium','large']`; `alignContent`: `['start','center']`. Required props: `child`, `action`.

- [ ] **Step 1: Write the failing test**

Create `primer-a2ui-adapter/src/components/button/button.schema.test.ts`:

```ts
import {describe, it, expect} from 'vitest';
import {ButtonApi} from './button.schema';

const action = {event: {name: 'submit'}};

describe('ButtonApi.schema', () => {
  it('accepts a minimal valid Button (child + action)', () => {
    expect(ButtonApi.schema.safeParse({child: 'label-1', action}).success).toBe(true);
  });

  it('accepts an event action', () => {
    expect(
      ButtonApi.schema.safeParse({child: 'l', action: {event: {name: 'submit'}}}).success,
    ).toBe(true);
  });

  it('accepts a functionCall action', () => {
    expect(
      ButtonApi.schema.safeParse({
        child: 'l',
        action: {functionCall: {call: 'consoleLog', args: {message: 'hi'}}},
      }).success,
    ).toBe(true);
  });

  it('accepts the full prop surface', () => {
    const result = ButtonApi.schema.safeParse({
      child: 'l',
      action,
      variant: 'primary',
      size: 'large',
      alignContent: 'center',
      disabled: true,
      loading: false,
      inactive: false,
      count: '5',
      block: true,
      labelWrap: true,
      loadingAnnouncement: 'Loading',
      accessibility: {label: 'Submit', description: 'Submits the form'},
    });
    expect(result.success).toBe(true);
  });

  it('requires child', () => {
    expect(ButtonApi.schema.safeParse({action}).success).toBe(false);
  });

  it('requires action', () => {
    expect(ButtonApi.schema.safeParse({child: 'l'}).success).toBe(false);
  });

  it('rejects unknown props (strict)', () => {
    expect(ButtonApi.schema.safeParse({child: 'l', action, color: 'red'}).success).toBe(false);
  });

  it('rejects out-of-enum variant', () => {
    expect(ButtonApi.schema.safeParse({child: 'l', action, variant: 'ghost'}).success).toBe(false);
  });

  it('accepts a data-binding for disabled (DynamicBoolean)', () => {
    expect(
      ButtonApi.schema.safeParse({child: 'l', action, disabled: {path: '/canSubmit'}}).success,
    ).toBe(true);
  });

  it('accepts accessibility label and description', () => {
    expect(
      ButtonApi.schema.safeParse({child: 'l', action, accessibility: {label: 'Submit'}}).success,
    ).toBe(true);
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `yarn workspace primer-a2ui-adapter test button.schema`
Expected: FAIL — cannot resolve `./button.schema`.

- [ ] **Step 3: Write the schema**

Create `primer-a2ui-adapter/src/components/button/button.schema.ts`:

```ts
import {z} from 'zod';
import {CommonSchemas} from '@a2ui/web_core/v0_9';

/**
 * Runtime (zod) representation of Primer Button, props-only.
 *
 * Faithful 1:1 translation of Primer Button's real prop surface:
 * - `child` is the synthetic content reference: Primer Button takes content via React
 *   children, but A2UI composes by ComponentId, so the label is a child (use a Text) — the
 *   render childs it via buildChild. See _dev/docs/a2ui-findings.md finding #1.
 * - `action` is Primer's onClick expressed as the A2UI Action; the binder resolves it to a
 *   ready-to-call () => void (event vs functionCall routing is the renderer's job, 2.3).
 * - `variant`/`size`/`alignContent` are Primer enums lifted verbatim.
 * - `disabled`/`loading`/`inactive` are bound runtime state -> DynamicBoolean; `count` is a
 *   bound display value -> DynamicString; `block`/`labelWrap`/`loadingAnnouncement` are fixed
 *   configuration -> plain. (Bound-state-vs-config rule: a2ui-sdk-design skill.)
 * - `accessibility` is carried because Button's type spreads React.ButtonHTMLAttributes (the
 *   aria-* slice); it maps to CommonSchemas.AccessibilityAttributes. See finding #3.
 *
 * Deferred to Phase 4 (element-typed -> not JSON-serializable; carry as ComponentId children
 * once an Icon component exists — see _dev/docs/deferred-catalog-work.md):
 *   icon, leadingVisual, trailingVisual, trailingAction.
 *
 * `.strict()` forbids any prop outside this surface.
 */
export const ButtonApi = {
  name: 'Button',
  schema: z
    .object({
      child: CommonSchemas.ComponentId,
      action: CommonSchemas.Action,
      variant: z.enum(['default', 'primary', 'invisible', 'danger', 'link']).optional(),
      size: z.enum(['small', 'medium', 'large']).optional(),
      alignContent: z.enum(['start', 'center']).optional(),
      disabled: CommonSchemas.DynamicBoolean.optional(),
      loading: CommonSchemas.DynamicBoolean.optional(),
      inactive: CommonSchemas.DynamicBoolean.optional(),
      count: CommonSchemas.DynamicString.optional(),
      block: z.boolean().optional(),
      labelWrap: z.boolean().optional(),
      loadingAnnouncement: z.string().optional(),
      accessibility: CommonSchemas.AccessibilityAttributes.optional(),
    })
    .strict(),
} as const;

export type ButtonProps = z.infer<typeof ButtonApi.schema>;
```

- [ ] **Step 4: Run test to verify it passes**

Run: `yarn workspace primer-a2ui-adapter test button.schema`
Expected: PASS (10 tests).

- [ ] **Step 5: Commit**

```bash
git add primer-a2ui-adapter/src/components/button/button.schema.ts primer-a2ui-adapter/src/components/button/button.schema.test.ts
git commit -m "feat(phase-2): add Button zod schema composing CommonSchemas"
```

---

### Task 2: `ButtonView` presentational component + binder wiring + folder barrel

The Primer render and its generic-binder wiring. `ButtonView` is a pure-props React component (unit-testable directly): it receives resolved plain props, a built `children` node, and an `onClick`, and maps them onto Primer `Button`. `ButtonComponent` wires it into the catalog — calling `buildChild(props.child)` for the label and passing the resolved `props.action` as `onClick`. The folder `index.ts` is the controlled export surface (exposes `ButtonComponent` + `ButtonApi`, not `ButtonView`).

This task does NOT test through the renderer. `buildChild` composition, `functionCall`→`consoleLog`, and `event` dispatch are exercised in 2.3's client test space (both action shapes collapse to the same resolved `() => void` at the presentational level).

**Files:**
- Create: `primer-a2ui-adapter/src/components/button/button.tsx`
- Create: `primer-a2ui-adapter/src/components/button/index.ts`
- Test: `primer-a2ui-adapter/src/components/button/button.test.tsx`

**Interfaces:**
- Consumes: `ButtonApi` from `./button.schema`; `createComponentImplementation`, `type ReactComponentImplementation` from `@a2ui/react/v0_9`; `Button as PrimerButton` from `@primer/react`.
- Produces: `ButtonComponent: ReactComponentImplementation` and (module-level, for the in-folder test) `ButtonView`. `index.ts` re-exports `ButtonComponent` and `ButtonApi` only. Primer `Button` emits `data-variant`/`data-size`/`data-block`/`data-inactive`/`data-loading`/`data-label-wrap`/`data-align` attributes and applies `aria-label`/`aria-description`.

- [ ] **Step 1: Write the failing test**

Create `primer-a2ui-adapter/src/components/button/button.test.tsx`:

```tsx
import {describe, it, expect, vi, afterEach} from 'vitest';
import {render, screen, cleanup, fireEvent} from '@testing-library/react';
import {ButtonView} from './button';

afterEach(cleanup);

describe('ButtonView', () => {
  it('renders its child content as the label', () => {
    render(<ButtonView>Save</ButtonView>);
    expect(screen.getByRole('button', {name: 'Save'})).toBeInTheDocument();
  });

  it('fires onClick when clicked (the resolved action)', () => {
    const onClick = vi.fn();
    render(<ButtonView onClick={onClick}>Save</ButtonView>);
    fireEvent.click(screen.getByRole('button'));
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it('passes variant and size to Primer as data-* attributes', () => {
    render(
      <ButtonView variant="primary" size="large">
        Save
      </ButtonView>,
    );
    const el = screen.getByRole('button');
    expect(el).toHaveAttribute('data-variant', 'primary');
    expect(el).toHaveAttribute('data-size', 'large');
  });

  it('honors disabled', () => {
    render(<ButtonView disabled>Save</ButtonView>);
    expect(screen.getByRole('button')).toBeDisabled();
  });

  it('applies accessibility label and description as aria-* attributes', () => {
    render(
      <ButtonView accessibility={{label: 'Submit form', description: 'Submits the data'}}>
        Save
      </ButtonView>,
    );
    const el = screen.getByRole('button', {name: 'Submit form'});
    expect(el).toHaveAttribute('aria-label', 'Submit form');
    expect(el).toHaveAttribute('aria-description', 'Submits the data');
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `yarn workspace primer-a2ui-adapter test button.test`
Expected: FAIL — cannot resolve `./button`.

- [ ] **Step 3: Write `ButtonView` + binder wiring**

Create `primer-a2ui-adapter/src/components/button/button.tsx`:

```tsx
import type {ReactNode} from 'react';
import {Button as PrimerButton} from '@primer/react';
import {createComponentImplementation} from '@a2ui/react/v0_9';
import {ButtonApi} from './button.schema';

/** Resolved accessibility: nested DynamicStrings are plain strings after the binder resolves them. */
type ResolvedAccessibility = {label?: string; description?: string};

/** Resolved props: Dynamic* are resolved to primitives, action -> onClick, child -> children. */
type ButtonViewProps = {
  variant?: 'default' | 'primary' | 'invisible' | 'danger' | 'link';
  size?: 'small' | 'medium' | 'large';
  alignContent?: 'start' | 'center';
  disabled?: boolean;
  loading?: boolean;
  inactive?: boolean;
  block?: boolean;
  labelWrap?: boolean;
  loadingAnnouncement?: string;
  count?: string;
  accessibility?: ResolvedAccessibility;
  onClick?: () => void;
  children?: ReactNode;
};

export function ButtonView({
  variant,
  size,
  alignContent,
  disabled,
  loading,
  inactive,
  block,
  labelWrap,
  loadingAnnouncement,
  count,
  accessibility,
  onClick,
  children,
}: ButtonViewProps) {
  return (
    <PrimerButton
      variant={variant}
      size={size}
      alignContent={alignContent}
      disabled={disabled}
      loading={loading}
      inactive={inactive}
      block={block}
      labelWrap={labelWrap}
      loadingAnnouncement={loadingAnnouncement}
      count={count}
      aria-label={accessibility?.label}
      aria-description={accessibility?.description}
      onClick={onClick}
    >
      {children}
    </PrimerButton>
  );
}

/**
 * Catalog entry: the generic binder resolves props, then renders ButtonView.
 * - `props.action` is resolved to a () => void closure (the renderer routes event vs
 *   functionCall) -> passed as onClick.
 * - `props.child` is the resolved ComponentId string -> built into the label via buildChild.
 * - `props.accessibility` carries resolved (plain-string) label/description at runtime; its
 *   inferred type still shows the nested DynamicString, so it is cast to the resolved shape.
 * Props are passed explicitly (no spread): resolved props include extra binder setters.
 */
export const ButtonComponent = createComponentImplementation(ButtonApi, ({props, buildChild}) => (
  <ButtonView
    variant={props.variant}
    size={props.size}
    alignContent={props.alignContent}
    disabled={props.disabled}
    loading={props.loading}
    inactive={props.inactive}
    block={props.block}
    labelWrap={props.labelWrap}
    loadingAnnouncement={props.loadingAnnouncement}
    count={props.count}
    accessibility={props.accessibility as ResolvedAccessibility | undefined}
    onClick={props.action}
  >
    {buildChild(props.child)}
  </ButtonView>
));
```

- [ ] **Step 4: Create the folder barrel (controlled export surface)**

Create `primer-a2ui-adapter/src/components/button/index.ts`:

```ts
export {ButtonComponent} from './button';
export {ButtonApi} from './button.schema';
export type {ButtonProps} from './button.schema';
```

- [ ] **Step 5: Run test to verify it passes**

Run: `yarn workspace primer-a2ui-adapter test button.test`
Expected: PASS (5 tests).

(If Primer logs a missing-`ThemeProvider` warning, ignore it — these assertions do not depend on theme. Only wrap the render in `ThemeProvider`/`BaseStyles` if a hard error occurs.)

- [ ] **Step 6: Verify the build still compiles**

Run: `yarn workspace primer-a2ui-adapter build`
Expected: PASS — `button.tsx` and `index.ts` emit cleanly; `button.test.tsx` is excluded.

- [ ] **Step 7: Commit**

```bash
git add primer-a2ui-adapter/src/components/button/button.tsx primer-a2ui-adapter/src/components/button/index.ts primer-a2ui-adapter/src/components/button/button.test.tsx
git commit -m "feat(phase-2): add Primer ButtonView and generic-binder wiring"
```

---

### Task 3: Register `Button` in `PRIMER_CATALOG`

Add `ButtonComponent` to the catalog and extend the smoke test to assert it is registered.

**Files:**
- Modify: `primer-a2ui-adapter/src/catalog.ts`
- Modify: `primer-a2ui-adapter/src/catalog.test.ts`

**Interfaces:**
- Consumes: `ButtonComponent` from `./components/button` (in addition to the existing `TextComponent`, `consoleLog`).
- Produces: `PRIMER_CATALOG.components` now keyed `'Text'` AND `'Button'`; `functions` unchanged (`'consoleLog'`).

- [ ] **Step 1: Add the failing smoke assertion**

In `primer-a2ui-adapter/src/catalog.test.ts`, add a Button registration assertion inside the existing `describe('PRIMER_CATALOG', …)` block (after the `registers the Text component` test):

```ts
  it('registers the Button component', () => {
    expect(PRIMER_CATALOG.components.has('Button')).toBe(true);
  });
```

- [ ] **Step 2: Run test to verify it fails**

Run: `yarn workspace primer-a2ui-adapter test catalog.test`
Expected: FAIL — `PRIMER_CATALOG.components.has('Button')` is `false` (Button not yet registered).

- [ ] **Step 3: Register Button in the catalog**

In `primer-a2ui-adapter/src/catalog.ts`, import `ButtonComponent` and add it to the components array:

```ts
import {Catalog} from '@a2ui/web_core/v0_9';
import type {ReactComponentImplementation} from '@a2ui/react/v0_9';
import {PRIMER_CATALOG_ID} from './catalog-id';
import {TextComponent} from './components/text';
import {ButtonComponent} from './components/button';
import {consoleLog} from './functions/console-log';

/** From-scratch Primer-native catalog: id, component implementations, functions. */
export const PRIMER_CATALOG = new Catalog<ReactComponentImplementation>(
  PRIMER_CATALOG_ID,
  [TextComponent, ButtonComponent],
  [consoleLog],
);
```

- [ ] **Step 4: Run test to verify it passes**

Run: `yarn workspace primer-a2ui-adapter test catalog.test`
Expected: PASS (5 tests — the 4 existing + the new Button registration).

- [ ] **Step 5: Verify the build compiles**

Run: `yarn workspace primer-a2ui-adapter build`
Expected: PASS.

- [ ] **Step 6: Commit**

```bash
git add primer-a2ui-adapter/src/catalog.ts primer-a2ui-adapter/src/catalog.test.ts
git commit -m "feat(phase-2): register Button in PRIMER_CATALOG"
```

---

### Task 4: Extend `catalog.json` with `Button` + harden the parity test

Add the `Button` entry to the declarative contract and extend `anyComponent`. Then rewrite the parity test to (a) loop over all components/functions instead of per-entry copy-paste, and (b) add the carried hardening assertions: discriminator consts (`component`/`call` equal their keys), `returnType.const`, and args required-ness. TDD order: harden the test first (it still passes against the current single-component catalog because the loop covers `Text`), then watch it fail when it loops over a `Button` that `catalog.json` doesn't yet contain, then author the `Button` entry.

**Files:**
- Modify: `primer-a2ui-adapter/catalogs/v0.9.1/catalog.json`
- Modify: `primer-a2ui-adapter/src/catalog.parity.test.ts`

**Interfaces:**
- Consumes: `ButtonApi` from `./components/button` and `TextApi` from `./components/text`; `consoleLog` from `./functions/console-log`; the JSON file read via `fs` + `import.meta.url`.
- Produces: a `catalog.json` whose `components.Button` mirrors `ButtonApi` (prop-name set minus envelope `component`, required set `{child, action}`, per-enum value sets) and is listed in `$defs.anyComponent.oneOf`; a parity test that loops a `{Text, Button}` component registry and a `{consoleLog}` function registry, asserting name/required/enum parity, discriminator consts, `returnType.const`, and args required-ness.

- [ ] **Step 1: Rewrite the parity test (generalized loop + hardening)**

Replace `primer-a2ui-adapter/src/catalog.parity.test.ts` with:

```ts
import {describe, it, expect} from 'vitest';
import {readFileSync} from 'node:fs';
import {z} from 'zod';
import {TextApi} from './components/text';
import {ButtonApi} from './components/button';
import {consoleLog} from './functions/console-log';

type JsonProp = {const?: string; enum?: string[]};
type JsonComponent = {properties: Record<string, JsonProp>; required: string[]};
type JsonFunction = {
  properties: {
    call: {const?: string};
    args: {properties: Record<string, unknown>; required?: string[]};
    returnType: {const?: string};
  };
};

const catalog = JSON.parse(
  readFileSync(new URL('../catalogs/v0.9.1/catalog.json', import.meta.url), 'utf8'),
) as {
  components: Record<string, JsonComponent>;
  functions: Record<string, JsonFunction>;
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
function shapeOf(api: {schema: z.ZodTypeAny}): Record<string, z.ZodTypeAny> {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return (api.schema as z.ZodObject<any>).shape as Record<string, z.ZodTypeAny>;
}

// Component registry: zod ComponentApi keyed by component name.
const COMPONENTS = {Text: TextApi, Button: ButtonApi} as const;
// Function registry: FunctionImplementation keyed by function name.
const FUNCTIONS = {consoleLog} as const;

describe.each(Object.entries(COMPONENTS))('component %s: zod ↔ catalog.json parity', (name, api) => {
  const jsonComponent = catalog.components[name];
  const zodShape = shapeOf(api);

  it('is declared in catalog.json', () => {
    expect(jsonComponent, `catalog.json is missing component ${name}`).toBeDefined();
  });

  it('property-name sets match (excluding envelope fields)', () => {
    const jsonNames = Object.keys(jsonComponent.properties)
      .filter((k) => !ENVELOPE_FIELDS.includes(k))
      .sort();
    expect(jsonNames).toEqual(Object.keys(zodShape).sort());
  });

  it('required sets match (excluding envelope fields)', () => {
    const jsonRequired = jsonComponent.required.filter((k) => !ENVELOPE_FIELDS.includes(k)).sort();
    const zodRequired = Object.entries(zodShape)
      .filter(([, v]) => !v.isOptional())
      .map(([k]) => k)
      .sort();
    expect(jsonRequired).toEqual(zodRequired);
  });

  it('enum value sets match per enum prop', () => {
    for (const [key, field] of Object.entries(zodShape)) {
      const zodEnum = enumValues(field);
      if (!zodEnum) continue; // non-enum props ($ref/Dynamic/plain) — tolerated, not compared
      const jsonEnum = jsonComponent.properties[key]?.enum ?? [];
      expect([...jsonEnum].sort(), `enum for ${name}.${key}`).toEqual([...zodEnum].sort());
    }
  });

  it('component discriminator const equals the component key', () => {
    expect(jsonComponent.properties.component?.const).toBe(name);
  });
});

describe('anyComponent oneOf covers exactly the declared components', () => {
  it('matches the components map', () => {
    const refNames = catalog.$defs.anyComponent.oneOf.map((r) => refName(r.$ref)).sort();
    expect(refNames).toEqual(Object.keys(catalog.components).sort());
  });
});

describe.each(Object.entries(FUNCTIONS))('function %s: zod ↔ catalog.json parity', (name, fn) => {
  const jsonFn = catalog.functions[name];

  it('is declared in functions and anyFunction', () => {
    expect(Object.keys(catalog.functions)).toContain(name);
    const refNames = catalog.$defs.anyFunction.oneOf.map((r) => refName(r.$ref));
    expect(refNames).toContain(name);
  });

  it('arg-name sets match', () => {
    const zodArgs = Object.keys(shapeOf(fn)).sort();
    const jsonArgs = Object.keys(jsonFn.properties.args.properties).sort();
    expect(jsonArgs).toEqual(zodArgs);
  });

  it('args required-ness matches (all zod args are required)', () => {
    const zodRequired = Object.entries(shapeOf(fn))
      .filter(([, v]) => !v.isOptional())
      .map(([k]) => k)
      .sort();
    const jsonRequired = [...(jsonFn.properties.args.required ?? [])].sort();
    expect(jsonRequired).toEqual(zodRequired);
  });

  it('call discriminator const equals the function key', () => {
    expect(jsonFn.properties.call?.const).toBe(name);
  });

  it('returnType const matches the zod returnType', () => {
    expect(jsonFn.properties.returnType?.const).toBe(fn.returnType);
  });
});

describe('anyFunction oneOf covers exactly the declared functions', () => {
  it('matches the functions map', () => {
    const refNames = catalog.$defs.anyFunction.oneOf.map((r) => refName(r.$ref)).sort();
    expect(refNames).toEqual(Object.keys(catalog.functions).sort());
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `yarn workspace primer-a2ui-adapter test catalog.parity`
Expected: FAIL — the `Button` rows fail (`catalog.json is missing component Button`; `anyComponent` does not cover `Button`). The `Text` and `consoleLog` rows pass.

- [ ] **Step 3: Author the `Button` entry in `catalog.json`**

In `primer-a2ui-adapter/catalogs/v0.9.1/catalog.json`, add a `"Button"` key to `components` (after `"Text"`) and add the Button `$ref` to `$defs.anyComponent.oneOf`. The `Button` component object:

```json
    "Button": {
      "type": "object",
      "description": "An interactive button that triggers an action when clicked.",
      "properties": {
        "component": {"const": "Button"},
        "child": {
          "$ref": "https://a2ui.org/specification/v0_9/common_types.json#/$defs/ComponentId",
          "description": "The ID of the component used as the button's label. Use a Text component; do not define it inline."
        },
        "action": {
          "$ref": "https://a2ui.org/specification/v0_9/common_types.json#/$defs/Action",
          "description": "The action performed when the button is clicked."
        },
        "variant": {
          "type": "string",
          "enum": ["default", "primary", "invisible", "danger", "link"],
          "default": "default",
          "description": "The visual style. 'primary' marks the main call-to-action; 'danger' a destructive action."
        },
        "size": {
          "type": "string",
          "enum": ["small", "medium", "large"],
          "description": "The button size."
        },
        "alignContent": {
          "type": "string",
          "enum": ["start", "center"],
          "description": "How the content is aligned within the button."
        },
        "disabled": {
          "$ref": "https://a2ui.org/specification/v0_9/common_types.json#/$defs/DynamicBoolean",
          "description": "Whether the button is disabled and cannot be clicked."
        },
        "loading": {
          "$ref": "https://a2ui.org/specification/v0_9/common_types.json#/$defs/DynamicBoolean",
          "description": "Whether the button shows a loading state."
        },
        "inactive": {
          "$ref": "https://a2ui.org/specification/v0_9/common_types.json#/$defs/DynamicBoolean",
          "description": "Whether the button looks disabled but still accepts interaction."
        },
        "count": {
          "$ref": "https://a2ui.org/specification/v0_9/common_types.json#/$defs/DynamicString",
          "description": "A count value displayed alongside the label."
        },
        "block": {
          "type": "boolean",
          "description": "Whether the button fills the width of its container."
        },
        "labelWrap": {
          "type": "boolean",
          "description": "Whether the label wraps to multiple lines when it is longer than the button width."
        },
        "loadingAnnouncement": {
          "type": "string",
          "description": "Text announced to assistive technologies while the button is loading."
        },
        "accessibility": {
          "$ref": "https://a2ui.org/specification/v0_9/common_types.json#/$defs/AccessibilityAttributes",
          "description": "Accessibility attributes (label, description) for assistive technologies."
        }
      },
      "required": ["component", "child", "action"],
      "unevaluatedProperties": false
    }
```

And update `$defs.anyComponent` to:

```json
    "anyComponent": {
      "oneOf": [{"$ref": "#/components/Text"}, {"$ref": "#/components/Button"}]
    }
```

- [ ] **Step 4: Run test to verify it passes**

Run: `yarn workspace primer-a2ui-adapter test catalog.parity`
Expected: PASS — both component rows (`Text`, `Button`) and the `consoleLog` function row, plus the `anyComponent`/`anyFunction` coverage checks.

- [ ] **Step 5: Commit**

```bash
git add primer-a2ui-adapter/catalogs/v0.9.1/catalog.json primer-a2ui-adapter/src/catalog.parity.test.ts
git commit -m "feat(phase-2): add Button to catalog.json and harden parity test"
```

---

### Task 5: Whole-package + whole-repo green

Confirm the full task is green end-to-end and nothing downstream regressed.

**Files:** none (verification only).

- [ ] **Step 1: Full adapter suite**

Run: `yarn workspace primer-a2ui-adapter test`
Expected: PASS — Button schema (10) + ButtonView (5) + the existing Text schema (6) + TextView (4) + consoleLog (3) + catalog smoke (5) + parity (looped: Text + Button + consoleLog + coverage).

- [ ] **Step 2: Adapter typecheck + build**

Run: `yarn workspace primer-a2ui-adapter typecheck`
Expected: PASS.

Run: `yarn workspace primer-a2ui-adapter build`
Expected: PASS.

- [ ] **Step 3: Whole-repo orchestration**

Run: `yarn lint:all && yarn typecheck:all && yarn build:all && yarn test:all`
Expected: PASS across all workspaces. The `client` imports only `PRIMER_CATALOG_ID` (unchanged), so its build/tests remain green; no client edits are expected.

- [ ] **Step 4: Final commit (only if Step 3 surfaced a necessary fix)**

```bash
git add -A
git commit -m "chore(phase-2): keep whole repo green for Button catalog slice"
```

---

## Notes for the implementer

- **Per-component fidelity, not a uniform base.** `Button` carries `accessibility` because its real type (`& React.ButtonHTMLAttributes`) exposes the `aria-*` surface; `Text` does not, and is NOT retrofitted. Do not add a commons base to `Text`.
- **Bound state vs fixed config decides `Dynamic*` vs plain.** `disabled`/`loading`/`inactive` are bound runtime state (`DynamicBoolean`); `block`/`labelWrap`/`loadingAnnouncement` are fixed configuration (plain). This split is deliberate — see the `a2ui-sdk-design` skill.
- **Both action shapes are NOT distinguished here.** The binder resolves `action` to a single `() => void`; `event` vs `functionCall` routing (and the first real exercise of `consoleLog`) is renderer-level and lives in 2.3's client test space. 2.2 only proves the schema accepts both shapes and the component invokes the resolved closure on click.
- **`buildChild` composition is proven in 2.3.** `ButtonView`'s unit test passes plain `children`; the real `ComponentId`→`Text` composition is exercised when a full surface is rendered (2.3).
- **The `accessibility` cast is expected.** The binder resolves the nested `DynamicString`s to plain strings at runtime, but `ResolveA2uiProps` only resolves top-level keys, so `props.accessibility`'s inferred type still shows `DynamicString`. The cast to `ResolvedAccessibility` in the render wiring is correct and intentional (mirrors how 2.1's `text` is a resolved `string`).
- **No zod→`catalog.json` generator** — `catalog.json` is hand-authored and the parity test is the drift guard. The generator is Phase 3.
- **Deferred element-typed props** (`icon`/`leadingVisual`/`trailingVisual`/`trailingAction`) are intentionally omitted — captured in the schema comment and `_dev/docs/deferred-catalog-work.md` (Phase 4). Do not add them.
```
