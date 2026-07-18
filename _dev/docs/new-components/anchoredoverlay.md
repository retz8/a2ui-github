# AnchoredOverlay

- **Official documentation URL:** https://primer.style/react/AnchoredOverlay/ (the
  `/components/anchored-overlay` URL redirects to the Primer homepage; the React docs page is the
  canonical prop-surface reference).
- **Real prop surface resolved from:** `@primer/react` (v38.28.0) type declarations at
  `node_modules/@primer/react/dist/AnchoredOverlay/AnchoredOverlay.d.ts` — `AnchoredOverlayProps`
  = `AnchoredOverlayBaseProps` & the anchor union (`…WithAnchor` | `…WithoutAnchor`) &
  `Partial<Pick<PositionSettings, 'align'|'side'|'anchorOffset'|'alignmentOffset'|'displayInViewport'>>`
  — reconciled against the doc. Positioning enums from `@primer/behaviors`
  `dist/esm/anchored-position.d.ts` (`AnchorSide`, `AnchorAlignment`); `height`/`width` maps from
  `Overlay.d.ts` (`heightMap`/`widthMap`); code defaults from `AnchoredOverlay.js`
  (`side = 'outside-bottom'`, `align = 'start'`, `variant = {regular:'anchored', narrow:'anchored'}`,
  `preventOverflow = true`, `displayCloseButton = true`, `renderAs = 'portal'`; doc gives
  `anchorOffset`/`alignmentOffset` default `4`).
- **Component-level description (→ `catalog.json` `description`):** A trigger element that opens a
  floating panel positioned relative to itself; the panel can be opened and dismissed by keyboard
  or mouse.

## Rendering & composition

- **Self-contained overlay — no new infra.** The panel portals to the document body and manages
  its own focus trap, Escape handling, and outside-click dismissal, rendering through the normal
  adapter→renderer path (the Dialog precedent, 6.52). It is screenshottable at regular viewport.
- **Anchor wiring.** The synthetic `anchor` (`ComponentId`) is resolved with `buildChild` and
  wrapped in a ref-bearing element handed to Primer's `renderAnchor`; that wrapper receives the
  positioning ref and the open/close gesture handlers, and the referenced component renders inside
  as the visible trigger. Because the gesture handlers sit on the wrapper, the referenced
  component is presentational in the anchor role (its own `action`, if any, is redundant there).
- **`open` two-way write-back.** The binder auto-generates `setOpen` from the `DynamicBoolean`
  `open` (the Checkbox `setChecked` precedent). An open-gesture calls `setOpen(true)` **and** fires
  `onOpen` if present; a close-gesture calls `setOpen(false)` **and** fires `onClose` if present.
  The state flip is automatic, so the leaf toggles standalone; `onOpen`/`onClose` are the optional
  flexible hook, either action shape (`functionCall` local or `event` to the agent). The
  gesture-kind parameter is not forwarded — Action context is authored, not per-invocation (the
  Dialog `closeAction` precedent).
- **Narrow-fullscreen visual deferral.** `variant: 'fullscreen'` and its `displayCloseButton`
  affordance manifest only below the narrow breakpoint; both props ship, but their narrow-viewport
  **visual baseline** is deferred to multi-viewport capture infra (`deferred-catalog-work.md`, the
  Dialog `bottom`/`fullscreen` precedent). Regular-viewport visuals are fully baselined, and
  render-tests assert `variant`'s `{narrow}` mapping and `displayCloseButton` forwarding.

## Adapter section

### Prop-surface table

| prop | decision | synthetic? | A2UI type | description |
|---|---|---|---|---|
| `anchor` | carry (required) | yes | `ComponentId` | The trigger component that opens the panel. |
| `open` | carry (required) | no | `DynamicBoolean` | Whether the floating panel is currently shown; the trigger's open and close gestures write this value back automatically. |
| `onOpen` | carry | no | `Action` | An additional action performed when the panel is opened. |
| `onClose` | carry | no | `Action` | An additional action performed when the panel is closed. |
| `children` | carry | yes | `ChildList` | The panel's content. |
| `side` | carry | no | `z.enum(['outside-bottom','outside-top','outside-left','outside-right','inside-top','inside-bottom','inside-left','inside-right','inside-center']) (default: "outside-bottom")` | Which side of the trigger the panel opens toward. |
| `align` | carry | no | `z.enum(['start','center','end']) (default: "start")` | How the panel aligns along the trigger's edge. |
| `anchorOffset` | carry | no | `z.number() (default: 4)` | Pixel gap between the trigger and the panel. |
| `alignmentOffset` | carry | no | `z.number() (default: 4)` | Pixel offset along the aligning edge. |
| `displayInViewport` | carry | no | `z.boolean()` | Whether the panel is kept within the viewport bounds. |
| `height` | carry | no | `z.enum(['xsmall','small','medium','large','xlarge','auto','initial','fit-content'])` | The panel's height: preset sizes, or content-driven (`auto`/`initial`/`fit-content`). |
| `width` | carry | no | `z.enum(['small','medium','large','xlarge','xxlarge','auto'])` | The panel's width: preset sizes, or `auto` to fit its content. |
| `preventOverflow` | carry | no | `z.boolean() (default: true)` | Whether the panel keeps its width fixed rather than shrinking to fit available space. |
| `pinPosition` | carry | no | `z.boolean() (default: false)` | Whether the panel is prevented from shifting position when placed above the trigger. |
| `variant` | carry | no | `z.enum(['anchored','fullscreen']) (default: "anchored")` | Narrow-screen presentation: stay anchored to the trigger, or expand to fullscreen. |
| `displayCloseButton` | carry | no | `z.boolean() (default: true)` | Whether the panel shows a close button (rendered in the fullscreen-narrow presentation). |

Notes:

- `anchor` is tightened to **required** (synthetic primary slot): without a trigger the component
  has nothing to position against.
- `open` follows the installed required typing; `onOpen`/`onClose`/`children` and every positioning,
  sizing, and behavior prop are optional per their installed types.
- `variant` projects `ResponsiveValue<'anchored', 'anchored'|'fullscreen'>` — whose `regular` arm is
  fixed to `'anchored'` — to a flat enum over the only author-variable arm (`narrow`); the render fn
  maps `'fullscreen'` → `{narrow: 'fullscreen'}`.

### Functions

| name | args | returnType | description |
|---|---|---|---|
| `consoleLog` | `message: string` (The message to log.) | `void` | Logs a message. A local client-side effect invoked from `functionCall` actions. Already registered in the catalog — no new registration. |

### Dropped / deferred props

| prop | reason |
|---|---|
| `renderAnchor` / `anchorRef` / `anchorId` | Function/ref/id-typed anchor wiring — not JSON-serializable. Represented by the synthetic `anchor: ComponentId`, which the render fn wraps in a ref-bearing element and hands to `renderAnchor`. |
| `onPositionChange` | Observational layout-readback callback (reports the computed position); no author-facing capability. |
| `focusTrapSettings` / `focusZoneSettings` | Hook-settings bags containing refs/callbacks; no protocol representation. |
| `overlayProps` | Untyped `Partial<OverlayProps>` passthrough bag; no single A2UI representation. The discrete sizing it reaches (`height`/`width`) is carried directly; the remainder is the `Overlay` leaf's surface. |
| `closeButtonProps` | `Partial<IconButtonProps>` passthrough bag; no schema. |
| `renderAs` / `cssAnchorPositioningSettings` | DOM rendering-strategy switch plus its tuning; display-equivalent, gated on an off-by-default experimental feature flag; not in the documented prop surface. |
| `className` | Styling passthrough; no A2UI representation. |

---

## Client section

Base composition for every fixture: the **anchor** is a `Button` (child `Text` "Open panel"); the
**panel children** are a single `Text` ("Panel content"). One open overlay per baseline surface —
the panel portals and positions absolutely, so co-locating several open panels risks collisions
(the Dialog "one overlay per surface" precedent). The baseline harness is static
(`goto → screenshot`, no gesture driving), so only `open: true` renders in a Playwright baseline;
the open/close gesture and the `onOpen`/`onClose` firing are exercised by vitest render-tests
(userEvent).

### Fixture table

| fixture | exercises (coverage axis) | component state / canned values | baselined? |
|---|---|---|---|
| `anchored-overlay` | base — open panel, all defaults (`side` outside-bottom, `align` start) | `open: true`; anchor `Button` (child `Text` "Open panel"); children `[Text "Panel content"]` | yes |
| `anchored-overlay-bound` | `open` — bound (path binding) | `open: {path: '/open'}` + data model `{open: true}`; base anchor+content | yes |
| `anchored-overlay-closed` | `open: false` — panel hidden | `open: false`; base anchor+content → render-test (only the trigger renders; panel absent from DOM) | no (render-test) |
| `anchored-overlay-toggle` | open/close gesture (two-way write-back) | render-test (vitest): click trigger → `setOpen(true)` + `onOpen`; Escape / outside-click → `setOpen(false)` + `onClose` | no (render-test) |
| `anchored-overlay-actions-fn` | `onOpen`+`onClose` — functionCall shape | `onOpen: functionCall consoleLog {message: 'opened'}`; `onClose: functionCall consoleLog {message: 'closed'}`; render-test drives each gesture | no (render-test) |
| `anchored-overlay-actions-event` | `onOpen`+`onClose` — event shape (agent-coupled) | `onOpen: event {name: 'panel-open'}`; `onClose: event {name: 'panel-close'}`; render-test drives. **Coupled composition** (see Agent section): anchor `Button` child `Text` (id `anchor-label`, `text: {path: '/anchor/label'}`); panel children `[Text(id: panel-message, text: {path: '/panel/message'}), Text(id: panel-status, text: "—")]`; `open: {path: '/open'}`; data model `{open: false, anchor: {label: 'Open panel'}, panel: {message: 'Loading…'}}` | no (render-test) |
| `anchored-overlay-side-<v>` | `side` — placement walk | one surface per non-default value (`outside-top`, `outside-left`, `outside-right`, `inside-top`, `inside-bottom`, `inside-left`, `inside-right`, `inside-center`); `open: true`; `side: <v>` | yes (one PNG each) |
| `anchored-overlay-align-center` / `-end` | `align` — non-default values | `open: true`; `align: 'center'` / `'end'` | yes (one PNG each) |
| `anchored-overlay-height-<v>` | `height` — preset walk | one surface per preset (`xsmall`, `small`, `medium`, `large`, `xlarge`); `open: true`; `height: <v>`; panel content tall enough to show the fixed height | yes (one PNG each) |
| `anchored-overlay-width-<v>` | `width` — preset walk | one surface per preset (`small`, `medium`, `large`, `xlarge`, `xxlarge`); `open: true`; `width: <v>` | yes (one PNG each) |
| `anchored-overlay-offset` | `anchorOffset` + `alignmentOffset` (combined) | `open: true`; default `side`/`align`; `anchorOffset: 24`; `alignmentOffset: 24` | yes |

### Render-test assertions (non-visual)

- **`open: false`** — the panel is absent from the DOM; only the trigger renders.
- **open/close gesture** — clicking the trigger calls the binder's `setOpen(true)` and fires
  `onOpen`; Escape / outside-click calls `setOpen(false)` and fires `onClose` (`-toggle`; the
  `-actions-fn`/`-actions-event` fixtures assert the action fires on each gesture).
- **`height` content-driven values** (`auto`/`initial`/`fit-content`) — forwarded; visually
  equivalent to the content-sized base, not separately baselined.
- **`width` content-driven value** (`auto`) — forwarded; ≈ base, not separately baselined.
- **`displayInViewport` / `preventOverflow` / `pinPosition`** — the overlay renders open with each
  set (smoke); their condition-dependent visual effect (viewport edge / overflow / above-anchor
  scroll) is non-deterministic in the static single-viewport harness, not baselined.
- **`variant`** — `'fullscreen'` maps to `{narrow: 'fullscreen'}`; its narrow-viewport visual
  baseline is deferred (`deferred-catalog-work.md`).
- **`displayCloseButton`** — forwarded to the panel; visible only in the fullscreen-narrow
  presentation, whose visual baseline is deferred.

### Prop-coverage map

| adapter prop | covered by |
|---|---|
| `anchor` | every fixture (the trigger) |
| `open` | `anchored-overlay` (literal true) + `anchored-overlay-bound` (bound) + `anchored-overlay-closed` (false, render-test) + `anchored-overlay-toggle` (gesture, render-test) |
| `onOpen` | `anchored-overlay-actions-fn` (functionCall) + `anchored-overlay-actions-event` (event) |
| `onClose` | `anchored-overlay-actions-fn` (functionCall) + `anchored-overlay-actions-event` (event) |
| `children` | every fixture (the panel content) |
| `side` | `anchored-overlay-side-*` (8 non-default surfaces) |
| `align` | `anchored-overlay-align-center` / `-end` |
| `anchorOffset` | `anchored-overlay-offset` |
| `alignmentOffset` | `anchored-overlay-offset` |
| `displayInViewport` | render-test (smoke) |
| `height` | `anchored-overlay-height-*` (5 presets) + render-test (content-driven values) |
| `width` | `anchored-overlay-width-*` (5 presets) + render-test (content-driven value) |
| `preventOverflow` | render-test (smoke) |
| `pinPosition` | render-test (smoke) |
| `variant` | render-test (mapping; fullscreen visual deferred) |
| `displayCloseButton` | render-test (forwarding; visual deferred) |

---

## Agent section

The `anchored-overlay-actions-event` fixture emits two events — `panel-open` (`onOpen`) and
`panel-close` (`onClose`). Both are exercised in the interaction-driven render-test (the static
baseline harness cannot drive the open/close gestures). Grounding flow: the panel is a
filter/menu — opening it loads options from the server; closing it applies the selection and the
trigger reflects the applied state.

**Closed-visibility constraint.** When `panel-close` fires the panel is hidden, so the only
rendered surface is the trigger (anchor); a `panel-close` response can only be made visible on the
trigger. `panel-open`'s response is visible in the open panel.

### Event-response table

| event | response messages (ordered, with canned values) | visibility coupling (client fixture · bound prop ← path · initial value) |
|---|---|---|
| `panel-open` | 1. `updateDataModel {path: '/panel/message', value: 'Loaded 3 items from server'}` · 2. `updateComponents [{id: 'panel-status', component: 'Text', text: '✅ Options loaded — server acknowledged'}]` (surfaceId echoed — stamped at runtime, not authored) | `anchored-overlay-actions-event` · panel `Text` `text ← /panel/message` (id `panel-message`, initial "Loading…") + `panel-status` swap · both render inside the open panel |
| `panel-close` | 1. `updateDataModel {path: '/anchor/label', value: 'Filter: 3 active'}` | `anchored-overlay-actions-event` · anchor `Button` child `Text` `text ← /anchor/label` (id `anchor-label`, initial "Open panel") · visible on the trigger — the only surface rendered when closed |

Notes:

- `panel-open` exercises **both** update mechanisms — the `updateDataModel` write (binding proof,
  visible through the bound `panel-message` `Text`) and the `updateComponents` swap (self-visible
  `panel-status`) — both landing inside the open panel.
- `panel-close` uses `updateDataModel` **only**: the component-swap mechanism has no distinct
  visible target when the panel is closed (only the trigger renders), so the single write to the
  trigger's bound label is the faithful response, not an omission — the asymmetry the
  closed-visibility constraint forces.
- The unknown-event fallback is infra behavior, not authored here.
