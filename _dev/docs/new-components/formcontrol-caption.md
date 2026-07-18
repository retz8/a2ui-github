# FormControl.Caption

- **Part of the `FormControl` compound family** (6.47) — see `formcontrol.md` for the family
  note, the rendering/composition conventions, and the component-level frame.
- **Official documentation URL:** https://primer.style/components/form-control
- **Real prop surface resolved from:** `@primer/react` (v38.28.0) type declarations at
  `node_modules/@primer/react/dist/FormControl/FormControlCaption.d.ts` (`FormControlCaptionProps`
  = `React.PropsWithChildren<{ id?, className?, style? }>`).
- **Component-level description (→ `catalog.json` `description`):** Helper text describing the
  form control, shown below its label.

Composed as a child of `FormControl` (slot-scanned — see `formcontrol.md`). Raw text content →
synthetic `text` (synthetic-content-prop rule).

---

## Adapter section

### Prop-surface table

| prop | decision | synthetic? | A2UI type | description |
|---|---|---|---|---|
| `text` | carry (required) | yes | `DynamicString` | Helper text describing the control, shown below the label. |

### Functions

None. Carries no `Action` and needs no local function.

### Dropped / deferred props

| prop | reason |
|---|---|
| `id` | Dropped: association identifier, wired internally by `FormControl`. |
| `className`, `style` | Dropped: styling passthroughs; no A2UI representation. |

> `children` is not dropped — it is the raw-content channel, superseded by the synthetic `text`
> prop (raw text content → synthetic value prop typed `DynamicString`).

---

## Client section

Covered by the family's composed fixture `formcontrol-caption` in `formcontrol.md` (literal arm;
the shared `DynamicString` binding is proven once on `FormControl.Label`).

### Prop-coverage map

| adapter prop | covered by |
|---|---|
| `text` | `formcontrol-caption` (literal) · `formcontrol-full` |

---

## Agent section

Omitted. Carries no `Action`, so it emits no event and has no agent surface.
