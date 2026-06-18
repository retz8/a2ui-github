# Phase 1 — Bootstrap

Stand up the polyglot monorepo workspace and a green build. Covers the TODO `## Phase 1 — Bootstrap` and realizes the repository structure locked in SPEC.md §7.

## Scope

- Stand up the Yarn 4 workspace root plus two TypeScript workspaces: `primer-a2ui-adapter` and `client`.
- "Green build" means, across the workspaces: `install`, `build`, `typecheck`, `lint`, and a placeholder `test` all pass, with root orchestration scripts in place.
- Each workspace is a buildable skeleton only — no real catalog content, no A2UI surface rendering, no GitHub-semantic components. Those belong to later phases.

Out of scope:

- The Python `agent/` workspace and its `uv` toolchain (arrives in Phase 5).
- Authoring any catalog content, Primer wrapper component, or A2UI surface render (Phase 2).
- CI / GitHub Actions and the autonomous layer (Phase 3).

## Locked decisions

### 1. Definition of "green build"

Green is: `install` + `build` + `typecheck` + `lint` + a placeholder `test`, all passing across the workspaces, with the root orchestration scripts present. This is the bar — not a bare install/typecheck, and not a browser-rendered smoke of an A2UI surface.

### 2. Workspace set

Yarn 4 workspace root + `primer-a2ui-adapter` + `client`. No `agent/`, and no `uv`, in this phase.

### 3. Build orchestration & per-workspace tooling

Root orchestration uses plain scripts over `yarn workspaces foreach --topological-dev`, so the adapter builds before the client. No wireit. The adapter builds with `tsc`; the client builds and serves with `vite`.

### 4. A2UI dependencies & protocol targeting

Depend on `@a2ui/react` and `@a2ui/web_core` at caret `^0.10.1`, pinned reproducibly by the lockfile. The protocol version is selected at the import path, not the package version: all v0.9 imports go through the `/v0_9` subpath, and this is a written convention so nothing drifts onto the v0.8 default. React 19 and zod 3 are peer constraints on the client.

### 5. Test harness

Vitest in both workspaces, with one placeholder smoke test each, wired into the root test orchestration.

### 6. Lint & format

Prettier plus ESLint (flat config), wired into root lint/format scripts. No syncpack.

### 7. Adapter skeleton

The adapter is a buildable package skeleton. The catalog artifacts exist as explicit placeholders only — `catalog-id.ts`, `catalog.ts`, and `catalogs/v0.9.1/catalog.json` are `TODO(phase-2)` stubs, plus an `index.ts` barrel and an empty `components/`. Real catalog wiring (constructing the catalog over the basic catalog, the hosted catalog ID, and the declarative catalog document) is deferred to Phase 2.

`catalogs/` sits outside `src/` deliberately: it is a hosted data artifact read by the agent, versioned by protocol in its path, and shipped rather than compiled — distinct from `src/catalog.ts`, the runtime catalog that is compiled.

### 8. Client skeleton

Vite + React 19 + TypeScript. It imports the adapter's placeholder export to prove the workspace dependency edge and topological build order, wraps the tree in Primer's `ThemeProvider` + `BaseStyles`, and renders a static "bootstrap OK" page. `@a2ui/react` and `@a2ui/web_core` are installed as dependencies but no A2UI surface is mounted (Phase 2). One Vitest smoke test.

### 9. Yarn 4 setup

Yarn 4.13.0 via corepack, `nodeLinker: node-modules`, and no private registry scope (everything resolves from public npm). `.gitignore` follows a2ui's posture without zero-install (the Yarn cache is not committed); `yarn.lock` is committed. Root `package.json` is private with the two workspaces. A root `tsconfig.base.json` is the shared base both workspaces extend. No `engines` or `.nvmrc` pin.

### 10. CI & README

No CI / GitHub Actions in this phase; green is verified locally via the root scripts. The README stays public-facing with no internal phase numbering: a short statement of what the project is, an install/build section, and a mark that the project is in active development.

## Invariants

- All of `_dev/` is edited and committed on `main`; worktree branches carry implementation code only.
- v0.9 protocol is always reached via the `/v0_9` import subpath of `@a2ui/react` and `@a2ui/web_core`; the bare entry (v0.8 legacy) is never used.
