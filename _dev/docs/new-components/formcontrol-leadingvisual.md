# FormControl.LeadingVisual

- **Part of the `FormControl` compound family** (6.47) — see `formcontrol.md` for the family
  note, the rendering/composition conventions, and the component-level frame.
- **Official documentation URL:** https://primer.style/components/form-control
- **Real prop surface resolved from:** `@primer/react` (v38.28.0) type declarations at
  `node_modules/@primer/react/dist/FormControl/FormControlLeadingVisual.d.ts`
  (`FCWithSlotMarker<React.PropsWithChildren<{ style? }>>`).
- **Component-level description (→ `catalog.json` `description`):** A visual, such as an icon,
  shown before a checkbox or radio control and its label.

Composed as a child of `FormControl` (slot-scanned — see `formcontrol.md`). Its `children` are a
nested component reference (an `Icon`) rather than raw content, so the synthetic content prop is a
`ComponentId` (`child`), mirroring `Button.child` / `FormControl.LeadingVisual`'s icon slot.

---

## Adapter section

### Prop-surface table

| prop | decision | synthetic? | A2UI type | description |
|---|---|---|---|---|
| `child` | carry (required) | yes | `ComponentId` | A visual (e.g. an icon) shown before the input, for checkbox and radio layouts. |

### Functions

None. Carries no `Action` and needs no local function.

### Dropped / deferred props

| prop | reason |
|---|---|
| `style` | Dropped: styling passthrough; no A2UI representation. |

> `children` is not dropped — it is the content channel, superseded by the synthetic `child`
> prop (a nested component reference → synthetic value prop typed `ComponentId`).

---

## Client section

Covered by the family's composed fixture `formcontrol-leading-visual` in `formcontrol.md` — a
horizontal `FormControl` wrapping a `Checkbox`, with the leading visual's `child` filled by an
`Icon`.

### Prop-coverage map

| adapter prop | covered by |
|---|---|
| `child` | `formcontrol-leading-visual` (slot filled with an `Icon`) |

---

## Agent section

Omitted. Carries no `Action`, so it emits no event and has no agent surface.
