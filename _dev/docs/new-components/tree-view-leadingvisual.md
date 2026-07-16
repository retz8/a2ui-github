# TreeView.LeadingVisual

- **Part of the `TreeView` compound family** (6.45) — see `tree-view.md` for the family note,
  shared conventions, and the component-level frame.
- **Official documentation URL:** https://primer.style/components/tree-view
- **Real prop surface resolved from:** `@primer/react` type declarations at
  `node_modules/@primer/react/dist/TreeView/TreeView.d.ts` (`TreeViewVisualProps`).
- **Component-level description (→ `catalog.json` `description`):** An icon shown before a tree
  item's label.

---

## Adapter section

### Prop-surface table

| prop | decision | synthetic? | A2UI type | description |
|---|---|---|---|---|
| `child` | carry (required) | yes (← `children`) | `ComponentId` | The icon shown before the item's label. |
| `label` | carry (optional) | no | `z.string()` | Accessible label describing the visual, for assistive technologies. |

### Functions

None.

### Dropped/deferred props

| prop | reason |
|---|---|
| `children` render-prop form `((props: { isExpanded }) => ReactNode)` | Not JSON-serializable; the expand-aware icon swap is not modeled. A static icon reference is carried as `child` (`ComponentId`) instead. |

---

## Client section

### Fixture table

| fixture | exercises | component state / canned values | baselined? |
|---|---|---|---|
| `tree-view-visuals` | `child` (leading icon) | item with `LeadingVisual`→`Icon(file)` and `TrailingVisual`→`Icon(dot)`; each with `label` | yes |

Shared with `tree-view-trailingvisual.md` — one fixture exercises both visuals on one item.

### Prop-coverage map

| adapter prop | covered by |
|---|---|
| `child` | `tree-view-visuals` |
| `label` | render-test assertion (non-visual) — set in `tree-view-visuals` |

---

## Agent section

None. `LeadingVisual` carries no `Action`.
