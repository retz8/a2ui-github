# UnderlineNav

- **Official documentation URL:** https://primer.style/components/underline-nav
- **Real prop surface resolved from:** `@primer/react` installed type declarations at
  `node_modules/@primer/react/dist/UnderlineNav/UnderlineNav.d.ts` (v38.28.0) and the implementation
  `UnderlineNav.js` (authority on defaults: `as = 'nav'`, `loadingCounters = false`,
  `variant = 'inset'`; enforces an `aria-label` invariant and a single-current-item invariant).
  `UnderlineNavProps = { children: React.ReactNode; 'aria-label'?: string; as?: React.ElementType;
  className?: string; loadingCounters?: boolean; variant?: 'inset' | 'flush' }`. The doc's props
  table marks `aria-label` **required** and omits `as`; the code's invariant confirms `aria-label`
  is effectively required — doc + code agree, the type is loose.
- **Component-level description (→ `catalog.json` `description`):** A horizontal row of navigation
  tabs indicating the current page with an underline.

> UnderlineNav ships as a **compound family** of two leaves, mirroring the component library
> one-to-one: the root plus **`UnderlineNav.Item`** (`underline-nav-item.md`), shipped together in
> the same 6.43 sub-task. The root's `children` slot references the item leaf via the `ChildList`
> container-slot convention (`stack.md`). The `/deprecated`-entry `UnderlineNav` is superseded by
> this main-entry component and is ignored.
>
> Overflow is **internal behavior**: on narrow widths the root collapses items into a "More"
> disclosure menu on its own (no prop controls it) — nothing to carry.

## Conventions established / reused by this family

- **`ChildList` slot (`stack.md`)** for the root's `children`, carried **required** — the installed
  type and the doc both require it (ActionBar/AvatarStack precedent).
- **`aria-label` as literal `DynamicString`** on the root (not the `AccessibilityAttributes`
  common), following the NavList/PageHeader family convention — carried **required** (doc-required,
  code-enforced invariant).
- **Icons are the `Icon` leaf referenced by `ComponentId`** — `Item.leadingVisual` is element-typed
  and carries as a `ComponentId` (Button.icon precedent).
- **Interaction model.** Unlike `NavList.Item` (href-only), `UnderlineNav.Item` **documents a select
  handler** (`onSelect`, click + keyboard) and therefore carries an optional `Action` alongside its
  optional `href` — a tab can be a pure link, selection-driven, or both. The item is the family's
  **sole agent site**.
- **Doc-faithful prop surfaces.** Each leaf carries exactly the props its documented props table
  lists, minus the always-dropped styling passthroughs and the non-`aria-*` host-attribute spread,
  plus the synthetic `text` content channel on the item (raw-text `children` → synthetic value
  prop).

---

## Adapter section

### Prop-surface table

| prop | decision | synthetic? | A2UI type | description |
|---|---|---|---|---|
| `children` | carry (required) | yes | `ChildList` | The navigation items arranged in the tab row. |
| `aria-label` | carry (required) | no | `DynamicString` | An accessible name for the navigation region. |
| `loadingCounters` | carry | no | `DynamicBoolean (default: false)` | Whether the items' counters are loading; all counters show a loading state until every count resolves. |
| `variant` | carry | no | `z.enum(['inset','flush']) (default: "inset")` | Whether items are offset from the container edges (`inset`) or flush with them (`flush`). |

### Functions

None. The root carries no `Action` and needs no local function.

### Dropped / deferred props

| prop | reason |
|---|---|
| `as` | Not in the documented props table, and it switches the nav-landmark identity (default `'nav'`) — an identity switch, not a display-equivalent set. |
| `className` and the rest of the non-`aria-*` host-element spread | Dropped: no A2UI representation. |

---

## Client section

Composed-centered coverage (family convention): the composed `underline-nav` fixture is the family's
shared baseline — a realistic repository tab row that also carries the item leaf's literal axes
(`text`, `href`, `aria-current`, `leadingVisual`, `counter`). Items always render inside a realistic
`UnderlineNav`, never bare. The item's interaction fixtures live in `underline-nav-item.md`.

Single-axis throughout; the only combined fixture is `underline-nav-loading` (`loadingCounters` is
meaningless without counters present).

### Fixture table

| fixture | exercises (coverage axis) | component state / canned values | baselined? |
|---|---|---|---|
| `underline-nav` | root `children` (static assembly) + `aria-label` + item `text` (literal) / `href` / `aria-current` / `leadingVisual` / `counter` | root `aria-label: "Repository"`, `children: [t1..t4]` — `t1` "Code" (`leadingVisual`→`Icon` `code`, `aria-current: "page"`, `href: "#/code"`); `t2` "Issues" (`Icon` `issue-opened`, `counter: "12"`, `href: "#/issues"`); `t3` "Pull requests" (`Icon` `git-pull-request`, `counter: "4"`, `href: "#/pulls"`); `t4` "Settings" (plain text, `href: "#/settings"`) | yes |
| `underline-nav-children-template` | root `children` — dynamic template (tabs from a bound array) + item `text`/`href` bound | `children: {componentId:'tab', path:'/tabs'}`; `tab` = `UnderlineNav.Item` with `text:{path:'./label'}`, `href:{path:'./url'}`; data model `/tabs = [{label:'Code',url:'#/code'},{label:'Issues',url:'#/issues'},{label:'Pull requests',url:'#/pulls'}]` | yes |
| `underline-nav-variant` | visual enum — root `variant` | gallery: one surface per `['inset','flush']`, each a 3-tab nav | yes (one PNG) |
| `underline-nav-loading` | visually-distinct state — `loadingCounters` (coupled with `counter`) | 3 tabs with counters (`"12"`, `"4"`, `"8"`), `loadingCounters: true` | yes |

### Prop-coverage map

| adapter prop | covered by |
|---|---|
| `children` | `underline-nav` (static assembly) + `underline-nav-children-template` (dynamic template) |
| `aria-label` | render-test assertion (`aria-label` on the `<nav>` region; set in every fixture) |
| `loadingCounters` | `underline-nav-loading` |
| `variant` | `underline-nav-variant` |

---

## Agent section

Omitted. The root carries no `Action`. The family's single agent site is `underline-nav-item` (its
`action` accepts the `event` shape) — see `underline-nav-item.md`.
