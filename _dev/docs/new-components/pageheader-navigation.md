# PageHeader.Navigation

- **Official documentation URL:** https://primer.style/components/page-header
- **Real prop surface resolved from:** `@primer/react` type declarations at
  `node_modules/@primer/react/dist/PageHeader/PageHeader.d.ts` (v38.28.0):
  `Navigation: React.FC<React.PropsWithChildren<NavigationProps>>` where
  `NavigationProps = { as?: 'nav'|'div', 'aria-label'?, 'aria-labelledby'? } & ChildrenPropTypes`
  and `ChildrenPropTypes = { className?, hidden?: boolean | ResponsiveValue<boolean> }`.
  Implementation `PageHeader.js`: `as` default `"div"`, `hidden` default `false`; when `as="nav"`
  Primer warns if neither `aria-label` nor `aria-labelledby` is set (the `nav` landmark needs an
  accessible name).
- **Component-level description (→ `catalog.json` `description`):** A container for tab-like
  navigation shown below the title.

> Part of the `PageHeader` compound family (6.36) — see `pageheader.md` for the family overview and
> shared conventions (`ChildList` slots, `responsive(z.boolean())` `hidden`, composed-centered
> coverage). `aria-label`/`aria-labelledby` are shipped as literal `DynamicString` props, per the
> family convention.

---

## Adapter section

### Prop-surface table

| prop | decision | synthetic? | A2UI type | description |
|---|---|---|---|---|
| `children` | carry (optional) | yes | `ChildList` | The navigation items shown below the title. |
| `as` | carry | no | `z.enum(['nav','div']) (default: "div")` | The HTML element used to render the region; `nav` marks it as a navigation landmark. |
| `aria-label` | carry | no | `DynamicString` | An accessible label for the navigation landmark, for assistive technologies. |
| `aria-labelledby` | carry | no | `DynamicString` | The id of an element that labels the navigation landmark for assistive technologies. |
| `hidden` | carry | no | `responsive(z.boolean())` | Whether the region is hidden, optionally per viewport width (`narrow`/`regular`/`wide`). Unset applies the library default: visible on all viewports. |

### Functions

None. Carries no `Action` and needs no local function.

### Dropped / deferred props

| prop | reason |
|---|---|
| `className` | Styling passthrough; no A2UI representation. |

---

## Client section

`children` is covered visually by the composed `pageheader` baseline (`pageheader.md`); `as`,
`aria-label`, `aria-labelledby`, and `hidden` are render-test assertions.

### Fixture table

| fixture | exercises (coverage axis) | component state / canned children | baselined? |
|---|---|---|---|
| *(none of its own)* | — | exercised inside the composed `pageheader` fixture (a row of `Link` items) | — |

### Prop-coverage map

| adapter prop | covered by |
|---|---|
| `children` | composed `pageheader` fixture (`pageheader.md`) |
| `as` | render-test assertion (rendered element `nav`/`div`; `div` default) |
| `aria-label` | render-test assertion (`aria-label` on the region) |
| `aria-labelledby` | render-test assertion (`aria-labelledby` on the region) |
| `hidden` | render-test assertion (`data-hidden` attributes emitted; multi-viewport deferred) |

---

## Agent section

Omitted. Emits no `event`-shaped `Action` (no `Action` at all), per the family skip rule.
