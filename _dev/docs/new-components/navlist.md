# NavList

- **Official documentation URL:** https://primer.style/components/nav-list
- **Real prop surface resolved from:** `@primer/react` installed type declarations at
  `node_modules/@primer/react/dist/NavList/NavList.d.ts` (v38.28.0) and the implementation
  `NavList.js` (authority on internal wiring and defaults), plus the ActionList types NavList
  re-exports (`ActionList/Visuals.d.ts`, `TrailingAction.d.ts`, `Divider.d.ts`, `Group.d.ts`).
  Root `NavListProps = { children: React.ReactNode } & React.ComponentProps<'nav'>`. The doc page
  lists a root `as` prop (default `"nav"`) and a `NavList.Heading` subcomponent, but **neither is in
  the installed types** — the root type carries no `as`, and `Heading` is not a static member of the
  `NavList` component. Code is authority → both are dropped (the doc is ahead here). The nav
  landmark's accessible name is carried by the root's `aria-label` / `aria-labelledby`.
- **Component-level description (→ `catalog.json` `description`):** A vertical list of navigation
  links for the current context, indicating which page is active.

> NavList ships as a **compound family**, mirroring the component library one-to-one: the root plus
> **10 subcomponent leaves**, each shipped as a sibling catalog leaf in the same 6.41 sub-task, each
> with its own decision doc:
>
> - `navlist-item.md`, `navlist-subnav.md`
> - `navlist-leadingvisual.md`, `navlist-trailingvisual.md`, `navlist-trailingaction.md`
> - `navlist-group.md`, `navlist-groupheading.md`, `navlist-divider.md`, `navlist-description.md`
> - `navlist-groupexpand.md`
>
> The root's `children` slot references the item / group / divider leaves; `Item`'s `children`
> references its label (`Text`), visuals, description, sub-navigation, and trailing action; `Group`'s
> references items. The catalog stays permissive on which child goes in which slot — the leaves are
> shipped; the agent composes them per the component library's structure. Every slot uses the
> `ChildList` container-slot convention (`stack.md`).

## Conventions established / reused by this family

- **`ChildList` slots (`stack.md`)** for every container/content slot across the family.
- **`aria-label` / `aria-labelledby` as literal `DynamicString`** (not the `AccessibilityAttributes`
  common), following the `PageHeader` family — carried only on the **root**, the sole leaf whose
  documented props table lists aria attributes. `TrailingAction`, an interactive control, carries the
  `AccessibilityAttributes` common instead (IconButton parity).
- **Icons are the `Icon` leaf referenced by `ComponentId`** wherever an icon is a slot
  (`LeadingVisual` / `TrailingVisual` children, `TrailingAction.icon`). The **one exception** is
  inside `GroupExpand`'s serialized `items` array, where an array-local value cannot hold a
  `ComponentId` — there an icon is carried as the **`Icon` leaf's `name` enum** (kebab-case octicon
  name). See `navlist-groupexpand.md`.
- **Interaction model.** `NavList.Item` is a **link** (`href` navigation) and carries **no `Action`**
  — navigation is the `href`, faithful to Primer (the item exposes no documented click handler).
  `NavList.TrailingAction` is the family's **only interactive leaf** — a button whose click maps to
  an `Action` (`← onClick`) — and therefore the family's **sole agent site**.
- **Doc-faithful prop surfaces.** Each leaf carries exactly the props its documented props table
  lists, minus the always-dropped styling passthroughs (`className` / `style`) and the non-`aria-*`
  HTML-attribute spread, plus the synthetic `text` content channel where content comes through
  `children` as raw text (`heading.md` rule).

---

## Adapter section

### Prop-surface table

| prop | decision | synthetic? | A2UI type | description |
|---|---|---|---|---|
| `children` | carry (optional) | yes | `ChildList` | The navigation items, groups, and dividers arranged in the list. |
| `aria-label` | carry | no | `DynamicString` | An accessible name for the navigation region. |
| `aria-labelledby` | carry | no | `DynamicString` | The id of an element that labels the navigation region. |

### Functions

None. `NavList` carries no `Action` and needs no local function.

### Dropped / deferred props

| prop | reason |
|---|---|
| `as` | Not a root prop: the installed root type is `React.ComponentProps<'nav'>` and carries no `as` (the doc's props table is stale here). |
| `NavList.Heading` | Not an installed static member of `NavList` (doc ahead of code). The accessible name is carried by the root's `aria-label` / `aria-labelledby`. |
| `className`, `style`, and the rest of the non-`aria-*` HTML-`<nav>` attribute spread | Dropped: no A2UI representation. |

---

## Client section

Composed-centered coverage (see the family note). The single composed `navlist` fixture is the
family's shared baseline: a fully assembled navigation built from already-shipped filler leaves
(`Text`, `Icon`, `CounterLabel`) that visually covers **every** slot leaf's `children` at once. Every
leaf whose only surface is a `children` slot (`SubNav`, `LeadingVisual`, `TrailingVisual`, `Divider`)
is exercised inside this baseline and carries no fixture of its own.

### Fixture table

| fixture | exercises (coverage axis) | component state / canned children | baselined? |
|---|---|---|---|
| `navlist` | root `children` (static assembly) + `aria-label` + every slot leaf's `children` slot | root `aria-label: "Repository"`, `children: [it1, it2, div1, grp]` — `it1`=`Item` "Dashboard" (`aria-current: "page"`, `href: "#/dashboard"`, `LeadingVisual`→`Icon` `home`); `it2`=`Item` "Pull requests" (`href: "#/pulls"`, `defaultOpen: true`, `LeadingVisual`→`Icon` `git-pull-request`, `TrailingVisual`→`CounterLabel` "8", `Description` (inline) "Open and merged", `SubNav`[`Item` "Open"+href, `Item` "Closed"+href], `TrailingAction` `pin-icon`→`Icon` `pin` + label "Pin" + `action: functionCall consoleLog {message: "pin"}`); `div1`=`Divider`; `grp`=`Group` (`GroupHeading` "Support")[`Item` "Docs"+href, `Item` "Community"+href] — all 10 subcomponent leaves present | yes |

### Prop-coverage map

| adapter prop | covered by |
|---|---|
| `children` | `navlist` (static assembly) — the family's composed baseline |
| `aria-label` | render-test assertion (`aria-label` on the `<nav>` region; also set in the baseline) |
| `aria-labelledby` | render-test assertion (`aria-labelledby` forwarded to the `<nav>`) |

---

## Agent section

Omitted. `NavList` (the root) emits no `event`-shaped `Action` and carries no `Action`. The family's
single agent site is `navlist-trailingaction` (its `action` accepts the `event` shape) — see
`navlist-trailingaction.md`.
