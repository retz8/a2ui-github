# SplitPageLayout.Footer

- **Official documentation URL:** https://primer.style/components/split-page-layout/ (region props
  documented via `PageLayout`).
- **Real prop surface resolved from:** `@primer/react` installed types —
  `SplitPageLayoutFooterProps = PageLayoutFooterProps` (`dist/PageLayout/PageLayout.d.ts`). Preset
  defaults from the `SplitPageLayout.js` wrapper (code is authority): `padding="normal"`,
  `divider="line"`. Renders inside a `SplitPageLayout` Root (reads `PageLayoutContext`).
- **Component-level description (→ `catalog.json` `description`):** The footer region across the
  bottom of a split page layout.

Identical prop shape to `SplitPageLayout.Header`. Cross-region conventions per
`split-page-layout-header.md`.

---

## Adapter section

### Prop-surface table

| prop | decision | synthetic? | A2UI type | description |
|---|---|---|---|---|
| `children` | carry (optional) | yes | `ChildList` | The content rendered inside the footer region. |
| `padding` | carry | no | `z.enum(['none','condensed','normal']) (default: "normal")` | Inner padding of the footer region. |
| `divider` | carry | no | responsive `z.enum(['none','line'])`, narrow arm also allowing `'filled'` (default: `"line"`) | A divider drawn along the edge separating the footer from the content. |
| `hidden` | carry | no | `responsive(z.boolean())` | Whether the footer region is hidden. |
| `accessibility` | carry | no | `AccessibilityAttributes` | Accessibility label for the footer landmark. |

### Functions

None.

### Dropped / deferred props

| prop | reason |
|---|---|
| `aria-labelledby` | DOM id-reference; no A2UI representation. Labeling via `accessibility.label` (per Pagination). |
| `dividerWhenNarrow` | Deprecated alias; superseded by the responsive `divider` value (`@deprecated` in code). |
| `className`, `style` | Styling passthroughs; no A2UI representation. |

---

## Client section

No own baselined fixtures (deduplicated set): the footer is shown in the Root compositions
(`split-page-layout`, `split-page-layout-sidebar`), and its `divider`/`padding` visual effects are
proven on the representatives (horizontal divider on `spl-header-divider`; padding on
`spl-content-padding`). Rendered inside the `SplitPageLayout` Root.

### Prop-coverage map

| adapter prop | covered by |
|---|---|
| `children` | Root compositions (static `ChildList`) |
| `divider` | render-test assertion (horizontal-divider visual proven on `spl-header-divider`) |
| `padding` | render-test assertion (padding attribute forwarded; scale proven on `spl-content-padding`) |
| `hidden` | render-test assertion (region omitted when `true`; responsive arm deferred) |
| `accessibility` | render-test assertion (non-visual; `label`→`aria-label`) |

---

## Agent section

Omitted. `SplitPageLayout.Footer` emits no `Action`, so per the Orchestration skip rule there is no
agent surface to design.
