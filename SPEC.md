# a2ui-github — High-Level Spec

> **Status:** High-level spec agreed in the first design session (2026-06-16) via a `/grill-me` interview.
> **Scope of this document:** It records *only* what was decided in that session — no more. Anything not decided is listed under **Deferred** and will be resolved when we next touch that branch. Do not treat absence of detail here as a decision.
>
> **Targeted protocol version:** A2UI **v0.9.1** (authority per `CLAUDE.md`).

---

## 1. Thesis & framing

- **Generative UI: the agent is the frontend, not a BFF.** The agent owns the UI/UX logic — page flow, layout, and what a screen looks like — and composes screens live from catalog primitives.
- **Never invent components outside Primer/React.** The catalog is Primer primitives only. Anything complex (e.g. a diff view) is the agent composing a view from existing primitives — *not* a bespoke custom component.
- **Don't over-determine the agent.** We give it important constraints + knowledge and trust it to make UI/flow decisions. Less dev-specified logic than today's apps, not more.
- **A2UI is composition-only — no raw HTML.** Verified against the v0.9.1 schema: components validate against `catalog.json#/$defs/anyComponent` (a closed union, `additionalProperties: false`); there is no raw-HTML escape hatch.

## 2. Interaction architecture

- **Agent round-trip, generative on each navigation.** A click fires an action event; the agent generates the resulting view. "Agent round-trip, not server round-trip" — the agent is the new backend-for-frontend.
- **Rejected:** pre-bundling all views into one upfront payload (defeats the purpose of having an agent).
- **Rejected:** deterministic per-view templates, and an external view-type cache.
- **Cross-visit consistency is the agent's responsibility** (e.g. `openPR(42)` and `openPR(30)` should yield near-consistent UI). An agent-owned short-term "template memory" idea was raised but **deferred** to the agent-design phase (do not design it yet).

## 3. Demo

- **Anchor flow:** "the maintainer's morning" — PR triage on the real **`a2ui-project/a2ui`** repository (chosen partly so it can be presented to the a2ui community later).
- **Persona framing:** repo-level **maintainer triage**, **viewer-agnostic** prompts. Not "PRs waiting on my review" — `review-requested:@me` returns empty for the user's account. Confirmed that `gh` / GitHub MCP can fetch PRs from the a2ui repo.
- **Action scope:** **read-only** against the real repo. Write-actions (approve / comment / label) are rendered as **compose-and-confirm** UI that stops short of the real POST — no mutation of the live community repo. (A full read+write loop on a seeded sandbox repo is a possible future upgrade.)

### 3.1 Demo prompt arc (5 beats)

A single coherent story (broad → narrow → drill → act):

1. "Show me the open PRs that need review." → triage **list**.
2. "Which of these are failing CI?" → list with **check-status emphasis** (re-composed, not re-skinned).
3. "Ignore the dependabot bumps — what human PRs are waiting?" → **headline fuzzy-intent** moment.
4. "Open #1668." → PR **detail** view (see §3.2).
5. "Draft an approving review saying the heading cleanup looks reasonable." → **compose-and-confirm** action (no POST).

### 3.2 PR-detail view depth (v1)

Includes: metadata, markdown description, review state, CI checks, reviewers, comment timeline, and a **files-changed summary list**.

- **Deferred (stretch goal):** a full diff viewer. When built, it is the agent composing Primer primitives — never a custom component.

## 4. Catalog & adapter

- **Catalog abstraction level:** a curated **GitHub-semantic Primer vocabulary** (mid/high-level components that encode GitHub's visual language) **plus** core layout/text/input primitives. Not all of Primer; not primitives-only. The catalog grows lazily as flows need more.
- **Token / styling exposure:** Primer design tokens exposed as **enumerated, validated props** on layout primitives (mapped by the adapter to Primer React). Not a full `sx` passthrough.
- **Primer knowledge at runtime:** bake curated Primer guidance into the agent's context; fixed catalog; graceful degradation. **No** live doc-fetching at generation time.
- **Catalog-authoring (build-time):** invest in a **catalog-authoring harness** that wraps Primer components into the catalog + adapter, driven by the agent's out-of-catalog "wants." (Design deferred — see **Deferred**.)

## 5. Transport & topology

Adopt the official a2ui sample stack wholesale (confirmed: all official samples, including the React one, use A2A + ADK):

- **Transport:** **A2A**, using A2A's streaming method for progressive A2UI rendering.
- **Agentic BE:** **Python + ADK**, hosted as an **A2A server**, with **GitHub MCP** plugged into the ADK agent.
- **Renderer FE:** **React + Primer**, consuming the A2UI stream via the sample's **A2A client middleware**; uses the published `@a2ui/react` renderer (`npm i @a2ui/react`).
- **Rejected:** SSE+POST transport; a TypeScript-only agent.
- **Note:** Composer (`a2ui-project/composer`) is only a client-side renderer/dev workbench — not the demo vehicle, since it doesn't give control over the agent.

## 6. Deliverables & what we ship

- **The one publishable package is the adapter**, mirroring `retz8/spartan-a2ui-adapter`. Its releasable artifacts are:
  - `catalog-id.ts` — the catalog ID (a GitHub URL pointing to the hosted `catalog.json`).
  - `catalog.ts` — `Catalog<ReactComponentImplementation>`: A2UI component names → Primer React wrappers + bindings, built over `@a2ui/react`'s basic catalog.
  - `components/` — the Primer React wrapper components.
  - `catalogs/v0.9.1/catalog.json` — the declarative JSON catalog the agent reads (hosted at the catalog-ID URL).
- The a2ui React renderer is **just an npm dependency** (`@a2ui/react`), not something we build.
- **Demo scaffolding (not published as packages):** the thin React FE app, the Python ADK agent + GitHub MCP, and the catalog-authoring harness.

## 7. Repository structure

Polyglot monorepo. **Yarn 4 (Berry) workspaces** for the TS side (mirroring a2ui; `nodeLinker: node-modules`, `packageManager: yarn@4.x`). The **Python `agent/` is managed by `uv`, outside the yarn workspaces**.

- **Rejected:** turborepo (ecosystem alignment with a2ui + the repo is too small to justify it). `wireit` is optional and skipped for now.
- Turborepo would not remove the need for `uv` — a JS task-orchestrator and a Python dependency-manager are orthogonal.
- `@a2ui/react` is confirmed available on **public npm** (its package version is independent of the targeted protocol version).

```
a2ui-github/                       # Yarn 4 workspace root (private)
  packages/
    github-a2ui-adapter/           # THE publishable package
      src/lib/{catalog.ts, catalog-id.ts, components/}
      catalogs/v0.9.1/catalog.json
  apps/
    web/                           # thin React + Primer demo FE (@a2ui/react + adapter + @primer/react)
  tools/
    catalog-harness/               # catalog-authoring tooling (TS)
  agent/                           # Python (uv) — NOT a yarn workspace
                                   # google-adk + a2a-sdk[http-server] + a2ui-agent-sdk + GitHub MCP
```

## 8. Deferred (not decided in this session)

These are explicitly open and will be decided when their branch is next touched:

- Catalog-authoring harness design.
- GitHub MCP specifics (which server, auth).
- The agent's short-term "template memory" mechanism.
- Agent-internal design (prompt strategy, etc.).
- The full diff viewer (stretch goal).
- Concrete per-screen Primer component lists and the catalog contents themselves.
- Build tooling specifics within each workspace.
