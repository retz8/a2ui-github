# Task 6.4 — Button revisit

Carry Button's four deferred element-typed slots now that `Icon` (6.2) exists, and backfill
Button's fixtures/baselines to the exhaustive per-prop standard. Sub-task of Phase 6
(`_dev/docs/spec/phase-6-catalog-build-out.md` §6); resolves the Button entry in
`_dev/docs/deferred-catalog-work.md`.

## Scope

- **Adapter:** add `icon`, `leadingVisual`, `trailingVisual`, `trailingAction` to the Button
  schema/render/catalog + parity, and adjust `child` for the icon-only case.
- **Client:** bring Button's fixtures/baselines up to the exhaustive per-prop standard —
  backfill the missing prop-walk fixtures and add one per new slot, all with blessed baselines.
- **Docs (on `main`):** reconcile the Button decision doc to the carried surface and close the
  Button deferral register entry.
- **Agent:** untouched — no new event shapes; the existing event round-trip already covers the
  event path.

## Locked decisions

### 1. Governing principle — faithful 1:1 Primer→A2UI mapping, no per-prop editorializing

The catalog maps Primer's real prop surface faithfully. We do **not** drop or defer a prop on
judgment about what an agent "should" use, redundancy with another component, or perceived
messiness. The only legitimate reason to defer or drop a prop is a **genuine representational
block** — non-serializable with no A2UI translation, or nothing that can fill it yet.
Composition judgment belongs to the Phase-7 agent, not the catalog layer. This principle governs
the whole task (and the catalog build-out generally).

### 2. Carry all four element-typed slots

`icon`, `leadingVisual`, `trailingVisual`, and `trailingAction` are all element-typed; the
faithful A2UI translation of an element slot is a `ComponentId` child. With `Icon` now shipped
there is no representational block on any of them (a `ComponentId` may reference an `Icon` today
or another leaf later — the agent chooses). All four are carried as optional `ComponentId`
props under their verbatim Primer names. `trailingAction` is carried as a positioned visual
slot; it is not held back for lacking a nested-interactive leaf. This fully consumes the Button
element-typed-props deferral.

### 3. Icon-only mode — `child` optional, mirror Primer's precedence

Primer renders the button icon-only when `icon` is set (label and visuals discarded, `icon`
wins). To model this faithfully, `child` becomes optional. We mirror Primer's render precedence
exactly and add no cross-field validation — no rule requiring exactly one of `{child, icon}`,
no rejection of `icon` combined with visuals. The behavior is documented, not enforced.

### 4. `count` / `trailingVisual` precedence — mirror, do not enforce

Primer renders `count` in the trailing-visual slot and lets an explicit `trailingVisual` win
over it when both are set. Both props remain independent in the schema; Primer arbitrates at
render. Documented, not enforced.

### 5. Fixture backfill — exhaustive per-prop standard

Bring Button to the one-scenario-per-carried-prop standard: backfill the missing prop-walk
fixtures (`button-sizes`, `button-aligncontent`, `button-disabled`, `button-inactive`,
`button-loading`, `button-block`, `button-labelwrap`, `button-count`) and add one fixture per
new slot (`button-icon`, `button-leading-visual`, `button-trailing-visual`,
`button-trailing-action`), all with blessed baselines. The `trailingAction` fixture also carries
a `trailingVisual` so the baseline captures `trailingAction`'s distinct position (Primer renders
it outside the content group as the always-last element). `button-aligncontent` stays as-is — a
`block` button with a label already renders a visible start-vs-center difference; no visual is
needed to demonstrate alignment.

## Invariants

- The governing principle (decision 1) applies throughout: any prop is mapped unless it has a
  genuine representational block.

## Open items

None — `icon` and `trailingAction` were both resolved to carry during the grill.
