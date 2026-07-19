# RadioGroup.Label

- **Part of the `RadioGroup` compound family** (6.49) — see `radio-group.md` for the family note,
  the rendering/composition conventions, and the component-level frame.
- **Official documentation URL:** https://primer.style/components/radio-group
- **Real prop surface resolved from:** `@primer/react` (v38.28.0) type declarations at
  `node_modules/@primer/react/dist/internal/components/CheckboxOrRadioGroup/CheckboxOrRadioGroupLabel.d.ts`
  (`CheckboxOrRadioGroupLabelProps = { className?, visuallyHidden? }` + `children`). Renders the
  group's `<legend>`.
- **Component-level description (→ `catalog.json` `description`):** The visible label naming the
  radio group.

Composed as a child of `RadioGroup` (slot-scanned — see `radio-group.md`). Raw text content →
synthetic `text` (synthetic-content-prop rule).

---

## Adapter section

### Prop-surface table

| prop | decision | synthetic? | A2UI type | description |
|---|---|---|---|---|
| `text` | carry (required) | yes | `DynamicString` | The visible label naming the radio group. |
| `visuallyHidden` | carry | no | `z.boolean() (default: false)` | Hides the label visually while keeping it available to assistive technologies. |

### Functions

None. Carries no `Action` and needs no local function.

### Dropped / deferred props

| prop | reason |
|---|---|
| `className`, `style` | Dropped: styling passthroughs; no A2UI representation. |

> `children` is not dropped — it is the raw-content channel, superseded by the synthetic `text`
> prop (raw text content → synthetic value prop typed `DynamicString`).

---

## Client section

Covered by the family's composed fixtures in `radio-group.md`. `Label` is present in every fixture
(the group's name).

### Prop-coverage map

| adapter prop | covered by |
|---|---|
| `text` | `radiogroup` (literal) · `radiogroup-label-bound` (bound arm — the family's shared `DynamicString` binding proof) |
| `visuallyHidden` | `radiogroup-label-visually-hidden` |

---

## Agent section

Omitted. Carries no `Action`, so it emits no event and has no agent surface.
