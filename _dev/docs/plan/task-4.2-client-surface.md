# Task 4.2 — Client Surface Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Author the client surface of the two catalog-authoring skills — the client *design* procedure into `design-catalog-component/SKILL.md` and the client *build/test* procedure into `build-catalog-component/SKILL.md` — and land the one product-code change the loop depends on (a non-hardcoded structural fixtures test).

**Architecture:** The deliverable is **prose appended to two `SKILL.md` files** plus **one product-code refactor**. The Design section captures the fixture-set brainstorm (a prop-walk over the locked adapter table that yields a fixture table + prop-coverage map + canned values in the decision doc); the Build section captures the mechanical loop that transcribes that client section into fixtures, integration-through-the-renderer tests, and Playwright baselines (with a Claude-Chrome bless before the freeze). Because the two skill sections are prose, their verification is a **read-through** against the already-shipped `Text`/`Button` client artifacts in `client/` — "if I followed this procedure, would I reproduce those files?" — not a test run. The one exception is the `fixtures.test.ts` refactor, which is real code and is actually run green.

**Tech Stack:** Markdown (Claude skill `SKILL.md` bodies). Ground-truth artifacts are React 19 + Vite + TS under `client/`, tested with vitest 4 + `@testing-library/react` and Playwright (chromium).

## Global Constraints

- **Three target files:** append the **Client section** to `.claude/skills/design-catalog-component/SKILL.md` and to `.claude/skills/build-catalog-component/SKILL.md` (after each file's existing Adapter section); refactor `client/tests/fixtures.test.ts`. **No YAML frontmatter** is added to either `SKILL.md` — frontmatter/overview/orchestration are deferred to 4.4.
- **Sole product-code change:** only `client/tests/fixtures.test.ts` is modified. No other product code is written. Button's fixture backfill is deferred (Phase 6 / backlog).
- **Prose validation is a read-through** against the shipped `Text`/`Button` client artifacts; the refactored `fixtures.test.ts` is additionally run green once.
- **Reuse, don't re-author, 4.1's framing:** the three-stage design-call gate and the append-convention already exist in the Design skill. The Client section follows them; it does not restate them. The Client section is a pure append — it never restructures the Adapter section.
- **Self-contained:** the Client sections embed their own conventions (prop-walk derivation, single-axis coverage, visual-vs-non-visual, integration-through-the-renderer). No dependency on `_dev/docs` findings. Only **spec-navigation** points to the `a2ui-sdk-design` skill (already stated in 4.1; not repeated).
- **Teaching-sized inline snippets**, not full reproduction of the client artifacts. The full ground truth stays in `client/` (that is what the read-through checks against).
- **Canned values belong to Design** (recorded in the decision doc); the fixtures/tests/baselines are fully mechanical from the client section (Build), with no value synthesized at build time.
- **Coverage is exhaustive over state-bearing props** (single-axis by default; couple only when semantically required). Non-visual props map to a render-test assertion, not a fixture.
- **Claude-Chrome bless precedes the baseline freeze;** skipping the bless implies skipping the freeze. The skill keeps the Chrome step as written; the Phase-5 nightly prompt owns skipping it.
- **Branch & commits:** implementation lands in a worktree `phase-4/2-client-surface` off `main` (via `daily-work-harness:rebase-with-main`), carrying only the `.claude/skills/**` files and `client/tests/fixtures.test.ts` — never `_dev/`. Conventional commits: `feat(phase-4): …` / `refactor(phase-4): …`.

**Source artifacts to model against (read these first):**
- Client design substance: `_dev/docs/plan/task-2.3-client-test-space.md` (its Global Constraints + task structure); the locked adapter section already in `.claude/skills/design-catalog-component/SKILL.md`.
- Client code ground truth: `client/src/fixtures/{types.ts,text.ts,text-bound.ts,button-fn.ts,button-event.ts,button-variants.ts,index.ts}`; `client/src/test-space/{FixtureView.tsx,TestSpace.tsx}`; `client/tests/{helpers.tsx,fixtures.test.ts,render.test.tsx,actions.test.tsx,selector.test.tsx}`; `client/e2e/visual.spec.ts` (+ `visual.spec.ts-snapshots/`); `client/playwright.config.ts`.
- Adapter Build section already in `.claude/skills/build-catalog-component/SKILL.md` (the loop the Client section mirrors in shape).

---

## File Structure

- `.claude/skills/design-catalog-component/SKILL.md` — **modified** (Task 1). Append a **Client section** after the Adapter section: the prop-walk fixture-set brainstorm, the visual-vs-non-visual rule, single-axis coverage, and the client section format (fixture table + prop-coverage map + canned values) with one inline worked example.
- `client/tests/fixtures.test.ts` — **modified** (Task 2). Refactor to derive assertions from `FIXTURES` instead of hardcoding the count and name-list, so the structural test auto-covers new fixtures.
- `.claude/skills/build-catalog-component/SKILL.md` — **modified** (Task 3). Append a **Client section** after the Adapter section: the infra-assumption preamble and the 7-step mechanical loop (fixtures → barrel → structural auto-cover → render/action tests → selector auto-cover → Claude-Chrome bless → baseline freeze).

Task order rationale: Task 1 defines the client-section decision-doc format that Task 3's loop consumes (Design before Build, mirroring 4.1). Task 2 lands the refactor that Task 3's step 3 relies on (structural test auto-covers), so it precedes Task 3.

---

### Task 1: Design skill — Client section

Append the client *design* procedure to `design-catalog-component/SKILL.md`: the prop-walk fixture-set brainstorm and the client section of the decision doc it produces.

**Files:**
- Modify: `.claude/skills/design-catalog-component/SKILL.md` (append after the Adapter section)

**Interfaces:**
- Consumes: the locked **adapter prop-surface table** (same component's decision doc, from 4.1) as the prop-walk source; the doc-header **official documentation URL** as the appearance reference and source of realistic canned values.
- Produces: the **client-section format** — a component doc's client section carrying a **fixture table** (columns `fixture | exercises (coverage axis) | component state / canned values | baselined?`), a **prop-coverage map** (columns `adapter prop | covered by`), and the concrete canned values in-cell. Task 3's Build Client section relies on exactly these column names.

- [ ] **Step 1: Read the source artifacts**

Read `_dev/docs/plan/task-2.3-client-test-space.md`, the shipped fixtures (`client/src/fixtures/*.ts`), the shipped client tests (`client/tests/{render,actions,selector,fixtures}.test.tsx?`), and the existing Adapter section in `.claude/skills/design-catalog-component/SKILL.md`. Confirm the five shipped fixtures and the coverage axes they encode before writing any prose.

- [ ] **Step 2: Write the Client section intro + the prop-walk method**

Append a `## Client section` to `design-catalog-component/SKILL.md`. Content:
- One line: this step produces the **client section** of the same component decision doc, appended after the adapter section; its fixture set is **derived from the locked adapter prop-surface table** (stated inline — the ordering dependency, not a re-declared inputs block).
- **The prop-walk.** Walk the locked adapter table prop-by-prop; for each carried prop, accumulate the scenario(s) it introduces into the fixture set, per this mapping:

  | Prop kind (from the adapter table) | Scenario(s) it introduces |
  |---|---|
  | content-bearing `Dynamic*` (a synthetic value prop) | a **literal** fixture + a **bound** fixture (proves path binding) |
  | `Action` | one fixture **per action shape** it accepts (`functionCall`, `event`) |
  | a **visually-distinct** enum | a **gallery** fixture — one surface per enum value |
  | a **visually-distinct** `Dynamic*`/config prop (e.g. `disabled`, `loading`, `block`, `count`) | a fixture with that state **set** |
  | a **non-visual** prop (e.g. `accessibility`, `loadingAnnouncement`) | **no fixture** — a render-test assertion instead |

- **Single-axis by default:** each fixture isolates one prop's scenario, all other props at defaults; combine props into one fixture **only when semantically coupled** (e.g. `loading` + `loadingAnnouncement`).
- **Exhaustiveness:** the deduped union of these scenarios is the fixture set. Every carried prop must appear in the coverage map (decision below) — a visual prop via a baselined fixture, a non-visual prop via a render-test assertion.

- [ ] **Step 3: Write the design-call note (three-stage gate reuse) + the client section format**

Continue the `## Client section`. Content:
- **Design-call note (brief):** the client design call runs through the **same three-stage human gate** already defined in this skill (present the derived surface → propose, marking unclear rows `not sure` → resolve, then lock). Do **not** restate the gate mechanics. The fixture-set brainstorm is the core of this call; the genuine `not sure` residue is thin — the **visual-vs-non-visual** classification of a prop and **semantic-coupling** calls.
- **Client section format:**
  - A **fixture table** with columns `fixture | exercises (coverage axis) | component state / canned values | baselined?`. Canned values live in-cell (literal strings; bound `{path}` + the data-model value; event `{name, context}`; enum values). A gallery is one row noting "one surface per enum value."
  - A **prop-coverage map** with columns `adapter prop | covered by` — every carried adapter-table prop → the fixture(s) that exercise it, or `render-test assertion` for a non-visual prop. This is the completeness contract.
- State that the client section is **appended** to the same decision doc and never restructures the adapter section (per the append-convention already in this skill).

- [ ] **Step 4: Write the inline worked example (teaching-sized, modelled on Button + Text)**

Append one worked example under the `## Client section` — a filled client section for a component, teaching-sized (not every prop). Model it on Button and Text. It must show:

Fixture table (Button):

| fixture | exercises | component state / canned values | baselined? |
|---|---|---|---|
| `button-fn` | interaction — functionCall path | `child`→`label` ("Run local function"); `variant: primary`; `action: functionCall consoleLog {message: "button-fn clicked"}` | yes |
| `button-event` | interaction — event path | `child`→`label` ("Send event"); `variant: primary`; `action: event {name: "submit", context: {}}` | yes |
| `button-variants` | visual enum — `variant` | one surface per `['default','primary','invisible','danger','link']`; each `child`→`label` (the variant name); `action: functionCall consoleLog {message: <variant>}` | yes (one PNG) |
| `button-disabled` | visually-distinct state — `disabled` | `child`→`label` ("Disabled"); `disabled: true`; `action: event {name: "noop", context: {}}` | yes |

Prop-coverage map (Button):

| adapter prop | covered by |
|---|---|
| `child` | every button fixture (the label) |
| `action` | `button-fn` (functionCall) + `button-event` (event) |
| `variant` | `button-variants` |
| `disabled` | `button-disabled` |
| `accessibility` | render-test assertion (non-visual) |

Add a one-line note under the example: the shipped repo predates the exhaustive standard, so `button-disabled` is an example of a fixture the prop-walk *would* generate that the current repo does not yet carry (backfill deferred). Also show Text's content axis in one line — `text` (literal, `text: "Hello from Primer"`) and `text-bound` (bound, `text: {path: "/greeting"}` + data model `{greeting: "Bound hello"}`) — so the content-channel rule (literal + bound) is demonstrated.

- [ ] **Step 5: Read-through validation against `Text` + `Button`**

Walk the prop-walk as written and confirm it reproduces the shipped client fixtures (no code executed — compare against `client/src/fixtures/*.ts`):
- **Text** → `text` (content, literal) + `text-bound` (content, bound). Cross-check `text.ts` / `text-bound.ts`.
- **Button** → `button-fn` (functionCall) + `button-event` (event) + `button-variants` (variant gallery). Cross-check `button-fn.ts` / `button-event.ts` / `button-variants.ts`.
- Confirm the enumerated **extras** the exhaustive rules add for Button's uncovered props (e.g. `button-disabled`, a `count` fixture, a `block` fixture; `accessibility`/`loadingAnnouncement` → render-test assertions) are each sensible and land in the coverage map.

Fix any wording that would not reproduce the shipped five. Expected: the shipped five reproduce exactly; the extras are enumerated and coherent.

- [ ] **Step 6: Commit**

```bash
git add .claude/skills/design-catalog-component/SKILL.md
git commit -m "feat(phase-4): author client design section — fixture-set prop-walk + client decision-doc format"
```

---

### Task 2: Refactor the structural fixtures test

Refactor `client/tests/fixtures.test.ts` to derive its assertions from `FIXTURES` instead of hardcoding the count and exact name-list, so the structural test auto-covers new fixtures. This is 4.2's sole product-code change.

**Files:**
- Modify: `client/tests/fixtures.test.ts`

**Interfaces:**
- Consumes: `FIXTURES`, `getFixture` from `../src/fixtures`; `CATALOG_ID` from `primer-a2ui-adapter` (unchanged imports).
- Produces: nothing downstream in code; Task 3's Build Client section describes the structural test as auto-covering, which this refactor makes true.

- [ ] **Step 1: Confirm the current hardcoded assertions**

Read `client/tests/fixtures.test.ts`. The first `it` block hardcodes the set:

```ts
it('exposes five uniquely-named fixtures', () => {
  expect(FIXTURES).toHaveLength(5);
  const names = FIXTURES.map(f => f.name);
  expect(new Set(names).size).toBe(5);
  expect(names).toEqual(['text', 'text-bound', 'button-fn', 'button-event', 'button-variants']);
});
```

The other three `it` blocks already loop over `FIXTURES` and need no change.

- [ ] **Step 2: Replace the hardcoded block with a derived one**

Edit only that first `it` block to drop the fixed count and the exact name-list, keeping the uniqueness + non-empty invariants:

```ts
it('exposes at least one uniquely-named fixture', () => {
  expect(FIXTURES.length).toBeGreaterThan(0);
  const names = FIXTURES.map(f => f.name);
  expect(new Set(names).size).toBe(FIXTURES.length);
});
```

Leave the `every createSurface …`, `every surface defines a root component`, and `getFixture …` blocks unchanged. (Note: the `getFixture` block references `'text'` and `'button-event'` — leave those; they assert fallback behaviour, not the fixture count.)

- [ ] **Step 3: Run the structural test to verify it passes**

Run: `yarn workspace client test fixtures`
Expected: PASS — the derived uniqueness/non-empty assertions hold against the current five fixtures; the looped invariants still pass.

- [ ] **Step 4: Run the full client vitest suite + typecheck (guard against regressions)**

Run: `yarn workspace client test && yarn workspace client typecheck`
Expected: PASS — `fixtures`, `render`, `actions`, `selector`, `App` all green; no type errors. (The refactor touches only assertions in one file; nothing else should move.)

- [ ] **Step 5: Commit**

```bash
git add client/tests/fixtures.test.ts
git commit -m "refactor(phase-4): derive structural fixtures test from FIXTURES (no hardcoded set)"
```

---

### Task 3: Build & Test skill — Client section

Append the client *build/test* procedure to `build-catalog-component/SKILL.md`: the infra-assumption preamble and the 7-step mechanical loop that transcribes the decision doc's client section into fixtures, integration tests, and baselines. No human input (the Claude-Chrome bless is agent verification).

**Files:**
- Modify: `.claude/skills/build-catalog-component/SKILL.md` (append after the Adapter section)

**Interfaces:**
- Consumes: the **client-section format** from Task 1 (fixture table columns `fixture | exercises | component state / canned values | baselined?`; the prop-coverage map). Assumes the refactored structural test from Task 2 (auto-covers).
- Produces: nothing downstream in 4.2 (agent build section is 4.3).

- [ ] **Step 1: Read the client code ground truth**

Read the shipped client artifacts listed under Global Constraints — `client/src/fixtures/*.ts`, `client/src/test-space/{FixtureView,TestSpace}.tsx`, `client/tests/{helpers.tsx,render.test.tsx,actions.test.tsx,selector.test.tsx,fixtures.test.ts}`, `client/e2e/visual.spec.ts`, `client/playwright.config.ts` — and the existing Adapter section in `build-catalog-component/SKILL.md`. This is the loop the Client section captures.

- [ ] **Step 2: Write the Client section intro + infra-assumption preamble**

Append a `## Client section` to `build-catalog-component/SKILL.md`. Content:
- One line: this step **consumes the decision doc's client section** (fixture table + prop-coverage map + canned values) and mechanically materializes the client artifacts; it takes **no human input** (the Claude-Chrome bless is Claude's own agent verification, not human input).
- **Infra-assumption preamble:** the test-space scaffold (`TestSpace`, `FixtureView`, `helpers`, the `FIXTURES` barrel, `playwright.config.ts`) and the A2A wire are **one-time infrastructure that already exists** and is only *consumed* here — this loop never stands it up. If it is missing, that is a scaffold/template concern outside this loop. The mock boundary is fixed: `functionCall` runs locally, `event` goes to the injected handler; no real transport (that is 4.3).

- [ ] **Step 3: Write the 7-step mechanical loop**

Author the loop as seven ordered steps with teaching-sized snippets modelled on the shipped files:

1. **Author fixture files** — one `client/src/fixtures/<name>.ts` per fixture-table row, transcribing the canned component state + values into `A2uiMessage[]` (`createSurface` with `CATALOG_ID` + `version: 'v0.9'`, then `updateComponents` with a `root` component; `updateDataModel` for a bound fixture). A gallery row → one file emitting one surface per enum value. Model: `text.ts` (literal), `text-bound.ts` (bound + data model), `button-fn.ts` (functionCall), `button-event.ts` (event), `button-variants.ts` (gallery via `VARIANTS.flatMap`).
2. **Register in the fixtures barrel** — add each fixture to `FIXTURES` and its named export in `client/src/fixtures/index.ts`.
3. **Structural test auto-covers** — no edit. The refactored `fixtures.test.ts` (uniqueness + per-fixture invariants over `FIXTURES`) already covers new fixtures. State this explicitly as a no-op step.
4. **Render/action unit tests** — assertions rendered **through the full renderer** via `renderFixture` (`MessageProcessor` → `A2uiSurface`), not the `View` directly. Per-fixture assertions derived from the coverage axis: content renders (every fixture); binding resolves from the data model (bound fixture); `functionCall` runs the registered local fn and the handler is **not** called (functionCall fixture); `event` dispatches to the injected handler with `{name, surfaceId, sourceComponentId}` (event fixture); a visually-distinct state is honoured through the renderer (e.g. `disabled` → button disabled). Add to `render.test.tsx` / `actions.test.tsx`. Model:

   ```tsx
   // render — integration through the real renderer
   it('renders a literal Text', () => {
     renderFixture(textFixture);
     expect(screen.getByText('Hello from Primer')).toBeInTheDocument();
   });

   // action path-1 — functionCall local, handler untouched
   it('runs the registered consoleLog locally, not via the handler', () => {
     const logSpy = vi.spyOn(console, 'log').mockImplementation(() => {});
     const handler = vi.fn();
     renderFixture(buttonFnFixture, {actionHandler: handler});
     fireEvent.click(screen.getByRole('button', {name: 'Run local function'}));
     expect(logSpy).toHaveBeenCalledWith('[A2UI]', 'button-fn clicked');
     expect(handler).not.toHaveBeenCalled();
     logSpy.mockRestore();
   });
   ```

5. **Selector test auto-covers** — no edit. `selector.test.tsx` loops `FIXTURES`, so the option-count assertion tracks automatically; no per-component test is written. State this as a no-op step (mirrors the adapter parity loop).
6. **Claude-Chrome bless (bless-before-freeze)** — the agent drives the browser to each new fixture (`/?fixture=<name>`, at the tunnel URL) and confirms the render against the component's documented appearance (the decision-doc header's official doc URL). This is the correctness gate before any baseline is frozen. Note: the Phase-5 nightly prompt owns skipping this where Claude-Chrome is unavailable, and **skipping the bless implies skipping step 7** (never freeze an unblessed render).
7. **Generate + commit Playwright baselines** — `yarn workspace client test:e2e --update-snapshots` produces one PNG per fixture under `client/e2e/visual.spec.ts-snapshots/` (a gallery fixture → one `fullPage` PNG covering all its surfaces), then `yarn workspace client test:e2e` verifies clean. Baseline name derives mechanically from the fixture name.

- [ ] **Step 4: Read-through validation against `Text` + `Button`**

Walk the loop from each component's client section and confirm it reproduces the shipped client artifacts (no code executed — compare against the files):
- **Text** → `text.ts`, `text-bound.ts`; the literal/bound render assertions in `render.test.tsx`; the `text`/`text-bound` baselines.
- **Button** → `button-fn.ts`, `button-event.ts`, `button-variants.ts`; the two action-path assertions in `actions.test.tsx`; the button-fixture baselines. Confirm steps 3 and 5 are genuinely no-ops given the current barrel + refactored structural test.

Fix any step whose transcription would not reproduce these. Expected: the shipped artifacts reproduce exactly (modulo the deferred exhaustive extras from Task 1).

- [ ] **Step 5: Commit**

```bash
git add .claude/skills/build-catalog-component/SKILL.md
git commit -m "feat(phase-4): author client build/test section — fixture/test/baseline loop + Claude-Chrome bless"
```

---

## Self-Review

- **Spec coverage:** Task 1 covers spec decisions 2 (Design picks scenarios), 4 (prop-walk, single-axis), 5 (client section = fixture table + coverage map + canned values), 6 (three-stage gate reuse, brainstorm is the core). Task 2 covers decision 11 (sole product-code refactor) and enables decision 10 (structural auto-cover). Task 3 covers decisions 1 (consumed infra), 7 (mock/local boundary), 8 (integration-through-the-renderer tests), 9 (Build flow with Claude-Chrome bless-before-freeze), 10 (7-step loop + auto-cover preamble). Decision 3 (exhaustive over state-bearing props; Button backfill deferred) is carried in Task 1's prop-walk + the enumerated-extras note and Task 1/3's read-through. Invariants (append-only to two `SKILL.md` files + one refactor; Build takes no human input; teaching-sized snippets) hold across all tasks.
- **Placeholder scan:** no product-code placeholders. The `SKILL.md` prose is specified as content bullets + the concrete fixture table / coverage map / teaching snippets that must appear, matching 4.1's plan altitude (the shipped files are the ground truth; snippets are teaching-sized, not full reproductions). The one real code change (Task 2) shows the exact before/after blocks and commands.
- **Type/name consistency:** the client-section column names (`fixture | exercises | component state / canned values | baselined?`; coverage map `adapter prop | covered by`) are defined in Task 1's Produces block and consumed verbatim in Task 3 Step 3. The refactored `fixtures.test.ts` shape in Task 2 is what Task 3 step 3 relies on. Real symbols (`CATALOG_ID`, `renderFixture`, `FIXTURES`, `actionHandler`) match the shipped client tree.
