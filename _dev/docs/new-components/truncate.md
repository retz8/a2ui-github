# Truncate

- **Official documentation URL:** https://primer.style/components/truncate
- **Real prop surface resolved from:** `@primer/react` installed type declarations at
  `node_modules/@primer/react/dist/Truncate/Truncate.d.ts` — a polymorphic component
  (`PolymorphicForwardRefComponent<"div", TruncateProps>`) with
  `TruncateProps = React.HTMLAttributes<HTMLElement> & { title: string; inline?: boolean;
  expandable?: boolean; maxWidth?: number | string }`. Implementation defaults (code is
  authority): `as = 'div'`, `maxWidth = 125` (a number is applied as `"NNpx"`; a string
  passes through as any CSS width). `inline`/`expandable` are data-attribute toggles,
  effectively `false` when unset. Component CSS: base `display: inherit` + ellipsis
  truncation at `--truncate-max-width`; `[data-inline]` → `display: inline-block;
  vertical-align: top`; `[data-expandable]:hover` → `max-width: 10000px` (hover-only
  reveal). Real props: `children` (the truncated content), `title` (required), `inline`,
  `expandable`, `maxWidth`, polymorphic `as`, and the non-`aria-*`
  `HTMLAttributes<HTMLElement>` spread. No event handlers of its own.
- **Component-level description (→ `catalog.json` `description`):** Shortens overflowing
  text with an ellipsis, constrained to a maximum width.

---

## Adapter section

### Prop-surface table

| prop | decision | synthetic? | A2UI type | description |
|---|---|---|---|---|
| `text` | carry (required) | yes | `DynamicString` | The text content to truncate. |
| `title` | carry (required) | no | `DynamicString` | The full untruncated text, exposed to assistive technologies and shown when the text is hovered. |
| `inline` | carry | no | `z.boolean() (default: false)` | Displays the text inline (as inline-block, top-aligned) so it can sit alongside other content. |
| `expandable` | carry | no | `z.boolean() (default: false)` | Reveals the full text when hovered. |
| `maxWidth` | carry | no | `z.string() (default: "125px")` | The maximum width of the text before it truncates; any CSS width value. |
| `as` | carry | no | `z.enum(['div','span','p']) (default: "div")` | The HTML element used to render the truncated text; the choices are display-equivalent. |

`title` is carried separately from the synthetic `text` — it is the accessibility channel
(full text for assistive technologies and hover tooltip), not a duplicate of the rendered
content. Both content props are `DynamicString` (bindable).

### Functions

None. Truncate is a pure display leaf — no `Action`, no local function.

### Dropped / deferred props

| prop | reason |
|---|---|
| `className`, `style` | Styling passthroughs; no A2UI representation. |
| non-`aria-*` `HTMLAttributes<HTMLElement>` spread (event handlers, `data-*`, `id`, `tabIndex`, …) | Dropped: no A2UI representation. Event handlers are incidental host-element inheritance, not a designed interaction of Truncate, so no `Action` is introduced. |
| `maxWidth` `number` arm | Not carried into the projection: a CSS width string expresses every case; a raw pixel number is the string `"NNpx"` (SkeletonBox precedent). |
| `as` beyond `['div','span','p']` | The curated enum keeps the display-equivalent wrapper elements; arbitrary element types have no authoring-time signal. |
| `aria-*` slice of the spread | Not carried as `accessibility`: Truncate's author-facing accessibility channel is the carried `title` prop itself (per-component fidelity). |

---

## Client section

Canned text values must exceed the 125px default max-width so the ellipsis truncation
actually renders in the baseline.

### Fixture table

| fixture | exercises (coverage axis) | component state / canned values | baselined? |
|---|---|---|---|
| `truncate` | content — literal + default truncation (125px) | `text: "src/components/navigation/PrimaryNavigationMenu.tsx"`; `title` the same string | yes |
| `truncate-bound` | content — bound path | `text: {path: "/fullText"}`, `title: {path: "/fullText"}`; data model `/fullText = "feature/add-visual-regression-baselines-for-truncate"` | yes |
| `truncate-maxwidth` | visually-distinct config — `maxWidth` | `maxWidth: "300px"`; same long `text`/`title` as `truncate` | yes |
| `truncate-as` | visual enum — `as` | one surface per `['div','span','p']`, each `text` = the tag name padded long enough to truncate; `title` the same string | yes (one PNG) |

### Prop-coverage map

| adapter prop | covered by |
|---|---|
| `text` | `truncate` (literal) + `truncate-bound` (bound) |
| `title` | render-test assertion — the rendered element's `title` attribute equals the canned value, asserted for both the literal and bound forms (every fixture sets it, since required); a native hover tooltip is invisible to a static screenshot |
| `inline` | render-test assertion — `data-inline` present when `inline: true`; alone in a single-axis leaf fixture the rendering is pixel-identical to the default (the inline-vs-block difference only shows next to sibling content) |
| `expandable` | render-test assertion — `data-expandable` present when `expandable: true`; the reveal is `:hover`-only CSS, which jsdom cannot exercise and the static-screenshot e2e harness has no hover step for |
| `maxWidth` | `truncate-maxwidth` (set) + `truncate` (default) |
| `as` | `truncate-as` gallery — `display: inherit` makes the surfaces likely identical, but the gallery captures any element-level difference (e.g. `<p>` margin) either way |

---

## Agent section

Omitted. Truncate emits no `event`-shaped `Action` (no `Action` at all — it is a pure
display leaf), so per the Orchestration skip rule there is no agent surface to design.
