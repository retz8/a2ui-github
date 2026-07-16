# PageHeader

- **Official documentation URL:** https://primer.style/components/page-header
- **Real prop surface resolved from:** `@primer/react` installed type declarations at
  `node_modules/@primer/react/dist/PageHeader/PageHeader.d.ts` (v38.28.0) and the implementation
  at `node_modules/@primer/react/dist/PageHeader/PageHeader.js` (authority on defaults and the
  per-region responsive `hidden` behavior). Root `PageHeaderProps = { 'aria-label'?, as?:
  React.ElementType | 'header' | 'div', className?, role?: AriaRole, hasBorder? }`; the root render
  destructures `{ children, className, as, 'aria-label', role, hasBorder }` — **no `hidden`** (the
  doc's props table lists `hidden` for the root, but the type and render do not carry it; code is
  authority). Root `as` default `"div"`, `hasBorder` default `false`.
- **Component-level description (→ `catalog.json` `description`):** The heading region at the top
  of a page — carries the page title and the contextual navigation, actions, and supporting
  metadata around it.

> `PageHeader` ships as a **compound family**, mirroring the component library one-to-one: the root
> plus its 14 subcomponents are each shipped as a sibling catalog leaf in the same 6.36 sub-task,
> each with its own decision doc:
>
> - `pageheader-contextarea.md`, `pageheader-parentlink.md`, `pageheader-contextbar.md`,
>   `pageheader-contextareaactions.md`
> - `pageheader-titlearea.md`, `pageheader-leadingaction.md`, `pageheader-leadingvisual.md`,
>   `pageheader-title.md`, `pageheader-trailingvisual.md`, `pageheader-trailingaction.md`,
>   `pageheader-actions.md`
> - `pageheader-breadcrumbs.md`, `pageheader-description.md`, `pageheader-navigation.md`
>
> The root's `children` slot references the region leaves (`ContextArea`, `TitleArea`,
> `Breadcrumbs`, `Description`, `Navigation`); each region leaf references its own slot leaves. The
> catalog stays permissive on which child goes in which slot — the leaves are shipped; the agent
> composes them per the component library's structure. Every slot uses the `ChildList`
> container-slot convention (`stack.md`).

## Conventions established / reused by this family

- **`responsive(z.boolean())` for `hidden`.** Every subcomponent (not the root) carries `hidden`
  as the full `ResponsiveValue<boolean>` union via the `responsive()` helper (`stack.md`) — either a
  plain `boolean`, or `{ narrow?, regular?, wide? }`. It is carried **optional with no schema
  default**: when unset, the component library applies its own per-region responsive default
  (context region → hidden on regular+wide; `LeadingAction`/`TrailingAction` → hidden on narrow; the
  rest → visible). The adapter forwards `hidden` only when set, so that internal default is
  preserved. Coverage follows the Stack precedent: multi-viewport visual baselines are **deferred**
  infra (`deferred-catalog-work.md`), so `hidden` is covered by a render-test assertion (the
  `hidden`/`data-hidden` attributes are emitted) rather than a baselined fixture.
- **`aria-label` / `aria-labelledby` shipped as literal `DynamicString` props** — not the
  `AccessibilityAttributes` common — on the three leaves whose documented props table lists aria
  attributes (root `PageHeader`, `ParentLink`, `Navigation`). Every other leaf lists no aria prop,
  so none is carried there.
- **Doc-faithful prop surfaces.** Each leaf carries exactly the props its documented props table
  lists (minus the always-dropped `className` styling passthrough, plus the synthetic content
  channel where content comes through `children` as raw text). Props absent from the doc's table are
  not carried (e.g. `ParentLink` drops `target`).

---

## Adapter section

### Prop-surface table

| prop | decision | synthetic? | A2UI type | description |
|---|---|---|---|---|
| `children` | carry (optional) | yes | `ChildList` | The regions and content arranged inside the page header. |
| `as` | carry | no | `z.enum(['header','div']) (default: "div")` | The HTML element used to render the header; selects its landmark identity. |
| `role` | carry | no | `z.string()` | An ARIA role overriding the header's default landmark role. |
| `hasBorder` | carry | no | `z.boolean() (default: false)` | Whether a divider border is shown below the header. |
| `aria-label` | carry | no | `DynamicString` | An accessible label for the header region, for assistive technologies. |

`children` is `carry (optional)` — faithful to the optional `children` type; the root carries no
`hidden` (code authority, above).

### Functions

None. `PageHeader` carries no `Action` and needs no local function.

### Dropped / deferred props

| prop | reason |
|---|---|
| `hidden` | Not a root prop: the root type and render do not carry it (the doc's props table is stale here). Carried on the subcomponents, not the root. |
| `className` | Styling passthrough; no A2UI representation. |

---

## Client section

Composed-centered coverage (see the family note). The single composed `pageheader` fixture is the
family's shared baseline: a fully assembled header built from already-shipped filler leaves (`Text`,
`Heading`, `Button`, `IconButton`, `Icon`, `Label`, `Link`) that visually covers **every**
container leaf's `children` slot at once. The dev-only "interactive items in `TitleArea`" focus-order
warning may fire for the busy assembly; it does not affect rendering or the baseline.

### Fixture table

| fixture | exercises (coverage axis) | component state / canned children | baselined? |
|---|---|---|---|
| `pageheader` | root `children` (static assembly) + every container leaf's `children` slot | root `children`: `[ctx, ta, bc, desc, nav]` — `ctx`=`ContextArea`[`ParentLink` "Issues"+href, `ContextBar`(Text), `ContextAreaActions`(IconButton)]; `ta`=`TitleArea` (variant medium)[`LeadingAction`(IconButton back), `LeadingVisual`(Icon), `Title` "Pull request #42", `TrailingVisual`(Label "Open"), `TrailingAction`(IconButton), `Actions`(Button "Edit", Button "New")]; `bc`=`Breadcrumbs`(Link×2); `desc`=`Description`(Text); `nav`=`Navigation`(Link×3) — all 14 subcomponent leaves present | yes |
| `pageheader-hasborder` | visually-distinct state — `hasBorder` | `hasBorder: true`; children: a `TitleArea`+`Title` only (border legible without full assembly) | yes |

### Prop-coverage map

| adapter prop | covered by |
|---|---|
| `children` | `pageheader` (static assembly) — the family's composed baseline |
| `as` | render-test assertion (rendered element `header`/`div`; `div` default) |
| `role` | render-test assertion (`role` attribute forwarded) |
| `hasBorder` | `pageheader-hasborder` |
| `aria-label` | render-test assertion (`aria-label` on the header region) |

---

## Agent section

Omitted. `PageHeader` emits no `event`-shaped `Action` (no `Action` at all), so per the
Orchestration skip rule there is no agent surface to design. This holds for the entire family — no
leaf carries an `Action`.
