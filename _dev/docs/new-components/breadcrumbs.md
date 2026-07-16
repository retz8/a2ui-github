# Breadcrumbs

- **Official documentation URL:** https://primer.style/components/breadcrumbs
- **Real prop surface resolved from:** `@primer/react` installed type declarations at
  `node_modules/@primer/react/dist/Breadcrumbs/Breadcrumbs.d.ts`
  (`BreadcrumbsProps = React.PropsWithChildren<{ className?; overflow?: 'wrap' | 'menu' |
  'menu-with-root'; variant?: 'normal' | 'spacious'; style? }>`), reconciled against the
  implementation `Breadcrumbs.js` (the authority on what is actually wired). Implementation
  defaults (code is authority): `overflow = 'wrap'`, `variant = 'normal'`. The parent renders a
  `<nav aria-label="Breadcrumbs" data-overflow=… data-variant=…>` wrapping an `<ol>` of the crumb
  items; the `menu`/`menu-with-root` modes collapse overflowing crumbs into an internal kebab
  dropdown that Primer renders itself (an `ActionList` inside a `Details`) — width-triggered via a
  `ResizeObserver`, no catalog-level overlay infrastructure is involved. The `<nav>`'s
  `aria-label` is hardcoded (not author-facing) and the prop type carries no `aria-*`/HTML spread,
  so the parent has no accessibility surface — the crumbs (the links) do.
- **Component-level description (→ `catalog.json` `description`):** A navigation trail showing the
  user's location within a hierarchy, as a row of links from the root to the current page.

> `Breadcrumbs` ships as a compound family, mirroring Primer: `Breadcrumbs.Item` is shipped as a
> sibling catalog leaf in the same 6.44 sub-task, with its own decision doc at
> `breadcrumbs-item.md`. `Breadcrumbs`'s `children` slot references `Breadcrumbs.Item`s and uses
> the `ChildList` container-slot convention established by `stack.md` (6.23).

---

## Adapter section

### Prop-surface table

| prop | decision | synthetic? | A2UI type | description |
|---|---|---|---|---|
| `children` | carry (optional) | yes | `ChildList` | The crumbs shown in the trail. |
| `overflow` | carry | no | `z.enum(['wrap','menu','menu-with-root']) (default: "wrap")` | How the trail handles crumbs that don't fit: `wrap` flows them onto extra lines; `menu` and `menu-with-root` collapse the overflow into a dropdown menu. |
| `variant` | carry | no | `z.enum(['normal','spacious']) (default: "normal")` | The visual density; `spacious` uses increased padding and a more relaxed layout. |

`children` is `carry (optional)` — faithful to Primer's `PropsWithChildren` (an empty trail is
legal in the type); the only valid children are `Breadcrumbs.Item` leaves. The full three-value
`overflow` enum is carried (including the `menu` modes, which render fine via Primer's internal
`ActionList`/`Details` overlay — the same basis on which `SegmentedControl` carried its internal
`dropdown` variant; multi-width baseline infra stays deferred per the standing convention).

### Functions

None. `Breadcrumbs` carries no `Action` (it is a navigation container; interaction lives on the
`Breadcrumbs.Item` links via `href`) and needs no local function.

### Dropped / deferred props

| prop | reason |
|---|---|
| `className`, `style` | Styling passthroughs; no A2UI representation. |

> No `accessibility` prop: the parent `<nav>`'s `aria-label` is hardcoded (`"Breadcrumbs"`, not
> author-facing) and the prop type exposes no `aria-*` surface — so, like a plain display
> primitive, the parent carries none. The accessible surface lives on the item leaves.

---

## Client section

Children are `Breadcrumbs.Item` leaves (shipped in the same sub-task). The canonical trail is
*Home / Repositories / Settings* with the last crumb `selected`.

### Fixture table

| fixture | exercises (coverage axis) | component state / canned values | baselined? |
|---|---|---|---|
| `breadcrumbs` | content — static `ChildList` (+ defaults) | 3 `Breadcrumbs.Item`s (*Home*/*Repositories*/*Settings*), each with `href`; last `selected: true`; `overflow`/`variant` default | yes |
| `breadcrumbs-children-template` | content — dynamic template (crumbs from a bound array) | `children: {componentId:'crumb', path:'/trail'}`; `crumb` = `Breadcrumbs.Item` with `label:{path:'./name'}`, `href:{path:'./url'}`, `selected:{path:'./current'}`; data model `/trail = [{name:'Home',url:'/',current:false},{name:'Repositories',url:'/repos',current:false},{name:'Settings',url:'/settings',current:true}]` | yes |
| `breadcrumbs-variant` | visual enum — `variant` | gallery: one surface per `['normal','spacious']`; each a 3-crumb trail | yes (one PNG) |

### Prop-coverage map

| adapter prop | covered by |
|---|---|
| `children` | `breadcrumbs` (static array) + `breadcrumbs-children-template` (dynamic template) |
| `overflow` | render-test assertion (`data-overflow` emitted on the `<nav>` for each of `wrap`/`menu`/`menu-with-root`) + manual verify (the actual menu collapse is `ResizeObserver`/width-driven and renders a Primer-internal overlay — not deterministically baselineable, mirroring `SegmentedControl`'s width-triggered `dropdown`) |
| `variant` | `breadcrumbs-variant` |

---

## Agent section

Omitted. `Breadcrumbs` emits no `event`-shaped `Action` (it carries no `Action` at all — a
navigation container), so per the Orchestration skip rule there is no agent surface to design.
