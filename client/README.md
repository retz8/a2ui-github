# client

The React + [Primer](https://primer.style/) app that renders A2UI surfaces
through [`primer-a2ui-adapter`](../primer-a2ui-adapter) and talks A2A to the
agents in [`agent/`](../agent). Its primary interface is the **canvas shell**
driven by the live LLM agent: language in, full-screen generative UI out.

## Pages

| Page | What it is | Needs a server? |
| --- | --- | --- |
| `index.html` (default) | The **canvas shell** — the canvas-first generative-UI interface. Concepts and internals: [`src/canvas/README.md`](src/canvas/README.md). | live agent |
| `chat.html` | The **chat client** — a conventional chat interface over the same agent and transport, for trying the GitHub agent through chat. | live agent |
| `dev.html` | The **fixture dev space** — known-good A2UI fixtures loaded locally, one per catalog scenario; the render-correctness oracle. | no |
| `examples.html` | The **examples showcase** — renders the agent's curated knowledge examples (`agent/knowledge/examples/*.json`), selected by dropdown or `?example=`. | no |

## Running

```bash
yarn workspace client run dev        # vite dev server (5173)
```

The canvas and chat pages send to `VITE_A2A_SERVER_URL` (default
`http://localhost:10002`, the deterministic agent's port). To drive the live
agent, start it per [`agent/README.md`](../agent/README.md) and point the
client at it:

```bash
VITE_A2A_SERVER_URL=http://localhost:10003 yarn workspace client run dev
```

`dev.html` and `examples.html` are server-independent — `functionCall` actions
run locally in both; `event` actions go over the wire only where a server is
wired.

## Working without the LLM

Three no-LLM paths cover most development:

- **Fixtures** (`dev.html`): hand-authored known-good A2UI per catalog
  scenario, in `src/fixtures/`.
- **Beat replay** (`index.html?beat=N[,M…]`, `&instant` to skip pacing):
  replays recorded live-agent streams (`agent/recordings/beats/*.json`)
  through the full canvas turn lifecycle — real agent output, zero tokens.
  Re-recording them is documented in `agent/README.md`.
- **Examples showcase** (`examples.html`): the curated agent knowledge
  examples rendered through the same pipeline.

## Source map

```
src/
  canvas/          the canvas shell — has its own README
  chat/            the chat client page
  a2a/             the A2A transport both pages consume: agent-card resolution,
                   session, streaming send, action handler, and the canvas's
                   wire additions (paintMeta, fork context — see the canvas README)
  a2ui/            applying streamed A2UI message batches to a processor
  beats/           bundling + parsing the recorded beat fixtures
  fixtures/        known-good A2UI fixtures for the dev space
  test-space/      the dev-space UI (fixture picker + view)
  examples-space/  the examples-showcase UI
  shared/          cross-page helpers (action/error describers, error boundary)
```

## Commands

```bash
yarn workspace client run dev        # vite dev server
yarn workspace client run build      # tsc --noEmit && vite build
yarn workspace client run typecheck
yarn workspace client run test       # vitest (jsdom + RTL)
yarn workspace client run test:e2e   # playwright visual regression (builds the adapter first)
```

Playwright snapshots are the visual-regression baselines for the fixture set;
`test:e2e` rebuilds `primer-a2ui-adapter` before running so the baselines see
the current catalog.
