# CLAUDE.md — a2ui-github

## How to Use these Guides

> **INSTRUCTION FOR ALL AGENTS:**
> Before performing any specific tasks, load and read the respective skill recipe file in full:

- **For designing the catalog, adapter, renderer, or backend integrations:** Read [.claude/skills/a2ui-sdk-design/SKILL.md](.claude/skills/a2ui-sdk-design/SKILL.md)

---

## 1. What is this project?

`a2ui-github` is a **demonstration project** that ships an end-to-end vertical slice proving the A2UI protocol can drive a GitHub-style web UI built on the [Primer](https://primer.style/) React design system.

It is a **downstream consumer** of the A2UI protocol — not the protocol repo itself. The protocol, schemas, and standard catalogs live in the sibling fork at `../A2UI/`, which tracks `a2ui-project/a2ui` via its `upstream` remote. Read the spec from the `upstream/main` ref (see §3), not the fork's working tree.

### Deliverables

1. **Catalog** — a Primer/React component catalog authored in the A2UI catalog format, describing the GitHub UI primitives an agent may emit.
2. **Adapter** — the mapping layer that resolves A2UI catalog components to concrete Primer React components.
3. **Demo agent app** — a server/agent that generates A2UI streams representing GitHub web UI.
4. **Demo thin renderer FE app** — a thin React client that consumes the A2UI stream and renders it progressively using the adapter + Primer.

---

## 2. What is A2UI?

**A2UI (Agent-to-User Interface)** is a platform-agnostic, streaming-first UI protocol designed to let LLMs and autonomous agents generate user interfaces.

Key capabilities:

- **Streaming UI:** Progressive rendering of components and values on the fly to minimize latency.
- **Two-Way Data Binding:** Seamless state synchronization between client and agent.
- **Local Function Evaluation:** Execution of validation/logic functions registered in Component Catalogs.

---

## 3. Protocol Versioning & Authority

This project targets a single protocol version at a time. The spec is sourced from the `../A2UI` fork's `upstream/main` ref (canonical `a2ui-project/a2ui`), not its working tree.

- **Refresh the spec:** Include the phrase **"sync spec"** in your prompt. A `UserPromptSubmit` hook (`.claude/hooks/sync-spec-hook.sh`, wired in `.claude/settings.json`) detects it and runs a non-destructive `git fetch upstream` that updates the `upstream/main` ref without touching the fork's working tree or branch.
- **Read from the ref:** e.g. `git -C ../A2UI show upstream/main:specification/v0_9_1/json/server_to_client.json`, `git -C ../A2UI ls-tree -r --name-only upstream/main specification/`, `git -C ../A2UI grep <pattern> upstream/main -- specification/`.
- **Authority Rule:** Default to version **v0.9.1** as the primary authority, unless the user specifies otherwise.
- Do not hardcode schema contents; read them from the `upstream/main` ref dynamically (see the SDK design skill).

---

## 4. Codebase & Repository Structure

This is a new project; the structure is not yet decided.
once it's finalized update this section.

- **`../A2UI/`**: Sibling repo — source of truth for the protocol spec, schemas, and standard catalogs.

---

## 5. Conventions

- **Catalog authoring:** Mirror the structure of the standard catalog in `../A2UI/specification/<version>/catalogs/`. Treat the JSON schemas as the compliance authority.
- **Renderer design:** Follow `../A2UI/specification/<version>/docs/renderer_guide.md` for state-layer separation and subscription lifecycles to avoid memory leaks.
- **No guessed run commands:** Consult the local `README.md` of each subproject for build/run/test steps rather than assuming a sequence.

---

## 6. Maintenance & Update Policy

- Keep this file and the `a2ui-sdk-design` skill synchronized with the directory layout and the targeted protocol version as the project evolves.
- When the targeted A2UI version changes, update the Authority Rule in both this file and the skill.
- Suggest documentation updates to the user at the end of a task if any change affects documented files.
