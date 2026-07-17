# NavList.TrailingVisual

- **Official documentation URL:** https://primer.style/components/nav-list
- **Real prop surface resolved from:** `@primer/react` type declarations at
  `node_modules/@primer/react/dist/NavList/NavList.d.ts` (v38.28.0):
  `NavListTrailingVisualProps = ActionListTrailingVisualProps = VisualProps`, where
  `VisualProps = React.HTMLAttributes<HTMLSpanElement>` (`ActionList/Visuals.d.ts`). No `hidden` prop.
- **Component-level description (→ `catalog.json` `description`):** A visual element, such as an icon
  or a count, shown after the item's label to convey auxiliary information.

> Part of the `NavList` compound family (6.41) — see `navlist.md` for the family overview and shared
> conventions (`ChildList` slots; composed-centered coverage).

---

## Adapter section

### Prop-surface table

| prop | decision | synthetic? | A2UI type | description |
|---|---|---|---|---|
| `children` | carry (optional) | yes | `ChildList` | A visual element, such as an icon or a count, shown after the item's label. |

### Functions

None. Carries no `Action` and needs no local function.

### Dropped / deferred props

| prop | reason |
|---|---|
| the `VisualProps` HTML-`<span>` attribute spread (`className`, `style`, `id`, `data-*`, all DOM handlers, …) | Dropped: no A2UI representation. |

---

## Client section

`children` is covered visually by the composed `navlist` baseline (`navlist.md`), where an item
carries a trailing `CounterLabel`.

### Fixture table

| fixture | exercises (coverage axis) | component state / canned children | baselined? |
|---|---|---|---|
| *(none of its own)* | — | exercised inside the composed `navlist` fixture (trailing `CounterLabel` on "Dashboard") | — |

### Prop-coverage map

| adapter prop | covered by |
|---|---|
| `children` | composed `navlist` fixture (`navlist.md`) |

---

## Agent section

Omitted. Emits no `event`-shaped `Action` (no `Action` at all), per the family skip rule.
