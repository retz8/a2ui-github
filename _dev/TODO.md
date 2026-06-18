# a2ui-github — Dev TODO

## Phase 1 — Bootstrap [WIP]
Stand up the monorepo workspace and a green build. Spec: `_dev/docs/spec/phase-1-bootstrap.md`.

- [x] **1.1** Yarn 4 workspace root — corepack/yarn 4.13.0, `.yarnrc.yml` (node-modules linker, no private scope), root `package.json` (private + workspaces), `tsconfig.base.json`, prettier + ESLint flat config, `.gitignore`, green `yarn install`; public README (project description, install/build, in-dev mark).
- [ ] **1.2** `primer-a2ui-adapter` skeleton — package (tsc build + vitest), placeholder `catalog-id.ts` / `catalog.ts` / `catalogs/v0.9.1/catalog.json` (`TODO(phase-2)` stubs), `index.ts` barrel, empty `components/`, one smoke test; green build/typecheck/lint/test.
- [ ] **1.3** `client` skeleton — Vite + React 19 + TS, Primer `ThemeProvider`+`BaseStyles`, imports adapter placeholder (proves workspace edge), `@a2ui/react`+`@a2ui/web_core` installed, static "bootstrap OK" page, one smoke test; green.
- [ ] **1.4** Root orchestration — `build:all` / `test:all` / `lint:all` / typecheck via `yarn workspaces foreach --topological-dev`; verify whole-repo green.

Order: 1.1 first. 1.2 and 1.3 are parallel-eligible after 1.1 (1.3's adapter-import check needs 1.2's `index.ts` present first). 1.4 last (needs 1.2 + 1.3 green).

## Phase 2 — Test space & first catalog component
A minimal FE space to render A2UI surfaces through our catalog, and the first Primer component taken end-to-end.

## Phase 3 — Catalog-writing harness
The repeatable component-authoring workflow, captured as a project skill. Also set up the daily-work harness's deferred autonomous layer (nightly routine + its GitHub issue/label machinery) here, ready for Phase 4.

## Phase 4 — Catalog build-out
The Primer primitives and GitHub-semantic components the demo needs.

## Phase 5 — Agent
The agent that generates A2UI surfaces from the catalog, against the live GitHub repo.

## Phase 6 — Demo integration
The full maintainer-triage arc running end-to-end on the live a2ui repo.

## Backlog
- Diff viewer (stretch)
- Agent template memory
- Read + write loop on a seeded sandbox repo
