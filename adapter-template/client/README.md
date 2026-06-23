# client

A thin React + {{Library}} app that renders A2UI surfaces through
[`{{adapterPkg}}`](../{{adapterPkg}}) and round-trips `event` actions to the
deterministic A2A server in [`agent/`](../agent).

The fixture-driven test space is a **dev oracle**: known-good A2UI loaded locally,
so no LLM is involved during development. `functionCall` actions run locally;
`event` actions go over A2A to the server and the response feeds back into the
same processor to re-render.

The app shell wraps the surface in {{Library}}'s theme/base-styles provider so catalog components
render with the design system's tokens; consult {{Library}}'s docs for the exact provider setup.
Pick a fixture in the test space to load a known-good A2UI message into the processor.

## Commands

```bash
yarn workspace client run dev        # vite dev server
yarn workspace client run build
yarn workspace client run typecheck
yarn workspace client run test       # vitest (jsdom + RTL)
yarn workspace client run test:e2e   # playwright smoke
```

## A2A server URL

The client sends `event` actions to `VITE_A2A_SERVER_URL` (default
`http://localhost:10002`).
