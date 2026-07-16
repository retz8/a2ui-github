# ActionBar.Group

- **Official documentation URL:** https://primer.style/components/action-bar
- **Real prop surface resolved from:** `@primer/react` installed type declarations at
  `node_modules/@primer/react/dist/ActionBar/index.d.ts`:
  `ActionBar.Group: ForwardRefExoticComponent<{ children?: React.ReactNode } & RefAttributes>` —
  only `children`. Reconciled against `ActionBar.js` (`ActionBarGroup`, line ~363): wraps `children`
  in a `<div className=Group>`, registers itself as a `group` item so the whole group collapses into
  the overflow menu together, and provides an `isOverflowing` context to its descendants. No other
  props, no accessibility channel, no interaction.
- **Component-level description (→ `catalog.json` `description`):** Groups related toolbar buttons so
  they stay visually together and collapse into the overflow menu as a unit.

---

## Adapter section

### Prop-surface table

| prop | decision | synthetic? | A2UI type | description |
|---|---|---|---|---|
| `children` | carry (optional) | yes | `ChildList` | The related buttons grouped together. |

`children` is `carry (optional)` — faithful to the type's `children?`. Its slot is the protocol common
`CommonSchemas.ChildList`, rendered via the `buildChild` helper — the same container-slot convention as
`ActionBar` / `ButtonGroup` / `Stack`. The valid children are `ActionBar.IconButton` and
`ActionBar.Divider`.

### Functions

None. A pure presentational grouping container — no `Action`, no local function.

### Dropped / deferred props

None beyond the standard ref/HTML plumbing the container has no author-facing surface for.

---

## Client section

`children` are `ActionBar.IconButton` leaves. One static fixture proves the group's `ChildList`; the
dynamic-template form of the identical `ChildList` slot is already proven on the container
(`actionbar.md`'s `action-bar-children-template`), so it is not repeated here. Renders standalone (the
overflow registry no-ops without an `ActionBar` parent; `IntersectionObserver` polyfill build note).

### Fixture table

| fixture | exercises (coverage axis) | component state / canned children | baselined? |
|---|---|---|---|
| `action-bar-group` | content — static `ChildList` | `children: ['b1','b2','b3']` → three `ActionBar.IconButton`s (each `Icon` + `aria-label`) grouped together | yes |

### Prop-coverage map

| adapter prop | covered by |
|---|---|
| `children` | `action-bar-group` (static array); dynamic-template form proven on the container |
