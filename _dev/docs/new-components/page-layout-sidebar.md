# PageLayout.Sidebar

- **Official documentation URL:** https://primer.style/product/components/page-layout/
- **Real prop surface resolved from:** `@primer/react` installed type declarations at
  `node_modules/@primer/react/dist/PageLayout/PageLayout.d.ts` — `PageLayoutSidebarProps`
  (`PageLayoutSidebarBaseProps` intersected with the controlled/uncontrolled resize union). A
  full-height region alongside the header, content, and footer; identity-slotted by the parent's
  `useSlots`. Distinct from `Pane`: its `position` and `divider` are non-responsive, and it adds a
  `responsiveVariant` for narrow viewports.
- **Component-level description (→ `catalog.json` `description`):** A full-height region alongside the
  header, content, and footer.

> A region leaf of the `PageLayout` compound family (see `page-layout.md`), shipped together in 6.34.
> Renders only inside a `PageLayout`; the root references it through its `sidebar` `ComponentId` slot
> and bridges it to Primer's slot scanner with `asSlot`. Shared local types (`spacing`, `paneWidth`)
> and the controlled-resize two-way-binding convention are defined in `page-layout.md`.

---

## Adapter section

### Prop-surface table

| prop | decision | synthetic? | A2UI type | description |
|---|---|---|---|---|
| `children` | carry (optional) | yes | `ChildList` | The content placed in the sidebar. |
| `position` | carry | no | `z.enum(['start','end']) (default: "start")` | Which side of the page the sidebar appears on. |
| `width` | carry | no | `paneWidth (default: "medium")` | Sidebar width; a named size or a custom min/default/max object. |
| `minWidth` | carry | no | `z.number() (default: 256)` | Minimum sidebar width when resizable, in pixels. |
| `padding` | carry | no | `spacing (default: "none")` | Padding inside the sidebar. |
| `divider` | carry | no | `z.enum(['none','line']) (default: "none")` | Divider between the sidebar and the layout. |
| `sticky` | carry | no | `z.boolean() (default: false)` | Whether the sidebar sticks to the viewport while scrolling. |
| `responsiveVariant` | carry | no | `z.enum(['default','fullscreen']) (default: "default")` | Behavior on narrow viewports; `fullscreen` expands to cover the viewport like an overlay. |
| `hidden` | carry | no | `responsive(z.boolean()) (default: false)` | Whether the sidebar is hidden; supports a per-viewport value. |
| `resizable` | carry | no | `z.boolean() (default: false)` | Whether the user can resize the sidebar. |
| `currentWidth` | carry (optional) | no | `DynamicNumber` | The sidebar's controlled width in pixels. Two-way bound: a resize drag writes the new width back to the bound path. |
| `widthStorageKey` | carry | no | `z.string()` | Key used to persist the sidebar width in the browser when the width is not bound; when omitted, persistence is disabled. |
| `accessibility` | carry | no | `AccessibilityAttributes` | Accessibility label for the sidebar region. |

`widthStorageKey` has no default — omitting it disables localStorage persistence (Primer's behavior).
`currentWidth` follows the same controlled/uncontrolled rule as `PageLayout.Pane`.

### Functions

None.

### Dropped / deferred props

| prop | reason |
|---|---|
| `onResizeEnd` | Represented by the two-way binding on `currentWidth` (the resize write-back), as Checkbox folds `onChange` into `checked`. |
| `id`, `className`, `style` | Dropped: no A2UI representation. |

---

## Client section

Fixtures compose a `PageLayout` with `sidebar` + `content`.

### Fixture table

| fixture | exercises (coverage axis) | component state / canned values | baselined? |
|---|---|---|---|
| `pagelayout-sidebar-position` | visual enum — `position` | 2 surfaces `['start','end']`; sidebar (`Stack` of `Link`) + content | yes (one PNG) |
| `pagelayout-sidebar-width` | visual enum — `width` | one surface per `['small','medium','large']`; sidebar + content | yes (one PNG) |
| `pagelayout-sidebar-width-custom` | width custom object | `width: {min:'200px', default:'280px', max:'360px'}` | yes |
| `pagelayout-sidebar-divider` | visual enum — `divider` | 2 surfaces `['none','line']` | yes (one PNG) |
| `pagelayout-sidebar-resizable` | visually-distinct state — `resizable` | `resizable: true` (drag handle) | yes |
| `pagelayout-sidebar-padding` | visual enum — `padding` | one surface per `['none','condensed','normal']`; bordered sidebar | yes (one PNG) |

Render-test assertions + live review:

- **`minWidth`, `widthStorageKey`** — forwarded to Primer (render-test assertion).
- **`hidden`** — responsive `data-*` emitted/forwarded; per-viewport effect via live review.
- **`currentWidth`** — bind to `/sidebarWidth`; a resize drag writes the new width back (render-test
  assertion on the write-back) and is confirmed by live drag review.
- **`sticky`** — the sidebar applies `position: sticky`; scroll behavior confirmed by live review.
- **`responsiveVariant: 'fullscreen'`** — narrow-viewport overlay behavior confirmed by live review.
- **`accessibility`** — `accessibility.label` / `.description` surface as `aria-*` on the sidebar region.

### Prop-coverage map

| adapter prop | covered by |
|---|---|
| `children` | `pagelayout-sidebar` base + sidebar fixtures (the sidebar content) |
| `position` | `pagelayout-sidebar-position` |
| `width` | `pagelayout-sidebar-width` + `pagelayout-sidebar-width-custom` (custom object) |
| `minWidth` | render-test assertion (non-visual) |
| `padding` | `pagelayout-sidebar-padding` |
| `divider` | `pagelayout-sidebar-divider` |
| `sticky` | render-test assertion + live review (scroll) |
| `responsiveVariant` | render-test assertion + live review (narrow viewport) |
| `hidden` | render-test assertion + live review (per-viewport) |
| `resizable` | `pagelayout-sidebar-resizable` |
| `currentWidth` | render-test assertion (two-way write-back) + live drag review |
| `widthStorageKey` | render-test assertion (non-visual) |
| `accessibility` | render-test assertion (non-visual) |

---

## Agent section

Omitted. `PageLayout.Sidebar` emits no `event`-shaped `Action` (the `currentWidth` resize is a
two-way write-back), so per the Orchestration skip rule there is no agent surface to design.
