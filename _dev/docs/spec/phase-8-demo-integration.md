# Phase 8 — Demo integration

Phase spec for `## Phase 8` in `_dev/TODO.md`: a canvas-first generative-UI shell that replaces the chat interface, and the full "maintainer's morning" arc running end-to-end on the live `a2ui-project/a2ui` repository. Visual companion (shell mockups, wiring loop, timeline scenarios): <https://claude.ai/code/artifact/2fec59ca-df4a-48ff-991d-9d4fe4cdc125>. Extends `SPEC.md` §3 — its decisions stand unchanged: the agent is a **general GitHub agent** (any public repository plus the viewer's own PRs/issues/notifications); the morning arc is the demo subject, not the agent's boundary; action scope is read-only with beat 3 stopping at the confirm boundary; the 8-beat capability matrix (§3.1) is the verified vocabulary the arc is sequenced from.

## Scope

- Propose a new UI paradigm for generative UI — canvas-first, replacing the chat transcript — with an articulated thesis. One agent, no multi-app composition; the paradigm is a stated position and may be wrong.
- The canvas shell on the client; the agent-side additions the shell requires; arc verification against the live repo; a standalone public thesis document.
- Out of scope: multi-agent / multi-app composition (named in the thesis as the ultimate goal), non-text input, write actions against live GitHub.

## Vocabulary

The phase's terms, used throughout this spec and its sub-tasks:

- **Surface** — A2UI's live rendering slot, addressed by a semantic id (`pull-request-list`, `user-profile`) that names a view kind, not an instance.
- **Paint** — one agent rendering of a surface onto the canvas: opens with a `createSurface` reaching the canvas (fresh id or repaint of a live one) and includes all streamed component/data messages of that turn. Agent messages that only update an existing surface without a `createSurface` belong to the current paint. The paint is the timeline's unit.
- **Snapshot** — the materialized record of a paint: component tree + data model as plain JSON, plus title, cause, and timestamps. Content is frozen; interaction state is persistent.
- **Timeline** — the append-only, chronologically ordered ring of snapshots.
- **Cause (edge)** — the typed record on every paint of what produced it: `{kind: utterance | surface-action | overlay-answer, parent: <paint id, nullable>, payload}`. `parent: null` means the canvas was empty when the edge fired. Display strings are derived from the record at render time, never stored.
- **Stage / overlay** — the canvas's two layers: the stage holds the one live surface; the overlay holds at most one transient question surface.
- **Head / live** — the newest paint; what the canvas shows by default and the only thing reported to the agent.
- **Parked** — a restored snapshot being viewed from the timeline.
- **Repaint (affordance)** — regenerate a parked view: re-fire its cause, producing a new paint at the head. The parked snapshot is untouched. (Overlaps the descriptive use of "repaint" — a surface id painted again; the two coincide whenever the agent reuses a semantic id.)

## Locked decisions

### 1. Canvas-first: the surface is the primary object, language is the control plane

The canvas fills the screen like an application. Language input is a summonable command-palette-style overlay: summon, speak, dismiss. There is no persistent transcript panel. (Noted for the thesis: a palette is modality-agnostic input; audio is a future direction outside this project.)

### 2. Agent speech splits by register

Status/progress lives in a thin always-visible status region; outcomes are transient ambient notices; questions from the agent arrive **as surfaces** (`ConfirmationDialog` is the natural carrier), not as text.

### 3. Single-surface stage plus overlay slot

The canvas shows exactly one stage surface; within-surface composition is the agent's job via layout components. A question paint renders in the overlay layer above the held stage; answering dismisses it. If a turn creates multiple stage surfaces, the last takes the stage; all enter the timeline. Multi-surface canvas composition is the ultimate goal, deferred to the thesis's future section.

### 4. The paint is the unit of history; semantic surface ids are kept

The agent's Phase-7 semantic-id convention is unchanged. The client snapshots the outgoing canvas state whenever the canvas repaints — same id or different — so history is complete even when a surface repaints over itself.

### 5. Append-only DVR timeline with a pinned live head

History is an append-only sequence of snapshots; the newest is live. Viewing a snapshot is scrubbing back; nothing ever truncates. A new paint always appends at the head. The canvas jumps to live at **landing**: a turn dispatched from a parked view holds that view while the paint streams, and the view returns to live when the forked paint lands — a fork that fails, is canceled, or resolves to a question leaves the user where they acted. A paint that **lands** while the user is parked and is not their own fork leaves them parked — the head advances behind them, with a distinct newer-view signal alongside the stale banner. (Refined by task 8.4; jump moved from dispatch to landing post-8.8.)

### 6. Chronological order with causal links

Timeline order is strictly chronological; entries never move. When a paint is spawned from a past snapshot, its cause records that snapshot as `parent` — provenance is navigable ("↩ from #4") without reordering. Overlay Q&A lives **on the edge, not as a node**: the timeline holds only stage paints; the question text (the overlay's title), the answer (the raw action event, verbatim), and the stage paint beneath it are recorded as the cause of the resulting paint.

### 7. Ring-capped storage now; tiered history in the thesis

Phase 8 keeps the last N full snapshots in a ring (N = 50, per task 8.4). A causal link into an evicted paint renders as inert provenance text, still naming the paint: the parent's title is denormalised into the cause at fork time, so it survives the parent's eviction. The thesis states the future model: older entries degrade to metadata-only stubs whose restoration is repainting.

### 8. Titles: agent-authored per paint, cause-derived fallback

The agent emits a short human title alongside every surface it paints; when absent, the client derives one from the cause. The title feeds the history list, the stale banner, and causal-link text. Carrier mechanism is sub-task-level.

### 9. History affordance: Chrome-shaped, plus return-to-live

Back button always; press/right-click reveals the titled history list (all retained entries). Deviation from Chrome: while parked, a **return-to-live** affordance jumps to the head from any depth, housed with the stale banner ("past view — data as of then") and the Repaint affordance.

### 10. Transitions: hold-and-swap on an occupied canvas, progressive streaming on an empty one

While a new paint generates against an occupied stage, the current surface stays visible; the new paint streams off-stage and swaps in only when its stream completes and validation passes. A failed paint never reaches the stage and never enters the timeline. On an empty canvas the paint streams progressively. During a hold, the status region carries the in-flight title.

### 11. Interaction policy while a paint is in flight

Split by channel: **local** interactions on the old surface stay live (client-side, free); **agent-bound surface actions** are blocked, with a status cue instead of firing; **palette utterances** are last-intent-wins — cancel the in-flight paint and dispatch. A canceled paint never enters the timeline. Exception: answering an overlay question is always live. **Shell chrome is the user's command channel and is never blocked** — only actions embedded in an agent-painted surface are the blocked class; Repaint is last-intent-wins alongside the palette (task 8.4).

### 12. Snapshots are materialized, not replayable logs

A snapshot is the serialized final state, captured once at replacement (serialize-on-swap). Message logs are a different artifact with a different job: the verification fixtures. The two are never conflated.

### 13. Content frozen, interaction state persistent

A snapshot's component tree and agent-supplied data never change. The user's local interaction state (data-model mutations) is persistent: edits made while the paint was live or during any later parked visit write into the stored snapshot — "state as of the last time you touched it." Repaint spawns a new paint at the head; agent-bound actions from a parked snapshot fork their consequences to the head with `parent` = the snapshot. Parked snapshots are never in the live registry.

### 14. Live registry ≡ what the agent may see — the data-model growth fix

When a paint replaces the stage, the outgoing surface is snapshotted into the timeline and removed from the live processor; the overlay is removed when answered. At most two surfaces are live at any moment, and reporting to the agent draws from the live registry only. The agent stops receiving past surfaces' data models.

### 15. Single linear agent conversation with explicit fork context

The agent session is never rewound or branched. When an action fires from a parked snapshot, the client attaches the fork context to the outgoing message: that it is a historical view, which paint it was (title, position, painted-at), and the parked snapshot's current data model. A forked turn reports the parked snapshot's data model, not the head's (task 8.4). Carrier mechanism for the fork metadata is sub-task-level (8.5).

### 16. The arc: all 8 beats, one continuous session, on the canvas shell

The morning arc weaves all 8 verified beats into one continuous session, with narrative-glue prompts and at least one re-composition follow-up. The exact script is sub-task-level. The canvas shell is the arc's vehicle — the paradigm demo and the arc demo are the same demo.

### 17. Two-phase verification: fixtures first, then live

(1) **Record**: run each beat live once and persist the streams as replay fixtures (Phase 7 built replay capability but never kept the recordings). (2) **Shell verification on fixtures**: the recorded streams drive the canvas shell deterministically — zero LLM calls. Stitched single-beat recordings lack cross-beat continuity, which is acceptable: the shell consumes message streams, not meaning. (3) **Live arc verification**: full continuous 8-beat sessions, real LLM every turn. Accepted trade-off: a failed live run re-spends the whole prefix.

### 18. Beats 2 and 6 known defects: model-knob retry

Retry under a stronger model via the existing model env knob and re-grade during the beats' live runs; documented fallback is carrying them as known defects through the demo.

### 19. Placement: build alongside, retire chat at arc-green

The canvas grows as a new route with the Phase-7 chat page as the working live-agent reference. When the live arc passes on the canvas, the canvas becomes the default route and the chat page is demoted to a dev-only route or deleted — final call at wrap-up.

### 20. The thesis is a standalone public document

`THESIS.md` at top level, written as the position piece the demo is a proof-point of; `SPEC.md` §1 gains a pointer. The phase spec records decisions; the thesis carries the argument. Content committed to it during the grill: canvas-first with language as control plane; stages-are-nodes, dialogue-is-edges; history as data, not screenshots (deep, restorable-with-state); the interaction cost hierarchy; time travel as fork, not portal; hold-and-swap ("streaming exists to beat the blank screen; hold-and-swap means the screen is never blank"); this project as a small next-generation browser built inside a browser; futures — multi-agent canvas composition (the ultimate goal), tiered re-askable history, pinnable snapshot splits, non-text input.

### 21. Stack and storage

No new stack: the canvas is a new route in the existing client (Vite + React 19 + TS, Primer for shell furniture, `@a2ui/react` + `MessageProcessor` for surfaces, existing A2A middleware), with one canvas store owning `{timeline, head, viewing, inFlight, overlay}`. Storage: ring buffer with monotonic paint ids (ids never reused; causes reference ids, not slots; O(1) append/evict/lookup); snapshots as plain deep-frozen JSON — no structural sharing, no compression; capture is serialize-on-swap, once per paint; parked restore hydrates into a sandboxed renderer instance, never the live processor, with local mutations writing back to the snapshot's data model. Finer detail — store shape, component breakdown, file layout — belongs to the sub-task plans.

## Invariants

- Snapshot content immutability is enforced (deep-frozen), not promised.
- The live registry is exactly what the agent may see: the head's stage plus at most one overlay, regardless of what the user is viewing. Parked sandboxes are outside it. (Reworded by task 8.4.)
- A paint that fails validation or is canceled never reaches the stage and never enters the timeline.
- Nothing in the shell is triage-specific; the agent remains a general GitHub agent.
- Read-only against live GitHub; the confirm boundary per `SPEC.md` §3.

## Open items

Deferred to sub-task grills/plans, flagged during the grill: the title carrier mechanism; how the client recognizes a question paint; the fork-context carrier on the wire; palette summon mechanics; the ring cap's N; the arc script and glue prompts; the chat page's final disposition at wrap-up. The phase-spec understanding session (8.0) may amend this spec.
