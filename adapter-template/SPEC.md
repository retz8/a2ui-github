# a2ui-app — High-Level Spec

> **Targeted protocol version:** A2UI **{{version}}** (authority per `CLAUDE.md`).

> This spec describes the app you intend to build, not the empty template's current state. The
> §1–§7 structure is the reusable scaffold; fill the tokens and author §3 at init time.

---

## 1. Thesis & framing

- **Generative UI: the agent is the frontend, not a BFF.** The agent owns the UI/UX logic — page flow, layout, and what a screen looks like — and composes screens live from catalog primitives.
- **Never invent components outside {{Library}}/React.** The catalog is {{Library}} primitives only. Anything complex (e.g. a diff view) is the agent composing a view from existing primitives — *not* a bespoke custom component.
- **Don't over-determine the agent.** We give it important constraints + knowledge and trust it to make UI/flow decisions. Less dev-specified logic than today's apps, not more.
- **A2UI is composition-only — no raw HTML.**

## 2. Interaction architecture

- **Agent round-trip, generative on each navigation.** A click fires an action event; the agent generates the resulting view. "Agent round-trip, not server round-trip" — the agent is the new backend-for-frontend.
- **Cross-visit consistency is the agent's responsibility** (e.g. `openPR(42)` and `openPR(30)` should yield near-consistent UI). An agent-owned short-term "template memory" idea was raised but **deferred** to the agent-design phase (do not design it yet).

## 3. Demo

> **⚠️ Authoring stub — replaced at init.** The concrete demo arc is inherently {{Domain}}-shaped, so
> it is not tokenized. The init interview replaces this section with your demo: the anchor flow,
> persona framing, action scope (read-only vs. compose-and-confirm vs. write), the prompt-arc beats
> (broad → narrow → drill → act), and the detail-view depth. Until then this is a placeholder.

## 4. Catalog & adapter

- **Catalog abstraction level:** a curated **{{Domain}}-semantic {{Library}} vocabulary** (mid/high-level components that encode {{Domain}}'s visual language) **plus** core layout/text/input primitives. Not all of {{Library}}; not primitives-only. The catalog grows lazily as flows need more.
- **Token / styling exposure:** {{Library}} design tokens exposed as **enumerated, validated props** on layout primitives (mapped by the adapter to {{Library}} React). Not a full `sx` passthrough.
- **{{Library}} knowledge at runtime:** bake curated {{Library}} guidance into the agent's context; fixed catalog; graceful degradation. **No** live doc-fetching at generation time.

## 5. Transport & topology

Adopt the official a2ui sample stack wholesale:

- **Transport:** **A2A**, using A2A's streaming method for progressive A2UI rendering.
- **Agentic BE:** **Python + ADK**, hosted as an **A2A server**, with **{{mcp}}** plugged into the ADK agent.
- **Renderer FE:** **React + {{Library}}**, consuming the A2UI stream via the sample's **A2A client middleware**; uses the published `@a2ui/react` renderer (`npm i @a2ui/react`).
- **Note:** Composer (`a2ui-project/composer`) is only a client-side renderer/dev workbench — not the demo vehicle.

## 6. Deliverables & what we ship

- **The one publishable package is the adapter.** Its releasable artifacts are:
  - `catalog-id.ts` — the catalog ID (a GitHub URL pointing to the hosted `catalog.json`).
  - `catalog.ts` — `Catalog<ReactComponentImplementation>`: A2UI component names → {{Library}} React wrappers + bindings, built over `@a2ui/react`'s common schemas.
  - `components/` — the {{Library}} React wrapper components.
  - `catalogs/{{version}}/catalog.json` — the declarative JSON catalog the agent reads (hosted at the catalog-ID URL).
- The a2ui React renderer is **just an npm dependency** (`@a2ui/react`), not something we build.
- **Demo scaffolding (not published as packages):** the thin React FE app and the Python ADK agent + {{mcp}}.

## 7. Repository structure

Polyglot monorepo. **Yarn 4 (Berry) workspaces** for the TS side, following a2ui's Yarn 4 tooling (`nodeLinker: node-modules`, `packageManager: yarn@4.x`). The **Python `agent/` is managed by `uv`, outside the yarn workspaces**.

- `@a2ui/react` is available on **public npm**.

```
a2ui-app/                          # Yarn 4 workspace root (private)
  {{adapterPkg}}/                  # THE publishable package, a2ui catalog
  client/                          # thin React + {{Library}} demo FE (@a2ui/react + adapter + {{libraryPkg}})
  agent/                           # Python (uv) — NOT a yarn workspace
                                   # google-adk + a2a-sdk[http-server] + a2ui-agent-sdk + {{mcp}}
                                   # (a deterministic A2A harness ships now; the real agent slots in alongside)

# root package.json: "workspaces": ["{{adapterPkg}}", "client"]   (agent/ excluded — uv-managed)
```

## 8. Deferred (not decided in this session)

These are explicitly open and will be decided when their branch is next touched:

- {{mcp}} specifics (which server, auth).
- The agent's short-term "template memory" mechanism.
- Agent-internal design (prompt strategy, etc.).
- The full diff viewer (stretch goal).
- Concrete per-screen {{Library}} component lists and the catalog contents themselves.
- Build tooling specifics within each workspace.
