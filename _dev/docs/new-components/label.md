# Label

- **Official documentation URL:** https://primer.style/components/label
- **Real prop surface resolved from:** `@primer/react` installed type declarations at
  `node_modules/@primer/react/dist/Label/Label.d.ts` (v38.28.0).
  `Label: PolymorphicForwardRefComponent<"span", LabelProps>` where
  `LabelProps = { variant?: LabelColorOptions; size?: LabelSizeKeys }`,
  `LabelColorOptions = 'default' | 'primary' | 'secondary' | 'accent' | 'success' |
  'attention' | 'severe' | 'danger' | 'done' | 'sponsors'` and
  `LabelSizeKeys = 'small' | 'large'`.
  Real props: `variant` (documented default `"default"`), `size` (documented default
  `"small"`), `as` (polymorphic over `span`, type-level only — not in the documented props
  table), and the span host-element spread (`children`, `ref`, `className`, `style`, `id`,
  `title`, `role`, `tabIndex`, all `aria-*`, all `data-*`, all DOM event handlers).
- **Component-level description (→ `catalog.json` `description`):** Displays a small badge of
  contextual metadata — such as a status or category — with a selectable color variant and
  size. A non-interactive display primitive.

---

## Adapter section

### Prop-surface table

| prop | decision | synthetic? | A2UI type | description |
|---|---|---|---|---|
| `text` | carry (required) | yes | `DynamicString` | The label's textual content. |
| `variant` | carry | no | `z.enum(['default','primary','secondary','accent','success','attention','severe','danger','done','sponsors']) (default: "default")` | The color scheme of the label, signaling the kind of metadata (e.g. success, danger, attention). |
| `size` | carry | no | `z.enum(['small','large']) (default: "small")` | How large the label is rendered. |

### Functions

None. Label carries no `Action` and needs no local function.

### Dropped / deferred props

| prop | reason |
|---|---|
| `as` | Dropped: incidental polymorphic plumbing — type-level only, absent from the documented props table, and the element identity carries no meaning for a badge beyond `span`. |
| `aria-*` slice of the host-element spread | Not carried: Label is a plain display primitive with no author-facing accessibility surface beyond its visible text — so no `accessibility` / `AccessibilityAttributes` is carried (per-component fidelity). |
| `className`, `style`, `ref`, `id`, `title`, `role`, `tabIndex`, DOM event handlers (`onClick`, `onMouseOver`, …), `data-*`, and the rest of the non-`aria-*` span host-element spread | Dropped: no A2UI representation. Event handlers are incidental host-element inheritance, not a designed interaction of Label, so no `Action` is introduced. |

> Note: `children` is not dropped — it is the raw-content channel, superseded by the synthetic
> `text` prop (synthetic-content-prop rule: raw content → synthetic value prop typed `DynamicString`).

---

## Client section

### Fixture table

| fixture | exercises (coverage axis) | component state / canned values | baselined? |
|---|---|---|---|
| `label` | content channel — literal | `text: "Label from Primer"` | yes |
| `label-bound` | content channel — bound (path binding) | `text: {path: "/status"}`; data model `{status: "Bound label"}` | yes |
| `label-variants` | visual enum — `variant` | one surface per `['default','primary','secondary','accent','success','attention','severe','danger','done','sponsors']`; each surface's `text` = the variant name | yes (one PNG) |
| `label-sizes` | visual enum — `size` | one surface per `['small','large']`; each surface's `text` = the size name | yes (one PNG) |

Single-axis: each fixture isolates one prop; no semantic coupling among Label's props, so no
combined fixtures.

### Prop-coverage map

| adapter prop | covered by |
|---|---|
| `text` | `label` (literal) + `label-bound` (bound) |
| `variant` | `label-variants` |
| `size` | `label-sizes` |

Every carried prop appears in the coverage map, each via a baselined fixture.

---

## Agent section

Omitted. Label emits no `event`-shaped `Action` (it emits no `Action` at all), so per the
Orchestration skip rule ("a component with no event-shaped action gets no agent section") there
is no agent surface to design.
