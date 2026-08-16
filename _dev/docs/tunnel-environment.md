# Tunnel environment

Development normally runs over a VS Code dev tunnel: the dev machine (home Mac)
runs the servers and the tunnel host, and the browser is on a remote machine
that reaches everything through the tunnel. In that browser, `localhost:<port>`
resolves to the browser's machine — not the dev machine — so **every URL the
browser touches must be a tunnel URL**, including any server URL the app itself
calls (the agent port), not just the page address.

Tunnel URL format: `https://vnw20xbg-<port>.asse.devtunnels.ms`

## Rules

- **Forward the ports and set them Public.** Client `5173`, deterministic agent
  `10002`, live agent `10003`. A private port returns `401` to cross-origin
  fetches (surfaces as a `404`/`502` at the tunnel and `Failed to fetch` in the
  browser).
- **Client:** set `VITE_A2A_SERVER_URL` to the **agent's tunnel URL** so the
  browser reaches the agent (default is `http://localhost:10002`, which the
  remote browser cannot reach).
- **Agent:** run with `--base-url <agent tunnel URL>` so the agent card
  advertises the public endpoint. Its default card URL is
  `http://<host>:<port>` — with that, the card fetch succeeds but the
  `message/send` POST targets an unreachable `localhost` and 404s.
- First visit to each tunnel host shows a one-time "you are connecting to a dev
  tunnel" interstitial — click **Continue**.
- The servers' CORS policy already allows `localhost` and `*.devtunnels.ms`;
  no server-side change is needed.
- **Browser verification (Claude-in-Chrome) always uses tunnel URLs, never
  `localhost`** — the controlled browser is on the remote side.

## Run commands

Live agent + client:

```bash
# Agent — advertise the tunnel URL in its agent card:
cd agent && uv run python -m llm_agent \
  --host localhost --port 10003 \
  --base-url https://vnw20xbg-10003.asse.devtunnels.ms

# Client (separate terminal) — point at the same agent tunnel URL:
VITE_A2A_SERVER_URL=https://vnw20xbg-10003.asse.devtunnels.ms \
  yarn workspace client run dev
```

Deterministic agent + client:

```bash
cd agent && uv run python -m deterministic_agent \
  --host localhost --port 10002 \
  --base-url https://vnw20xbg-10002.asse.devtunnels.ms

VITE_A2A_SERVER_URL=https://vnw20xbg-10002.asse.devtunnels.ms \
  yarn workspace client run dev
```

Recording beat fixtures needs no tunnel — the recorder driver runs on the same
machine as the agent, with no browser involved.
