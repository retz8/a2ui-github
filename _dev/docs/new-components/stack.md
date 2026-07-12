# Stack

- **Official documentation URL:** https://primer.style/components/stack/
- **Real prop surface resolved from:** `@primer/react` installed type declarations at
  `node_modules/@primer/react/dist/Stack/Stack.d.ts`. `Stack:
  PolymorphicForwardRefComponent<ElementType, StackProps<ElementType>>` where
  `StackProps<As> = React.PropsWithChildren<{ as?: As; gap?: Gap; direction?: Direction;
  align?: Align; wrap?: Wrap; justify?: Justify; padding?: Padding; paddingBlock?: Padding;
  paddingInline?: Padding; className?: string }>`. Every scale prop is a union of a scalar
  scale and `ResponsiveValue<scale>` (`= { narrow?; regular?; wide? }` per
  `hooks/useResponsiveValue.d.ts`, a per-viewport map). Implementation defaults (code is
  authority, `Stack.js:65–69`): `direction = "vertical"`, `align = "stretch"`, `justify =
  "start"`, `padding = "none"`, `wrap = "nowrap"`; `gap` has no JS default. Responsive
  resolution uses `getResponsiveAttributes` (data-attributes + CSS media queries — the
  current, non-deprecated path). The official doc's props table omits `as` and lists every
  default blank; the installed code is authoritative on both.
- **Component-level description (→ `catalog.json` `description`):** Arranges child components
  in a row or column with configurable spacing, alignment, wrapping, and padding.

> The docs page also covers `Stack.Item`, the per-child sizing wrapper; it has its own
> decision doc at `stack-item.md` (same 6.23 sub-task).

## Conventions established by this component

- **`responsive(inner)` helper.** Every `ResponsiveValue<T>`-bearing prop is carried faithfully
  (not projected down to a scalar) as `z.union([inner, z.object({ narrow: inner.optional(),
  regular: inner.optional(), wide: inner.optional() })])`. The build materializes one local
  `responsive(inner)` helper — generalizing over enums (Stack) and booleans (Stack.Item) — that
  returns this union. This is the catalog's standing convention for every future Primer
  component whose props accept `ResponsiveValue`. Dropping the responsive arm would remove a
  real, documented per-viewport capability — not a lossless projection — so it is carried, per
  the faithful-translation rule.
- **`ChildList` container slot.** Stack is the catalog's first container. Its `children` slot is
  the protocol common `CommonSchemas.ChildList` (a static array of component IDs, or a
  `{componentId, path}` dynamic template), rendered via the `buildChild` helper — matching the
  reference basic catalog's `Row`/`Column`/`List`.

---

## Adapter section

### Prop-surface table

| prop | decision | synthetic? | A2UI type | description |
|---|---|---|---|---|
| `children` | carry (optional) | yes | `ChildList` | The components arranged inside the stack. |
| `direction` | carry | no | `responsive(z.enum(['horizontal','vertical'])) (default: "vertical")` | The axis children are laid out along. |
| `gap` | carry | no | `responsive(z.enum(['none','tight','condensed','cozy','normal','spacious']))` | The spacing between children. |
| `align` | carry | no | `responsive(z.enum(['stretch','start','center','end','baseline'])) (default: "stretch")` | Alignment of children across the layout axis. |
| `justify` | carry | no | `responsive(z.enum(['start','center','end','space-between','space-evenly'])) (default: "start")` | Distribution of children along the layout axis. |
| `wrap` | carry | no | `responsive(z.enum(['wrap','nowrap'])) (default: "nowrap")` | Whether children are forced onto one line or may wrap onto multiple lines. |
| `padding` | carry | no | `responsive(z.enum(['none','tight','condensed','cozy','normal','spacious'])) (default: "none")` | Padding inside the container on all sides. |
| `paddingBlock` | carry | no | `responsive(z.enum(['none','tight','condensed','cozy','normal','spacious']))` | Vertical padding; overrides the vertical axis of `padding` when both are set. |
| `paddingInline` | carry | no | `responsive(z.enum(['none','tight','condensed','cozy','normal','spacious']))` | Horizontal padding; overrides the horizontal axis of `padding` when both are set. |
| `as` | carry | no | `z.enum(['div','span','section','nav','article','aside','header','footer','main','ul','ol']) (default: "div")` | The HTML element used to render the container; the choices are display-equivalent flex containers that differ only in semantic/landmark identity. |

`children` is `carry (optional)` — faithful to Primer's optional `children` type; an empty
stack is legal. Every scale prop carries its full `ResponsiveValue` union via the
`responsive()` helper. Each scale prop's enum is curated from that prop's own documented value
set — the sets are not shared.

### Functions

None. Stack is a pure layout container — no `Action`, no local function.

### Dropped / deferred props

| prop | reason |
|---|---|
| `className` | Styling passthrough; no A2UI representation. |
| accessibility (`aria-*`) | Not carried: Stack is a non-interactive layout primitive with no author-facing accessibility channel of its own (per-component fidelity, as with Text/Truncate). |

---

## Client section

Filler children are `Button` leaves (already shipped) — solid, clearly-bounded boxes.
`align`/`justify`/`wrap` galleries use buttons of varying `size`/label length so the axis
behavior is legible in a static PNG; the simpler galleries use uniform buttons.

Responsive-arm handling (per the client design call): the schema carries the full
`ResponsiveValue` union faithfully, but multi-viewport baseline infra is **deferred** (recorded
in `deferred-catalog-work.md`). Coverage is a render-test assertion (the responsive `data-*`
attributes are emitted and forwarded) plus one single-viewport visual demo fixture
(`stack-responsive`); the cross-viewport effect is verified manually.

### Fixture table

| fixture | exercises (coverage axis) | component state / canned children | baselined? |
|---|---|---|---|
| `stack` | content — static `ChildList` (+ default `direction: vertical`) | `children: ['b1','b2','b3']` (static array) → three `Button`s ("One"/"Two"/"Three") | yes |
| `stack-children-template` | content — dynamic template (bound) | `children: {componentId: 'tpl', path: '/items'}`; `tpl` = a `Button` whose label binds `{path: './label'}`; data model `/items = [{label:'Alpha'},{label:'Beta'},{label:'Gamma'}]` | yes |
| `stack-direction` | visual enum — `direction` | gallery: one surface per `['horizontal','vertical']`; each = 3 uniform `Button`s | yes (one PNG) |
| `stack-gap` | visual enum — `gap` | gallery: one surface per `['none','tight','condensed','cozy','normal','spacious']`; horizontal, 3 uniform `Button`s | yes (one PNG) |
| `stack-align` | visual enum — `align` | gallery: one surface per `['stretch','start','center','end','baseline']`; `direction: horizontal`, 3 `Button`s of differing `size` (`small`/`medium`/`large`) so cross-axis alignment is visible | yes (one PNG) |
| `stack-justify` | visual enum — `justify` | gallery: one surface per `['start','center','end','space-between','space-evenly']`; `direction: horizontal`, container wider than children, 3 `Button`s of varying label length | yes (one PNG) |
| `stack-wrap` | visual enum — `wrap` | 2 surfaces (`wrap`, `nowrap`); `direction: horizontal`, ~6 wide `Button`s exceeding container width to force overflow | yes (one PNG) |
| `stack-padding` | visual enum — `padding` | gallery: one surface per `['none','tight','condensed','cozy','normal','spacious']`; each a bordered stack of 3 `Button`s so the inset is visible | yes (one PNG) |
| `stack-paddingblock` | axis-override state — `paddingBlock` | single: `paddingBlock: 'spacious'`; bordered stack (padding-scale magnitudes already covered by `stack-padding`) | yes |
| `stack-paddinginline` | axis-override state — `paddingInline` | single: `paddingInline: 'spacious'`; bordered stack | yes |
| `stack-responsive` | responsive-arm demo — `direction` | `direction: {narrow:'vertical', regular:'horizontal', wide:'horizontal'}`; 3 `Button`s; single-viewport baseline at regular (→ horizontal); cross-viewport checked manually | yes (regular only) |

### Prop-coverage map

| adapter prop | covered by |
|---|---|
| `children` | `stack` (static array) + `stack-children-template` (dynamic template) |
| `direction` | `stack-direction` (+ `stack-responsive` for the responsive arm) |
| `gap` | `stack-gap` |
| `align` | `stack-align` |
| `justify` | `stack-justify` |
| `wrap` | `stack-wrap` |
| `padding` | `stack-padding` |
| `paddingBlock` | `stack-paddingblock` (+ scale magnitudes via `stack-padding`) |
| `paddingInline` | `stack-paddinginline` (+ scale magnitudes via `stack-padding`) |
| `as` | render-test assertion (rendered container element tag per the enum; non-visual — all render the same flex box) |
| responsive arm (all 8 scale props) | render-test assertion (responsive `data-*` attributes emitted + forwarded) + `stack-responsive` visual demo |

---

## Agent section

Omitted. Stack emits no `event`-shaped `Action` (no `Action` at all — it is a pure layout
container), so per the Orchestration skip rule there is no agent surface to design.
