# Handoff — task 7.7 (beat-by-beat verification)

Spec: `_dev/docs/spec/task-7.7-beat-verification.md`. Full round-by-round record with screenshots:
`_dev/docs/beat-verification.md` — read that for detail; this file is the state of play.

## Where things stand

| Beat | State |
|---|---|
| 1 — PR review queue | **approved** (R4) |
| 2 — PR detail | **closed at R8, accepted with known defects — not rubric-approved** |
| 3 — compose-and-confirm review | **approved** (R2) |
| 4 — issue list, fuzzy intent | **approved** (R1), two flags |
| 5 — issue detail | **approved** (R3) |
| 6–8 | not started |

**All four shipped examples are now beat-derived** — the original 7.1 set is fully retired, which is
decision 11's endpoint: `pr-review-queue`, `pr-review-compose`, `stalled-issue-list`, `issue-detail`.

Everything committed on `main`; tree clean. `yarn verify:all` green (adapter 2475, client 549);
`uv run pytest` green (186). Turn budget was explicitly lifted by the user.

## The frame — read this before writing any prompt lever

The prompt once carried a **screen definition** (`SCOPE_DESCRIPTION`: "a pull-request detail carries
all seven of…"). That is an expert system and contradicts `SPEC.md` §1. It was deleted and replaced
by `agent/knowledge/github-domain.md` — GitHub facts and the decisions that hinge on them, never what
a screen contains.

**A defect is not fixed by telling the agent what to render.** It is fixed by giving it the domain
fact it was missing, by naming a catalog mechanism it had no way to know, or it is not a prompt
problem at all. Three of this task's defects turned out to be **our own artifacts or our own client**,
not the model:

- beat 2: a screen definition in the prompt.
- beat 3: the brand doc pointed at `checks` (absent from this catalog) and said validators "are added
  on demand… not assumed" a phase after 7.9 shipped fourteen. `Button.disabled` is a `DynamicBoolean`,
  which accepts a function call — the capability was there all along.
- beat 5: the decomposition rule said body links become `Link`, and `Link` has no action. The agent
  had no expressible way to make a body reference an event until `Button variant="link"` was named.

Artifact charters, which must not bleed into each other: `brand-guidance.md` imperative, Primer/catalog
mechanics only · `github-domain.md` declarative, domain facts only · `examples/` composition idioms,
only **approved** beat surfaces.

## Next action

**Beat 6** (repository landing) — self-contained, one turn per round. Its Composition line is the
demanding one: the file tree must be *hierarchical*, and `TreeView` is the catalog's only hierarchical
component.

## Open levers and known defects

- **Beat 2's merge/check state** is the one unresolved rubric failure. Two distinct prose levers
  failed; decision 6 forbids a third. The remaining move is **structural** — shape what the tool hands
  back so the agent receives a resolved merge verdict and check tally rather than raw runs it
  re-derives from. Plausibly helps beats 6–8 too, since every list beat re-derives state from raw
  payloads.
- **Beat 4's inference narrowed to one label**, and the **prose preamble** recurred there once.
- **`required` accepts whitespace-only** input (upstream basic-catalog semantics).
- **Captions/affordances promising a send** the agent cannot perform ("Your feedback is sent directly
  to the author", beat 2 R8's "Update branch").

## Operational notes

- **Model:** `gemini-3.5-flash` (committed default). A downward probe on `gemini-2.5-flash` was far
  worse — 3m24s to first token, `MAX_TOKENS` on attempt 1. Decision 9's ladder goes *up*, never down.
- **Restart the agent after any prompt, knowledge-doc or example change** — the prompt is assembled at
  startup. Confirm the shipped set with `build_system_prompt()` before a round.
- **Verify factual claims against `api.github.com` directly** rather than trusting the surface. That
  caught beat 2 R8's false merge state and confirmed beat 4's rows.
- **Driving the composer:** clicking by coordinate is unreliable (layout shifts, viewport scaling). Set
  the value via the native setter + `input` event, then **read it back before sending**. A lost send
  looks exactly like a silent agent.
- Localhost throughout (decision 14): agent `:10003`, client `VITE_A2A_SERVER_URL` pointed at it.

## Open threads

- **Real-browser test capability is the recurring gap.** Three defects this task were invisible to
  jsdom: `UnderlineNav` empty when nested, `TimelineAvatar` clipping, and the mid-parse render crash.
  The first two are logged in `deferred-catalog-work.md` waiting on exactly this; the client's
  Playwright layer (`client/e2e/`) is where all three become catchable. Note its config runs against a
  **preview build** on `:4173`, not the dev server — a dev-only bug would need the harness pointed at
  `:5173`.
- **Surface width is a stopgap.** `.chat-surface-turn`'s `overflow-x: auto` is what turns the
  `TimelineAvatar` overflow into a clip. Phase 8's canvas supersedes it.
- **Client data-model growth**: 2095 B (beat 1, one surface) → 3825 B (beat 5 chained after beat 4).
  Monotonic, as predicted. Keep recording per beat.
- **The task spec's invariant names "beat 5"** as proving the local-function mechanism; that is stale
  numbering for the compose beat (3). Corrected in the journal, not yet in the spec.
