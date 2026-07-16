# SplitPageLayout.Pane

- **Official documentation URL:** https://primer.style/components/split-page-layout/ (region props
  documented via `PageLayout`).
- **Real prop surface resolved from:** `@primer/react` installed types —
  `SplitPageLayoutPaneProps = PageLayoutPaneProps = PageLayoutPaneBaseProps & ({onResizeEnd,
  currentWidth} | {onResizeEnd?: never, currentWidth?: never})` (`dist/PageLayout/PageLayout.d.ts`).
  Width types (`dist/PageLayout/usePaneWidth.d.ts`): `PaneWidthValue = 'small'|'medium'|'large' |
  {min,default,max: `${number}px`}`. Preset defaults from the `SplitPageLayout.js` wrapper (code is
  authority): `position="start"`, `sticky=true`, `padding="normal"`, `divider="line"`; `width`
  default `"medium"` (`PageLayout.js`). Renders inside a `SplitPageLayout` Root (reads
  `PageLayoutContext`); warns without `aria-label`/`aria-labelledby` when it overflows.
- **Component-level description (→ `catalog.json` `description`):** A side panel region beside the
  main content of a split page layout, optionally resizable by the user.

Cross-region conventions per `split-page-layout-header.md`. Pane-specific: the resize cluster.

## Conventions established by this component

- **Controlled resize folds into a two-way bound width.** `currentWidth` (the live px width) is
  carried as `DynamicNumber`, two-way bound; the `onResizeEnd` callback is the write-back and is not
  a separate prop — the Details-`open` / Checkbox-`checked` controlled pattern. `widthStorageKey`
  (localStorage persistence) is dropped: it is a client-runtime browser detail, and persistence now
  lives in the bound data-model path. Reused by `SplitPageLayout.Sidebar`.

---

## Adapter section

### Prop-surface table

| prop | decision | synthetic? | A2UI type | description |
|---|---|---|---|---|
| `children` | carry (optional) | yes | `ChildList` | The content rendered inside the pane. |
| `position` | carry | no | `responsive(z.enum(['start','end'])) (default: "start")` | Which side of the content the pane sits on. |
| `width` | carry | no | `z.union([z.enum(['small','medium','large']), z.object({min: z.string(), default: z.string(), max: z.string()})]) (default: "medium")` | The pane width — a named size, or explicit min/default/max px constraints. |
| `minWidth` | carry | no | `z.number()` | Minimum pane width in pixels (used with named sizes). |
| `padding` | carry | no | `z.enum(['none','condensed','normal']) (default: "normal")` | Inner padding of the pane. |
| `divider` | carry | no | responsive `z.enum(['none','line'])`, narrow arm also allowing `'filled'` (default: `"line"`) | A divider drawn along the edge between the pane and the content. |
| `sticky` | carry | no | `z.boolean() (default: true)` | Whether the pane sticks to the viewport while the content scrolls. |
| `offsetHeader` | carry | no | `z.union([z.string(), z.number()])` | Top offset for the sticky pane, to clear a fixed header. |
| `hidden` | carry | no | `responsive(z.boolean())` | Whether the pane is hidden. |
| `resizable` | carry | no | `z.boolean() (default: false)` | Whether the user can drag to resize the pane. |
| `currentWidth` | carry | no | `DynamicNumber` | The controlled live width of the pane in pixels. Two-way bound: a resize writes the new width back to the bound path. |
| `accessibility` | carry | no | `AccessibilityAttributes` | Accessibility label for the pane region. |

### Functions

None.

### Dropped / deferred props

| prop | reason |
|---|---|
| `onResizeEnd` | Represented by the two-way binding on `currentWidth` (the resize write-back). |
| `widthStorageKey` | localStorage persistence key; client-runtime detail, redundant with the bound `currentWidth` path. |
| `positionWhenNarrow`, `dividerWhenNarrow` | Deprecated aliases; superseded by responsive `position`/`divider` (`@deprecated` in code). |
| `id` | DOM element id; no A2UI representation. |
| `aria-labelledby`, `className`, `style` | No A2UI representation. |

---

## Client section

Rendered inside a minimal `SplitPageLayout` Root (content + pane). Pane carries the phase's
**panel-width** and **vertical-divider** representatives. `accessibility.label` is set on the pane
to avoid Primer's overflow warning.

### Fixture table

| fixture | exercises (coverage axis) | component state / canned children | baselined? |
|---|---|---|---|
| `spl-pane-position` | visual enum — `position` | Root + content + pane; gallery, one surface per `[start, end]`; pane = three `Link`s | yes (one PNG) |
| `spl-pane-width` | visual enum — `width` (**panel-width representative** for Pane/Sidebar) | gallery, one surface per `[small, medium, large]` + one custom `{min:'160px', default:'240px', max:'320px'}`; pane = three `Link`s | yes (one PNG) |
| `spl-pane-divider` | visual enum — `divider` (**vertical-divider representative** for Pane/Sidebar) | gallery, one surface per `[none, line]`; pane = three `Link`s | yes (one PNG) |
| `spl-pane-resizable` | state — `resizable` (drag handle visible) | `resizable: true`; pane = three `Link`s | yes |

### Prop-coverage map

| adapter prop | covered by |
|---|---|
| `children` | `spl-pane-position`/`spl-pane-width` (static array) + Root composition |
| `position` | `spl-pane-position` |
| `width` | `spl-pane-width` (named sizes + custom object) |
| `minWidth` | render-test assertion (resize lower bound; visual only during drag) |
| `padding` | render-test assertion (padding attribute forwarded; scale proven on `spl-content-padding`) |
| `divider` | `spl-pane-divider` (vertical representative) |
| `sticky` | render-test assertion (`position: sticky` applied; visual effect is scroll-only) |
| `offsetHeader` | render-test assertion (sticky top offset applied) |
| `hidden` | render-test assertion (region omitted when `true`; responsive arm deferred) |
| `resizable` | `spl-pane-resizable` |
| `currentWidth` | render-test assertion (two-way resize write-back to the bound path) |
| `accessibility` | render-test assertion (non-visual; `label`→`aria-label`) |

---

## Agent section

Omitted. `SplitPageLayout.Pane` emits no `Action` (resize folds into the `currentWidth` two-way
binding), so per the Orchestration skip rule there is no agent surface to design.
