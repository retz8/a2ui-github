# Heading

- **Official documentation URL:** https://primer.style/components/heading
- **Real prop surface resolved from:** `@primer/react` installed type declarations at
  `node_modules/@primer/react/dist/Heading/Heading.d.ts` (v38.28.0).
  `Heading: PolymorphicForwardRefComponent<HeadingLevels, StyledHeadingProps>` where
  `HeadingLevels = 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6'` and
  `StyledHeadingProps = { as?: HeadingLevels; variant?: 'large' | 'medium' | 'small' }`.
  Real props: `as` (polymorphic, already type-constrained to the six heading elements;
  documented default `"h2"`), `variant`, and the heading host-element spread (`children`,
  `ref`, `className`, `style`, `id`, `title`, `role`, `tabIndex`, all `aria-*`, all `data-*`,
  all DOM event handlers).
- **Component-level description (→ `catalog.json` `description`):** Displays a section heading
  with a selectable semantic level and configurable visual size. A non-interactive display
  primitive.

---

## Adapter section

### Prop-surface table

| prop | decision | synthetic? | A2UI type | description |
|---|---|---|---|---|
| `text` | carry (required) | yes | `DynamicString` | The heading's textual content. |
| `as` | carry | no | `z.enum(['h1','h2','h3','h4','h5','h6']) (default: "h2")` | The heading element to render; selects the semantic level in the document outline, independent of visual size. |
| `variant` | carry | no | `z.enum(['large','medium','small'])` | The visual size of the heading, independent of the semantic level. |

### Functions

None. Heading carries no `Action` and needs no local function.

### Dropped / deferred props

| prop | reason |
|---|---|
| `aria-*` slice of the host-element spread | Not carried: Heading is a plain display primitive with no author-facing accessibility surface beyond the outline level, which the carried `as` prop itself expresses — so no `accessibility` / `AccessibilityAttributes` is carried (per-component fidelity). |
| `className`, `style`, `ref`, `id`, `title`, `role`, `tabIndex`, DOM event handlers (`onClick`, `onMouseOver`, …), `data-*`, and the rest of the non-`aria-*` heading host-element spread | Dropped: no A2UI representation. Event handlers are incidental host-element inheritance, not a designed interaction of Heading, so no `Action` is introduced. |

> Note: `children` is not dropped — it is the raw-content channel, superseded by the synthetic
> `text` prop (synthetic-content-prop rule: raw content → synthetic value prop typed `DynamicString`).

---

## Client section

### Fixture table

| fixture | exercises (coverage axis) | component state / canned values | baselined? |
|---|---|---|---|
| `heading` | content channel — literal | `text: "Heading from Primer"` | yes |
| `heading-bound` | content channel — bound (path binding) | `text: {path: "/title"}`; data model `{title: "Bound heading"}` | yes |
| `heading-variants` | visual enum — `variant` | one surface per `['large','medium','small']`; each surface's `text` = the variant name | yes (one PNG) |

Single-axis: each fixture isolates one prop; no semantic coupling among Heading's props, so no
combined fixtures.

`as` gets no fixture: Heading's styling keys only on `variant` (the base style is identical for
every element level), so an `as` gallery would render identical surfaces — it is a non-visual
prop covered by render-test assertion instead.

### Prop-coverage map

| adapter prop | covered by |
|---|---|
| `text` | `heading` (literal) + `heading-bound` (bound) |
| `as` | render-test assertion (non-visual) — render with each `as` value and assert the matching `h1`…`h6` element is produced, plus the `h2` default when `as` is unset |
| `variant` | `heading-variants` |

Every carried prop appears in the coverage map: `text` and `variant` via baselined fixtures,
`as` via the render-test assertion.

---

## Agent section

Omitted. Heading emits no `event`-shaped `Action` (it emits no `Action` at all), so per the
Orchestration skip rule ("a component with no event-shaped action gets no agent section") there
is no agent surface to design.
