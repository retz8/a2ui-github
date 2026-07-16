# NavList.TrailingAction

- **Official documentation URL:** https://primer.style/components/nav-list
- **Real prop surface resolved from:** `@primer/react` type declarations at
  `node_modules/@primer/react/dist/NavList/NavList.d.ts` (v38.28.0):
  `NavListTrailingActionProps = ActionListTrailingActionProps` (`ActionList/TrailingAction.d.ts`) =
  `({ as?: 'button'; href?: never; loading?: boolean } | { as: 'a'; href: string; loading?: never }) &
  { icon?: React.ElementType; label: string; className?; style? }`, default element `'button'`.
  Reconciled against `ActionList/TrailingAction.js`: the component renders an **`IconButton`** and
  spreads its remaining props onto it — so the activation handler that actually fires is the
  button's **`onClick`** (through the spread). The doc example uses `onSelect`, but `onSelect` is
  **not wired** in the installed version (neither `IconButton` nor `ButtonComponent` handles it; on a
  `<button>` React's `onSelect` is the text-selection event, not click) — the doc is ahead of the
  installed code here.
- **Component-level description (→ `catalog.json` `description`):** An interactive icon control at the
  end of a navigation item, separate from the navigation link, that performs an action when activated.

> Part of the `NavList` compound family (6.41) — see `navlist.md` for the family overview and shared
> conventions. **This is the family's only interactive leaf and its sole agent site.**

## Interaction model

`TrailingAction` defaults to `as: 'button'` — an action control whose identity is the click, the
direct analog of **`IconButton`** (6.29). So, unlike `Item` (a link), it carries an `Action`. Its
click maps to the A2UI `Action` (`← onClick`, the working handler in the installed code, per the
reconciliation above), following the IconButton model exactly. The `as: 'a'` link mode is behavioral
polymorphism and is dropped along with `href`, leaving a pure button control with a required `action`.

---

## Adapter section

### Prop-surface table

| prop | decision | synthetic? | A2UI type | description |
|---|---|---|---|---|
| `icon` | carry (required) | no | `ComponentId` | The icon displayed in the control. |
| `accessibility` | carry (required) | no | `AccessibilityAttributes` | Label for assistive technologies — the control is icon-only, so it must be labeled. Maps to `aria-label`. |
| `action` | carry (required) | yes (← `onClick`) | `Action` | The action performed when the control is activated. |
| `loading` | carry | no | `DynamicBoolean` | Whether the control is in a loading state. |

`icon` is the required content channel (the `IconButton.icon` analog); `accessibility` is required
because an icon-only control must carry an accessible name (IconButton parity — the `label` prop maps
to `aria-label`).

### Functions

| name | args | returnType | description |
|---|---|---|---|
| `consoleLog` | `message: string` (The message to log.) | `void` | Logs a message. A local client-side effect invoked from the control's `functionCall` action. Already registered in the catalog — no new registration. |

### Dropped / deferred props

| prop | reason |
|---|---|
| `as` | Polymorphic render-target that switches identity (`as='a'` for a link); behavioral polymorphism with no protocol representation on this leaf (IconButton parity). |
| `href` | Only present in the `as: 'a'` link mode, which is dropped with `as`; this leaf is the button control. |
| `label` | Not dropped — folded into `accessibility` (the icon-only control's accessible name, IconButton parity). |
| `className`, `style` | Styling passthroughs; no A2UI representation. |

---

## Client section

Every fixture renders the trailing action inside a realistic `NavList` item. `icon` is the required
`ComponentId` content (referenced by every fixture); `accessibility` is set in every fixture and
covered by a render-test assertion.

### Fixture table

| fixture | exercises (coverage axis) | component state / canned values | baselined? |
|---|---|---|---|
| `navlist-trailingaction-fn` | interaction — functionCall path | `NavList`[`Item` "Settings" `LeadingVisual`→`Icon` `gear`, `TrailingAction` `icon`→`Icon` `pin` (id `pin-icon-fn`), `accessibility.label: "Pin Settings"`, `action: functionCall consoleLog {message: "navlist-trailingaction-fn clicked"}`] | yes |
| `navlist-trailingaction-event` | interaction — event path + agent coupling | `NavList`[`Item` "README.md" `LeadingVisual`→`Icon` `file`, `TrailingAction` `icon`→`Icon` `pin` (id `pin-icon`), `accessibility.label: "Pin README"`, `action: event {name: "pin", context: {}}`]; sibling `Text` id `status` bound `text ← /pinStatus`; data model `{pinStatus: "Not pinned"}` | yes |
| `navlist-trailingaction-loading` | visually-distinct state — `loading` | `NavList`[`Item` "Syncing…" `LeadingVisual`→`Icon` `sync`, `TrailingAction` `icon`→`Icon` `sync` (id `sync-icon`), `accessibility.label: "Sync"`, `loading: true`, `action: functionCall consoleLog {message: "sync"}`] | yes |

### Prop-coverage map

| adapter prop | covered by |
|---|---|
| `icon` | every fixture (the content) |
| `action` | `navlist-trailingaction-fn` (functionCall) + `navlist-trailingaction-event` (event) |
| `loading` | `navlist-trailingaction-loading` |
| `accessibility` | render-test assertion (non-visual; set in every fixture — `aria-label` on the control) |

---

## Agent section

`TrailingAction`'s `action` accepts the `event` shape, so an agent section applies. One event name is
emitted by the paired client event fixture: `pin`. This is the **only agent site in the NavList
family**.

### Event-response table

| event | response messages (ordered, with canned values) | visibility coupling (client fixture · bound prop ← path · initial value) |
|---|---|---|
| `pin` | 1. `updateDataModel {path: '/pinStatus', value: '📌 Pinned — server confirmed'}` · 2. `updateComponents [{id: 'pin-icon', component: 'Icon', name: 'check-circle-fill'}]` (surfaceId echoed — stamped at runtime, not authored) | `navlist-trailingaction-event` · sibling `status` Text `text ← /pinStatus` · initial `/pinStatus = "Not pinned"` |

The `pin-icon` swap (`pin` → `check-circle-fill`) is self-visible; the `/pinStatus` write is visible
only through the sibling `status` Text's `text ← /pinStatus` binding — the half that proves two-way
data binding (`check-circle-fill` is the same known-valid confirmation octicon `iconbutton.md` uses).
