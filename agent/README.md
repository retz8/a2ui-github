# agent/ — Deterministic A2A server

uv-managed Python project (outside the yarn workspaces). Hosts `deterministic_agent/`:
a canned-response A2A server that closes the Phase 2 event round-trip without an LLM.
A second module slot, `a2ui_github_agent/`, is reserved for the Phase 5 real agent.

## Setup

```bash
uv sync
```

## Test

```bash
uv run pytest
```

## Run the server (manual / Phase 2.5)

```bash
uv run python -m deterministic_agent --host localhost --port 10002
```
