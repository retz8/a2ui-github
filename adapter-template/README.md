# a2ui-app

A downstream consumer of the [A2UI](https://github.com/a2ui-project/a2ui) protocol, exploring
generative UI for {{Domain}}: an agent composes live UI from a curated {{Library}}
component catalog instead of a hand-built frontend.

The repository is a polyglot monorepo:

- **`{{adapterPkg}}/`** — the publishable A2UI catalog/adapter mapping A2UI components to {{Library}}
  React wrappers, built over [`@a2ui/react`](https://www.npmjs.com/package/@a2ui/react).
- **`client/`** — a thin React + {{Library}} demo app that renders A2UI surfaces through the adapter.
- **`agent/`** — a Python (uv) deterministic A2A server that closes the `event` round-trip without an
  LLM — a token-free local test harness. The real domain agent lives in a separate slot alongside it.

> 🚧 **In active development.** APIs, structure, and catalog contents are still moving.

## First: materialize this template

This repo is an **unfilled template** — it carries placeholder tokens and an `init` skill that
turns it into a real A2UI app. On a fresh clone, run the **`init` skill** (it collects 8 values,
interviews you for the demo, fills every placeholder via `fill.mjs`, optionally installs the
daily-work harness, then self-deletes). Do this **before** the build steps below.

## Getting started

The TypeScript workspaces use **Yarn 4** (via [corepack](https://nodejs.org/api/corepack.html)):

```bash
corepack enable
yarn install
```

Root scripts orchestrate the whole repo in dependency order:

```bash
yarn build:all      # build every workspace (adapter before client)
yarn typecheck:all  # type-check every workspace
yarn lint:all       # lint the repo
yarn test:all       # run every workspace's tests
yarn verify:all     # build + typecheck + lint + test, in that order
```

Each workspace also exposes its own commands in its `package.json`. The Python `agent/` is
`uv`-managed, outside the yarn workspaces — see [`agent/README.md`](agent/README.md).
