# Task 4.2 — Client surface

Covers the TODO `## Phase 4` sub-task **4.2 — Client surface**: the client *design* procedure into `design-catalog-component/SKILL.md` and the client *build/test* procedure into `build-catalog-component/SKILL.md`, validated against the shipped `Text`/`Button` client artifacts (Phase 2.3). Appends to the two `SKILL.md` files that 4.1 began.

## Scope

- The per-component client loop, captured as prose appended to both skills: which fixtures a component needs (Design) and how those fixtures, their tests, and their visual baselines are materialized (Build).
- Validation is a read-through against the shipped `Text`/`Button` client artifacts, plus one product-code change (decision 11).

Out of scope: the test-space infrastructure and A2A wire (consumed as one-time scaffold, never re-derived); server-client transport and the deterministic canned response (4.3); backfilling Button's fixture coverage (decision 3).

## Locked decisions

### 1. The client surface is a tightly-scoped per-component loop

The recurring per-component work is a narrow loop — fixtures → render/action tests → visual baseline. Everything else on the client (the `TestSpace`/`FixtureView`/`helpers` test space, the Playwright config, the A2A wire middleware) is one-time infrastructure the loop *consumes*, not something it re-derives per component. The client build/test procedure never stands this scaffold up; if it is missing, that is a scaffold/template concern outside the loop.

### 2. Split: Design picks the scenarios, Build materializes

The Design skill's client section decides *which* fixtures a component needs; the Build skill's client section mechanically materializes the fixtures, tests, and baselines from that decision.

### 3. Coverage is exhaustive over state-bearing props

The fixture set must cover all of a component's scenarios — every state-bearing prop is accounted for. Button's shipped fixtures under-cover its props; that is a known gap, not the standard. Backfilling Button to the exhaustive standard is deferred (Phase 6 build-out or backlog); 4.2 does not author it.

### 4. Derivation is a prop-walk, single-axis by default

The fixture set is derived by walking the locked adapter prop-surface table prop-by-prop, mapping each carried prop to the scenario(s) it introduces (content-bearing `Dynamic*` → a literal and a bound fixture; `Action` → one fixture per action shape; a visually-distinct enum → a gallery over all its values; a visually-distinct `Dynamic*`/config prop → a fixture with that state set; a non-visual prop → a render-test assertion, no fixture). Each fixture isolates one prop's scenario with all other props at defaults; props are combined into a single fixture only when semantically coupled. The union, deduped, is the exhaustive fixture set.

### 5. The client section of the decision doc

The Design skill's client section appends to the same per-component decision doc a **fixture table** (per fixture: name, coverage axis, component state, whether baselined), a **prop-coverage map** (every carried adapter-table prop → the fixture(s) that exercise it, or a render-test assertion for non-visual props), and the **concrete canned values** each fixture carries (literal strings, bound path + data-model value, event name/context, enum values). The canned values live in the doc so the Build run invents nothing.

### 6. Design gate reuses 4.1's three-stage pattern; the brainstorm is the core

The client design call reuses the three-stage human gate already established in the Design skill (present the derived surface → propose, marking unclear rows `not sure` → resolve each, then the human locks). The exhaustive fixture-set brainstorm is the heart of this call. The genuine `not sure` residue is thin: the visual-vs-non-visual classification of a prop, and semantic-coupling calls. The framing (three-stage gate, append-convention) already exists from 4.1 and is reused, not re-authored; the client section's dependence on the locked adapter table is stated inline within the prop-walk.

### 7. Client/agent boundary

4.2 owns only the mock-bounded client loop: `functionCall` runs locally, `event` goes to an injected/mocked handler — no real transport. The A2A wire middleware and the round-trip re-render mechanism are one-time integration infrastructure, component-agnostic, owned by neither per-component procedure. Server-client transport and the canned server response are 4.3's.

### 8. The client test layer is integration-through-the-real-renderer

The client render/action tests render through the full stack (`MessageProcessor` → `A2uiSurface`), proving the component works end-to-end through the actual renderer and binder — distinct from and complementary to the adapter's direct-`View` tests. Per-fixture assertions are derived from each fixture's coverage axis (content renders; binding resolves from the data model; `functionCall` runs the registered local function without reaching the handler; `event` dispatches to the injected handler; a visually-distinct state is honored through the renderer).

### 9. Build client flow, with Claude-Chrome blessing before the freeze

The Build client flow is: materialize fixtures → run the render/action unit tests → **Claude-Chrome visual verification** (the agent drives the browser to each fixture and confirms the render against the component's documented appearance) → generate and commit the Playwright baselines. The blessing precedes the freeze. The Claude-Chrome step is Claude's own agent verification, not human input, so it stays inside the autonomous Build & Test skill. The skill keeps this step as written; the Phase-5 nightly routine's prompt owns skipping it where Claude-Chrome is unavailable, and skipping the bless implies skipping the freeze.

### 10. Build loop with an infra-assumption preamble; structural + selector tests auto-cover

The client build/test procedure is authored as an ordered per-component loop opening with an explicit statement that the test-space scaffold and wire pre-exist and are only consumed. With the structural test refactored (decision 11), both the structural test and the selector test auto-cover new fixtures via the `FIXTURES` loop, so the per-component loop adds no per-fixture edit to either.

### 11. Sole product-code change: refactor the structural fixtures test

The only product-code change in 4.2 is refactoring `client/tests/fixtures.test.ts` to derive its assertions from `FIXTURES` (dropping the hardcoded fixture count and exact name-list, keeping the looped per-fixture invariants). Everything else in 4.2 is prose in the two `SKILL.md` files. Validation is a read-through that reproduces the shipped five fixtures and enumerates the additional fixtures the exhaustive rules would generate; the refactored structural test is additionally run green once.

## Invariants

- 4.2 appends only to the two `SKILL.md` files, with the single `fixtures.test.ts` refactor as the sole product-code change; no other product code is written.
- The Build & Test skill's client section takes no human input; the Claude-Chrome blessing is agent verification, not human input.
- Teaching-sized inline snippets modelled on the shipped files, not full reproduction (carried from 4.1).

## Open items

- None.
