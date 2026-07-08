# CounterLabel

- **Official documentation URL:** https://primer.style/components/counter-label
- **Real prop surface resolved from:** `@primer/react` installed type declarations at
  `node_modules/@primer/react/dist/CounterLabel/CounterLabel.d.ts` — a flat intersection:
  `HTMLAttributes<HTMLSpanElement> & { scheme?, variant?, className?, 'data-component'? } &
  PropsWithChildren & RefAttributes<HTMLSpanElement>`. No polymorphism, no `as`.
  Real props: `children`, `variant`, `scheme` (deprecated), `className`, `data-component`, and the
  full span host-element spread (`id`, `title`, `role`, `tabIndex`, `style`, all `aria-*`, all
  `data-*`, DOM event handlers, `ref`).
- **Component-level description (→ `catalog.json` `description`):** A badge that displays a
  numeric count, used to indicate a quantity such as the number of items in a list or
  notifications.

---

## Adapter section

### Prop-surface table

| prop | decision | synthetic? | A2UI type | description |
|---|---|---|---|---|
| `count` | carry (required) | yes | `DynamicString` | The count value to display. |
| `variant` | carry | no | `z.enum(['primary','secondary']) (default: "secondary")` | The visual emphasis of the counter: `primary` renders a filled high-contrast badge, `secondary` a subtle muted one. |

### Functions

None. CounterLabel is a pure display leaf — no `Action`, no local function.

### Dropped / deferred props

| prop | reason |
|---|---|
| `scheme` | Dropped: marked `@deprecated` ("use variant instead") in the installed types; `variant` carries the same enum. |
| `className` | Styling passthrough; no A2UI representation. |
| `data-component` | Internal styling hook (defaults to `'CounterLabel'`); no A2UI representation. |
| `aria-*` slice of the span spread | Not carried: the component is self-labeling — it renders the visible span `aria-hidden="true"` and emits its own visually-hidden text label for screen readers, so author-set `aria-*` would land on the hidden span and be inert. No `accessibility` / `AccessibilityAttributes` (per-component fidelity). |
| `id`, `title`, `role`, `tabIndex`, `style`, `data-*`, DOM event handlers, `ref`, and the rest of the non-`aria-*` span spread | Dropped: no A2UI representation. Event handlers are incidental inheritance — a counter badge is not interactive, so no `Action` is introduced. |

> `children` is not dropped — it is the raw-content channel, superseded by the synthetic `count`
> prop (synthetic-content-prop rule).

---

## Client section

### Fixture table

| fixture | exercises (coverage axis) | component state / canned values | baselined? |
|---|---|---|---|
| `counterlabel` | content channel — literal | `count: "12"` | yes |
| `counterlabel-bound` | content channel — bound (path binding) | `count: {path: "/notifications"}`; data model `{notifications: "42"}` | yes |
| `counterlabel-variants` | visual enum — `variant` | one surface per `['primary','secondary']`; each surface `count: "12"` so variant styling is the only differing axis | yes (one PNG) |

Single-axis throughout: no semantic couplings exist.

### Prop-coverage map

| adapter prop | covered by |
|---|---|
| `count` | `counterlabel` (literal) + `counterlabel-bound` (bound) |
| `variant` | `counterlabel-variants` |

---

## Agent section

Omitted. CounterLabel emits no `event`-shaped `Action` (no `Action` at all — it is a pure display
leaf), so per the Orchestration skip rule there is no agent surface to design.
