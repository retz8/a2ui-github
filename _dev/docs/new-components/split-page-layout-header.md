# SplitPageLayout.Header

- **Official documentation URL:** https://primer.style/components/split-page-layout/ (region props
  documented via `PageLayout`).
- **Real prop surface resolved from:** `@primer/react` installed types —
  `SplitPageLayoutHeaderProps = PageLayoutHeaderProps` (`dist/PageLayout/PageLayout.d.ts`). Preset
  defaults from the `SplitPageLayout.js` wrapper (code is authority): `padding="normal"`,
  `divider="line"`. Renders inside a `SplitPageLayout` Root (reads `PageLayoutContext`).
- **Component-level description (→ `catalog.json` `description`):** The banner region across the top
  of a split page layout.

Cross-region conventions (established here, reused by every region leaf): `children`→`ChildList`;
`padding`→plain scalar `z.enum` (fixed visual config); `divider`→responsive `z.enum` with the
narrow arm also allowing `'filled'` (carried via the Stack `responsive()` convention); `hidden`→
`responsive(z.boolean())`; `accessibility`→`AccessibilityAttributes` (`label`→`aria-label`);
standing drops `aria-labelledby` (DOM id-reference, no representation; labeling via
`accessibility.label`, per Pagination), `dividerWhenNarrow` (deprecated), `className`, `style`.

---

## Adapter section

### Prop-surface table

| prop | decision | synthetic? | A2UI type | description |
|---|---|---|---|---|
| `children` | carry (optional) | yes | `ChildList` | The content rendered inside the header region. |
| `padding` | carry | no | `z.enum(['none','condensed','normal']) (default: "normal")` | Inner padding of the header region. |
| `divider` | carry | no | responsive `z.enum(['none','line'])`, narrow arm also allowing `'filled'` (default: `"line"`) | A divider drawn along the edge separating the header from the content. |
| `hidden` | carry | no | `responsive(z.boolean())` | Whether the header region is hidden. |
| `accessibility` | carry | no | `AccessibilityAttributes` | Accessibility label for the header landmark. |

### Functions

None.

### Dropped / deferred props

| prop | reason |
|---|---|
| `aria-labelledby` | DOM id-reference; no A2UI representation. Labeling is provided via `accessibility.label` (per Pagination). |
| `dividerWhenNarrow` | Deprecated alias; superseded by the responsive `divider` value (`@deprecated` in code). |
| `className`, `style` | Styling passthroughs; no A2UI representation. |

---

## Client section

Rendered inside a minimal `SplitPageLayout` Root (header + content, for context and layout).

### Fixture table

| fixture | exercises (coverage axis) | component state / canned children | baselined? |
|---|---|---|---|
| `spl-header-divider` | visual enum — `divider` (**horizontal-divider representative** for Header/Footer) | Root with header + content; header gallery, one surface per `[none, line]`; header = a `Heading` "Repository settings" | yes (one PNG) |

### Prop-coverage map

| adapter prop | covered by |
|---|---|
| `children` | `spl-header-divider` + Root compositions (static `ChildList`) |
| `divider` | `spl-header-divider` (horizontal representative) |
| `padding` | render-test assertion (padding attribute forwarded; scale magnitudes proven on `spl-content-padding`) |
| `hidden` | render-test assertion (region omitted when `true`; responsive arm deferred) |
| `accessibility` | render-test assertion (non-visual; `label`→`aria-label`) |

---

## Agent section

Omitted. `SplitPageLayout.Header` emits no `Action`, so per the Orchestration skip rule there is no
agent surface to design.
