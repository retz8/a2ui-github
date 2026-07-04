# Task 4.3 — Agent-fixture surface

Covers TODO `## Phase 4` sub-task **4.3 — Agent-fixture surface**: the agent *design* procedure into `design-catalog-component/SKILL.md` and the agent *build/test* procedure into `build-catalog-component/SKILL.md`, validated against Button's deterministic fixture (Phase 2.4/2.5). Appends to the two `SKILL.md` files that 4.1 began and 4.2 continued. The two-skill architecture lives in `phase-4-catalog-authoring-skill.md`; this spec holds the 4.3-scoped decisions.

## Scope

- The per-component agent loop, captured as prose appended to both skills: which canned server response a component's events need (Design) and how that response, its mapping, its tests, and the client-fixture coupling are materialized (Build).
- Validation is a read-through against Button's shipped agent artifacts, plus one product-code change (decision 10).

Out of scope: the deterministic executor, the conformance validator, the server wiring, the `run_executor` harness, and the A2A JS↔Python wire — all consumed as one-time infrastructure, never re-derived per component; frontmatter/overview/orchestration for either skill (4.4); the live end-to-end dogfood with kept decision docs (4.4).

## Locked decisions

### 1. The agent surface is a narrow per-component loop over consumed infra

The recurring per-component work is three artifacts: a canned-response fixture (`fixtures/<event>.json`), one event-name → fixture mapping entry, and the per-event tests. Everything else on the agent side is one-time infrastructure the loop *consumes*, not something it re-derives per component: the `DeterministicAgentExecutor` and the response-building/stamping/fallback machinery, the catalog-conformance validator, the server wiring, the `run_executor` test harness, and the A2A round-trip wire. The build procedure never stands this scaffold up; if it is missing, that is a scaffold/template concern outside the loop. The round-trip wire is **documented** (so the two skills together tell the whole event story) but is consumed infra, not part of the per-component build loop.

### 2. Design call — one canned response per event the component emits

The agent design call walks each `event`-shaped `Action` prop the component emits (from the locked adapter prop-surface table) and, for each event name, designs the canned A2UI response the deterministic agent returns. The `functionCall` action shape runs locally client-side and never reaches the agent, so it produces no agent fixture; a component with no event-shaped action (e.g. `Text`) gets no agent section at all.

### 3. Design output — response plus its visibility coupling, as one unit

The canned response is an invented design artifact ("what would a plausible server do in reaction to this event?"), not a derivation from anything upstream. The design call's output is the response messages with their concrete canned values **together with** the visibility coupling that renders them, treated as one inseparable unit per event. The governing principle: a response should drive both update mechanisms where the component supports them — `updateComponents` (a component swap, self-visible) and `updateDataModel` (a path write, visible only when a rendered prop binds that path) — and **every data-model write must bind to a rendered prop in the paired client event fixture**, otherwise the write is invisible and untestable. Realizing the coupling **edits the paired client event fixture in place** (the bound prop plus an initial data-model value), matching Phase 2's approach.

### 4. Decision-doc agent section — one event-response table

The Design skill's agent section appends to the same per-component decision doc a single event-response table, one row per event the component emits, with columns `event | response messages (ordered, with canned values) | visibility coupling (client fixture · bound prop ← path · initial value)`. Response and coupling live in one table because they are one design unit per event. The unknown-event fallback is infra behavior, not authored per component, so it gets no row.

### 5. Build loop and its test structure

The Build skill's agent section is an ordered per-component loop, opening with the infra-assumption preamble (decision 1): author the `<event>.json` fixture (surfaceId omitted, stamped at runtime), register the event → fixture mapping entry, and amend the paired client event fixture in place for the coupling. Its test structure maps 1:1 onto the client surface's split:

- The response-content test is the one authored per-event case (the canned-content assertion, surfaceId echoed) — the analog of the client's per-fixture render/action tests.
- The conformance test auto-covers new events by deriving from the event → fixture registry — the analog of the client's `FIXTURES`-derived structural test.
- The executor test is untouched: the executor is component-agnostic and proven once; a new event walks the identical path. It is one-time infra, not a per-event case.

### 6. Verification — CI reactivity is infra, per-component gate is a server-up round-trip bless

The CI re-render test (an applied server-style update reactively re-renders an existing surface) proves the component-agnostic renderer-reactivity mechanism; it is infra proven once, not authored per component. A new component's integration halves are already covered by conformance (the server side emits a catalog-valid path write) and the client's bound-fixture render test (the prop resolves from the data model). The per-component agent verification gate is the Claude-Chrome **round-trip** bless: server up, select the paired fixture, trigger the event, confirm the post-event render matches the designed response — the round-trip analog of the client surface's static bless. Like the client bless, it is Claude's own agent verification (not human input) and stays inside the autonomous Build skill.

### 7. Design human gate — reuse the three-stage gate; the residue is thick

The agent design call reuses the three-stage human gate already established in the Design skill (present the derived surface → propose, marking unclear rows `not sure` → resolve each, then lock); the mechanics are not re-authored. Uniquely for this surface, the residue is thick rather than thin: because the response is invented rather than mechanically derived, the proposal itself is the judgment — which data-model path to write, what confirmation content, which prop to couple — so the human's review is substantive co-design, not a rubber-stamp of a derivation.

### 8. Nightly handling of the round-trip bless

The round-trip bless gates no committed artifact (the agent surface produces no frozen visual baseline). In the autonomous nightly run the nightly-routine prompt owns skipping the bless where Claude-Chrome is unavailable; because it gates nothing committable, its skip drops no build output — it defers only the live-integration confirmation, which moves to the morning `review-nightly` triage. The CI proofs (response content, conformance, binding-resolution, reactivity) carry the autonomous PR. The skill states this as the agent bless's Phase-5 handling, distinct from the client bless's freeze-coupled skip.

### 9. Build-procedure notes

The agent build section carries five notes, not optional style choices — the surface's equivalent of the adapter render-gotcha set:

- surfaceId is omitted in the fixture and stamped at runtime; authoring one in is wrong.
- The response is a partial update (`updateComponents`/`updateDataModel`) only, never a re-`createSurface` — the surface already exists in the client processor.
- The response's component ids must match the paired client fixture's ids for the swap to land (transcription fidelity; fixed at design time).
- The data-model path must match the coupled prop's binding (transcription fidelity; fixed at design time).
- Conformance passes on a partial, rootless fragment by design (RELAXED validation; the framework-owned `id` is stripped before validation) — validator-infra behavior, not a per-event choice.

### 10. Validation is a read-through; the sole product-code change is the conformance derivation

4.3 validates the agent design and build procedures by reading them through against Button's shipped agent artifacts — would following them reproduce those artifacts. `Text` is named as the no-agent-surface negative case and contributes nothing to reproduce. 4.3 produces no kept decision docs; running the Design skill to emit the Button agent section is dogfooding, which belongs at 4.4 (where the full `Text`/`Button` decision docs are produced and kept as canonical examples). The one product-code change is refactoring the conformance test to derive from the event → fixture registry (the analog of 4.2's sole product-code change): it is a genuine edit that 4.3 makes and runs green once. The client event fixture's coupling already exists from Phase 2 and is validated by read-through, not re-made.

### 11. Output conventions

Both agent sections are headed `## Agent section`, parallel with the existing `## Adapter section` / `## Client section`, and appended after the client section in each file per the append-convention — never restructuring the sections already there. 4.3 writes body sections only; frontmatter, overview, and orchestration are deferred to 4.4. Worked-example code is teaching-sized inline snippets modelled on the shipped files, not full reproduction — the ground truth stays in the repo for the read-through.

## Invariants

- 4.3 appends only to the two `SKILL.md` files, with the conformance-test derivation (decision 10) as the sole product-code change; no other product code is written.
- The Build skill's agent section takes no human input; the Claude-Chrome round-trip bless is agent verification, not human input.
- No new catalog component is authored; validation runs against the shipped Button agent artifacts, with `Text` as the no-agent-surface negative.

## Open items

- None.
