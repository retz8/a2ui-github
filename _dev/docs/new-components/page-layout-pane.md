# PageLayout.Pane

- **Official documentation URL:** https://primer.style/product/components/page-layout/
- **Real prop surface resolved from:** `@primer/react` installed type declarations at
  `node_modules/@primer/react/dist/PageLayout/PageLayout.d.ts` — `PageLayoutPaneProps`
  (`PageLayoutPaneBaseProps` intersected with the controlled/uncontrolled resize union
  `{onResizeEnd, currentWidth}` XOR `{onResizeEnd?: never, currentWidth?: never}`). Sits beside the
  content; falls through the parent's `useSlots` to `rest` and self-positions start/end via CSS +
  `PageLayoutContext`. Implementation authority: `PageLayout.js` — `position` default `'end'`
  (line 520); when `resizable`, Primer forces a `'line'` divider and renders a `DragHandle`.
- **Component-level description (→ `catalog.json` `description`):** A supplementary region displayed
  beside the content.

> A region leaf of the `PageLayout` compound family (see `page-layout.md`), shipped together in 6.34.
> Renders only inside a `PageLayout`; the root references it through its `pane` `ComponentId` slot.
> Shared local types (`spacing`, `dividerResponsive`, `paneWidth`) and the controlled-resize
> two-way-binding convention are defined in `page-layout.md`.

---

## Adapter section

### Prop-surface table

| prop | decision | synthetic? | A2UI type | description |
|---|---|---|---|---|
| `children` | carry (optional) | yes | `ChildList` | The content placed in the pane. |
| `position` | carry | no | `responsive(z.enum(['start','end'])) (default: "end")` | Which side of the content the pane appears on; supports a per-viewport value. |
| `width` | carry | no | `paneWidth (default: "medium")` | Pane width; a named size or a custom min/default/max object. |
| `minWidth` | carry | no | `z.number() (default: 256)` | Minimum pane width in pixels. |
| `padding` | carry | no | `spacing (default: "none")` | Padding inside the pane. |
| `divider` | carry | no | `dividerResponsive (default: "none")` | Divider between the pane and content; supports a per-viewport value with a filled style on narrow viewports. |
| `sticky` | carry | no | `z.boolean() (default: false)` | Whether the pane sticks to the top of the viewport while scrolling. |
| `offsetHeader` | carry | no | `z.union([z.number(), z.string()]) (default: 0)` | Top offset for a sticky pane, to clear a sticky header (a pixel number or a CSS length). |
| `hidden` | carry | no | `responsive(z.boolean()) (default: false)` | Whether the pane is hidden; supports a per-viewport value. |
| `resizable` | carry | no | `z.boolean() (default: false)` | Whether the user can resize the pane. |
| `currentWidth` | carry (optional) | no | `DynamicNumber` | The pane's controlled width in pixels. Two-way bound: a resize drag writes the new width back to the bound path. |
| `widthStorageKey` | carry | no | `z.string() (default: "paneWidth")` | Key used to persist the pane width in the browser when the width is not bound. |
| `accessibility` | carry | no | `AccessibilityAttributes` | Accessibility label for the pane region. |

`currentWidth` is `carry (optional)`: when bound, the render passes `currentWidth` together with the
`onResizeEnd` write-back (Primer's controlled mode); when absent, the pane is uncontrolled and
`widthStorageKey` names its localStorage persistence slot.

### Functions

None.

### Dropped / deferred props

| prop | reason |
|---|---|
| `onResizeEnd` | Represented by the two-way binding on `currentWidth` (the resize write-back), as Checkbox folds `onChange` into `checked`. |
| `positionWhenNarrow` | Dropped: deprecated alias, superseded by the responsive `position` value. |
| `id`, `className`, `style` | Dropped: no A2UI representation. |

---

## Client section

Fixtures compose a `PageLayout` with `content` + `pane`.

### Fixture table

| fixture | exercises (coverage axis) | component state / canned values | baselined? |
|---|---|---|---|
| `pagelayout-pane-position` | visual enum — `position` | 2 surfaces `['start','end']`; content + pane (`Stack` of `Link`) | yes (one PNG) |
| `pagelayout-pane-width` | visual enum — `width` | one surface per `['small','medium','large']`; content + pane | yes (one PNG) |
| `pagelayout-pane-width-custom` | width custom object | `width: {min:'200px', default:'300px', max:'400px'}` | yes |
| `pagelayout-pane-divider` | visual enum — `divider` | 2 surfaces `['none','line']` | yes (one PNG) |
| `pagelayout-pane-resizable` | visually-distinct state — `resizable` | `resizable: true` (drag handle + forced `'line'` divider) | yes |
| `pagelayout-pane-padding` | visual enum — `padding` | one surface per `['none','condensed','normal']`; bordered pane | yes (one PNG) |

Render-test assertions + live review:

- **`minWidth`, `widthStorageKey`** — forwarded to Primer (render-test assertion).
- **`hidden`** — responsive `data-*` emitted/forwarded; per-viewport effect via live review.
- **`currentWidth`** — bind `currentWidth` to `/paneWidth`; a resize drag writes the new width back to
  `/paneWidth` (render-test assertion on the write-back, the Details `open` pattern) and is confirmed
  by live drag review.
- **`sticky` + `offsetHeader`** — the pane applies `position: sticky` with the offset; scroll behavior
  confirmed by live review.
- **`accessibility`** — `accessibility.label` / `.description` surface as `aria-*` on the pane region.

### Prop-coverage map

| adapter prop | covered by |
|---|---|
| `children` | `pagelayout` base + pane fixtures (the pane content) |
| `position` | `pagelayout-pane-position` |
| `width` | `pagelayout-pane-width` + `pagelayout-pane-width-custom` (custom object) |
| `minWidth` | render-test assertion (non-visual) |
| `padding` | `pagelayout-pane-padding` |
| `divider` | `pagelayout-pane-divider` |
| `sticky` | render-test assertion + live review (scroll) |
| `offsetHeader` | render-test assertion + live review (scroll) |
| `hidden` | render-test assertion + live review (per-viewport) |
| `resizable` | `pagelayout-pane-resizable` |
| `currentWidth` | render-test assertion (two-way write-back) + live drag review |
| `widthStorageKey` | render-test assertion (non-visual) |
| `accessibility` | render-test assertion (non-visual) |

---

## Agent section

Omitted. `PageLayout.Pane` emits no `event`-shaped `Action` (the `currentWidth` resize is a two-way
write-back), so per the Orchestration skip rule there is no agent surface to design.
