# Autocomplete

- **Official documentation URL:** https://primer.style/react/Autocomplete/ (the
  `/components/autocomplete` URL redirects; the React docs page is the canonical prop-surface
  reference).
- **Real prop surface resolved from:** `@primer/react` installed type declarations at
  `node_modules/@primer/react/dist/Autocomplete/Autocomplete.d.ts` — the root is
  `FCWithSlotMarker<React.PropsWithChildren<{ id?: string }>>` — reconciled against the official
  doc (root documents only `children` + `id`).
- **Component-level description (→ `catalog.json` `description`):** A text field paired with a
  filterable dropdown of suggestions: the user types to narrow the options and selects one or more.

> `Autocomplete` ships as a compound family mirroring Primer's structure, all in the 6.51 sub-task
> with sibling decision docs:
> - **`Autocomplete`** (this doc) — the root/context wrapper; its `children` slot holds the Input
>   and the Overlay.
> - **`Autocomplete.Input`** (`autocomplete-input.md`) — the text field (a `TextInput` mirror).
> - **`Autocomplete.Overlay`** (`autocomplete-overlay.md`) — the floating panel; its `children` slot
>   holds the Menu.
> - **`Autocomplete.Menu`** (`autocomplete-menu.md`) — the filter/selection engine; suggestions are
>   an `items` **data array** (the `ActionBar.Menu` pattern), not child components (Primer exposes no
>   `Autocomplete.Item`).
>
> Composition mirrors Primer exactly:
> `<Autocomplete>` → [`<Autocomplete.Input>`, `<Autocomplete.Overlay>` → [`<Autocomplete.Menu>`]].
> Rendering the real Primer sub-components in their true nesting lets Primer's own React context
> (`inputValue`, `showMenu`, `activeDescendant`, selection) flow between Input and Menu — no
> reimplementation. Uses the `ChildList` container-slot convention (`stack.md`).

---

## Adapter section

### Prop-surface table

| prop | decision | synthetic? | A2UI type | description |
|---|---|---|---|---|
| `children` | carry (optional) | yes | `ChildList` | The autocomplete's text field and its suggestion overlay. |

### Functions

None.

### Dropped / deferred props

| prop | reason |
|---|---|
| `id` | Dropped: collides with the A2UI component-envelope `id` every instance already carries (the `ActionList.Item` precedent). |

---

## Client section

The family renders as **one composed widget** (`Autocomplete` → [`Autocomplete.Input`,
`Autocomplete.Overlay` → `Autocomplete.Menu`]); no sub-leaf renders standalone, so every fixture is
a full composition and all fixtures live on this root doc. The member docs
(`autocomplete-input.md`, `autocomplete-overlay.md`, `autocomplete-menu.md`) carry only coverage maps
pointing at these fixtures.

**Open-menu visual baseline is deferred** (`deferred-catalog-work.md`). The menu opens only from
internal context state (focus/typing) — the family drops the sole props that could force it open
(`Autocomplete.Overlay.visibility`, `Autocomplete.Input.openOnFocus`), and the client baseline
harness (`client/e2e/visual.spec.ts`) is static-render-only (`goto → screenshot`, no focus/type
driving). So Playwright baselines capture the **closed input**; the entire **open-menu surface**
(items, icons, selection, filtering, empty state, loading, add-new) is covered by **vitest
render-tests** (`userEvent` focus/type), the `AnchoredOverlay` gesture-coverage precedent. Revisit
the open-menu pixel baseline once focus-capture baseline infra exists (the `TextInput.Action` tooltip
precedent).

Canonical content across fixtures: Menu `items` = three labels (`bug` "Bug", `feature` "Feature",
`docs` "Docs"), each with a `leadingVisual`→`Icon`; Input `leadingVisual`→`Icon` (search).

### Fixture table (baselined — closed input)

| fixture | exercises (coverage axis) | component state / canned values | baselined? |
|---|---|---|---|
| `autocomplete` | base — root `children` (composed Input + Overlay + Menu, menu closed), Input `value` literal + `leadingVisual` | Input `value: "bug"`, `leadingVisual`→`Icon`(search); Menu `items`: 3 labels; `selectedItemIds: []` | yes |
| `autocomplete-placeholder` | Input `placeholder` while empty | `value: ""`, `placeholder: "Search labels"` | yes |
| `autocomplete-disabled` | Input `disabled` | `disabled: true`, `value: "bug"` | yes |

### Render-tests (vitest + `userEvent` — open-menu surface & Input behavior)

Menu behavior/content: `autocomplete-open` (focus/type → menu opens, 3 items render with leading
icons) · `autocomplete-filter` (type "bu" → default filter narrows) · `autocomplete-single-select`
(click item → `selectedItemIds=[id]`, input fills, menu closes) · `autocomplete-multiple-select`
(`selectionVariant:'multiple'` → selection accumulates, menu stays) · `autocomplete-selected-bound`
(`selectedItemIds`→`{path}` two-way write-back) · `autocomplete-empty` (non-matching input →
`emptyStateText`) · `autocomplete-loading` (`loading:true` → menu loading indicator) ·
`autocomplete-addnew-fn` (`addNewItem.action` functionCall fires `consoleLog`) ·
`autocomplete-addnew-event` (`addNewItem.action` event → agent; see Agent section) ·
`autocomplete-item-disabled` (disabled item not selectable) · `autocomplete-item-variant` (danger
item renders).

Input behavior/passthrough: `autocomplete-value-bound` (type → `/query` two-way write-back) ·
forwarded-passthrough assertions (rendering identical to the baselined `textinput.md`): `size`,
`block`, `contrast`, `monospace`, `characterLimit`, `loaderPosition`, `loaderText`,
`validationStatus` (+ `aria-invalid`), `type` (search semantics), `required` (`aria-required`),
`trailingVisual`, `trailingAction`, `accessibility` (`aria-label`/`aria-description`).

### Prop-coverage map (root)

| adapter prop | covered by |
|---|---|
| `children` | every fixture (the composed Input + Overlay) |

---

## Agent section

Omitted. The root emits no `event`-shaped `Action` (it carries no `Action` at all — it is a pure
context/container leaf). The family's one agent event (`create-label`, from `Autocomplete.Menu`'s
`addNewItem.action`) is designed in `autocomplete-menu.md`.
