# Phase 7 — Agent

The phase that ships the live LLM agent generating A2UI surfaces from the Primer catalog against
live GitHub, demoed on `a2ui-project/a2ui`. Parent: `_dev/TODO.md` Phase 7; SPEC.md §§1–5 (thesis,
interaction architecture, demo, catalog, transport & topology).

## Scope

- A live agent — real LLM, the full Phase-6 catalog, real GitHub data via MCP — that takes a
  natural-language prompt and streams back a valid, rendered surface through the existing client,
  with the event round-trip working (click → agent → new surface).
  The agent's reach is general GitHub — any public repository plus the authenticated user's own
  pull requests, issues, and notifications — with `a2ui-project/a2ui` as the demo subject rather
  than a boundary (task 7.3).
- **Definition of done: "the machine works."** Each of the five demo beats (SPEC §3.1) is driven
  individually through the live stack. The *arc* — the five beats holding together as one session,
  cross-turn context, demo polish — is Phase 8 ("the story works").
- In scope: the agent knowledge artifacts (brand doc + idiom examples), the live agent core, GitHub
  MCP wiring, a minimal chat shell in `client/`, and the layered dev-loop harness.
- The catalog is assumed complete: the full Phase-6 vocabulary (minus its deliberately dropped
  components) is the agent's component surface.
- The agent's short-term "template memory" stays deferred (SPEC §8).

## Locked decisions

### 1. Phase boundary — single-beat capability, verified beat-by-beat

Phase 7 ends when the agent can take *a* prompt and produce a rendered, round-trip-capable surface;
beats are verified in isolation. Multi-turn conversation flow and session-arc behavior belong to
Phase 8 and do not gate this phase.

### 2. System shape

```
        BROWSER — http://localhost:<client port>
┌──────────────────────────────────────────────────────────────┐
│  client/  (Vite + React 19)                                  │
│  ┌────────────────────────────────────────────────────────┐  │
│  │ Chat shell (prompt box + surface area)                 │  │
│  ├────────────────────────────────────────────────────────┤  │
│  │ @a2ui/react   MessageProcessor ──► A2uiSurface         │  │
│  │ primer-a2ui-adapter  catalog (full Phase-6 set)        │  │
│  │   + local functions (demand-driven)                    │  │
│  │ @primer/react  ThemeProvider + BaseStyles              │  │
│  ├────────────────────────────────────────────────────────┤  │
│  │ A2A client middleware (actionHandler)                  │  │
│  └───────────────────────────┬────────────────────────────┘  │
└──────────────────────────────┼───────────────────────────────┘
            A2A JSON-RPC + SSE │ http://localhost:<agent port>
┌──────────────────────────────▼───────────────────────────────┐
│  agent/  (Python, uv) — A2AStarletteApplication              │
│  AgentCard: a2ui extension, v0.9.1 only, our catalogId       │
│  ┌────────────────────────────────────────────────────────┐  │
│  │ Executor: activate a2ui extension ─► single ADK Runner │  │
│  │   (in-memory session/artifact/memory services)         │  │
│  │ LlmAgent                                               │  │
│  │   system prompt = role + workflow                      │  │
│  │     + ui_description ◄── brand-knowledge doc           │  │
│  │     + full catalog.json schema                         │  │
│  │     + curated idiom examples                           │  │
│  │   tools = [ stub data tool | GitHub MCP toolset ]      │  │
│  │ A2uiStreamParser (incremental heal + stream)           │  │
│  │ Catalog validator + retry loop                         │  │
│  └───────┬───────────────────────────────┬────────────────┘  │
└──────────┼───────────────────────────────┼───────────────────┘
           │ Gemini API                    │ MCP (streamable HTTP)
           ▼                               ▼
   Gemini (model = env knob)        GitHub remote MCP server
   provider-side prompt cache       read-only fine-grained PAT
   (implicit; long shared prefix)   toolsets scoped to demo reads
                                           │
                                           ▼
                              GitHub: a2ui-project/a2ui (live, read-only)

  Dev-loop sidecar:  L0 no-LLM tests (prompt snapshot, validator,
                        faked-stream executor)
                     L1 recorded replays
                     L2 budgeted scenario runner (5 beats)
```

The Phase-2 deterministic canned-fixture agent is **not replaced** — the live LLM agent is a
sibling beside it. The deterministic agent remains the test target for the catalog-authoring
workflow and future component additions.

> **Dev-environment note:** the diagram shows `localhost`, the common case. In the tunnel
> environment (see `CLAUDE.md` §Local testing in a tunnel environment), every browser-facing URL is
> the dev-tunnel URL of the corresponding port — the client's agent URL and the agent's advertised
> `--base-url` — with the forwarded ports set to public.

### 3. Agent skeleton — official sample architecture, simplified to one client

Adopt the `restaurant_finder` / `a2ui-agent-sdk` architecture from the official repo: schema
manager over our hosted `catalog.json`, generated system prompt, ADK `LlmAgent`, incremental
stream parser, catalog-validate-and-retry executor loop, a2ui extension negotiation on the agent
card. Simplifications: **v0.9.1 only** (single schema manager, single runner), and **no text-only
fallback runner** — this agent serves only our client; a text fallback is added later only if
really needed. Model: Gemini via ADK-native, with the model name as an env knob.

### 4. Catalog conformance — full schema injection

The full catalog schema is injected into the system prompt on every request. No
`allowed_components` pruning in Phase 7 — that lever is revisited only if a real quality or
latency problem appears during Phase 7 or 8.

### 5. Few-shot examples — idiom role, GitHub domain, no template mandates

A small curated set of complete, catalog-validated A2UI screens in the GitHub domain, injected as
few-shot examples. They demonstrate the mechanics and visual language — how screens are composed,
bound, and wired — and the prompt contains **no** "for intent X you must use example Y" rules; the
agent composes each screen itself. The existing per-component client fixtures are the baseline
material for curation, supplemented by research through the official Primer site.

### 6. Brand knowledge — checked-in distillation, injected at prompt assembly

A prose knowledge doc in `agent/`, distilled from the official Primer guidance pages and injected
into the `ui_description` prompt slot. Scope is brand-wise / cross-component guidance only —
per-component semantics already live in the catalog descriptions. Triage-domain knowledge (what
"maintainer's morning" surfaces show) belongs to the agent's own prompt authoring, not this doc.
Knowledge is baked in at build time — no doc-fetching at generation time (SPEC §4). The brand doc
and the idiom examples are produced by **one combined research/curation sub-task** and are
**living artifacts**, revised through the refinement loop (decision 9).

### 7. GitHub MCP — official remote server, read-only enforced below the prompt

The official `github/github-mcp-server`, remote hosted variant, plugged into the `LlmAgent` as an
ADK MCP toolset over streamable HTTP. Read-only is enforced twice and independently: the server's
read-only endpoint, so write tools never enter the tool inventory, and a fine-grained PAT carrying
no write permission. Both are required — the `pull_requests` toolset ships write tools in its
unrestricted form, including a review-write tool, which is exactly the capability beat 5 must
structurally lack. Toolsets are pinned explicitly rather than inherited from the server default or
requested as "all", keeping the tool surface reviewable and diffable instead of drifting with the
server's release schedule. The stub toolset is retained behind an environment switch that defaults
to MCP; a missing token fails fast rather than falling back silently. Full wiring is settled in
`_dev/docs/spec/task-7.3-github-mcp-wiring.md`.

### 8. Local functions — lazy, demand-driven growth

Functions are added to the catalog only as Phase-7 flows bind them; the concrete list is decided at
task level. Beat 5 (compose-and-confirm) must genuinely exercise client-side validation, proving
the local-function mechanism end-to-end.

*(The naming here is stale: the compose beat is 3, not 5 — `SPEC.md` §3.1.)*

#### Resolved — the concrete list, after 7.9 and 7.7

**Nineteen functions ship**, in two groups:

| Origin | Functions |
|---|---|
| Hand-rolled (Phase 2, then demand-driven) | `consoleLog`, `windowAlert`, `clearValue`, `countSelected`, `setBoolean` |
| Adopted from the basic catalog (7.9) | `required`, `regex`, `length`, `numeric`, `email`, `formatString`, `formatNumber`, `formatCurrency`, `formatDate`, `pluralize`, `openUrl`, `and`, `or`, `not` |

The 11 operators `web_core` implements but the basic catalog does not declare stay deferred (task
7.9 decision 2).

**Phase 7 added none.** That is the answer to this decision rather than a gap in it: the growth was
demand-driven, and across all eight beats the demand never exceeded the adopted set. 7.9 front-loaded
the adoption specifically so the emit surface would be stable before beat verification began, and it
turned out to cover every affordance the beats reached for.

**Exercised live:** `clearValue`, `required` and `not` — beat 3 proved the mechanism end-to-end, with
`disabled: not(required(/reviewBody))` blocking an empty submit and **no agent turn produced**; beats
2 and 5 reproduce the same gate on their comment boxes. `openUrl` appears on beat 6, correctly
limited to genuinely external destinations.

**Never exercised by any beat:** `consoleLog`, `countSelected`, `setBoolean`, `regex`, `length`,
`numeric`, `email`, `formatString`, `formatNumber`, `formatCurrency`, `formatDate`, `pluralize`,
`and`, `or`. They are not dead — they are the vocabulary a compose-heavy flow would reach for — but
nothing in this phase's read-only surface needed them.

Two observations for Phase 8, recorded rather than acted on:

- **`windowAlert` earns its keep negatively.** Its only appearances in the verification record are
  defects: beat 6 wired a Star button to a `windowAlert` announcing an action that never happened.
  A function whose natural use is to *claim* something invites claiming something false, and the
  agent took that invitation three rounds running. Worth reconsidering whether it belongs in an
  agent-facing catalog at all.
- **`setBoolean` is the missing half of expand/collapse.** Beat 6's tree bound `expanded` to a data
  path but wired no action to toggle it, so the affordance renders and does nothing. The function to
  drive it already exists; nothing has ever bound it.

### 9. Dev loop — three cost layers, refinement built in

- **L0 — zero LLM calls (default loop):** prompt-assembly snapshot tests, validator tests,
  executor tests against a faked LLM stream, examples validated against the catalog schema.
- **L1 — record-and-replay:** real sessions captured once into replayable canned streams (the
  official `record_scenario` pattern) so client/integration work needs no live calls.
- **L2 — budgeted live runs:** an on-demand scenario runner with the five beats as scenarios;
  cheap model by default, the real model for final passes.

Scoring adopts the official eval framework's stages 1–2 only: structural validation (parse + fix +
catalog-validate) and cheap programmatic semantic assertions per beat. No LLM-as-judge — quality
judgment is the human eye on rendered surfaces. No formal eval framework; a simple scenario runner
suffices. The refinement cycle: observe at L2 → fix prompt/examples/brand doc → verify at L0 →
re-run the affected scenario.

### 10. No new infrastructure layers

No response cache, no data cache, no persistent session store. Prompt caching is provider-side
(implicit prefix caching on the long shared system prompt) — configuration, not architecture.
Sessions are in-memory (the sample default). The seams stay configurable — model, caching mode,
session service — so a future hardening pass swaps them without redesign.

### 11. Sub-task decomposition

Handles are non-restrictive — each sub-task's scope is settled in its own grill.

- **7.1 — Agent knowledge curation:** the combined research task — Primer-guidance brand doc +
  curated GitHub-domain idiom examples (catalog-validated).
- **7.2 — Live agent core:** the new LLM agent alongside the deterministic one — schema manager,
  prompt assembly wired to 7.1, ADK `LlmAgent` (model knob), stream parser, validator + retry,
  single-version card; L0 tests included. Ships with a **stub data tool** returning canned
  real-shaped PR fixture data, so its definition of done is "prompt → tool call → data-bound valid
  surface" before MCP exists.
- **7.3 — GitHub MCP wiring:** re-point the proven tool→surface path from the stub to the remote
  read-only MCP toolset; proven by a live-data surface.
- **7.4 — Client chat shell:** minimal prompt box + surface area over the existing A2A middleware;
  verifiable against the deterministic agent.
- **7.5 — Record/replay harness (L1).**
- **7.6 — Scenario runner (L2):** the five beats as scenarios, structural validation + per-beat
  semantic assertions, cheap-model default.
- **7.7 — Beat-by-beat verification and refinement:** drive each beat through the live stack and
  **iterate on the 7.1 artifacts until the beats pass** — the observe→fix→re-run loop is this
  sub-task's working method. Demand-driven local functions grow here (beat 5 proves the
  mechanism). The phase's definition of done lives here.

Order: 7.1 ∥ 7.4 from the start · 7.2 after 7.1 · 7.3 after 7.2 · 7.5 ∥ 7.6 after 7.3 · 7.7 last.

### 12. Named risks

- **Attention dilution at full-catalog scale** — the model may select poorly among the full
  vocabulary. Sanctioned response: the examples/brand-doc levers first; `allowed_components`
  pruning only if it measurably bites (decision 4).
- **MCP result bloat** — GitHub API responses are large; toolset scoping mitigates, and 7.3 owns
  further handling if it bites.

## Invariants

- **Read-only against the live repo is structural, not behavioral** — no write tool exists
  anywhere in the agent (token, toolset, and tool inventory all read-only).
- **No live doc-fetching at generation time** — all Primer knowledge is baked in at build time
  (SPEC §4).
- The catalog is the fixed component surface; the agent composes, never invents, components
  (SPEC §1).

## Open items

Deferred to their own task-level grills: agent/deterministic-executor cohabitation layout in
`agent/` (7.2), ~~the concrete local-function list (7.7)~~ — **answered under decision 8** —
examples count and contents (7.1), and
explicit provider-side context caching as an optimization. A text-only fallback runner is
future-if-needed. Template memory remains deferred per SPEC §8.
