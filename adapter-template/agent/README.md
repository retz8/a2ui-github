# agent/ — Deterministic A2A server

uv-managed Python project (outside the yarn workspaces). Hosts
`deterministic_agent/`: a canned-response A2A server that closes the event
round-trip without an LLM — a token-free local test harness. Your real domain
agent lives in a separate module slot alongside it.

<!-- setup & usage prose: authored in 3.2 -->

## Setup

```bash
uv sync
```

## Test

```bash
uv run pytest
```

## Run the server

```bash
uv run python -m deterministic_agent --host localhost --port 10002
```
