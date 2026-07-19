# CheckboxGroup.Validation

- **Part of the `CheckboxGroup` compound family** (6.48) — see `checkbox-group.md` for the family
  note, the rendering/composition conventions, and the component-level frame.
- **Official documentation URL:** https://primer.style/components/checkbox-group
- **Real prop surface resolved from:** `@primer/react` (v38.28.0) type declarations at
  `node_modules/@primer/react/dist/internal/components/CheckboxOrRadioGroup/CheckboxOrRadioGroupValidation.d.ts`
  (`CheckboxOrRadioGroupValidationProps = { variant: FormValidationStatus }` + children, where
  `FormValidationStatus = 'error' | 'success'`). `variant` is required (no `?`).
- **Component-level description (→ `catalog.json` `description`):** A validation message shown for
  the checkbox group, indicating an error or success state.

Composed as a child of `CheckboxGroup` (slot-scanned — see `checkbox-group.md`). Raw text content
→ synthetic `text` (synthetic-content-prop rule).

---

## Adapter section

### Prop-surface table

| prop | decision | synthetic? | A2UI type | description |
|---|---|---|---|---|
| `text` | carry (required) | yes | `DynamicString` | The validation message shown for the checkbox group. |
| `variant` | carry (required) | no | `z.union([z.enum(['error','success']), DataBinding])` | The validation status the message represents. `error` renders it as a failure (red, alert icon); `success` as a pass (green, check). Bindable: an agent can drive it through the data model (there is no `DynamicEnum`, so this is a union of the enum + `DataBinding`), mirroring `FormControl.Validation`. |

### Functions

None. Carries no `Action` and needs no local function.

### Dropped / deferred props

None beyond the raw-content channel below. (`variant` is the only configuration prop, and it is
carried.)

> `children` is not dropped — it is the raw-content channel, superseded by the synthetic `text`
> prop (raw text content → synthetic value prop typed `DynamicString`).

---

## Client section

Covered by the family's composed fixtures in `checkbox-group.md`. `variant`'s visible arm walks
the enum; the bindable `DataBinding` arm is a render-test assertion.

### Prop-coverage map

| adapter prop | covered by |
|---|---|
| `text` | `checkbox-group-validation` (both surfaces) · `checkbox-group-full` |
| `variant` | `checkbox-group-validation` (gallery: `error` / `success`); render-test assertion: bound (`DataBinding`) arm resolves through the data model |

---

## Agent section

Omitted. Carries no `Action`, so it emits no event and has no agent surface. (Its `variant` is
bindable, so a future flow could drive validation state via an `updateDataModel` write, but no
event originates here.)
