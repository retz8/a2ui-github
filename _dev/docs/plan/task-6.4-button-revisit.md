# Button revisit (task 6.4) Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Carry Button's four deferred element-typed slots (`icon`, `leadingVisual`, `trailingVisual`, `trailingAction`) as optional `ComponentId` props now that `Icon` (6.2) ships, make `child` optional for icon-only mode, and backfill Button's fixtures to the exhaustive per-prop standard.

**Architecture:** The four slots are element-typed in Primer; their faithful A2UI translation is a `ComponentId` child (decision 2). The adapter schema adds them as optional `CommonSchemas.ComponentId`; the render resolves each via `buildChild` (guarded on presence) and passes the resulting element into the matching Primer slot prop. `child` becomes optional to mirror Primer's icon-only precedence (decision 3). No cross-field validation is added — Primer arbitrates precedence at render (decisions 3 & 4). The client gains one fixture per newly-carried prop plus one per backfilled prop-walk gap.

**Tech Stack:** TypeScript, Zod (`@a2ui/web_core/v0_9` `CommonSchemas`), `@a2ui/react/v0_9` (`createComponentImplementation`, `buildChild`), `@primer/react` `Button`, Vitest + Testing Library, Playwright (visual baselines — blessed separately, not gated here).

## Global Constraints

- **Governing principle (spec decision 1):** faithful 1:1 Primer→A2UI mapping, no per-prop editorializing. A prop is dropped/deferred only for a genuine representational block.
- **Carry all four element-typed slots (decision 2):** `icon`, `leadingVisual`, `trailingVisual`, `trailingAction` — all optional `ComponentId` under their verbatim Primer names. `trailingAction` is carried as a positioned visual slot (not held back for lacking a nested-interactive leaf).
- **Icon-only mode (decision 3):** `child` becomes optional; mirror Primer's render precedence exactly; add NO cross-field validation (no "exactly one of {child, icon}", no rejecting `icon` + visuals).
- **`count` / `trailingVisual` precedence (decision 4):** both props stay independent in the schema; Primer arbitrates at render. Documented, not enforced.
- **Catalog `description` prose targets the agent (a2ui-sdk-design skill):** describe semantics; never name the implementing design system (no "Primer") in a description. The prop surface + enum values stay a faithful 1:1 of the real API.
- **Bound-state-vs-config rule:** the four slots are `ComponentId` references (structural), not `Dynamic*`.
- **Adapter parity invariant:** `catalog.json` component property-name set, required set, and enum sets must exactly match the zod schema (enforced by `catalog.parity.test.ts`). Schema and `catalog.json` change together.
- **`.strict()` on the zod schema forbids any prop outside the surface.**
- **Docs on `main` only (project rule):** the decision-doc reconciliation (`_dev/docs/new-components/button.md`) and deferral-register closure (`_dev/docs/deferred-catalog-work.md`) are `_dev/` docs edited on `main`, NOT on this branch. This plan does not touch them; that reconciliation is a main-side follow-up.
- **Gates:** `yarn verify:all` = build → typecheck → lint → format:check → test (vitest). Playwright e2e/visual baselines are NOT part of the gates; baseline PNGs are `-chromium-darwin` and blessed on a mac (6.2 shipped Icon fixtures the same way — fixtures + spec registration in the PR, baselines blessed separately).

---

### Task 1: Adapter contract — schema + catalog.json + schema tests

**Files:**
- Modify: `primer-a2ui-adapter/src/components/button/button.schema.ts`
- Modify: `primer-a2ui-adapter/catalogs/v0.9.1/catalog.json` (the `Button` component entry)
- Test: `primer-a2ui-adapter/src/components/button/button.schema.test.ts`

**Interfaces:**
- Consumes: `CommonSchemas.ComponentId` (from `@a2ui/web_core/v0_9`) — the type already used for `child`.
- Produces: `ButtonApi.schema` gains optional `icon`, `leadingVisual`, `trailingVisual`, `trailingAction` (all `CommonSchemas.ComponentId.optional()`); `child` becomes `CommonSchemas.ComponentId.optional()`. Render (Task 2) reads `props.icon` / `props.leadingVisual` / `props.trailingVisual` / `props.trailingAction` / `props.child` as `string | undefined`.

- [ ] **Step 1: Update the schema tests to the new surface**

Replace the body of `button.schema.test.ts` with (the `requires child` case is removed because `child` is now optional; two new cases assert the slots and icon-only mode):

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
      icon: 'glyph',
      leadingVisual: 'lv',
      trailingVisual: 'tv',
      trailingAction: 'ta',
      accessibility: {label: 'Submit', description: 'Submits the form'},
    });
    expect(result.success).toBe(true);
  });

  it('accepts the four element-typed slot props as ComponentIds', () => {
    expect(
      ButtonApi.schema.safeParse({
        child: 'l',
        action,
        icon: 'i',
        leadingVisual: 'lv',
        trailingVisual: 'tv',
        trailingAction: 'ta',
      }).success,
    ).toBe(true);
  });

  it('accepts a Button with no child (icon-only mode; child now optional)', () => {
    expect(ButtonApi.schema.safeParse({action, icon: 'glyph'}).success).toBe(true);
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

- [ ] **Step 2: Run the schema tests to verify they fail**

Run: `yarn workspace primer-a2ui-adapter run test button.schema`
Expected: FAIL — icon-only case rejected (child still required) and the slot props rejected by `.strict()`.

- [ ] **Step 3: Update the schema**

In `button.schema.ts`, make `child` optional, add the four slots, and refresh the doc comment. The `child` line becomes `CommonSchemas.ComponentId.optional()`; insert the four slots after `accessibility`. Replace the deferral note in the doc comment with a "carried in 6.4" note. Final schema object:

```ts
  schema: z
    .object({
      child: CommonSchemas.ComponentId.optional(),
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
      icon: CommonSchemas.ComponentId.optional(),
      leadingVisual: CommonSchemas.ComponentId.optional(),
      trailingVisual: CommonSchemas.ComponentId.optional(),
      trailingAction: CommonSchemas.ComponentId.optional(),
      accessibility: CommonSchemas.AccessibilityAttributes.optional(),
    })
    .strict(),
```

Update the doc-comment block. Replace the `- child is ...` bullet and the `Deferred to Phase 5 ...` paragraph with:

```ts
 * - `child` is the synthetic content reference (the label); it is OPTIONAL because Primer
 *   renders the button icon-only when `icon` is set (label + visuals discarded, `icon` wins).
 * - `icon`/`leadingVisual`/`trailingVisual`/`trailingAction` are Primer's element-typed slots;
 *   the faithful A2UI translation of an element slot is a ComponentId child (each may reference
 *   an Icon today or another leaf later — the agent chooses). `trailingAction` is a positioned
 *   visual slot (Primer renders it as the always-last element). Carried in 6.4 now that Icon
 *   (6.2) ships; see _dev/docs/spec/task-6.4-button-revisit.md.
 * - Render precedence (icon-only wins; explicit `trailingVisual` wins over `count`) mirrors
 *   Primer and is NOT enforced by the schema — no cross-field validation (decisions 3 & 4).
```

- [ ] **Step 4: Update catalog.json to match**

In `catalogs/v0.9.1/catalog.json`, edit the `Button` component (`components.Button`):

1. Change `required` from `["component", "child", "action"]` to `["component", "action"]`.
2. Update the `child` description to note optionality:
   `"The ID of the component used as the button's label. Use a Text component; do not define it inline. Optional: omit it when `icon` is set (the button renders icon-only)."`
3. Add these four properties (after `accessibility`, each a `ComponentId` `$ref` — same `$ref` string the `child` prop uses: `https://a2ui.org/specification/v0_9/common_types.json#/$defs/ComponentId`):

```json
    "icon": {
      "$ref": "https://a2ui.org/specification/v0_9/common_types.json#/$defs/ComponentId",
      "description": "The ID of an icon component that renders the button in icon-only mode. When set, the label and any visuals are not shown. Reference an Icon component; do not define it inline."
    },
    "leadingVisual": {
      "$ref": "https://a2ui.org/specification/v0_9/common_types.json#/$defs/ComponentId",
      "description": "The ID of a component shown before the label, typically an Icon. Reference the component; do not define it inline."
    },
    "trailingVisual": {
      "$ref": "https://a2ui.org/specification/v0_9/common_types.json#/$defs/ComponentId",
      "description": "The ID of a component shown after the label, typically an Icon. Reference the component; do not define it inline."
    },
    "trailingAction": {
      "$ref": "https://a2ui.org/specification/v0_9/common_types.json#/$defs/ComponentId",
      "description": "The ID of a component rendered as the last element in the button, after any trailing visual. Reference the component; do not define it inline."
    },
```

- [ ] **Step 5: Run adapter schema + parity tests**

Run: `yarn workspace primer-a2ui-adapter run test`
Expected: PASS — `button.schema.test.ts` all green; `catalog.parity.test.ts` Button property-name set + required set now match (zod required = `["action"]`; catalog required minus envelope = `["action"]`).

- [ ] **Step 6: Commit**

```bash
git add primer-a2ui-adapter/src/components/button/button.schema.ts primer-a2ui-adapter/src/components/button/button.schema.test.ts primer-a2ui-adapter/catalogs/v0.9.1/catalog.json
git commit -m "feat(phase-6): carry Button element-typed slots in schema + catalog.json"
```

---

### Task 2: Adapter render — button.tsx + render tests

**Files:**
- Modify: `primer-a2ui-adapter/src/components/button/button.tsx`
- Test: `primer-a2ui-adapter/src/components/button/button.test.tsx`

**Interfaces:**
- Consumes: `ButtonApi` schema from Task 1 (`props.icon` / `props.leadingVisual` / `props.trailingVisual` / `props.trailingAction` / `props.child` are `string | undefined`); `buildChild(id: string) => ReactNode` from `createComponentImplementation`'s render arg.
- Produces: `ButtonView` gains optional `icon` / `leadingVisual` / `trailingVisual` / `trailingAction` props (each `ReactNode`); `children` stays optional. `ButtonComponent` resolves each slot via `buildChild` guarded on presence.

- [ ] **Step 1: Add render tests for the slots and icon-only mode**

Append these cases to `button.test.tsx` (inside the existing `describe('ButtonView', ...)`):

```tsx
  it('renders a leadingVisual alongside the label', () => {
    render(<ButtonView leadingVisual={<span data-testid="lv">LV</span>}>Save</ButtonView>);
    expect(screen.getByTestId('lv')).toBeInTheDocument();
    expect(screen.getByRole('button', {name: /Save/})).toBeInTheDocument();
  });

  it('renders a trailingVisual alongside the label', () => {
    render(<ButtonView trailingVisual={<span data-testid="tv">TV</span>}>Save</ButtonView>);
    expect(screen.getByTestId('tv')).toBeInTheDocument();
  });

  it('renders a trailingAction as an element (Primer accepts it via react-is isElement)', () => {
    render(
      <ButtonView
        trailingVisual={<span data-testid="tv">TV</span>}
        trailingAction={<span data-testid="ta">TA</span>}
      >
        Save
      </ButtonView>,
    );
    expect(screen.getByTestId('ta')).toBeInTheDocument();
  });

  it('renders icon-only, discarding the label (Primer icon precedence)', () => {
    render(<ButtonView icon={<span data-testid="icon">I</span>}>Hidden</ButtonView>);
    expect(screen.getByTestId('icon')).toBeInTheDocument();
    expect(screen.queryByText('Hidden')).not.toBeInTheDocument();
  });

  it('renders with no child (icon-only mode has no label)', () => {
    render(<ButtonView icon={<span data-testid="icon">I</span>} accessibility={{label: 'Star'}} />);
    expect(screen.getByRole('button', {name: 'Star'})).toBeInTheDocument();
    expect(screen.getByTestId('icon')).toBeInTheDocument();
  });
```

- [ ] **Step 2: Run the render tests to verify they fail**

Run: `yarn workspace primer-a2ui-adapter run test button.test`
Expected: FAIL — `ButtonView` does not yet accept `icon` / `leadingVisual` / `trailingVisual` / `trailingAction` (TS + assertion failures).

- [ ] **Step 3: Update the render**

Replace `button.tsx` with (adds the four slot props typed `ReactNode`; casts each to the Primer-accepted slot type at the `PrimerButton` boundary — `icon`/`leadingVisual`/`trailingVisual` accept `ReactElement`, `trailingAction` is typed `ElementType`-only but renders an element at runtime via `react-is` `isElement`; `ButtonComponent` resolves each slot with a presence guard and makes `child` optional):

```tsx
import type {ReactElement, ElementType, ReactNode} from 'react';
import {Button as PrimerButton} from '@primer/react';
import {createComponentImplementation} from '@a2ui/react/v0_9';
import {ButtonApi} from './button.schema';

/** Resolved accessibility: nested DynamicStrings are plain strings after the binder resolves them. */
type ResolvedAccessibility = {label?: string; description?: string};

/** Resolved props: Dynamic* are resolved to primitives, action -> onClick, ComponentId slots -> built children. */
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
  count?: string; // Primer accepts number | string; the binder only ever resolves DynamicString to a string here.
  accessibility?: ResolvedAccessibility;
  onClick?: () => void;
  // Element-typed Primer slots, each built from a ComponentId child. Primer's icon/leading/
  // trailing visual accept a ReactElement; trailingAction is typed ElementType-only but renders
  // an element at runtime via react-is isElement (see ButtonBase renderModuleVisual).
  icon?: ReactNode;
  leadingVisual?: ReactNode;
  trailingVisual?: ReactNode;
  trailingAction?: ReactNode;
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
  icon,
  leadingVisual,
  trailingVisual,
  trailingAction,
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
      icon={icon as ReactElement | undefined}
      leadingVisual={leadingVisual as ReactElement | undefined}
      trailingVisual={trailingVisual as ReactElement | undefined}
      trailingAction={trailingAction as unknown as ElementType | undefined}
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
 * - `props.child` (optional) and the four ComponentId slots are resolved via buildChild,
 *   each guarded on presence (buildChild requires a string id). child is omitted in
 *   Primer's icon-only mode.
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
    icon={props.icon ? buildChild(props.icon) : undefined}
    leadingVisual={props.leadingVisual ? buildChild(props.leadingVisual) : undefined}
    trailingVisual={props.trailingVisual ? buildChild(props.trailingVisual) : undefined}
    trailingAction={props.trailingAction ? buildChild(props.trailingAction) : undefined}
  >
    {props.child ? buildChild(props.child) : undefined}
  </ButtonView>
));
```

- [ ] **Step 4: Run the render tests to verify they pass**

Run: `yarn workspace primer-a2ui-adapter run test button.test`
Expected: PASS — all `ButtonView` cases green (existing + five new).

- [ ] **Step 5: Typecheck the adapter**

Run: `yarn workspace primer-a2ui-adapter run typecheck`
Expected: PASS — no TS errors (the slot casts satisfy Primer's prop types).

- [ ] **Step 6: Commit**

```bash
git add primer-a2ui-adapter/src/components/button/button.tsx primer-a2ui-adapter/src/components/button/button.test.tsx
git commit -m "feat(phase-6): render Button element-typed slots + optional child"
```

---

### Task 3: Client fixtures backfill + new-slot fixtures + registration

**Files:**
- Create: `client/src/fixtures/button-sizes.ts`, `button-aligncontent.ts`, `button-disabled.ts`, `button-inactive.ts`, `button-loading.ts`, `button-block.ts`, `button-labelwrap.ts`, `button-count.ts`, `button-icon.ts`, `button-leading-visual.ts`, `button-trailing-visual.ts`, `button-trailing-action.ts`
- Modify: `client/src/fixtures/index.ts`
- Modify: `client/e2e/visual.spec.ts`

**Interfaces:**
- Consumes: `Fixture` type (`{name: string; messages: A2uiMessage[]}`) from `./types`; `CATALOG_ID` from `primer-a2ui-adapter`; the Button schema surface from Tasks 1-2 (`icon`/`leadingVisual`/`trailingVisual`/`trailingAction` as ComponentId strings; `child` optional); the shipped `Icon` component (`{component: 'Icon', name: <ICON_NAMES value>}`).
- Produces: 12 exported fixtures registered in `FIXTURES` and named in the Playwright `FIXTURE_NAMES` list. No new gated test asserts over them (client vitest `App.test.tsx` does not iterate fixtures); the baselines are blessed on a mac out-of-band.

Fixture message shape follows the shipped `button-variants.ts` (multi-surface enum walk via `flatMap`) and `button-event.ts` (single surface). `functionCall` actions use `{functionCall: {call: 'consoleLog', args: {message: <str>}, returnType: 'void'}}`; `event` actions use `{event: {name: 'noop', context: {}}}`. Icon references use valid `ICON_NAMES` values.

- [ ] **Step 1: Create the eight prop-walk backfill fixtures**

`client/src/fixtures/button-sizes.ts`:

```ts
import {CATALOG_ID} from 'primer-a2ui-adapter';
import type {A2uiMessage} from '@a2ui/web_core/v0_9';
import type {Fixture} from './types';

const SIZES = ['small', 'medium', 'large'] as const;

function sizeSurface(size: (typeof SIZES)[number]): A2uiMessage[] {
  const surfaceId = `size-${size}`;
  return [
    {version: 'v0.9', createSurface: {surfaceId, catalogId: CATALOG_ID}},
    {
      version: 'v0.9',
      updateComponents: {
        surfaceId,
        components: [
          {
            id: 'root',
            component: 'Button',
            child: 'label',
            size,
            action: {functionCall: {call: 'consoleLog', args: {message: size}, returnType: 'void'}},
          },
          {id: 'label', component: 'Text', text: size},
        ],
      },
    },
  ];
}

export const buttonSizesFixture: Fixture = {
  name: 'button-sizes',
  messages: SIZES.flatMap(sizeSurface),
};
```

`client/src/fixtures/button-aligncontent.ts` (each surface is a `block` button so alignment is observable — decision 5 keeps this visual-free):

```ts
import {CATALOG_ID} from 'primer-a2ui-adapter';
import type {A2uiMessage} from '@a2ui/web_core/v0_9';
import type {Fixture} from './types';

const ALIGNMENTS = ['start', 'center'] as const;

function alignSurface(alignContent: (typeof ALIGNMENTS)[number]): A2uiMessage[] {
  const surfaceId = `align-${alignContent}`;
  return [
    {version: 'v0.9', createSurface: {surfaceId, catalogId: CATALOG_ID}},
    {
      version: 'v0.9',
      updateComponents: {
        surfaceId,
        components: [
          {
            id: 'root',
            component: 'Button',
            child: 'label',
            alignContent,
            block: true,
            action: {
              functionCall: {call: 'consoleLog', args: {message: alignContent}, returnType: 'void'},
            },
          },
          {id: 'label', component: 'Text', text: alignContent},
        ],
      },
    },
  ];
}

export const buttonAligncontentFixture: Fixture = {
  name: 'button-aligncontent',
  messages: ALIGNMENTS.flatMap(alignSurface),
};
```

`client/src/fixtures/button-disabled.ts`:

```ts
import {CATALOG_ID} from 'primer-a2ui-adapter';
import type {Fixture} from './types';

export const buttonDisabledFixture: Fixture = {
  name: 'button-disabled',
  messages: [
    {version: 'v0.9', createSurface: {surfaceId: 'button-disabled', catalogId: CATALOG_ID}},
    {
      version: 'v0.9',
      updateComponents: {
        surfaceId: 'button-disabled',
        components: [
          {
            id: 'root',
            component: 'Button',
            child: 'label',
            disabled: true,
            action: {event: {name: 'noop', context: {}}},
          },
          {id: 'label', component: 'Text', text: 'Disabled'},
        ],
      },
    },
  ],
};
```

`client/src/fixtures/button-inactive.ts`:

```ts
import {CATALOG_ID} from 'primer-a2ui-adapter';
import type {Fixture} from './types';

export const buttonInactiveFixture: Fixture = {
  name: 'button-inactive',
  messages: [
    {version: 'v0.9', createSurface: {surfaceId: 'button-inactive', catalogId: CATALOG_ID}},
    {
      version: 'v0.9',
      updateComponents: {
        surfaceId: 'button-inactive',
        components: [
          {
            id: 'root',
            component: 'Button',
            child: 'label',
            inactive: true,
            action: {event: {name: 'noop', context: {}}},
          },
          {id: 'label', component: 'Text', text: 'Inactive'},
        ],
      },
    },
  ],
};
```

`client/src/fixtures/button-loading.ts` (carries `loadingAnnouncement` — the coupled prop):

```ts
import {CATALOG_ID} from 'primer-a2ui-adapter';
import type {Fixture} from './types';

export const buttonLoadingFixture: Fixture = {
  name: 'button-loading',
  messages: [
    {version: 'v0.9', createSurface: {surfaceId: 'button-loading', catalogId: CATALOG_ID}},
    {
      version: 'v0.9',
      updateComponents: {
        surfaceId: 'button-loading',
        components: [
          {
            id: 'root',
            component: 'Button',
            child: 'label',
            loading: true,
            loadingAnnouncement: 'Saving changes…',
            action: {event: {name: 'noop', context: {}}},
          },
          {id: 'label', component: 'Text', text: 'Loading'},
        ],
      },
    },
  ],
};
```

`client/src/fixtures/button-block.ts`:

```ts
import {CATALOG_ID} from 'primer-a2ui-adapter';
import type {Fixture} from './types';

export const buttonBlockFixture: Fixture = {
  name: 'button-block',
  messages: [
    {version: 'v0.9', createSurface: {surfaceId: 'button-block', catalogId: CATALOG_ID}},
    {
      version: 'v0.9',
      updateComponents: {
        surfaceId: 'button-block',
        components: [
          {
            id: 'root',
            component: 'Button',
            child: 'label',
            block: true,
            action: {functionCall: {call: 'consoleLog', args: {message: 'block'}, returnType: 'void'}},
          },
          {id: 'label', component: 'Text', text: 'Full width'},
        ],
      },
    },
  ],
};
```

`client/src/fixtures/button-labelwrap.ts`:

```ts
import {CATALOG_ID} from 'primer-a2ui-adapter';
import type {Fixture} from './types';

export const buttonLabelwrapFixture: Fixture = {
  name: 'button-labelwrap',
  messages: [
    {version: 'v0.9', createSurface: {surfaceId: 'button-labelwrap', catalogId: CATALOG_ID}},
    {
      version: 'v0.9',
      updateComponents: {
        surfaceId: 'button-labelwrap',
        components: [
          {
            id: 'root',
            component: 'Button',
            child: 'label',
            labelWrap: true,
            action: {
              functionCall: {call: 'consoleLog', args: {message: 'labelWrap'}, returnType: 'void'},
            },
          },
          {
            id: 'label',
            component: 'Text',
            text: 'This is a very long button label that should wrap onto multiple lines',
          },
        ],
      },
    },
  ],
};
```

`client/src/fixtures/button-count.ts`:

```ts
import {CATALOG_ID} from 'primer-a2ui-adapter';
import type {Fixture} from './types';

export const buttonCountFixture: Fixture = {
  name: 'button-count',
  messages: [
    {version: 'v0.9', createSurface: {surfaceId: 'button-count', catalogId: CATALOG_ID}},
    {
      version: 'v0.9',
      updateComponents: {
        surfaceId: 'button-count',
        components: [
          {
            id: 'root',
            component: 'Button',
            child: 'label',
            count: '42',
            action: {functionCall: {call: 'consoleLog', args: {message: 'count'}, returnType: 'void'}},
          },
          {id: 'label', component: 'Text', text: 'Watch'},
        ],
      },
    },
  ],
};
```

- [ ] **Step 2: Create the four new-slot fixtures**

`client/src/fixtures/button-icon.ts` (icon-only: no `child`; `accessibility.label` for the accessible name):

```ts
import {CATALOG_ID} from 'primer-a2ui-adapter';
import type {Fixture} from './types';

export const buttonIconFixture: Fixture = {
  name: 'button-icon',
  messages: [
    {version: 'v0.9', createSurface: {surfaceId: 'button-icon', catalogId: CATALOG_ID}},
    {
      version: 'v0.9',
      updateComponents: {
        surfaceId: 'button-icon',
        components: [
          {
            id: 'root',
            component: 'Button',
            icon: 'glyph',
            accessibility: {label: 'Star'},
            action: {functionCall: {call: 'consoleLog', args: {message: 'icon'}, returnType: 'void'}},
          },
          {id: 'glyph', component: 'Icon', name: 'star'},
        ],
      },
    },
  ],
};
```

`client/src/fixtures/button-leading-visual.ts`:

```ts
import {CATALOG_ID} from 'primer-a2ui-adapter';
import type {Fixture} from './types';

export const buttonLeadingVisualFixture: Fixture = {
  name: 'button-leading-visual',
  messages: [
    {version: 'v0.9', createSurface: {surfaceId: 'button-leading-visual', catalogId: CATALOG_ID}},
    {
      version: 'v0.9',
      updateComponents: {
        surfaceId: 'button-leading-visual',
        components: [
          {
            id: 'root',
            component: 'Button',
            child: 'label',
            leadingVisual: 'glyph',
            action: {
              functionCall: {call: 'consoleLog', args: {message: 'leadingVisual'}, returnType: 'void'},
            },
          },
          {id: 'label', component: 'Text', text: 'Comment'},
          {id: 'glyph', component: 'Icon', name: 'comment'},
        ],
      },
    },
  ],
};
```

`client/src/fixtures/button-trailing-visual.ts`:

```ts
import {CATALOG_ID} from 'primer-a2ui-adapter';
import type {Fixture} from './types';

export const buttonTrailingVisualFixture: Fixture = {
  name: 'button-trailing-visual',
  messages: [
    {version: 'v0.9', createSurface: {surfaceId: 'button-trailing-visual', catalogId: CATALOG_ID}},
    {
      version: 'v0.9',
      updateComponents: {
        surfaceId: 'button-trailing-visual',
        components: [
          {
            id: 'root',
            component: 'Button',
            child: 'label',
            trailingVisual: 'glyph',
            action: {
              functionCall: {call: 'consoleLog', args: {message: 'trailingVisual'}, returnType: 'void'},
            },
          },
          {id: 'label', component: 'Text', text: 'Next'},
          {id: 'glyph', component: 'Icon', name: 'chevron-right'},
        ],
      },
    },
  ],
};
```

`client/src/fixtures/button-trailing-action.ts` (carries a `trailingVisual` too, so the baseline captures `trailingAction`'s distinct always-last position — decision 5):

```ts
import {CATALOG_ID} from 'primer-a2ui-adapter';
import type {Fixture} from './types';

export const buttonTrailingActionFixture: Fixture = {
  name: 'button-trailing-action',
  messages: [
    {version: 'v0.9', createSurface: {surfaceId: 'button-trailing-action', catalogId: CATALOG_ID}},
    {
      version: 'v0.9',
      updateComponents: {
        surfaceId: 'button-trailing-action',
        components: [
          {
            id: 'root',
            component: 'Button',
            child: 'label',
            trailingVisual: 'tv',
            trailingAction: 'ta',
            action: {
              functionCall: {call: 'consoleLog', args: {message: 'trailingAction'}, returnType: 'void'},
            },
          },
          {id: 'label', component: 'Text', text: 'Menu'},
          {id: 'tv', component: 'Icon', name: 'kebab-horizontal'},
          {id: 'ta', component: 'Icon', name: 'triangle-down'},
        ],
      },
    },
  ],
};
```

- [ ] **Step 3: Register all twelve fixtures in `index.ts`**

Add imports, re-exports, and `FIXTURES` array entries for all twelve new fixtures. The final `client/src/fixtures/index.ts` reads:

```ts
import {buttonEventFixture} from './button-event';
import {buttonFnFixture} from './button-fn';
import {buttonVariantsFixture} from './button-variants';
import {buttonSizesFixture} from './button-sizes';
import {buttonAligncontentFixture} from './button-aligncontent';
import {buttonDisabledFixture} from './button-disabled';
import {buttonInactiveFixture} from './button-inactive';
import {buttonLoadingFixture} from './button-loading';
import {buttonBlockFixture} from './button-block';
import {buttonLabelwrapFixture} from './button-labelwrap';
import {buttonCountFixture} from './button-count';
import {buttonIconFixture} from './button-icon';
import {buttonLeadingVisualFixture} from './button-leading-visual';
import {buttonTrailingVisualFixture} from './button-trailing-visual';
import {buttonTrailingActionFixture} from './button-trailing-action';
import {iconNamesFixture} from './icon-names';
import {iconSizesFixture} from './icon-sizes';
import {iconFillsFixture} from './icon-fills';
import {textAsFixture} from './text-as';
import {textBoundFixture} from './text-bound';
import {textSizesFixture} from './text-sizes';
import {textWeightsFixture} from './text-weights';
import {textWhitespaceFixture} from './text-whitespace';
import {textFixture} from './text';
import type {Fixture} from './types';

export type {Fixture} from './types';

export {textFixture} from './text';
export {textBoundFixture} from './text-bound';
export {textSizesFixture} from './text-sizes';
export {textWeightsFixture} from './text-weights';
export {textAsFixture} from './text-as';
export {textWhitespaceFixture} from './text-whitespace';
export {buttonFnFixture} from './button-fn';
export {buttonEventFixture} from './button-event';
export {buttonVariantsFixture} from './button-variants';
export {buttonSizesFixture} from './button-sizes';
export {buttonAligncontentFixture} from './button-aligncontent';
export {buttonDisabledFixture} from './button-disabled';
export {buttonInactiveFixture} from './button-inactive';
export {buttonLoadingFixture} from './button-loading';
export {buttonBlockFixture} from './button-block';
export {buttonLabelwrapFixture} from './button-labelwrap';
export {buttonCountFixture} from './button-count';
export {buttonIconFixture} from './button-icon';
export {buttonLeadingVisualFixture} from './button-leading-visual';
export {buttonTrailingVisualFixture} from './button-trailing-visual';
export {buttonTrailingActionFixture} from './button-trailing-action';
export {iconNamesFixture} from './icon-names';
export {iconSizesFixture} from './icon-sizes';
export {iconFillsFixture} from './icon-fills';

export const FIXTURES: Fixture[] = [
  textFixture,
  textBoundFixture,
  textSizesFixture,
  textWeightsFixture,
  textAsFixture,
  textWhitespaceFixture,
  buttonFnFixture,
  buttonEventFixture,
  buttonVariantsFixture,
  buttonSizesFixture,
  buttonAligncontentFixture,
  buttonDisabledFixture,
  buttonInactiveFixture,
  buttonLoadingFixture,
  buttonBlockFixture,
  buttonLabelwrapFixture,
  buttonCountFixture,
  buttonIconFixture,
  buttonLeadingVisualFixture,
  buttonTrailingVisualFixture,
  buttonTrailingActionFixture,
  iconNamesFixture,
  iconSizesFixture,
  iconFillsFixture,
];

export function getFixture(name: string | null): Fixture {
  return FIXTURES.find(f => f.name === name) ?? FIXTURES[0];
}
```

- [ ] **Step 4: Register the twelve names in the Playwright spec**

In `client/e2e/visual.spec.ts`, extend `FIXTURE_NAMES` to include the twelve new names (insert the button ones after `'button-variants'`):

```ts
const FIXTURE_NAMES = [
  'text',
  'text-bound',
  'text-sizes',
  'text-weights',
  'text-as',
  'text-whitespace',
  'button-fn',
  'button-event',
  'button-variants',
  'button-sizes',
  'button-aligncontent',
  'button-disabled',
  'button-inactive',
  'button-loading',
  'button-block',
  'button-labelwrap',
  'button-count',
  'button-icon',
  'button-leading-visual',
  'button-trailing-visual',
  'button-trailing-action',
  'icon-names',
  'icon-sizes',
  'icon-fills',
];
```

- [ ] **Step 5: Build, typecheck, lint, and format-check the client**

Run: `yarn workspace client run build && yarn workspace client run typecheck && yarn workspace client run test`
Expected: PASS — client compiles (`tsc --noEmit` + vite build), typechecks, and `App.test.tsx` passes. Then from the repo root: `yarn lint:all && yarn format:check` (run `yarn format` first if `format:check` reports diffs). Expected: clean.

- [ ] **Step 6: Commit**

```bash
git add client/src/fixtures/ client/e2e/visual.spec.ts
git commit -m "test(phase-6): backfill Button prop-walk fixtures + element-slot fixtures"
```

---

## Notes for the executor

- **Baselines:** do NOT attempt to generate Playwright baseline PNGs in this environment — the committed baselines are `-chromium-darwin` and are blessed on a mac out-of-band (6.2 shipped Icon fixtures the same way). The gates (`yarn verify:all`) do not run Playwright. Registering the fixture names in `visual.spec.ts` is the branch-side deliverable; blessing the PNGs is the follow-up.
- **Docs on `main`:** the decision-doc reconciliation (`button.md`) and deferral-register closure (`deferred-catalog-work.md`) are `_dev/` docs owned by `main`; they are intentionally NOT touched on this branch.
- **Final gate:** run `yarn verify:all` from the repo root once all three tasks are committed; it must be green.
</content>
</invoke>
