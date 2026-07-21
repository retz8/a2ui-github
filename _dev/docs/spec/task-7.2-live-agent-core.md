# Task 7.2 — Live agent core

Task-level spec for Phase 7 sub-task 7.2 (`_dev/TODO.md`), settling the scope deferred to its own
grill by `_dev/docs/spec/phase-7-agent.md` (decision 11, open items). The phase spec's locked
decisions (official sample architecture, full-schema injection, v0.9.1 only, no text fallback)
carry over unchanged; this spec adds only what the 7.2 grill locked.

## Scope

- The live LLM agent in `agent/`, a sibling beside the untouched Phase-2 deterministic agent:
  schema manager over the catalog, prompt assembly wired to the 7.1 knowledge artifacts, ADK
  `LlmAgent`, incremental stream parser, catalog validator + retry loop, single-version agent
  card, stub data tool, L0 tests.
- Definition of done: "prompt → tool call → data-bound valid surface" — before any MCP (7.3).

## Locked decisions

### 1. Cohabitation — one uv project, sibling package

The live agent lives in the existing `agent/` uv project as a package beside
`deterministic_agent/`: one `pyproject.toml` (gaining the ADK dependencies), one venv, one test
run. The deterministic agent's code is untouched.

### 2. Package name — `llm_agent`

The sibling package is named `llm_agent`, contrasting on the axis that actually separates the two
agents (deterministic vs. LLM).

### 3. Catalog plumbing — shared locate/load module, per-agent validation semantics

The repo-root locator + `A2uiSchemaManager` construction currently inside
`deterministic_agent/catalog.py` is extracted into a shared module both agents import. Validation
semantics stay per-agent — the fixture-specific `validate_payload` remains with the deterministic
agent; the live agent validates complete surfaces on its own terms.

### 4. Prompt assembly — the SDK's `generate_system_prompt`, as-is

Assembly uses `A2uiSchemaManager.generate_system_prompt` unchanged: the 7.1 brand doc feeds
`ui_description`, `agent/knowledge/examples/` is registered as the catalog's examples path, and
the full catalog schema is included. The only authored prompt content is the role and workflow
strings. Custom assembly is reconsidered only if L2 later shows the SDK framing itself is a
quality problem.

### 5. Stub tool — minimal mirror-shaped toolset, real-shaped canned data

Not one generic demo tool but a minimal stub toolset mirroring the GitHub read surface the beats
need: a PR-list read and a PR-detail read, returning canned JSON captured from the real
`a2ui-project/a2ui` API shapes, trimmed to sane size. Shape fidelity (fields surfaces will bind)
matters more than name fidelity — 7.3 owns exact toolset names.

### 6. Executor semantics — stream-first, validate-at-end, retry-and-restream

The official sample's semantics as-is: parsed parts stream to the client incrementally while the
full response accumulates; the complete payload is validated at the end; on failure the model gets
a retry message carrying the validation error (two attempts total, a tunable constant), and
exhaustion yields a plain-text apology. The brief possibility of invalid partial UI reaching the
client before the retry overwrites it is the accepted tradeoff; revisited only if 7.7 shows it
biting.

### 7. Env knobs — `MODEL_NAME` + `GOOGLE_API_KEY`

A single `MODEL_NAME` env var (no LiteLLM fallback) selects the Gemini model, defaulting to a
cheap tier picked at implementation time; `GOOGLE_API_KEY` auths as ADK expects. Both documented
in an `.env.example`. The same knob later serves 7.6's cheap-by-default / real-model-final-pass
runs.

### 8. DoD verification — L0 automated, one manual live run

Automated tests stay zero-LLM (L0). The task closes with one manual live verification on the
cheap model: a prompt through the 7.4 chat shell to `llm_agent`, the stub tool called, a valid
data-bound surface rendered — via tunnel URLs per `CLAUDE.md`. Scripted live runs belong to 7.6.

### 9. L0 prompt test — hybrid snapshot

The prompt-assembly test pins a golden snapshot of the assembled prompt with the two bulk payloads
(schema render, examples) elided to markers, plus presence assertions for the elided bulk — so
7.7's constant brand-doc/example edits don't churn the snapshot while the stable framing stays
byte-pinned.

## Open items

Deferred to implementation: port, fixture file locations, agent-card metadata, the role/workflow
prompt text, and the exact default model string.
