# ActionList.LinkItem

- **Part of the `ActionList` compound family** (6.38) — see `action-list.md` for the family
  note, shared conventions, and the component-level frame.
- **Official documentation URL:** https://primer.style/components/action-list
- **Real prop surface resolved from:** `@primer/react` type declarations at
  `node_modules/@primer/react/dist/ActionList/LinkItem.d.ts`:
  `ActionListLinkItemProps = Pick<ActionListItemProps, 'active' | 'children' | 'inactiveText' |
  'variant' | 'size'> & LinkProps` (+ the `a` host-element spread). `variant`/`size` are picked
  from `Item` and carried faithfully (code is authority) even though the doc's `LinkItem` props
  table omits them. `href` is carried as the essential navigation target (the doc's `ref` is
  React's forwarded DOM ref, not the URL). `target` is carried (the one meaningful anchor
  attribute, matching `Link`); the rest of the `LinkProps` cluster is dropped as obscure
  host-element passthrough (the `Link` precedent).
- **Component-level description (→ `catalog.json` `description`):** An action-list row that
  navigates to a URL when clicked, rendered as a link.

---

## Adapter section

### Prop-surface table

| prop | decision | synthetic? | A2UI type | description |
|---|---|---|---|---|
| `children` | carry (optional) | yes | `ChildList` | The link item's label plus its leading/trailing visuals and description. |
| `href` | carry (required) | no | `DynamicString` | The URL the item navigates to when clicked. |
| `active` | carry | no | `DynamicBoolean (default: false)` | Whether this is the currently-active item (e.g. the current page); at most one item should be active. |
| `inactiveText` | carry | no | `DynamicString` | Text explaining why the item is temporarily unavailable; its presence marks the item inactive. |
| `variant` | carry | no | `z.enum(['default','danger']) (default: "default")` | The item's style; `danger` marks a destructive item. |
| `size` | carry | no | `z.enum(['medium','large']) (default: "medium")` | The item's block size. |
| `target` | carry | no | `z.enum(['_self','_blank']) (default: "_self")` | Whether the URL opens in the same tab (`_self`) or a new tab (`_blank`). |

### Functions

None. `LinkItem`'s designed interaction is navigation via `href`; it carries no `Action` and
needs no local function.

### Dropped / deferred props

| prop | reason |
|---|---|
| `rel`, `download`, `hrefLang`, `media`, `ping`, `type`, `referrerPolicy` | Dropped: obscure host-element anchor attributes, per the `Link` precedent. (`target` is carried — the one meaningful member, matching `Link`.) |
| `as` | Dropped: polymorphic selector that switches identity/behavior (render as a router link) rather than choosing among display-equivalent elements — per the selector rule, as with `Link`. |
| `ref` | Dropped: React's forwarded DOM ref (`React.RefObject<HTMLAnchorElement>`); not JSON-serializable. Distinct from `href` (carried). |
| `accessibility` (`aria-*`) | Not carried: the item's accessible name comes from its label (a `Text` child) — no genuine additional author-facing a11y channel (per-component fidelity, as with `Item`). |
| `className` | Styling passthrough; no A2UI representation. |
| non-`aria-*` `a` HTML-attribute spread | Dropped: no A2UI representation. |

---

## Agent section

Omitted. `LinkItem` emits no `event`-shaped `Action` (it carries no `Action` at all —
navigation only), so per the Orchestration skip rule there is no agent surface to design.

---
