# ActionList.TrailingAction

- **Part of the `ActionList` compound family** (6.38) — see `action-list.md` for the family
  note, shared conventions, and the component-level frame.
- **Official documentation URL:** https://primer.style/components/action-list
- **Real prop surface resolved from:** `@primer/react` type declarations at
  `node_modules/@primer/react/dist/ActionList/TrailingAction.d.ts` (`ActionListTrailingActionProps
  = ElementProps & { icon?: React.ElementType; label: string; className?; style? }`, where
  `ElementProps = { as?: 'button'; href?: never; loading? } | { as: 'a'; href: string; loading?:
  never }`), reconciled against `TrailingAction.js`: it renders an `IconButton` (when `icon` is
  set) or a `Button`; **`tooltipDirection` is hardcoded to `"w"`** in the installed code (not read
  from props — the doc lists it, but it is not wired), so it is dropped. Note the type does **not**
  extend `ButtonBaseProps` — no `variant`/`size`/`disabled`/`block`.
- **Component-level description (→ `catalog.json` `description`):** A secondary action, shown
  after an item's content, that runs an action when clicked or navigates when given a link target.

## Interaction model

`TrailingAction` renders as a button (`as: "button"`, default) or a link (`as: "a"` + `href`).
The two modes are mutually exclusive in Primer's type; the A2UI schema carries both channels and
stays permissive (the agent composes per `as`). `action` (← `onClick`) is the button-mode
interaction and is event-capable, so this leaf has an **agent section**.

---

## Adapter section

### Prop-surface table

| prop | decision | synthetic? | A2UI type | description |
|---|---|---|---|---|
| `icon` | carry (required) | no | `ComponentId` | The icon displayed as the action's content. |
| `label` | carry (required) | no | `DynamicString` | The action's accessible name, and its visible text when rendered as a plain button. |
| `action` | carry (optional) | yes (← `onClick`) | `Action` | The action performed when the button is activated — a local function or a server event. Applies in button mode. |
| `as` | carry | no | `z.enum(['button','a']) (default: "button")` | Whether the control renders as a button or a link. |
| `href` | carry (optional) | no | `DynamicString` | The URL navigated to when rendered as a link (`as: "a"`). |
| `loading` | carry | no | `DynamicBoolean (default: false)` | Whether the action is in a loading state (button mode). |

### Functions

| name | args | returnType | description |
|---|---|---|---|
| `consoleLog` | `message: string` (The message to log.) | `void` | Logs a message. A local client-side effect invoked from the action's `functionCall` action. Already registered in the catalog — no new registration. |

### Dropped / deferred props

| prop | reason |
|---|---|
| `tooltipDirection` | Dropped: hardcoded to `"w"` in the installed code — not read from props, so not a real prop here (the doc is ahead of the installed version). |
| `className`, `style` | Styling passthroughs; no A2UI representation. |
| non-`aria-*` host-element spread | Dropped: no A2UI representation. |

---

## Agent section

`TrailingAction`'s `action` accepts the `event` shape, so an agent section applies. One event
name is emitted by the paired client event fixture (`actionlist-trailingaction-event`, in
`action-list.md`): `remove`.

### Event-response table

| event | response messages (ordered) | visibility coupling (client fixture · bound prop ← path · initial value) |
|---|---|---|
| `remove` | 1. `updateDataModel {path:'/removed', value: true}` · 2. `updateComponents [{id:'status', component:'Text', text:'🗑️ Removed "bug" — server confirmed'}]` (surfaceId echoed — stamped at runtime, not authored) | `actionlist-trailingaction-event` · `Item.disabled ← /removed` · initial `/removed = false` |

`TrailingAction` carries no two-way-bound state prop, so there is no optimistic write — `/removed`
is written only by the server's `updateDataModel`. The event's `context.label` ("bug") names the
removed item in the confirmation. The `status` swap is self-visible; the `/removed` write is
visible through the neighboring `Item.disabled ← /removed` coupling — the removed row greys out,
proving the server's data-model write reached a rendered prop.

---
