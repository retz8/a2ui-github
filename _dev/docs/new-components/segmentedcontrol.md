# SegmentedControl

- **Official documentation URL:** https://primer.style/components/segmented-control
- **Real prop surface resolved from:** `@primer/react` installed type declarations at
  `node_modules/@primer/react/dist/SegmentedControl/SegmentedControl.d.ts`:
  `SegmentedControl: React.FC<React.PropsWithChildren<SegmentedControlProps>>` where
  `SegmentedControlProps = { 'aria-label'?; 'aria-labelledby'?; 'aria-describedby'?;
  fullWidth?: boolean | ResponsiveValue<boolean>; onChange?: (selectedIndex: number) => void;
  size?: 'small' | 'medium'; variant?: 'default' | Partial<Record<viewport, 'hideLabels' |
  'dropdown' | 'default'>>; className? }`, plus the two slot subcomponents `SegmentedControl.Button`
  and `SegmentedControl.IconButton`. Reconciled against `SegmentedControl.js`: **selection is
  positional but authored per-child** — the parent scans its children for the one with
  `selected: true`, derives that index (defaulting to `0` when none is marked), and pushes
  `selected = (index === selectedIndex)` back down to each child; a segment click calls
  `onChange(index)`. `variant` resolves through `getResponsiveAttributes` (data-attributes + CSS
  media queries); the `dropdown` mode renders Primer's **own internal `ActionMenu`** overlay in
  place of the control at that viewport (no catalog-level overlay infrastructure is involved — the
  adapter forwards `variant` and Primer renders the menu itself). Implementation defaults (code is
  authority): `variant = "default"`; `size` and `fullWidth` have **no** code default (CSS decides
  the size; unset `fullWidth` is falsy).
- **Component-level description (→ `catalog.json` `description`):** A set of buttons where exactly
  one is selected at a time, used to switch between related views or modes in a compact space.

> The two segment subcomponents ship as sibling leaves in this same 6.32 sub-task, each with its
> own decision doc: `segmentedcontrol-button.md` (`SegmentedControl.Button`) and
> `segmentedcontrol-iconbutton.md` (`SegmentedControl.IconButton`). They are the only valid
> `children`. Reuses the `ChildList` container slot and the `responsive(inner)` helper conventions
> established by `stack.md` (6.23); icon slots reference the `Icon` leaf (6.2).

## Selection & change model

Primer authors selection **per-child** (`selected` on a segment) but fires change **at the parent**
(`onChange(selectedIndex)`). A2UI centralizes this as a single **`selectedIndex: DynamicNumber`** on
the container (the exact mental model of the official example's `useState(selectedIndex)` +
`selected={selectedIndex === i}`), so the segment leaves carry **no** `selected` prop — a segment's
selected-ness is derived from the parent index. `onChange` is represented by two things that compose:

1. **The selection state** — always the two-way write on `selectedIndex`. On a segment click the
   adapter writes the clicked index back to `selectedIndex`'s bound path (the binder's setter, as
   Checkbox writes `checked`). This is intrinsic and not the generating agent's choice.
2. **The change side-effect** — the optional **`action`** (`Action`). Because `Action` is either
   `functionCall` (local) or `event` (server), the *generating agent* chooses per flow whether
   selecting a segment stays local (bare selection or a local function) or triggers a server
   round-trip. Carrying `action` keeps that choice open.

Because `Action` accepts the `event` shape, an agent section applies (below) — mirroring Radio, this
control's single-select-from-a-set sibling. The single parent-level action conveys *which* segment
was picked by binding its event `context` to the `selectedIndex` path (A2UI event `context` accepts
`{path}` bindings); the optimistic write in (1) lands the new index on that path before the event
fires, so the resolved context carries it.

---

## Adapter section

### Prop-surface table

| prop | decision | synthetic? | A2UI type | description |
|---|---|---|---|---|
| `children` | carry (optional) | yes | `ChildList` | The segments contained in the control. |
| `selectedIndex` | carry | yes (← `onChange` payload) | `DynamicNumber` | The zero-based index of the currently-selected segment; updated as the user selects. |
| `action` | carry | yes (← `onChange`) | `Action` | An optional effect performed when the selection changes — a local function or a server event. |
| `fullWidth` | carry | no | `responsive(z.boolean()) (default: false)` | Whether the control stretches to fill its container's width. |
| `size` | carry | no | `z.enum(['small','medium'])` | The size of the segments. |
| `variant` | carry | no | `z.union([z.literal('default'), z.object({narrow, regular, wide: z.enum(['default','hideLabels','dropdown']).optional()})])` | How the control adapts in tight spaces, per viewport: hide the labels, or collapse the whole control into a dropdown. |
| `accessibility` | carry | no | `AccessibilityAttributes` | Accessible label for the group of segments. |

`children` is `carry (optional)` — faithful to Primer's `PropsWithChildren` (an empty control is
legal in the type). `selectedIndex` is synthetic: it promotes Primer's own `onChange(selectedIndex)`
payload to a bound container prop (single source of truth), replacing the per-child `selected`
authoring surface. `variant` is a **bespoke union**, not the standard `responsive()` helper: its
scalar arm is only the literal `'default'` — `hideLabels`/`dropdown` are reachable *only* through the
per-viewport object, never globally, faithful to Primer's type. The full three-mode enum is carried
(including `dropdown`, which renders fine via Primer's internal `ActionMenu`); multi-viewport
**baseline** infra stays deferred per the standing convention (`deferred-catalog-work.md`).

### Functions

| name | args | returnType | description |
|---|---|---|---|
| `consoleLog` | `message: string` (The message to log.) | `void` | Logs a message. A local client-side effect invoked from the control's `functionCall` action. Already registered in the catalog — no new registration. |

### Dropped / deferred props

| prop | reason |
|---|---|
| `onChange` | Represented by `selectedIndex` (the two-way selection write) + `action` (the change side-effect); no separate protocol prop. |
| `className` | Styling passthrough; no A2UI representation. |
| non-`aria-*` HTML-attribute spread (`data-*`, `id`, `tabIndex`, …) | Dropped: no A2UI representation. |

---

## Client section

Filler children are `SegmentedControl.Button` text segments (`Preview`/`Raw`/`Blame` — the canonical
example). `selectedIndex` follows the Checkbox precedent (literal + bound + two-way write-back
interaction); the responsive `variant` arm follows Stack (render-test assertion for the emitted
`data-*` + one single-viewport demo; multi-viewport baseline deferred, cross-viewport and the
`dropdown` mode verified manually).

### Fixture table

| fixture | exercises (coverage axis) | component state / canned values | baselined? |
|---|---|---|---|
| `segmentedcontrol` | content — static `ChildList` (+ default `selectedIndex: 0`) | `selectedIndex: 0`; `children: ['s0','s1','s2']` → 3 `SegmentedControl.Button`s (`Preview`/`Raw`/`Blame`) | yes |
| `segmentedcontrol-children-template` | content — dynamic template (bound) | `children: {componentId:'tpl', path:'/tabs'}`; `tpl` = a `SegmentedControl.Button` whose `label` binds `{path:'./name'}`; data model `/tabs = [{name:'Preview'},{name:'Raw'},{name:'Blame'}]` | yes |
| `segmentedcontrol-selected` | visually-distinct state — `selectedIndex` (literal, non-zero) | `selectedIndex: 1` → 2nd segment active | yes |
| `segmentedcontrol-bound` | path binding + two-way write-back | `selectedIndex: {path:'/view'}`, data model `{view: 0}`; interaction test: click segment 3 → `/view` becomes `2`, re-renders with 3rd active | no — behavioral (Checkbox-bound precedent); pixels identical to a literal-selected fixture |
| `segmentedcontrol-fn` | interaction — functionCall path | `selectedIndex: 0`; `action: functionCall consoleLog {message: "segment changed"}` | yes |
| `segmentedcontrol-event` | interaction — event path + agent coupling | `selectedIndex: {path:'/view'}` (init `0`); `action: event {name:'change', context:{selectedIndex:{path:'/view'}}}`; sibling `Text` id `status` ("Pick a view") | yes |
| `segmentedcontrol-fullwidth` | visually-distinct state — `fullWidth` | `fullWidth: true`; 3 segments stretched across a wide container | yes |
| `segmentedcontrol-size` | visual enum — `size` | gallery: one surface per `['small','medium']`; 3 segments each | yes (one PNG) |
| `segmentedcontrol-variant` | responsive-arm demo — `variant` | `variant: {narrow:'hideLabels', regular:'default'}`; segments carry `leadingVisual` icons so `hideLabels` is legible; single-viewport baseline at regular; cross-viewport + `dropdown` verified manually | yes (regular only) |

### Prop-coverage map

| adapter prop | covered by |
|---|---|
| `children` | `segmentedcontrol` (static array) + `segmentedcontrol-children-template` (dynamic template) |
| `selectedIndex` | `segmentedcontrol-selected` (literal) + `segmentedcontrol-bound` (bound + two-way write-back) |
| `action` | `segmentedcontrol-fn` (functionCall) + `segmentedcontrol-event` (event) |
| `fullWidth` | `segmentedcontrol-fullwidth` |
| `size` | `segmentedcontrol-size` |
| `variant` | `segmentedcontrol-variant` (single-viewport demo) + render-test assertion (responsive `data-*` emitted/forwarded; `hideLabels`/`dropdown` arms accepted) |
| `accessibility` | render-test assertion (`aria-label` on the group container) |

---

## Agent section

`SegmentedControl`'s `action` accepts the `event` shape, so an agent section applies. One event name
is emitted by the paired client event fixture: `change`.

### Event-response table

| event | response messages (ordered, with canned values) | visibility coupling (client fixture · bound prop ← path · initial value) |
|---|---|---|
| `change` | 1. `updateDataModel {path:'/view', value: 2}` (the server confirms the received index) · 2. `updateComponents [{id:'status', component:'Text', text:'✅ Now showing: Blame — server received index 2'}]` (surfaceId echoed — stamped at runtime, not authored) | `segmentedcontrol-event` · `selectedIndex ← /view` · initial `/view = 0` |

The fixture starts at `/view = 0` (Preview active). Clicking **Blame** (index 2): the adapter writes
`/view = 2` **before** firing (the optimistic write that lets the event's `context.selectedIndex`
carry the new index), then fires `change`. The server confirms `/view = 2` and swaps `status`. The
`status` swap is self-visible; the `/view` write is visible only through the `selectedIndex ← /view`
coupling — the half that proves two-way data binding on the control itself (the rendered selection
follows the data model, exactly as Radio's dot follows `/selected`).
