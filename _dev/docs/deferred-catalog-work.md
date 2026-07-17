# Deferred catalog work

Catalog props/components intentionally deferred during authoring, keyed by the phase that
picks them up. Read the relevant section when starting that phase.

## Phase 6 — Catalog build-out

### Button — element-typed visual props — DONE (6.4)

Primer `Button`'s `icon`, `leadingVisual`, `trailingVisual`, and `trailingAction` are
element-typed (`React.ReactElement | React.ElementType`) — not JSON-serializable, so they
were omitted from the 2.2 `Button` schema. Carry them as `ComponentId` child references
(the A2UI-idiomatic translation of an element slot) once an `Icon` component exists.

See finding #5 in `a2ui-findings.md` for the general rule, and the deferred-props comment
in `primer-a2ui-adapter/src/components/button/button.schema.ts`.

Resolved in task 6.4 (Button revisit), unblocked by 6.2 `Icon`: all four slots are now
carried as optional `ComponentId` children in `button.schema.ts`.

### Checkbox — visible label + optional toggle action

Deferred in the 6.16 design session (`_dev/docs/new-components/checkbox.md`):

- **Visible label:** Primer `Checkbox` has no label prop — visible labeling ships with
  `FormControl` / `FormControl.Label` (6.47). Revisit Checkbox's UI wiring when `FormControl`
  lands; `accessibility.label` covers the accessible name meanwhile.
- **Optional `action`:** Checkbox carries no `Action` — change is the two-way write to
  `checked`'s bound path. Backfill an optional `action` only if a future flow needs
  toggle-initiated agent round-trips.

### Select — visible label + optional selection action

Deferred in the 6.31 design session (`_dev/docs/new-components/select.md`):

- **Visible label:** Primer `Select` has no label prop — visible labeling ships with `FormControl`
  / `FormControl.Label` (6.47). Revisit `Select`'s UI wiring when `FormControl` lands;
  `accessibility.label` covers the accessible name meanwhile.
- **Optional `action`:** `Select` carries no `Action` — selection is the two-way write to `value`'s
  bound path. Backfill an optional `action` only if a future flow needs selection-initiated agent
  round-trips.

### TextInput.Action — visual tooltip-direction gallery

Deferred in the 6.30 design session (`_dev/docs/new-components/textinput-action.md`):

`tooltipDirection` is covered now by a render-test assertion (the rendered tooltip carries the
direction per enum value) plus a non-baselined `textinput-action-tooltip` fixture for manual
hover review. A **Playwright-baselined** 8-direction gallery is deferred: Primer's `TooltipV2`
has no public always-open prop (only `_privateDisableTooltip` to force closed), and the client
baseline harness (`client/e2e/visual.spec.ts`) is static-render-only — it does
`goto → screenshot` with no hover/focus driving. Capturing the tooltip requires
hover/focus-before-screenshot, which is new baseline infra (out of a Phase-6 leaf sub-task per
"consumes, never builds infra"). Revisit once hover-capture baseline infra exists; the
`textinput-action-tooltip` fixture already renders the eight directions.

### TextInput — visible label

Deferred in the 6.30 design session (`_dev/docs/new-components/textinput.md`):

Primer `TextInput` has no label prop — visible labeling ships with `FormControl` /
`FormControl.Label` (6.47), same as Checkbox/Textarea/Select. Revisit `TextInput`'s UI wiring
when `FormControl` lands; `accessibility.label` covers the accessible name meanwhile.

### Token / IssueLabelToken — remove-event status-swap visibility — DONE (6.23 follow-up)

Deferred in the 6.12 review (event fixtures `token-remove-event`, `issuelabeltoken-remove-event`):

The remove-event agent response has two halves — `updateDataModel /removed=true` (visible: the
token goes `disabled` via `disabled ← /removed`) and `updateComponents` swapping a sibling status
`Text` (id `status`, e.g. "✅ Removed — server received …"). A surface renders only the `root`
tree, and at 6.12 no container component can host both the token and the status `Text` under one
root, so the status `Text` is authored in the fixtures but never rendered — only the token-disabling
half is observable.

Revisit when `Stack` (6.23) lands: make each event fixture's `root` a `Stack` with `[token, status]`
children so the status-swap half renders. The fixtures and the agent responses
(`agent/deterministic_agent/fixtures/token-remove.json` / `issue-label-remove.json`) already carry
the status content; add the two fixtures' status surfaces to the e2e baseline list at that point.

- **`token-remove-event`: DONE** — `root` is now a `Stack` hosting `[token, status]`; the
  status-swap half renders. Baseline regenerated (the name was already in the e2e list).
- **`issuelabeltoken-remove-event`: DONE** — `root` is now a `Stack` hosting
  `[issuelabeltoken, status]`; the status-swap half renders. Baseline regenerated.

### Radio — select-event status-swap visibility — DONE (6.23 follow-up)

Deferred in the 6.17 review (event fixture `radio-event`):

The select-event agent response has two halves — `updateDataModel /selected=true` (visible: the
radio checks via `checked ← /selected`) and `updateComponents` swapping a sibling status `Text`
(id `status`, "✅ Selected — server received …"). A surface renders only the `root` tree, and no
container component can yet host both the radio and the status `Text` under one root, so the status
`Text` is authored in the fixture but never rendered — only the radio-checking half is observable.
The full round-trip was confirmed live in the 6.17 review (card fetch → `message/send` POST →
`/selected` write → the radio checks); the returned status `Text` had nowhere to render.

Revisit when `Stack` (6.23) lands: make `radio-event`'s `root` a `Stack` with `[radio, status]`
children so the status-swap half renders. The fixture and the agent response
(`agent/deterministic_agent/fixtures/select.json`) already carry the status content; add the
fixture's status surface to the e2e baseline list at that point.

- **`radio-event`: DONE** — `root` is now a `Stack` hosting `[radio, status]`; the status-swap
  half renders. Baseline frozen (the name was already in the e2e list).

### ToggleSwitch — toggle-event status-swap visibility — DONE (6.23 follow-up)

Deferred in the 6.18 review (event fixture `toggleswitch-event`):

The toggle-event agent response has two halves — `updateDataModel /setting=false` (visible: the
switch reverts off via `checked ← /setting`, overriding the optimistic local flip) and
`updateComponents` swapping a sibling status `Text` (id `status`, "⚠️ Could not save — reverted by
server"). A surface renders only the `root` tree, and no container component can yet host both the
switch and the status `Text` under one root, so the status `Text` is authored in the fixture but
never rendered — only the switch-reverting half is observable. The full round-trip was confirmed
live in the 6.18 review (card fetch → `message/send` POST → `/setting` write → the switch reverts);
the returned status `Text` had nowhere to render.

Revisit when `Stack` (6.23) lands: make `toggleswitch-event`'s `root` a `Stack` with
`[toggleswitch, status]` children so the status-swap half renders. The fixture and the agent
response (`agent/deterministic_agent/fixtures/toggle.json`) already carry the status content; add
the fixture's status surface to the e2e baseline list at that point.

- **`toggleswitch-event`: DONE** — `root` is now a `Stack` hosting `[toggleswitch, status]`; the
  status-swap half renders. Baseline updated (the name was already in the e2e list).

### Stack / Stack.Item — responsive-arm multi-viewport baselines

Deferred in the 6.23 design session and build (`_dev/docs/new-components/stack.md`,
`stack-item.md`):

Every `ResponsiveValue`-bearing prop (Stack's scale props; Stack.Item's `grow`/`shrink`) is
carried faithfully in the schema as the `responsive()` union — the scalar arm plus a
`{narrow, regular, wide}` per-viewport map. But the responsive *object* arm only shows its
effect across viewport widths, which needs multi-viewport Playwright baselines (the same fixture
captured at narrow + regular + wide). The current e2e harness captures each fixture at a single
viewport (1024px), so that infra does not exist, and building it is out of Phase 6's scope
("consumes, never builds infra").

Coverage meanwhile: a render-test assertion proves the responsive `data-*` attributes are emitted
and forwarded (`stack-responsive` → `data-direction-narrow/regular/wide`), and the single-viewport
`stack-responsive` baseline captures the regular (horizontal) state; the cross-viewport effect is
verified manually by resizing. Revisit if/when multi-viewport visual baselining is added to the e2e
harness — then add narrow/wide captures for `stack-responsive` and a Stack.Item grow/shrink
responsive fixture.

### SplitPageLayout — narrow-viewport visual demos (responsive arms + Sidebar.responsiveVariant)

Deferred in the 6.35 design session (`_dev/docs/new-components/split-page-layout*.md`):

Two narrow-viewport-only effects need the same multi-viewport Playwright infra the Stack entry
above describes (single-viewport 1024px harness; building multi-viewport capture is out of Phase 6):

- **Responsive-arm props** — `hidden` (`responsive(z.boolean())`) on all five regions, `divider`
  (responsive, narrow arm also allowing `'filled'`) on Header/Content/Footer/Pane, and Pane
  `position` (`responsive(z.enum(['start','end']))`). Carried faithfully in the schema; the
  responsive *object* arm and the narrow-only `'filled'` divider only show across viewport widths.
- **`SplitPageLayout.Sidebar.responsiveVariant`** — `'fullscreen'` expands the sidebar to a
  full-screen overlay only below the narrow breakpoint; at the harness's regular viewport it is
  indistinguishable from `'default'`.

Coverage meanwhile: render-test assertions (responsive `data-*`/attributes emitted and forwarded;
`hidden: true` omits the region; `responsiveVariant` value applied), and the scalar arms are
baselined via the shipped galleries. Revisit once multi-viewport visual baselining exists — then add
narrow/wide captures for the responsive-divider/`hidden`/`position` arms and a Sidebar `fullscreen`
demo.

### Dialog — narrow-only position visuals + custom-frame render props

Deferred in the 6.52 design session (`_dev/docs/new-components/dialog*.md`):

- **`position` responsive-arm visuals** — `bottom` (bottom sheet) and `fullscreen` exist only in
  the responsive-object arm and take effect only below the narrow breakpoint; the same
  multi-viewport Playwright infra the Stack/SplitPageLayout entries above describe
  (single-viewport 1024px harness; building multi-viewport capture is out of Phase 6). Coverage
  meanwhile: a render-test assertion proves the per-viewport `data-position-*` attributes are
  emitted and forwarded; the scalar arm (`center`/`left`/`right`) is baselined
  (`dialog-position-left`/`-right`); the narrow-only `bottom`/`fullscreen` effect is verified
  manually by resizing below the narrow breakpoint (the prop is carried and rendered in full —
  only the automated capture is deferred). Revisit once multi-viewport visual baselining exists —
  then add narrow captures for `bottom` and `fullscreen`.
- **`renderHeader` / `renderBody` / `renderFooter`** — function-typed render props, not
  JSON-serializable. Their capability (a custom header/body/footer) is carried by the
  `DialogHeader`/`DialogBody`/`DialogFooter` slot leaves shipped in the same family; backfill a
  representation only if a custom-frame need ever appears that the slot leaves cannot cover.
