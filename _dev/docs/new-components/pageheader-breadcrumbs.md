# PageHeader.Breadcrumbs

- **Official documentation URL:** https://primer.style/components/page-header
- **Real prop surface resolved from:** `@primer/react` type declarations at
  `node_modules/@primer/react/dist/PageHeader/PageHeader.d.ts` (v38.28.0):
  `Breadcrumbs: React.FC<React.PropsWithChildren<ChildrenPropTypes>>`, where
  `ChildrenPropTypes = { className?, hidden?: boolean | ResponsiveValue<boolean> }`. Implementation
  `PageHeader.js`: `hidden` default `false` (visible on all viewports).
- **Component-level description (→ `catalog.json` `description`):** A slot for a breadcrumb trail
  showing the page's position in the navigation hierarchy.

> Part of the `PageHeader` compound family (6.36) — see `pageheader.md` for the family overview and
> shared conventions (`ChildList` slots, `responsive(z.boolean())` `hidden`, composed-centered
> coverage).

---

## Adapter section

### Prop-surface table

| prop | decision | synthetic? | A2UI type | description |
|---|---|---|---|---|
| `children` | carry (optional) | yes | `ChildList` | The breadcrumb trail showing the page's position in the navigation hierarchy. |
| `hidden` | carry | no | `responsive(z.boolean())` | Whether the slot is hidden, optionally per viewport width (`narrow`/`regular`/`wide`). Unset applies the library default: visible on all viewports. |

### Functions

None. Carries no `Action` and needs no local function.

### Dropped / deferred props

| prop | reason |
|---|---|
| `className` | Styling passthrough; no A2UI representation. |

---

## Client section

`children` is covered visually by the composed `pageheader` baseline (`pageheader.md`). This leaf
additionally carries the family's **`ChildList` dynamic-template** proof (breadcrumbs are the most
naturally data-driven repeated list — a bound array of links) so the template mechanism is exercised
once for the whole family. `hidden` by a render-test assertion (multi-viewport baselines deferred).

### Fixture table

| fixture | exercises (coverage axis) | component state / canned children | baselined? |
|---|---|---|---|
| `breadcrumbs-template` | content — `ChildList` dynamic template (bound array) | `children: {componentId: 'crumb', path: '/trail'}`; `crumb` = `Link` with `text:{path:'./label'}`, `href:{path:'./url'}`; data model `/trail = [{label:'Repos',url:'/repos'},{label:'octo/acme',url:'/repos/acme'},{label:'Issues',url:'/repos/acme/issues'}]` | yes |

### Prop-coverage map

| adapter prop | covered by |
|---|---|
| `children` | composed `pageheader` fixture (static array) + `breadcrumbs-template` (dynamic template) |
| `hidden` | render-test assertion (`data-hidden` attributes emitted; multi-viewport deferred) |

---

## Agent section

Omitted. Emits no `event`-shaped `Action` (no `Action` at all), per the family skip rule.
