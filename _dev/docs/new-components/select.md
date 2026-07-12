# Select

- **Official documentation URL:** https://primer.style/components/select
- **Real prop surface resolved from:** `@primer/react` installed type declarations at
  `node_modules/@primer/react/dist/Select/Select.d.ts` (+ `internal/components/TextInputWrapper.d.ts`
  for the wrapper props) and the implementation at `node_modules/@primer/react/dist/Select/Select.js`
  (the authority on what is actually wired). `SelectProps = Omit<Omit<React.ComponentProps<'select'>,
  'size'> & Omit<StyledWrapperProps, 'variant' | 'contrast'>, 'multiple' | 'hasLeadingVisual' |
  'hasTrailingVisual' | 'as'> & { placeholder?: string }`. The implementation explicitly destructures
  and wires `block`, `children`, `className`, `defaultValue`, `disabled`, `placeholder`, `size`,
  `required`, `validationStatus`; `value`/`onChange`/`name` and the rest pass through `...rest` onto
  the native `<select>`. `monospace` is present in the type but never forwarded to the wrapper, so it
  has no effect. `contrast` is omitted from the type. `placeholder` renders a leading `<option
  value="">`; when `required`, that option is `disabled` + `hidden`. `single-select only` (`multiple`
  omitted).
- **Component-level description (→ `catalog.json` `description`):** A dropdown control for choosing a
  single option from a predefined list.

> `Select` ships as a compound family, mirroring Primer: `Select.Option` and `Select.OptGroup` are
> shipped as sibling catalog leaves in the same 6.31 sub-task, with their own decision docs at
> `select-option.md` and `select-optgroup.md`. `Select`'s `children` slot references
> `Select.Option` / `Select.OptGroup`; it uses the `ChildList` container-slot convention established
> in `stack.md`.

First form input shipped as a compound family: `value` is two-way bound — the client writes the
user's selection back to the bound data-model path (the binder's auto-generated setter; no new
infrastructure). There is no client→server message for a data-model write; the agent reads the
selection from a later event's `context` (e.g. a submit button).

---

## Adapter section

### Prop-surface table

| prop | decision | synthetic? | A2UI type | description |
|---|---|---|---|---|
| `children` | carry (optional) | yes | `ChildList` | The selectable options and option groups shown in the dropdown. |
| `value` | carry (required) | no | `DynamicString` | The selected option's value. Two-way bound: a user's selection writes the new value back to the bound data-model path. |
| `placeholder` | carry | no | `DynamicString` | Text shown as a non-selectable leading option before any choice is made. |
| `disabled` | carry | no | `DynamicBoolean` | Whether the control is inactive and cannot be changed. |
| `required` | carry | no | `z.boolean()` | Whether a selection must be made; conveyed to assistive technologies. |
| `validationStatus` | carry | no | `z.enum(['error','success'])` | Validity state conveyed to assistive technologies and shown visually (a coloured border). |
| `block` | carry | no | `z.boolean()` | Whether the control expands to fill the container's full width. |
| `size` | carry | no | `z.enum(['small','medium','large'])` | The control's size. |
| `accessibility` | carry | no | `AccessibilityAttributes` | Accessibility label/description for assistive technologies — the control renders no visible label of its own. |

`children` is `carry (optional)` — faithful to Primer's optional `children` type. `value` is
`carry (required)` — the primary state channel, two-way bound (the `Checkbox` `checked` analog).

### Functions

None. `Select` carries no `Action` — the selection *is* the two-way write to `value`'s bound path —
and needs no local function.

### Dropped / deferred props

| prop | reason |
|---|---|
| `defaultValue` | Dropped: uncontrolled mode; the data model owns state in A2UI (initial selection is the bound path's value or a literal). |
| `onChange` | Represented by the two-way binding on `value`; no separate protocol prop. Deferred: an optional `action` only if a future flow needs selection-initiated agent round-trips. |
| `monospace` | Dropped: implementation-dead — present in the type but never forwarded to the wrapper, so it has no effect. |
| `contrast` | Not a prop: omitted from the `Select` type (`Omit<StyledWrapperProps, 'contrast'>`). |
| `variant`, `width`, `minWidth`, `maxWidth` | Dropped: deprecated aliases. |
| `className`, `style` | Dropped: styling passthroughs; no A2UI representation. |
| `name`, `id`, `autoFocus`, `form`, `data-*`, and the rest of the non-`aria-*` native `<select>` spread | Dropped: no A2UI representation. |
| *(visible label — not a prop)* | Deferred: visible labeling ships with `FormControl` / `FormControl.Label` (6.47); revisit `Select`'s UI wiring then. `accessibility.label` covers the accessible name meanwhile. |

---

## Client section

Options are `Select.Option` / `Select.OptGroup` leaves (shipped in the same sub-task). `Select`'s own
fixtures use flat `Select.Option` children; option-group nesting is exercised in `Select.OptGroup`'s
fixtures.

### Fixture table

| fixture | exercises (coverage axis) | component state / canned values | baselined? |
|---|---|---|---|
| `select` | default render — static `ChildList` + `value` literal | `children: ['o1','o2','o3']` → 3 `Select.Option` ("Bug"/"Feature"/"Docs", values `bug`/`feature`/`docs`); `value: "feature"` (Feature shown selected) | yes |
| `select-children-template` | content — dynamic template (options from a bound array) | `children: {componentId:'opt', path:'/labels'}`; `opt` = `Select.Option` with `text:{path:'./label'}`, `value:{path:'./value'}`; data model `/labels = [{label:'Bug',value:'bug'},{label:'Feature',value:'feature'},{label:'Docs',value:'docs'}]` | yes |
| `select-bound` | `value` path binding + two-way write-back | `value:{path:'/selected'}`, data model `/selected:'bug'`; interaction test: choose "Docs" → `/selected` becomes `'docs'` and the control re-renders | no — behavior proven in the interaction test (per `checkbox-bound`) |
| `select-placeholder` | visually-distinct state — `placeholder` leading option | `placeholder:'Choose a label'`, `value:''` (placeholder shown), 3 Options | yes |
| `select-disabled` | visually-distinct state — `disabled` | `disabled:true`, `value:'feature'`, 3 Options | yes |
| `select-validation` | visual enum — `validationStatus` | gallery: one surface per `['error','success']`; each 3 Options | yes (one PNG) |
| `select-block` | visually-distinct state — `block` full-width | `block:true` in a wide container, 3 Options | yes |
| `select-size` | visual enum — `size` | gallery: one surface per `['small','medium','large']`; each 3 Options | yes (one PNG) |

### Prop-coverage map

| adapter prop | covered by |
|---|---|
| `children` | `select` (static array) + `select-children-template` (dynamic template) |
| `value` | `select` (literal) + `select-bound` (bound + two-way write-back) |
| `placeholder` | `select-placeholder` |
| `disabled` | `select-disabled` |
| `required` | render-test assertion: select `required` / `aria-required="true"` |
| `validationStatus` | `select-validation` (+ render-test assertion: `error` → `aria-invalid="true"`) |
| `block` | `select-block` |
| `size` | `select-size` |
| `accessibility` | render-test assertion: `aria-label` / `aria-description` on the select |

---

## Agent section

Omitted. `Select` emits no `event`-shaped `Action` (no `Action` at all — the selection is the
two-way data-model write), so per the Orchestration skip rule there is no agent surface to design.
