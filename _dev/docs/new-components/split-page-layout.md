# SplitPageLayout

- **Official documentation URL:** https://primer.style/components/split-page-layout/
- **Real prop surface resolved from:** `@primer/react` installed type declarations at
  `node_modules/@primer/react/dist/SplitPageLayout/SplitPageLayout.d.ts`. `SplitPageLayout` is a
  **preset of `PageLayout`**: its `Root` type is `{ className?: string }` only — the layout knobs
  (`containerWidth`, `padding`, `rowGap`, `columnGap`) are hardcoded by the wrapper
  (`SplitPageLayout.js`: `containerWidth="full"`, `padding/rowGap/columnGap="none"`,
  `_slotsConfig`). Its five region subcomponents (`Header`, `Content`, `Pane`, `Sidebar`, `Footer`)
  reuse the `PageLayout*Props` types verbatim (`dist/PageLayout/PageLayout.d.ts`); each region's
  **preset defaults** come from the `SplitPageLayout.js` wrapper (code is authority), not
  `PageLayout`'s own defaults. `PageLayout` slots its children by slot-marker via `useSlots`, and
  every region reads `PageLayoutContext` — so a region only lays out correctly inside a Root.
- **Component-level description (→ `catalog.json` `description`):** A page layout with a fixed
  split arrangement — a full-width header and footer, a main content area, and an adjacent side
  panel or full-height sidebar.

> This is the Root container. Its five region subcomponents each have their own decision doc, all
> part of the 6.35 sub-task: `split-page-layout-header.md`, `split-page-layout-content.md`,
> `split-page-layout-pane.md`, `split-page-layout-sidebar.md`, `split-page-layout-footer.md`.

## Conventions established by this component

- **Named multi-slot container.** A compound whose subcomponents occupy fixed, distinct regions
  maps to a Root leaf carrying **one named synthetic `ComponentId` slot per region** (not a flat
  `ChildList`). This is the multi-slot generalization of the Details `summary`/`children` named-slot
  pattern; it preserves each region's identity and position (the agent cannot supply two panes or
  route a raw component into the header). Each slot references the corresponding region leaf, whose
  own render emits the real Primer subcomponent (carrying its slot-marker) so Primer's `useSlots`
  slots it correctly.
- **Region-as-container.** Each region leaf is itself a container: its inner content is a
  `CommonSchemas.ChildList` (`children` slot), exactly like Stack.
- **Faithful compound = one leaf per documented subcomponent.** Following the source library's own
  structure, a multi-region compound ships as sibling leaves (one per subcomponent), never a single
  flattened leaf — the standing pattern for Select/SegmentedControl/Stack compounds.

---

## Adapter section

### Prop-surface table

| prop | decision | synthetic? | A2UI type | description |
|---|---|---|---|---|
| `header` | carry (optional) | yes | `ComponentId` | The banner region across the top of the page. |
| `content` | carry (optional) | yes | `ComponentId` | The main content region. |
| `pane` | carry (optional) | yes | `ComponentId` | The side panel region beside the main content. |
| `sidebar` | carry (optional) | yes | `ComponentId` | The full-height side region running alongside the header, content, and footer. |
| `footer` | carry (optional) | yes | `ComponentId` | The footer region across the bottom of the page. |

Root carries **no configuration props** — the split preset hardcodes `containerWidth`, `padding`,
`rowGap`, and `columnGap`. All five slots are optional, matching Primer's optional children.

### Functions

None.

### Dropped / deferred props

| prop | reason |
|---|---|
| `className` | Styling passthrough; no A2UI representation. |

---

## Client section

Region slots reference the region leaves (each its own decision doc). Two composition fixtures
cover all five slots; Pane and Sidebar (both side regions) are shown in separate compositions.

### Fixture table

| fixture | exercises (coverage axis) | component state / canned children | baselined? |
|---|---|---|---|
| `split-page-layout` | slots — header + content + pane + footer | `header`→Header leaf (a `Heading` "Repository settings"); `content`→Content leaf (a `Text` paragraph); `pane`→Pane leaf (three `Link`s); `footer`→Footer leaf (a `Text` "© 2026 GitHub") | yes |
| `split-page-layout-sidebar` | slot — sidebar (full-height span) | `header`→Header leaf; `sidebar`→Sidebar leaf (three `Link`s); `content`→Content leaf; `footer`→Footer leaf | yes |

### Prop-coverage map

| adapter prop | covered by |
|---|---|
| `header` | both compositions |
| `content` | both compositions |
| `pane` | `split-page-layout` |
| `sidebar` | `split-page-layout-sidebar` |
| `footer` | both compositions |

---

## Agent section

Omitted. `SplitPageLayout` emits no `Action` (no interaction at all — it is a pure layout
container), so per the Orchestration skip rule there is no agent surface to design.
