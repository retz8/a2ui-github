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

### Radio — select-event status-swap visibility

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

### ToggleSwitch — toggle-event status-swap visibility

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
