# RadioGroup

- **Official documentation URL:** https://primer.style/components/radio-group
- **Real prop surface resolved from:** `@primer/react` (v38.28.0) type declarations at
  `node_modules/@primer/react/dist/RadioGroup/RadioGroup.d.ts` —
  `RadioGroupProps = { onChange?, name (required) } & CheckboxOrRadioGroupProps`
  (`internal/components/CheckboxOrRadioGroup/CheckboxOrRadioGroup.d.ts`:
  `className?`, `aria-labelledby?`, `disabled?`, `id?`, `required?`, `data-component?`), plus its
  three slot subcomponents (`Label`/`Caption`/`Validation` = the shared
  `CheckboxOrRadioGroup{Label,Caption,Validation}` types). The root's `children` are slot-scanned by
  the implementation: a `RadioGroup.Label`, an optional `RadioGroup.Caption` /
  `RadioGroup.Validation`, and the radio inputs. The group provides the shared `name` and the
  selection-change `onChange` to its radios via `RadioGroupContext`; clicking any radio fires the
  group's `onChange` with the newly-selected value.
- **Component-level description (→ `catalog.json` `description`):** Groups a set of radio inputs
  under a shared label so the user selects a single option from the group.

> `RadioGroup` ships as a **compound family** (6.49), mirroring the component library one-to-one:
> the root plus its three subcomponents are each shipped as a sibling catalog leaf in this same
> sub-task, each with its own decision doc:
>
> - `radio-group-label.md` (`RadioGroup.Label`) · `radio-group-caption.md` (`RadioGroup.Caption`) ·
>   `radio-group-validation.md` (`RadioGroup.Validation`)
>
> Catalog schema names are PascalCase-concatenated: `RadioGroup`, `RadioGroupLabel`,
> `RadioGroupCaption`, `RadioGroupValidation`.
>
> **Cross-component note.** `RadioGroup.Label/Caption/Validation` are the *same underlying Primer
> components* (`CheckboxOrRadioGroup{Label,Caption,Validation}`) as `CheckboxGroup`'s (6.48). Per the
> one-to-one translation of the **documented** compound members, `CheckboxGroup` ships its own
> `CheckboxGroupLabel`/etc. schemas rather than sharing these — the same way `FormControl.Label` and
> `RadioGroup.Label` are distinct leaves though structurally kin.

## Rendering & composition

- **No new infra.** RadioGroup renders through the normal adapter→renderer path. Its `children` are
  slot-scanned exactly as `FormControl`'s / `Dialog`'s are (`CommonSchemas.ChildList`): the renderer
  passes the real Primer subcomponents (`RadioGroup.Label` / `.Caption` / `.Validation`) and the
  radio inputs through as children, and Primer's own slot machinery does the label/caption/validation
  association and the `RadioGroupContext` wiring (shared `name` + selection `onChange`).
- **The label↔group association is automatic** via the `<fieldset>`/`<legend>` + context — it does
  **not** use `aria-labelledby`. `aria-labelledby` is only the escape hatch for labeling the group
  with an element *other than* `RadioGroup.Label`.
- **RadioGroup cannot be tested in isolation** — it wraps a set of radios. Fixtures compose the
  realistic shape from the official doc: `RadioGroup.Label` + each `Radio` wrapped in its own
  `FormControl` with a `FormControl.Label`. The group owns the interaction (child radios are plain;
  the group's `onChange`/`action` fires on any selection via context).
- **The subcomponents emit no `Action`.** Only the root carries an `action` (← `onChange`); the
  label/caption/validation leaves are pure content, so their agent sections are omitted.

---

## Adapter section

### Prop-surface table

| prop | decision | synthetic? | A2UI type | description |
|---|---|---|---|---|
| `children` | carry (required) | yes | `CommonSchemas.ChildList` | Slot-scanned: the group's label, an optional caption / validation message, and the radio inputs. |
| `name` | carry (required) | no | `z.string()` | The group key; the radios sharing this name are mutually exclusive. |
| `action` | carry | yes (← `onChange`) | `Action` | The action performed when the selected radio in the group changes. |
| `disabled` | carry | no | `DynamicBoolean` | Whether the whole group is disabled and no option can be selected. |
| `required` | carry | no | `z.boolean()` | Whether a selection must be made before the containing form can be submitted. |
| `aria-labelledby` | carry | no | `z.string()` | Points the group at an external element (by id) that labels it for assistive technologies; used when the group is labeled by something other than its own `RadioGroup.Label`. |

`required` is carried as fixed authoring-time config (`z.boolean()`), matching the sibling
`FormControl.required`. `aria-labelledby` is carried as a literal idref string (`z.string()`) — the
faithful literal translation of `aria-labelledby?: string`; `AccessibilityAttributes` does not fit
(it carries `aria-label`/`aria-description` strings, not an idref), and a `ComponentId`
label-by-reference would need cross-component idref wiring the renderer does not expose. RadioGroup
carries no `accessibility` prop: `aria-labelledby` is its only aria surface, and the accessible name
comes from `RadioGroup.Label`.

### Functions

| name | args | returnType | description |
|---|---|---|---|
| `consoleLog` | `message: string` (The message to log.) | `void` | Logs a message. A local client-side effect invoked from the group's `functionCall` action. Already registered in the catalog — no new registration. |

### Dropped / deferred props

| prop | reason |
|---|---|
| `id` | Dropped: the framework identity/envelope field — the message processor consumes it as the component's id (`{id, component, ...properties}`), so it can never reach the props object, and `catalog.parity.test.ts` enforces this. Association still works via the implementation's generated id. |
| `data-component` | Dropped: internal Primer identity marker; no A2UI representation. |
| `className`, `style` | Dropped: styling passthroughs; no A2UI representation. |

---

## Client section

Fixtures exercise the **assembled family** — a `RadioGroup` labeled by `RadioGroup.Label`, wrapping
a set of `Radio` inputs each inside its own `FormControl` + `FormControl.Label` (the shape from the
official doc). This is the whole family's fixture set; each subcomponent doc's client section points
back here.

### Fixture table

| fixture | exercises (coverage axis) | component state / canned values | baselined? |
|---|---|---|---|
| `radiogroup` | baseline assembly — Label + FormControl-wrapped radios, one selected | `RadioGroup(name:"choices") > [RadioGroup.Label("Choices"), FormControl>[Radio(value:"one"), FormControl.Label("Choice one")], FormControl>[Radio(value:"two", checked:true), FormControl.Label("Choice two")], FormControl>[Radio(value:"three"), FormControl.Label("Choice three")]]` | yes |
| `radiogroup-label-bound` | Label `text` path binding (the family's shared `DynamicString` channel) | `RadioGroup.Label` `text: {path:"/labelText"}`, data model `{labelText:"Choices"}` + the radios | no — pixels identical to `radiogroup`; binding proven in the render test |
| `radiogroup-caption` | Caption `text` | baseline + `RadioGroup.Caption("Select one option")` | yes |
| `radiogroup-validation` | Validation `text` + `variant` enum | gallery, 2 surfaces: `variant:"error"` ("Please select an option") / `variant:"success"` ("Looks good"); each `RadioGroup.Label("Choices")` + radios + `RadioGroup.Validation` | yes (one PNG) |
| `radiogroup-disabled` | root `disabled` | `disabled:true`; Label + radios all dimmed | yes |
| `radiogroup-label-visually-hidden` | Label `visuallyHidden` | `RadioGroup.Label` `visuallyHidden:true` ("Choices"); legend gone visually, radios remain | yes |
| `radiogroup-fn` | interaction — functionCall path | group `action: functionCall consoleLog {message:"radiogroup-fn changed"}`; Label + radios | yes |
| `radiogroup-event` | interaction — event path + bound `disabled` (agent-visibility coupling) | group `action: event {name:"select", context:{}}`; group `disabled: {path:"/locked"}`, data model `{locked:false}`; sibling `Text` id `status` ("Select an option"); Label + radios | yes |
| `radiogroup-full` | completeness — all slots together | `RadioGroup.Label("Choices")` + `RadioGroup.Caption("Select one option")` + `RadioGroup.Validation(variant:"error", "Please select an option")` + radios | yes |

Single-axis by default; `radiogroup-event`'s coupling (event + bound `disabled` + sibling `status`
Text) is the agent-visibility coupling realized from the agent section, and `radiogroup-full` is the
deliberate all-slots-together completeness surface (mirroring `formcontrol-full`).

### Prop-coverage map

| adapter prop | covered by |
|---|---|
| `RadioGroup.children` | every fixture (the composition) |
| `RadioGroup.name` | render-test assertion (non-visual): asserts the radios share the group `name` |
| `RadioGroup.action` | `radiogroup-fn` (functionCall) + `radiogroup-event` (event) |
| `RadioGroup.disabled` | `radiogroup-disabled` (literal) + `radiogroup-event` (bound `{path:"/locked"}` — the binding proof) |
| `RadioGroup.required` | render-test assertion (non-visual): `required:true` asserts the `VisuallyHidden` ", required" annotation |
| `RadioGroup.aria-labelledby` | render-test assertion (non-visual): asserts the fieldset's `aria-labelledby` |

(Subcomponent props map back to these fixtures — see each subcomponent doc's coverage map.)

---

## Agent section

RadioGroup's `action` accepts the `event` shape, so an agent section applies. One event name is
emitted by the paired client event fixture: `select`. The group's runtime "which radio" value cannot
be captured into the statically-authored event `context`, so the event honestly signals "selection
changed" (context `{}`) and the response is a generic acknowledgment, not a per-value branch.

### Event-response table

| event | response messages (ordered, with canned values) | visibility coupling (client fixture · bound prop ← path · initial value) |
|---|---|---|
| `select` | 1. `updateDataModel {path: '/locked', value: true}` · 2. `updateComponents [{id: 'status', component: 'Text', text: '✅ Selection received'}]` (surfaceId echoed — stamped at runtime, not authored) | `radiogroup-event` · `disabled ← /locked` · initial `/locked = false` |

The `status` Text swap (`updateComponents`) is self-visible; the `/locked` write (`updateDataModel`)
is visible only through the `disabled ← /locked` coupling — after selecting, the server locks the
group (it disables), which is the half that proves two-way data binding on the RadioGroup itself
(mirroring Button's `disabled ← /submitted`).
