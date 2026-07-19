# CheckboxGroup.Label

- **Part of the `CheckboxGroup` compound family** (6.48) — see `checkbox-group.md` for the family
  note, the rendering/composition conventions, and the component-level frame.
- **Official documentation URL:** https://primer.style/components/checkbox-group
- **Real prop surface resolved from:** `@primer/react` (v38.28.0) type declarations at
  `node_modules/@primer/react/dist/internal/components/CheckboxOrRadioGroup/CheckboxOrRadioGroupLabel.d.ts`
  (`CheckboxOrRadioGroupLabelProps = { className?, visuallyHidden? }` + children). Simpler than
  `FormControl.Label` — this type has no `requiredIndicator` / `requiredText` / `as`.
- **Component-level description (→ `catalog.json` `description`):** The visible label (fieldset
  legend) naming the group of checkboxes it belongs to.

Composed as a child of `CheckboxGroup` (slot-scanned — see `checkbox-group.md`). Raw text content
→ synthetic `text` (synthetic-content-prop rule).

---

## Adapter section

### Prop-surface table

| prop | decision | synthetic? | A2UI type | description |
|---|---|---|---|---|
| `text` | carry (required) | yes | `DynamicString` | The visible label naming the group of checkboxes. |
| `visuallyHidden` | carry | no | `z.boolean() (default: false)` | Hides the label visually while keeping it available to assistive technologies. |

### Functions

None. Carries no `Action` and needs no local function.

### Dropped / deferred props

| prop | reason |
|---|---|
| `className` | Dropped: styling passthrough; no A2UI representation. |

> `children` is not dropped — it is the raw-content channel, superseded by the synthetic `text`
> prop (raw text content → synthetic value prop typed `DynamicString`).

---

## Client section

Covered by the family's composed fixtures in `checkbox-group.md`. `Label` is present in every
fixture (the group's legend). Its coverage:

### Prop-coverage map

| adapter prop | covered by |
|---|---|
| `text` | `checkbox-group` (literal) · `checkbox-group-label-bound` (bound arm — the family's shared `DynamicString` binding proof) |
| `visuallyHidden` | `checkbox-group-label-visually-hidden` |

---

## Agent section

Omitted. Carries no `Action`, so it emits no event and has no agent surface.
