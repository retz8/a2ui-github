# SplitPageLayout.Content

- **Official documentation URL:** https://primer.style/components/split-page-layout/ (region props
  documented via `PageLayout`).
- **Real prop surface resolved from:** `@primer/react` installed types —
  `SplitPageLayoutContentProps = PageLayoutContentProps` (`dist/PageLayout/PageLayout.d.ts`). Preset
  defaults from the `SplitPageLayout.js` wrapper (code is authority): `width="large"`,
  `padding="normal"`. Renders inside a `SplitPageLayout` Root (reads `PageLayoutContext`).
- **Component-level description (→ `catalog.json` `description`):** The main content region of a
  split page layout.

Content has no `divider`; it adds `as` (the main-landmark element) and `width` (max content width).
Cross-region conventions per `split-page-layout-header.md`.

---

## Adapter section

### Prop-surface table

| prop | decision | synthetic? | A2UI type | description |
|---|---|---|---|---|
| `children` | carry (optional) | yes | `ChildList` | The main content rendered inside the content region. |
| `as` | carry | no | `z.enum(['main','div','section','article']) (default: "main")` | The HTML element used to render the content region; the choices are display-equivalent and differ only in semantic/landmark identity. |
| `width` | carry | no | `z.enum(['full','medium','large','xlarge']) (default: "large")` | The maximum width of the content region. |
| `padding` | carry | no | `z.enum(['none','condensed','normal']) (default: "normal")` | Inner padding of the content region. |
| `hidden` | carry | no | `responsive(z.boolean())` | Whether the content region is hidden. |
| `accessibility` | carry | no | `AccessibilityAttributes` | Accessibility label for the main landmark. |

`as` follows the Stack precedent (curated enum of display-equivalent landmark tags); `width` is
scalar config (not responsive in the installed type).

### Functions

None.

### Dropped / deferred props

| prop | reason |
|---|---|
| `aria-labelledby` | DOM id-reference; no A2UI representation. Labeling via `accessibility.label` (per Pagination). |
| `className`, `style` | Styling passthroughs; no A2UI representation. |

---

## Client section

Rendered inside a minimal `SplitPageLayout` Root (content region, for context and layout). Content
carries the phase's shared visual representatives — the single `padding` gallery and the single
dynamic-template `ChildList` fixture (the `ChildList` common is identical across regions).

### Fixture table

| fixture | exercises (coverage axis) | component state / canned children | baselined? |
|---|---|---|---|
| `spl-content-width` | visual enum — `width` | gallery, one surface per `[full, medium, large, xlarge]`; each = a `Text` block | yes (one PNG) |
| `spl-content-padding` | visual enum — `padding` (**padding representative** for all regions) | gallery, one surface per `[none, condensed, normal]`; bordered content | yes (one PNG) |
| `spl-content-children-template` | content — dynamic-template `ChildList` (**template representative** for all regions) | `children: {componentId:'tpl', path:'/items'}`, `tpl` = a `Text` binding `{path:'./label'}`; data model `/items = [{label:'Alpha'},{label:'Beta'}]` | yes |

### Prop-coverage map

| adapter prop | covered by |
|---|---|
| `children` | `spl-content-width`/`spl-content-padding` (static array) + `spl-content-children-template` (dynamic template) |
| `as` | render-test assertion (rendered element tag; non-visual — all render the same box) |
| `width` | `spl-content-width` |
| `padding` | `spl-content-padding` |
| `hidden` | render-test assertion (region omitted when `true`; responsive arm deferred) |
| `accessibility` | render-test assertion (non-visual; `label`→`aria-label`) |

---

## Agent section

Omitted. `SplitPageLayout.Content` emits no `Action`, so per the Orchestration skip rule there is no
agent surface to design.
