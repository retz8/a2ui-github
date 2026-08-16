# Tunnel environment

Instead of `localhost:<port>`, use the tunnel URL:
`https://vnw20xbg-<port>.asse.devtunnels.ms`. This applies to every URL the
browser touches — the page address and any server URL the app calls (the agent
port).

This setup is only for Jioh In (@retz8); it does not apply to anyone else
working with this repo.

## Rules

- **Client:** set `VITE_A2A_SERVER_URL` to the **agent's tunnel URL** (its
  default is `http://localhost:10002`, which the remote browser cannot reach).
- **Agent:** run with `--base-url <agent tunnel URL>` so the agent card
  advertises the public endpoint. With the default (`http://<host>:<port>`),
  the card fetch succeeds but the `message/send` POST targets an unreachable
  `localhost` and 404s.
- Ports in play: client `5173`, deterministic agent `10002`, live agent
  `10003`. Jioh forwards them and sets them **Public** manually at the start of
  a session. If you see `Failed to fetch` in the browser (or `401`/`404`/`502`
  at the tunnel), suspect a non-public or unforwarded port before debugging the
  app — ask Jioh to check the port.
- First visit to a tunnel host shows a one-time "you are connecting to a dev
  tunnel" interstitial — click **Continue**.
- The servers' CORS policy already allows `localhost` and `*.devtunnels.ms`;
  no server-side change is needed.
- Claude-in-Chrome always drives tunnel URLs, never `localhost` — the
  controlled browser is on the remote side.

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
