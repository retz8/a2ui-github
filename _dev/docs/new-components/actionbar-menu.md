# ActionBar.Menu

- **Official documentation URL:** https://primer.style/components/action-bar
- **Real prop surface resolved from:** `@primer/react` installed type declarations at
  `node_modules/@primer/react/dist/ActionBar/ActionBar.d.ts`:
  `ActionBarMenuProps = { 'aria-label': string; icon: ElementType; items: ActionBarMenuItemProps[];
  overflowIcon?: ElementType | 'none'; returnFocusRef?: RefObject<HTMLElement> } & IconButtonProps`.
  Reconciled against `ActionBar.js` (`ActionBarMenu` ~line 424 + `renderMenuItem` ~line 24): the menu
  button is an `IconButton` with **`variant: "invisible"` hardcoded** (author `variant` inert); it opens
  a Primer-internal `ActionMenu.Overlay` (**no catalog overlay infra** — same as `SegmentedControl`'s
  dropdown). `overflowIcon` falls back to `icon` when omitted. `items` is rendered by `renderMenuItem`:
  a `{ type: 'divider' }` item → a separator; an action item → an `ActionList.Item` with `onSelect`,
  `disabled`, `variant`, an optional leading icon, the `label` text, and an optional trailing icon
  **or** trailing text string; an action item carrying a nested `items` array → a recursive submenu.
- **Scope:** the menu button's own surface is narrowed to `ActionBar.Menu`'s **documented** props
  (`aria-label`, `icon`, `items`, `overflowIcon`, `returnFocusRef`); the rest of `& IconButtonProps` is
  intersection-inherited and not translated (same reasoning as `ActionBar.IconButton`).
- **Component-level description (→ `catalog.json` `description`):** A toolbar button that opens a
  dropdown menu of actions when activated; menu entries may carry icons, trailing text, and nested
  submenus, and may be separated by dividers.

Build notes:

- `items` is an authoring-time **data array** (faithful to Primer's data-driven `items` API, unlike a
  children-based menu). Its scalar fields are plain (`z.string()`/`z.boolean()`/`z.enum`) — the array
  is authored menu structure, not bound runtime state; its reference fields are `ComponentId` (icons,
  resolved via `buildChild`) and `Action` (per-item interaction, dispatched on select). Nested submenus
  are a **recursive** `z.lazy` self-reference; `renderMenuItem` already recurses. All buildable from
  existing helpers — no new infra.
- The menu button emits no author action of its own (clicking it opens the overlay, internal state);
  the interactions live on the per-item `action` fields.

---

## Adapter section

### Prop-surface table

| prop | decision | synthetic? | A2UI type | description |
|---|---|---|---|---|
| `icon` | carry (required) | no | `ComponentId` | The icon displayed on the menu button (references an `Icon`). |
| `accessibility` | carry (required) | no | `AccessibilityAttributes` | Accessible name for the menu button, required. Maps to `aria-label` (or `aria-labelledby`). |
| `items` | carry (required) | no | `z.array(<menuItem>)` | The entries shown in the dropdown menu (see the item schema below). |
| `overflowIcon` | carry | no | `z.union([CommonSchemas.ComponentId, z.literal('none')])` | The icon shown for this menu when the toolbar collapses it into the overflow menu; defaults to the menu button's own `icon`, or `'none'` to show no icon. |

**`<menuItem>` schema** — `z.discriminatedUnion('type', [<action>, <divider>])`:

| field | decision | A2UI type | description |
|---|---|---|---|
| `type` | discriminator | `z.literal('action')` (default) / `z.literal('divider')` | The kind of entry: an action item (default) or a separator. |
| `label` | carry (required, action) | `z.string()` | The item's text. |
| `action` | carry (action) | `Action` (← `onClick`/`onSelect`) | The action performed when the item is selected. |
| `disabled` | carry (action) | `z.boolean()` | Whether the item is disabled and cannot be selected. |
| `leadingVisual` | carry (action) | `CommonSchemas.ComponentId` | An icon shown before the item's text. |
| `trailingVisual` | carry (action) | `z.union([CommonSchemas.ComponentId, z.string()])` | An icon or a short text string shown after the item's text. |
| `variant` | carry (action) | `z.enum(['default','danger'])` | The item's visual style; `danger` marks a destructive action. |
| `items` | carry (action) | `z.lazy(() => z.array(<menuItem>))` | Nested entries rendered as a submenu. |

A `divider` item carries only `type: 'divider'`.

### Functions

| name | args | returnType | description |
|---|---|---|---|
| `consoleLog` | `message: string` (The message to log.) | `void` | Logs a message. A local client-side effect invoked from a menu item's `functionCall` action. Already registered in the catalog — no new registration. |

### Dropped / deferred props

| prop | reason |
|---|---|
| `returnFocusRef` | A DOM element ref; not JSON-serializable, no A2UI representation. |
| `variant` (menu button) | Hardcoded to `invisible` by ActionBar; the prop is inert. |
| `size`, `description`, `loading`, `inactive`, `loadingAnnouncement`, `block`, `keybindingHint`, `tooltipDirection` | Inherited by intersection from `IconButtonProps`; not part of `ActionBar.Menu`'s documented surface. |
| `labelWrap`, `keyshortcuts`, `unsafeDisableTooltip`, `as`, and the non-`aria-*` `ButtonHTMLAttributes` spread | Same categorical drops as `IconButton` — inert, deprecated, discouraged, behavioral-polymorphic, or no A2UI representation. |

---

## Client section

The dropdown items render in a Primer-internal overlay only when the menu is open, so the fixture is
baselined in the **open** state (Playwright opens the menu before the screenshot). A single
`items`-breadth fixture (single-axis on `items`, the menu's one content prop) packs every item-schema
variation into one authored array; secondary states (submenu-open, collapsed-in-bar overflow) are
render-test assertions rather than separate baselines. The menu button's closed state gets no baseline
(an invisible icon button, redundant with `ActionBar.IconButton`).

### Fixture table

| fixture | exercises (coverage axis) | component state / canned values | baselined? |
|---|---|---|---|
| `action-bar-menu` | `items` breadth + both action shapes | `icon`→`Icon` (menu button); `accessibility.label: "Actions"`; `items`: `Cut` (`leadingVisual` icon, `action: functionCall consoleLog`) · `Copy` (`trailingVisual` text `"⌘C"`, `action: event {name:"copy", context:{}}`) · `Paste` (`trailingVisual` icon) · `{type:'divider'}` · `Delete` (`variant: danger`, `action: functionCall consoleLog`) · `Archive` (`disabled: true`) · `More` (`leadingVisual` icon, nested submenu `items: [ {label:'Sub A', action: functionCall}, {label:'Sub B'} ]`); **coupling:** companion `Text` (id `menu-status`) beside the menu, `text ← /status`, initial `/status = 'Ready'` | yes (**open** state) |

### Prop-coverage map

| adapter prop | covered by |
|---|---|
| `icon` | `action-bar-menu` (the menu button, every fixture) |
| `accessibility` | render-test assertion (`aria-label` forwarded; non-visual) |
| `items` | `action-bar-menu` — breadth: `leadingVisual`/`trailingVisual` (icon **and** text), `divider`, `danger` variant, `disabled`, `functionCall`+`event` action shapes; **submenu-open** state via render-test assertion |
| `overflowIcon` | render-test assertion (only visible when the menu is collapsed into a parent bar's overflow; non-visual standalone) |

---

## Agent section

A menu item's `action` accepts the `event` shape, so this leaf emits one event (`copy`, from the
`Copy` item in the `action-bar-menu` fixture). `ActionBar.Menu` has no self-bindable `Dynamic` prop
(its `items` are authored config), so the data-model write surfaces through a **companion `Text`**
(id `menu-status`) added beside the menu in the fixture; the menu button's `icon` swap is self-visible.

### Event-response table

| event | response messages (ordered, with canned values) | visibility coupling |
|---|---|---|
| `copy` | 1. `updateDataModel {path: '/status', value: 'Copied to clipboard'}` · 2. `updateComponents [{id: <menu button icon id>, component: 'Icon', icon: 'check'}]` (swap the menu button's icon to a checkmark; surfaceId echoed — stamped at runtime, not authored) | `action-bar-menu` · companion `Text` `menu-status` `text ← /status` · initial `/status = 'Ready'` |

The menu-icon swap is self-visible; the `/status` write is visible only through the companion
`Text` bound `text ← /status` — the half that proves two-way data binding for this menu.
