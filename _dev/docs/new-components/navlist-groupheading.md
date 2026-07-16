# NavList.GroupHeading

- **Official documentation URL:** https://primer.style/components/nav-list
- **Real prop surface resolved from:** `@primer/react` type declarations at
  `node_modules/@primer/react/dist/NavList/NavList.d.ts` (v38.28.0):
  `NavListGroupHeadingProps = ActionListGroupHeadingProps` (`ActionList/Group.d.ts`) =
  `Pick<ActionListGroupProps, 'variant' | 'auxiliaryText'> & Omit<ActionListHeadingProps, 'as'> &
  React.HTMLAttributes<HTMLElement> & { as?: 'h1'|'h2'|'h3'|'h4'|'h5'|'h6'; headingWrapElement?: 'div'|'li';
  _internalBackwardCompatibleTitle?: string; variant?: 'filled'|'subtle' }`; content comes through
  `children` (raw heading text). `visuallyHidden` is documented for the heading.
- **Component-level description (→ `catalog.json` `description`):** A semantic heading for a group of
  navigation items.

> Part of the `NavList` compound family (6.41) — see `navlist.md` for the family overview and shared
> conventions (synthetic `text` content channel, `heading.md` rule).

---

## Adapter section

### Prop-surface table

| prop | decision | synthetic? | A2UI type | description |
|---|---|---|---|---|
| `text` | carry (required) | yes | `DynamicString` | The group heading's text. |
| `variant` | carry | no | `z.enum(['subtle','filled'])` | The heading's visual style; `filled` is superimposed on a background, `subtle` is less offset. |
| `auxiliaryText` | carry | no | `DynamicString` | Secondary text providing additional information about the group. |
| `visuallyHidden` | carry | no | `z.boolean()` | Whether the heading is hidden visually but kept available to assistive technologies. |
| `as` | carry | no | `z.enum(['h1','h2','h3','h4','h5','h6'])` | The heading level in the document outline. |

`text` is the synthetic content channel (raw `children` → synthetic value prop, `heading.md` rule).

### Functions

None. Carries no `Action` and needs no local function.

### Dropped / deferred props

| prop | reason |
|---|---|
| `headingWrapElement` | Not in the doc's props table; an internal wrapping-element choice with no author-facing meaning. |
| `_internalBackwardCompatibleTitle` | Internal backward-compat shim; not a documented prop. |
| `className`, `style`, and the rest of the HTML-element attribute spread | Dropped: no A2UI representation. |

---

## Client section

`text` (literal) is covered by the composed `navlist` baseline (`navlist.md`) group heading. Dedicated
fixtures cover the `variant` gallery and `text` path binding. `auxiliaryText` / `visuallyHidden` / `as`
are non-visual (or covered by assertion). Each fixture renders the heading inside a realistic
`NavList` group.

### Fixture table

| fixture | exercises (coverage axis) | component state / canned values | baselined? |
|---|---|---|---|
| `navlist-groupheading-variants` | visual enum — `variant` | one surface per `['subtle','filled']`; each a `NavList`[`Group`[`GroupHeading` `text: <variant>`, `Item` "Item A"+href, `Item` "Item B"+href]] | yes (one PNG) |
| `navlist-groupheading-bound` | content channel — `text` bound (path binding) | `NavList`[`Group`[`GroupHeading` `text: {path: "/heading"}`, `Item` "Docs"+href]]; data model `{heading: "Resources"}` | yes |

### Prop-coverage map

| adapter prop | covered by |
|---|---|
| `text` | composed `navlist` baseline (literal) + `navlist-groupheading-bound` (bound) |
| `variant` | `navlist-groupheading-variants` |
| `auxiliaryText` | render-test assertion (secondary text rendered) |
| `visuallyHidden` | render-test assertion (heading visually hidden but present for assistive tech) |
| `as` | render-test assertion (rendered heading level `h1`–`h6`) |

---

## Agent section

Omitted. Emits no `event`-shaped `Action` (no `Action` at all), per the family skip rule.
