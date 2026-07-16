# TreeView.DirectoryIcon

- **Part of the `TreeView` compound family** (6.45) — see `tree-view.md` for the family note,
  shared conventions, and the component-level frame.
- **Official documentation URL:** https://primer.style/components/tree-view
- **Real prop surface resolved from:** `@primer/react` type declarations at
  `node_modules/@primer/react/dist/TreeView/TreeView.d.ts` (`DirectoryIcon: () => React.JSX.Element`
  — zero props).
- **Component-level description (→ `catalog.json` `description`):** A preset folder icon for a tree
  item that reflects the item's expanded state (open when expanded, closed when collapsed).

---

## Adapter section

**Zero-prop leaf.** Schema is `z.object({}).strict()`. `DirectoryIcon` is a marker/preset icon
placed inside a `LeadingVisual`; it renders the folder icon and toggles open/closed with the parent
item's expansion. It carries no configurable props.

### Prop-surface table

None (no props).

### Functions

None.

### Dropped/deferred props

None.

---

## Client section

### Fixture table

| fixture | exercises | component state / canned values | baselined? |
|---|---|---|---|
| `tree-view-directory-icon` | the preset directory icon, expand-reflecting | a directory item with `LeadingVisual`→`DirectoryIcon`, shown expanded (open folder) and collapsed (closed folder) — two surfaces | yes |

A dedicated fixture (rather than folding into `tree-view-visuals`) because the open/closed folder
transition is the whole behavior of this leaf.

### Prop-coverage map

| adapter prop | covered by |
|---|---|
| (no props) | `tree-view-directory-icon` (renders in both expanded and collapsed states) |

---

## Agent section

None. `DirectoryIcon` carries no `Action`.
