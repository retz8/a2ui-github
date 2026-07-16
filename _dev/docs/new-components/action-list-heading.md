# ActionList.Heading

- **Part of the `ActionList` compound family** (6.38) — see `action-list.md` for the family
  note, shared conventions, and the component-level frame.
- **Official documentation URL:** https://primer.style/components/action-list
- **Real prop surface resolved from:** `@primer/react` type declarations at
  `node_modules/@primer/react/dist/ActionList/Heading.d.ts` (`ActionListHeadingProps =
  { as: h1..h6; size?: 'large'|'medium'|'small'; visuallyHidden?; className?; style? }`). `size`
  is present in the type but omitted from the doc's props table — carried faithfully (code is
  authority), consistent with `LinkItem`'s `variant`/`size`. Doc default `as = "h3"`.
- **Component-level description (→ `catalog.json` `description`):** A heading that labels the
  entire action list.

The list-level heading is a content leaf: its text → synthetic `text` (the `Heading` convention).
Unlike `GroupHeading`, it carries no trailing action.

---

## Adapter section

### Prop-surface table

| prop | decision | synthetic? | A2UI type | description |
|---|---|---|---|---|
| `text` | carry (required) | yes | `DynamicString` | The list heading's text. |
| `as` | carry | no | `z.enum(['h1','h2','h3','h4','h5','h6']) (default: "h3")` | The heading level in the document outline. |
| `size` | carry | no | `z.enum(['small','medium','large'])` | The heading's visual size, independent of its outline level. |
| `visuallyHidden` | carry | no | `z.boolean()` | Whether the heading is hidden visually but kept available to assistive technologies. |

### Functions

None. `Heading` carries no `Action` and needs no local function.

### Dropped / deferred props

| prop | reason |
|---|---|
| `children` | Superseded by the synthetic `text` prop (raw content → synthetic value prop). |
| `className`, `style` | Styling passthroughs; no A2UI representation. |

---

## Agent section

Omitted. `Heading` emits no `event`-shaped `Action` (no `Action` at all), so per the
Orchestration skip rule there is no agent surface to design.

---
