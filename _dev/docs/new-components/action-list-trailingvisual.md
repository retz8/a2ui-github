# ActionList.TrailingVisual

- **Part of the `ActionList` compound family** (6.38) — see `action-list.md` for the family
  note, shared conventions, and the component-level frame.
- **Official documentation URL:** https://primer.style/components/action-list
- **Real prop surface resolved from:** `@primer/react` type declarations at
  `node_modules/@primer/react/dist/ActionList/Visuals.d.ts` (`ActionListTrailingVisualProps =
  VisualProps = React.HTMLAttributes<HTMLSpanElement>`). The only documented prop is `children`.
- **Component-level description (→ `catalog.json` `description`):** A visual, typically an icon,
  counter, or keyboard hint, shown after an item's label.

---

## Adapter section

### Prop-surface table

| prop | decision | synthetic? | A2UI type | description |
|---|---|---|---|---|
| `children` | carry (optional) | yes | `ChildList` | The visual content shown after the item's label — typically an icon, counter, or keyboard hint. |

### Functions

None. `TrailingVisual` carries no `Action` and needs no local function.

### Dropped / deferred props

| prop | reason |
|---|---|
| `className` | Styling passthrough; no A2UI representation. |
| non-`aria-*` `span` HTML-attribute spread | Dropped: no A2UI representation. |

---

## Agent section

Omitted. `TrailingVisual` emits no `event`-shaped `Action` (no `Action` at all), so per the
Orchestration skip rule there is no agent surface to design.

---
