# TreeView.SubTree

- **Part of the `TreeView` compound family** (6.45) — see `tree-view.md` for the family note,
  shared conventions, and the component-level frame.
- **Official documentation URL:** https://primer.style/components/tree-view
- **Real prop surface resolved from:** `@primer/react` type declarations at
  `node_modules/@primer/react/dist/TreeView/TreeView.d.ts` (`TreeViewSubTreeProps`,
  `SubTreeState = 'initial' | 'loading' | 'done' | 'error'`). No prop defaults in the
  implementation; `count` is the skeleton-row count shown while `state` is `loading`.
- **Component-level description (→ `catalog.json` `description`):** The nested group of items
  revealed when a tree item is expanded, with loading and error states for asynchronously-loaded
  contents.

---

## Adapter section

### Prop-surface table

| prop | decision | synthetic? | A2UI type | description |
|---|---|---|---|---|
| `children` | carry (optional) | yes | `ChildList` | The nested tree items revealed when the parent item is expanded. |
| `state` | carry (optional) | no | `z.enum(['initial','loading','done','error'])` | The load state of the subtree's contents; drives the loading-skeleton and error affordances. |
| `count` | carry (optional) | no | `z.number()` | The number of skeleton placeholder rows shown while loading. |
| `accessibility` | carry (optional) | no | `AccessibilityAttributes` | Accessible label for the nested group, for assistive technologies. |

### Functions

None.

### Dropped/deferred props

None beyond the mapping above (`aria-label` → `accessibility`).

---

## Client section

### Fixture table

| fixture | exercises | component state / canned values | baselined? |
|---|---|---|---|
| `tree-view-subtree-states` | `state` gallery + `count` (coupled with `loading`) | one surface per `done` (children visible) · `loading` (`count: 3` skeleton) · `error` (error affordance) | yes (one PNG) |

The `initial` state (≈ collapsed/empty) is omitted from the gallery as visually redundant with a
collapsed item. The subtree's baseline `done` children are also exercised by the root's
`tree-view-nested` fixture.

### Prop-coverage map

| adapter prop | covered by |
|---|---|
| `children` | `tree-view-nested` (done children) + `tree-view-subtree-states` |
| `state` | `tree-view-subtree-states` |
| `count` | `tree-view-subtree-states` (`loading` surface) |
| `accessibility` | render-test assertion (non-visual) |

---

## Agent section

None. `SubTree` carries no `Action`, so it emits no event and has no agent section. (Its `error`
state surfaces the `ErrorDialog` leaf, whose `retryAction` carries the agent round-trip — see
`tree-view-errordialog.md`.)
