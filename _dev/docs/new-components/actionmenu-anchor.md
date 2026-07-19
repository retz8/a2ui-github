# ActionMenu.Anchor

- **Part of the `ActionMenu` compound family** (6.39) — see `actionmenu.md` for the family note,
  composition model, and the component-level frame.
- **Official documentation URL:** https://primer.style/components/action-menu
- **Real prop surface resolved from:** `@primer/react` type declarations at
  `node_modules/@primer/react/dist/ActionMenu/ActionMenu.d.ts` — `ActionMenuAnchorProps =
  {children: React.ReactElement, id?: string} & React.HTMLAttributes<HTMLElement>`.
- **Component-level description (→ `catalog.json` `description`):** A custom element used as the
  menu's trigger, when a plain button is not wanted.

A thin wrapper that turns an arbitrary component into the menu trigger; Primer wires the toggle onto
the wrapper, so the wrapped component is presentational (its own action, if any, is redundant here —
the trigger's click is owned by the parent `ActionMenu`).

---

## Adapter section

### Prop-surface table

| prop | decision | synthetic? | A2UI type | description |
|---|---|---|---|---|
| `children` | carry (required) | yes → `child` | `ComponentId` | The component used as the menu's trigger. |

### Functions

None. The anchor carries no `Action` and needs no local function.

### Dropped / deferred props

| prop | reason |
|---|---|
| `id`, and the non-`aria-*` `React.HTMLAttributes<HTMLElement>` spread | Dropped: no A2UI representation. |

---

## Agent section

Omitted. `ActionMenu.Anchor` emits no `event`-shaped `Action` (no `Action` at all), so per the
Orchestration skip rule there is no agent surface to design.

---
