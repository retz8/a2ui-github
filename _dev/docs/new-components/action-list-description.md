# ActionList.Description

- **Part of the `ActionList` compound family** (6.38) — see `action-list.md` for the family
  note, shared conventions, and the component-level frame.
- **Official documentation URL:** https://primer.style/components/action-list
- **Real prop surface resolved from:** `@primer/react` type declarations at
  `node_modules/@primer/react/dist/ActionList/Description.d.ts` (`ActionListDescriptionProps =
  { variant?: 'inline'|'block'; className?; style?; truncate?: boolean }` + children). Doc
  default `variant = "inline"`, `truncate = false`.
- **Component-level description (→ `catalog.json` `description`):** Secondary text describing an
  item, shown beside or below the item's label.

Secondary text content → synthetic `text` (the content-leaf convention, as with `Heading`/`Text`).

---

## Adapter section

### Prop-surface table

| prop | decision | synthetic? | A2UI type | description |
|---|---|---|---|---|
| `text` | carry (required) | yes | `DynamicString` | The item's secondary description text. |
| `variant` | carry | no | `z.enum(['inline','block']) (default: "inline")` | Whether the description sits beside the label (`inline`) or below it (`block`). |
| `truncate` | carry | no | `z.boolean() (default: false)` | Whether an inline description truncates its text on overflow. |

### Functions

None. `Description` carries no `Action` and needs no local function.

### Dropped / deferred props

| prop | reason |
|---|---|
| `children` | Superseded by the synthetic `text` prop (raw content → synthetic value prop). |
| `className`, `style` | Styling passthroughs; no A2UI representation. |

---

## Agent section

Omitted. `Description` emits no `event`-shaped `Action` (no `Action` at all), so per the
Orchestration skip rule there is no agent surface to design.

---
