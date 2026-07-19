# RadioGroup.Caption

- **Part of the `RadioGroup` compound family** (6.49) — see `radio-group.md` for the family note,
  the rendering/composition conventions, and the component-level frame.
- **Official documentation URL:** https://primer.style/components/radio-group
- **Real prop surface resolved from:** `@primer/react` (v38.28.0) type declarations at
  `node_modules/@primer/react/dist/internal/components/CheckboxOrRadioGroup/CheckboxOrRadioGroupCaption.d.ts`
  (`CheckboxOrRadioGroupCaptionProps = React.PropsWithChildren<{ className? }>`).
- **Component-level description (→ `catalog.json` `description`):** Helper text describing the radio
  group, shown below its label.

Composed as a child of `RadioGroup` (slot-scanned — see `radio-group.md`). Raw text content →
synthetic `text` (synthetic-content-prop rule).

---

## Adapter section

### Prop-surface table

| prop | decision | synthetic? | A2UI type | description |
|---|---|---|---|---|
| `text` | carry (required) | yes | `DynamicString` | Helper text describing the radio group, shown below its label. |

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

Covered by the family's composed fixture `radiogroup-caption` in `radio-group.md` (literal arm; the
shared `DynamicString` binding is proven once on `RadioGroup.Label`).

### Prop-coverage map

| adapter prop | covered by |
|---|---|
| `text` | `radiogroup-caption` (literal) · `radiogroup-full` |

---

## Agent section

Omitted. Carries no `Action`, so it emits no event and has no agent surface.
