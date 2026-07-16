# NavList.SubNav

- **Official documentation URL:** https://primer.style/components/nav-list
- **Real prop surface resolved from:** `@primer/react` type declarations at
  `node_modules/@primer/react/dist/NavList/NavList.d.ts` (v38.28.0):
  `SubNav: PolymorphicForwardRefComponent<'ul', NavListSubNavProps>` where
  `NavListSubNavProps = { children: React.ReactNode }` (polymorphic default element `'ul'`).
- **Component-level description (→ `catalog.json` `description`):** The nested navigation items shown
  when a parent item is expanded.

> Part of the `NavList` compound family (6.41) — see `navlist.md` for the family overview and shared
> conventions.

---

## Adapter section

### Prop-surface table

| prop | decision | synthetic? | A2UI type | description |
|---|---|---|---|---|
| `children` | carry (optional) | yes | `ChildList` | The nested navigation items shown when the parent item is expanded. |

### Functions

None. Carries no `Action` and needs no local function.

### Dropped / deferred props

| prop | reason |
|---|---|
| `as` | Polymorphic element selector whose only meaningful value is `'ul'` (not a display-equivalent set worth an enum). |

---

## Client section

`children` is covered visually by the composed `navlist` baseline (`navlist.md`), where one item's
`SubNav` is rendered expanded (`defaultOpen: true`).

### Fixture table

| fixture | exercises (coverage axis) | component state / canned children | baselined? |
|---|---|---|---|
| *(none of its own)* | — | exercised inside the composed `navlist` fixture (expanded SubNav under "Pull requests") | — |

### Prop-coverage map

| adapter prop | covered by |
|---|---|
| `children` | composed `navlist` fixture (`navlist.md`) |

---

## Agent section

Omitted. Emits no `event`-shaped `Action` (no `Action` at all), per the family skip rule.
