# Task 8.5 — Agent-side additions

Task spec for `**8.5**` in `_dev/TODO.md`, under Phase 8 (`_dev/docs/spec/phase-8-demo-integration.md`): per-paint titles, fork-context attachment on the wire, and the prompt adjustments both imply — settling the two carrier mechanisms the phase spec deferred to this sub-task (decisions 8 and 15), plus the question-paint wire marker 8.3 parked for this grill.

## Scope

- Both ends of each wire contract: the agent's emit/ingest sides **and** the client's read/attach glue, so 8.5 lands fully functional end-to-end.
- Out of scope, all confirmed exclusions:
  - The deterministic agent learns neither paintMeta nor fork context.
  - The chat page is untouched (it retires at 8.6 regardless).
  - The 8.1 beat fixtures are not re-recorded — they stay markerless/titleless and serve as the regression test for the fallback path. The client replay path must tolerate paintMeta parts in future recordings (part of the client extractor work).

## Locked decisions

### 1. The title leads the paint

The agent emits the title at the start of the turn, before the surface streams, so it powers the in-flight status label during hold-and-swap and is kept when the paint lands. The cause-derived label remains the fallback for the gap before the title arrives and for absent titles, per the 8.3/8.4 contract.

### 2. Title carrier: a dedicated paintMeta DataPart

The title rides agent→client as a dedicated shell-metadata DataPart alongside the A2UI DataParts, marked by its own mimeType (not `version: 'v0.9'`, so the A2UI extractor never confuses it for a protocol message), emitted ahead of the corresponding `createSurface` part. This is a shell-layer envelope around A2UI, not a protocol change — the A2UI v0.9 messages themselves are sealed (`additionalProperties: false`). The envelope is the extension point for future per-paint metadata.

### 3. Model sourcing: a paint-title tag in model text

The model communicates the title through a tagged element in its text output — `<paint-title surface="…">…</paint-title>` — emitted before the corresponding `<a2ui-json>` block. The executor watches the token stream for the tag and synthesizes the paintMeta DataPart from it. No tag → no paintMeta part → client fallback.

### 4. Question-paint marker: adopted now, in paintMeta

paintMeta carries a question marker (`kind = "question"`) from day one, sourced from the same tag.

### 5. Marker is the contract; structure is house style

The client routes purely on `kind`: marker present → route by it; marker absent → the 8.3 structural `ConfirmationDialog` detection, which survives only as the compatibility fallback for markerless streams (8.1 fixtures, pre-8.5 recordings) and is explicitly this-catalog knowledge. The canvas never arbitrates a marker↔structure mismatch.

### 6. Marker↔dialog consistency is agent-side validator policy

"kind=question ⇒ ConfirmationDialog root" and its converse are enforced in this agent's validator through the existing correction/retry loop — a mismatch never ships. This is this agent's enforcement of Primer's question idiom, not a canvas invariant; a future agent on a different catalog enforces its own idiom behind the same marker.

### 7. Title binds to createSurface only

One title per paint, fixed at birth. Update-only turns (no `createSurface`; they extend the current paint) cannot retitle. A content shift big enough to deserve a new name is the agent's cue to repaint the surface id.

### 8. Titles are best-effort

No validation gate on title presence. A `createSurface` without a preceding title ships as-is and the client's cause-derived fallback names it. Unlike the question marker (whose absence misroutes UX), a missing title degrades to a designed, first-class fallback.

### 9. Fork-context carrier: sibling Message.metadata key

The fork context rides client→agent as a metadata key on the outgoing A2A message, sibling to `a2uiClientDataModel`. The framing of that object into prompt prose belongs to the executor, not the client.

### 10. Fork-context content: spec-minimal, self-identifying

Presence of the key is the historical-view flag. The object carries `{paintId, title, paintedAt, position}`, with position expressed as depth behind live at dispatch time (not a raw timeline index — ring indexes shift under eviction; the monotonic paintId is the stable identifier). No head contrast: the forked turn is about the parked view, per the phase's live-registry narrowing.

### 11. Forked turns are framed with facts plus explicit directives

The executor frames the fork context into the per-turn prompt: the historical-view facts (title, painted-at, depth), plus brief behavioral rules — the attached data model is as-of-then; refetch live data before composing anything depending on current state; the response paints as the newest view, not over the historical one. Starts explicit; tunable during 8.6's arc runs.

### 12. Prompt work: three additions

The title tag instruction; the question-marker instruction, folding in the ask-as-a-surface alignment 8.3 anticipated (questions arrive as surfaces, a rule the client enforces but the prompt never states today); the fork-context framing per decision 11.

### 13. Definition of done: unit tests both ends plus one live tunnel smoke

Agent-side units: tag→paintMeta synthesis (including tag-absent and ordering before `createSurface`), the two validator consistency rules, fork-context ingestion → framed prompt text. Client-side units: paintMeta extraction → the stored entry title, kind-first routing with structural fallback, fork-context attachment on a parked dispatch. Then one live canvas session over the tunnel (Claude-in-Chrome): an authored title in the status strip during hold and in the history list; one question paint routed by the marker; one action fired from a parked snapshot with the framed fork context confirmed in the agent's session recording. Beat-level grading stays 8.6's job.

## Invariants

- Nothing in 8.5 modifies the A2UI protocol payloads; both carriers live in the A2A layer around them.
- The 8.4 cause-derived title fallback remains the permanent fallback in every register.

## Open items

- Overlay question text stays component-derived (the dialog's own title prop); paintMeta titles feed the history/status registers only. Stated as a default during the grill — a plan-level detail, revisable there.
