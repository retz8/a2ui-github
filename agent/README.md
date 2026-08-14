# agent/ — A2A servers (deterministic + live)

uv-managed Python project (outside the yarn workspaces). Hosts two sibling agent
packages that share one venv and one test run:

- `deterministic_agent/` — a canned-response A2A server that closes the Phase 2 event
  round-trip without an LLM (and a permanent token-free local-test harness).
- `llm_agent/` — the Phase 7 live LLM agent: it turns a natural-language prompt into a
  streamed, catalog-valid, data-bound A2UI surface (Gemini via Google ADK). Reads live
  GitHub through the official remote GitHub MCP server (read-only). A stub
  toolset (`llm_agent/tools.py`) remains available behind `TOOL_BACKEND=stub` for work
  that should not consume GitHub call allowance.

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
default), `GOOGLE_API_KEY` (Google AI Studio), and `GITHUB_MCP_PAT` (a fine-grained
GitHub PAT with read-only access to public repositories). The agent fails to start
if `GITHUB_MCP_PAT` is missing while `TOOL_BACKEND` is `mcp` (the default); set
`TOOL_BACKEND=stub` to run against canned fixture data instead. Then:

```bash
uv run python -m llm_agent --host localhost --port 10003 --base-url <tunnel-url>
```

Set `--base-url` to the agent's public tunnel URL when the client reaches it through a
dev tunnel (see the repo `CLAUDE.md`, "Local testing in a tunnel environment"); it
defaults to `http://<host>:<port>`.

## Record beat fixtures (Phase 8)

`recordings/beats/*.json` holds one live run of each of the eight beats, kept as the
batch sequence it streamed as. The canvas shell's verification replays them, so that
work needs no LLM calls. They are recorded headlessly — no browser and no tunnel, since
the driver runs on the same machine as the agent.

`A2UI_RECORD_DIR` arms the recorder; unset, the agent behaves identically and writes
nothing. The model is fixed when the agent starts, so a beat that needs a different rung
of the ladder is recorded against a separately-started agent:

```bash
# default rung
A2UI_RECORD_DIR=.recordings uv run python -m llm_agent --host localhost --port 10003
uv run python scripts/record_beats.py --beats 1,4,5,7,8 --model gemini-3.5-flash

# stronger rung
MODEL_NAME=gemini-3.1-pro-preview A2UI_RECORD_DIR=.recordings \
  uv run python -m llm_agent --host localhost --port 10003
uv run python scripts/record_beats.py --beats 2,3,6 --model gemini-3.1-pro-preview
```

The driver retries a beat that fails to paint, then records best-available and flags it
in its summary. Beat 3 is defined as a follow-up to beat 2, so asking for it drives both
in one conversation. `.recordings/` is the raw per-conversation output and is gitignored;
only the finalized per-beat fixtures are tracked.
