# ActionBar.IconButton

- **Official documentation URL:** https://primer.style/components/action-bar
- **Real prop surface resolved from:** `@primer/react` installed type declarations at
  `node_modules/@primer/react/dist/ActionBar/ActionBar.d.ts`:
  `ActionBarIconButtonProps = { disabled?: boolean } & IconButtonProps` (the `{ disabled }`
  intersection is redundant with `ButtonBaseProps.disabled`). Reconciled against `ActionBar.js`
  (`ActionBarIconButton`, line ~325): it reads `icon` + `aria-label`, destructures `disabled`/`onClick`,
  and spreads the rest to `IconButton` — but **hardcodes `variant: "invisible"`** after the spread
  (author `variant` is inert) and takes `size` from the parent `ActionBar` via context. `disabled`
  is applied as `aria-disabled` + a click guard (the button stays focusable). No `children` — the
  official doc's "required children / button description" is doc-ahead-of-code (conflated with the
  non-shipped `ActionBar.Button`); the component is icon-only.
- **Scope:** narrowed to `ActionBar.IconButton`'s **documented** surface (`icon`, `aria-label`,
  `disabled`) plus the mandatory interaction. The full `description`/`size`/`loading`/`inactive`/
  `loadingAnnouncement`/`block`/`keybindingHint`/`tooltipDirection` surface is present on the type
  only by intersecting `IconButtonProps` — it is not part of this component's documented toolbar-button
  contract, so it is not translated here (that is `IconButton`'s (6.29) surface). `size` is controlled
  by the parent `ActionBar`.
- **Component-level description (→ `catalog.json` `description`):** An icon-only button inside an
  action-bar toolbar; it triggers an action when activated and carries a required label for assistive
  technologies.

Build notes:

- `icon` is the required `ComponentId` content channel (references an `Icon`, per 6.2) — the icon-only
  analog of Button's `child`, required as on `IconButton`.
- `action` is Primer's `onClick` expressed as the A2UI `Action` (the synthetic interaction prop). Its
  `event` shape means an agent section applies (this leaf's overflow/menu registration passes `onClick`
  through unchanged).
- `accessibility` is **required** — an icon-only button must be labeled; maps to `aria-label`
  (or `aria-labelledby`), which doubles as the tooltip text.

---

## Adapter section

### Prop-surface table

| prop | decision | synthetic? | A2UI type | description |
|---|---|---|---|---|
| `icon` | carry (required) | no | `ComponentId` | The icon displayed as the button's content. |
| `action` | carry (required) | yes (← `onClick`) | `Action` | The action performed when the button is activated. |
| `accessibility` | carry (required) | no | `AccessibilityAttributes` | Label describing the button's function for assistive technologies; also serves as its tooltip text. Required — an icon-only button must be labeled. |
| `disabled` | carry | no | `DynamicBoolean` | Whether the button is disabled; it stays focusable with `aria-disabled` applied. |

### Functions

| name | args | returnType | description |
|---|---|---|---|
| `consoleLog` | `message: string` (The message to log.) | `void` | Logs a message. A local client-side effect invoked from the button's `functionCall` action. Already registered in the catalog — no new registration. |

### Dropped / deferred props

| prop | reason |
|---|---|
| `variant` | Hardcoded to `invisible` by ActionBar; the prop is inert. |
| `description`, `size`, `loading`, `inactive`, `loadingAnnouncement`, `block`, `keybindingHint`, `tooltipDirection` | Inherited by intersection from `IconButtonProps`; not part of `ActionBar.IconButton`'s documented surface (`size` is controlled by the parent `ActionBar`). Live but undocumented — excluded to translate the documented toolbar-button contract, not `IconButton`'s. |
| `labelWrap` | No text label to wrap on an icon-only button; inert here. |
| `keyshortcuts` | `@deprecated` alias of `keybindingHint` in the installed types (and `keybindingHint` itself is out of this leaf's documented scope). |
| `unsafeDisableTooltip` | Not in the official documentation; a discouraged escape hatch that suppresses the accessible tooltip. |
| `as` | Polymorphic render-target that switches identity; behavioral polymorphism with no protocol representation on this leaf. |
| `onClick`, `type`, `name`, `tabIndex`, `form`, `value`, `id`, `data-*`, and the rest of the non-`aria-*` `React.ButtonHTMLAttributes<HTMLButtonElement>` spread | Dropped: no A2UI representation. (`onClick` is carried as the synthetic `action`; the `aria-*` slice as `accessibility`.) |

---

## Client section

`icon` is the required `ComponentId` content — like Button's `child`, it gets no fixture of its own
but is the content of every fixture (each references a real `Icon`). `accessibility` is required, so
every fixture sets an `aria-label`. Renders standalone (the overflow registry no-ops without an
`ActionBar` parent); the vitest render tests need an `IntersectionObserver` polyfill (build note).

### Fixture table

| fixture | exercises (coverage axis) | component state / canned values | baselined? |
|---|---|---|---|
| `action-bar-icon-button-fn` | interaction — functionCall path | `icon`→`Icon`; `accessibility.label: "Bold"`; `action: functionCall consoleLog {message: "action-bar-icon-button-fn clicked"}` | yes |
| `action-bar-icon-button-event` | interaction — event path | `icon`→`Icon`; `accessibility.label: "Save"`; `action: event {name: "save", context: {}}`; **coupling:** `disabled ← /saved`, initial `/saved = false` | yes |
| `action-bar-icon-button-disabled` | visual state — `disabled` | `icon`→`Icon`; `accessibility.label: "Delete"`; `disabled: true` | yes |

### Prop-coverage map

| adapter prop | covered by |
|---|---|
| `icon` | every fixture (the button's content) |
| `action` | `action-bar-icon-button-fn` (functionCall) + `action-bar-icon-button-event` (event) |
| `accessibility` | render-test assertion (`aria-label` set on every fixture; non-visual) |
| `disabled` | `action-bar-icon-button-disabled` |

---

## Agent section

`action` accepts the `event` shape, so this leaf emits one event (`save`, from the
`action-bar-icon-button-event` fixture). `ActionBar.IconButton` supports both update mechanisms
self-contained: a swappable `icon` child (self-visible) and a bindable `disabled` prop (the two-way
write). No companion component needed.

### Event-response table

| event | response messages (ordered, with canned values) | visibility coupling |
|---|---|---|
| `save` | 1. `updateDataModel {path: '/saved', value: true}` · 2. `updateComponents [{id: <the button's icon id>, component: 'Icon', icon: 'check'}]` (swap the save icon to a checkmark; surfaceId echoed — stamped at runtime, not authored) | `action-bar-icon-button-event` · `disabled ← /saved` · initial `/saved = false` |

The icon swap is self-visible; the `/saved` write is visible only through `disabled ← /saved` — the
half that proves two-way binding on the button (after saving, it disables to prevent re-submit and
shows a check).
