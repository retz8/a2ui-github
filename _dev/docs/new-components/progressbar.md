# ProgressBar

- **Official documentation URL:** https://primer.style/components/progress-bar
- **Real prop surface resolved from:** `@primer/react` installed type declarations at
  `node_modules/@primer/react/dist/ProgressBar/ProgressBar.d.ts` — a flat intersection:
  `HTMLAttributes<HTMLSpanElement> & { bg?, className? } & StyledProgressContainerProps
  { inline?, barSize?, animated? } & ProgressProp { className?, progress?, bg? }`. No
  polymorphism, no `as`. Compound: `ProgressBar.Item` (segmented form) — `children` and
  `progress` are mutually exclusive (the implementation throws if both are passed); each
  `Item` takes its own `progress`, `bg`, `aria-label`. The implementation destructures
  `aria-label`, `aria-valuenow`, `aria-valuetext`; the rendered segment carries
  `role="progressbar"`, `aria-valuemin 0` / `aria-valuemax 100`, `aria-valuenow`
  auto-derived from `progress`. Defaults applied in code: `bg = "success.emphasis"`,
  `barSize = "default"`. The rest is the full span host-element spread.
- **Component-level description (→ `catalog.json` `description`):** A horizontal bar that
  visualizes the completion percentage of a task or process, either as a single filled
  segment or as multiple colored segments.

---

## Adapter section

### Prop-surface table

| prop | decision | synthetic? | A2UI type | description |
|---|---|---|---|---|
| `progress` | carry | no | `DynamicNumber` | The completion percentage, 0–100. Mutually exclusive with `segments`; omitting both renders an empty track. |
| `segments` | carry | yes | `z.array(z.object({progress, bg?, label?}))` — segment shape below | The segments of a multi-segment bar, each with its own percentage and color. Mutually exclusive with `progress`. |
| `bg` | carry | no | `z.enum(['success','attention','severe','danger','accent','done','open','closed','draft','neutral','sponsors','upsell']) (default: "success")` | The semantic color role of the filled segment. |
| `barSize` | carry | no | `z.enum(['small','default','large']) (default: "default")` | The height of the bar. |
| `inline` | carry | no | `z.boolean() (default: false)` | Whether the bar renders inline with surrounding content instead of as a block. |
| `animated` | carry | no | `z.boolean() (default: false)` | Whether the filled segment is animated. Applies to the single-`progress` form. |
| `accessibility` | carry | no | `AccessibilityAttributes` | Accessibility label naming what is progressing, for assistive technologies. |

**Segment shape** (each `segments` element):

- `progress: DynamicNumber` — required; an authored segment needs a width.
- `bg` — the same 12-role enum, optional `(default: "success")`.
- `label: DynamicString` — optional; the accessible name of that segment (maps to the
  segment's `aria-label`).

**Schema constraint:** `progress` and `segments` are mutually exclusive ("not both" — a
refinement, matching the installed throw); neither given is legal (empty track). The adapter
maps a `bg` role to the `<role>.emphasis` color token.

### Functions

None. ProgressBar is a pure display leaf — no `Action`, no local function.

### Dropped / deferred props

| prop | reason |
|---|---|
| `className` | Styling passthrough; no A2UI representation. |
| `aria-valuenow` | Auto-derived by the implementation from `progress` (rounded, min 0 / max 100); never authored. |
| `aria-valuetext` | No `AccessibilityAttributes` slot; the auto-derived `aria-valuenow` covers the value channel. |
| `id`, `style`, `tabIndex`, `data-*`, DOM event handlers, `ref`, and the rest of the non-`aria-*` span spread | Dropped: no A2UI representation. Event handlers are incidental inheritance — a progress bar is not interactive, so no `Action` is introduced. |

> `children` is not dropped — it is the compound `ProgressBar.Item` channel, superseded by
> the synthetic `segments` prop (synthetic-content-prop rule; the `ComponentId` variant is
> not needed: segments are data, not component references).

---

## Client section

### Fixture table

| fixture | exercises (coverage axis) | component state / canned values | baselined? |
|---|---|---|---|
| `progressbar` | value channel — literal | `progress: 65` | yes |
| `progressbar-bound` | value channel — bound (path binding) | `progress: {path: "/completion"}`; data model `{completion: 40}` | yes |
| `progressbar-segments` | synthetic `segments` array — literal | `segments: [{progress: 55, bg: "success", label: "TypeScript"}, {progress: 30, bg: "accent", label: "CSS"}, {progress: 15, bg: "attention", label: "Other"}]` | yes |
| `progressbar-segments-bound` | `segments` — bound inside an array element | same three segments, first segment `progress: {path: "/tsShare"}`; data model `{tsShare: 55}` | yes |
| `progressbar-bg` | visual enum — `bg` | one surface per `['success','attention','severe','danger','accent','done','open','closed','draft','neutral','sponsors','upsell']`; each `progress: 65` so color is the only differing axis | yes (one PNG) |
| `progressbar-sizes` | visual enum — `barSize` | one surface per `['small','default','large']`; each `progress: 65` | yes (one PNG) |

Single-axis throughout; no semantic couplings exist. (`segments` rows carry `bg`/`label`
values because a segment *is* the coupled unit — that is the prop's own shape, not a
cross-prop coupling.)

### Render-test assertions (non-visual props)

- `inline` → assert `data-progress-display="inline"` on the rendered track (visual meaning
  exists only inside a width-constrained parent; in isolation the track collapses to zero
  width).
- `animated` → assert `data-animated="true"` on the rendered segment (motion is invisible to
  a frozen baseline; screenshots run `animations: 'disabled'`).
- `accessibility.label` → assert `aria-label` on the `role="progressbar"` element.
- segment `label` → assert per-segment `aria-label` (in the segments render test).

### Prop-coverage map

| adapter prop | covered by |
|---|---|
| `progress` | `progressbar` (literal) + `progressbar-bound` (bound) |
| `segments` | `progressbar-segments` (literal) + `progressbar-segments-bound` (bound-in-array) |
| `bg` | `progressbar-bg` (top-level); segment-level `bg` via both segments fixtures |
| `barSize` | `progressbar-sizes` |
| `inline` | render-test assertion (`data-progress-display`) |
| `animated` | render-test assertion (`data-animated`) |
| `accessibility` | render-test assertion (`aria-label`) |

---

## Agent section

Omitted. ProgressBar emits no `event`-shaped `Action` (no `Action` at all — it is a pure
display leaf), so per the Orchestration skip rule there is no agent surface to design.
