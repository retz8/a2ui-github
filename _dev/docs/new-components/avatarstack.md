# AvatarStack

- **Official documentation URL:** https://primer.style/components/avatar-stack
- **Real prop surface resolved from:** `@primer/react` installed type declarations at
  `node_modules/@primer/react/dist/AvatarStack/AvatarStack.d.ts` — a **closed object type**
  (no HTML-attribute spread, so no `aria-*`/`data-*` inheritance and no accessibility surface;
  no polymorphism, no `as`): `AvatarStackProps = { alignRight?: boolean; disableExpand?:
  boolean; variant?: 'cascade' | 'stack'; shape?: 'circle' | 'square'; size?: number |
  ResponsiveValue<number>; className?: string; children: React.ReactNode; style?:
  React.CSSProperties }`. `children` is the only required prop. Implementation defaults (code
  is authority, `AvatarStack.js`): `variant = "cascade"`, `shape = "circle"`; `size` has **no**
  prop default — when unset the stack derives its size from the children's own `size` props
  (min per viewport); `alignRight` / `disableExpand` are falsy when unset. The official doc's
  props table lists `size` default `20` — stale against the code, which applies no prop
  default. Behavior notes: `shape="square"` propagates `square` down to every child avatar;
  `disableExpand` toggles the hover/focus spread-apart interaction; a set `size` overrides the
  children's own sizes.
- **Component-level description (→ `catalog.json` `description`):** A set of overlapping avatars
  displayed inline, used to show a group of users or entities compactly when space is limited.

> Reuses two conventions established by `stack.md` (6.23): the `responsive(inner)` helper for
> `ResponsiveValue`-bearing props, and the `CommonSchemas.ChildList` container slot for
> `children`. Child avatars are `Avatar` leaves (6.13).

---

## Adapter section

### Prop-surface table

| prop | decision | synthetic? | A2UI type | description |
|---|---|---|---|---|
| `children` | carry (required) | yes | `ChildList` | The avatars to display in the stack. |
| `alignRight` | carry | no | `z.boolean() (default: false)` | Aligns the stacked avatars toward the right edge instead of the left. |
| `disableExpand` | carry | no | `z.boolean() (default: false)` | Prevents the avatars from spreading apart to reveal themselves when the stack is hovered or focused. |
| `variant` | carry | no | `z.enum(['cascade','stack']) (default: "cascade")` | The overlap style; `cascade` increases the overlap for the third and later avatars, while `stack` keeps a uniform overlap. |
| `shape` | carry | no | `z.enum(['circle','square']) (default: "circle")` | The shape applied to all avatars in the stack; `square` marks non-human entities such as organizations, teams, or bots. |
| `size` | carry | no | `responsive(z.number())` | The width and height of each avatar in the stack, in pixels; when unset, follows the individual avatars' own sizes. |

`children` is `carry (required)` — faithful to Primer's required `children` type. `size`
carries its full `ResponsiveValue` union via the `responsive()` helper (the standing convention
from `stack.md`); Avatar's scalar-only `size` (6.13) predates that convention and is the stale
one, to be reconciled if Avatar is revisited.

### Functions

None. AvatarStack is a pure display container — no `Action`, no local function.

### Dropped / deferred props

| prop | reason |
|---|---|
| `className`, `style` | Styling passthroughs; no A2UI representation. |
| accessibility (`aria-*`) | Not carried: the type is a closed object with no HTML-attribute spread, so there is no author-facing accessibility channel; the component is a display container (per-component fidelity, as with Avatar/Stack). |

---

## Client section

Filler children are `Avatar` leaves (6.13), reusing Avatar's deterministic inline `data:` URI
SVG placeholder — in a few color variants so the individual avatars are distinguishable and the
overlap is legible in a static PNG. Because `variant` diverges only for the **third-and-later**
avatars, the `variant`/`alignRight` fixtures use ~5 avatars to exercise the overlap difference
and the `data-avatar-count` "3+" overflow.

Responsive-arm handling (per `stack.md`'s precedent): the schema carries the full
`ResponsiveValue` union faithfully, but multi-viewport baseline infra is **deferred** (recorded
in `deferred-catalog-work.md`). Coverage is a render-test assertion (the responsive `data-*`
attributes are emitted/forwarded) plus one single-viewport visual demo fixture
(`avatarstack-size-responsive`); the cross-viewport effect is verified manually.

### Fixture table

| fixture | exercises (coverage axis) | component state / canned children | baselined? |
|---|---|---|---|
| `avatarstack` | content — static `ChildList` (+ defaults) | `children: ['a1','a2','a3']` (static array) → three `Avatar`s (color-variant data-URI placeholders) | yes |
| `avatarstack-children-template` | content — dynamic template (bound) | `children: {componentId:'tpl', path:'/users'}`; `tpl` = an `Avatar` with `src`←`{path:'./avatarUrl'}` and `alt`←`{path:'./name'}`; data model `/users = [{avatarUrl:<data URI>, name:'Mona'}, {…,'Hubot'}, {…,'Octo'}, {…,'Bender'}]` | yes |
| `avatarstack-alignright` | visually-distinct state — `alignRight` | `alignRight: true`; 5 `Avatar`s (overlap anchored to the right) | yes |
| `avatarstack-variant` | visual enum — `variant` | gallery: one surface per `['cascade','stack']`; each 5 `Avatar`s (so the third-and-later overlap difference shows) | yes (one PNG) |
| `avatarstack-shape` | visual enum — `shape` | gallery: one surface per `['circle','square']`; 3 `Avatar`s each | yes (one PNG) |
| `avatarstack-size` | visual config — `size` (scalar arm) | gallery: one surface per `[20, 32, 48]`; 3 `Avatar`s each | yes (one PNG) |
| `avatarstack-size-responsive` | responsive-arm demo — `size` | `size: {narrow:16, regular:32, wide:48}`; 3 `Avatar`s; single-viewport baseline at regular (→ 32px); cross-viewport checked manually | yes (regular only) |

Single-axis throughout, except the intentionally-coupled child-count in the `variant`/`alignRight`
fixtures (needed for the overlap behavior to be legible).

### Prop-coverage map

| adapter prop | covered by |
|---|---|
| `children` | `avatarstack` (static array) + `avatarstack-children-template` (dynamic template) |
| `alignRight` | `avatarstack-alignright` |
| `disableExpand` | render-test assertion (non-visual in a static baseline — its effect is the hover/focus spread, identical to the default when un-hovered; the `data-disable-expand` attribute is asserted forwarded, and the hover behavior is verified manually) |
| `variant` | `avatarstack-variant` |
| `shape` | `avatarstack-shape` |
| `size` | `avatarstack-size` (scalar) + `avatarstack-size-responsive` (responsive arm) |
| responsive arm (`size`) | render-test assertion (responsive `data-*` attributes emitted + forwarded) + `avatarstack-size-responsive` visual demo |

---

## Agent section

Omitted. AvatarStack emits no `event`-shaped `Action` (no `Action` at all — it is a pure display
container), so per the Orchestration skip rule there is no agent surface to design.
