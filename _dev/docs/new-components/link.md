# Link

- **Official documentation URL:** https://primer.style/components/link
- **Real prop surface resolved from:** `@primer/react` installed type declarations at
  `node_modules/@primer/react/dist/Link/Link.d.ts`, following the `PolymorphicProps` spread in
  `node_modules/@primer/react/dist/utils/modern-polymorphic.d.ts`.
  `LinkProps = PolymorphicProps<As, 'a', StyledLinkProps>` with
  `StyledLinkProps = { as?, hoverColor? (@deprecated), muted?, inline? }`.
  Real props: the Link-specific props (`as`, `hoverColor`, `muted`, `inline`) and the full `a`
  host-element spread (`href`, `children`, `target`, `rel`, `download`, `referrerPolicy`, `ping`,
  `ref`, `id`, `className`, `style`, `title`, `role`, `tabIndex`, `dir`, `lang`, all `aria-*`,
  all `data-*`, all DOM event handlers). The docs additionally list `underline` as deprecated in
  favor of `inline`; it is absent from the installed types.
- **Component-level description (→ `catalog.json` `description`):** A hyperlink that navigates to
  a URL when clicked, rendered as styled link text.

---

## Adapter section

### Prop-surface table

| prop | decision | synthetic? | A2UI type | description |
|---|---|---|---|---|
| `text` | carry (required) | yes | `DynamicString` | The link's textual content. |
| `href` | carry (required) | no | `DynamicString` | The URL the link navigates to when clicked. |
| `muted` | carry | no | `z.boolean() (default: false)` | Renders the link in a less prominent shade. |
| `inline` | carry | no | `z.boolean() (default: false)` | Underlines the link, for links positioned within a block of text. |
| `target` | carry | no | `z.enum(['_self','_blank']) (default: "_self")` | Whether the linked URL opens in the same tab (`_self`) or a new tab (`_blank`). |
| `accessibility` | carry | no | `AccessibilityAttributes` | Accessibility label/description for assistive technologies, e.g. a fuller link description than the visible text. |

### Functions

None. Link carries no `Action` (navigation only — its designed interaction is `href`) and needs
no local function.

### Dropped / deferred props

| prop | reason |
|---|---|
| `as` | Polymorphic selector that switches the component's identity/behavior (render as a button, router link) rather than choosing among display-equivalent elements → dropped per the selector rule. |
| `hoverColor` | Deprecated in the installed types; styling passthrough. |
| `underline` (docs only) | Deprecated alias of `inline`; absent from the installed types — nothing to carry. |
| `aria-*` slice of the `a` host-element spread | Carried through the `accessibility` common, not as raw aria props. |
| `rel`, `download`, `referrerPolicy`, `ping`, `id`, `title`, `role`, `tabIndex`, `dir`, `lang`, `className`, `style`, `ref`, `data-*`, DOM event handlers (`onClick`, …), and the rest of the non-`aria-*` `a` host-element spread | Dropped: no A2UI representation. Event handlers are incidental host-element inheritance — Link's designed interaction is navigation via `href`, not an `Action`. |

> `children` is not dropped — it is the raw-content channel, superseded by the synthetic `text`
> prop (synthetic-content-prop rule: raw content → synthetic value prop typed `DynamicString`).

---

## Client section

### Fixture table

| fixture | exercises (coverage axis) | component state / canned values | baselined? |
|---|---|---|---|
| `link` | content channel — literal | `text: "View on GitHub"`; `href: "https://github.com"` | yes |
| `link-bound` | content + destination — bound (path binding on both `DynamicString`s, semantically coupled as a data-driven link) | `text: {path: "/linkText"}`; `href: {path: "/linkUrl"}`; data model `{linkText: "Bound link", linkUrl: "https://github.com"}` | yes |
| `link-muted` | visually-distinct state — `muted` | `text: "Muted link"`; `muted: true`; `href: "https://github.com"` | yes |
| `link-inline` | visually-distinct state — `inline` | `text: "Inline link"`; `inline: true`; `href: "https://github.com"` | yes |

Single-axis otherwise; the only combined fixture is `link-bound` (the two bound `DynamicString`s
are semantically coupled).

### Prop-coverage map

| adapter prop | covered by |
|---|---|
| `text` | `link` (literal) + `link-bound` (bound) |
| `href` | `link-bound` (bound) + every fixture (literal, required) + render-test assertion (anchor `href` attribute) |
| `muted` | `link-muted` |
| `inline` | `link-inline` |
| `target` | render-test assertion (anchor `target="_blank"` attribute) |
| `accessibility` | render-test assertion |

Every carried prop is covered — four baselined fixtures for the visual props, render-test
assertions for the non-visual axes (`href` attribute, `target`, `accessibility`).

---

## Agent section

Omitted. Link emits no `event`-shaped `Action` (it carries no `Action` at all — navigation only),
so per the Orchestration skip rule there is no agent surface to design.
