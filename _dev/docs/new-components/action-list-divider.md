# ActionList.Divider

- **Part of the `ActionList` compound family** (6.38) — see `action-list.md` for the family
  note, shared conventions, and the component-level frame.
- **Official documentation URL:** https://primer.style/components/action-list
- **Real prop surface resolved from:** `@primer/react` type declarations at
  `node_modules/@primer/react/dist/ActionList/Divider.d.ts` (`ActionListDividerProps =
  { className?; style? }`). No documented props table exists for this subcomponent; the type
  carries only styling passthroughs.
- **Component-level description (→ `catalog.json` `description`):** A visual separator between
  items or groups in an action list.

A props-less leaf: every real prop is a styling passthrough with no A2UI representation, so the
schema is an empty object.

---

## Adapter section

### Prop-surface table

_No props carried — `Divider` is a self-contained separator._

### Functions

None. `Divider` carries no `Action` and needs no local function.

### Dropped / deferred props

| prop | reason |
|---|---|
| `className`, `style` | Styling passthroughs; no A2UI representation. |

---

## Agent section

Omitted. `Divider` emits no `event`-shaped `Action` (no `Action` at all), so per the
Orchestration skip rule there is no agent surface to design.

---
