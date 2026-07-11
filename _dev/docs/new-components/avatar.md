# Avatar

- **Official documentation URL:** https://primer.style/components/avatar
- **Real prop surface resolved from:** `@primer/react` installed type declarations at
  `node_modules/@primer/react/dist/Avatar/Avatar.d.ts` — a flat intersection:
  `{ size?, square?, src, alt?, className? } & Omit<DetailedHTMLProps<ImgHTMLAttributes<HTMLImageElement>>, "ref">
  & RefAttributes<HTMLImageElement>`. No polymorphism, no `as`, no `children` (renders a void
  `<img>`). Real props: `src` (required), `alt`, `size` (`number | ResponsiveValue<number>`,
  `DEFAULT_AVATAR_SIZE = 20`), `square`, `className`, and the full img host-element spread
  (`loading`, `srcSet`, `sizes`, `crossOrigin`, `decoding`, `width`, `height`, `id`, `style`,
  all `aria-*`, all `data-*`, DOM event handlers, `ref`).
- **Component-level description (→ `catalog.json` `description`):** An image that represents a
  user or a non-human entity such as an organization, team, or bot — typically a profile
  picture.

---

## Adapter section

### Prop-surface table

| prop | decision | synthetic? | A2UI type | description |
|---|---|---|---|---|
| `src` | carry (required) | no | `DynamicString` | URL of the avatar image to display. |
| `alt` | carry | no | `DynamicString` | Alternative text describing the avatar for assistive technologies, needed when no adjacent name identifies it. |
| `size` | carry | no | `z.number() (default: 20)` | The avatar's width and height in pixels. |
| `square` | carry | no | `z.boolean() (default: false)` | Renders a square avatar instead of a circular one; circles represent people, squares represent non-human entities like organizations, teams, or bots. |

### Functions

None. Avatar is a pure display leaf — no `Action`, no local function.

### Dropped / deferred props

| prop | reason |
|---|---|
| `size` (responsive object variant) | Dropped: the `{narrow, regular, wide}` viewport-conditional form of the `size` union has no A2UI representation; the plain `number` form is carried. |
| `className` | Styling passthrough; no A2UI representation. |
| `aria-*` slice of the img spread | Not carried as `accessibility`: `alt` is the accessibility channel for an image and the component is non-interactive — `AccessibilityAttributes` would duplicate it (per-component fidelity). |
| `loading`, `srcSet`, `sizes`, `crossOrigin`, `decoding`, `width`, `height`, `id`, `style`, `data-*`, DOM event handlers, `ref`, and the rest of the non-`aria-*` img spread | Dropped: no A2UI representation. Event handlers are incidental inheritance — an avatar is not interactive. |

---

## Client section

The canned image for every avatar fixture is a single shared **inline `data:` URI** — a small
geometric SVG placeholder ("face") defined in the fixture module — so baselines are fully
deterministic (no network, no static-asset infrastructure) and visibly show a loaded image
rather than a broken-image glyph.

### Fixture table

| fixture | exercises (coverage axis) | component state / canned values | baselined? |
|---|---|---|---|
| `avatar` | content channel — literal | `src: <data-URI SVG placeholder>`; `alt: "Octocat"` | yes |
| `avatar-bound` | content channel — bound (path binding) | `src: {path: "/avatarUrl"}`; data model `{avatarUrl: <same data URI>}`; `alt: "Bound avatar"` | yes |
| `avatar-sizes` | visual config — `size` | one surface per documented scale value `[16, 20, 24, 28, 32, 40, 48, 64]`; each with the canned data-URI `src` so size is the only differing axis | yes (one PNG) |
| `avatar-square` | visual config — `square` | `square: true`; canned data-URI `src` so shape is the only differing axis | yes |

Single-axis throughout: no semantic couplings exist.

### Prop-coverage map

| adapter prop | covered by |
|---|---|
| `src` | `avatar` (literal) + `avatar-bound` (bound) |
| `alt` | render-test assertion (non-visual) |
| `size` | `avatar-sizes` |
| `square` | `avatar-square` |

---

## Agent section

Omitted. Avatar emits no `event`-shaped `Action` (no `Action` at all — it is a pure display
leaf), so per the Orchestration skip rule there is no agent surface to design.
