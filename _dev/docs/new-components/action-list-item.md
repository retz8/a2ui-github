# ActionList.Item

- **Part of the `ActionList` compound family** (6.38) — see `action-list.md` for the family
  note, shared conventions, and the component-level frame.
- **Official documentation URL:** https://primer.style/components/action-list
- **Real prop surface resolved from:** `@primer/react` type declarations at
  `node_modules/@primer/react/dist/ActionList/Item.d.ts` and `shared.d.ts`
  (`ActionListItemProps`), reconciled against `Item.js` (authority on defaults). Code defaults:
  `variant = "default"`, `size = "medium"`, `disabled = false`, `active = false`;
  `selected = undefined` (no default — undefined means the item is not in selection mode);
  `inactive = Boolean(inactiveText)` (setting `inactiveText` is what marks an item inactive).
- **Component-level description (→ `catalog.json` `description`):** A single selectable or
  actionable row in an action list, holding a label and optional leading/trailing visuals, a
  secondary description, and a trailing action.

## Interaction model

Per-item, consumer-controlled, mirroring `Checkbox` (state) + `SegmentedControl` (side-effect):
`selected` is the two-way-bound selection state (a click optimistically writes the new value
back to its bound path); `action` (← `onSelect`, optional) is the side-effect on select —
`functionCall` (local) or `event` (server). Because `action` accepts the `event` shape, `Item`
has an **agent section**. The root/group `selectionVariant` decides how a selected item renders;
single-select exclusivity is owned by the data model / agent, not the schema.

---

## Adapter section

### Prop-surface table

| prop | decision | synthetic? | A2UI type | description |
|---|---|---|---|---|
| `children` | carry (optional) | yes | `ChildList` | The item's label plus its leading/trailing visuals, description, and trailing action. |
| `selected` | carry | no | `DynamicBoolean` | Whether the item is selected; two-way bound — a click writes the new state back. Meaningful only when the list or group sets a `selectionVariant`. |
| `action` | carry (optional) | yes (← `onSelect`) | `Action` | An effect performed when the item is selected — a local function or a server event. |
| `active` | carry | no | `DynamicBoolean (default: false)` | Whether the item is the currently-active one (e.g. the current page); at most one item should be active. |
| `variant` | carry | no | `z.enum(['default','danger']) (default: "default")` | The item's style; `danger` marks a destructive action. |
| `size` | carry | no | `z.enum(['medium','large']) (default: "medium")` | The item's block size. |
| `disabled` | carry | no | `DynamicBoolean (default: false)` | Whether the item is disabled and cannot be clicked, selected, or navigated to. |
| `loading` | carry | no | `DynamicBoolean (default: false)` | Whether the item is in a loading state. |
| `inactiveText` | carry | no | `DynamicString` | Text explaining why the item is temporarily unavailable; its presence marks the item inactive. |
| `role` | carry | no | `z.string()` | The ARIA role describing the item's function, e.g. `option` or `menuitemradio`. |
| `id` | carry | no | `z.string()` | An HTML id set on the item's root element, e.g. so other elements can reference it for ARIA labeling. |

### Functions

| name | args | returnType | description |
|---|---|---|---|
| `consoleLog` | `message: string` (The message to log.) | `void` | Logs a message. A local client-side effect invoked from the item's `functionCall` action. Already registered in the catalog — no new registration. |

### Dropped / deferred props

| prop | reason |
|---|---|
| `as` | Dropped: deprecated — "`as` prop has no effect on `ActionList.Item`, only `ActionList.LinkItem`." |
| `_PrivateItemWrapper`, `renderItem`, `handleAddItem`, `groupId` | Dropped: private/internal API; element-typed, not JSON-serializable. |
| `accessibility` (`aria-*`) | Not carried: the item's accessible name comes from its label (a `Text` child), and `role`/`id` cover its ARIA wiring — no genuine additional author-facing a11y channel (per-component fidelity). |
| `className` | Styling passthrough; no A2UI representation. |
| non-`aria-*` `li` HTML-attribute spread | Dropped: no A2UI representation. |

---

## Agent section

`Item`'s `action` accepts the `event` shape, so an agent section applies. One event name is
emitted by the paired client event fixture (`actionlist-item-event`, in `action-list.md`):
`select`.

### Event-response table

| event | response messages (ordered, echoing `context.assigned`) | visibility coupling (client fixture · bound prop ← path · initial value) |
|---|---|---|
| `select` | 1. `updateDataModel {path:'/assigned', value: <context.assigned>}` (server echoes the received selection) · 2. `updateComponents [{id:'status', component:'Text', text:'✅ Assigned to you — server confirmed'}]` (surfaceId echoed — stamped at runtime, not authored) | `actionlist-item-event` · `Item.selected ← /assigned` · initial `/assigned = false` |

The response is built from the event's `context.assigned` — set by the item's optimistic two-way
write before the event fires — so it reflects the actual selection. The `status` swap is
self-visible; the `/assigned` echo is visible through the `selected ← /assigned` coupling, the
half that proves two-way binding on the item itself (the checkmark follows the data model, as
`SegmentedControl`'s selection follows `/view`).

---
