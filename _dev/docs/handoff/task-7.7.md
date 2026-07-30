# Handoff — task 7.7 (beat-by-beat verification)

Spec: `_dev/docs/spec/task-7.7-beat-verification.md`. Full round-by-round record with screenshots:
`_dev/docs/beat-verification.md` — read that for detail; this file is the state of play.

## Where things stand

| Beat | State |
|---|---|
| 1 — PR review queue | **approved** (R4) |
| 2 — PR detail | **closed, accepted with known defects** — not rubric-approved |
| 3 — compose-and-confirm review | **approved** (R2) |
| 4 — issue list, fuzzy intent | **approved** (R1), two flags |
| 5 — issue detail | **approved** (R3) |
| 6 — repository landing | **IN PROGRESS — 5 rounds spent, not approved** |
| 7–8 | not started |

All four shipped examples are beat-derived; the original 7.1 set is fully retired (decision 11's
endpoint). Everything committed on `main`; tree clean. `yarn verify:all` green (adapter 2475, client
549); `uv run pytest` green (**204** — 18 of them the new tool-shaping tests). The turn budget was
explicitly lifted by the user.

## Resume here — beat 6, round 6

R5 is the best surface of the beat: no fabrication anywhere, `openUrl` gone, all eight directories
wired to `open-directory` events carrying their paths, Star/Fork carrying no action rather than a
false one. **Two gaps block approval:**

1. **README content is never fetched** — `get_file_contents` is only ever called on `/`. Sufficiency
   requires README content, and the tree listing it is not that.
2. **`open-file` is still offered on three source files** (`Package.swift`, `package.json`,
   `pyproject.toml`). `README.md` is legitimate — markdown is renderable by decomposition; source is
   not. The "fetchable is not the same as renderable" clause in the directory-listing note landed
   only partially.

Both are ordinary composition problems, unlike the wall below.

## The wall — do not spend more rounds on this

**The model invents a repository description.** Four rounds, four different fabrications, across
three independent mechanisms: a domain-doc fact, a generic payload note, and a named-empty-field
note — **including a round where `"description": null` was present in the payload it had just
requested**. R5 produced no fabrication, but nothing that round targeted it, so treat that as
unearned until repeat runs say otherwise.

The tell: every fabrication describes *our* project's stack ("using Primer", "adaptive UI screens
inside the chat conversation"). That reads as pattern-completion from prompt context, not a gap in
what the agent was told. Record it as a **model finding for Phase 8** rather than levering it again.

Beat 2's merge/check-state defect is the same shape (re-deriving rather than reading) and is likewise
unresolved after two prose levers.

## The frame — read this before writing any lever

The prompt once carried a **screen definition**; it was deleted and replaced by
`agent/knowledge/github-domain.md`. **A defect is not fixed by telling the agent what to render.** It
is fixed by supplying the missing domain fact, by naming a catalog mechanism it had no way to know,
or it is not a prompt problem at all. Four of this task's defects turned out to be **our own
artifacts, our own client, or our own tool layer**:

- beat 2 — a screen definition in the prompt.
- beat 3 — the brand doc pointed at `checks` (absent from this catalog) while denying the validators
  7.9 had shipped. `Button.disabled` is a `DynamicBoolean`, which accepts a function call.
- beat 5 — the decomposition rule mandated `Link` for body references, and `Link` has no action. The
  fix was naming `Button variant="link"`.
- beat 5 R2 — a client crash, not an agent defect (fixed in `b26f8fe`).

Artifact charters, which must not bleed into each other: `brand-guidance.md` imperative,
Primer/catalog mechanics only · `github-domain.md` declarative, domain facts only · `examples/`
composition idioms, only **approved** beat surfaces · `tool_shaping.py` payload truth only — it adds
no GitHub facts and prescribes no screen.

## The tool-shaping layer (new this session)

`agent/llm_agent/tool_shaping.py`, wired through ADK's `after_tool_callback` in `agent.py`. It
annotates MCP payloads with: the fields actually present, the fields returned **empty** named
individually, a directory-listing note (names only, one level deep, fetchable ≠ renderable), and a
**check-run tally** counted from the payload.

- It demonstrably changed tool-calling behaviour: `minimal_output: False`, and splitting
  `is:issue`/`is:pr` into two searches.
- **The check-run tally has never run live** — beat 6 involves no pull request. Its unit tests pass
  against the real 23-run payload (15 success, 8 skipped, zero failing). Exercising it is the natural
  first move when beat 2 is revisited.
- `record_shape()` is env-gated instrumentation (`TOOL_SHAPE_DUMP=1`), off by default, kept because
  the next shaping rule will need the same look at real payloads.
- Payloads can be captured **without spending a turn** by POSTing JSON-RPC `tools/call` straight at
  `https://api.githubcopilot.com/mcp/readonly` with the PAT and `X-MCP-Toolsets` headers.

## Operational notes

- **Model:** `gemini-3.5-flash` (committed default). A downward probe on `gemini-2.5-flash` was far
  worse — 3m24s to first token, `MAX_TOKENS` on attempt 1. Decision 9's ladder goes *up*, never down.
- **Restart the agent after any prompt, knowledge-doc, example or shaping change** — the prompt is
  assembled at startup, and the tool callback is bound then too.
- **Verify factual claims against `api.github.com`.** It caught beat 2 R8's false merge state, beat
  4's rows, and all four of beat 6's fabrications.
- **Driving the composer:** set the value via the native setter + `input` event, then **read it back
  before sending**. Clicking by coordinate is unreliable; a lost send looks exactly like a silent
  agent.
- Localhost throughout (decision 14): agent `:10003`, client `VITE_A2A_SERVER_URL` pointed at it.

## Open threads

- **Real-browser test capability** is the recurring gap — three defects invisible to jsdom
  (`UnderlineNav`, `TimelineAvatar`, the mid-parse render crash). `UnderlineNav` is now confirmed
  **intermittent**, so any Playwright test must assert across repeated mounts, not once. Note
  `client/e2e/` runs against a preview build on `:4173`, not the dev server.
- **Client data-model growth**: 2095 B → 3825 B. Monotonic, as predicted. Keep recording per beat.
- Beat 4 flags: inference narrowed to one label; the prose preamble recurred once.
- `required` accepts whitespace-only input (upstream basic-catalog semantics).
- The task spec's invariant naming "beat 5" is stale numbering for the compose beat (3) — corrected
  in the journal, not yet in the spec.
