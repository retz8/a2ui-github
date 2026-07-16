# PageLayout.Content

- **Official documentation URL:** https://primer.style/product/components/page-layout/
- **Real prop surface resolved from:** `@primer/react` installed type declarations at
  `node_modules/@primer/react/dist/PageLayout/PageLayout.d.ts` — `PageLayoutContentProps`. Rendered
  main landmark (default `as='main'`); falls through the parent's `useSlots` to `rest` (needs no slot
  marker).
- **Component-level description (→ `catalog.json` `description`):** The main content region of a page
  layout.

> A region leaf of the `PageLayout` compound family (see `page-layout.md`), shipped together in 6.34.
> Renders only inside a `PageLayout`; the root references it through its `content` `ComponentId` slot.
> Shared local types (`spacing`, `sizeWidth`) are defined in `page-layout.md`.

---

## Adapter section

### Prop-surface table

| prop | decision | synthetic? | A2UI type | description |
|---|---|---|---|---|
| `children` | carry (optional) | yes | `ChildList` | The main content. |
| `as` | carry | no | `z.enum(['main','div','section','article']) (default: "main")` | The HTML element used to render the content region; the choices are display-equivalent and differ only in semantic/landmark identity. |
| `width` | carry | no | `sizeWidth (default: "full")` | Maximum width of the content region. |
| `padding` | carry | no | `spacing (default: "none")` | Padding inside the content region. |
| `hidden` | carry | no | `responsive(z.boolean()) (default: false)` | Whether the content region is hidden; supports a per-viewport value. |
| `accessibility` | carry | no | `AccessibilityAttributes` | Accessibility label for the main landmark. |

### Functions

None.

### Dropped / deferred props

| prop | reason |
|---|---|
| `className`, `style` | Dropped: styling passthroughs; no A2UI representation. |

---

## Client section

Fixtures compose a `PageLayout` with a `content` region (paired with a `header` for context).

### Fixture table

| fixture | exercises (coverage axis) | component state / canned values | baselined? |
|---|---|---|---|
| `pagelayout-content-width` | visual enum — `width` | one surface per `['full','medium','large','xlarge']`; content w/ `Stack` of `Text` | yes (one PNG) |
| `pagelayout-content-padding` | visual enum — `padding` | one surface per `['none','condensed','normal']`; bordered content | yes (one PNG) |
| `pagelayout-content-template` | content — dynamic template (bound `ChildList`) | `children: {componentId:'tpl', path:'/items'}`; `tpl` = `Text` binding `{path:'./label'}`; data model `/items = [{label:'Alpha'},{label:'Beta'},{label:'Gamma'}]` | yes |

Render-test assertions (non-visual):

- **`as`** — the rendered content element tag matches the enum value (all render the same block box).
- **`hidden`** — responsive `data-*` attribute emitted/forwarded; per-viewport effect via live review.
- **`accessibility`** — `accessibility.label` / `.description` surface as `aria-*` on the main landmark.

### Prop-coverage map

| adapter prop | covered by |
|---|---|
| `children` | `pagelayout` base (static) + `pagelayout-content-template` (dynamic template) |
| `as` | render-test assertion (non-visual) |
| `width` | `pagelayout-content-width` |
| `padding` | `pagelayout-content-padding` |
| `hidden` | render-test assertion + live review (per-viewport) |
| `accessibility` | render-test assertion (non-visual) |

---

## Agent section

Omitted. `PageLayout.Content` emits no `Action`, so per the Orchestration skip rule there is no agent
surface to design.
