# ActionMenu.Divider

- **Part of the `ActionMenu` compound family** (6.39) — see `actionmenu.md` for the family note,
  composition model, and the component-level frame.
- **Official documentation URL:** https://primer.style/components/action-menu
- **Real prop surface resolved from:** `@primer/react` type declarations at
  `node_modules/@primer/react/dist/ActionMenu/ActionMenu.d.ts` — `ActionMenu.Divider` =
  `ActionListDividerProps` (`{className?, style?}`), the sibling twin of `ActionList.Divider`
  (`action-list-divider.md`). No documented props table exists for this subcomponent; the type
  carries only styling passthroughs.
- **Component-level description (→ `catalog.json` `description`):** A visual separator between items
  or groups in a menu.

A props-less leaf: every real prop is a styling passthrough with no A2UI representation, so the
schema is an empty object (the `action-list-divider.md` precedent).

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

Omitted. `Divider` emits no `event`-shaped `Action` (no `Action` at all), so per the Orchestration
skip rule there is no agent surface to design.

---
