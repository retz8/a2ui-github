# NavList.Item

- **Official documentation URL:** https://primer.style/components/nav-list
- **Real prop surface resolved from:** `@primer/react` type declarations at
  `node_modules/@primer/react/dist/NavList/NavList.d.ts` (v38.28.0):
  `NavListItemProps<As> = PolymorphicProps<As, 'a', { children: React.ReactNode; defaultOpen?: boolean;
  href?: string; 'aria-current'?: 'page' | 'step' | 'location' | 'date' | 'time' | 'true' | 'false' |
  boolean; inactiveText?: string }>` (polymorphic, default element `'a'`).
- **Component-level description (→ `catalog.json` `description`):** A single navigation link in the
  list; it holds the label and any leading/trailing visual, description, sub-navigation, or trailing
  action.

> Part of the `NavList` compound family (6.41) — see `navlist.md` for the family overview and shared
> conventions (`ChildList` slots, the interaction model, composed-centered coverage).

## Interaction model

`Item` is a **link**, not a button — its documented/typed surface exposes **no click handler**;
navigation is carried entirely by `href`. So it carries **no `Action`** and has **no agent section**
(faithful translation — adding a synthetic click action would be a redesign, not a translation).
Click-to-agent nav is a Phase-7 screen-composition concern, not this leaf's.

---

## Adapter section

### Prop-surface table

| prop | decision | synthetic? | A2UI type | description |
|---|---|---|---|---|
| `children` | carry (optional) | yes | `ChildList` | The item's label plus any leading/trailing visual, description, sub-navigation, or trailing action. |
| `href` | carry | no | `DynamicString` | The URL the item links to. |
| `aria-current` | carry | no | `z.enum(['page','step','location','date','time','true','false'])` | Marks this item as the user's current page or location. |
| `defaultOpen` | carry | no | `z.boolean()` | Whether the item's sub-navigation starts expanded on first render. |
| `inactiveText` | carry | no | `DynamicString` | Text explaining why the item is inactive; its presence disables activation and shows the explanation. |

`aria-current` carries the string tokens (`boolean` `true`/`false` collapse to `'true'`/`'false'`).

### Functions

None. `Item` carries no `Action` and needs no local function.

### Dropped / deferred props

| prop | reason |
|---|---|
| `as` | Polymorphic element selector that switches the item's identity (anchor vs. button/router-link) — a behavior switch, not a display-equivalent set. `href` already carries the link behavior. |
| `className`, `style`, and the rest of the non-`aria-*` host-element spread | Dropped: no A2UI representation. |

---

## Client section

Covered by the composed `navlist` baseline (`navlist.md`) — every item there exercises `children` /
`href` / `aria-current` / `defaultOpen`. One dedicated fixture isolates the inactive state. Each
fixture renders the item inside a realistic `NavList`, never a bare item.

### Fixture table

| fixture | exercises (coverage axis) | component state / canned values | baselined? |
|---|---|---|---|
| `navlist-item-inactive` | visually-distinct state — `inactiveText` (inactive item) | `NavList`[`Item` "Draft settings" `LeadingVisual`→`Icon` `gear`, `inactiveText: "Available once the repository is initialized"`, `href: "#"`] | yes |

### Prop-coverage map

| adapter prop | covered by |
|---|---|
| `children` | composed `navlist` baseline (every item's label + slots) |
| `href` | composed `navlist` baseline + render-test assertion (`href` on the anchor) |
| `aria-current` | composed `navlist` baseline (one current item) + render-test assertion (`aria-current` values) |
| `defaultOpen` | composed `navlist` baseline (expanded SubNav) + render-test assertion (`aria-expanded` reflects `defaultOpen`) |
| `inactiveText` | `navlist-item-inactive` |

---

## Agent section

Omitted. `Item` carries no `Action` (href-only navigation), so per the Orchestration skip rule there
is no agent surface to design.
