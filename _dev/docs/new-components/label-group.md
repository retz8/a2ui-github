# LabelGroup

- **Official documentation URL:** https://primer.style/components/label-group/
- **Real prop surface resolved from:** `@primer/react` installed type declarations at
  `node_modules/@primer/react/dist/LabelGroup/LabelGroup.d.ts`:
  `LabelGroup: React.FC<React.PropsWithChildren<LabelGroupProps>>` where
  `LabelGroupProps = { as?: React.ElementType; overflowStyle?: 'inline' | 'overlay';
  visibleChildCount?: 'auto' | number; className?: string }`. Implementation defaults (code is
  authority, `LabelGroup.js:143–145`): `overflowStyle = 'overlay'`, `as = 'ul'`;
  `visibleChildCount` has no default (undefined = never truncate). When `as` is `ul`/`ol` the
  component treats itself as a list and wraps each child in an `<li>` (`isList`,
  `LabelGroup.js:298`); otherwise it renders a plain container. The overflow affordance (the
  `+N` expand button, the inline/overlay reveal, and the fit-to-container measurement for
  `'auto'`) is handled internally by the component — it emits no event and needs no catalog
  overlay infrastructure.
- **Component-level description (→ `catalog.json` `description`):** Groups a set of labels or
  tokens together, optionally truncating the group to a maximum number of visible items with the
  remainder revealed on demand.

## Adapter section

### Prop-surface table

| prop | decision | synthetic? | A2UI type | description |
|---|---|---|---|---|
| `children` | carry (optional) | yes | `ChildList` | The labels or tokens grouped together. |
| `overflowStyle` | carry | no | `z.enum(['inline','overlay']) (default: "overlay")` | How items hidden by truncation are revealed — inline after the visible items, or in an overlay. |
| `visibleChildCount` | carry | no | `z.union([z.literal('auto'), z.number().int().positive()])` | How many items to show before truncating; `'auto'` fits to the container width; omit to never truncate. |
| `as` | carry | no | `z.enum(['ul','ol','div','span']) (default: "ul")` | The HTML element used to render the group container. |

`children` is `carry (optional)` — faithful to Primer's optional `children` type; an empty group
is legal. Its slot is the protocol common `CommonSchemas.ChildList` (static array of component
IDs, or a `{componentId, path}` dynamic template), rendered via the `buildChild` helper — the
container-slot convention Stack established. `visibleChildCount` carries the full `'auto' | number`
union, tightened to a positive integer for the numeric arm (every value it rejects is one Primer
cannot meaningfully use). `as` is carried as a curated enum covering both of Primer's list
(`ul`/`ol`) and generic (`div`/`span`) container branches; landmark tags are excluded as noise for
this component.

### Functions

None. LabelGroup is a pure presentational container — no `Action`, no local function.

### Dropped / deferred props

| prop | reason |
|---|---|
| `className` | Styling passthrough; no A2UI representation. |
| accessibility (`aria-*`) | Not carried: LabelGroup is a non-interactive grouping container with no author-facing accessibility channel of its own (per-component fidelity, as with Stack/Text). |

---

## Client section

Filler children are `Label` leaves (already shipped) — the idiomatic content for a label group.
Two carried props are exercised behaviorally rather than by a static baseline: `overflowStyle`'s
`inline`-vs-`overlay` difference is interaction-triggered (both look identical when collapsed, and
the baseline harness takes no interaction step), and `visibleChildCount: 'auto'` fits to the parent
container width (ResizeObserver-driven, non-deterministic in a static baseline). Both are covered by
render-test assertions; the numeric truncation state carries the visual proof.

### Fixture table

| fixture | exercises (coverage axis) | component state / canned children | baselined? |
|---|---|---|---|
| `label-group` | content — static `ChildList` (default `overflowStyle: overlay`, no truncation) | `children: ['l1','l2','l3','l4']` → four `Label`s ("bug"/"enhancement"/"help wanted"/"question") | yes |
| `label-group-children-template` | content — dynamic template (bound) | `children: {componentId:'tpl', path:'/labels'}`; `tpl` = a `Label` whose text binds `{path:'./text'}`; data model `/labels = [{text:'bug'},{text:'wontfix'},{text:'duplicate'}]` | yes |
| `label-group-truncated` | visually-distinct state — `visibleChildCount` (numeric arm) | six `Label`s; `visibleChildCount: 3` → shows three plus the `+3` overflow affordance | yes |

### Prop-coverage map

| adapter prop | covered by |
|---|---|
| `children` | `label-group` (static array) + `label-group-children-template` (dynamic template) |
| `overflowStyle` | render-test assertion (both values accepted + the correct expand mechanism rendered; the reveal is interaction-triggered, non-baselineable statically) |
| `visibleChildCount` | `label-group-truncated` (numeric truncation, visual) + render-test assertion (`'auto'` arm accepted + forwarded) |
| `as` | render-test assertion (rendered container element tag per the enum, and `<li>` child-wrapping for `ul`/`ol`; non-visual — all render the same inline row) |

---

## Agent section

Omitted. LabelGroup emits no `event`-shaped `Action` (no `Action` at all — it is a pure
presentational container), so per the Orchestration skip rule there is no agent surface to design.
