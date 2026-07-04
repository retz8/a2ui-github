# Text

- **Official documentation URL:** https://primer.style/components/text
- **Real prop surface resolved from:** `@primer/react` installed type declarations at
  `node_modules/@primer/react/dist/Text/Text.d.ts`, following the `PolymorphicProps` spread in
  `node_modules/@primer/react/dist/utils/modern-polymorphic.d.ts`.
  `TextProps<As> = PolymorphicProps<As, 'span', { size?, weight?, whiteSpace?, className? }>`,
  which expands to
  `DistributiveOmit<React.ComponentPropsWithRef<'span'> & { size, weight, whiteSpace, className }, 'as'> & { as?: As }`.
  Real props: the four Text-specific props (`size`, `weight`, `whiteSpace`, `className`), the
  polymorphic `as`, and the full `span` host-element spread (`children`, `ref`, `style`, `id`,
  `title`, `role`, `tabIndex`, `dir`, `lang`, all `aria-*`, all `data-*`, all DOM event handlers).
- **Component-level description (→ `catalog.json` `description`):** Displays textual content with
  configurable typographic size, weight, whitespace handling, and rendering element. A
  non-interactive display primitive.

> Produced by the clean-context validation walk of `design-catalog-component` (task 4.4). The
> carried surface reproduces the shipped `Text` exactly (enum orderings normalized to shipped).

---

## Adapter section

### Prop-surface table

| prop | decision | synthetic? | A2UI type | description |
|---|---|---|---|---|
| `text` | carry (required) | yes | `DynamicString` | The textual content to display. |
| `as` | carry | no | `z.enum(['span','p','div','label','strong','em','small']) (default: "span")` | The HTML element used to render the text; the choices are display-equivalent, so the element is selected for semantic meaning. |
| `size` | carry | no | `z.enum(['small','medium','large'])` | The typographic size of the text. |
| `weight` | carry | no | `z.enum(['light','normal','medium','semibold'])` | The font weight of the text. |
| `whiteSpace` | carry | no | `z.enum(['normal','nowrap','pre','pre-wrap','pre-line'])` | How whitespace and line breaks in the content are collapsed or preserved. |
| `className` | drop | — | — | — |

### Functions

None. Text carries no `Action` and needs no local function.

### Dropped / deferred props

| prop | reason |
|---|---|
| `className` | Styling passthrough (references design-system CSS class names); no A2UI representation. |
| `aria-*` slice of the host-element spread | Not carried: Text is a plain display primitive with no author-facing accessibility surface, so no `accessibility` / `AccessibilityAttributes` is carried (per-component fidelity — inherited aria via the polymorphic host-element spread does not by itself justify carrying it). |
| `ref`, `style`, `id`, `title`, `role`, `tabIndex`, `dir`, `lang`, DOM event handlers (`onClick`, `onMouseOver`, …), `data-*`, and the rest of the non-`aria-*` `span` host-element attribute spread | Dropped: no A2UI representation. Event handlers are incidental host-element inheritance, not a designed interaction of Text, so no `Action` is introduced. |

> Note: `children` is not dropped — it is the raw-content channel, superseded by the synthetic
> `text` prop (synthetic-content-prop rule: raw content → synthetic value prop typed `DynamicString`).

---

## Client section

> The fixture set below is the exhaustive one the skill's prop-walk yields. The **shipped repo
> currently implements a subset** — `text`, `text-bound` — with the enum-gallery fixtures
> deferred backfill.

### Fixture table

| fixture | exercises (coverage axis) | component state / canned values | baselined? |
|---|---|---|---|
| `text` | content channel — literal | `text: "Hello from Primer"` | yes |
| `text-bound` | content channel — bound (path binding) | `text: {path: "/greeting"}`; data model `{greeting: "Bound hello"}` | yes |
| `text-sizes` | visual enum — `size` | one surface per `['small','medium','large']`; each surface's `text` = the size name | yes (one PNG) |
| `text-weights` | visual enum — `weight` | one surface per `['light','normal','medium','semibold']`; each surface's `text` = the weight name | yes (one PNG) |
| `text-as` | visual enum — `as` | one surface per `['span','p','div','label','strong','em','small']`; each surface's `text` = the tag name | yes (one PNG) |
| `text-whitespace` | visual enum — `whiteSpace` | one surface per `['normal','nowrap','pre','pre-wrap','pre-line']`; each surface's `text` = a multi-line string with runs of spaces and newlines (so the differences render) | yes (one PNG) |

Single-axis: each fixture isolates one prop; no semantic coupling among Text's props, so no combined fixtures.

### Prop-coverage map

| adapter prop | covered by |
|---|---|
| `text` | `text` (literal) + `text-bound` (bound) |
| `as` | `text-as` |
| `size` | `text-sizes` |
| `weight` | `text-weights` |
| `whiteSpace` | `text-whitespace` |

Every carried prop is covered by a baselined fixture; Text has no non-visual carried prop, so there are no render-test-assertion rows.

---

## Agent section

Omitted. Text emits no `event`-shaped `Action` (it emits no `Action` at all), so per the Orchestration skip rule ("a component with no event-shaped action gets no agent section") there is no agent surface to design.
