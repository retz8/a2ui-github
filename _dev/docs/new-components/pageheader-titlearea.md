# PageHeader.TitleArea

- **Official documentation URL:** https://primer.style/components/page-header
- **Real prop surface resolved from:** `@primer/react` type declarations at
  `node_modules/@primer/react/dist/PageHeader/PageHeader.d.ts` (v38.28.0):
  `TitleArea: PolymorphicForwardRefComponent<"div", TitleAreaProps>` where
  `TitleAreaProps = { variant?: 'subtitle' | 'medium' | 'large' | ResponsiveValue<...> } &
  ChildrenPropTypes` and `ChildrenPropTypes = { className?, hidden?: boolean |
  ResponsiveValue<boolean> }`. Implementation `PageHeader.js`: `variant` default `"medium"`,
  `hidden` default `false` (visible on all viewports).
- **Component-level description (→ `catalog.json` `description`):** The container for the page title
  and the visuals and actions flanking it, with a selectable title size.

> Part of the `PageHeader` compound family (6.36) — see `pageheader.md` for the family overview and
> shared conventions (`ChildList` slots, `responsive(...)` helper, composed-centered coverage).

---

## Adapter section

### Prop-surface table

| prop | decision | synthetic? | A2UI type | description |
|---|---|---|---|---|
| `children` | carry (optional) | yes | `ChildList` | The title and the visuals and actions flanking it. |
| `variant` | carry | no | `responsive(z.enum(['subtitle','medium','large'])) (default: "medium")` | The title's size — `subtitle`, `medium`, or `large` — optionally per viewport width. |
| `hidden` | carry | no | `responsive(z.boolean())` | Whether the region is hidden, optionally per viewport width (`narrow`/`regular`/`wide`). Unset applies the library default: visible on all viewports. |

### Functions

None. Carries no `Action` and needs no local function.

### Dropped / deferred props

| prop | reason |
|---|---|
| `className` | Styling passthrough; no A2UI representation. |

---

## Client section

`children` is covered by the composed `pageheader` baseline (`pageheader.md`) and by
`titlearea-variant`; `variant` by the gallery; `hidden` by a render-test assertion.

### Fixture table

| fixture | exercises (coverage axis) | component state / canned children | baselined? |
|---|---|---|---|
| `titlearea-variant` | visual enum — `variant` | gallery: one surface per `['subtitle','medium','large']`; each = a `Title` child (`text` = the variant name) | yes (one PNG) |

### Prop-coverage map

| adapter prop | covered by |
|---|---|
| `children` | composed `pageheader` fixture + `titlearea-variant` (a `Title` child per surface) |
| `variant` | `titlearea-variant` (+ the responsive arm via render-test assertion: responsive `data-*` attributes emitted; multi-viewport deferred) |
| `hidden` | render-test assertion (`data-hidden` attributes emitted; multi-viewport deferred) |

---

## Agent section

Omitted. Emits no `event`-shaped `Action` (no `Action` at all), per the family skip rule.
