# ActionList.Group

- **Part of the `ActionList` compound family** (6.38) — see `action-list.md` for the family
  note, shared conventions, and the component-level frame.
- **Official documentation URL:** https://primer.style/components/action-list
- **Real prop surface resolved from:** `@primer/react` type declarations at
  `node_modules/@primer/react/dist/ActionList/Group.d.ts` (`ActionListGroupProps =
  React.HTMLAttributes<HTMLLIElement> & { variant?, title? (@deprecated), auxiliaryText?,
  selectionVariant?: ActionListProps['selectionVariant'] | false }`). `selectionVariant`
  resolves to `'single' | 'radio' | 'multiple' | false`; the doc's props table omits `radio`
  (code is authority, carried — as on the root).
- **Component-level description (→ `catalog.json` `description`):** A labeled section grouping
  related items within an action list, optionally with its own selection mode.

---

## Adapter section

### Prop-surface table

| prop | decision | synthetic? | A2UI type | description |
|---|---|---|---|---|
| `children` | carry (optional) | yes | `ChildList` | The items contained in the group. |
| `variant` | carry | no | `z.enum(['filled','subtle']) (default: "subtle")` | The group's style; `filled` adds a background color and top/bottom borders. |
| `auxiliaryText` | carry | no | `DynamicString` | Secondary text providing additional information about the group. |
| `selectionVariant` | carry | no | `z.union([z.enum(['single','radio','multiple']), z.literal(false)])` | Whether one or many items in this group may be selected, overriding the list's setting; `false` disables selection for this group. |
| `role` | carry | no | `z.string()` | The ARIA role describing the function of the list inside the group. |

### Functions

None. `Group` carries no `Action` and needs no local function.

### Dropped / deferred props

| prop | reason |
|---|---|
| `title` | Dropped: deprecated — "use `ActionList.GroupHeading` instead." |
| `className` | Styling passthrough; no A2UI representation. |
| non-`aria-*` `li` HTML-attribute spread | Dropped: no A2UI representation. |

---

## Agent section

Omitted. `Group` emits no `event`-shaped `Action` (no `Action` at all), so per the
Orchestration skip rule there is no agent surface to design.

---
