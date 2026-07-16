# PageLayout.Header

- **Official documentation URL:** https://primer.style/product/components/page-layout/
- **Real prop surface resolved from:** `@primer/react` installed type declarations at
  `node_modules/@primer/react/dist/PageLayout/PageLayout.d.ts` — `PageLayoutHeaderProps`. Rendered
  banner landmark; identity-slotted into the header region by the parent's `useSlots`.
- **Component-level description (→ `catalog.json` `description`):** The banner region at the top of a
  page layout.

> A region leaf of the `PageLayout` compound family (see `page-layout.md`), shipped together in 6.34.
> Renders only inside a `PageLayout`; the root references it through its `header` `ComponentId` slot
> and bridges it to Primer's slot scanner with `asSlot`. Shared local types (`spacing`,
> `dividerResponsive`) are defined in `page-layout.md`.

---

## Adapter section

### Prop-surface table

| prop | decision | synthetic? | A2UI type | description |
|---|---|---|---|---|
| `children` | carry (optional) | yes | `ChildList` | The content placed in the header. |
| `padding` | carry | no | `spacing (default: "none")` | Padding inside the header. |
| `divider` | carry | no | `dividerResponsive (default: "none")` | Divider shown between the header and adjacent regions; supports a per-viewport value with a filled style on narrow viewports. |
| `hidden` | carry | no | `responsive(z.boolean()) (default: false)` | Whether the header is hidden; supports a per-viewport value. |
| `accessibility` | carry | no | `AccessibilityAttributes` | Accessibility label for the banner landmark. |

### Functions

None.

### Dropped / deferred props

| prop | reason |
|---|---|
| `dividerWhenNarrow` | Dropped: deprecated alias, superseded by the responsive `divider` value. |
| `className`, `style` | Dropped: styling passthroughs; no A2UI representation. |

---

## Client section

Fixtures compose a `PageLayout` with a `header` + `content`.

### Fixture table

| fixture | exercises (coverage axis) | component state / canned values | baselined? |
|---|---|---|---|
| `pagelayout-header-padding` | visual enum — `padding` | one surface per `['none','condensed','normal']`; header w/ `Heading`, filler content | yes (one PNG) |
| `pagelayout-header-divider` | visual enum — `divider` | 2 surfaces `['none','line']` | yes (one PNG) |

Render-test assertions (non-visual / interaction):

- **`hidden`** — the responsive `data-*` attribute is emitted and forwarded; the per-viewport effect
  is confirmed by live UI review.
- **`accessibility`** — `accessibility.label` / `.description` surface as `aria-*` on the banner
  landmark.
- **`children`** — static `ChildList` rendered inside the header (covered by the root `pagelayout`
  base); the dynamic-template path is covered once by `pagelayout-content-template`.

### Prop-coverage map

| adapter prop | covered by |
|---|---|
| `children` | `pagelayout` base (static) + render-test assertion |
| `padding` | `pagelayout-header-padding` |
| `divider` | `pagelayout-header-divider` |
| `hidden` | render-test assertion + live review (per-viewport) |
| `accessibility` | render-test assertion (non-visual) |

---

## Agent section

Omitted. `PageLayout.Header` emits no `Action`, so per the Orchestration skip rule there is no agent
surface to design.
