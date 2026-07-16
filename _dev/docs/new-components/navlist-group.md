# NavList.Group

- **Official documentation URL:** https://primer.style/components/nav-list
- **Real prop surface resolved from:** `@primer/react` type declarations at
  `node_modules/@primer/react/dist/NavList/NavList.d.ts` (v38.28.0):
  `NavListGroupProps = React.HTMLAttributes<HTMLLIElement> & { children: React.ReactNode; title?: string }`.
  Unlike `ActionList.Group`, NavList's own `title` is **not** `@deprecated`.
- **Component-level description (→ `catalog.json` `description`):** A container that groups related
  navigation items under a heading.

> Part of the `NavList` compound family (6.41) — see `navlist.md` for the family overview and shared
> conventions. `Group.title` and the `navlist-groupheading` leaf are two faithful ways to label a
> group; the agent picks one.

---

## Adapter section

### Prop-surface table

| prop | decision | synthetic? | A2UI type | description |
|---|---|---|---|---|
| `children` | carry (optional) | yes | `ChildList` | The related navigation items contained in the group. |
| `title` | carry | no | `DynamicString` | The group's heading text. |

### Functions

None. Carries no `Action` and needs no local function.

### Dropped / deferred props

| prop | reason |
|---|---|
| `className`, `style`, and the rest of the HTML-`<li>` attribute spread | Dropped: no A2UI representation. |

---

## Client section

`children` + `title` (literal) are covered by the composed `navlist` baseline (`navlist.md`), which
carries a "Support" group. One dedicated fixture proves `title` path binding. Each fixture renders the
group inside a realistic `NavList`.

### Fixture table

| fixture | exercises (coverage axis) | component state / canned values | baselined? |
|---|---|---|---|
| `navlist-group-bound` | content channel — `title` bound (path binding) | `NavList`[`Group` `title: {path: "/section"}`[`Item` "Profile"+href, `Item` "Account"+href]]; data model `{section: "Personal settings"}` | yes |

### Prop-coverage map

| adapter prop | covered by |
|---|---|
| `children` | composed `navlist` baseline (the "Support" group) |
| `title` | composed `navlist` baseline (literal) + `navlist-group-bound` (bound) |

---

## Agent section

Omitted. Emits no `event`-shaped `Action` (no `Action` at all), per the family skip rule.
