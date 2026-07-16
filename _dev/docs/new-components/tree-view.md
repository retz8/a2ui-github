# TreeView

- **Official documentation URL:** https://primer.style/components/tree-view
- **Real prop surface resolved from:** `@primer/react` installed type declarations at
  `node_modules/@primer/react/dist/TreeView/TreeView.d.ts` (`TreeViewProps`), reconciled against
  the implementation at `TreeView.js` (authority on defaults). Code defaults (`TreeView.js:70`):
  `truncate = true`; `flat` has no default (effectively `false`).
- **Component-level description (→ `catalog.json` `description`):** A hierarchical list of items
  that expand and collapse to reveal nested items, for navigating tree-structured content such as
  a file system.

> `TreeView` ships as a **compound family**, mirroring the component library one-to-one: the root
> plus its subcomponents are each shipped as a sibling catalog leaf in this same 6.45 sub-task,
> each with its own decision doc:
>
> - `tree-view-item.md` (`TreeView.Item`) · `tree-view-subtree.md` (`TreeView.SubTree`)
> - `tree-view-leadingvisual.md` (`TreeView.LeadingVisual`) · `tree-view-trailingvisual.md`
>   (`TreeView.TrailingVisual`)
> - `tree-view-directoryicon.md` (`TreeView.DirectoryIcon`) · `tree-view-errordialog.md`
>   (`TreeView.ErrorDialog`)
>
> The root's `children` slot references the `Item` leaves through the permissive `ChildList`
> convention (`stack.md`, `action-list.md`); `Item` holds its label (a `Text` leaf) alongside its
> `LeadingVisual`/`TrailingVisual` and nested `SubTree` leaves in that same list, exactly as Primer
> composes them. Visual slots reference the `Icon` leaf (6.2). Catalog schema names are
> PascalCase-concatenated: `TreeView`, `TreeViewItem`, `TreeViewSubTree`, `TreeViewLeadingVisual`,
> `TreeViewTrailingVisual`, `TreeViewDirectoryIcon`, `TreeViewErrorDialog`.

## Conventions established / reused by this family

- **Permissive `ChildList` for content + slots.** The root, `Item`, `SubTree`, and `ErrorDialog`
  carry `children` as `CommonSchemas.ChildList`; `Item` places its label alongside its
  visual/subtree leaves in that list (no synthetic label prop, no typed slot props), as Primer
  composes them.
- **Two-axis interaction on `Item`.** TreeView has two interaction axes: **expansion** and
  **selection**. Expansion folds into a two-way-bound `expanded: DynamicBoolean` (a toggle writes
  the new state back, mirroring `Checkbox`'s `onChange`→`checked`); selection is the `action`
  side-effect (← `onSelect`, `functionCall` or `event`, mirroring `ActionList.Item`).
- **Structured-array secondary actions.** `Item.secondaryActions` is a `z.array(z.object(...))`
  bundling a label, an `Icon` `ComponentId`, an optional count, and an `Action` per element. The
  `GenericBinder` resolves `Action`/`Dynamic*` at any depth and passes `ComponentId` strings
  through for `buildChild` (`generic-binder.js:58–71, 227–241`), so nested references resolve.
- **Overlay-infra dependency.** `ErrorDialog` renders a modal overlay; `secondaryActions` renders
  an action menu. Both consume overlay rendering (arriving with `Dialog`, 6.52). The build consumes
  that infra; if it is not landed at build time, the affected leaf/prop defers per the build skill's
  "consumes, never builds infra" rule.

## Dropped from the family

- **`TreeView.LeadingAction`** — undocumented (present in the installed types, absent from the
  official doc page). No documented semantics to translate, so it is dropped — same rationale that
  dropped `Header` (6.37).

---

## Adapter section

### Prop-surface table

| prop | decision | synthetic? | A2UI type | description |
|---|---|---|---|---|
| `children` | carry (required) | yes | `ChildList` | The tree items (rows) contained in the tree. |
| `flat` | carry | no | `z.boolean() (default: false)` | Whether items render without nested indentation guidelines. |
| `truncate` | carry | no | `z.boolean() (default: true)` | Whether long item labels are truncated to a single line instead of wrapping. |
| `accessibility` | carry | no | `AccessibilityAttributes` | Accessible label for the tree, for assistive technologies. |

### Functions

None. The root carries no `Action` and needs no local function.

### Dropped/deferred props

| prop | reason |
|---|---|
| `className` | Styling passthrough; no A2UI representation. |
| `style` | Styling passthrough; no A2UI representation. |

---

## Client section

### Fixture table

| fixture | exercises | component state / canned values | baselined? |
|---|---|---|---|
| `tree-view-nested` | baseline nesting — root `children`, item `children`/`id`/`expanded` (literal), subtree `done` children | root defaults; two top-level items, one `expanded: true` wrapping a `SubTree` (`state: done`) of two child items; labels via `Text` children | yes |
| `tree-view-flat` | root `flat` | root `flat: true`; three items | yes |
| `tree-view-truncate` | root `truncate` | root `truncate: true`; one item with a long label | yes |

(Item/subtree/visual/errordialog fixtures live in their own leaf docs; `tree-view-nested` is the
root's baseline and the shared composition backdrop.)

### Prop-coverage map

| adapter prop | covered by |
|---|---|
| `children` | `tree-view-nested` |
| `flat` | `tree-view-flat` |
| `truncate` | `tree-view-truncate` |
| `accessibility` | render-test assertion (non-visual) |

---

## Agent section

None. The root carries no `Action`, so it emits no event and has no agent section.
