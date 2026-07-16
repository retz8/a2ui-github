# PageLayout.Footer

- **Official documentation URL:** https://primer.style/product/components/page-layout/
- **Real prop surface resolved from:** `@primer/react` installed type declarations at
  `node_modules/@primer/react/dist/PageLayout/PageLayout.d.ts` — `PageLayoutFooterProps` (same shape
  as `PageLayoutHeaderProps`). Rendered contentinfo landmark; identity-slotted into the footer region
  by the parent's `useSlots`.
- **Component-level description (→ `catalog.json` `description`):** The contentinfo region at the
  bottom of a page layout.

> A region leaf of the `PageLayout` compound family (see `page-layout.md`), shipped together in 6.34.
> Renders only inside a `PageLayout`; the root references it through its `footer` `ComponentId` slot
> and bridges it to Primer's slot scanner with `asSlot`. Shared local types (`spacing`,
> `dividerResponsive`) are defined in `page-layout.md`.

---

## Adapter section

### Prop-surface table

| prop | decision | synthetic? | A2UI type | description |
|---|---|---|---|---|
| `children` | carry (optional) | yes | `ChildList` | The content placed in the footer. |
| `padding` | carry | no | `spacing (default: "none")` | Padding inside the footer. |
| `divider` | carry | no | `dividerResponsive (default: "none")` | Divider shown between the footer and adjacent regions; supports a per-viewport value with a filled style on narrow viewports. |
| `hidden` | carry | no | `responsive(z.boolean()) (default: false)` | Whether the footer is hidden; supports a per-viewport value. |
| `accessibility` | carry | no | `AccessibilityAttributes` | Accessibility label for the contentinfo landmark. |

### Functions

None.

### Dropped / deferred props

| prop | reason |
|---|---|
| `dividerWhenNarrow` | Dropped: deprecated alias, superseded by the responsive `divider` value. |
| `className`, `style` | Dropped: styling passthroughs; no A2UI representation. |

---

## Client section

Fixtures compose a `PageLayout` with a `content` + `footer`.

### Fixture table

| fixture | exercises (coverage axis) | component state / canned values | baselined? |
|---|---|---|---|
| `pagelayout-footer-padding` | visual enum — `padding` | one surface per `['none','condensed','normal']`; footer w/ `Text`, filler content | yes (one PNG) |
| `pagelayout-footer-divider` | visual enum — `divider` | 2 surfaces `['none','line']` | yes (one PNG) |

Render-test assertions (non-visual / interaction):

- **`hidden`** — responsive `data-*` attribute emitted/forwarded; per-viewport effect via live review.
- **`accessibility`** — `accessibility.label` / `.description` surface as `aria-*` on the contentinfo
  landmark.
- **`children`** — static `ChildList` rendered inside the footer (covered by the root `pagelayout` base).

### Prop-coverage map

| adapter prop | covered by |
|---|---|
| `children` | `pagelayout` base (static) + render-test assertion |
| `padding` | `pagelayout-footer-padding` |
| `divider` | `pagelayout-footer-divider` |
| `hidden` | render-test assertion + live review (per-viewport) |
| `accessibility` | render-test assertion (non-visual) |

---

## Agent section

Omitted. `PageLayout.Footer` emits no `Action`, so per the Orchestration skip rule there is no agent
surface to design.
