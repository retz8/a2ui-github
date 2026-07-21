# agent/ — A2A servers (deterministic + live)

uv-managed Python project (outside the yarn workspaces). Hosts two sibling agent
packages that share one venv and one test run:

- `deterministic_agent/` — a canned-response A2A server that closes the Phase 2 event
  round-trip without an LLM (and a permanent token-free local-test harness).
- `llm_agent/` — the Phase 7 live LLM agent: it turns a natural-language prompt into a
  streamed, catalog-valid, data-bound A2UI surface (Gemini via Google ADK). Ships with a
  stub read-only PR toolset (`llm_agent/tools.py`) so its definition of done — prompt →
  tool call → data-bound valid surface — is met before the GitHub MCP wiring (7.3).

Catalog locate/load is shared by both agents in `catalog_common/`; validation semantics
stay per-agent (deterministic: non-strict partial probe; live: strict complete-surface).

## Setup

```bash
uv sync
```

## Test

```bash
uv run pytest
```

Tests are L0 (zero LLM calls): prompt-assembly snapshot, validator, and the executor
against a faked model stream. No `GOOGLE_API_KEY` is needed to run the suite.

## Run the deterministic server (manual / Phase 2.5)

```bash
uv run python -m deterministic_agent --host localhost --port 10002
```

## Run the live agent (Phase 7)

Copy `.env.example` to `.env` and set `MODEL_NAME` (a Gemini model; cheap tier by
default) and `GOOGLE_API_KEY` (Google AI Studio). Then:

```bash
uv run python -m llm_agent --host localhost --port 10003 --base-url <tunnel-url>
```

Set `--base-url` to the agent's public tunnel URL when the client reaches it through a
dev tunnel (see the repo `CLAUDE.md`, "Local testing in a tunnel environment"); it
defaults to `http://<host>:<port>`.
