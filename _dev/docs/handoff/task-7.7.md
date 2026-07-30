# Handoff — task 7.7 (beat-by-beat verification)

Spec: `_dev/docs/spec/task-7.7-beat-verification.md`. Full round-by-round record with screenshots:
`_dev/docs/beat-verification.md` — read that for detail; this file is the state of play.

## Where things stand

| Beat | State |
|---|---|
| 1 — PR review queue | **approved** (R4) |
| 2 — PR detail | **closed, accepted with known defects** |
| 3 — compose-and-confirm review | **approved** (R2) |
| 4 — issue list, fuzzy intent | **approved** (R1), two flags |
| 5 — issue detail | **approved** (R3) |
| 6 — repository landing | **closed, accepted with known defects** (R8 stop) |
| 7 — user profile | **approved** (R6) |
| 8 — viewer-centric, ambiguous scope | **not started** |

On `main`, tree clean, no worktree (decision 15). `uv run pytest` green (**208**). Example set stays
at **four** — nothing folded in from beats 6 or 7.

## Resume here — beat 8

The last beat: *"What needs my attention today?"* Its rubric is already written and approved. It is
the only beat that is **viewer-scoped** — the scope rule must resolve it to the authenticated user
without asking which repository is meant, and `get_me` is the one profile tool that actually works
(see the tool-layer limit below). A thin result is a true result; padding it is the failure.

After beat 8, decision 4 still owes a **confirmation pass**: every beat run once against the shipped
prompt, since folding was incremental and the prompt each beat was verified against is not the final
one. Decision 16's remaining items are that pass, the local-function open item answered in writing,
and repo-wide green.

## The two walls — record, do not lever again

Both are decision-6 stops with levers already spent, and both are Phase-8 model findings.

1. **Fabrication into a gap.** Seven rounds across beats 6 and 7. An absent or unreachable field gets
   filled with something plausible; the tell is that it pattern-completes toward context (our stack,
   Google-adjacent employers). Survived a lever that named the field outright.
2. **Prose responds backwards.** Beat 7 R3/R4/R5: no rule → prose; general rule → more prose;
   *stronger* general rule → most prose (three blocks became seven). The only clean round carried a
   beat-specific enumeration that must not ship.

**Resolved by decision, not by fixing:** composed prose is now **accepted where fact-based**, and
ROLE's provenance rule was softened to match. Judgement words ("core", "prominent") and rewritten
descriptions still slip through that softened rule.

## The lesson that keeps paying — check our own artifacts first

**Five of this task's defects were ours, not the model's.** Beat 2 a screen definition in the prompt;
beat 3 a brand doc pointing at an absent component; beat 5 a decomposition rule mandating `Link`,
which has no action; beat 5 R2 a client crash; and beat 7's action context — **all four shipped
examples carried a bare `{"number": ...}`**, and the agent copied them verbatim, component ids
included, while three prompt levers argued with them. Examples beat prose. When a lever fails twice,
audit the artifact before writing a third.

Artifact charters, which must not bleed: `brand-guidance.md` imperative, Primer/catalog mechanics ·
`github-domain.md` declarative, domain facts · `examples/` composition idioms, approved surfaces only
· `tool_shaping.py` **payload truth only** · ROLE/WORKFLOW how to draw with A2UI. **The prompt stays
general** — it must never enumerate what one tool returns for one beat; that belongs in the tool
layer, which serves every beat at once.

## Tool-layer limits found by direct probe (zero LLM turns)

Capture payloads by POSTing JSON-RPC `tools/call` at `https://api.githubcopilot.com/mcp/readonly`
with the PAT and `X-MCP-Toolsets` headers — this is how both findings below were made.

- **28 tools, and no third-party user-profile tool** — only `get_me`. `search_users` returns four
  fields (`avatar_url`, `id`, `login`, `profile_url`). A person's name, bio, company, location and
  counts are **unreachable**, which makes beat 7's "following-scale signal" unmeetable as written.
- `search_repositories` and `search_pull_requests` return full items including `description` and
  `body`; a user's repositories are reachable via a `user:<login>` query.
- `tool_shaping.py` now reports `item_fields_present` — what a payload's *entries* carry, distinct
  from the envelope. The **check-run tally has still never run live** (no beat since involved a pull
  request); its unit tests pass against a real 23-run payload.

## Model

`gemini-3.5-flash`, and **decision 9 was amended this session** to name it as the default and the
model the demo runs on. Adopting `-lite` to test the other direction collapsed beat 6 — one tool
call, no README, no tree, zero affordances, an invented description — so it is below this task's
floor and `.env.example` now warns against it. `gemini-3.1-pro-preview` is the ladder's **sole
remaining rung**, and R9 of beat 6 already spent it once.

## Operational notes

- **Restart the agent after any prompt, knowledge-doc, example or shaping change** — the prompt is
  assembled at startup and the tool callback bound then.
- **Verify every factual claim against `api.github.com`.** It caught the fabricated location and
  company, the `flutter/flutter` commit misattribution, the null-language inventions, and a
  live-changing issue count (290 → 291 mid-session) that would otherwise have read as a defect.
- **Driving the composer:** set the value via the native setter + `input` event, then read it back
  before sending. Clicking by coordinate is unreliable.
- Localhost throughout (decision 14): agent `:10003`, client `VITE_A2A_SERVER_URL` pointed at it.
- Audit a surface's actions off the React fiber: walk **up** from DOM nodes (depth ~25) collecting
  `componentModel`; walking down from the root returns nothing.

## Open threads

- **Beat 6's model finding, corrected by beat 7:** flash templates a *uniform* collection fine (beat
  7 did it on the first round). It failed specifically on the mixed directory/file tree whose rows
  differ by an **enum-typed icon** — the case where "an enum property cannot vary per row" forces
  unrolling. Pro applies "one template per row shape"; flash does not.
- **Repository actions bind a bare name, no owner.** The examples carry no repository-list idiom, so
  there is nothing to copy — the same mechanism as the number/repository fix, still open.
- Real-browser test capability remains the recurring gap; `UnderlineNav` is confirmed intermittent,
  so any Playwright test must assert across repeated mounts.
- Client data-model sizes this session: beat 6 ranged 43 B (unrolled, unbound) to 453 B (pro,
  templated); beat 7 reached 2391 B. Binding raises it; unrolling drives it to nothing.
- Beat 4 flags: inference narrowed to one label; the prose preamble recurred once.
- `required` accepts whitespace-only input (upstream basic-catalog semantics).
- The task spec's invariant naming "beat 5" is stale numbering for the compose beat (3) — corrected
  in the journal, not yet in the spec.
