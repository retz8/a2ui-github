# SkeletonBox

- **Official documentation URL:** https://primer.style/components/skeleton-box
- **Real prop surface resolved from:** `@primer/react` installed type declarations at
  `node_modules/@primer/react/dist/Skeleton/SkeletonBox.d.ts` — a flat type:
  `{ height?, width?, className?, delay? } & HTMLProps<HTMLElement>`. No polymorphism, no
  `as`, no content channel (renders a single empty shimmering `<div>`), no event handlers.
  Real props: `height` (`CSSProperties['height']`, default `1rem` — applied by the
  component's stylesheet, corroborated by the doc), `width` (`CSSProperties['width']`, no
  default — renders `display: block`, filling its container), `className`, `delay`
  (`'short' | 'long' | number`, implementation default no delay), and the
  `HTMLProps<HTMLElement>` spread.
- **Component-level description (→ `catalog.json` `description`):** A shimmering
  placeholder box that reserves space for non-text content, such as an image, while it
  loads.

---

## Adapter section

### Prop-surface table

| prop | decision | synthetic? | A2UI type | description |
|---|---|---|---|---|
| `height` | carry | no | `z.string() (default: "1rem")` | Height of the placeholder box; any CSS height value. |
| `width` | carry | no | `z.string()` | Width of the placeholder box; any CSS width value. Fills its container when unset. |
| `delay` | carry | no | `z.enum(['none','short','long']) (default: "none")` | Delay before the placeholder becomes visible (`short` ≈ 300ms, `long` ≈ 1000ms), so briefly-loading content never flashes a skeleton. |

Both dimensions are fixed authoring-time configuration — plain `z.string()`, not
`Dynamic*`. No synthetic content prop: the box is genuinely empty (`children` is not part
of the documented surface). No `accessibility` carry: a skeleton is decorative display
with no author-facing accessibility channel in its documented surface. No `Action`.

### Functions

None. SkeletonBox is a pure display leaf — no `Action`, no local function.

### Dropped / deferred props

| prop | reason |
|---|---|
| `className` | Styling passthrough; no A2UI representation. |
| non-`aria-*` `HTMLProps<HTMLElement>` spread (`style`, `children`, event handlers, `data-*`, …) | Dropped: no A2UI representation. |
| `height`/`width` `number` arm | Not carried into the projection: a CSS length string expresses every case; a raw pixel number is the string `"NNpx"`. |
| `delay`'s `number` (custom ms) arm | Not carried into the enum: raw millisecond tuning has no authoring-time signal — same projection as Spinner's `delay`. |

---

## Client section

The shimmer is CSS-animated; baselines are deterministic because Playwright's
`toHaveScreenshot` disables CSS animations, freezing the first frame.

### Fixture table

| fixture | exercises (coverage axis) | component state / canned values | baselined? |
|---|---|---|---|
| `skeletonbox` | default render | all defaults — `1rem` tall, fills container width | yes |
| `skeletonbox-sized` | dimensions — `height` + `width` (one coupled geometry axis) | `height: "80px"`, `width: "200px"` | yes |

`height` and `width` are semantically coupled (box geometry), so they share one fixture;
the default fixture already shows each dimension's unset behavior.

### Prop-coverage map

| adapter prop | covered by |
|---|---|
| `height` | `skeletonbox-sized` (set) + `skeletonbox` (default) |
| `width` | `skeletonbox-sized` (set) + `skeletonbox` (default) |
| `delay` | render-test assertion (temporal, not stable-visual — a baseline would race the delay timer): with fake timers, `delay: "short"` → box absent at t0, present after 300ms |

---

## Agent section

Omitted. SkeletonBox emits no `event`-shaped `Action` (no `Action` at all — it is a pure
display leaf), so per the Orchestration skip rule there is no agent surface to design.
