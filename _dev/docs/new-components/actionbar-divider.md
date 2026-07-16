# ActionBar.Divider

- **Official documentation URL:** https://primer.style/components/action-bar
- **Real prop surface resolved from:** `@primer/react` installed type declarations at
  `node_modules/@primer/react/dist/ActionBar/ActionBar.d.ts`: `ActionBar.Divider: () => JSX.Element`
  (exported as `VerticalDivider`) — **no props**. Reconciled against `ActionBar.js`
  (`VerticalDivider`, line ~557): renders a single `aria-hidden` separator `<div>` and registers
  itself as a `divider` item so it is preserved in the overflow menu. No content, no accessibility
  channel (it is `aria-hidden`), no interaction.
- **Component-level description (→ `catalog.json` `description`):** A vertical separator that splits
  the toolbar's buttons into visually distinct groups; it is preserved when buttons collapse into the
  overflow menu.

---

## Adapter section

### Prop-surface table

Empty. `ActionBar.Divider` takes no props — its schema is `z.object({})`.

| prop | decision | synthetic? | A2UI type | description |
|---|---|---|---|---|
| — | — | — | — | — |

### Functions

None.

### Dropped / deferred props

None — the component exposes no props.

---

## Client section

`ActionBar.Divider` is a thin `aria-hidden` vertical separator with no intrinsic height — it is not
meaningfully visible on its own. It gets **no standalone fixture**; it is exercised as a child inside
the container's `action-bar` fixture (which places a `Divider` between two button groups), plus a
render-test assertion that it renders a separator element.

### Fixture table

None (zero-prop, not independently visible).

### Prop-coverage map

| adapter prop | covered by |
|---|---|
| — (no props) | rendered inside `actionbar.md`'s `action-bar` fixture; a render-test assertion confirms the separator element |
