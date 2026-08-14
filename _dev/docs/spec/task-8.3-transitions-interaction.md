# Task 8.3 — Transitions & interaction policy

Sub-task spec for `**8.3**` under `## Phase 8` in `_dev/TODO.md`, refining the phase spec's decisions 10–11 and 14 (`_dev/docs/spec/phase-8-demo-integration.md`): hold-and-swap with the validation gate, the overlay slot, the interaction-cost policy, and the live-registry lifecycle.

## Scope

- The hold-and-swap gate on the 8.2 canvas: off-stage streaming, the validation/failure rule, and the swap.
- The overlay slot for question paints: recognition, gating, dismissal, and answer flow.
- The in-flight interaction policy: last-intent-wins palette (replacing 8.2's blocked-palette placeholder), blocked agent-bound actions with a status cue, live local interactions.
- Live-registry lifecycle: serialize-on-swap snapshot capture and the data-model growth fix (reporting draws from the live registry only).
- Verification on fixtures, zero LLM.

## Locked decisions

### 1. Failure detection: the net-effect rule

At turn end, the gate checks whether the candidate surface still exists in the off-stage buffer. A turn whose `createSurface` was later deleted within the same turn (the agent's validation-failure cleanup) nets out to nothing: the paint is discarded, the stage holds, and the status region reports the failure. No agent-side failure signal is added; the turn boundary remains stream exhaustion, as the client has today. On an empty canvas — where decision 10's progressive streaming applies — the cleanup delete blanks the canvas back to empty, with the status notice explaining why.

### 2. Update-only turns apply live

A turn with no `createSurface` — only updates to the already-visible stage surface — applies progressively, live on the stage. Hold-and-swap governs new paints only.

### 3. Mechanism: validate-then-replay

Each turn streams into a per-turn staging `MessageProcessor` that acts as the validator; at turn end the net-effect rule is applied there. On pass, the turn's buffered messages replay into the single persistent live processor — for a stage paint, after snapshotting and deleting the outgoing stage; for an overlay paint, landing as the second live surface. The live registry stays literally one processor, giving a single reporting funnel. Message routing is per-target: messages for a surface id created this turn go to staging (staging shadows live for same-id repaints); messages targeting a live surface not created this turn apply directly to the live processor (decision 2).

### 4. A deliberate delete of the live stage is honored

A well-formed `deleteSurface` targeting the current stage's id, in a turn that does not repaint it, is honored: the stage gets the same serialize-on-swap treatment as replacement — snapshot into the timeline, removal from the live processor — and the canvas returns to empty, with a status notice.

### 5. Question paints pass the same gate

Overlay paints hold and swap like stage paints: buffered off-stage, shown whole in the overlay on turn-end plus validation. Only the empty-canvas bootstrap streams progressively.

### 6. Question recognition is structural

A validated paint whose root component is a `ConfirmationDialog` routes to the overlay slot; everything else takes the stage. Questions-are-dialogs is the rule — no wire contract, no agent dependency; 8.5's prompt work aligns the agent to a rule the client already enforces.

### 7. Speaking past a pending question dismisses it

A palette utterance while a question is pending closes the overlay (removed from the live registry) and dispatches. The unanswered question leaves no trace — overlay Q&A enters the record only as the cause of a resulting paint.

### 8. Answering removes the dialog at dispatch

The moment either dialog action fires, the answer (the raw action event, verbatim) is captured into the pending cause and the dialog is removed from the live processor. The answer's turn runs as a normal gated in-flight paint — stage held, status strip carrying the cause-derived label. If that turn fails the net-effect rule, the stage holds and the question is gone; re-asking is the agent's move.

### 9. Cancel is a true abort

Last-intent-wins is implemented as transport-level abort: each turn carries an `AbortController`, wired through a widened client sender interface into the SDK's request options. Cancel aborts the stream, discards the staging processor, and frees the in-flight slot for the new dispatch. The agent completing the canceled turn server-side (no server-side cancel exists) is accepted, per the phase spec's single linear conversation.

### 10. Snapshot storage: plain append-only array

8.3 appends `{paintId (monotonic counter), tree, dataModel (deep-frozen), cause: {kind, parent, payload}, timestamps}` to a plain unbounded array in the canvas store — everything only observable at capture time is recorded here. Ring policy (cap, eviction), titles, and all history UI stay with 8.4.

### 11. In-flight status label is cause-derived from day one

The status strip derives the in-flight label from the recorded cause — truncated utterance text, action name, or answered-question title. When 8.5's agent-authored titles arrive they become the preferred source and this remains the permanent fallback decision 8 requires.

### 12. Verification: synthetic fixtures for the unrecordable cases

Gates run zero-LLM on fixture streams: hand-authored synthetic fixtures in the recorded `BeatFixture` format for the cases the 8.1 recordings lack — a validation-failure turn (partial paint → cleanup delete → final) and a question paint (`ConfirmationDialog` root) — plus the real beats chained pairwise to exercise hold-and-swap on an occupied stage, a paced-replay abort test, and unit tests underneath. Live confirmation of the agent producing these shapes belongs to 8.6 (and 8.5's question prompting).

## Invariants

- A paint that fails validation or is canceled never reaches the stage or overlay and never enters the timeline (phase invariant, enforced by the gate).
- The live registry is exactly canvas occupancy — one persistent processor holding the stage plus at most one overlay; agent reporting draws from it only.
- Snapshot content is deep-frozen at capture.

## Open items

- Explicit wire marker for question paints — flagged as a candidate for 8.5's grill (riding whatever carrier 8.5 designs for titles/fork context), with structural detection remaining the permanent fallback.
