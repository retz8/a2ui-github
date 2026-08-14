# Task 8.2 — Canvas core

Sub-task spec for `**8.2**` under `## Phase 8` in `_dev/TODO.md`, extending the phase spec `_dev/docs/spec/phase-8-demo-integration.md`: the canvas route + canvas store, stage rendering over the existing pipeline, palette input, and status strip — a paint lands on the stage, progressive on an empty canvas.

## Scope

- The canvas page, its store, stage rendering, the palette input, the status strip, and the fixture-replay verification harness for them.
- Development and automated gates are fixture-driven (the 8.1 recorded beats, zero LLM); the palette is wired to the real agent, and one manual live smoke (palette → agent → stage paint) is required before the sub-task is done.
- Not in 8.2: hold-and-swap, the validation gate, the overlay slot, and the interaction-cost split (8.3); timeline, snapshots, and history UI (8.4); agent-authored titles and fork context (8.5).

## Locked decisions

### 1. Route: a fourth Vite entry page

The canvas is a new Vite multi-page entry (`canvas.html` + its entry `.tsx`) alongside the existing chat/dev/examples pages — no router introduced. Canvas code stays self-contained, anticipating a future extraction into a standalone `a2ui-canvas` project (outside this project's scope).

### 2. Store: hand-rolled external store

The canvas store is a hand-rolled closure module — mutation methods plus `subscribe` — read by components via `useSyncExternalStore`. No store dependency is added.

### 3. Store scope: slice-only

The store ships with only the fields 8.2 exercises — stage occupancy and in-flight status. Later fields (`timeline`, `head`, `viewing`, `overlay`) are added by 8.3/8.4 in their own grills; nothing is pre-declared.

### 4. Stage semantics: naive replace, delete-on-replace, last-wins

Every paint behaves like the empty-canvas case, streaming progressively straight onto the stage; a paint arriving over an occupied stage naively replaces it. The outgoing surface is deleted from the `MessageProcessor` immediately on replacement, so the live registry equals canvas occupancy from day one. When one turn creates multiple surfaces, the last `createSurface` takes the stage pointer. 8.3 layers hold-and-swap timing over this primitive; 8.4 adds snapshot-before-delete.

### 5. Palette mechanics

`⌘K` summons the palette, plus a small always-visible affordance in the status strip for discoverability. The palette auto-opens when the canvas is empty and idle. `Esc` dismisses without dispatch; `Enter` dispatches the utterance and closes. While a paint is in flight, send is blocked (with the status cue); 8.3 replaces the block with last-intent-wins cancel.

### 6. Status strip states and agent prose

The strip has three states: idle (a quiet hint, e.g. "⌘K to ask"), in-flight (spinner + derived label, using the chat page's existing label derivation until agent-authored titles arrive in 8.5), and error (sticky until the next dispatch clears it). Agent prose (`onAgentText`) is routed to a transient auto-fading ambient notice — shell furniture, not stored anywhere.

### 7. Verification harness: `?beat=` replay, paced by default; vitest gate; no Playwright

The canvas page accepts a `?beat=N` query param that replays the recorded beat onto the stage. Replay is paced by the recorded `offsetMs` by default, with an instant mode; the replay driver also routes the recording's captured agent texts into the ambient-notice channel. The automated DoD is a vitest gate replaying all 8 beats through the real canvas store + processor, asserting zero apply failures, the stage pointer on the last-created surface, a rendered surface, and in-flight state settling back to idle. No Playwright baselines in 8.2: the recorded beats carry time-relative live data, so screenshots drift stale.

### 8. Live wiring: chat transport reused wholesale; surface actions in scope

The chat page's transport is reused as-is — `A2ASession`, sender resolver, `streamUserMessage`, `createA2AActionHandler` — applied to the canvas's processor through `applyA2uiMessages`. Actions on stage surfaces dispatch to the agent and their resulting paints land by decision 4. `getClientDataModel` reports from the live registry, which by delete-on-replace is exactly the stage. Agent-bound surface actions are blocked while a paint is in flight, by the same pending guard as the palette.
