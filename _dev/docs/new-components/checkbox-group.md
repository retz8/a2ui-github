# CheckboxGroup

- **Official documentation URL:** https://primer.style/components/checkbox-group
- **Real prop surface resolved from:** `@primer/react` (v38.28.0) type declarations at
  `node_modules/@primer/react/dist/CheckboxGroup/CheckboxGroup.d.ts` — `CheckboxGroupProps =
  { onChange?: (selected: string[], e?) => void } & CheckboxOrRadioGroupProps` (the shared
  `internal/components/CheckboxOrRadioGroup` type, supplying `className`, `aria-labelledby`,
  `disabled`, `id`, `required`, `data-component`) — and its subcomponent declarations
  (`CheckboxOrRadioGroupLabel.d.ts`, `CheckboxOrRadioGroupCaption.d.ts`,
  `CheckboxOrRadioGroupValidation.d.ts`). The root's `children` are slot-scanned by the
  implementation: a `CheckboxGroup.Label`, an optional `CheckboxGroup.Caption` /
  `CheckboxGroup.Validation`, and the checkbox inputs. Label/caption/validation association is
  wired internally via the group's generated `id`.
- **Component-level description (→ `catalog.json` `description`):** Groups a set of related
  checkboxes under a shared label, optional helper caption, and optional validation message,
  laying them out and associating them for assistive technologies.

> `CheckboxGroup` ships as a **compound family** (6.48), mirroring the component library
> one-to-one — the same pattern as the `FormControl` family (6.47). The root plus its three
> subcomponents are each shipped as a sibling catalog leaf in this same sub-task, each with its
> own decision doc:
>
> - `checkbox-group-label.md` (`CheckboxGroup.Label`) · `checkbox-group-caption.md`
>   (`CheckboxGroup.Caption`) · `checkbox-group-validation.md` (`CheckboxGroup.Validation`)
>
> Catalog schema names are PascalCase-concatenated: `CheckboxGroup`, `CheckboxGroupLabel`,
> `CheckboxGroupCaption`, `CheckboxGroupValidation`. (No `LeadingVisual` — this family has none.)

## Rendering & composition

- **No new infra.** CheckboxGroup renders through the normal adapter→renderer path. Its
  `children` are slot-scanned exactly as `FormControl`'s and `Dialog`'s are
  (`CommonSchemas.ChildList`): the renderer passes the real Primer subcomponents
  (`CheckboxGroup.Label` / `.Caption` / `.Validation`) and the checkbox inputs through as
  children, and Primer's own slot logic does the association and layout.
- **Composed with `FormControl` for realistic labeling.** A group's individual checkbox options
  each carry their own visible label, which in Primer is done by wrapping each `Checkbox` in a
  `FormControl` (`FormControl > [Checkbox, FormControl.Label]`, horizontal layout). Fixtures
  therefore compose `CheckboxGroup` over `FormControl`-wrapped `Checkbox` options — the realistic
  form shape — not bare checkboxes. (Uses the shipped `FormControl` (6.47) and `Checkbox` (6.16)
  leaves; no new infra.)
- **The whole family emits no `Action`/event.** CheckboxGroup is a pure grouping wrapper; the
  selection state lives entirely in each child `Checkbox`'s two-way `checked` binding (per
  `checkbox.md`). The group-level `onChange` is dropped on that basis (see below). Every leaf's
  agent section is therefore omitted.

---

## Adapter section

### Prop-surface table

| prop | decision | synthetic? | A2UI type | description |
|---|---|---|---|---|
| `children` | carry (required) | yes | `CommonSchemas.ChildList` | Slot-scanned: the group label, an optional caption / validation message, and the checkbox inputs. |
| `disabled` | carry | no | `DynamicBoolean` | Whether the whole group is inactive and its checkboxes cannot be toggled. |
| `required` | carry | no | `z.boolean()` | Whether a selection is required before the form can be submitted. |

`required` is carried as fixed authoring-time config (`z.boolean()`), matching the sibling
`FormControl.required`. Additive change to `DynamicBoolean` if a conditional-required flow ever
appears — the boolean arm stays valid.

### Functions

None. The family carries no `Action` and needs no local function.

### Dropped / deferred props

| prop | reason |
|---|---|
| `onChange` | Represented by the two-way `checked` binding on each child `Checkbox` (the group's selected set is derivable from those paths); no separate protocol prop. Deferred: add a group-level `action` only if a future flow needs selection-change agent round-trips — the same deferral `Checkbox.onChange` records. |
| `id` | Dropped: `id` is the framework identity/envelope field — the message processor consumes it as the component's id (`{id, component, ...properties}`), so it can never reach the props object, and `catalog.parity.test.ts` enforces this. Association still works via the group's `id` fallback. |
| `aria-labelledby` | Dropped: association identifier pointing at an external label element; no self-contained A2UI representation. Labeling is done by `CheckboxGroup.Label`. |
| `className`, `data-component` | Dropped: styling / test-hook passthroughs; no A2UI representation (categorical). |

---

## Client section

Fixtures exercise the **assembled family** — a `CheckboxGroup` over `FormControl`-wrapped
`Checkbox` options (the realistic form shape; each option carries its own visible label via
`FormControl` / `FormControl.Label`), with the subcomponents as slot content. This is the whole
family's fixture set; each subcomponent doc's client section points back here.

### Fixture table

| fixture | exercises (coverage axis) | component state / canned values | baselined? |
|---|---|---|---|
| `checkbox-group` | baseline assembly + interactive two-way write | `CheckboxGroup > [CheckboxGroup.Label("Notifications"), FormControl>[Checkbox(checked:{path:"/comments"}), FormControl.Label("Comments")], FormControl>[Checkbox(checked:{path:"/prs"}), FormControl.Label("Pull requests")], FormControl>[Checkbox(checked:{path:"/mentions"}), FormControl.Label("Mentions")]]`; data model `{comments:true, prs:false, mentions:false}`; interaction test: click "Pull requests" → `/prs` becomes `true` and re-renders checked | yes |
| `checkbox-group-label-bound` | Label `text` path binding (the family's shared `DynamicString` channel) | `CheckboxGroup.Label` `text:{path:"/groupLabel"}`, data model `{groupLabel:"Notifications"}` + the option set | no — pixels identical to `checkbox-group`; binding proven in the render test |
| `checkbox-group-caption` | Caption `text` | `CheckboxGroup.Label("Notifications")` + `CheckboxGroup.Caption("Choose which events email you")` + option set | yes |
| `checkbox-group-validation` | Validation `text` + `variant` enum | gallery, 2 surfaces: `variant:"error"` ("Select at least one option") / `variant:"success"` ("Preferences saved"); each `CheckboxGroup.Label("Notifications")` + option set | yes (one PNG) |
| `checkbox-group-disabled` | root `disabled` | `disabled:true`; `CheckboxGroup.Label("Notifications")` + option set (whole group dimmed) | yes |
| `checkbox-group-label-visually-hidden` | Label `visuallyHidden` | `CheckboxGroup.Label` `visuallyHidden:true` ("Notifications") + option set (legend gone visually, options remain) | yes |
| `checkbox-group-full` | complete stack together | `CheckboxGroup.Label("Notifications")` + `CheckboxGroup.Caption("Choose which events email you")` + `CheckboxGroup.Validation(variant:"error", "Select at least one option")` + option set | yes |

Single-axis by default; `checkbox-group-full` is the deliberate all-slots-together completeness
surface. The baseline `checkbox-group` fixture carries the interactive two-way write (each
option's `Checkbox.checked` bound to a data-model path, exercised through a real group).

### Prop-coverage map

| adapter prop | covered by |
|---|---|
| `CheckboxGroup.children` | every fixture (the composition) |
| `CheckboxGroup.disabled` | `checkbox-group-disabled` |
| `CheckboxGroup.required` | render-test assertion (ARIA-only: a `VisuallyHidden ", required"` is present when set — no visible indicator) |

(Subcomponent props map back to these fixtures — see each subcomponent doc's coverage map.)

---

## Agent section

Omitted. CheckboxGroup emits no `event`-shaped `Action` (no `Action` at all — it is a pure
grouping wrapper; selection state is the two-way write on each child `Checkbox`'s bound
`checked`), so per the Orchestration skip rule there is no agent surface to design.
