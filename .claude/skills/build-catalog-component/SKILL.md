# Build Catalog Component

## Adapter section

This step consumes the component's decision doc — the header, the prop-surface table
(`prop | decision | synthetic? | A2UI type | description`), the functions list, and the
dropped/deferred props list — produced by the Design skill's adapter section. It
mechanically materializes the adapter artifacts and their tests from that table. It takes
**no human input**: every judgment call (carry/drop/defer, synthetic props, A2UI type
selection, descriptions) already happened in Design; this step transcribes. The
dropped/deferred rows produce no artifact of their own — they exist so the surface is
provably complete.

### The mechanical loop

Walk the decision doc's prop-surface table once and produce, in order, the nine adapter
artifacts below. Each carried row drives one line in the schema, one field in the render,
one property in the `catalog.json` entry, and one or more test cases — the same table,
read four times.

#### 1. Zod schema — `src/components/<name>/<name>.schema.ts`

Translate each carried table row into one line of a zod `.object()`, keyed on the row's
A2UI type:

- `Action` → `CommonSchemas.Action`
- `ComponentId` → `CommonSchemas.ComponentId`
- `AccessibilityAttributes` → `CommonSchemas.AccessibilityAttributes`
- `Dynamic*` (e.g. `DynamicBoolean`, `DynamicString`) → `CommonSchemas.Dynamic*`
- an enum decision → a local `z.enum([...])` (there is no `DynamicEnum`)
- a plain fixed-configuration type → `z.boolean()` / `z.string()` / `z.number()`

A row's decision cell carries its required-ness: `carry (required)` → no `.optional()`;
bare `carry` → `.optional()`. A row's `A2UI type` cell may also carry a `(default: X)`
annotation — it does **not** produce a zod `.default(X)`; the annotation surfaces only
in `catalog.json` (step 4). `ComponentApi` is **props-only** — it never includes `component` or `id` (the
framework owns those envelope fields) — and the `.object()` ends `.strict()`, forbidding
any prop outside the transcribed surface. Export `{name, schema}` as `const` plus the
inferred `<Name>Props` type.

Model (teaching-sized excerpt of `button.schema.ts`):

```ts
export const ButtonApi = {
  name: 'Button',
  schema: z
    .object({
      child: CommonSchemas.ComponentId,
      action: CommonSchemas.Action,
      variant: z.enum(['default', 'primary', 'invisible', 'danger', 'link']).optional(),
      disabled: CommonSchemas.DynamicBoolean.optional(),
      accessibility: CommonSchemas.AccessibilityAttributes.optional(),
    })
    .strict(),
} as const;

export type ButtonProps = z.infer<typeof ButtonApi.schema>;
```

Pair the schema with its test, `src/components/<name>/<name>.schema.test.ts`. Its cases
are derived mechanically from the same table — no case here is a judgment call:

- a minimal-valid parse using only the `carry (required)` rows
- a full-surface parse using every carried row
- one missing-required-prop rejection per `carry (required)` row
- one unknown-prop rejection (the schema's `.strict()`)
- one out-of-enum rejection per enum-typed row
- one data-binding acceptance per `Dynamic*`-typed row (e.g. `{path: '/foo'}`)

Model (teaching-sized excerpt of `button.schema.test.ts`):

```ts
import {describe, it, expect} from 'vitest';
import {ButtonApi} from './button.schema';

const action = {event: {name: 'submit'}};

describe('ButtonApi.schema', () => {
  it('accepts a minimal valid Button (child + action)', () => {
    expect(ButtonApi.schema.safeParse({child: 'label-1', action}).success).toBe(true);
  });

  it('requires child', () => {
    expect(ButtonApi.schema.safeParse({action}).success).toBe(false);
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
});
```

#### 2. Render — `src/components/<name>/<name>.tsx`

Two pieces: a plain-props presentational `View` component, and the
`createComponentImplementation` wiring that binds the resolved catalog props onto it.

The `View`'s prop types are the schema's types **after binder resolution** — mechanical
mappings derived from the table's A2UI types:

- `Action` → `onClick: () => void`
- `ComponentId` → dropped from the `View`'s own props; it arrives as built `children`
- `AccessibilityAttributes` → a local `Resolved*` shape (plain strings, not nested
  `Dynamic*`) — e.g. `{label?: string; description?: string}` — mapped onto the target
  primitive's `aria-*` props
- `Dynamic*` → the resolved primitive (`DynamicBoolean` → `boolean`, `DynamicString` →
  `string`)
- everything else passes through unchanged

Build-procedure notes, not optional style choices:

- **Pass resolved props explicitly in the wiring — never spread.** The binder-resolved
  props object carries extra setters beyond the plain values; spreading it onto the
  underlying primitive leaks those setters as unknown DOM/component props.
- **Cast `accessibility` to the resolved shape.** The binder resolves nested `Dynamic*`
  fields to plain strings at runtime, but the static inferred prop type still shows the
  unresolved `AccessibilityAttributes` shape (resolution is only proven one level deep).
  Cast `props.accessibility as ResolvedAccessibility | undefined` at the call site.
- **Tolerate the missing-`ThemeProvider` warning.** Rendering the underlying primitive
  outside its design system's theme context may log a warning; it does not affect the
  assertions this step's tests make and is not a defect to chase down.
- A `ComponentId` row's wiring calls `buildChild(props.<name>)` and passes the result as
  `children`.

Model (teaching-sized excerpt combining `button.tsx`'s `Action`/`ComponentId`/
`AccessibilityAttributes` mappings and `text.tsx`'s plain synthetic-value mapping):

```tsx
type ResolvedAccessibility = {label?: string; description?: string};

type ButtonViewProps = {
  variant?: 'default' | 'primary' | 'invisible' | 'danger' | 'link';
  disabled?: boolean;
  accessibility?: ResolvedAccessibility;
  onClick?: () => void;
  children?: ReactNode;
};

export function ButtonView({variant, disabled, accessibility, onClick, children}: ButtonViewProps) {
  return (
    <PrimerButton
      variant={variant}
      disabled={disabled}
      aria-label={accessibility?.label}
      aria-description={accessibility?.description}
      onClick={onClick}
    >
      {children}
    </PrimerButton>
  );
}

export const ButtonComponent = createComponentImplementation(ButtonApi, ({props, buildChild}) => (
  <ButtonView
    variant={props.variant}
    disabled={props.disabled}
    accessibility={props.accessibility as ResolvedAccessibility | undefined}
    onClick={props.action}
  >
    {buildChild(props.child)}
  </ButtonView>
));
```

A component with no `ComponentId`/`Action` row (e.g. `Text`, whose synthetic content prop
is a plain `DynamicString`) skips `buildChild`/`onClick` entirely — the resolved value
passes straight through:

```tsx
export const TextComponent = createComponentImplementation(TextApi, ({props}) => (
  <TextView text={props.text} as={props.as} />
));
```

Pair the render with its test, `src/components/<name>/<name>.test.tsx`. It renders the
`View` directly with resolved plain props — never through the renderer/binder — and
asserts:

- the content/label renders (a `ComponentId`/synthetic row's built child, or a synthetic
  value row's resolved value)
- the resolved `onClick` fires on interaction, when the table has an `Action` row
- representative prop passthrough (a couple of the remaining carried rows, resolved to
  plain props)

The missing-`ThemeProvider` warning tolerance from the render notes applies here too.

Model (teaching-sized excerpt of `button.test.tsx`):

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

  it('honors disabled', () => {
    render(<ButtonView disabled>Save</ButtonView>);
    expect(screen.getByRole('button')).toBeDisabled();
  });
});
```

#### 3. Folder barrel — `src/components/<name>/index.ts`

Re-export the component implementation and its `Api` (plus the inferred props type) from
the component folder's barrel — `src/catalog.ts` imports the component from this barrel,
not from the `.tsx`/`.schema.ts` files directly.

Model (`src/components/button/index.ts`):

```ts
export {ButtonComponent} from './button';
export {ButtonApi} from './button.schema';
export type {ButtonProps} from './button.schema';
```

#### 4. `catalog.json` entry — `catalogs/<version>/catalog.json`

Add a `components.<Name>` entry whose `properties` mirror the schema key-for-key, keyed
the same way as the zod translation:

- `Action` / `ComponentId` / `AccessibilityAttributes` / `Dynamic*` → `{"$ref":
  "<hosted common_types base>#/$defs/<Type>"}`
- an enum decision → `{"type": "string", "enum": [...]}`
- a plain fixed-configuration type → `{"type": "<string|boolean|number>"}`

Every property object also carries a `"description"` — **copied verbatim from the
decision doc's description column, never re-authored at build time.** Likewise, the
entry's own top-level `"description"` is copied verbatim from the decision doc's
component-level description. When a row's
`A2UI type` cell carries a `(default: X)` annotation, add a `"default": X` key to that
property's object. Add the framework `"component"` discriminator property
(`{"const": "<Name>"}`), set `"required"` to the rows marked `carry (required)` in the
decision doc plus `"component"`, and close the object with
`"unevaluatedProperties": false`. Finally, add `{"$ref": "#/components/<Name>"}` to
`$defs.anyComponent.oneOf`.

Model (excerpt of the `Button` entry in `catalog.json`):

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
    "variant": {
      "type": "string",
      "enum": ["default", "primary", "invisible", "danger", "link"],
      "default": "default",
      "description": "The visual style. 'primary' marks the main call-to-action; 'danger' a destructive action."
    }
  },
  "required": ["component", "child", "action"],
  "unevaluatedProperties": false
}
```

#### 5. Parity registry entry — `src/catalog.parity.test.ts`

Add the component's `<Name>Api` to the `COMPONENTS` registry map:
`const COMPONENTS = {Text: TextApi, Button: ButtonApi} as const;`. The existing
`describe.each(Object.entries(COMPONENTS))` loop and the `anyComponent` coverage check
already cover the new entry — there is no per-component assertion to write.

#### 6. Catalog registration — `src/catalog.ts`

Import the component implementation and add it to the `new Catalog(...)` components
array:

```ts
export const CATALOG = new Catalog<ReactComponentImplementation>(
  CATALOG_ID,
  [TextComponent, ButtonComponent],
  [consoleLog],
);
```

#### 7. Catalog smoke test — `src/catalog.test.ts`

Add one assertion inside the existing `describe('CATALOG', …)` block:

```ts
it('registers the Button component', () => {
  expect(CATALOG.components.has('Button')).toBe(true);
});
```

### Optional: local-function sub-loop

Run this sub-loop only when the decision doc's functions list is non-empty; otherwise
skip it entirely.

For each functions-list entry (`name`, `args`, `returnType`):

1. **Function implementation** — `src/functions/<name>.ts`: `createFunctionImplementation`
   with `{name, returnType, schema}`. The zod arg schema types the **resolved** value
   (e.g. `z.object({message: z.string()})`) — the wire form in `catalog.json` types the
   same arg as the corresponding `Dynamic*` (e.g. `DynamicString`), since it may still be
   a literal or a binding at the point it's dispatched.

   Model (`console-log.ts`):

   ```ts
   export const consoleLog = createFunctionImplementation(
     {name: 'consoleLog', returnType: 'void', schema: z.object({message: z.string()})},
     ({message}) => {
       console.log('[A2UI]', message);
     },
   );
   ```

2. **Function unit test** — `src/functions/<name>.test.ts`, paired with the
   implementation. Asserts:

   - the declared api — `name` and `returnType` match the functions-list entry
   - arg validation from the zod schema — a valid-args parse and a missing-required-arg
     rejection
   - the effect on `execute`

   Model (`console-log.test.ts`):

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

3. **Catalog registration** — add the function to the `new Catalog(...)` functions array
   in `src/catalog.ts` (alongside the components array).

4. **`catalog.json`** — add a `functions.<name>` entry (`call` discriminator const,
   `args` object typed with the wire `Dynamic*` per arg, `returnType` const,
   `unevaluatedProperties: false`) and add its `$ref` to `$defs.anyFunction.oneOf`. The
   entry's top-level `"description"` and each arg's `"description"` are copied verbatim
   from the decision doc's function-level and per-arg descriptions, never re-authored at
   build time — same rule as the component and prop descriptions above.

   Model (`functions.consoleLog` in `catalog.json`):

   ```json
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
   ```

5. **Parity registry entry** — add the function to the `FUNCTIONS` registry map in
   `src/catalog.parity.test.ts`: `const FUNCTIONS = {consoleLog} as const;`. The existing
   `describe.each(Object.entries(FUNCTIONS))` loop and the `anyFunction` coverage check
   already cover it.
