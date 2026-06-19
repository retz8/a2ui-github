# a2ui-github

A downstream consumer of the [A2UI](https://github.com/a2ui-project/a2ui) protocol, exploring
generative UI for GitHub maintainer triage: an agent composes live UI from a curated
[Primer](https://primer.style/) component catalog instead of a hand-built frontend.

The repository is a polyglot monorepo:

- **`primer-a2ui-adapter/`** — the publishable A2UI catalog/adapter mapping A2UI components to Primer
  React wrappers, built over [`@a2ui/react`](https://www.npmjs.com/package/@a2ui/react).
- **`client/`** — a thin React + Primer demo app that renders A2UI surfaces through the adapter.
- **`agent/`** — _(planned)_ a Python agent that generates A2UI surfaces against the live GitHub repo.

> 🚧 **In active development.** APIs, structure, and catalog contents are still moving.

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

Each workspace also exposes its own commands in its `package.json`.
