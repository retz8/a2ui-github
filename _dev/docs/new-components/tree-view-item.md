# TreeView.Item

- **Part of the `TreeView` compound family** (6.45) — see `tree-view.md` for the family note,
  shared conventions, and the component-level frame.
- **Official documentation URL:** https://primer.style/components/tree-view
- **Real prop surface resolved from:** `@primer/react` type declarations at
  `node_modules/@primer/react/dist/TreeView/TreeView.d.ts` (`TreeViewItemProps` +
  `TreeViewSecondaryActions`), reconciled against `TreeView.js` (authority on defaults). Code
  behavior: `current` default `false`; `defaultExpanded` has no default (falls back to `false`
  unless the item is `current`); `expanded === null` marks a non-expandable leaf. The doc lists
  `truncate`/`as` on `Item`, but the installed types do not carry them (doc ahead of installed
  code) — the types are followed.
- **Component-level description (→ `catalog.json` `description`):** A single row in a tree — a
  label with optional leading/trailing visuals, an expandable nested subtree, and a row of
  secondary actions.

## Interaction model

Two axes, mirroring the family convention (`tree-view.md`):

- **Expansion** folds into `expanded: DynamicBoolean`, two-way bound — toggling the item's twisty
  optimistically writes the new state back to its bound path (folds `onExpandedChange`, as
  `Checkbox` folds `onChange`→`checked`). The bound path's initial value is the default, so
  `defaultExpanded` is dropped. `expanded === null` (Primer's non-expandable-leaf marker) is not
  modeled; leaf-ness comes from the absence of a `SubTree` child.
- **Selection** is the `action` side-effect (← `onSelect`, optional) — `functionCall` (local) or
  `event` (server). Because `action` accepts the `event` shape, `Item` has an **agent section**.
  `current` marks the current item (e.g. the selected file); at most one item is current.

---

## Adapter section

### Prop-surface table

| prop | decision | synthetic? | A2UI type | description |
|---|---|---|---|---|
| `children` | carry (required) | yes | `ChildList` | The item's label plus its leading/trailing visuals and any nested subtree. |
| `id` | carry (required) | no | `z.string()` | Stable identifier for the item; tracks its expanded state and anchors ARIA references. |
| `expanded` | carry | no | `DynamicBoolean` | Whether the item's subtree is open; two-way bound — toggling the item writes the new state back. |
| `current` | carry | no | `DynamicBoolean (default: false)` | Whether this is the current item (e.g. the selected file); at most one item is current. |
| `action` | carry (optional) | yes (← `onSelect`) | `Action` | An effect performed when the item is activated — a local function or a server event. |
| `secondaryActions` | carry (optional) | no | `z.array(z.object({ label: DynamicString, icon: ComponentId, count: DynamicString.optional(), action: Action }))` | A row of secondary actions for the item (e.g. an overflow menu), each with a label, an icon, an optional count, and an action. |
| `containIntrinsicSize` | carry (optional) | no | `z.string()` | A layout-size hint used to optimize rendering of very large trees. |

### Functions

| name | args | returnType | description |
|---|---|---|---|
| `consoleLog` | `message: string` (The message to log.) | `void` | Logs a message. A local client-side effect invoked from the item's `functionCall` action. Already registered in the catalog — no new registration. |

### Dropped/deferred props

| prop | reason |
|---|---|
| `defaultExpanded` | Folded into `expanded`'s two-way binding — the bound path's initial value is the default. |
| `onExpandedChange` | Folded into `expanded`'s two-way binding (the write-back on toggle); not a separate `Action`. |
| `expanded === null` | The non-expandable-leaf marker is not modeled; leaf-ness comes from the absence of a `SubTree` child. |
| `accessibility` (`aria-label`, `aria-labelledby`) | Not carried: the item's accessible name comes from its label child, and `id` anchors ARIA references — no genuine additional author-facing a11y channel (per-component fidelity, as `ActionList.Item`). |
| `className` | Styling passthrough; no A2UI representation. |

---

## Client section

### Fixture table

| fixture | exercises | component state / canned values | baselined? |
|---|---|---|---|
| `tree-view-item-current` | visually-distinct state — `current` | one item `current: true` | yes |
| `tree-view-item-expanded-bound` | `expanded` — bound (proves path binding) | item `expanded: {path: "/openState"}` + data model `{openState: true}`; subtree visible | yes |
| `tree-view-item-fn` | interaction — `action` functionCall path | item `action: functionCall consoleLog {message: "item selected"}` | yes |
| `tree-view-item-event` | interaction — `action` event path | item `action: event {name: "select-item", context: {id: "src"}}`; item `current: {path: "/itemSelected"}` + data model `{itemSelected: false}` (agent-coupling) | yes |
| `tree-view-item-secondary-actions` | `secondaryActions` (structured array — nested icon child + count + action) | item with `secondaryActions: [{label: "Rename", icon: →Icon(pencil), action: functionCall consoleLog {message: "rename"}}, {label: "Delete", icon: →Icon(trash), count: "3", action: event {name: "delete", context: {}}}]`; item `current: {path: "/rowDeleted"}` + data model `{rowDeleted: false}` (agent-coupling) | yes |

The `expanded` **literal** scenario is covered by the root's `tree-view-nested` fixture
(`expanded: true`); this leaf adds the **bound** fixture that proves path binding.

### Prop-coverage map

| adapter prop | covered by |
|---|---|
| `children` | every item fixture (label + visuals + subtree) |
| `id` | render-test assertion (non-visual) — set on every item |
| `expanded` | `tree-view-nested` (literal) + `tree-view-item-expanded-bound` (bound) |
| `current` | `tree-view-item-current` |
| `action` | `tree-view-item-fn` (functionCall) + `tree-view-item-event` (event) |
| `secondaryActions` | `tree-view-item-secondary-actions` |
| `containIntrinsicSize` | render-test assertion (non-visual) |

---

## Agent section

`Item`'s `action` accepts the `event` shape, and its `secondaryActions[].action` does too. Two
event names are emitted by the paired client event fixtures: `select-item` and `delete`.

### Event-response table

| event | response messages (ordered, with canned values) | visibility coupling (client fixture · bound prop ← path · initial value) |
|---|---|---|
| `select-item` | 1. `updateDataModel {path: '/itemSelected', value: true}` · 2. `updateComponents [{id: '<label>', component: 'Text', text: '✅ src selected'}]` (surfaceId echoed — stamped at runtime, not authored) | `tree-view-item-event` · item `current ← /itemSelected` · initial `/itemSelected = false` |
| `delete` | 1. `updateDataModel {path: '/rowDeleted', value: true}` · 2. `updateComponents [{id: '<label>', component: 'Text', text: '🗑 Deleted'}]` | `tree-view-item-secondary-actions` · item `current ← /rowDeleted` · initial `/rowDeleted = false` |

For `select-item`, the label swap is self-visible and the `/itemSelected` write is visible through
the `current ← /itemSelected` coupling — the half that proves two-way data binding on the item
(after the event, the row highlights as current). `delete` follows the same pattern; the
`current ← /rowDeleted` binding is a demonstrative binding that makes the data write visible
alongside the self-visible label swap.
