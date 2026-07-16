# NavList.GroupExpand

- **Official documentation URL:** https://primer.style/components/nav-list
- **Real prop surface resolved from:** `@primer/react` type declarations at
  `node_modules/@primer/react/dist/NavList/NavList.d.ts` (v38.28.0):
  `NavListGroupExpandProps = { label?: string; pages?: number; items: GroupItem[];
  renderItem?: (item: GroupItem) => React.ReactNode }` where
  `GroupItem = { text: string; trailingVisual?: Icon | string; leadingVisual?: Icon;
  trailingAction?: ActionListTrailingActionProps; 'data-expand-focus-target'?: string } &
  Omit<NavListItemProps, 'children'>` (i.e. also `href?`, `'aria-current'?`, `defaultOpen?`,
  `inactiveText?`, `as?`). Implementation `NavList.js`: `pages` default `0`; the control paginates
  `items` client-side via internal state (a "show more" `ActionList.Item`), no external
  infrastructure. `label` is documented as required.
- **Component-level description (→ `catalog.json` `description`):** An expandable group that reveals
  its navigation items progressively behind a "show more" control.

> Part of the `NavList` compound family (6.41) — see `navlist.md` for the family overview and shared
> conventions. **This is the one leaf that expresses items as a serialized data array** (`items`)
> rather than a `ChildList` of composable leaves — because Primer's `GroupExpand` API takes items as
> data, not JSX children.

## Modeling note — items as data, icons as names

`GroupExpand`'s `items` is a `z.array` of item **data objects**, not a `ChildList`. Consequently the
visual/action fields live *inside* each array element as data, and an array-local value cannot hold a
`ComponentId` (which points into the surface's component tree). So, uniquely in this family:

- `leadingVisual` (Primer `Icon`) → the **`Icon` leaf's `name` enum** (kebab-case octicon name).
- `trailingVisual` (Primer `Icon | string`) → `z.string()` — an octicon name **or** literal text
  (e.g. a count).
- `trailingAction` → a nested `z.object`. Its `action` is an A2UI `Action` — a JSON descriptor, so it
  serializes fine inside array data. The nested control uses the literal `label: DynamicString` field
  (the actual `GroupItem.trailingAction.label`), not the `AccessibilityAttributes` common the
  composable `navlist-trailingaction` leaf uses — a deliberate divergence because this is a data
  field, not a component prop.

Everything in `GroupItem` is representable; only `renderItem` (a render function) is unrepresentable
and dropped.

---

## Adapter section

### Prop-surface table

| prop | decision | synthetic? | A2UI type | description |
|---|---|---|---|---|
| `items` | carry (required) | no | `z.array(GroupItem)` | The navigation items revealed as the group expands. |
| `label` | carry (required) | no | `DynamicString` | Accessible name for the expand control. |
| `pages` | carry | no | `z.number() (default: 0)` | How many pages the items are revealed across. |

Nested `GroupItem` object:

| field | required? | A2UI type | description |
|---|---|---|---|
| `text` | required | `DynamicString` | The item's label. |
| `href` | optional | `DynamicString` | The URL the item links to. |
| `ariaCurrent` | optional | `z.enum(['page','step','location','date','time','true','false'])` | Marks this item as the current page or location. |
| `defaultOpen` | optional | `z.boolean()` | Whether the item's sub-navigation starts expanded. |
| `inactiveText` | optional | `DynamicString` | Text explaining why the item is inactive. |
| `leadingVisual` | optional | `Icon`-leaf `name` enum (kebab-case octicon name) | An icon shown before the item's label. |
| `trailingVisual` | optional | `z.string()` | An octicon name or literal text shown after the item's label. |
| `trailingAction` | optional | `z.object({ icon: <Icon name enum>, label: DynamicString, action: Action, loading: DynamicBoolean })` | A trailing action control on the item; `action ← onClick`. |

### Functions

| name | args | returnType | description |
|---|---|---|---|
| `consoleLog` | `message: string` (The message to log.) | `void` | Logs a message. A local client-side effect invoked from a nested `trailingAction`'s `functionCall` action. Already registered in the catalog — no new registration. |

### Dropped / deferred props

| prop | reason |
|---|---|
| `renderItem` | A render function; not JSON-serializable. The default item rendering applies. |
| `items[].as` | Polymorphic element selector that switches item identity; behavioral, no protocol representation. |
| `items[].data-expand-focus-target` | Internal focus-management data attribute; no A2UI representation. |

---

## Client section

Realistic scenario: a `Group` ("Repositories") whose items are revealed behind a "Show more" control.
The baseline covers the collapsed first page with visuals and one nested `trailingAction` (wired
`functionCall`, for render coverage of the nested-action shape). A behavioral interaction test covers
pagination (no PNG — the expanded state is just more of the same items, from Primer-internal state).

### Fixture table

| fixture | exercises (coverage axis) | component state / canned values | baselined? |
|---|---|---|---|
| `navlist-groupexpand` | `items` (static array) + `label` + `pages` (collapsed first page) | `NavList`[`Group` (`GroupHeading` "Repositories")[`GroupExpand` `label: "Show more repositories"`, `pages: 2`, `items`: `[{text:"api", leadingVisual:"repo", href:"#"}, {text:"web", leadingVisual:"repo", trailingVisual:"3", href:"#"}, {text:"docs", leadingVisual:"repo", href:"#", trailingAction:{icon:"pin", label:"Pin docs", action: functionCall consoleLog {message:"pin docs"}}}, {text:"infra", leadingVisual:"repo", href:"#", ariaCurrent:"page"}]`]] | yes |
| `navlist-groupexpand-showmore` | pagination behavior — "Show more" reveals the next page | same as `navlist-groupexpand`; interaction test: click "Show more" → the next page's items render | no — behavioral (Primer-internal `currentPage` state; expanded state is just more items) |

### Prop-coverage map

| adapter prop | covered by |
|---|---|
| `items` | `navlist-groupexpand` (static array incl. `leadingVisual` / `trailingVisual` / nested `trailingAction` / `href` / `ariaCurrent`) |
| `label` | render-test assertion (accessible name on the "show more" control) |
| `pages` | `navlist-groupexpand` (set) + `navlist-groupexpand-showmore` (pagination exercised) |

---

## Agent section

Omitted. `GroupExpand`'s only interactive surface is a nested `trailingAction`, wired `functionCall`
in the fixtures (render-only) — no `event`-shaped `Action` is emitted. The family's single agent site
is the composable `navlist-trailingaction` leaf (`navlist-trailingaction.md`).
