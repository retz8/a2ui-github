# SelectPanel

- **Official documentation URL:** https://primer.style/product/components/select-panel/
- **Real prop surface resolved from:** `@primer/react` installed type declarations at
  `node_modules/@primer/react/dist/SelectPanel/SelectPanel.d.ts` (`SelectPanelProps` =
  `SelectPanelBaseProps` & `Omit<FilteredActionListProps, 'selectionVariant'|'variant'|'message'>` &
  `Pick<AnchoredOverlayProps, 'open'|'height'|'width'|'align'|'displayInViewport'>` &
  `AnchoredOverlayWrapperAnchorProps` & (`SelectPanelSingleSelection` | `SelectPanelMultiSelection`) &
  `SelectPanelVariantProps`), following the intersections into
  `FilteredActionList/FilteredActionList.d.ts` + `FilteredActionList/types.d.ts` (the list surface and
  the `ItemInput` / `FilteredActionListItemProps` item descriptor) and `AnchoredOverlay/AnchoredOverlay.d.ts`
  (the anchor + positioning slice) — reconciled against the official doc's core prop table.
- **Component-level description (→ `catalog.json` `description`):** A dialog that lets a user find and
  select one or several items from a filterable list, opened from a trigger.

> `SelectPanel` ships as a **compound family**, mirroring Primer: `SelectPanel.Item` is shipped as a
> sibling catalog leaf in this same 6.50 sub-task, with its own decision doc at `selectpanel-item.md`.
> `SelectPanel`'s `children` slot references `SelectPanel.Item` through the `ChildList` container-slot
> convention (`stack.md`, `select.md`); each resolved `SelectPanel.Item` maps to one Primer `ItemInput`
> in the render fn. Item leading/trailing-visual slots reference the `Icon` leaf (6.2) and other
> shipped visual leaves.

## Rendering & composition

SelectPanel fuses two already-shipped surfaces — `AnchoredOverlay` (6.55, the anchor + open +
positioning model) and a filtered `ActionList` (6.38, the items + per-item selection model) — plus
panel chrome (title/subtitle/filter/secondary-action). Its render behavior is component-local logic,
not shared infra (the AnchoredOverlay precedent):

- **Anchor wiring (AnchoredOverlay precedent).** The synthetic `anchor` (`ComponentId`) is resolved
  with `buildChild` and wrapped in a ref-bearing element handed to Primer's `renderAnchor`; that
  wrapper receives the positioning ref and the open gesture handler. Primer's `placeholder`
  (default-trigger text) is superseded by this composed anchor and dropped.
- **`open` two-way write-back (AnchoredOverlay precedent).** The binder auto-generates `setOpen` from
  the `DynamicBoolean` `open`; an open gesture calls `setOpen(true)`, a close gesture (Escape /
  outside-click / selection / cancel) calls `setOpen(false)`. The state flip is automatic, so the leaf
  toggles standalone. `onOpenChange` and `onCancel` are optional additional `Action`s that fire
  **alongside** the automatic state change (either shape); the gesture-kind parameter is not forwarded
  (Action context is authored, not per-invocation — the AnchoredOverlay/Dialog precedent).
- **Items as a `ChildList`.** `items` is carried as the synthetic `children` (`ChildList` →
  `SelectPanel.Item`); the render fn maps each resolved item leaf's props to a Primer `ItemInput`
  (leading/trailing-visual `ComponentId`s become `renderItem` content). Primer's top-level
  `selected`/`onSelectedChange` are represented by the per-item `SelectPanel.Item.selected` two-way
  bindings (the ActionList per-item selection model), and are **not** carried at the root; the
  synthetic `selectionVariant` enum sets single- vs multi-select mode.
- **Client-local filtering.** `filterValue` is `DynamicString`, two-way bound to the filter input; the
  render fn filters the resolved items by substring match against `filterValue` — no agent round-trip.
  Primer's controlled-filter `onFilterChange` is represented by this write-back and dropped.
- **`variant: modal`.** Renders the panel as a centered modal (backdrop) rather than anchored to the
  trigger; a static end-state screenshottable exactly as `Dialog` (6.52). `onCancel` is the modal's
  cancel hook.
- **Narrow-fullscreen visual deferral (AnchoredOverlay precedent).** `disableFullscreenOnNarrow`
  ships and is forwarded; its below-breakpoint **visual** baseline is deferred to multi-viewport
  capture infra (`deferred-catalog-work.md`). Regular-viewport visuals are fully baselined.

## Adapter section

### Prop-surface table

| prop | decision | synthetic? | A2UI type | description |
|---|---|---|---|---|
| `anchor` | carry (required) | yes | `ComponentId` | The trigger component that opens the panel. |
| `children` | carry (required) | yes (← `items`) | `ChildList` | The selectable items shown in the panel. |
| `open` | carry (required) | no | `DynamicBoolean` | Whether the panel is open; the trigger's open and close gestures write this value back automatically. |
| `selectionVariant` | carry | yes | `z.enum(['single','multiple']) (default: "single")` | Whether one or several items may be selected at once. |
| `title` | carry | no | `DynamicString` | The panel's heading. |
| `subtitle` | carry | no | `DynamicString` | Secondary heading text shown below the title. |
| `filterValue` | carry | no | `DynamicString` | The filter input's text; two-way bound, and the items are filtered against it locally. |
| `placeholderText` | carry | no | `DynamicString (default: "Filter items")` | Placeholder shown in the empty filter input. |
| `inputLabel` | carry | no | `DynamicString` | Accessible label for the filter input. |
| `variant` | carry | no | `z.enum(['anchored','modal']) (default: "anchored")` | Whether the panel anchors to the trigger or opens as a centered modal. |
| `onOpenChange` | carry | no | `Action` | An additional action performed when the panel opens or closes; the open/close state itself is handled automatically. |
| `onCancel` | carry | no | `Action` | An additional action performed when a modal panel is cancelled; dismissal itself is handled automatically. |
| `secondaryAction` | carry | no | `ComponentId` | A button or link shown in the panel's footer. |
| `notice` | carry | no | `z.object({ text: DynamicString, variant: z.enum(['info','warning','error']) })` | A banner shown at the top of the panel. |
| `message` | carry | no | `z.object({ title: DynamicString, body: DynamicString, variant: z.enum(['empty','error','warning']) })` | The empty or error state shown in place of the list. |
| `loading` | carry | no | `DynamicBoolean (default: false)` | Whether the panel is showing a loading state. |
| `showSelectedOptionsFirst` | carry | no | `z.boolean()` | Whether selected items are sorted to the top of the list. |
| `showSelectAll` | carry | no | `z.boolean() (default: false)` | Whether a "select all" control is shown (multi-select). |
| `align` | carry | no | `z.enum(['start','center','end']) (default: "start")` | How the panel aligns along the trigger's edge. |
| `height` | carry | no | `z.enum(['xsmall','small','medium','large','xlarge','auto','initial','fit-content'])` | The panel's height: preset sizes, or content-driven (`auto`/`initial`/`fit-content`). |
| `width` | carry | no | `z.enum(['small','medium','large','xlarge','xxlarge','auto'])` | The panel's width: preset sizes, or `auto` to fit its content. |
| `displayInViewport` | carry | no | `z.boolean() (default: false)` | Whether the panel is kept within the viewport bounds. |
| `showItemDividers` | carry | no | `z.boolean()` | Whether a divider is shown above each item. |
| `virtualized` | carry | no | `z.boolean() (default: false)` | Whether only the visible rows are mounted, for performance with very large lists. |
| `focusOutBehavior` | carry | no | `z.enum(['stop','wrap']) (default: "wrap")` | Whether keyboard navigation stops at the list's ends or wraps around to the other end. |
| `disableFullscreenOnNarrow` | carry | no | `z.boolean()` | Whether the panel stays anchored, rather than going fullscreen, on narrow viewports. |
| `accessibility` | carry | no | `AccessibilityAttributes` | Accessible label/description for the panel dialog, for assistive technologies. |

Notes:

- `anchor` is tightened to **required** (synthetic primary slot, the AnchoredOverlay precedent):
  without a trigger the panel has nothing to open from.
- `children` (← `items`) is tightened to **required** (synthetic content channel), matching the Primer
  `items` required typing; an empty list is still valid (the `message` empty state renders instead).
- `open` follows the installed required typing; every other prop is optional per its installed type.
- `title`/`subtitle`'s `string | React.ReactElement` union projects to `DynamicString` (the element
  arm is dropped — the standard string|element projection).

### Functions

| name | args | returnType | description |
|---|---|---|---|
| `consoleLog` | `message: string` (The message to log.) | `void` | Logs a message. A local client-side effect invoked from `functionCall` actions (`onOpenChange` / `onCancel`). Already registered in the catalog — no new registration. |

### Dropped / deferred props

| prop | reason |
|---|---|
| `selected` / `onSelectedChange` | Represented by the per-item `SelectPanel.Item.selected` two-way bindings (the ActionList per-item selection model); not carried at the root. Single-select exclusivity is owned by the data model / agent, not the schema. |
| `onFilterChange` | Represented by the two-way write-back on `filterValue`; the render fn filters items locally. No separate protocol prop. |
| `placeholder` | Dropped: it sets the built-in default-trigger's text, which the synthetic `anchor` (`ComponentId`) supersedes. |
| `renderAnchor` / `anchorRef` / `anchorId` | Function/ref/id-typed anchor wiring — not JSON-serializable. Represented by the synthetic `anchor: ComponentId`, wrapped in a ref-bearing element handed to `renderAnchor`. |
| `footer` | Dropped: deprecated in favor of `secondaryAction`. |
| `initialLoadingType` / `loadingType` | Dropped: loader-style knobs (spinner vs skeleton). Only the `loading` boolean is carried; the renderer picks a default loader style. |
| `message.icon` / `message.action` | **Deferred** (`deferred-catalog-work.md`): element-typed sub-fields of `message`; nested `ComponentId`-inside-a-structured-object has no render precedent yet. The empty/error state's title/body/variant are carried. Grow back when a decorated empty state is needed. |
| `groupMetadata` / `groupId` / `renderItem` / `renderGroup` | **Deferred** (`deferred-catalog-work.md`): item grouping (data-driven groups) plus element-typed renderers. A grouped-items leaf grows lazily if a flow needs one. |
| `overlayProps` / `textInputProps` / `actionListProps` | Untyped `Partial<…>` passthrough bags; no single A2UI representation. The discrete props they reach (`height`/`width`/`align`, the filter input's label) are carried directly. |
| `inputRef` / `scrollContainerRef` / `onListContainerRefChanged` / `onInputRefChanged` / `onActiveDescendantChanged` / `onSelectAllChange` | Refs and observational layout/focus-readback callbacks; no author-facing capability, not JSON-serializable. |
| `_PrivateFocusManagement` / `disableSelectOnHover` / `setInitialFocus` / `focusPrependedElements` / `announcementsEnabled` / `scrollBehavior` / `fullScreenOnNarrow` | Private/behavioral tuning knobs and a duplicate narrow-fullscreen switch; no protocol representation (or redundant with a carried prop). |
| `role` / `id` / `'aria-label'` | The list's role/id are fixed by the render fn; the accessible name is carried through `accessibility`. |
| `messageText` | Dropped: the simpler `{title, description}` empty-state variant, folded into the richer carried `message`. |
| `className` | Styling passthrough; no A2UI representation. |

---

## Client section

Family-wide (the `action-list.md` model — `SelectPanel.Item`'s fixtures live here, not in
`selectpanel-item.md`) and **composed-centered**: one rich, GitHub-triage-flavored baseline (a **label
picker** — "Apply labels to this issue") exercises the container + item leaves together, with
single-axis fixtures for each visually-distinct prop and render-tests for non-visual ones. Filler is
built from already-shipped leaves (`Button`, `Icon`, `Text`, `Label`).

Two harness constraints, both the AnchoredOverlay/Dialog precedent:

- **One open panel per baseline surface** — the panel portals and positions absolutely, so
  co-locating several open panels risks collisions.
- **Static baseline only captures `open: true`** — the baseline harness is `goto → screenshot` with no
  gesture driving, so the open/close gesture, filter typing, and the selection write-back are exercised
  by **vitest render-tests** (userEvent), not baselines.

### Fixture table

| fixture | exercises (coverage axis) | component state / canned values | baselined? |
|---|---|---|---|
| `selectpanel` | composed baseline — root slots + item leaf slots together | open anchored panel; anchor `Button`(`Text` "Labels"); `title:"Apply labels"`, `subtitle:"Select up to 10"`, `selectionVariant:multiple`, `placeholderText:"Filter labels"`; `children` = 5 `SelectPanel.Item` [bug (`leadingVisual`→`Icon`, `description` inline "Something isn't working", `selected:true`), enhancement (`Icon`, `selected:true`), documentation (`Icon`), wontfix (`variant:danger`, `description` "Will not be worked on"), duplicate (`disabled:true`)]; `secondaryAction`→`Button`(`Text` "Edit labels") | yes |
| `selectpanel-children-template` | `children` — dynamic template (bound array) | `children:{componentId:'tpl', path:'/labels'}`; `tpl`=`SelectPanel.Item`[`text:{path:'./name'}`, `selected:{path:'./on'}`]; data model `/labels=[{name:'bug',on:true},{name:'docs',on:false},{name:'ci',on:false}]` | yes |
| `selectpanel-open-bound` | `open` — path binding | `open:{path:'/open'}` + data model `{open:true}`; base composition | yes |
| `selectpanel-closed` | `open:false` — panel hidden | `open:false`; base composition → render-test (only the trigger renders; panel absent from DOM) | no (render-test) |
| `selectpanel-toggle` | open/close gesture (two-way write-back) | render-test: click trigger → `setOpen(true)`; Escape / outside-click → `setOpen(false)` | no (render-test) |
| `selectpanel-filter` | `filterValue` — local filtering (visual) | `filterValue:"doc"`; 4-item list ("bug"/"documentation"/"enhancement"/"ci") → only "documentation" shown | yes |
| `selectpanel-filter-type` | `filterValue` — two-way write-back + live filter | render-test: type "doc" into filter → `/filter` write + list narrows to matching items | no (render-test) |
| `selectpanel-selectionvariant` | gallery — `selectionVariant` | 2 surfaces: `single` (checkmarks), `multiple` (checkboxes); each a realistic 4-item list, 1–2 `selected:true` | yes (one PNG) |
| `selectpanel-variant-modal` | `variant:modal` — centered modal | `variant:'modal'`; base composition; `onCancel: functionCall consoleLog {message:"cancelled"}` | yes |
| `selectpanel-notice` | gallery — `notice.variant` | 3 surfaces: `info`/`warning`/`error`; each base list + `notice:{text:"Some labels are managed by policy", variant:<v>}` | yes (one PNG) |
| `selectpanel-message` | gallery — `message.variant` (list replaced) | 3 surfaces: `empty`/`error`/`warning`; `children:[]`, `message:{title, body, variant:<v>}` | yes (one PNG) |
| `selectpanel-loading` | `loading` (boolean state) | `loading:true`; base composition | yes |
| `selectpanel-selectall` | `showSelectAll` (coupled with `multiple`) | `selectionVariant:multiple`, `showSelectAll:true`; 4-item list | yes |
| `selectpanel-selectedfirst` | `showSelectedOptionsFirst` (boolean state) | `showSelectedOptionsFirst:true`; 5-item list with 2 non-adjacent `selected:true` → sorted to top | yes |
| `selectpanel-dividers` | `showItemDividers` (boolean state) | `showItemDividers:true`; 4-item list | yes |
| `selectpanel-align` | gallery — `align` (non-default) | 2 surfaces: `center` / `end`; `open:true` | yes (one PNG each) |
| `selectpanel-height` | `height` — preset walk | one surface per `xsmall`/`small`/`medium`/`large`/`xlarge`; content tall enough to show the fixed height | yes (one PNG each) |
| `selectpanel-width` | `width` — preset walk | one surface per `small`/`medium`/`large`/`xlarge`/`xxlarge` | yes (one PNG each) |
| `selectpanel-onopenchange-fn` | `onOpenChange` — functionCall shape | `onOpenChange: functionCall consoleLog {message:"toggled"}`; render-test drives open/close | no (render-test) |
| `selectpanel-onopenchange-event` | `onOpenChange` — event shape (agent-coupled) | `onOpenChange: event {name:'panel-toggle'}`; render-test drives. **Coupled** (see Agent section): `title:{path:'/panel/title'}` (init "Apply labels"); anchor `Button` child `Text` id `anchor-label` (init "Labels"); data model `{panel:{title:'Apply labels'}}` | no (render-test) |
| `selectpanel-oncancel` | `onCancel` — modal cancel action | `variant:'modal'`, `onCancel: functionCall consoleLog {message:"cancelled"}`; render-test drives cancel gesture | no (render-test) |
| `selectpanel-item-description` | gallery — `SelectPanel.Item.descriptionVariant` | 2 surfaces: `inline` / `block`; realistic items with secondary text | yes (one PNG) |
| `selectpanel-item-variant` | gallery — `SelectPanel.Item.variant` | 2 surfaces: `default` / `danger`; each a realistic short list | yes (one PNG) |
| `selectpanel-item-disabled` | `SelectPanel.Item.disabled` (boolean state) | realistic list; one item `disabled:true` | yes |
| `selectpanel-item-selected-bound` | `SelectPanel.Item.selected` — two-way write-back | `multiple` list; one item `selected:{path:'/sel/bug'}` init `false`; render-test: click item → `/sel/bug=true` → checkmark follows | no (render-test) |
| `selectpanel-item-fn` | `SelectPanel.Item.action` — functionCall (local) | realistic list; one item `action: functionCall consoleLog {message:"item selected"}` | yes |
| `selectpanel-item-event` | `SelectPanel.Item.action` — event (→ agent) + coupling | realistic list; item "bug" `selected:{path:'/sel/bug'}` (init `false`), `action: event {name:'label-select', context:{selected:{path:'/sel/bug'}}}`; anchor `Button` child `Text` id `anchor-label` (init "Labels"). Server echoes `/sel/bug` + swaps `anchor-label` (see `selectpanel-item.md` agent section) | yes |

### Render-test assertions (non-visual)

- **`open:false`** — the panel is absent from the DOM; only the trigger renders (`selectpanel-closed`).
- **open/close gesture** — clicking the trigger calls the binder's `setOpen(true)`; Escape / outside-click
  calls `setOpen(false)` (`selectpanel-toggle`); the `-onopenchange-*` fixtures assert the action fires
  on each gesture.
- **`filterValue` typing** — typing into the filter writes the bound path and narrows the rendered list
  (`selectpanel-filter-type`).
- **`inputLabel`** — forwarded to the filter input as its `aria-label`.
- **`accessibility`** — `aria-label` / `aria-description` on the panel dialog.
- **`SelectPanel.Item.id`** — forwarded onto the item element.
- **`height` content-driven values** (`auto`/`initial`/`fit-content`) and **`width` `auto`** — forwarded;
  visually equivalent to the content-sized base, not separately baselined.
- **`displayInViewport` / `virtualized` / `focusOutBehavior`** — forwarded (smoke); no distinct
  deterministic visual in the static single-viewport harness, not baselined.
- **`disableFullscreenOnNarrow`** — forwarded; its narrow-viewport visual baseline is deferred
  (`deferred-catalog-work.md`, the AnchoredOverlay precedent).

### Prop-coverage map

| adapter prop | covered by |
|---|---|
| `anchor` | every fixture (the trigger) |
| `children` | `selectpanel` (static assembly) + `selectpanel-children-template` (dynamic template) |
| `open` | `selectpanel` (literal true) + `selectpanel-open-bound` (bound) + `selectpanel-closed` (false, render-test) + `selectpanel-toggle` (gesture, render-test) |
| `selectionVariant` | `selectpanel-selectionvariant` (single / multiple) |
| `title` | `selectpanel` (literal) + `selectpanel-onopenchange-event` (bound ← `/panel/title`) |
| `subtitle` | `selectpanel` (literal) |
| `filterValue` | `selectpanel-filter` (literal, narrowed list) + `selectpanel-filter-type` (two-way write-back, render-test) |
| `placeholderText` | `selectpanel` (set) |
| `inputLabel` | render-test assertion (filter `aria-label`) |
| `variant` | `selectpanel` (anchored default) + `selectpanel-variant-modal` (modal) |
| `onOpenChange` | `selectpanel-onopenchange-fn` (functionCall) + `selectpanel-onopenchange-event` (event) |
| `onCancel` | `selectpanel-oncancel` (functionCall, modal, render-test) |
| `secondaryAction` | `selectpanel` (footer button) |
| `notice` | `selectpanel-notice` (info / warning / error) |
| `message` | `selectpanel-message` (empty / error / warning) |
| `loading` | `selectpanel-loading` |
| `showSelectedOptionsFirst` | `selectpanel-selectedfirst` |
| `showSelectAll` | `selectpanel-selectall` |
| `align` | `selectpanel-align` (center / end) |
| `height` | `selectpanel-height` (5 presets) + render-test (content-driven values) |
| `width` | `selectpanel-width` (5 presets) + render-test (`auto`) |
| `displayInViewport` | render-test (smoke) |
| `showItemDividers` | `selectpanel-dividers` |
| `virtualized` | render-test (forwarding) |
| `focusOutBehavior` | render-test (forwarding) |
| `disableFullscreenOnNarrow` | render-test (forwarding; narrow visual deferred) |
| `accessibility` | render-test (dialog `aria-label` / `aria-description`) |
| `SelectPanel.Item.*` | covered in this family-wide section — see the item fixtures above and the coverage in `selectpanel-item.md` |

---

## Agent section

The root emits one `event`-shaped action: `onOpenChange` → `panel-toggle`, exercised in the
interaction-driven render-test `selectpanel-onopenchange-event` (the static harness cannot drive the
open/close gesture). (`SelectPanel.Item.action` → `label-select` is the item leaf's event; see
`selectpanel-item.md`. `onCancel`'s fixture uses `functionCall`, so it has no agent row.)

**Both-states-visible constraint.** `onOpenChange` fires on **both** open and close, and the
gesture kind is not forwarded, so one authored response fires in both states. When open, the panel and
the trigger both render; when closed, only the trigger. The response therefore writes an in-panel bound
value (the panel `title`, visible when open — the binding-proof half) **and** swaps the always-rendered
trigger label (self-visible in both states).

### Event-response table

| event | response messages (ordered, with canned values) | visibility coupling (client fixture · bound prop ← path · initial value) |
|---|---|---|
| `panel-toggle` | 1. `updateDataModel {path:'/panel/title', value:'Apply labels — 12 available'}` · 2. `updateComponents [{id:'anchor-label', component:'Text', text:'Labels ▾'}]` (surfaceId echoed — stamped at runtime, not authored) | `selectpanel-onopenchange-event` · `title ← /panel/title` (init "Apply labels") + anchor `Button` child `Text` id `anchor-label` (init "Labels") |

Notes:

- The response exercises **both** update mechanisms — the `updateDataModel` write to the panel `title`
  (binding proof, visible in the open panel) and the `updateComponents` swap of the trigger label
  (self-visible, rendered in both open and closed states).
- The unknown-event fallback is infra behavior, not authored here.
