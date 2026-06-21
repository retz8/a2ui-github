# client

The thin React + [Primer](https://primer.style/) demo app that renders A2UI surfaces through
[`primer-a2ui-adapter`](../primer-a2ui-adapter) and round-trips Button `event` actions to the
deterministic A2A server in [`agent/`](../agent).

The fixture-driven test space is a **dev oracle**: known-good A2UI loaded locally, so no LLM is
involved during development. `functionCall` actions run locally; `event` actions go over A2A to the
server and the response feeds back into the same processor to re-render.

## Commands

```bash
yarn workspace client run dev        # vite dev server
yarn workspace client run build      # tsc --noEmit && vite build
yarn workspace client run typecheck
yarn workspace client run test       # vitest (jsdom + RTL)
yarn workspace client run test:e2e   # playwright visual regression
```

## A2A server URL

The client sends `event` actions to `VITE_A2A_SERVER_URL` (default `http://localhost:10002`):

```bash
VITE_A2A_SERVER_URL=http://localhost:10002 yarn workspace client run dev
```

### Over a VS Code dev tunnel

When the browser reaches the app through a tunnel (not the same machine as the servers),
`localhost` resolves to the browser's machine, not the server host. The client **and** the agent
card must both use the tunnel URL — otherwise the card resolves but its advertised `message/send`
endpoint points at an unreachable `localhost` (you'll see the card fetch succeed, then a `404` on
`localhost`). Forward ports `5173` (client) and `10002` (agent) and set both to **Public** visibility
(a private port returns `401` to cross-origin fetches).

```bash
# Agent — advertise the tunnel URL in its agent card (not localhost):
cd agent && uv run python -m deterministic_agent \
  --host localhost --port 10002 \
  --base-url https://vnw20xbg-10002.asse.devtunnels.ms

# Client (separate terminal) — point at the same agent tunnel URL:
VITE_A2A_SERVER_URL=https://vnw20xbg-10002.asse.devtunnels.ms \
  yarn workspace client run dev
```

First visit to each tunnel host shows a one-time "you are connecting to a dev tunnel" interstitial —
click **Continue**. The server's CORS policy already allows `localhost` and `*.devtunnels.ms`.

## Manual round-trip verification (not in CI)

Closes the genuine FE↔server `event` round-trip. CI covers marshalling/extraction and re-render
reactivity with the transport mocked; this confirms the real wire.

1. Start the deterministic server: `cd agent && uv run python -m deterministic_agent --host localhost --port 10002`.
2. Start the client: `yarn workspace client run dev`, open it, select the **button-event** fixture.
3. **Re-render:** click **Send event** → the label flips to `✅ Sent — server received submit` and
   the button becomes disabled. (Confirm live in Claude Chrome with before/after screenshots.)
4. **Wire confirmed:** the request actually hit the Python server — verify via the server log or a
   `message/send` POST to `:10002` in the browser Network panel (not just the UI changing).
5. **Failure path:** stop the server and click again → the console logs `[A2UI:a2a]` with the error
   and the UI stays put (no throw).
