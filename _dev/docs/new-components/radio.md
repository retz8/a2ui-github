# Radio

- **Official documentation URL:** https://primer.style/components/radio
- **Real prop surface resolved from:** `@primer/react` installed type declarations at
  `node_modules/@primer/react/dist/Radio/Radio.d.ts` —
  `RadioProps = { value (required), name?, disabled?, checked?, ref?, required? } & InputHTMLAttributes<HTMLInputElement>`,
  reconciled against `Radio.js`: renders a bare native `<input type="radio">` — no label, no
  children (labels come from `FormControl`); consumes `RadioGroupContext` for group
  `name`/`onChange` when nested; warns at runtime if no `name` resolves from prop or context;
  no prop defaults in code. The spread brings `onChange` (carried as the synthetic `action`)
  and `defaultChecked` (doc-listed, uncontrolled mode).
- **Component-level description (→ `catalog.json` `description`):** A radio input for
  selecting a single option from a mutually exclusive group.

---

## Adapter section

### Prop-surface table

| prop | decision | synthetic? | A2UI type | description |
|---|---|---|---|---|
| `value` | carry (required) | no | `z.string()` | A unique value identifying this option within its group; never shown to the user. |
| `name` | carry | no | `z.string()` | The group key; radios sharing a `name` are mutually exclusive. |
| `checked` | carry | no | `DynamicBoolean` | Whether this radio is selected. |
| `disabled` | carry | no | `DynamicBoolean` | Whether the radio is disabled and cannot be selected. |
| `required` | carry | no | `z.boolean()` | Whether a selection in this radio's group must be made before the containing form can be submitted. |
| `action` | carry | yes (← `onChange`) | `Action` | The action performed when this radio becomes selected. |
| `accessibility` | carry | no | `AccessibilityAttributes` | Accessibility label/description for assistive technologies; a radio renders no visible label of its own. |

### Functions

| name | args | returnType | description |
|---|---|---|---|
| `consoleLog` | `message: string` (The message to log.) | `void` | Logs a message. A local client-side effect invoked from the radio's `functionCall` action. Already registered in the catalog — no new registration. |

### Dropped/deferred props

| prop | reason |
|---|---|
| `defaultChecked` | Uncontrolled-mode alias of `checked`; A2UI has no uncontrolled mode — initial selection is expressed through `checked` (literal or bound initial data-model value). |
| `ref` | Imperative escape hatch; no A2UI representation. |
| `className`, `style` | Styling passthroughs; no A2UI representation. |
| `type`, `tabIndex`, `form`, `data-*`, and the rest of the non-`aria-*` `InputHTMLAttributes<HTMLInputElement>` spread | Dropped: no A2UI representation. (`type` is forced to `"radio"` by the implementation; the interaction slot `onChange` is carried as the synthetic `action`; the `aria-*` slice is carried as `accessibility`.) |

---

## Client section

### Fixture table

| fixture | exercises (coverage axis) | component state / canned values | baselined? |
|---|---|---|---|
| `radio` | default render (unchecked) | `value: "option-1"`, `name: "radio-demo"`; all else default | yes |
| `radio-checked` | visually-distinct state — `checked` (literal) | `value: "option-1"`, `name: "radio-demo"`, `checked: true` | yes |
| `radio-disabled` | visually-distinct state — `disabled` | two surfaces: disabled-unchecked (`disabled: true`) and disabled-checked (`disabled: true`, `checked: true`); `value: "option-1"`, `name: "radio-demo"` | yes (one PNG) |
| `radio-fn` | interaction — functionCall path | `value: "option-1"`, `name: "radio-fn"`; `action: functionCall consoleLog {message: "radio-fn selected"}` | yes |
| `radio-event` | interaction — event path + bound `checked` (path-binding proof) | radio: `value: "option-1"`, `name: "radio-event"`, `checked: {path: "/selected"}`; sibling `Text` id `status` ("Click to select"); data model `{selected: false}`; `action: event {name: "select", context: {value: "option-1"}}` | yes |

Single-axis throughout; the one coupling (`radio-event`: event + bound `checked` + sibling
`status` Text) is the agent-visibility coupling realized from the agent section.

### Prop-coverage map

| adapter prop | covered by |
|---|---|
| `value` | render-test assertion (non-visual): set in every fixture; asserts the native input's `value` attribute |
| `name` | render-test assertion (non-visual): asserts the native input's `name` attribute |
| `checked` | `radio-checked` (literal) + `radio-event` (bound `{path: "/selected"}` — the path-binding proof) |
| `disabled` | `radio-disabled` (both visual arms) |
| `required` | render-test assertion (non-visual): `required: true` asserts the native `required` attribute |
| `action` | `radio-fn` (functionCall) + `radio-event` (event) |
| `accessibility` | render-test assertion (non-visual) |

---

## Agent section

Radio's `action` accepts the `event` shape, so an agent section applies. One event name is
emitted by the paired client event fixture: `select`.

### Event-response table

| event | response messages (ordered, with canned values) | visibility coupling (client fixture · bound prop ← path · initial value) |
|---|---|---|
| `select` | 1. `updateDataModel {path: '/selected', value: true}` · 2. `updateComponents [{id: 'status', component: 'Text', text: '✅ Selected — server received "option-1"'}]` (surfaceId echoed — stamped at runtime, not authored) | `radio-event` · `checked ← /selected` · initial `/selected = false` |

The text swap (`updateComponents`) is self-visible; the `/selected` write
(`updateDataModel`) is visible only through the `checked ← /selected` coupling — `checked` is
a controlled binding, so the click alone never checks the radio; the dot appears because the
server's write lands in the data model, which is the half that proves two-way data binding on
the radio itself.
