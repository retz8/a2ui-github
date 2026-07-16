# PageHeader.ParentLink

- **Official documentation URL:** https://primer.style/components/page-header
- **Real prop surface resolved from:** `@primer/react` type declarations at
  `node_modules/@primer/react/dist/PageHeader/PageHeader.d.ts` (v38.28.0):
  `ParentLink: PolymorphicForwardRefComponent<"a", ParentLinkProps>` where
  `ParentLinkProps = React.PropsWithChildren<ChildrenPropTypes & LinkProps>`, `LinkProps` picks
  `download | href | hrefLang | media | ping | rel | target | type | referrerPolicy | as` off the
  anchor surface plus `'aria-label'`, and `ChildrenPropTypes = { className?, hidden?: boolean |
  ResponsiveValue<boolean> }`. Implementation `PageHeader.js`: `hidden` default
  `hiddenOnRegularAndWide` (visible on narrow only); renders a back-arrow octicon before the label.
  The **documented props table lists only `aria-label`, `href`, `hidden`, `className`** — so the rest
  of the anchor surface (`target`, `rel`, `download`, …) is not carried.
- **Component-level description (→ `catalog.json` `description`):** A link that navigates up to the
  parent page, shown above the title on narrow viewports.

> Part of the `PageHeader` compound family (6.36) — see `pageheader.md` for the family overview and
> shared conventions. Mirrors the shipped `Link` leaf's curated anchor surface (synthetic `text` +
> `href`), narrowed to the props the documentation lists for `ParentLink`.

---

## Adapter section

### Prop-surface table

| prop | decision | synthetic? | A2UI type | description |
|---|---|---|---|---|
| `text` | carry (required) | yes | `DynamicString` | The link's textual label. |
| `href` | carry (required) | no | `DynamicString` | The URL of the parent page the link navigates to when clicked. |
| `aria-label` | carry | no | `DynamicString` | An accessible label for the link, for assistive technologies. |
| `hidden` | carry | no | `responsive(z.boolean())` | Whether the link is hidden, optionally per viewport width (`narrow`/`regular`/`wide`). Unset applies the library default: hidden on regular and wide, visible on narrow only. |

`text` and `href` are `required` (a parent link needs both a label and a destination), mirroring the
shipped `Link` leaf.

### Functions

None. Carries no `Action` — navigation is via `href`, as with the `Link` leaf.

### Dropped / deferred props

| prop | reason |
|---|---|
| `target`, `rel`, `download`, `hrefLang`, `media`, `ping`, `type`, `referrerPolicy` | Not in the documented `ParentLink` props table; not carried. (`Link` likewise carries only `target` of the anchor tail, and `ParentLink`'s table omits even that.) |
| `as` | Polymorphic selector that switches the element's identity/behavior → dropped per the selector rule (as with `Link`). |
| `className` | Styling passthrough; no A2UI representation. |

> `children` is not dropped — it is the raw-content channel, superseded by the synthetic `text` prop
> (synthetic-content-prop rule: raw text content → synthetic value prop typed `DynamicString`).

---

## Client section

Two baselined fixtures mirror the shipped `Link` leaf (literal + bound); `aria-label` and `hidden`
are render-test assertions.

### Fixture table

| fixture | exercises (coverage axis) | component state / canned values | baselined? |
|---|---|---|---|
| `parentlink` | content + destination — literal | `text: "Issues"`; `href: "/repos/acme/issues"` | yes |
| `parentlink-bound` | content + destination — bound (path binding on both `DynamicString`s, semantically coupled as a data-driven link) | `text: {path:'/parent/label'}`; `href: {path:'/parent/url'}`; data model `{parent:{label:'Issues', url:'/repos/acme/issues'}}` | yes |

### Prop-coverage map

| adapter prop | covered by |
|---|---|
| `text` | `parentlink` (literal) + `parentlink-bound` (bound) |
| `href` | `parentlink` (literal) + `parentlink-bound` (bound) + render-test assertion (anchor `href` attribute) |
| `aria-label` | render-test assertion (`aria-label` on the anchor) |
| `hidden` | render-test assertion (`data-hidden` attributes emitted; multi-viewport deferred) |

---

## Agent section

Omitted. Emits no `event`-shaped `Action` (navigation via `href` only), per the family skip rule.
