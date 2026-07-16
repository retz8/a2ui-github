# PageHeader.Actions

- **Official documentation URL:** https://primer.style/components/page-header
- **Real prop surface resolved from:** `@primer/react` type declarations at
  `node_modules/@primer/react/dist/PageHeader/PageHeader.d.ts` (v38.28.0):
  `Actions: ({ children, className, hidden }: ActionsProps) => React.JSX.Element` where
  `ActionsProps = React.PropsWithChildren<ChildrenPropTypes>` and
  `ChildrenPropTypes = { className?, hidden?: boolean | ResponsiveValue<boolean> }`. Implementation
  `PageHeader.js`: `hidden` default `false` (visible on all viewports).
- **Component-level description (→ `catalog.json` `description`):** A container for the primary
  action controls aligned to the end of the title area.

> Part of the `PageHeader` compound family (6.36) — see `pageheader.md` for the family overview and
> shared conventions (`ChildList` slots, `responsive(z.boolean())` `hidden`, composed-centered
> coverage).

---

## Adapter section

### Prop-surface table

| prop | decision | synthetic? | A2UI type | description |
|---|---|---|---|---|
| `children` | carry (optional) | yes | `ChildList` | The primary action controls aligned to the end of the title area. |
| `hidden` | carry | no | `responsive(z.boolean())` | Whether the region is hidden, optionally per viewport width (`narrow`/`regular`/`wide`). Unset applies the library default: visible on all viewports. |

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
