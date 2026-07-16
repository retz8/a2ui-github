# PageLayout

- **Official documentation URL:** https://primer.style/product/components/page-layout/
- **Real prop surface resolved from:** `@primer/react` installed type declarations at
  `node_modules/@primer/react/dist/PageLayout/PageLayout.d.ts` — the root `PageLayoutProps` plus the
  five slot prop types `PageLayoutHeaderProps` / `PageLayoutContentProps` / `PageLayoutPaneProps` /
  `PageLayoutSidebarProps` / `PageLayoutFooterProps` — reconciled against the official doc's props
  tables (all six parts documented; `Sidebar` is a distinct full-height region, `Pane` sits only
  beside the content). Implementation authority for defaults and slotting: `PageLayout.js`
  (`useSlots(children, {header, footer, sidebar})`; `Content`/`Pane` fall through to `rest`; Pane
  `position` default `'end'`, line 520).
- **Component-level description (→ `catalog.json` `description`):** The top-level page structure that
  arranges a header, main content, a supplementary pane, a full-height sidebar, and a footer.

## Conventions established by this component

- **Compound family, six sibling leaves.** PageLayout ships as `PageLayout` + `PageLayout.Header` /
  `.Content` / `.Pane` / `.Sidebar` / `.Footer`, mirroring Primer's compound — each its own catalog
  leaf and decision doc (`page-layout-header.md`, `page-layout-content.md`, `page-layout-pane.md`,
  `page-layout-sidebar.md`, `page-layout-footer.md`), all shipped together in 6.34 (the Select /
  SegmentedControl compound-family precedent).
- **Named `ComponentId` slots for identity-slotted regions.** Primer's PageLayout auto-slots its
  regions by inspecting children for slot markers (`useSlots`). A2UI's `buildChild` returns an opaque
  `DeferredChild` that hides those markers, so a generic `ChildList` of region children cannot be
  slotted (unlike the order-based Stack / SegmentedControl). The root therefore exposes each region
  as a named `ComponentId` slot (`header` / `content` / `pane` / `sidebar` / `footer`) — the Details
  `summary`-slot idiom — so the render knows each region's identity.
- **Slot bridge via Primer's `asSlot`.** `useSlots` matches a child by a `__SLOT__` marker as well as
  by type identity. The render bridges the three identity-slotted regions (`header`, `footer`,
  `sidebar`) by wrapping each built child in a marker-copying wrapper built with Primer's public
  `asSlot(wrapper, PageLayout.Header)` so the scanner places it. `content` and `pane` need no bridge —
  they fall through to `useSlots`' `rest` and render in document order (Pane self-positions start/end
  via CSS + `PageLayoutContext`). Consumes Primer's public slot API; builds no new infrastructure.
- **Shared local types** (materialized once in the build; referenced by name from the region docs):
  - `spacing = z.enum(['none','condensed','normal'])` — PageLayout's own 3-value scale (distinct from
    Stack's 6-value spacing); used by root `padding`/`rowGap`/`columnGap` and every region `padding`.
  - `sizeWidth = z.enum(['full','medium','large','xlarge'])` — root `containerWidth` and Content
    `width`.
  - `dividerResponsive = z.union([z.enum(['none','line']), z.object({narrow: z.enum(['none','line','filled']).optional(), regular: z.enum(['none','line']).optional(), wide: z.enum(['none','line']).optional()})])`
    — the responsive divider with the asymmetric `filled`-only-on-narrow arm (Header / Pane / Footer).
    Sidebar's divider is the plain `z.enum(['none','line'])`. Reuses the responsive-union pattern from
    `stack.md`; `position` reuses the `responsive()` helper directly.
  - `paneWidth = z.union([z.enum(['small','medium','large']), z.object({min: z.string(), default: z.string(), max: z.string()})])`
    — Pane / Sidebar `width`: a named size or a custom min/default/max object.
- **Controlled resize as a two-way binding.** Pane / Sidebar `currentWidth` is a `DynamicNumber`: the
  live controlled width binds to a data-model path, and Primer's `onResizeEnd` is wired internally to
  write the new width back through the auto-generated setter (the Checkbox `checked` / Details `open`
  pattern). `onResizeEnd` is therefore not a separate prop.
- **Live-review verification for viewport / scroll / drag props.** Responsive arms (`hidden`, Sidebar
  `responsiveVariant: 'fullscreen'`), `sticky`, and the `currentWidth` resize write-back are shipped
  in full and verified by live UI review (multi-viewport / scroll / drag) plus render-test assertions
  where a DOM signal exists; they are not baselined with Playwright multi-viewport infra.

---

## Adapter section

### Prop-surface table

| prop | decision | synthetic? | A2UI type | description |
|---|---|---|---|---|
| `header` | carry | yes | `ComponentId` | The banner region across the top of the page. |
| `content` | carry | yes | `ComponentId` | The main content region. |
| `pane` | carry | yes | `ComponentId` | A supplementary region beside the content. |
| `sidebar` | carry | yes | `ComponentId` | A full-height region alongside the header, content, and footer. |
| `footer` | carry | yes | `ComponentId` | The contentinfo region across the bottom of the page. |
| `containerWidth` | carry | no | `sizeWidth (default: "xlarge")` | Maximum width of the page container. |
| `padding` | carry | no | `spacing (default: "normal")` | Spacing between the container's outer edges and the viewport. |
| `rowGap` | carry | no | `spacing (default: "normal")` | Vertical spacing between regions. |
| `columnGap` | carry | no | `spacing (default: "normal")` | Horizontal spacing between regions. |

All five region slots are `carry (optional)` — a layout may supply any subset; Primer warns on a
duplicate region, which the single-`ComponentId`-per-slot shape structurally prevents.

### Functions

None. PageLayout and its regions carry no `Action` and need no local function.

### Dropped / deferred props

| prop | reason |
|---|---|
| `_slotsConfig` | Dropped: private prop for SplitPageLayout slot-component customization; no A2UI representation. |
| `className`, `style` | Dropped: styling passthroughs; no A2UI representation. |

---

## Client section

Fixtures compose the region leaves inside a `PageLayout`. Filler content uses shipped leaves: a
`Heading` in the header, a `Stack` of `Text` in the content, a `Stack` of `Link` in the pane/sidebar,
a `Text` in the footer.

### Fixture table

| fixture | exercises (coverage axis) | component state / canned values | baselined? |
|---|---|---|---|
| `pagelayout` | base composition — `header` + `content` + `pane` + `footer` slots | `header`→`h` (`PageLayout.Header` w/ `Heading` "Repositories"); `content`→`c` (`PageLayout.Content` w/ `Stack` of 3 `Text`); `pane`→`p` (`PageLayout.Pane` w/ `Stack` of 3 `Link`); `footer`→`f` (`PageLayout.Footer` w/ `Text` "© 2026 Example") | yes |
| `pagelayout-sidebar` | `sidebar` + `content` composition | `sidebar`→`s` (`PageLayout.Sidebar` w/ `Stack` of 3 `Link`); `content`→`c` (`Stack` of `Text`) | yes |
| `pagelayout-containerwidth` | visual enum — `containerWidth` | one surface per `['full','medium','large','xlarge']`; each `header` + `content` | yes (one PNG) |
| `pagelayout-padding` | visual enum — `padding` | one surface per `['none','condensed','normal']`; bordered root; `header` + `content` | yes (one PNG) |
| `pagelayout-rowgap` | visual enum — `rowGap` | one surface per `['none','condensed','normal']`; `header` + `content` + `footer` (vertical gaps) | yes (one PNG) |
| `pagelayout-columngap` | visual enum — `columnGap` | one surface per `['none','condensed','normal']`; `content` + `pane` (horizontal gap) | yes (one PNG) |

### Prop-coverage map

| adapter prop | covered by |
|---|---|
| `header` | `pagelayout` (slot content) |
| `content` | `pagelayout`, `pagelayout-sidebar` (slot content) |
| `pane` | `pagelayout` (slot content) |
| `sidebar` | `pagelayout-sidebar` (slot content) |
| `footer` | `pagelayout` (slot content) |
| `containerWidth` | `pagelayout-containerwidth` |
| `padding` | `pagelayout-padding` |
| `rowGap` | `pagelayout-rowgap` |
| `columnGap` | `pagelayout-columngap` |

---

## Agent section

Omitted. PageLayout emits no `event`-shaped `Action` (no `Action` at all — the `currentWidth` resize
is a two-way write-back), so per the Orchestration skip rule there is no agent surface to design.
