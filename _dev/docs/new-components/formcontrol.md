# FormControl

- **Official documentation URL:** https://primer.style/components/form-control
- **Real prop surface resolved from:** `@primer/react` (v38.28.0) type declarations at
  `node_modules/@primer/react/dist/FormControl/FormControl.d.ts` (`FormControlProps`) and its
  subcomponent declarations (`FormControlLabel.d.ts`, `FormControlCaption.d.ts`,
  `_FormControlValidation.d.ts`, `FormControlLeadingVisual.d.ts`). The root's `children` are
  slot-scanned by the implementation (`useSlots`): a `FormControl.Label`, an optional
  `FormControl.Caption` / `FormControl.Validation` / `FormControl.LeadingVisual`, and the
  wrapped input control. Label/caption/validation association (`htmlFor`, the input's
  `aria-describedby`) is wired internally and works whether or not `id` is set (FormControl
  falls back to `useId`).
- **Component-level description (→ `catalog.json` `description`):** Wraps a single form input
  with its visible label, optional helper caption, and optional validation message, laying them
  out and associating them for assistive technologies.

> `FormControl` ships as a **compound family** (6.47), mirroring the component library
> one-to-one: the root plus its four subcomponents are each shipped as a sibling catalog leaf in
> this same sub-task, each with its own decision doc:
>
> - `formcontrol-label.md` (`FormControl.Label`) · `formcontrol-caption.md`
>   (`FormControl.Caption`) · `formcontrol-validation.md` (`FormControl.Validation`) ·
>   `formcontrol-leadingvisual.md` (`FormControl.LeadingVisual`)
>
> Catalog schema names are PascalCase-concatenated: `FormControl`, `FormControlLabel`,
> `FormControlCaption`, `FormControlValidation`, `FormControlLeadingVisual`.

## Rendering & composition

- **No new infra.** FormControl renders through the normal adapter→renderer path. Its `children`
  are slot-scanned exactly as `Dialog`'s are (`CommonSchemas.ChildList`): the renderer passes the
  real Primer subcomponents (`FormControl.Label` / `.Caption` / `.Validation` / `.LeadingVisual`)
  and the wrapped input through as children, and Primer's own `useSlots` does the label/caption/
  validation association and layout.
- **FormControl cannot be tested in isolation** — it wraps an input. Fixtures wrap a real
  **`TextInput`** (vertical/default cases) and a real **`Checkbox`** (horizontal layout +
  leading-visual cases, which Primer's `layout: horizontal` and `FormControl.LeadingVisual`
  exist for). This is the label-wiring story deferred to 6.47 by `TextInput` / `Checkbox` /
  `Select` / `Textarea` in `deferred-catalog-work.md`.
- **The whole family emits no `Action`/event.** FormControl is a pure wrapper; all state lives in
  the two-way binding on the wrapped input (TextInput's `value`, Checkbox's `checked`). Every
  leaf's agent section is therefore omitted.

---

## Adapter section

### Prop-surface table

| prop | decision | synthetic? | A2UI type | description |
|---|---|---|---|---|
| `children` | carry (required) | yes | `CommonSchemas.ChildList` | Slot-scanned: the label, an optional caption / validation / leading visual, and the wrapped input control. |
| `disabled` | carry | no | `DynamicBoolean` | Whether the control is inactive and cannot be edited. |
| `layout` | carry | no | `z.enum(['horizontal','vertical']) (default: "vertical")` | Direction the content flows; horizontal is used for checkbox and radio inputs. |
| `required` | carry | no | `z.boolean()` | Whether a value is required before the form can be submitted; drives the label's required indicator and the input's required semantics. |
| `id` | carry | no | `z.string()` | The unique identifier for this control, used to associate its label, caption, and validation text with the input. |

`required` is carried as fixed authoring-time config (`z.boolean()`), matching the sibling
`TextInput.required`. Additive change to `DynamicBoolean` if a conditional-required flow (a field
made required based on other data-model values) ever appears — the enum/boolean arm stays valid.

### Functions

None. The family carries no `Action` and needs no local function.

### Dropped / deferred props

| prop | reason |
|---|---|
| `className`, `style` | Dropped: styling passthroughs; no A2UI representation. |

---

## Client section

Fixtures exercise the **assembled family** — a `FormControl` wrapping a real input, with the
subcomponents as slot content (the way `Dialog.Title` is exercised inside `Dialog` fixtures).
`TextInput` is the wrapped input for vertical/default cases; `Checkbox` for the horizontal-layout
and leading-visual cases. This is the whole family's fixture set; each subcomponent doc's client
section points back here.

### Fixture table

| fixture | exercises (coverage axis) | component state / canned values | baselined? |
|---|---|---|---|
| `formcontrol` | baseline assembly — Label + input | `FormControl > [FormControl.Label(text:"Repository name"), TextInput(value:"octocat")]`, `layout` default (vertical) | yes |
| `formcontrol-label-bound` | Label `text` path binding (the family's shared `DynamicString` channel) | `FormControl.Label` `text: {path:"/labelText"}`, data model `{labelText:"Repository name"}` + `TextInput` | no — pixels identical to `formcontrol`; binding proven in the render test |
| `formcontrol-caption` | Caption `text` | `FormControl.Label("Repository name")` + `FormControl.Caption(text:"Choose a unique repository name")` + `TextInput(value:"octocat")` | yes |
| `formcontrol-validation` | Validation `text` + `variant` enum | gallery, 2 surfaces: `variant:"error"` ("That name is already taken") / `variant:"success"` ("Name is available"); each `FormControl.Label("Repository name")` + `TextInput` + `FormControl.Validation` | yes (one PNG) |
| `formcontrol-required` | root `required` × Label `requiredIndicator` | mini-gallery, 2 surfaces: `required:true` (asterisk shown) / `required:true` + `FormControl.Label` `requiredIndicator:false` (suppressed); `Label("Repository name")` + `TextInput` | yes (one PNG) |
| `formcontrol-disabled` | root `disabled` | `disabled:true`; `Label("Repository name")` + `TextInput(value:"octocat")` (both dimmed) | yes |
| `formcontrol-label-visually-hidden` | Label `visuallyHidden` | `FormControl.Label` `visuallyHidden:true` ("Repository name") + `TextInput(value:"octocat")` (label gone visually, input remains) | yes |
| `formcontrol-layout` | root `layout` enum | gallery, 2 surfaces: `layout:"vertical"` (`Label` + `TextInput`) / `layout:"horizontal"` (`Label("Enable notifications")` + `Checkbox`) | yes (one PNG) |
| `formcontrol-leading-visual` | LeadingVisual `child` slot | `layout:"horizontal"` `FormControl > [FormControl.LeadingVisual(child→Icon `BellIcon`), FormControl.Label("Enable notifications"), Checkbox]` | yes |
| `formcontrol-full` | complete stack together | `FormControl.Label("Repository name")` + `FormControl.Caption("Choose a unique repository name")` + `FormControl.Validation(variant:"error", "That name is already taken")` + `TextInput(value:"octocat")` | yes |

Single-axis by default; `formcontrol-required` couples root `required` with Label
`requiredIndicator` (the indicator only exists when `required` is set), and `formcontrol-full`
is the deliberate all-slots-together completeness surface.

### Prop-coverage map

| adapter prop | covered by |
|---|---|
| `FormControl.children` | every fixture (the composition) |
| `FormControl.disabled` | `formcontrol-disabled` |
| `FormControl.layout` | `formcontrol-layout` (gallery) |
| `FormControl.required` | `formcontrol-required` (mini-gallery) |
| `FormControl.id` | render-test assertion: input `id` set, label `htmlFor` matches |

(Subcomponent props map back to these fixtures — see each subcomponent doc's coverage map.)

---

## Agent section

Omitted. FormControl emits no `event`-shaped `Action` (no `Action` at all — it is a pure
wrapper; state is the two-way write on the wrapped input's bound value), so per the Orchestration
skip rule there is no agent surface to design.
