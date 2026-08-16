# Canvas Refactor (task 8.8, code half) Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Restructure `client/src/canvas/` for readability and lower coupling — behavior-identical — per task-8.8 spec decisions 9–13.

**Architecture:** Four moves, all structure-only: (1) re-home the three view/error helpers the canvas borrows from `chat/` into a shared module both pages consume, ending the `canvas → chat/` dependency; (2) lift the `CanvasApp` wiring closure out of the React component into a factory module, with the provenance/fork builders as a cohesive helper; (3) split `canvasTurn.ts` at its one real seam — the pure message-inspection helpers — leaving the stateful turn closure intact; (4) a light directory grouping of the presentational leaf components under `canvas/components/`. No behavior changes, no new features, no CSS restructuring, no new tests as a goal — existing tests move with the code they cover and keep passing.

**Tech Stack:** Vite + React 19 + TypeScript, Vitest (jsdom + RTL), ESLint, Prettier. Yarn 4 workspaces.

## Global Constraints

- **Bar is behavior-identical** (spec decision 10). No functional change of any kind; the diff is pure restructuring.
- **Refactor standard:** `toss-frontend-fundamentals` — readability > predictability > cohesion > coupling (spec decision 10).
- **Verification gate** (spec decision 13, this run): `yarn build:all`, `yarn typecheck:all`, `yarn lint:all`, `yarn test:all` all green. Playwright is EXCLUDED (morning review).
- **No new tests as a goal** (spec decision 9): existing coverage moves with the logic it covers; add none.
- **Comment scrub per touched file** (spec decision 7): rewrite comments to state the constraint itself, not the phase/task where it was decided; keep a spec-file pointer only where an invariant is too big to restate. Applies only to files this refactor actually touches.
- **In scope** (decision 9): shared module ending the `chat/` dependency; `CanvasApp` closure decomposition; `canvasTurn` split along real seams only; light directory grouping. **Out**: CSS restructuring, a UI-strings module, new tests.
- **Do not touch** `_dev/TODO.md`, specs, handoffs, or any `_dev/` file other than this plan doc. Do not touch `adapter-template/` or docs.

---

### Task 1: Re-home the shared view/error helpers out of `chat/`

Three helpers are consumed by both `chat/` and `canvas/`, so the canvas currently reaches into `chat/`. Move them to a page-neutral `client/src/shared/` module. They are already page-neutral in content (generic error phrasing, action-to-phrase, a per-surface React error boundary).

**Files:**
- Move: `client/src/chat/describeError.ts` → `client/src/shared/describeError.ts`
- Move: `client/src/chat/describeError.test.ts` → `client/src/shared/describeError.test.ts`
- Move: `client/src/chat/describeAction.ts` → `client/src/shared/describeAction.ts`
- Move: `client/src/chat/describeAction.test.ts` → `client/src/shared/describeAction.test.ts`
- Move: `client/src/chat/SurfaceErrorBoundary.tsx` → `client/src/shared/SurfaceErrorBoundary.tsx`
- Move: `client/src/chat/SurfaceErrorBoundary.test.tsx` → `client/src/shared/SurfaceErrorBoundary.test.tsx`
- Modify importers: `client/src/chat/ChatView.tsx` (3 imports → `../shared/…`), `client/src/canvas/CanvasApp.tsx`, `client/src/canvas/canvasTurn.ts`, `client/src/canvas/paint.ts`, `client/src/canvas/CanvasOverlay.tsx`, `client/src/canvas/CanvasStage.tsx`, `client/src/canvas/ParkedStage.tsx` (canvas importers → `../shared/…`).

**Interfaces:**
- Produces: `shared/describeError.ts` → `describeError(error: unknown): string`; `shared/describeAction.ts` → `describeAction(action: A2uiClientAction): string`; `shared/SurfaceErrorBoundary.tsx` → `SurfaceErrorBoundary` (React component, props `{surfaceId, resetKey?, children}`). Signatures unchanged from their `chat/` originals.
- Note: `SurfaceErrorBoundary` renders `className="chat-surface-error"` and `data-testid={surface-error-…}`. Keep both strings verbatim — CSS restructuring is out of scope and the test-ids are asserted by existing tests.

- [ ] **Step 1: `git mv` the six files** (preserves history), e.g. `mkdir -p client/src/shared && git mv client/src/chat/describeError.ts client/src/shared/describeError.ts` and likewise for the other five.
- [ ] **Step 2: Fix intra-module imports.** `SurfaceErrorBoundary.test.tsx`, `describeError.test.ts`, `describeAction.test.ts` import their subject via `./…`; those stay `./…` after the move. Verify no test referenced a sibling now in a different dir.
- [ ] **Step 3: Update `chat/ChatView.tsx`** — the three imports change from `./describeAction`, `./describeError`, `./SurfaceErrorBoundary` to `../shared/…`.
- [ ] **Step 4: Update the six canvas importers** — change `../chat/describeError` → `../shared/describeError`, `../chat/describeAction` → `../shared/describeAction`, `../chat/SurfaceErrorBoundary` → `../shared/SurfaceErrorBoundary`.
- [ ] **Step 5: Comment scrub** on any moved file whose header cites a phase/task; these three are already timeless — leave as-is if so.
- [ ] **Step 6: Run** `yarn workspace client run typecheck` then `yarn workspace client run test` — expect PASS with the moved tests running from `shared/`.
- [ ] **Step 7: Commit** `refactor(phase-8): re-home shared surface/error helpers out of chat/`.

---

### Task 2: Split `canvasTurn.ts` at its one real seam — pure message inspection

`canvasTurn.ts` mixes pure message-shape inspection (which surface a message targets, a surface's root type/title) with the stateful turn closure. The pure helpers are a genuine seam; the staged/progressive apply-and-end logic shares per-turn mutable state (`createdIds`, `buffered`, `staging`, `metas`) and must stay in one closure — splitting it would raise coupling, which the standard forbids. Extract only the pure part.

**Files:**
- Create: `client/src/canvas/turnMessages.ts`
- Modify: `client/src/canvas/canvasTurn.ts` (remove the extracted helpers, import them)
- Test: existing `client/src/canvas/canvasTurn.test.ts` continues to cover behavior through the runner (no new test).

**Interfaces:**
- Produces from `turnMessages.ts`:
  - `type MessageTarget = {kind: 'create' | 'update' | 'delete' | 'other'; surfaceId?: string}`
  - `targetOf(message: A2uiMessage): MessageTarget`
  - `rootTypeOf(processor: TurnProcessor, surfaceId: string): string | undefined`
  - `questionTitleOf(processor: TurnProcessor, surfaceId: string): string | undefined`
  - `QUESTION_ROOT_TYPE` and `ROOT_COMPONENT_ID` constants
  - The processor-shape interfaces these read through: `CanvasSurface`, `TurnProcessor` (moved here so the pure helpers own their input contract; `canvasTurn.ts` re-imports them).
- Consumes: `@a2ui/web_core/v0_9` (`A2uiMessage`), `./snapshotSurface` (`SnapshotSourceSurface`).

- [ ] **Step 1: Create `turnMessages.ts`** with the `CanvasSurface`/`TurnProcessor` interfaces, the `MessageTarget` type, `targetOf`, `rootTypeOf`, `questionTitleOf`, and the two constants — moved verbatim from `canvasTurn.ts`. Rewrite the moved comments to state the rule itself (comment scrub).
- [ ] **Step 2: Edit `canvasTurn.ts`** — delete the moved declarations; add `import {targetOf, rootTypeOf, questionTitleOf, QUESTION_ROOT_TYPE, ROOT_COMPONENT_ID} from './turnMessages';` and `import type {CanvasSurface, TurnProcessor, MessageTarget} from './turnMessages';`. Keep `CanvasSurface`/`TurnProcessor` re-exported from `canvasTurn.ts` (via `export type {…}`) so existing external importers of those types don't break.
- [ ] **Step 3: Verify external importers.** Grep for `from './canvasTurn'` importing `CanvasSurface`/`TurnProcessor`; the re-export in Step 2 covers them. `MessageTarget` is internal — no re-export needed unless an importer exists.
- [ ] **Step 4: Run** `yarn workspace client run typecheck` then `yarn workspace client run test client/src/canvas/canvasTurn.test.ts` — expect PASS.
- [ ] **Step 5: Commit** `refactor(phase-8): extract pure message-inspection helpers from canvasTurn`.

---

### Task 3: Lift the `CanvasApp` wiring closure into a factory module

`CanvasApp.tsx` builds its entire runtime graph — store, session, sender, processors, turn runner, and ~10 dispatch/provenance handlers — inside a single `useState(() => {…})` closure spanning ~245 lines, mixed into the React component. Lift it into a plain factory the component calls once. Within the factory, the provenance/fork builders (`parentId`, `forkFields`, `forkContextOf`, `parkedClientDataModel`) are a cohesive cluster that reads store + parked state; group them into a small helper so the factory reads as wiring, not provenance arithmetic.

**Files:**
- Create: `client/src/canvas/causeContext.ts` — the provenance/fork builders.
- Create: `client/src/canvas/createCanvasWiring.ts` — the factory, returning the same object the closure returned.
- Modify: `client/src/canvas/CanvasApp.tsx` — replace the inline closure body with `useState(() => createCanvasWiring({serverUrl, client}))`; keep the React-only parts (beat-replay effect, ⌘K effect, palette state, render) unchanged.
- Test: existing `client/src/canvas/CanvasApp.test.tsx` covers the wired behavior end-to-end (no new test). `causeContext` and `createCanvasWiring` are exercised through it.

**Interfaces:**
- Produces from `causeContext.ts`:
  - `interface CauseContext { parentId(): number | null; forkFields(): {forked: boolean; parentTitle?: string}; forkContextOf(): ForkContext | undefined; parkedClientDataModel(): A2uiClientDataModel | undefined; }`
  - `createCauseContext(store: CanvasStore, parkedHolder: {session: ParkedSession<ReactComponentImplementation> | null}): CauseContext`
  - (Move `parentId`/`forkFields`/`forkContextOf`/`parkedClientDataModel` bodies verbatim; they already read only `store` and `parkedHolder`.)
- Produces from `createCanvasWiring.ts`:
  - `createCanvasWiring(opts: A2ASenderOptions): { store, processor, runner, sendUtterance, repaint, createParked, attachParked }` — the exact shape the current closure returns. `A2ASenderOptions` is `{serverUrl, client}` from `../a2a/client`.
- Consumes: everything the closure currently imports (store, session, sender, `MessageProcessor`, `CATALOG`, `streamUserMessage`, `buildActionMessageParams`, `describeError` from `../shared/describeError` (post-Task-1), `createTurnRunner`, `paint` helpers, `parkedSession` helpers) plus `causeContext`.

- [ ] **Step 1: Create `causeContext.ts`.** Move the four provenance builders into `createCauseContext(store, parkedHolder)`. Rewrite comments to state the rule (comment scrub): the fork half of a cause (parked ⇒ forked, parent title denormalised); the wire half (parked paint identity as message metadata, captured before the jump-to-live at dispatch); a forked turn reports the parked view's data model.
- [ ] **Step 2: Create `createCanvasWiring.ts`.** Move the closure body verbatim: build `store`, `session`, `getSender`, `processor` (with the `actionHandler` reference), `runner`, `parkedHolder`; call `createCauseContext(store, parkedHolder)` and destructure `parentId`/`forkFields`/`forkContextOf`/`parkedClientDataModel` from it; keep `prose`/`startTurn`/`reportAgentText`, `dispatchUtterance`, `sendUtterance`, `sendCausedAction`, `actionHandler`, `parkedActionHandler`, `createParked`, `attachParked`, `repaint`; return the same 7-key object. Rewrite the module header + inline comments to state the interaction/time-travel rules directly (comment scrub), with a pointer to `phase-8-demo-integration.md` only for the invariant too big to restate (the live-registry ≡ what-the-agent-sees rule).
- [ ] **Step 3: Slim `CanvasApp.tsx`.** Replace the `useState(() => { …closure… })` with `const [wiring] = useState(() => createCanvasWiring({serverUrl, client}));`. Remove now-unused imports from `CanvasApp.tsx` (they live in `createCanvasWiring.ts` now); keep imports the render/efflikes still use (`useEffect`, `useRef`, `useState`, `useSyncExternalStore`, `Button`, `getBeatFixture`, `replayBeatOnCanvas`, the child components, `currentPaintId` if still used in render, `.css`). Rewrite the `CanvasApp` module header to describe the page (shell layout, beat-replay param, ⌘K) and defer the wiring/time-travel prose to `createCanvasWiring.ts`.
- [ ] **Step 4: Run** `yarn workspace client run typecheck` then `yarn workspace client run test client/src/canvas/CanvasApp.test.tsx` — expect PASS.
- [ ] **Step 5: Commit** `refactor(phase-8): lift CanvasApp wiring closure into a factory module`.

---

### Task 4: Light directory grouping — presentational leaf components under `canvas/components/`

After Tasks 1–3, `canvas/` still mixes presentational leaf components with orchestration/logic in one flat directory. Group the leaf view components under `canvas/components/`; leave the page (`CanvasApp.tsx`), its CSS, and the logic/state modules at `canvas/` root. This is the natural UI-vs-logic seam; keep it light (one subdir).

**Files:**
- Move (with tests where present):
  - `AmbientNotice.tsx` + `AmbientNotice.test.tsx`
  - `StatusStrip.tsx` + `StatusStrip.test.tsx`
  - `Palette.tsx` + `Palette.test.tsx`
  - `HistoryChrome.tsx`
  - `CanvasStage.tsx` + `CanvasStage.test.tsx`
  - `CanvasOverlay.tsx`
  - `ParkedStage.tsx`
  - all → `client/src/canvas/components/`
- Modify: `client/src/canvas/CanvasApp.tsx` — the seven child-component imports change from `./X` to `./components/X`.
- Modify: the moved components' own imports — logic imports (`../paint`, `../canvasStore`, `../snapshotSurface`, `../parkedSession`, `../shared/…`) gain one `../` level; sibling-component imports stay `./`.

**Interfaces:**
- No API changes; pure file relocation. Every moved component keeps its exact export name and props.

- [ ] **Step 1: `git mv` the components + tests** into `client/src/canvas/components/` (`mkdir -p` first).
- [ ] **Step 2: Fix imports in each moved file.** Any `../a2a/…`, `../shared/…`, `../a2ui/…` stays two-up? No — they were one-up from `canvas/`, now two-up from `canvas/components/`: `../` → `../../` for non-canvas modules, and `./paint`-style canvas-root imports become `../paint`. Sibling components (e.g. `ParkedStage` importing nothing sibling) unaffected; where one moved component imports another moved component, keep `./`.
- [ ] **Step 3: Update `CanvasApp.tsx`** child imports to `./components/AmbientNotice` etc.
- [ ] **Step 4: Grep for any other importer** of these components outside `canvas/` (expect none besides `CanvasApp.tsx`); fix if found.
- [ ] **Step 5: Run** `yarn workspace client run typecheck` then `yarn workspace client run test` (full client suite) — expect PASS.
- [ ] **Step 6: Commit** `refactor(phase-8): group canvas leaf components under components/`.

---

### Task 5: Full-gate verification

**Files:** none (verification only).

- [ ] **Step 1:** `yarn build:all` — expect success.
- [ ] **Step 2:** `yarn typecheck:all` — expect success.
- [ ] **Step 3:** `yarn lint:all` — expect no errors.
- [ ] **Step 4:** `yarn test:all` — expect all suites green (Playwright/e2e excluded — not part of `test:all`).
- [ ] **Step 5:** If any gate fails, fix within the refactor's structural scope only (no behavior change) and re-run.

---

## Self-Review

**Spec coverage (decision 9 IN items):**
- "shared transport module both pages consume, ending the canvas → chat/ dependency (shared pieces re-home out of chat/)" → Task 1. (The three re-homed helpers are the shared pieces; `a2a/` was already the shared transport, so the residual coupling was these `chat/` helpers.)
- "decomposition of the CanvasApp wiring closure" → Task 3.
- "splitting canvasTurn along its real seams only — no splitting for line-count's sake" → Task 2 (one real seam: pure message inspection; the stateful closure is deliberately kept whole).
- "light directory grouping where it falls out naturally" → Task 4.
- decision 7 comment scrub per touched file → folded into Tasks 1–3 steps.
- decision 13 gate → Task 5.
- OUT items (CSS restructuring, UI-strings module, new tests) → none introduced.

**Placeholder scan:** none.

**Type consistency:** `CanvasSurface`/`TurnProcessor` defined in Task 2's `turnMessages.ts`, re-exported from `canvasTurn.ts`; `createCanvasWiring`'s return shape matches the current closure's 7 keys; `createCauseContext` signature matches the four builders' current bodies.
