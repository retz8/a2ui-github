# Task 8.4 — Timeline & time travel

Sub-task spec for `**8.4**` under `## Phase 8` in `_dev/TODO.md`, refining the phase spec's decisions 4–9 and 12–13 (`_dev/docs/spec/phase-8-demo-integration.md`): the ring store, paint causes and titles, the history UI, and parked-snapshot restore with interaction-state write-back.

8.4 owns the **final** interfaces for paints, snapshots, causes, the timeline, and the canvas state. The 8.2/8.3 shapes are placeholders and are superseded here rather than extended.

## Scope

- The timeline as the single append-only ring of paints, replacing 8.3's departed-only array.
- The cause record: parentage, fork marking, and denormalised provenance.
- Titles in 8.4: the permanent cause-derived fallback, with the agent-authored slot left empty until 8.5.
- Parked-snapshot restore: rehydration into a sandbox, interaction-state write-back, and the forked dispatch.
- The history chrome: Back, the titled list, return-to-live, the stale banner, and Repaint.
- The phase-spec amendments these decisions require.
- Verification on fixtures, zero LLM, plus a closing live confirmation.

## Locked decisions

### 1. One timeline; the live paint is its newest entry

The timeline is a single append-only sequence of paint entries. An entry is appended the moment a paint lands, carrying its identity, cause, and timestamps; its snapshot is filled in when the paint departs the stage. The newest entry is the live paint and is the only one whose snapshot is absent. 8.3's separate live-paint metadata object is deleted — it was the same fact held in a second place.

Serialize-on-swap is unchanged: capture still happens once, at replacement. Only the moment the entry is *appended* moves earlier.

The canvas can be live and empty — after a deliberate stage delete the newest entry is a departed paint. "Live" therefore means the current canvas state, empty included, not always a paint.

### 2. Snapshot content is frozen; the data model is replaced on write-back

A snapshot's component tree is frozen at capture and never changes. Its data model is also frozen, but a parked visit's mutations replace it wholesale with a new frozen copy — the entry's identity, tree, cause, and paint time are untouched. There is no version history of a snapshot's data model: the latest state is kept, not a per-edit log.

Editing a past view is never a paint and never produces a timeline entry.

### 3. Write-back commits when the parked visit ends

While parked, the sandbox is authoritative for the data model and the stored entry is stale. Write-back runs once, when the parked view is torn down — which covers every exit uniformly: return-to-live, jumping to another entry, and causal jumps. Any reader that needs the data model mid-visit reads the sandbox, not the entry.

Nothing is persisted beyond the tab. The whole timeline is in-memory for a single session, so an uncommitted write-back at tab close loses nothing that was not already lost.

### 4. Restore rehydrates through the real message path

A parked snapshot is rendered by reconstructing its surface-creation, component, and data-model messages and pushing them through a sandbox message processor — the same path a live paint takes, including catalog resolution, data binding, local function execution, and action dispatch. Building surface and component models directly is rejected as a second, divergent way to construct a surface.

The snapshot therefore captures the surface's catalog identity alongside its tree and data model. Theme and the send-data-model flag are not captured.

One sandbox exists per parked visit, created on park and disposed on unpark — the same lifecycle write-back hangs off.

Parked sandboxes are outside the live registry by construction, so "never reported to the agent" needs no enforcement.

### 5. Dispatching from a parked view jumps to live immediately

The moment a turn is dispatched from a parked view — by any affordance — the sandbox tears down, write-back commits, and the canvas returns to the live stage, which holds while the new paint streams and swaps in normally. The user watches the transition rather than being teleported to a result they never saw arrive.

### 6. Parent is the paint the user was looking at

Every cause records as its parent the paint on the canvas when the edge fired, with no parent meaning the canvas was empty. This is positional provenance, not a claim that the new paint derives from the old one — the client cannot judge topical relatedness and does not try. The rule is uniform across all three cause kinds; which affordance was used does not change the edge.

### 7. Forks are recorded, not derived

A cause carries an explicit flag for whether the view was parked when the edge fired. A fork is any turn dispatched while parked — including a palette utterance, not only a surface action. The flag is a fact the client already holds at dispatch, since it is the same condition that governs fork context on the wire.

Provenance renders only for forks. A paint dispatched from the live head always has the entry above it as its parent, so a causal link there restates what the list already shows.

### 8. While parked, the live registry is what the agent may see

Parking is a view operation with no registry effect: the live surface stays in the live processor, undisplayed. The phase invariant is reworded from "the live registry is exactly canvas occupancy" to "the live registry is exactly what the agent may see" — which preserves what the invariant was protecting, the bound on reported data.

A forked turn reports the **parked snapshot's** data model, not the head's. The head is not what the user acted on, and the agent already knows the head from its own linear conversation. The head's un-reported local mutations are knowingly dropped — they are precisely the edits the user chose not to act on.

### 9. Navigation is chronological, with no Forward

Back steps to the chronological neighbour and disables at the oldest retained entry; it is never causal, since causal links are a separate, explicitly-clicked affordance. There is no Forward: return-to-live covers leaving the past in one gesture from any depth, and the titled list addresses any retained entry directly, which beats stepping blind.

The list shows every retained entry, not a top-K window — the ring cap is already the bound. It includes the live entry, marked as such. Return-to-live sits beside Back and is absent at the head.

### 10. Titles: cause-derived, with the surface id as last resort

Every title in 8.4 is a fallback; the agent-authored slot exists on the entry but stays empty until 8.5, so 8.4 proves the permanent fallback path standalone. The fallback derives from the cause first — the utterance, the action's subject, or the answered question — because distinguishability is what a history list is for. When a cause derives to nothing, the humanised semantic surface id is the second fallback.

The agent's title is wire data and is stored; the fallback is a display string and is derived at render. One derivation produces the bare phrase, which the status strip decorates for the activity register and the history list takes plain — two title functions would drift.

### 11. Repaint replaces "re-ask", and re-fires the paint's cause

The affordance on a parked view regenerates it by re-firing its own cause — the utterance, the action, or the answer that produced it — yielding an ordinary forked paint at the head. The parked snapshot is untouched. This needs nothing from 8.5 and works uniformly across cause kinds.

It is named **Repaint** in the UI, the spec, and the code, replacing "re-ask" throughout the phase spec. The phase spec's Vocabulary gains it: *regenerate a parked view by re-firing its cause, producing a new paint at the head*. The overlap with the existing descriptive use of "repaint" (a surface id painted again) is accepted and stated once, since the two senses coincide whenever the agent reuses a semantic id.

Repaint is what makes a parked view actionable rather than a screenshot; without it, "history as data, not screenshots" is a claim the demo never demonstrates.

### 12. A paint landing while the user is parked leaves them parked

The head advances and the canvas stays parked, with a distinct signal that a newer view exists. Navigating away after dispatching is a more recent statement of intent than the dispatch itself, and yanking the view would override it. This gives the two staleness signals separate jobs: the banner says where you are, the new-paint marker says what changed while you were away.

### 13. Ring cap of 50 entries, counted; eviction is hard

The cap is a count, not a byte budget. Measured against the eight recorded beats, materialised snapshots run 4–26 KB (mean ~11.5 KB), so memory is not what the ring protects — the multi-megabyte figures are the stream logs, which decision 12 keeps as a separate artifact. The cap makes the phase spec's bounded-history claim real rather than aspirational, and is set generously enough that eviction never fires during the arc; it is covered by unit tests instead, since a demo that visibly loses history argues against its own thesis.

Eviction is hard — no metadata stub; tiered history remains the thesis's future model. To keep evicted provenance informative, the parent's title is denormalised into the cause at fork time, so a causal link into an evicted paint still names it while being inert. This is a deliberate exception to the phase spec's "display strings are derived at render, never stored": the parent's title is a recorded fact about the edge, not a rendering of the cause.

Eviction of the entry currently parked on forces return-to-live.

### 14. History chrome lives at the top edge

Back floats at the top left and is always present; pressing or right-clicking it opens the titled list downward. While parked, a full-width tinted banner materialises at the top edge *around* the Back button — Back does not move, return-to-live appears beside it, the stale text sits centred, and Repaint sits at the right. The ambient notice offsets downward while the banner is present, since both claim the top edge.

The banner carries the past-state signal, so a stage tint is optional and adopted only if the banner reads weakly in practice.

### 15. A pending question survives parking

The overlay is orthogonal to which paint the stage shows: a pending question stays until answered or spoken past, and answering it from a parked view is an ordinary fork. Blocking navigation would make a free local interaction hostage to an agent request, inverting the interaction-cost policy; dismissing on park would destroy a question the user may be scrubbing back precisely in order to answer. The dialog's own cancel action remains the way to dismiss it.

### 16. Shell chrome is the user's command channel and is never blocked

The in-flight interaction policy's real distinction is whose channel an interaction belongs to, not what its payload contains: content the agent painted versus the shell the user commands. Back, the history list, return-to-live, and Repaint are shell chrome and are never blocked — Repaint is last-intent-wins alongside the palette, regardless of whether its re-fired cause happens to be an utterance or an action. Only actions embedded in an agent-painted surface remain the blocked class.

### 17. Verification: fixtures and chrome baselines, closing with a live pass

Behavioural verification runs zero-LLM in the 8.3 style — the ring and eviction, write-back persistence across repeated parked visits, fork semantics, and a paint landing while parked — driven through the real store and turn runner. A round-trip fidelity check is required: a real recorded beat replayed, departed, then parked, asserting the rehydrated render matches what the live render produced.

A minimal set of visual baselines covers the new chrome states, driven off the existing recorded-beat replay path. This is warranted by evidence rather than principle: a canvas chrome layout collision already shipped in this phase, and 8.4 adds four more floating elements to the same surface.

A live confirmation in the browser over the tunnel closes the sub-task, in addition to the above.

## Invariants

- Snapshot component trees are frozen at capture and never change; a snapshot's data model is frozen at every observable moment, changing only by wholesale replacement.
- Editing or viewing a past paint never creates a timeline entry.
- The live registry is exactly what the agent may see — the head's stage plus at most one overlay — regardless of what the user is looking at. Parked sandboxes are outside it.
- Paint ids are monotonic and never reused; causes reference ids, not positions.
- Timeline order is strictly chronological; entries never move.

## Open items

- The title carrier and the fork-metadata carrier on the wire remain 8.5's, and are not designed here. 8.4 ships the title slot empty.
- Whether the arc scripts Repaint is 8.6's call; if it goes unscripted, the affordance is a candidate cut.
- Whether the parked stage needs a tint in addition to the banner, judged once the chrome is real.
