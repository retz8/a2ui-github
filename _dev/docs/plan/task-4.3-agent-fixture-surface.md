# Task 4.3 — Agent-fixture Surface Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Author the agent-fixture surface of the two catalog-authoring skills — the agent *design* procedure into `design-catalog-component/SKILL.md` and the agent *build/test* procedure into `build-catalog-component/SKILL.md` — and land the one product-code change the loop depends on (a registry-derived conformance test).

**Architecture:** The deliverable is **prose appended to two `SKILL.md` files** plus **one product-code refactor**. The Design section captures the per-event canned-response design (walk the locked adapter table's `event`-shaped actions, design one canned server response + its visibility coupling per event, recorded as an event-response table in the decision doc). The Build section captures the mechanical loop that transcribes that agent section into the `<event>.json` fixture, the event→fixture mapping entry, the paired client-fixture coupling edit, and the per-event tests. Because the two skill sections are prose, their verification is a **read-through** against Button's already-shipped agent artifacts — "if I followed this procedure, would I reproduce those files?" — not a test run. The one exception is the `test_conformance.py` refactor, which is real code and is actually run green.

**Tech Stack:** Markdown (Claude skill `SKILL.md` bodies). Ground-truth artifacts are the uv-managed Python `agent/` (Python 3.14, `a2ui-agent-sdk`, `a2a-sdk`, pytest + pytest-asyncio) and one TypeScript client fixture under `client/src/fixtures/`.

## Global Constraints

- **Three target files:** append the **Agent section** to `.claude/skills/design-catalog-component/SKILL.md` and to `.claude/skills/build-catalog-component/SKILL.md` (after each file's existing Client section); refactor `agent/tests/test_conformance.py`. **No YAML frontmatter** is added to either `SKILL.md` — frontmatter/overview/orchestration are deferred to 4.4.
- **Sole product-code change:** only `agent/tests/test_conformance.py` is modified. No other product code is written. The `button-event.ts` coupling already exists from Phase 2 and is validated by read-through, not re-made.
- **Prose validation is a read-through** against Button's shipped agent artifacts; the refactored `test_conformance.py` is additionally run green once. `Text` has no event-shaped action, so it has **no agent section** — it is the negative case, contributing nothing to reproduce.
- **Reuse, don't re-author, prior framing:** the three-stage design-call gate and the append-convention already exist in the Design skill. The Agent section follows them; it does not restate the gate mechanics — but it **does** explicitly flag that the agent residue is *thick* (the invented response is the judgment). The Agent section is a pure append — it never restructures the Adapter or Client sections.
- **Consumed infra, never re-derived:** the executor, the conformance validator, the server wiring, the `run_executor` harness, and the A2A round-trip wire are one-time infrastructure the loop only *consumes*. The wire is **documented** (so the two skills tell the whole event story) but is not part of the per-component loop.
- **Teaching-sized inline snippets**, not full reproduction of the agent artifacts. The full ground truth stays in `agent/` and `client/` (that is what the read-through checks against).
- **Canned response + coupling belong to Design** (recorded in the decision doc's event-response table); the fixture/mapping/tests are fully mechanical from the agent section (Build), with no value synthesized at build time.
- **surfaceId is stamped at runtime, never authored** into the fixture; the response is a partial update (`updateComponents`/`updateDataModel`), never a re-`createSurface`.
- **Round-trip bless precedes nothing committable:** the per-component agent gate is the server-up Claude-Chrome round-trip bless (agent verification, not human input). It gates no frozen artifact; the Phase-5 nightly prompt owns skipping it, deferring live-integration confirmation to `review-nightly`.
- **Branch & commits:** implementation lands in a worktree `phase-4/3-agent-fixture-surface` off `main` (via `daily-work-harness:rebase-with-main`), carrying only the `.claude/skills/**` files and `agent/tests/test_conformance.py` — never `_dev/`. Conventional commits: `feat(phase-4): …` / `refactor(phase-4): …`.

**Source artifacts to model against (read these first):**
- Agent design/build substance: `_dev/docs/spec/task-2.4-deterministic-a2a-server.md`, `_dev/docs/plan/task-2.4-deterministic-a2a-server.md` (its Global Constraints + Tasks 3–5), `_dev/docs/plan/task-2.5-event-round-trip.md` (the wire + the round-trip re-render test); the locked Adapter + Client sections already in both `SKILL.md` files.
- Agent code ground truth: `agent/deterministic_agent/{responses.py,executor.py,catalog.py}`, `agent/deterministic_agent/fixtures/submit.json`, `agent/tests/{helpers.py,test_responses.py,test_executor.py,test_conformance.py}`.
- The coupling ground truth: `client/src/fixtures/button-event.ts` (the `disabled ← /submitted` binding + initial data model); `client/tests/round-trip-render.test.tsx` (the reactivity infra proof).

---

## File Structure

- `.claude/skills/design-catalog-component/SKILL.md` — **modified** (Task 1). Append an **Agent section** after the Client section: the per-event canned-response design call (source = event-shaped Action rows), the visibility-coupling principle, the three-stage-gate reuse + thick-residue note, and the agent-section format (one event-response table) with one inline worked example.
- `agent/tests/test_conformance.py` — **modified** (Task 2). Refactor to derive its positive case from the `_EVENT_FIXTURES` registry instead of the hardcoded `submit` action, so conformance auto-covers new events.
- `.claude/skills/build-catalog-component/SKILL.md` — **modified** (Task 3). Append an **Agent section** after the Client section: the infra-assumption preamble, the mechanical loop (fixture → mapping → coupling edit → tests), the 1:1 test structure (authored response-content case; conformance auto-covers; executor untouched), the five build notes, the round-trip bless, and the nightly handling.

Task order rationale: Task 1 defines the agent-section event-response table format that Task 3's loop consumes (Design before Build, mirroring 4.1/4.2). Task 2 lands the refactor that Task 3's loop relies on (conformance auto-covers), so it precedes Task 3.

---

### Task 1: Design skill — Agent section

Append the agent *design* procedure to `design-catalog-component/SKILL.md`: the per-event canned-response design call and the agent section of the decision doc it produces.

**Files:**
- Modify: `.claude/skills/design-catalog-component/SKILL.md` (append after the Client section)

**Interfaces:**
- Consumes: the locked **adapter prop-surface table** (same component's decision doc, from 4.1) as the source of the component's `event`-shaped `Action` rows; the doc-header **official documentation URL** as the plausibility reference for the designed response.
- Produces: the **agent-section format** — a component doc's agent section carrying one **event-response table** with columns `event | response messages (ordered, with canned values) | visibility coupling (client fixture · bound prop ← path · initial value)`. Task 3's Build Agent section relies on exactly these column names.

- [ ] **Step 1: Read the source artifacts**

Read `_dev/docs/spec/task-2.4-deterministic-a2a-server.md`, `_dev/docs/plan/task-2.4-deterministic-a2a-server.md`, `_dev/docs/plan/task-2.5-event-round-trip.md`, the shipped `agent/deterministic_agent/{responses.py,fixtures/submit.json}`, `client/src/fixtures/button-event.ts`, and the existing Adapter + Client sections in `.claude/skills/design-catalog-component/SKILL.md`. Confirm the shipped `submit` response (an `updateDataModel` `/submitted=true` + an `updateComponents` label swap) and the `button-event` coupling (`disabled: {path: '/submitted'}` + initial `/submitted=false`) before writing any prose.

- [ ] **Step 2: Write the Agent section intro + the design-call source**

Append a `## Agent section` to `design-catalog-component/SKILL.md`. Content:
- One line: this step produces the **agent section** of the same component decision doc, appended after the client section; its response set is **derived from the locked adapter prop-surface table's `event`-shaped `Action` rows** (stated inline — the ordering dependency, not a re-declared inputs block).
- **The design call.** Walk each `event`-shaped `Action` the component emits; for each event name, **design the canned A2UI response the deterministic agent returns**. The response is an *invented* design artifact ("what would a plausible server do in reaction to this event?"), not a derivation from anything upstream.
- **No-agent-surface rule.** The `functionCall` action shape runs locally client-side and never reaches the agent → it produces **no** agent fixture. A component with no event-shaped action (e.g. `Text`) gets **no agent section at all** — the analog of "Text carries no accessibility."

- [ ] **Step 3: Write the design output (response + coupling) + the gate-reuse note**

Continue the `## Agent section`. Content:
- **Output is response + coupling, one unit.** The design call's output per event is the response messages with concrete canned values **together with** the visibility coupling that renders them.
- **The visibility principle.** A response should drive both update mechanisms where the component supports them — `updateComponents` (a component swap, self-visible) and `updateDataModel` (a path write, visible only when a rendered prop binds that path) — and **every data-model write must bind to a rendered prop in the paired client event fixture**, else the write is invisible and untestable. Realizing the coupling **edits the paired client event fixture in place** (the bound prop + an initial data-model value).
- **Design-call note (brief):** the agent design call runs through the **same three-stage human gate** already defined in this skill (present the derived surface → propose, marking unclear rows `not sure` → resolve, then lock). Do **not** restate the gate mechanics. Uniquely for this surface, flag that the residue is **thick**: because the response is invented rather than derived, the proposal itself is the judgment (which data-model path to write, what confirmation content, which prop to couple), so the human's review is substantive co-design, not a rubber-stamp.
- State that the agent section is **appended** to the same decision doc and never restructures the adapter or client sections (per the append-convention already in this skill).

- [ ] **Step 4: Write the agent-section format + the inline worked example**

Continue the `## Agent section`. Content:
- **Agent-section format:** one **event-response table**, one row per event the component emits, columns `event | response messages (ordered, with canned values) | visibility coupling (client fixture · bound prop ← path · initial value)`. Response and coupling live in one table because they are one design unit per event.
- **Fallback note:** the unknown-event `Text` fallback is infra behavior, not authored per component, so it gets **no row** (the way the client section does not re-document `TestSpace`).
- **Worked example (teaching-sized, modelled on Button):**

  | event | response messages | visibility coupling |
  |---|---|---|
  | `submit` | 1. `updateDataModel {path: '/submitted', value: true}` · 2. `updateComponents [{id: 'label', component: 'Text', text: '✅ Sent — server received submit'}]` (surfaceId echoed — stamped at build, not authored) | `button-event` · `disabled ← /submitted` · initial `/submitted = false` |

  Add a one-line note under the example: the response exercises **both** mechanisms — the label swap is self-visible; the `/submitted` write is visible only through the `disabled ← /submitted` coupling, which is the half that proves two-way data binding on the component itself.

- [ ] **Step 5: Read-through validation against `Text` + `Button`**

Walk the design call as written and confirm it reproduces the shipped agent design (no code executed — compare against `agent/deterministic_agent/{responses.py,fixtures/submit.json}` and `client/src/fixtures/button-event.ts`):
- **Text** → no event-shaped action → **no agent section**. Confirm the no-agent-surface rule produces nothing for Text.
- **Button** → one event `submit` → the two-message response (`updateDataModel /submitted=true` + `updateComponents` label swap) and the `button-event` coupling (`disabled ← /submitted`, initial `false`). Cross-check `submit.json` (surfaceId absent) and `button-event.ts` (the binding + initial data model).

Fix any wording that would not reproduce these. Expected: Button's `submit` response + coupling reproduce exactly; Text yields no section.

- [ ] **Step 6: Commit**

```bash
git add .claude/skills/design-catalog-component/SKILL.md
git commit -m "feat(phase-4): author agent design section — per-event canned-response design + coupling"
```

---

### Task 2: Refactor the conformance test to derive from the registry

Refactor `agent/tests/test_conformance.py` so its positive case is parametrized over the `_EVENT_FIXTURES` registry instead of the hardcoded `submit` action, so conformance auto-covers new events. This is 4.3's sole product-code change.

**Files:**
- Modify: `agent/tests/test_conformance.py`

**Interfaces:**
- Consumes: `_EVENT_FIXTURES` from `deterministic_agent.responses` (the event→fixture registry); `validate_payload` from `deterministic_agent.catalog`; `run_executor` from `tests.helpers` (unchanged).
- Produces: nothing downstream in code; Task 3's Build Agent section describes conformance as auto-covering, which this refactor makes true.

- [ ] **Step 1: Confirm the current hardcoded assertions**

Read `agent/tests/test_conformance.py`. The positive case hardcodes the `submit` action via a module-level `SUBMIT` constant:

```python
SUBMIT = {"name": "submit", "surfaceId": "button-event", "sourceComponentId": "root", "context": {}}


async def test_emitted_submit_payload_conforms_to_catalog():
    payload = await run_executor(SUBMIT)
    validate_payload(payload)  # must not raise
```

The unknown-event fallback case and the negative `test_validator_rejects_non_conformant_component` case need no change.

- [ ] **Step 2: Replace the hardcoded positive case with a registry-parametrized one**

Add the registry import and replace the `SUBMIT` constant + `test_emitted_submit_payload_conforms_to_catalog` with a case parametrized over every registered event. Leave the unknown-event and negative cases unchanged. The file becomes:

```python
import pytest

from deterministic_agent.catalog import validate_payload
from deterministic_agent.responses import _EVENT_FIXTURES
from tests.helpers import run_executor


@pytest.mark.parametrize("event", sorted(_EVENT_FIXTURES))
async def test_emitted_event_payload_conforms_to_catalog(event):
    payload = await run_executor({"name": event, "surfaceId": "test", "context": {}})
    validate_payload(payload)  # must not raise


async def test_emitted_unknown_event_fallback_conforms_to_catalog():
    payload = await run_executor({"name": "nope", "surfaceId": "s2", "context": {}})
    validate_payload(payload)  # must not raise


def test_validator_rejects_non_conformant_component():
    bad = [
        {
            "version": "v0.9",
            "updateComponents": {
                "surfaceId": "s1",
                "components": [{"id": "x", "component": "NotARealComponent", "text": "y"}],
            },
        }
    ]
    with pytest.raises(ValueError):
        validate_payload(bad)
```

(Importing the same package's module-private `_EVENT_FIXTURES` into its own test suite keeps the product-code change confined to this one file — no public accessor is added to `responses.py`.)

- [ ] **Step 3: Run the conformance test to verify it passes**

Run (from `agent/`, per `agent/README.md`): `uv run pytest tests/test_conformance.py -v`
Expected: PASS — the parametrized case runs once for `submit` (the only registered event) and conforms; the unknown-event and negative cases still pass.

- [ ] **Step 4: Run the full agent suite (guard against regressions)**

Run (from `agent/`): `uv run pytest -v`
Expected: PASS — every test across `test_smoke`, `test_catalog`, `test_responses`, `test_executor`, `test_conformance`, `test_server` is green. (The refactor touches only assertions in one file; nothing else should move.)

- [ ] **Step 5: Commit**

```bash
git add agent/tests/test_conformance.py
git commit -m "refactor(phase-4): derive conformance test from the event-fixture registry"
```

---

### Task 3: Build & Test skill — Agent section

Append the agent *build/test* procedure to `build-catalog-component/SKILL.md`: the infra-assumption preamble and the mechanical loop that transcribes the decision doc's agent section into the fixture, the mapping entry, the coupling edit, and the tests. No human input (the round-trip bless is agent verification).

**Files:**
- Modify: `.claude/skills/build-catalog-component/SKILL.md` (append after the Client section)

**Interfaces:**
- Consumes: the **agent-section format** from Task 1 (event-response table columns `event | response messages | visibility coupling`). Assumes the registry-derived conformance test from Task 2 (auto-covers).
- Produces: nothing downstream in 4.3 (finalize/orchestration is 4.4).

- [ ] **Step 1: Read the agent code ground truth**

Read the shipped agent artifacts listed under Global Constraints — `agent/deterministic_agent/{responses.py,executor.py,catalog.py}`, `agent/deterministic_agent/fixtures/submit.json`, `agent/tests/{helpers.py,test_responses.py,test_executor.py,test_conformance.py}`, `client/src/fixtures/button-event.ts`, `client/tests/round-trip-render.test.tsx` — and the existing Adapter + Client Build sections in `build-catalog-component/SKILL.md`. This is the loop the Agent section captures.

- [ ] **Step 2: Write the Agent section intro + infra-assumption preamble**

Append a `## Agent section` to `build-catalog-component/SKILL.md`. Content:
- One line: this step **consumes the decision doc's agent section** (the event-response table) and mechanically materializes the agent artifacts; it takes **no human input** (the round-trip bless is Claude's own agent verification, not human input).
- **Infra-assumption preamble:** the `DeterministicAgentExecutor` and its response-building/stamping/fallback machinery, the catalog-conformance validator, the server wiring, the `run_executor` test harness, and the A2A round-trip wire are **one-time infrastructure that already exists** and is only *consumed* here — this loop never stands it up. If it is missing, that is a scaffold/template concern outside this loop. The round-trip wire is **documented here** (it is what carries an `event` from the client to the agent and the response back) but is consumed infra, not a per-component build step.

- [ ] **Step 3: Write the mechanical loop + test structure + build notes + verification**

Author the loop with teaching-sized snippets modelled on the shipped files. Content:

**The mechanical loop** — walk the event-response table once and, per event, produce:
1. **Author `<event>.json`** — `agent/deterministic_agent/fixtures/<event>.json`: the ordered messages + canned values from the table, **surfaceId omitted** (stamped at runtime by `_stamp_surface`). Model (`submit.json`):

   ```json
   [
     { "version": "v0.9", "updateDataModel": { "path": "/submitted", "value": true } },
     { "version": "v0.9", "updateComponents": {
       "components": [ { "id": "label", "component": "Text", "text": "✅ Sent — server received submit" } ] } }
   ]
   ```
2. **Register the mapping** — add one entry to `_EVENT_FIXTURES` in `responses.py`: `_EVENT_FIXTURES = {"submit": "submit.json"}`.
3. **Coupling edit** — amend the paired client event fixture **in place** (`client/src/fixtures/<name>.ts`): add the bound prop and an initial `updateDataModel`. Model (`button-event.ts`): the root Button gains `disabled: {path: '/submitted'}`, and a trailing `updateDataModel {path: '/', value: {submitted: false}}` initializes it — so the server's `/submitted=true` visibly disables the button.

**Test structure** — maps 1:1 onto the client surface's split:
- **Response-content test — the one authored per-event case** (`agent/tests/test_responses.py`): `build_response(action)` returns the right ordered messages with the surfaceId echoed. Model:

  ```python
  def test_submit_returns_data_model_then_components_with_surface_echoed():
      msgs = build_response({"name": "submit", "surfaceId": "button-event", "context": {}})
      assert msgs[0]["updateDataModel"] == {"surfaceId": "button-event", "path": "/submitted", "value": True}
      assert msgs[1]["updateComponents"]["components"][0]["text"] == "✅ Sent — server received submit"
  ```
- **Conformance auto-covers — no edit** (`agent/tests/test_conformance.py`): its positive case is parametrized over `_EVENT_FIXTURES`, so a new event is picked up the moment its mapping entry lands (step 2). State this explicitly as a genuine no-op step — the agent-side analog of the client's structural/selector auto-cover and the adapter parity loop.
- **Executor test — untouched** (`agent/tests/test_executor.py`): the executor is component-agnostic and proven once on `submit`; a new event walks the identical path. It is one-time infra, not a per-event case.

**Build notes (not optional style choices):**
- surfaceId is omitted in the fixture and stamped at runtime; authoring one in is wrong.
- the response is a partial update (`updateComponents`/`updateDataModel`) only, never a re-`createSurface` — the surface already exists in the client processor.
- the response's component `id`s must match the paired client fixture's `id`s for the swap to land (e.g. `id: 'label'`); this is fixed at design time — transcribe it exactly.
- the data-model path must match the coupled prop's binding (`/submitted`); fixed at design time — transcribe it exactly.
- conformance passes on a partial, rootless fragment by design (RELAXED validation; the framework-owned `id` is stripped before validation) — validator-infra behavior, not a per-event choice.

**Verification gate — the round-trip bless:** the agent drives the browser with the deterministic server **running** (`uv run python -m deterministic_agent`), selects the paired fixture, triggers the event, and confirms the *post-event* render matches the designed response (label flipped, button disabled) — the round-trip analog of the client surface's static bless. Note the nightly handling: it gates no committed artifact, so the Phase-5 nightly prompt owns skipping it where Claude-Chrome is unavailable, deferring live-integration confirmation to `review-nightly`; the CI proofs (response content, conformance, the client bound-fixture render test, the reactivity infra test) carry the autonomous PR.

- [ ] **Step 4: Read-through validation against `Text` + `Button`**

Walk the loop from each component's agent section and confirm it reproduces the shipped agent artifacts (no code executed — compare against the files):
- **Text** → no agent section → nothing to build. Confirm the loop produces no agent artifact for Text.
- **Button** → `submit.json` (surfaceId omitted), the `_EVENT_FIXTURES` `submit` entry, the `test_responses.py` submit case, and the `button-event.ts` coupling. Confirm the conformance step is a genuine no-op given Task 2's registry-derived test, and that the executor test is untouched.

Fix any step whose transcription would not reproduce these. Expected: Button's agent artifacts reproduce exactly; Text yields nothing.

- [ ] **Step 5: Commit**

```bash
git add .claude/skills/build-catalog-component/SKILL.md
git commit -m "feat(phase-4): author agent build/test section — fixture/mapping/coupling loop + round-trip bless"
```

---

## Self-Review

- **Spec coverage:** Task 1 covers spec decisions 2 (design call = one response per event; functionCall/no-action → no section), 3 (response + coupling as one unit; visibility principle; coupling edits the client fixture in place), 4 (agent section = one event-response table), 7 (three-stage gate reuse + thick residue). Task 2 covers decision 10's sole product-code change and enables decision 5's conformance auto-cover. Task 3 covers decisions 1 (consumed infra; wire documented not looped), 5 (mechanical loop + 1:1 test structure), 6 (round-trip bless verification gate), 8 (nightly handling), 9 (the five build notes). Decision 10 (read-through validation; Text as negative; no kept docs) is carried in Task 1 Step 5 and Task 3 Step 4. Decision 11 (output conventions) is carried by the append-after-Client-section placement, the no-frontmatter constraint, and teaching-sized snippets across all tasks. Invariants (append-only to two `SKILL.md` files + one refactor; Build takes no human input; Text is the no-agent-surface negative) hold across all tasks.
- **Placeholder scan:** no product-code placeholders. The `SKILL.md` prose is specified as content bullets + the concrete event-response table / teaching snippets that must appear, matching 4.1/4.2 plan altitude (the shipped files are the ground truth; snippets are teaching-sized, not full reproductions). The one real code change (Task 2) shows the exact before/after and commands with expected output.
- **Type/name consistency:** the agent-section column names (`event | response messages | visibility coupling`) are defined in Task 1's Produces block and consumed verbatim in Task 3 Step 3. `_EVENT_FIXTURES` (registry, `responses.py`), `build_response` (`responses.py`), `run_executor` (`tests/helpers.py`), `validate_payload` (`catalog.py`), and `_stamp_surface` are the real shipped symbols; the refactored `test_conformance.py` shape in Task 2 is what Task 3 Step 3's conformance no-op relies on. The literals `submit`, `/submitted`, `button-event`, and `id: 'label'` agree across the response fixture, the coupling edit, and the tests.
