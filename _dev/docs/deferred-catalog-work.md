# Deferred catalog work

Catalog props/components intentionally deferred during authoring, keyed by the phase that
picks them up. Read the relevant section when starting that phase.

## Phase 5 — Catalog build-out

### Button — element-typed visual props

Primer `Button`'s `icon`, `leadingVisual`, `trailingVisual`, and `trailingAction` are
element-typed (`React.ReactElement | React.ElementType`) — not JSON-serializable, so they
were omitted from the 2.2 `Button` schema. Carry them as `ComponentId` child references
(the A2UI-idiomatic translation of an element slot) once an `Icon` component exists.

See finding #5 in `a2ui-findings.md` for the general rule, and the deferred-props comment
in `primer-a2ui-adapter/src/components/button/button.schema.ts`.
