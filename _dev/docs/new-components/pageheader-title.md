# PageHeader.Title

- **Official documentation URL:** https://primer.style/components/page-header
- **Real prop surface resolved from:** `@primer/react` type declarations at
  `node_modules/@primer/react/dist/PageHeader/PageHeader.d.ts` (v38.28.0):
  `Title: React.FC<React.PropsWithChildren<TitleProps>>` where
  `TitleProps = { as?: 'h1'|'h2'|'h3'|'h4'|'h5'|'h6' } & ChildrenPropTypes` and
  `ChildrenPropTypes = { className?, hidden?: boolean | ResponsiveValue<boolean> }`. Implementation
  `PageHeader.js`: renders `<Heading as={as}>{children}</Heading>`; `as` default `"h2"`, `hidden`
  default `false` (visible on all viewports).
- **Component-level description (→ `catalog.json` `description`):** The page's main heading text,
  with a selectable semantic level.

> Part of the `PageHeader` compound family (6.36) — see `pageheader.md` for the family overview.
> `Title` renders a heading, so it mirrors the shipped `Heading` leaf: synthetic `text` +
> `as` (`h1`–`h6`), rather than a generic `ChildList` slot like its sibling subcomponents.

---

## Adapter section

### Prop-surface table

| prop | decision | synthetic? | A2UI type | description |
|---|---|---|---|---|
| `text` | carry (required) | yes | `DynamicString` | The heading's textual content. |
| `as` | carry | no | `z.enum(['h1','h2','h3','h4','h5','h6']) (default: "h2")` | The heading element to render; selects the semantic level in the document outline. |
| `hidden` | carry | no | `responsive(z.boolean())` | Whether the title is hidden, optionally per viewport width (`narrow`/`regular`/`wide`). Unset applies the library default: visible on all viewports. |

### Functions

None. Carries no `Action` and needs no local function.

### Dropped / deferred props

| prop | reason |
|---|---|
| `className` | Styling passthrough; no A2UI representation. |

> `children` is not dropped — it is the raw-content channel, superseded by the synthetic `text` prop
> (synthetic-content-prop rule: raw text content → synthetic value prop typed `DynamicString`).

---

## Client section

Two baselined fixtures mirror the shipped `Heading` leaf (literal + bound); `as` and `hidden` are
render-test assertions. `as` is non-visual for the title (the heading level does not change the
rendered size — `variant` on `TitleArea` controls that), so it is covered by a render-test as with
`Heading`.

### Fixture table

| fixture | exercises (coverage axis) | component state / canned values | baselined? |
|---|---|---|---|
| `title` | content channel — literal | `text: "Pull request #42"` | yes |
| `title-bound` | content channel — bound (path binding) | `text: {path:'/pr/title'}`; data model `{pr:{title:'Bound title'}}` | yes |

### Prop-coverage map

| adapter prop | covered by |
|---|---|
| `text` | `title` (literal) + `title-bound` (bound) |
| `as` | render-test assertion (non-visual) — render with each `as` value, assert the matching `h1`…`h6` element; assert `h2` default when unset |
| `hidden` | render-test assertion (`data-hidden` attributes emitted; multi-viewport deferred) |

---

## Agent section

Omitted. Emits no `event`-shaped `Action` (no `Action` at all), per the family skip rule.
