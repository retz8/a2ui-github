# FormControl.Label

- **Part of the `FormControl` compound family** (6.47) — see `formcontrol.md` for the family
  note, the rendering/composition conventions, and the component-level frame.
- **Official documentation URL:** https://primer.style/components/form-control
- **Real prop surface resolved from:** `@primer/react` (v38.28.0) type declarations at
  `node_modules/@primer/react/dist/FormControl/FormControlLabel.d.ts` — `Props` intersected with
  `React.ComponentProps<typeof InputLabel>` (`internal/components/InputLabel.d.ts`), which
  supplies `disabled`, `required`, `requiredText`, `requiredIndicator`, `visuallyHidden`, and the
  `as: 'label'|'legend'|'span'` selector.
- **Component-level description (→ `catalog.json` `description`):** The visible label naming the
  form control it belongs to.

Composed as a child of `FormControl` (slot-scanned — see `formcontrol.md`). Raw text content →
synthetic `text` (synthetic-content-prop rule).

---

## Adapter section

### Prop-surface table

| prop | decision | synthetic? | A2UI type | description |
|---|---|---|---|---|
| `text` | carry (required) | yes | `DynamicString` | The visible label text for the control. |
| `visuallyHidden` | carry | no | `z.boolean() (default: false)` | Hides the label visually while keeping it available to assistive technologies. |
| `requiredIndicator` | carry | no | `z.boolean() (default: true)` | Whether to show the required-field indicator (asterisk) when the control is required. |
| `requiredText` | carry | no | `z.string()` | Custom text conveying the required state to assistive technologies. |

### Functions

None. Carries no `Action` and needs no local function.

### Dropped / deferred props

| prop | reason |
|---|---|
| `disabled`, `required` | Dropped: inherited from the parent `FormControl` (the root owns both — see `formcontrol.md`); carrying them here would duplicate the parent's state. |
| `as` | Dropped: polymorphic element selector (`label`/`legend`/`span`) switching group vs single-control semantics; behavioral, selected by the renderer from the control's context — not an author-facing display choice. |
| `htmlFor`, `id` | Dropped: association identifiers, wired internally by `FormControl` from its `id`. |
| non-`aria-*` label HTML-attribute spread | Dropped: no A2UI representation (categorical). |
| `className`, `style` | Dropped: styling passthroughs; no A2UI representation. |

> `children` is not dropped — it is the raw-content channel, superseded by the synthetic `text`
> prop (raw text content → synthetic value prop typed `DynamicString`).

---

## Client section

Covered by the family's composed fixtures in `formcontrol.md`. `Label` is present in every
fixture (the control's name). Its coverage:

### Prop-coverage map

| adapter prop | covered by |
|---|---|
| `text` | `formcontrol` (literal) · `formcontrol-label-bound` (bound arm — the family's shared `DynamicString` binding proof) |
| `visuallyHidden` | `formcontrol-label-visually-hidden` |
| `requiredIndicator` | `formcontrol-required` (mini-gallery: `true` shows asterisk, `false` suppresses it) |
| `requiredText` | render-test assertion: required accessible text present when the control is required |

---

## Agent section

Omitted. Carries no `Action`, so it emits no event and has no agent surface.
