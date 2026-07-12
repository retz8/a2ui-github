# Details

- **Official documentation URL:** https://primer.style/components/details/
- **Real prop surface resolved from:** `@primer/react` installed type declarations at
  `node_modules/@primer/react/dist/Details/Details.d.ts`. `Details` is **not** polymorphic:
  `DetailsProps = ComponentPropsWithoutRef<'details'> & { 'data-component'?: string }` — the
  entire own surface is the native `<details>` HTML-attribute spread (`open`, `onToggle`,
  `children`, plus the HTML tail) and Primer's internal `data-component`. The compound ships a
  `Details.Summary` slot (a polymorphic `<summary>` taking `as` + children); the implementation
  warns if no summary child is present (`Details.js:52`). The **documented idiomatic surface**
  is `Details` driven by the `useDetails` hook
  (`node_modules/@primer/react/dist/hooks/useDetails.d.ts`), whose params
  (`closeOnOutsideClick`, `defaultOpen`, `onClickOutside`) are the interactive capability the
  official doc's canonical example exercises — those are carried as first-class props even
  though they are hook params rather than native `<details>` attributes.
- **Component-level description (→ `catalog.json` `description`):** A disclosure that reveals or
  hides a section of content behind a summary the user clicks to expand or collapse.

## Conventions established by this component

- **Summary + body → two named synthetic slots.** Primer expresses Details as positional
  children (`[<summary>, ...body]`). The A2UI leaf lifts that into a `summary` slot
  (`ComponentId`, rendered inside `Details.Summary`) and a `children` body slot
  (`ChildList`, the collapsible content). This is the catalog's pattern for any
  summary/body disclosure.
- **`open` is two-way bound (the Checkbox pattern).** Open-state lives at a data-model path,
  not in `useDetails`' internal React state — so the agent and server can both see and drive
  it. The binder auto-generates `setOpen` from the `DynamicBoolean` prop; the render wires the
  native `onToggle` (and the hook's outside-click) back to the bound path through it. There is
  no separate `onToggle` `Action` — the state change *is* the write-back, exactly as Checkbox
  folds `onChange` into `checked`.
- **`useDetails` internal, self-composed surface outward.** Because `closeOnOutsideClick` is
  carried, the render *does* use `useDetails` internally (for outside-click detection), but the
  bound `open` path stays the source of truth: two guarded effects keep the hook's interactive
  open-state and the bound path in lockstep (path → `setOpen` on external change; hook `open` →
  `props.setOpen` write-back on toggle/outside-click). The internal hook is never exposed — only
  a clean `open` + `closeOnOutsideClick` + `onClickOutside` surface is.
- **`windowAlert` local function.** A second general-purpose local effect function joins
  `consoleLog` in the catalog's function registry — `windowAlert(message: string): void`,
  wrapping `window.alert`. Motivated by Details' `onClickOutside` `functionCall` shape (Primer's
  own example alerts on outside-click), but usable by any component's Action; it also proves the
  functionCall path is general rather than console-log-only.

---

## Adapter section

### Prop-surface table

| prop | decision | synthetic? | A2UI type | description |
|---|---|---|---|---|
| `summary` | carry (required) | yes | `ComponentId` | The always-visible label the user clicks to toggle the disclosure. |
| `children` | carry (optional) | yes | `ChildList` | The collapsible content revealed when the disclosure is expanded. |
| `open` | carry (required) | no | `DynamicBoolean` | Whether the disclosure is expanded. Two-way bound: a summary toggle or an outside-click writes the new state back to the bound path. |
| `closeOnOutsideClick` | carry | no | `z.boolean() (default: false)` | Whether the disclosure collapses when the user clicks outside it. |
| `onClickOutside` | carry | no | `Action` | The action performed when the user clicks outside the open disclosure. |
| `accessibility` | carry | no | `AccessibilityAttributes` | Accessibility label/description for the disclosure. |

`open` is `required` — the sole controlled state of a stateful leaf, per the input-component
convention (Checkbox/Radio/ToggleSwitch): optionality has nothing left to mean once the data
model owns the state. `summary` is `required` (Primer warns without one); `children`,
`closeOnOutsideClick`, `onClickOutside`, and `accessibility` are optional.

### Functions

| name | args | returnType | description |
|---|---|---|---|
| `windowAlert` | `message: string` (The message to display.) | `void` | Displays a message in a browser alert dialog. A local client-side effect. |

`consoleLog` remains registered and available; `windowAlert` is the new addition, registered in
the same catalog function list.

### Dropped / deferred props

| prop | reason |
|---|---|
| `onToggle` | Represented by the two-way binding on `open` (the summary-toggle write-back). |
| `defaultOpen` | The bound `open` path's initial data-model value owns initial state (as Checkbox drops `defaultChecked`). |
| `ref` | `useDetails` param for the caller's own ref; internal render wiring, no A2UI representation. |
| `className`, `style`, `data-component`, and the non-`aria-*` `<details>` HTML-attribute tail (`id`, `tabIndex`, `data-*`, …) | No A2UI representation. |

---

## Client section

Filler content: the `summary` slot is a `Text` leaf ("More info"); the static body is two
`Text` leaves; the dynamic-template body binds a `Text` label. In the `details-open` gallery
`open` is a **literal** per surface (`false` / `true`); the two-way binding + write-back is
proven by a render-test assertion on a bound `open` (below).

`onClickOutside` is exercised via its **`functionCall` shape only** (`windowAlert`, local —
like `button-fn`); its `event` shape is not authored, since an outside-click dismiss has no
natural server reaction (the `event` round-trip is already proven by Button). The prop keeps its
`Action` type, so an agent may still choose the `event` shape; the catalog just ships no canned
server response for it. Because `onClickOutside` only fires while `open && closeOnOutsideClick`
(`useDetails`), the `details-clickoutside-fn` fixture sets `closeOnOutsideClick: true` — the two
props are semantically coupled — which also covers the `closeOnOutsideClick` collapse behavior.

### Fixture table

| fixture | exercises (coverage axis) | component state / canned values | baselined? |
|---|---|---|---|
| `details-open` | base render + `open` both states + static body `ChildList` + `summary` | gallery, 2 surfaces `[collapsed, expanded]`; each `summary`→`sum` (Text "More info"), `children: ['b1','b2']` (Text "First"/"Second"); `open: false` / `open: true` (literal per surface) | yes (one PNG) |
| `details-children-template` | body — dynamic template (bound `ChildList`) | `summary`→`sum`; `children: {componentId:'tpl', path:'/items'}`, `tpl` = Text binding `{path:'./label'}`; data model `/items=[{label:'Alpha'},{label:'Beta'}]`; `open: true` | yes |
| `details-clickoutside-fn` | interaction — `onClickOutside` functionCall path (+ `closeOnOutsideClick` collapse) | `summary`→`sum`; `children: ['b1']`; `open: true`; `closeOnOutsideClick: true`; `onClickOutside: functionCall windowAlert {message:'clicked outside'}` | yes |

Render-test assertions (non-visual):

- **`open` two-way write-back** — render with `open: {path:'/expanded'}` (initial `false`);
  toggling the summary writes the new state back to `/expanded`.
- **`closeOnOutsideClick`** — a click outside the open disclosure fires `onClickOutside` and
  collapses it (exercised by `details-clickoutside-fn`).
- **`accessibility`** — `accessibility.label` / `.description` surface as `aria-*` on the
  disclosure.
- **`summary` slot** — the `summary` component renders inside `Details.Summary`.

### Prop-coverage map

| adapter prop | covered by |
|---|---|
| `summary` | every fixture (the label) + render-test assertion (rendered inside `Details.Summary`) |
| `children` | `details-open` (static array) + `details-children-template` (dynamic template) |
| `open` | `details-open` (collapsed + expanded surfaces) + render-test assertion (two-way write-back) |
| `closeOnOutsideClick` | `details-clickoutside-fn` (set `true`; outside-click collapse asserted) |
| `onClickOutside` | `details-clickoutside-fn` (functionCall → `windowAlert`) |
| `accessibility` | render-test assertion (non-visual) |

---

## Agent section

Omitted. Details emits no authored `event`-shaped `Action` — `onClickOutside` is exercised only
through its local `functionCall` shape — so per the Orchestration skip rule there is no agent
surface to design.
