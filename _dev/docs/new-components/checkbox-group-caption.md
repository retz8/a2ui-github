# CheckboxGroup.Caption

- **Part of the `CheckboxGroup` compound family** (6.48) — see `checkbox-group.md` for the family
  note, the rendering/composition conventions, and the component-level frame.
- **Official documentation URL:** https://primer.style/components/checkbox-group
- **Real prop surface resolved from:** `@primer/react` (v38.28.0) type declarations at
  `node_modules/@primer/react/dist/internal/components/CheckboxOrRadioGroup/CheckboxOrRadioGroupCaption.d.ts`
  (`CheckboxOrRadioGroupCaptionProps = React.PropsWithChildren<{ className? }>`).
- **Component-level description (→ `catalog.json` `description`):** Helper text describing the
  group of checkboxes, shown below its label.

Composed as a child of `CheckboxGroup` (slot-scanned — see `checkbox-group.md`). Raw text content
→ synthetic `text` (synthetic-content-prop rule).

---

## Adapter section

### Prop-surface table

| prop | decision | synthetic? | A2UI type | description |
|---|---|---|---|---|
| `text` | carry (required) | yes | `DynamicString` | Helper text describing the group of checkboxes, shown below the label. |

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

Covered by the family's composed fixture `checkbox-group-caption` in `checkbox-group.md` (literal
arm; the shared `DynamicString` binding is proven once on `CheckboxGroup.Label`).

### Prop-coverage map

| adapter prop | covered by |
|---|---|
| `text` | `checkbox-group-caption` (literal) · `checkbox-group-full` |

---

## Agent section

Omitted. Carries no `Action`, so it emits no event and has no agent surface.
