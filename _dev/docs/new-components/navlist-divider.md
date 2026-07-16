# NavList.Divider

- **Official documentation URL:** https://primer.style/components/nav-list
- **Real prop surface resolved from:** `@primer/react` type declarations at
  `node_modules/@primer/react/dist/NavList/NavList.d.ts` (v38.28.0):
  `NavListDividerProps = ActionListDividerProps = { className?; style? }` (`ActionList/Divider.d.ts`).
  A pure visual separator — its only props are styling passthroughs, and its `children` (it is
  `PropsWithChildren`) are ignored (it renders a rule).
- **Component-level description (→ `catalog.json` `description`):** A visual separator between groups
  of navigation items.

> Part of the `NavList` compound family (6.41) — see `navlist.md` for the family overview and shared
> conventions.

## Build note

A **propless leaf** — the A2UI schema is an empty object (`z.object({})`); the `catalog.json` entry
carries an empty `properties` envelope. It renders `NavList.Divider` with no forwarded props.

---

## Adapter section

### Prop-surface table

| prop | decision | synthetic? | A2UI type | description |
|---|---|---|---|---|
| *(none)* | — | — | — | — |

### Functions

None. Carries no `Action` and needs no local function.

### Dropped / deferred props

| prop | reason |
|---|---|
| `className`, `style` | Styling passthroughs; no A2UI representation. |
| `children` | Ignored by the component (it renders a rule); not a content channel. |

---

## Client section

Covered visually by the composed `navlist` baseline (`navlist.md`), which places a `Divider` between
sections.

### Fixture table

| fixture | exercises (coverage axis) | component state / canned children | baselined? |
|---|---|---|---|
| *(none of its own)* | — | exercised inside the composed `navlist` fixture (divider before the "Support" group) | — |

### Prop-coverage map

| adapter prop | covered by |
|---|---|
| *(none — propless)* | composed `navlist` fixture renders the divider (render-test assertion: the separator element is present) |

---

## Agent section

Omitted. Emits no `event`-shaped `Action` (no `Action` at all), per the family skip rule.
