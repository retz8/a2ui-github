# SplitPageLayout.Sidebar

- **Official documentation URL:** https://primer.style/components/split-page-layout/ (region props
  documented via `PageLayout`).
- **Real prop surface resolved from:** `@primer/react` installed types —
  `SplitPageLayoutSidebarProps = PageLayoutSidebarProps = PageLayoutSidebarBaseProps &
  ({onResizeEnd, currentWidth} | {onResizeEnd?: never, currentWidth?: never})`
  (`dist/PageLayout/PageLayout.d.ts`). A cleaner, newer type than Pane: `position` and `divider` are
  **scalar** (not responsive; no `'filled'`), there is no `offsetHeader` and no deprecated aliases,
  and it adds `responsiveVariant`. Preset defaults from the `SplitPageLayout.js` wrapper (code is
  authority): `position="start"`, `padding="normal"`, `divider="line"`; type defaults `minWidth=256`,
  `sticky=false`, `width="medium"`. Renders inside a `SplitPageLayout` Root (reads
  `PageLayoutContext`); warns without `aria-label`/`aria-labelledby` when it overflows.
- **Component-level description (→ `catalog.json` `description`):** A full-height side region running
  alongside the header, content, and footer of a split page layout, optionally resizable by the
  user.

Cross-region conventions per `split-page-layout-header.md`; the resize cluster
(`currentWidth`/`onResizeEnd`/`widthStorageKey`) per `split-page-layout-pane.md`.

---

## Adapter section

### Prop-surface table

| prop | decision | synthetic? | A2UI type | description |
|---|---|---|---|---|
| `children` | carry (optional) | yes | `ChildList` | The content rendered inside the sidebar. |
| `position` | carry | no | `z.enum(['start','end']) (default: "start")` | Which side of the layout the sidebar sits on. |
| `width` | carry | no | `z.union([z.enum(['small','medium','large']), z.object({min: z.string(), default: z.string(), max: z.string()})]) (default: "medium")` | The sidebar width — a named size, or explicit min/default/max px constraints. |
| `minWidth` | carry | no | `z.number() (default: 256)` | Minimum sidebar width in pixels when resizable. |
| `resizable` | carry | no | `z.boolean() (default: false)` | Whether the user can drag to resize the sidebar. |
| `currentWidth` | carry | no | `DynamicNumber` | The controlled live width of the sidebar in pixels. Two-way bound: a resize writes the new width back to the bound path. |
| `padding` | carry | no | `z.enum(['none','condensed','normal']) (default: "normal")` | Inner padding of the sidebar. |
| `divider` | carry | no | `z.enum(['none','line']) (default: "line")` | A divider drawn between the sidebar and the content. |
| `sticky` | carry | no | `z.boolean() (default: false)` | Whether the sidebar sticks to the viewport while the content scrolls. |
| `responsiveVariant` | carry | no | `z.enum(['default','fullscreen']) (default: "default")` | Behavior at narrow viewports — retain the inline layout, or expand to a full-screen overlay. |
| `hidden` | carry | no | `responsive(z.boolean())` | Whether the sidebar is hidden. |
| `accessibility` | carry | no | `AccessibilityAttributes` | Accessibility label for the sidebar region. |

`position` and `divider` are scalar enums here (the installed Sidebar type is not responsive for
these — unlike Pane).

### Functions

None.

### Dropped / deferred props

| prop | reason |
|---|---|
| `onResizeEnd` | Represented by the two-way binding on `currentWidth` (the resize write-back). |
| `widthStorageKey` | localStorage persistence key; client-runtime detail, redundant with the bound `currentWidth` path. |
| `id` | DOM element id; no A2UI representation. |
| `aria-labelledby`, `className`, `style` | No A2UI representation. |

---

## Client section

No own baselined fixtures (deduplicated set): the sidebar's distinctive full-height span is shown by
the Root `split-page-layout-sidebar` composition, and its shared props are proven on the Pane
representatives (panel width, vertical divider, position, resizable). Rendered inside the
`SplitPageLayout` Root; `accessibility.label` set to avoid Primer's overflow warning.

### Prop-coverage map

| adapter prop | covered by |
|---|---|
| `children` | Root `split-page-layout-sidebar` composition (static `ChildList`) |
| `position` | render-test assertion (visual proven on `spl-pane-position`) |
| `width` | render-test assertion (visual proven on `spl-pane-width`) |
| `minWidth` | render-test assertion (resize lower bound; visual only during drag) |
| `resizable` | render-test assertion (drag handle proven on `spl-pane-resizable`) |
| `currentWidth` | render-test assertion (two-way resize write-back to the bound path) |
| `padding` | render-test assertion (padding attribute forwarded; scale proven on `spl-content-padding`) |
| `divider` | render-test assertion (vertical-divider visual proven on `spl-pane-divider`) |
| `sticky` | render-test assertion (`position: sticky` applied; visual effect is scroll-only) |
| `responsiveVariant` | render-test assertion (`fullscreen` is a narrow-viewport effect; single-viewport visual demo deferred to `deferred-catalog-work.md`) |
| `hidden` | render-test assertion (region omitted when `true`; responsive arm deferred) |
| `accessibility` | render-test assertion (non-visual; `label`→`aria-label`) |

---

## Agent section

Omitted. `SplitPageLayout.Sidebar` emits no `Action` (resize folds into the `currentWidth` two-way
binding), so per the Orchestration skip rule there is no agent surface to design.
