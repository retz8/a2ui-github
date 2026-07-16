# PageHeader.ContextArea

- **Official documentation URL:** https://primer.style/components/page-header
- **Real prop surface resolved from:** `@primer/react` type declarations at
  `node_modules/@primer/react/dist/PageHeader/PageHeader.d.ts` (v38.28.0):
  `ContextArea: FCWithSlotMarker<React.PropsWithChildren<ChildrenPropTypes>>`, where
  `ChildrenPropTypes = { className?, hidden?: boolean | ResponsiveValue<boolean> }`. Implementation
  `PageHeader.js`: `hidden` default `hiddenOnRegularAndWide` (visible on narrow only).
- **Component-level description (→ `catalog.json` `description`):** A container for contextual
  navigation and actions shown above the title, visible on narrow viewports by default.

> Part of the `PageHeader` compound family (6.36) — see `pageheader.md` for the family overview and
> shared conventions (`ChildList` slots, `responsive(z.boolean())` `hidden`, composed-centered
> coverage).

---

## Adapter section

### Prop-surface table

| prop | decision | synthetic? | A2UI type | description |
|---|---|---|---|---|
| `children` | carry (optional) | yes | `ChildList` | The contextual navigation and actions shown above the title. |
| `hidden` | carry | no | `responsive(z.boolean())` | Whether the region is hidden, optionally per viewport width (`narrow`/`regular`/`wide`). Unset applies the library default: hidden on regular and wide, visible on narrow only. |

### Functions

None. Carries no `Action` and needs no local function.

### Dropped / deferred props

| prop | reason |
|---|---|
| `className` | Styling passthrough; no A2UI representation. |

---

## Client section

`children` is covered visually by the composed `pageheader` baseline (`pageheader.md`); `hidden` by a
render-test assertion (multi-viewport baselines deferred).

### Fixture table

| fixture | exercises (coverage axis) | component state / canned children | baselined? |
|---|---|---|---|
| *(none of its own)* | — | exercised inside the composed `pageheader` fixture | — |

### Prop-coverage map

| adapter prop | covered by |
|---|---|
| `children` | composed `pageheader` fixture (`pageheader.md`) |
| `hidden` | render-test assertion (`data-hidden` attributes emitted; multi-viewport deferred) |

---

## Agent section

Omitted. Emits no `event`-shaped `Action` (no `Action` at all), per the family skip rule.
