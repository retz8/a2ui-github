# Spinner

- **Official documentation URL:** https://primer.style/components/spinner
- **Real prop surface resolved from:** `@primer/react` installed type declarations at
  `node_modules/@primer/react/dist/Spinner/Spinner.d.ts` — a flat type:
  `{ size?, srText?, 'aria-label'?, className?, style?, delay? } & HTMLDataAttributes`. No
  polymorphism, no `as`, no `children` (renders a self-contained SVG), no event handlers.
  Real props: `size` (`'small' | 'medium' | 'large'`, implementation default `'medium'`),
  `srText` (`string | null`, implementation default `'Loading'`), `aria-label` (deprecated),
  `className`, `style`, `delay` (`boolean | 'short' | 'long' | number`, implementation default
  `false`), and the `data-*` spread.
- **Component-level description (→ `catalog.json` `description`):** An indeterminate loading
  indicator for processes with unknown or variable duration.

---

## Adapter section

### Prop-surface table

| prop | decision | synthetic? | A2UI type | description |
|---|---|---|---|---|
| `size` | carry | no | `z.enum(['small','medium','large']) (default: "medium")` | The width and height of the spinner. |
| `srText` | carry | no | `DynamicString`, nullable `(default: "Loading")` | Text conveyed to assistive technologies while the spinner is shown; describes what is loading. `null` suppresses it when a visible text node elsewhere announces the loading state. |
| `delay` | carry | no | `z.enum(['none','short','long']) (default: "none")` | Delay before the spinner becomes visible (`short` ≈ 300ms, `long` ≈ 1000ms), so briefly-loading content never flashes a spinner. |

### Functions

None. Spinner is a pure display leaf — no `Action`, no local function.

### Dropped / deferred props

| prop | reason |
|---|---|
| `aria-label` | Dropped: marked `@deprecated` ("Use `srText` instead") in the installed types; `srText` carries the same capability. |
| `className`, `style` | Styling passthroughs; no A2UI representation. |
| `data-*` spread (`HTMLDataAttributes`) | Dropped: no A2UI representation. |
| `delay`'s `number` (custom ms) and `true` arms | Not carried into the enum: raw millisecond tuning has no authoring-time signal; `true` is the doc's own alias for the 1000ms case (`'long'`). |

---

## Client section

The spinner is CSS-animated; baselines are deterministic because Playwright's
`toHaveScreenshot` disables CSS animations, freezing the first frame.

### Fixture table

| fixture | exercises (coverage axis) | component state / canned values | baselined? |
|---|---|---|---|
| `spinner` | default render | all defaults (`size: "medium"`, built-in `srText` `"Loading"`, `delay: "none"`) | yes |
| `spinner-sizes` | visual enum — `size` | one surface per `['small','medium','large']`; all other props default so size is the only differing axis | yes (one PNG) |

Single-axis throughout: no semantic couplings exist.

### Prop-coverage map

| adapter prop | covered by |
|---|---|
| `size` | `spinner-sizes` |
| `srText` | render-test assertions (non-visual): literal value renders as the visually-hidden text; bound `{path}` + data-model value resolves (path-binding proof — Spinner's only `Dynamic*` prop); `null` renders no hidden text |
| `delay` | render-test assertion (temporal, not stable-visual — a baseline would race the delay timer): with fake timers, `delay: "short"` → spinner absent at t0, present after 300ms |

---

## Agent section

Omitted. Spinner emits no `event`-shaped `Action` (no `Action` at all — it is a pure display
leaf), so per the Orchestration skip rule there is no agent surface to design.
