# NavList.Description

- **Official documentation URL:** https://primer.style/components/nav-list
- **Real prop surface resolved from:** `@primer/react` type declarations at
  `node_modules/@primer/react/dist/NavList/NavList.d.ts` (v38.28.0):
  `NavList.Description = FCWithSlotMarker<React.PropsWithChildren<ActionListDescriptionProps>>` where
  `ActionListDescriptionProps = { variant?: 'inline'|'block'; className?; style?; truncate?: boolean }`
  (`ActionList/Description.d.ts`); content comes through `children` (raw text). Implementation
  defaults: `variant = "inline"`, `truncate = false`.
- **Component-level description (→ `catalog.json` `description`):** Supplementary text shown for a
  navigation item.

> Part of the `NavList` compound family (6.41) — see `navlist.md` for the family overview and shared
> conventions (synthetic `text` content channel, `heading.md` rule).

---

## Adapter section

### Prop-surface table

| prop | decision | synthetic? | A2UI type | description |
|---|---|---|---|---|
| `text` | carry (required) | yes | `DynamicString` | The supplementary text shown for the item. |
| `variant` | carry | no | `z.enum(['inline','block']) (default: "inline")` | Whether the text sits beside (`inline`) or below (`block`) the item's label. |
| `truncate` | carry | no | `z.boolean() (default: false)` | Whether inline text is truncated when it overflows. |

`text` is the synthetic content channel (raw `children` → synthetic value prop, `heading.md` rule).

### Functions

None. Carries no `Action` and needs no local function.

### Dropped / deferred props

| prop | reason |
|---|---|
| `className`, `style` | Styling passthroughs; no A2UI representation. |

---

## Client section

`text` (literal) is covered by the composed `navlist` baseline (`navlist.md`), which carries an inline
description. Dedicated fixtures cover the `variant` gallery and `truncate`; one binds `text` to a path.
Each fixture renders the description inside a realistic `NavList` item.

### Fixture table

| fixture | exercises (coverage axis) | component state / canned values | baselined? |
|---|---|---|---|
| `navlist-description-variants` | visual enum — `variant` | one surface per `['inline','block']`; each a `NavList`[`Item` "Notifications" `Description` `text: <variant>`] | yes (one PNG) |
| `navlist-description-truncate` | visually-distinct state — `truncate` (+ bound `text`) | `NavList` (narrow container)[`Item` "Repository" `Description` `variant: "inline"`, `truncate: true`, `text: {path: "/desc"}`]; data model `{desc: "A very long description that overflows the available inline space and is truncated"}` | yes |

### Prop-coverage map

| adapter prop | covered by |
|---|---|
| `text` | composed `navlist` baseline (literal) + `navlist-description-truncate` (bound) |
| `variant` | `navlist-description-variants` |
| `truncate` | `navlist-description-truncate` |

---

## Agent section

Omitted. Emits no `event`-shaped `Action` (no `Action` at all), per the family skip rule.
