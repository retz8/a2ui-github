# SelectPanel.Item

- **Part of the `SelectPanel` compound family** (6.50) — see `selectpanel.md` for the family note,
  the family-wide client section (this leaf's fixtures live there), the rendering/composition model,
  and the component-level frame.
- **Official documentation URL:** https://primer.style/product/components/select-panel/
- **Real prop surface resolved from:** `@primer/react` type declarations at
  `node_modules/@primer/react/dist/FilteredActionList/types.d.ts` — `ItemInput` /
  `FilteredActionListItemProps` (the item descriptor `SelectPanel` consumes through its `items` array).
  Each resolved `SelectPanel.Item` maps to one Primer `ItemInput` in the root's render fn. Doc defaults:
  `variant = "default"`, `descriptionVariant = "inline"`; `selected` has no default (undefined = the
  item is not in selection mode).
- **Component-level description (→ `catalog.json` `description`):** A single selectable row in a select
  panel, holding a label with an optional secondary description and leading/trailing visuals.

## Interaction model

Per-item, consumer-controlled, mirroring `ActionList.Item` (6.38) — `Checkbox` (state) +
`SegmentedControl` (side-effect): `selected` is the two-way-bound selection state (a click optimistically
writes the new value back to its bound path); `action` (← `onAction`, optional) is the side-effect on
select — `functionCall` (local) or `event` (server). Because `action` accepts the `event` shape, `Item`
has an **agent section**. The root's `selectionVariant` decides how a selected item renders (checkmark
vs checkbox); single-select exclusivity is owned by the data model / agent, not the schema. The
aggregate selection Primer exposes as the root `selected`/`onSelectedChange` is represented by these
per-item bindings and is not carried at the root.

---

## Adapter section

### Prop-surface table

| prop | decision | synthetic? | A2UI type | description |
|---|---|---|---|---|
| `text` | carry (required) | no | `DynamicString` | The item's primary label. |
| `description` | carry | no | `DynamicString` | Secondary text providing additional detail about the item. |
| `descriptionVariant` | carry | no | `z.enum(['inline','block']) (default: "inline")` | Whether the secondary text sits beside the label (`inline`) or below it (`block`). |
| `leadingVisual` | carry | no | `ComponentId` | A visual (e.g. an icon) shown before the label. |
| `trailingVisual` | carry | no | `ComponentId` | A visual shown after the label. |
| `variant` | carry | no | `z.enum(['default','danger']) (default: "default")` | The item's style; `danger` marks a destructive choice. |
| `selected` | carry | no | `DynamicBoolean` | Whether the item is selected; two-way bound — a click writes the new state back. Meaningful only when the panel sets a `selectionVariant`. |
| `disabled` | carry | no | `DynamicBoolean` | Whether the item is disabled and cannot be selected. |
| `action` | carry (optional) | yes (← `onAction`) | `Action` | An effect performed when the item is selected — a local function or a server event. |
| `id` | carry | no | `z.string()` | An id identifying the item, used for selection identity and for ARIA references. |

### Functions

| name | args | returnType | description |
|---|---|---|---|
| `consoleLog` | `message: string` (The message to log.) | `void` | Logs a message. A local client-side effect invoked from the item's `functionCall` action. Already registered in the catalog — no new registration. |

### Dropped / deferred props

| prop | reason |
|---|---|
| `children` | Dropped: the raw `ReactNode`-before-text content channel; superseded by the flat `text` + `leadingVisual` fields. |
| `trailingIcon` / `trailingText` | Dropped: deprecated in favor of `trailingVisual`. |
| `groupId` | **Deferred** (`deferred-catalog-work.md`): item grouping, deferred together with the root `groupMetadata`. |
| `onAction` | Represented by the synthetic `action: Action`; no separate protocol prop. |
| `role` | Dropped: SelectPanel's items are always listbox `option`s — the render fn fixes the role, so there is no author choice to carry (unlike the general `ActionList.Item`). |
| `item` | Dropped: an object passed back into the `onAction` callback; no A2UI representation. |
| `accessibility` (`aria-*`) | Not carried: the item's accessible name comes from its `text` label, and `id` covers its ARIA wiring — no genuine additional author-facing a11y channel (the `ActionList.Item` per-component-fidelity precedent). |
| `className` | Styling passthrough; no A2UI representation. |
| the non-`aria-*` `div` HTML-attribute spread | Dropped: no A2UI representation. |

---

## Agent section

`Item`'s `action` accepts the `event` shape, so an agent section applies. One event name is emitted by
the paired client event fixture (`selectpanel-item-event`, in `selectpanel.md`): `label-select`.

**Open-panel visibility.** The item event fires while the panel is open, so its response is visible in
the open panel (the item's own checkmark) and on the always-rendered trigger. The response echoes the
selection back (binding proof via the checkmark) and swaps the trigger label (self-visible).

### Event-response table

| event | response messages (ordered, echoing `context.selected`) | visibility coupling (client fixture · bound prop ← path · initial value) |
|---|---|---|
| `label-select` | 1. `updateDataModel {path:'/sel/bug', value:<context.selected>}` (server echoes the received selection) · 2. `updateComponents [{id:'anchor-label', component:'Text', text:'✅ bug applied'}]` (surfaceId echoed — stamped at runtime, not authored) | `selectpanel-item-event` · `Item.selected ← /sel/bug` · initial `/sel/bug = false` |

The response is built from the event's `context.selected` — set by the item's optimistic two-way write
before the event fires — so it reflects the actual selection. The `anchor-label` swap is self-visible;
the `/sel/bug` echo is visible through the `selected ← /sel/bug` coupling, the half that proves two-way
binding on the item itself (the checkmark follows the data model, as `ActionList.Item`'s selection
follows `/assigned`).
