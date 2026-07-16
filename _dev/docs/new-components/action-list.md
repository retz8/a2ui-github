# ActionList

- **Official documentation URL:** https://primer.style/components/action-list
- **Real prop surface resolved from:** `@primer/react` installed type declarations at
  `node_modules/@primer/react/dist/ActionList/List.d.ts` and `shared.d.ts` (root
  `ActionListProps`), reconciled against the implementation at `List.js` (authority on
  defaults) and `Selection.js` (authority on `selectionVariant` behavior). Code defaults
  (`List.js`): `variant = "inset"`, `showDividers = false`, `disableFocusZone = false`;
  `selectionVariant` and `role` have no default. `Selection.js` confirms `selectionVariant`
  has three live branches — `single` (checkmark), `radio` (renders a `Radio` button), and
  `multiple` (checkbox); the `radio` value is real and functional but omitted from the doc's
  props table (code is authority, and the faithful-translation rule carries it).
- **Component-level description (→ `catalog.json` `description`):** A vertically stacked list of
  actions or selectable options, optionally organized into labeled groups and separated by
  dividers.

> `ActionList` ships as a **compound family**, mirroring the component library one-to-one: the
> root plus its 10 subcomponents are each shipped as a sibling catalog leaf in this same 6.38
> sub-task, each with its own decision doc:
>
> - `action-list-item.md` (`ActionList.Item`), `action-list-linkitem.md` (`ActionList.LinkItem`)
> - `action-list-group.md` (`ActionList.Group`), `action-list-groupheading.md`
>   (`ActionList.GroupHeading`)
> - `action-list-leadingvisual.md` (`ActionList.LeadingVisual`), `action-list-trailingvisual.md`
>   (`ActionList.TrailingVisual`)
> - `action-list-description.md` (`ActionList.Description`), `action-list-divider.md`
>   (`ActionList.Divider`)
> - `action-list-trailingaction.md` (`ActionList.TrailingAction`), `action-list-heading.md`
>   (`ActionList.Heading`)
>
> The root's `children` slot references the item/group/divider/heading leaves; `Item` (and
> `LinkItem`) hold their label plus their leading/trailing-visual, description, and
> trailing-action leaves through the permissive `ChildList` convention (`stack.md`,
> `pageheader.md`) — the catalog stays permissive on which child fills which slot; Primer's own
> type-based slotting places them, and the agent composes per the library's structure. Icon
> slots reference the `Icon` leaf (6.2).

## Conventions established / reused by this family

- **Permissive `ChildList` for content + slots.** The root, `Item`, `LinkItem`, and `Group`
  carry `children` as `CommonSchemas.ChildList`; `Item`/`LinkItem` place their label (a `Text`
  leaf) alongside their `LeadingVisual`/`TrailingVisual`/`Description`/`TrailingAction` leaves
  in that list, exactly as Primer composes them (no synthetic label prop, no typed slot props).
- **Per-item selection model.** Selection is per-item and consumer-controlled, mirroring the
  `Checkbox` (state) + `SegmentedControl` (side-effect) split: `Item.selected: DynamicBoolean`
  is two-way bound (optimistic write on click), and `Item.action: Action` (← `onSelect`,
  optional) is the side-effect. The root `selectionVariant` only decides how a selected item
  renders. Single-select exclusivity is owned by the data model / agent event handler, not the
  schema.
- **`AccessibilityAttributes` for interactive leaves.** Carried on leaves with a genuine
  author-facing accessible-name need (the root `listbox`/`menu` container; `Item`) — the
  interactive-component convention (`Button`), distinct from the leaf's `role` channel.

---

## Adapter section

### Prop-surface table

| prop | decision | synthetic? | A2UI type | description |
|---|---|---|---|---|
| `children` | carry (optional) | yes | `ChildList` | The items, groups, dividers, and heading contained in the list. |
| `variant` | carry | no | `z.enum(['inset','horizontal-inset','full']) (default: "inset")` | How items are offset from the list's edges. |
| `selectionVariant` | carry | no | `z.enum(['single','radio','multiple'])` | Whether one or many items may be selected, and how a selected item is indicated (checkmark, radio button, or checkbox). |
| `showDividers` | carry | no | `z.boolean() (default: false)` | Whether a divider is shown above each item. |
| `role` | carry | no | `z.string()` | The ARIA role describing the list's function, e.g. `listbox` or `menu`. |
| `disableFocusZone` | carry | no | `z.boolean() (default: false)` | Whether the list's built-in keyboard arrow-key navigation is turned off. |
| `as` | carry | no | `z.enum(['ul','ol','div']) (default: "ul")` | The HTML element used to render the list container; the choices are display-equivalent and differ only in semantic/landmark identity. |
| `accessibility` | carry | no | `AccessibilityAttributes` | Accessible label/description for the list, for assistive technologies. |

### Functions

None. The root carries no `Action` and needs no local function.

### Dropped / deferred props

| prop | reason |
|---|---|
| `className` | Styling passthrough; no A2UI representation. |
| non-`aria-*` `ul` HTML-attribute spread (`id`, `tabIndex`, `data-*`, …) | Dropped: no A2UI representation. |

---

## Client section

Family-wide and **composed-centered** (the `pageheader.md` model): the 8 non-interactive
container/content leaves (root slots, `Group`, `GroupHeading`, `LeadingVisual`, `TrailingVisual`,
`Description`, `Divider`, `Heading`, `LinkItem`) are covered by one richly-assembled baseline
rather than 8 near-identical lists; the 2 interactive leaves (`Item`, `TrailingAction`) and the
visually-distinct states/enums get their own single-axis fixtures.

**Every fixture is a realistic `ActionList` surface, never a naked leaf.** A visual/description/
trailing-action leaf is only ever exercised inside an `Item` inside a real list; a single-axis
fixture is a plausible short menu that foregrounds one axis (e.g. `actionlist-item-disabled` is a
realistic list with one disabled row), not a lone floating leaf. Every visual **enum** axis is a
gallery over all its values; **boolean** states are single set-state fixtures. Filler content is
GitHub-triage-flavored and built from already-shipped leaves (`Icon`, `Text`, `Label`,
`CounterLabel`, `Link`).

### Fixture table

| fixture | exercises (coverage axis) | component state / canned values | baselined? |
|---|---|---|---|
| `actionlist` | composed baseline — root `children` + every container/content leaf's slot | `Heading`("Repository actions") · `Group`(`GroupHeading`"Pull request #42", `auxiliaryText`"opened by octocat") → `Item`[`LeadingVisual`→`Icon` git-pull-request, label "View pull request", `Description` inline "opened 2 days ago", `TrailingVisual`→`CounterLabel` "3"]; `Item`[label "Merge pull request", `TrailingAction`→`Icon` kebab + label "More options"]; `LinkItem`[`LeadingVisual`→`Icon` link-external, "Open on GitHub", `href`] · `Divider` · `Group`(`GroupHeading`"Danger zone") → `Item`(`variant: danger`)[`LeadingVisual`→`Icon` trash, "Delete branch"] | yes |
| `actionlist-children-template` | root `children` — dynamic template (bound) | `children:{componentId:'tpl', path:'/items'}`; `tpl`=`Item`[`LeadingVisual`→`Icon`, label `{path:'./title'}`]; data model `/items=[{title:'View pull request'},{title:'Merge'},{title:'Close'}]` | yes |
| `actionlist-selection` | gallery — `selectionVariant` × `Item.selected` (literal) | 3 surfaces: `single` (checkmark), `radio`, `multiple` (checkboxes); each a realistic 3-item list ("Assign to me"/…) with 1–2 items `selected:true` | yes (1 PNG) |
| `actionlist-selected-bound` | `Item.selected` — two-way binding + write-back | `multiple` label list; item `selected:{path:'/labels/bug'}` init `false`; interaction test: click item → `/labels/bug=true` → re-renders selected | no — behavioral (Checkbox-bound precedent) |
| `actionlist-item-fn` | `Item.action` — functionCall (local) | realistic menu; one `Item` `action: functionCall consoleLog {message:"item selected"}` | yes |
| `actionlist-item-event` | `Item.action` — event (→ agent) + coupling | realistic menu; `Item` "Assign to me" `selected:{path:'/assigned'}` (init `false`), `action: event {name:'select', context:{assigned:{path:'/assigned'}}}`; sibling `Text` id `status` ("Choose an action"). Server echoes `/assigned` + swaps `status` (see `action-list-item.md` agent section) | yes |
| `actionlist-item-active` | `Item.active` (boolean state) | realistic nav-style list; one `Item` `active:true` (current page) | yes |
| `actionlist-item-disabled` | `Item.disabled` (boolean state) | realistic menu; one `Item` `disabled:true` | yes |
| `actionlist-item-loading` | `Item.loading` (boolean state) | realistic menu; one `Item` `loading:true` | yes |
| `actionlist-item-inactive` | `Item.inactiveText` (boolean-ish state) | realistic menu; one `Item` `inactiveText:"Unavailable during outage"` | yes |
| `actionlist-item-variant` | gallery — `Item.variant` | 2 surfaces: `default` / `danger`; each a realistic short list | yes (1 PNG) |
| `actionlist-item-size` | gallery — `Item.size` | 2 surfaces: `medium` / `large`; each a realistic short list | yes (1 PNG) |
| `actionlist-variant` | gallery — root `variant` | 3 surfaces: `inset` / `horizontal-inset` / `full`; each the same realistic list | yes (1 PNG) |
| `actionlist-dividers` | root `showDividers` (boolean state) | realistic 4-item list, `showDividers:true` | yes |
| `actionlist-group-variant` | gallery — `Group.variant` | 2 surfaces: `filled` / `subtle`; each a realistic grouped list | yes (1 PNG) |
| `actionlist-description` | gallery — `Description.variant` + `truncate` | surfaces: `inline`, `block`, and a narrow `truncate:true`; realistic items with secondary text | yes (1 PNG) |
| `actionlist-trailingaction-fn` | `TrailingAction.action` — functionCall | realistic menu; `Item` with `TrailingAction`[`icon`, `label`, `action: functionCall consoleLog {…}`] | yes |
| `actionlist-trailingaction-event` | `TrailingAction.action` — event (→ agent) + coupling | realistic "manage labels" menu; `Item` id `labelrow`[label "bug", `TrailingAction`(icon trash, `label:"Remove label"`, `action: event {name:'remove', context:{label:'bug'}}`)], `Item.disabled:{path:'/removed'}` (init `false`); sibling `Text` id `status` ("Manage labels"). Server writes `/removed` + swaps `status` (see `action-list-trailingaction.md` agent section) | yes |
| `actionlist-trailingaction-loading` | `TrailingAction.loading` (boolean state) | realistic menu; `TrailingAction` `loading:true` | yes |

### Prop-coverage map

| adapter prop | covered by |
|---|---|
| root `children` | `actionlist` (static assembly) + `actionlist-children-template` (dynamic template) |
| root `variant` | `actionlist-variant` |
| root `selectionVariant` | `actionlist-selection` (all three values) |
| root `showDividers` | `actionlist-dividers` |
| root `role` / `disableFocusZone` / `as` / `accessibility` | render-test assertions (list `role`; focus-zone disabled; rendered element tag; `aria-label`/`aria-description`) |
| `Item.children` | `actionlist` (label + all slots) + every item fixture |
| `Item.selected` | `actionlist-selection` (literal) + `actionlist-selected-bound` (bound + write-back) |
| `Item.action` | `actionlist-item-fn` (functionCall) + `actionlist-item-event` (event) |
| `Item.active` / `disabled` / `loading` / `inactiveText` | `actionlist-item-active` / `-disabled` / `-loading` / `-inactive` |
| `Item.variant` / `size` | `actionlist-item-variant` / `actionlist-item-size` |
| `Item.role` / `id` | render-test assertions |
| `LinkItem.*` (`children`, `href`, `active`, `inactiveText`, `variant`, `size`, `target`) | `actionlist` (composed: `href` + label + visual); `target` render-test assertion |
| `Group.children` / `variant` / `auxiliaryText` / `selectionVariant` / `role` | `actionlist` (composed) + `actionlist-group-variant` (`variant`); `selectionVariant`/`role` render-test assertions |
| `GroupHeading.*` (`children`, `variant`, `auxiliaryText`, `as`) | `actionlist` (composed); `visuallyHidden` render-test assertion |
| `LeadingVisual.children` / `TrailingVisual.children` | `actionlist` (composed — Icon / CounterLabel) |
| `Description.text` / `variant` / `truncate` | `actionlist` (composed inline) + `actionlist-description` (variants + truncate) |
| `Divider` | `actionlist` (composed) |
| `Heading.text` / `as` / `size` / `visuallyHidden` | `actionlist` (composed); `as`/`size`/`visuallyHidden` render-test assertions |
| `TrailingAction.icon` / `label` / `action` / `loading` | `actionlist` (composed icon+label) + `actionlist-trailingaction-fn` / `-event` (`action`) + `-loading`; `label`→`aria-label` render-test assertion |
| `TrailingAction.as` / `href` | render-test assertion (link mode — anchor `href` emitted; pixels redundant with button mode) |

---
