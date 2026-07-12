# IconButton

- **Official documentation URL:** https://primer.style/components/icon-button
- **Real prop surface resolved from:** `node_modules/@primer/react/dist/Button/types.d.ts`
  (`IconButtonProps = ButtonA11yProps & { icon: React.ElementType, unsafeDisableTooltip?, description?, tooltipDirection?, keyshortcuts? (@deprecated), keybindingHint? } & Omit<ButtonBaseProps, 'aria-label' | 'aria-labelledby'>`;
  `ButtonA11yProps` requires one of `aria-label` / `aria-labelledby`;
  `ButtonBaseProps = { variant, size, disabled, block, loading, loadingAnnouncement, inactive, labelWrap } & React.ButtonHTMLAttributes<HTMLButtonElement>`).
  Reached from `IconButton.d.ts` → `IconButton: PolymorphicForwardRefComponent<"button" | "a", IconButtonProps>` → `./types`.
  Note: `IconButton` extends `ButtonBaseProps`, **not** `ButtonProps` — so no `child`/`children`,
  `count`, `alignContent`, or `leadingVisual`/`trailingVisual`/`trailingAction`.
- **Component-level description (→ `catalog.json` `description`):** An interactive icon-only button that initiates an action when activated; it carries a required text label for assistive technologies.

Build notes:

- `icon` is the required content channel — the icon-only analog of Button's `child`. It is an
  element-typed Primer slot; the faithful A2UI translation is a `ComponentId` child (references an
  `Icon` today, per 6.2). Unlike Button's `child`, it is **required**.
- `accessibility` is **required** — an icon-only button must be labeled. The label maps to
  `aria-label` and doubles as the tooltip text when no `description` is set (per Primer docs).
- `action` is Primer's `onClick` expressed as the A2UI `Action` (the synthetic interaction prop),
  same as Button.

---

## Adapter section

### Prop-surface table

| prop | decision | synthetic? | A2UI type | description |
|---|---|---|---|---|
| `icon` | carry (required) | no | `ComponentId` | The icon displayed as the button's content. |
| `action` | carry (required) | yes | `Action` | The action performed when the button is activated. |
| `accessibility` | carry (required) | no | `AccessibilityAttributes` | Label for assistive technologies, and the button's tooltip text when no `description` is set. Required — an icon-only button must be labeled. |
| `description` | carry | no | `DynamicString` | Descriptive text shown in the button's tooltip; when set, the accessibility label names the button and this describes it. |
| `variant` | carry | no | `z.enum(['default','primary','invisible','danger','link']) (default: "default")` | The visual style; `primary` marks the main call-to-action, `danger` a destructive action, `invisible`/`link` for minimal contexts. |
| `size` | carry | no | `z.enum(['small','medium','large'])` | The button's size. |
| `disabled` | carry | no | `DynamicBoolean` | Whether the button is disabled and cannot be activated. |
| `loading` | carry | no | `DynamicBoolean` | Whether the button is in a loading state, showing a progress indicator in place of the icon. |
| `inactive` | carry | no | `DynamicBoolean` | Whether the button appears disabled but remains interactive. |
| `loadingAnnouncement` | carry | no | `z.string()` | Text announced to assistive technologies while loading. |
| `block` | carry | no | `z.boolean()` | Whether the button expands to fill its container's width. |
| `keybindingHint` | carry | no | `z.union([z.string(), z.array(z.string())])` | A keyboard-shortcut hint shown in the tooltip; a single chord or a sequence of chords. |
| `tooltipDirection` | carry | no | `z.enum(['nw','n','ne','e','se','s','sw','w'])` | Which side the tooltip is anchored to. |

Row notes:

- **`keybindingHint`** — the installed type is `string | string[]`; carried plainly (a keyboard hint
  is authoring-time config, not bound runtime state — the union stays `z.string() | z.array(z.string())`,
  both halves shipped since the array form is documented).
- **`accessibility`** — required because `ButtonA11yProps` requires one of `aria-label` /
  `aria-labelledby`. Render maps `label` → `aria-label`; the label is the primary tooltip line.
- **`description`** — per the Primer docs, when `description` is provided the tooltip describes the
  button and `aria-label` labels it. A visible tooltip content channel → `DynamicString` (not folded
  into `accessibility.description`, which would misrepresent it as `aria-describedby` metadata).

### Functions

| name | args | returnType | description |
|---|---|---|---|
| `consoleLog` | `message: string` (The message to log.) | `void` | Logs a message. A local client-side effect invoked from the button's `functionCall` action. |

### Dropped/deferred props

| prop | reason |
|---|---|
| `labelWrap` | No text label to wrap on an icon-only button; inert here. |
| `keyshortcuts` | `@deprecated` alias of `keybindingHint` in the installed types. |
| `unsafeDisableTooltip` | Not in the official documentation; a discouraged escape hatch that suppresses the accessible tooltip. |
| `as` | Polymorphic render-target that switches identity (`as='a'` for a link); behavioral polymorphism with no protocol representation on this leaf. |
| `onClick`, `type`, `name`, `tabIndex`, `form`, `value`, `id`, `data-*`, and the rest of the non-`aria-*` `React.ButtonHTMLAttributes<HTMLButtonElement>` spread | Dropped: no A2UI representation. (The interaction slot `onClick` is carried as the synthetic `action`; the `aria-*` slice is carried as `accessibility`.) |

---

## Client section

`icon` is the required `ComponentId` content — like Button's `child`, it gets no fixture of its
own but is the content of every fixture (each references a real `Icon`). `accessibility` is
required, so every fixture sets a label.

### Fixture table

| fixture | exercises | component state / canned values | baselined? |
|---|---|---|---|
| `iconbutton-fn` | interaction — functionCall path | `icon`→`heart`; `accessibility.label: "Like"`; `action: functionCall consoleLog {message: "iconbutton-fn clicked"}` | yes |
| `iconbutton-event` | interaction — event path | `icon`→`check` (child id `approve-icon`); `accessibility.label: "Approve"`; `disabled: {path: "/approved"}`; `action: event {name: "approve", context: {}}`; data model `{approved: false}` | yes |
| `iconbutton-variants` | visual enum — `variant` | one surface per `['default','primary','invisible','danger','link']`; `icon`→`x`; `accessibility.label` per variant | yes (one PNG) |
| `iconbutton-sizes` | visual enum — `size` | one surface per `['small','medium','large']`; `icon`→`gear`; `accessibility.label` per size | yes (one PNG) |
| `iconbutton-disabled` | visually-distinct state — `disabled` | `icon`→`trash`; `disabled: true`; `accessibility.label: "Delete"` | yes |
| `iconbutton-loading` | visually-distinct state — `loading` (+ coupled `loadingAnnouncement`) | `icon`→`sync`; `loading: true`; `loadingAnnouncement: "Syncing…"`; `accessibility.label: "Sync"` | yes |
| `iconbutton-inactive` | visually-distinct state — `inactive` | `icon`→`lock`; `inactive: true`; `accessibility.label: "Locked"` | yes |
| `iconbutton-block` | visually-distinct state — `block` | `icon`→`plus`; `block: true`; `accessibility.label: "Add"` | yes |
| `iconbutton-tooltip` | non-visual tooltip cluster (render-assertion only) | `icon`→`trash`; `accessibility.label: "Remove"`; `description: "Remove this item"`; `keybindingHint: "Mod+Backspace"`; `tooltipDirection: "se"` | no |

The three tooltip-only props (`description`, `keybindingHint`, `tooltipDirection`) manifest only
inside the hover tooltip, invisible in a static baseline; they are covered by render-test
assertions against `iconbutton-tooltip`, not a PNG. (Semantically coupled — all tooltip config —
so one fixture.)

### Prop-coverage map

| adapter prop | covered by |
|---|---|
| `icon` | every fixture (the content) |
| `action` | `iconbutton-fn` (functionCall) + `iconbutton-event` (event) |
| `variant` | `iconbutton-variants` |
| `size` | `iconbutton-sizes` |
| `disabled` | `iconbutton-disabled` (+ bound via `iconbutton-event` `disabled ← /approved`) |
| `loading` | `iconbutton-loading` |
| `inactive` | `iconbutton-inactive` |
| `block` | `iconbutton-block` |
| `accessibility` | render-test assertion (non-visual; set in every fixture) |
| `loadingAnnouncement` | render-test assertion (non-visual; set in `iconbutton-loading`) |
| `description` | render-test assertion (`iconbutton-tooltip`) |
| `keybindingHint` | render-test assertion (`iconbutton-tooltip`) |
| `tooltipDirection` | render-test assertion (`iconbutton-tooltip`) |

---

## Agent section

IconButton's `action` accepts the `event` shape, so an agent section applies. One event name is
emitted by the paired client event fixture: `approve`.

### Event-response table

| event | response messages (ordered, with canned values) | visibility coupling (client fixture · bound prop ← path · initial value) |
|---|---|---|
| `approve` | 1. `updateDataModel {path: '/approved', value: true}` · 2. `updateComponents [{id: 'approve-icon', component: 'Icon', name: 'check-circle-fill'}]` (surfaceId echoed — stamped at runtime, not authored) | `iconbutton-event` · `disabled ← /approved` · initial `/approved = false` |

The icon swap (`updateComponents`, `check` → `check-circle-fill`) is self-visible; the `/approved`
write (`updateDataModel`) is visible only through the `disabled ← /approved` coupling, which is the
half that proves two-way data binding on the button itself (after `approve`, the button locks).
