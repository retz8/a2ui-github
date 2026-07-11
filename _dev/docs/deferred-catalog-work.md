# Deferred catalog work

Catalog props/components intentionally deferred during authoring, keyed by the phase that
picks them up. Read the relevant section when starting that phase.

## Phase 6 — Catalog build-out

### Button — element-typed visual props

Primer `Button`'s `icon`, `leadingVisual`, `trailingVisual`, and `trailingAction` are
element-typed (`React.ReactElement | React.ElementType`) — not JSON-serializable, so they
were omitted from the 2.2 `Button` schema. Carry them as `ComponentId` child references
(the A2UI-idiomatic translation of an element slot) once an `Icon` component exists.

See finding #5 in `a2ui-findings.md` for the general rule, and the deferred-props comment
in `primer-a2ui-adapter/src/components/button/button.schema.ts`.

### Checkbox — visible label + optional toggle action

Deferred in the 6.16 design session (`_dev/docs/new-components/checkbox.md`):

- **Visible label:** Primer `Checkbox` has no label prop — visible labeling ships with
  `FormControl` / `FormControl.Label` (6.47). Revisit Checkbox's UI wiring when `FormControl`
  lands; `accessibility.label` covers the accessible name meanwhile.
- **Optional `action`:** Checkbox carries no `Action` — change is the two-way write to
  `checked`'s bound path. Backfill an optional `action` only if a future flow needs
  toggle-initiated agent round-trips.

### Token / IssueLabelToken — remove-event status-swap visibility

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
