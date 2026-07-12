# ButtonGroup

- **Official documentation URL:** https://primer.style/components/button-group/
- **Real prop surface resolved from:** `@primer/react` installed type declarations at
  `node_modules/@primer/react/dist/ButtonGroup/ButtonGroup.d.ts`:
  `ButtonGroup: PolymorphicForwardRefComponent<"div", ButtonGroupProps>` where
  `ButtonGroupProps = React.PropsWithChildren<{ role?: string; className?: string }>`. The
  polymorphic wrapper adds `as?` (default `"div"` — code is authority, `ButtonGroup.js`:
  `BaseComponent = as ?? "div"`) and the inherited `div` HTML-attribute spread (incl. `aria-*`).
  `role` is behaviorally live in the implementation: `role === "toolbar"` enables a
  `useFocusZone` with `ArrowHorizontal` roving focus across the buttons; any other value (or
  none) disables it. The component wraps each child in a `<div>` internally and applies the
  shared-border joined-row styling; it emits no event and needs no catalog overlay
  infrastructure.
- **Component-level description (→ `catalog.json` `description`):** Groups a set of related
  buttons into a single visually-joined row, optionally presented as a keyboard-navigable
  toolbar.

## Adapter section

### Prop-surface table

| prop | decision | synthetic? | A2UI type | description |
|---|---|---|---|---|
| `children` | carry (optional) | yes | `ChildList` | The buttons grouped together. |
| `role` | carry | no | `z.enum(['group','toolbar'])` | The role of the group. `toolbar` presents the buttons as a toolbar with arrow-key navigation between them; `group` marks them as a set of related controls. |
| `as` | carry | no | `z.enum(['div','span']) (default: "div")` | The HTML element used to render the group container. |

`children` is `carry (optional)` — faithful to Primer's optional `children` type; an empty
group is legal. Its slot is the protocol common `CommonSchemas.ChildList` (a static array of
component IDs, or a `{componentId, path}` dynamic template), rendered via the `buildChild`
helper — the container-slot convention Stack established. `role` is carried as a curated
`z.enum` over its two meaningful values (`toolbar` switches on keyboard navigation; `group` is
the ARIA-correct role for a related set), optional with no default — every other string the raw
type admits is a meaningless role on this container. `as` is carried as a curated enum of the
two display-equivalent generic containers; ButtonGroup is not list-semantic, so the list tags
(`ul`/`ol`) are excluded.

### Functions

None. ButtonGroup is a pure presentational container — no `Action`, no local function.

### Dropped / deferred props

| prop | reason |
|---|---|
| `className` | Styling passthrough; no A2UI representation. |
| accessibility (`aria-*` spread) | Not carried: ButtonGroup is a non-interactive grouping container with no author-facing accessibility channel of its own (per-component fidelity, as with Stack/LabelGroup). |
| non-`aria-*` `div` spread (`data-*`, `id`, `tabIndex`, …) | Dropped: no A2UI representation. |

---

## Client section

Filler children are `Button` leaves (already shipped) — the only sensible content for a button
group. ButtonGroup has a single visual (the joined row with shared borders); neither carried
non-content prop alters appearance, so there is no gallery. `role` is non-visual (`toolbar` and
`group` render identically — the only effect is the DOM `role` attribute and, for `toolbar`,
arrow-key roving focus, which is interaction-triggered and not baselineable statically) and `as`
is non-visual (`div`/`span` render the same joined row). Both are covered by render-test
assertions; the content fixtures carry the visual proof.

### Fixture table

| fixture | exercises (coverage axis) | component state / canned children | baselined? |
|---|---|---|---|
| `button-group` | content — static `ChildList` (default: no role, `as: div`) | `children: ['b1','b2','b3']` → three `Button`s ("Save"/"Cancel"/"Delete") joined in a row | yes |
| `button-group-children-template` | content — dynamic template (bound) | `children: {componentId:'tpl', path:'/actions'}`; `tpl` = a `Button` whose label binds `{path:'./label'}`; data model `/actions = [{label:'Edit'},{label:'Copy'},{label:'Archive'}]` | yes |

### Prop-coverage map

| adapter prop | covered by |
|---|---|
| `children` | `button-group` (static array) + `button-group-children-template` (dynamic template) |
| `role` | render-test assertion (both `'group'`/`'toolbar'` accepted + forwarded as the DOM `role`; the toolbar arrow-key nav is interaction-triggered, non-baselineable statically) |
| `as` | render-test assertion (rendered container tag per the enum; non-visual — both render the same joined row) |

---

## Agent section

Omitted. ButtonGroup emits no `event`-shaped `Action` (no `Action` at all — it is a pure
presentational container), so per the Orchestration skip rule there is no agent surface to
design.
