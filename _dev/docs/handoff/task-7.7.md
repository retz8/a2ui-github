# Handoff — task 7.7 (beat-by-beat verification)

Spec: `_dev/docs/spec/task-7.7-beat-verification.md`. Full round-by-round record with screenshots:
`_dev/docs/beat-verification.md` — read that for detail; this file is the state of play.

## Where things stand

| Beat | State |
|---|---|
| 1 — PR review queue | **approved** (R4), folded into `agent/knowledge/examples/pr-review-queue.json` |
| 2 — PR detail | **closed at R8, accepted with known defects — not rubric-approved** |
| 3–8 | not started |

Spend: ~19 live turns of the ~30 budgeted. Everything committed on `main`; tree clean;
`uv run pytest` green (186), `yarn format:check` green. The yarn workspaces were not touched this
session, so `verify:all` is unaffected — but re-run it before any claim of repo-wide green.

## The frame changed mid-task — read this before writing any prompt lever

The prompt had accumulated a **screen definition** (`SCOPE_DESCRIPTION`: "a pull-request detail
carries all seven of…"), added as beat 2's round-3 lever. That is an expert system and contradicts
`SPEC.md` §1. It was deleted outright and replaced by a new 7.1 artifact,
`agent/knowledge/github-domain.md` — GitHub facts and the decisions that hinge on them, never what a
screen contains.

**A defect is not fixed by telling the agent what to render.** It is fixed by giving it the domain
fact it was missing, or it is not fixed by prose at all. The reframe is proven: with the
prescriptive rules gone, the agent stated branch direction correctly, synthesised a merge verdict
from the three gates unprompted, split reviewers by verdict, and rendered a contributor checklist as
`disabled` unchecked boxes — all things nothing told it to do.

The three knowledge artifacts and their charters, which must not bleed into each other:

- `brand-guidance.md` — imperative; how to build in Primer. No domain content.
- `github-domain.md` — declarative; what the objects are. No screen content.
- `examples/` — composition idioms. Only **approved** beat surfaces are ever folded in.

## Next action

**Beat 3** (compose-and-confirm review, follows beat 2) or the structural fix below. Beat 3 is the
one that proves the local-function mechanism end to end, and R6–R8 already produced a working
compose-and-confirm surface, so its ground is prepared.

## The open lever — structural, not prose

Beat 2's surviving defect: the surface states a merge state and check outcome the API contradicts
(verified live at R8 — `mergeable_state: unstable`, while the surface claimed "out of date" and
"all checks passed"). **Two distinct prose levers failed on it** (R6/R7 on the semantics of check
conclusions, R8 on the authoritative field), so decision 6 forbids a third.

What remains is shaping what the tool hands back — a resolved merge verdict and check tally rather
than raw runs the model re-derives from. That is a code change in `llm_agent`, and it plausibly
serves beats 4–8 too, since every list beat also re-derives state from raw payloads.

**The failure mode to remember:** enumerating the five `mergeable_state` values handed the model a
menu to pick from rather than a field to read. Naming a field's possible values is not the same as
making it read the field, and can actively license invention.

## Operational notes

- **Model.** `gemini-3.5-flash` (committed default). Beats 1 and 2 are on it. A downward probe on
  `gemini-2.5-flash` (R4) was far worse — 3m24s to first token, `MAX_TOKENS` on attempt 1, three
  elements lost. Do not use it. Decision 9's ladder goes *up* a tier, never down.
- **Restart the agent after any prompt or knowledge edit** — the prompt is assembled at startup.
- **A lost send looks like a silent agent.** Confirm the text is in the box before submitting; an
  empty transcript is not evidence of agent failure. This bit twice this session.
- Localhost throughout (decision 14): agent `:10003`, client `VITE_A2A_SERVER_URL` pointed at it.
- Verify factual claims against `api.github.com` directly rather than trusting the surface — that is
  what caught R8's false merge state.

## Open threads (none block beat 3)

- **`TimelineAvatar` clipped at the surface's left edge** — three compounding layers, only one of
  them the component; full diagnosis in `deferred-catalog-work.md`. Second instance of a real-layout
  defect jsdom cannot see, alongside `UnderlineNav`. Both become catchable in the client's Playwright
  layer; worth doing as one scoped piece of work.
- **Surface width is a stopgap.** `.chat-surface-turn` escapes the 768px transcript. Its
  `overflow-x: auto` is what turns the avatar overflow into a clip. Phase 8's canvas supersedes it.
- **Client data-model growth**: one reading, 2095 B for 1 surface (beat 1). Not captured for beat 2 —
  console tracking started after the sends. Keep recording per beat.
