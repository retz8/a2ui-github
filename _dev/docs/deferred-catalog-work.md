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
