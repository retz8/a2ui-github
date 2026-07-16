# ActionList.GroupHeading

- **Part of the `ActionList` compound family** (6.38) — see `action-list.md` for the family
  note, shared conventions, and the component-level frame.
- **Official documentation URL:** https://primer.style/components/action-list
- **Real prop surface resolved from:** `@primer/react` type declarations at
  `node_modules/@primer/react/dist/ActionList/Group.d.ts` (`ActionListGroupHeadingProps =
  Pick<ActionListGroupProps, 'variant' | 'auxiliaryText'> & Omit<ActionListHeadingProps, 'as'> &
  React.HTMLAttributes<HTMLElement> & { as?: h1..h6; headingWrapElement?: 'div'|'li';
  _internalBackwardCompatibleTitle?: string }`), plus the nested `GroupHeading.TrailingAction`.
  Doc default `as = "h3"`, `variant = "subtle"`.
- **Component-level description (→ `catalog.json` `description`):** A heading that labels a group
  of items within an action list, optionally with a trailing action beside the label.

Unlike the list-level `Heading` (leaf 10), a group heading is a **container**: its `children` is
a permissive `ChildList` holding the heading label (a `Text` leaf) and an optional trailing
action (the `ActionList.TrailingAction` leaf) — not a synthetic text channel.

---

## Adapter section

### Prop-surface table

| prop | decision | synthetic? | A2UI type | description |
|---|---|---|---|---|
| `children` | carry (optional) | yes | `ChildList` | The heading label and its optional trailing action. |
| `variant` | carry | no | `z.enum(['filled','subtle']) (default: "subtle")` | The heading's style; `filled` adds a background color and top/bottom borders. |
| `auxiliaryText` | carry | no | `DynamicString` | Secondary text providing additional information about the group. |
| `visuallyHidden` | carry | no | `z.boolean()` | Whether the heading is hidden visually but kept available to assistive technologies. |
| `as` | carry | no | `z.enum(['h1','h2','h3','h4','h5','h6']) (default: "h3")` | The heading level in the document outline. |

### Functions

None. `GroupHeading` carries no `Action` and needs no local function.

### Dropped / deferred props

| prop | reason |
|---|---|
| `headingWrapElement`, `_internalBackwardCompatibleTitle` | Dropped: type-only/internal, absent from the documented props table. |
| `className` | Styling passthrough; no A2UI representation. |
| non-`aria-*` HTML-attribute spread | Dropped: no A2UI representation. |

---

## Agent section

Omitted. `GroupHeading` emits no `event`-shaped `Action` (no `Action` at all), so per the
Orchestration skip rule there is no agent surface to design.

---
