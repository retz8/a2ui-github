# ToggleSwitch

- **Official documentation URL:** https://primer.style/components/toggle-switch
- **Real prop surface resolved from:** `@primer/react` installed type declarations at
  `node_modules/@primer/react/dist/ToggleSwitch/ToggleSwitch.d.ts` —
  `ToggleSwitchProps = { 'aria-labelledby' (required), defaultChecked?, disabled?, loading?,
  checked?, onChange?, onClick?, size?, statusLabelPosition?, loadingLabelDelay?,
  loadingLabel?, buttonType?, buttonLabelOn?, buttonLabelOff? } &
  Omit<HTMLAttributes<HTMLDivElement>, 'onChange'>`, `ref` forwarded to `HTMLButtonElement`.
  `statusLabelPosition` is typed `CellAlignment` = `'start' | 'end' | undefined`. Defaults
  verified in the installed implementation (`ToggleSwitch.js`): `size = "medium"`,
  `statusLabelPosition = "start"`, `loadingLabelDelay = 2000`, `loadingLabel = "Loading"`,
  `buttonType = "button"`, `buttonLabelOn = "On"`, `buttonLabelOff = "Off"`. No compound
  subcomponents. Renders no visible label of its own (only the On/Off status text) — the
  accessible name comes from the required `aria-labelledby`.
- **Component-level description (→ `catalog.json` `description`):** A switch that
  immediately turns a setting on or off, showing its current state as a short status text.

State/interaction model (hybrid — between Checkbox's and Radio's): `checked` is required
and two-way bound — the user's flip writes the bound data-model path locally and instantly
(the binder's auto-generated setter), no round trip needed to flip. The optional `action`
(the projection of `onChange`, with `onClick` collapsed into it) is the flip-time channel
for settings that must reach the agent (persist, side effects, server confirmation) or run
a local function; the server stays authoritative over the bound path and may override the
optimistic local write. `loading` covers the pending-confirmation window. See
`a2ui-findings.md` §6 (no uncontrolled mode: `defaultChecked` dropped, `checked` required).

---

## Adapter section

### Prop-surface table

| prop | decision | synthetic? | A2UI type | description |
|---|---|---|---|---|
| `checked` | carry (required) | no | `DynamicBoolean` | Whether the switch is on. Two-way bound: toggling writes the new value back to the bound data-model path. |
| `action` | carry | yes (← `onChange`) | `Action` | Performed when the user toggles the switch — for settings that must reach the agent or run a local effect at flip time. |
| `disabled` | carry | no | `DynamicBoolean` | Whether the switch is disabled and cannot be toggled. |
| `loading` | carry | no | `DynamicBoolean` | Whether the switch's value is being computed or saved; blocks toggling meanwhile. |
| `size` | carry | no | `z.enum(['small','medium']) (default: "medium")` | The size of the switch; `small` for dense layouts. |
| `statusLabelPosition` | carry | no | `z.enum(['start','end']) (default: "start")` | Whether the on/off status text appears before or after the switch. |
| `buttonLabelOn` | carry | no | `z.string() (default: "On")` | Status text shown when the switch is on; customize only for a more specific context (e.g. "Show"). |
| `buttonLabelOff` | carry | no | `z.string() (default: "Off")` | Status text shown when the switch is off; customize only for a more specific context (e.g. "Hide"). |
| `loadingLabel` | carry | no | `z.string() (default: "Loading")` | Text announced to assistive technologies while loading. Non-visual. |
| `loadingLabelDelay` | carry | no | `z.number() (default: 2000)` | Milliseconds before the loading text is announced to assistive technologies. Non-visual. |
| `accessibility` | carry (required) | no | `AccessibilityAttributes` | Label naming the setting the switch controls — the switch renders no visible label of its own, and an unnamed on/off control is meaningless to assistive technologies. |

### Functions

| name | args | returnType | description |
|---|---|---|---|
| `consoleLog` | `message: string` (The message to log.) | `void` | Logs a message. A local client-side effect invoked from the switch's `functionCall` action. Already registered in the catalog — no new registration. |

### Dropped/deferred props

| prop | reason |
|---|---|
| `defaultChecked` | Dropped: uncontrolled-mode initializer; with required `checked` the wrapped component is always controlled and React ignores it. Initial state lives in `checked` (literal or the bound path's initial data-model value). Findings §6. |
| `onClick` | Dropped: same gesture as the toggle — collapsed into `action`, not a distinct capability. |
| `buttonType` | Dropped: HTML form participation (`submit`/`reset`); no protocol representation. |
| `aria-labelledby`, `aria-describedby` | Represented through `accessibility` (label/description); A2UI has no cross-component DOM-id references, so the adapter supplies the accessible name directly. |
| `ref`, `className`, `style`, `data-*`, and the rest of the non-`aria-*` `HTMLAttributes<HTMLDivElement>` spread | Dropped: no A2UI representation. |
| *(visible label — not a prop)* | Deferred: visible labeling composes at screen level (a `Text` beside the switch) or with `FormControl` (6.47); `accessibility.label` covers the accessible name meanwhile. |

---

## Client section

### Fixture table

| fixture | exercises (coverage axis) | component state / canned values | baselined? |
|---|---|---|---|
| `toggleswitch` | default render — `checked` literal false | `checked: false`, all else default | yes |
| `toggleswitch-checked` | `checked` literal true | `checked: true` | yes |
| `toggleswitch-bound` | path binding + two-way write-back | `checked: {path: "/setting"}`, data model `{setting: false}`; interaction test: click → `/setting` becomes `true` and the switch re-renders on | no — behavior proven in interaction tests; pixels identical to the literal fixtures |
| `toggleswitch-fn` | interaction — functionCall path | `checked: false`; `action: functionCall consoleLog {message: "toggleswitch-fn toggled"}` | yes |
| `toggleswitch-event` | interaction — event path + bound `checked` (the agent-visibility coupling) | `checked: {path: "/setting"}`, data model `{setting: false}`; `action: event {name: "toggle", context: {checked: {path: "/setting"}}}`; sibling `Text` id `status` ("Flip to save setting") | yes |
| `toggleswitch-disabled` | visually-distinct state — `disabled` × check-state | mini-gallery, two surfaces: `disabled: true, checked: false` and `disabled: true, checked: true` | yes (one PNG) |
| `toggleswitch-loading` | visually-distinct state — `loading` × check-state | mini-gallery, two surfaces: `loading: true, checked: false` and `loading: true, checked: true` | yes (one PNG) |
| `toggleswitch-sizes` | visual enum — `size` | one surface per `['small','medium']` | yes (one PNG) |
| `toggleswitch-label-position` | visual enum — `statusLabelPosition` | one surface per `['start','end']` | yes (one PNG) |
| `toggleswitch-custom-labels` | visually-distinct config — `buttonLabelOn`/`buttonLabelOff` (coupled pair) | two surfaces: off with `buttonLabelOff: "Hide"`, on with `buttonLabelOn: "Show"` | yes (one PNG) |

Every fixture carries the required `accessibility.label` (e.g. "Notifications").
Single-axis throughout except the two mini-galleries (`disabled`/`loading` render
distinctly per check-state, so the arms are semantically coupled) and
`toggleswitch-event`, whose coupling (event + bound `checked` + sibling `status` Text) is
the agent-visibility coupling realized from the agent section.

### Prop-coverage map

| adapter prop | covered by |
|---|---|
| `checked` | `toggleswitch` + `toggleswitch-checked` (literal) · `toggleswitch-bound` (bound + two-way write-back) · `toggleswitch-event` (bound, server-written) |
| `action` | `toggleswitch-fn` (functionCall) + `toggleswitch-event` (event) |
| `disabled` | `toggleswitch-disabled` (both visual arms) |
| `loading` | `toggleswitch-loading` (both visual arms) |
| `size` | `toggleswitch-sizes` |
| `statusLabelPosition` | `toggleswitch-label-position` |
| `buttonLabelOn` / `buttonLabelOff` | `toggleswitch-custom-labels` |
| `loadingLabel` | render-test assertion (screen-reader-only loading text) |
| `loadingLabelDelay` | render-test assertion (announcement delayed; asserted with fake timers) |
| `accessibility` | render-test assertion (`aria-label` on the switch) |

---

## Agent section

ToggleSwitch's `action` accepts the `event` shape, so an agent section applies. One event
name is emitted by the paired client event fixture: `toggle`. The event fires after the
local two-way write lands, so its context binding resolves to the new value.

### Event-response table

| event | response messages (ordered, with canned values) | visibility coupling (client fixture · bound prop ← path · initial value) |
|---|---|---|
| `toggle` | 1. `updateDataModel {path: '/setting', value: false}` · 2. `updateComponents [{id: 'status', component: 'Text', text: '⚠️ Could not save — reverted by server'}]` (surfaceId echoed — stamped at runtime, not authored) | `toggleswitch-event` · `checked ← /setting` · initial `/setting = false`; the switch flips on locally (optimistic two-way write), then the server's revert lands and it flips back off |

The canned server is the optimistic-write/server-revert case: the user's flip is local and
instant (two-way write to `/setting`), the `toggle` event carries the new value, and the
server overrides the same bound path — the half that proves the server stays authoritative
over a two-way-bound state prop. The text swap (`updateComponents`) is self-visible; the
`/setting` write (`updateDataModel`) is visible as the switch snapping back off through the
`checked ← /setting` coupling.
