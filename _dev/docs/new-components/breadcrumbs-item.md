# Breadcrumbs.Item

- **Official documentation URL:** https://primer.style/components/breadcrumbs
- **Real prop surface resolved from:** `@primer/react` installed type declarations at
  `node_modules/@primer/react/dist/Breadcrumbs/Breadcrumbs.d.ts`, following the `PolymorphicProps`
  spread in `node_modules/@primer/react/dist/utils/modern-polymorphic.d.ts`:
  `BreadcrumbsItemProps<As> = PolymorphicProps<As, 'a', { to?: To; selected?: boolean }>` —
  polymorphic over base element `'a'`. Real props: the item-specific props (`to`, `selected`,
  `as`) plus the full `a` host-element spread (`href`, `children`, `target`, `rel`, `download`,
  `id`, `title`, `role`, `tabIndex`, `className`, `style`, all `aria-*`, all `data-*`, DOM event
  handlers, `ref`). Reconciled against the implementation (`BreadcrumbsItem` in `Breadcrumbs.js`):
  renders `<Component aria-current={selected ? 'page' : undefined} className={…selected &&
  'selected'} {...rest}>` with `Component = as || 'a'`; `selected` is static (no `onChange`, no
  interactive selection).
- **Component-level description (→ `catalog.json` `description`):** A single crumb within a
  breadcrumb trail — a link to one level of the hierarchy, or the current page.

> The crumb leaf for `Breadcrumbs` (see `breadcrumbs.md`), shipped as a sibling leaf in the same
> 6.44 sub-task. It renders only inside a `Breadcrumbs`. `label` is the synthetic content channel
> for the raw-text `children` (the `Text` precedent); navigation is via `href` (the `Link`
> precedent).

Unlike `SegmentedControl` (6.32) — where per-child `selected` was promoted to a parent
`selectedIndex` because Primer centralized change via `onChange(selectedIndex)` — `Breadcrumbs`
has no `onChange` and no interactive selection. `selected` is static "current page" authoring
state, so it stays **per-child** on the item, faithful to Primer (no promotion).

---

## Adapter section

### Prop-surface table

| prop | decision | synthetic? | A2UI type | description |
|---|---|---|---|---|
| `label` | carry (required) | yes (← `children`) | `DynamicString` | The visible text of the crumb. |
| `href` | carry | no | `DynamicString` | The URL this crumb navigates to when clicked. Optional — the current-page crumb may be non-navigating. |
| `selected` | carry | no | `DynamicBoolean` | Whether this crumb is the current page; shown as the active crumb and conveyed to assistive technologies (`aria-current="page"`). |
| `target` | carry | no | `z.enum(['_self','_blank']) (default: "_self")` | Whether the crumb opens in the same tab (`_self`) or a new tab (`_blank`). |
| `accessibility` | carry | no | `AccessibilityAttributes` | Accessibility label/description for assistive technologies, beyond the visible crumb text. |

`label` is the synthetic content channel for Primer's raw-text `children` (the `Text` precedent —
literal or path-bound `DynamicString`), required as the crumb's primary content. `href` is
`carry` (optional): navigation is per-crumb, but the current-page crumb (`selected`) reasonably
omits a destination — a Breadcrumbs-specific divergence from `Link`'s required `href`. `selected`
is a `DynamicBoolean` so it stays bindable per item in a template-generated trail (the dominant
breadcrumb authoring pattern). `target` and `accessibility` mirror `Link` (6.6).

### Functions

None. `Breadcrumbs.Item` carries no `Action` (navigation only — its designed interaction is
`href`) and needs no local function.

### Dropped / deferred props

| prop | reason |
|---|---|
| `to` | react-router link target; only meaningful when `as` is a router `Link`. Navigation is carried through `href` for this leaf — same basis `Link` dropped its router integration. |
| `as` | Polymorphic selector that switches the item's identity/behavior (render as a router `Link`, `button`) rather than choosing among display-equivalent elements → dropped per the selector rule (`Link` precedent). |
| `aria-*` slice of the `a` host-element spread | Carried through the `accessibility` common, not as raw aria props. |
| `className`, `style`, `id`, `title`, `role`, `tabIndex`, `rel`, `download`, `data-*`, DOM event handlers (`onClick`, …), `ref`, and the rest of the non-`aria-*` `a` host-element spread | Dropped: no A2UI representation. Event handlers are incidental host-element inheritance — the crumb's designed interaction is navigation via `href`, not an `Action`. |

> `children` is not dropped — it is the raw-content channel, superseded by the synthetic `label`
> prop (synthetic-content-prop rule: raw content → synthetic value prop typed `DynamicString`).

---

## Client section

Every fixture is parent-wrapped — the crumb renders only inside a `Breadcrumbs` (the
`SegmentedControl.Button` / `Stack.Item` precedent). The `label` **bound** path is already proven
by the parent's `breadcrumbs-children-template` fixture (same framework binder), so this leaf
covers `label` with literal content only.

### Fixture table

| fixture | exercises (coverage axis) | component state / canned values | baselined? |
|---|---|---|---|
| `breadcrumbsitem` | content — `label` literal (+ defaults) | parent `Breadcrumbs` → 3 items with literal labels (*Home*/*Repositories*/*Settings*), each with `href` | yes |
| `breadcrumbsitem-selected` | visually-distinct state — `selected` (current page, non-navigating) | 3 items; last `selected: true` **and no `href`** (the current-page crumb: active styling + `aria-current`, non-navigating) | yes |

### Prop-coverage map

| adapter prop | covered by |
|---|---|
| `label` | `breadcrumbsitem` (literal); bound path via the parent's `breadcrumbs-children-template` (same framework binder) |
| `href` | `breadcrumbsitem` (present) + render-test assertion (anchor `href` attribute); absence shown by `breadcrumbsitem-selected` |
| `selected` | `breadcrumbsitem-selected` |
| `target` | render-test assertion (anchor `target` attribute) |
| `accessibility` | render-test assertion (`aria-label` / `aria-description` on the crumb) |

---

## Agent section

Omitted. `Breadcrumbs.Item` emits no `event`-shaped `Action` (no `Action` at all — navigation
only), so per the Orchestration skip rule there is no agent surface to design.
