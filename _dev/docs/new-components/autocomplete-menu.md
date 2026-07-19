# Autocomplete.Menu

- **Official documentation URL:** https://primer.style/react/Autocomplete/ (see the family note in
  `autocomplete.md`).
- **Real prop surface resolved from:** `@primer/react` installed type declarations at
  `node_modules/@primer/react/dist/Autocomplete/AutocompleteMenu.d.ts`
  (`AutocompleteMenuInternalProps<T>`), with the item shape
  `AutocompleteMenuItem = MandateProps<ActionListItemProps, 'id'> & { text?, leadingVisual?,
  trailingVisual? }` (`ActionList` item types). Code defaults from `AutocompleteMenu.js`
  (`selectionVariant = 'single'`, `emptyStateText = 'No selectable options'`). Reconciled against the
  official doc.
- **Component-level description (→ `catalog.json` `description`):** The filterable list of selectable
  suggestions shown inside an autocomplete's overlay.

The filter/selection engine. Suggestions are a structured **data array** (`items`), the
`ActionBar.Menu` pattern — Primer runs its own filtering/selection over that array, so modeling
suggestions as child components would fight the component. Filtering (case-insensitive substring
match on the input text) and sort-on-close (selected-to-top) are Primer defaults, kept.

- `items` is the authored suggestion array. Per item: scalar fields plain, reference fields
  (`leadingVisual`/`trailingVisual`) as binder-resolved `ComponentId` icons (the `ActionBar.Menu`
  item convention). Selection machinery (`selected`, `onSelect`), child-slot composition
  (`children`, `description`, trailing action), and per-row runtime state (`active`, `loading`,
  `inactiveText`, `role`, `size`) are dropped from the item — selection is Menu-level via
  `selectedItemIds`/`onSelectedChange`, and a static suggestion list has no per-row runtime state.
- `selectedItemIds` is the selection state, **two-way bound** (the `Select.value` / `Checkbox.checked`
  pattern generalized to an array): `onSelectedChange` writes the new `string[]` back through the
  binder's setter. There is no `DynamicList`, so the type is a union of the array + `DataBinding`
  (the `textinput.md` `validationStatus` mechanism). Optional — absence means empty (nothing
  selected).
- `onSelectedChange` is **represented by the `selectedItemIds` write-back** (the `Select.onChange`
  precedent); an optional selection `Action` for agent round-trips is **deferred**
  (`deferred-catalog-work.md`).
- `addNewItem` (append a "create a value not in the list" row) is carried as an item object plus an
  `Action` (`action` ← `handleAddItem`, fired when the row is chosen). `Action` context is authored,
  not per-invocation, so the row's live typed value is not delivered as a parameter — the agent
  reads it from the input's two-way-bound `value` path instead.
- `onOpenChange` is dropped: menu open/close is internally managed and fires incidentally (on focus,
  every keystroke, blur, select, Escape); an authored-context `Action` cannot distinguish open from
  close, so it is not a useful authored hook.

The item schema:

```
itemSchema = z.object({
  id:             z.string(),                            // required — item identity, keyed by selectedItemIds
  text:           z.string().optional(),                 // the option's label
  leadingVisual:  CommonSchemas.ComponentId.optional(),  // an Icon before the label
  trailingVisual: CommonSchemas.ComponentId.optional(),  // an Icon after the label
  disabled:       z.boolean().optional(),                // whether the option is selectable
  variant:        z.enum(['default','danger']).optional(),// a destructive-styled option
}).strict()
```

---

## Adapter section

### Prop-surface table

| prop | decision | synthetic? | A2UI type | description |
|---|---|---|---|---|
| `items` | carry (required) | no | `z.array(itemSchema)` | The suggestion options shown in the dropdown. |
| `selectedItemIds` | carry (optional) | no | `z.union([z.array(z.string()), DataBinding])` | The ids of the currently selected options. Two-way bound: selecting/deselecting writes the new id array back to the bound data-model path. |
| `selectionVariant` | carry | no | `z.enum(['single','multiple']) (default: "single")` | Whether one or multiple options may be selected. |
| `emptyStateText` | carry | no | `DynamicString (default: "No selectable options")` | Text shown when there are no options to display. |
| `loading` | carry | no | `DynamicBoolean` | Whether the options are still loading. |
| `addNewItem` | carry | no | `z.object({ ...itemSchema, action: Action })` | An extra row that lets the user create a value not in the list; its `action` runs when the row is chosen. |
| `accessibility` | carry (optional) | no | `AccessibilityAttributes` | Accessible name for the options list (the `aria-labelledby` requirement; visible labeling ships via `FormControl`, the Select/TextInput deferral). |

Per-item schema (`items[]` entry): see the block above.

### Functions

None new. `addNewItem.action` (and any per-fixture `functionCall`) references the already-registered
`consoleLog` / `windowAlert` / `clearValue`.

### Dropped / deferred props

| prop | reason |
|---|---|
| `onSelectedChange` | Represented by the two-way binding on `selectedItemIds`; no separate protocol prop. Deferred: an optional selection `Action` only if a future flow needs selection-initiated agent round-trips (`Select` precedent). |
| `onOpenChange` | Dropped: menu open/close is internally managed and fires incidentally; an authored-context `Action` cannot distinguish the open from the close transition. |
| `filterFn` | Function-typed custom filter; not JSON-serializable. Primer's default (case-insensitive substring match on the input text) is kept. |
| `sortOnCloseFn` | Function-typed custom sort; not JSON-serializable. Primer's default (selected-to-top on close) is kept. |
| `customScrollContainerRef` | Ref-typed; not JSON-serializable. |
| `metadata` (per item) | Arbitrary opaque `T` passthrough for consumer bookkeeping; no author-facing rendering effect. |
| *(item `selected`, `onSelect`, `children`, `description`, trailing action, `active`, `loading`, `inactiveText`, `role`, `size`)* | Dropped from the item schema: selection is Menu-level (`selectedItemIds`/`onSelectedChange`); child-slot composition and per-row runtime state have no place in a flat data array. |

---

## Client section

Fixtures live on the root (`autocomplete.md`) — the Menu never renders standalone. The whole menu
surface is covered by **vitest render-tests** (`userEvent`), since the open menu can't be
pixel-baselined with the static harness (the root's open-menu deferral).

### Prop-coverage map

| adapter prop | covered by |
|---|---|
| `items` | `autocomplete-open` (render: 3 items with text + leading icons) · `autocomplete-filter` (default filter) · `autocomplete-item-disabled` (item `disabled`) · `autocomplete-item-variant` (item `variant: danger`); item `trailingVisual` asserted in `autocomplete-open` |
| `selectedItemIds` | `autocomplete-single-select` (literal write-back) · `autocomplete-multiple-select` (accumulation) · `autocomplete-selected-bound` (bound + two-way write-back) |
| `selectionVariant` | `autocomplete-single-select` (single) · `autocomplete-multiple-select` (multiple) |
| `emptyStateText` | `autocomplete-empty` (non-matching input → empty text) |
| `loading` | `autocomplete-loading` (menu loading indicator) |
| `addNewItem` | `autocomplete-addnew-fn` (action functionCall) · `autocomplete-addnew-event` (action event → agent) |
| `accessibility` | render-test assertion: `aria-labelledby` / accessible name on the listbox |

---

## Agent section

The family's only `event`-shaped `Action` is `addNewItem.action` (every other interaction is a
local two-way write-back). It fires when the user picks the "create a value not in the list" row,
exercised by the composed `autocomplete-addnew-event` render-test fixture.

Grounding flow: the user typed a value not among the suggestions (`/query = "wontfix"`) and chose
"Create new label" — a plausible server creates the label, confirms it, and selects it. Because
`Action` context is authored (not per-invocation), the typed value is read from the input's
two-way-bound `value` path (`/query`), not delivered through the event.

**Coupled composition** (realized in the `autocomplete-addnew-event` fixture): root = `Stack`
[ `Autocomplete`, `Text`(id `add-message`, `text ← /add/message`, initial "No label yet"),
`Text`(id `add-status`, "—") ]; Input `value ← /query` (initial "wontfix"); Menu
`selectedItemIds ← /selected` (initial `[]`), `addNewItem: {id:'add-new', text:'Create new label',
action: event create-label}`.

### Event-response table

| event | response messages (ordered, with canned values) | visibility coupling (client fixture · bound prop ← path · initial value) |
|---|---|---|
| `create-label` | 1. `updateDataModel {path: '/add/message', value: 'Label "wontfix" created'}` · 2. `updateDataModel {path: '/selected', value: ['wontfix']}` · 3. `updateComponents [{id: 'add-status', component: 'Text', text: '✅ Server added the label'}]` (surfaceId echoed — stamped at runtime, not authored) | `autocomplete-addnew-event` · `add-message` `Text` `text ← /add/message` (initial "No label yet") · Menu `selectedItemIds ← /selected` (initial `[]`, becomes `['wontfix']`) · `add-status` swap (self-visible) |

Notes:

- The response exercises **both** update mechanisms: two `updateDataModel` writes (the `/add/message`
  confirmation, binding proof via the bound `add-message` `Text`; and `/selected`, which selects the
  newly created value — the second half proves the two-way `selectedItemIds` binding) and one
  `updateComponents` swap (`add-status`, self-visible).
- The typed value is read from `/query` (the input's two-way-bound `value`), not the event context —
  the `addNewItem` authored-context limitation recorded in the adapter section.
- The unknown-event fallback is infra behavior, not authored here.
