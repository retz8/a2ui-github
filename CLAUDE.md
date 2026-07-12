# CLAUDE.md — a2ui-github

## How to Use these Guides

> **INSTRUCTION FOR ALL AGENTS — do this before any task:**
>
> 1. **Read [SPEC.md](SPEC.md) in full.** It is the authoritative high-level design for this project.
> 2. **For designing the catalog, adapter, renderer, or backend integrations:** also read [.claude/skills/a2ui-sdk-design/SKILL.md](.claude/skills/a2ui-sdk-design/SKILL.md) in full.

This file (`CLAUDE.md`) holds only the **operational rules** not covered elsewhere. It does **not** restate the project design (that lives in SPEC.md) or the spec-navigation/design mechanics (those live in the `a2ui-sdk-design` skill).

`a2ui-github` is a **downstream consumer** of the A2UI protocol — not the protocol repo itself. The protocol, schemas, and standard catalogs live in the sibling fork at `../A2UI/`, which tracks `a2ui-project/a2ui` via its `upstream` remote. Read the spec from the `upstream/main` ref (see §2), not the fork's working tree.

---

## 1. What is A2UI?

**A2UI (Agent-to-User Interface)** is a platform-agnostic, streaming-first UI protocol designed to let LLMs and autonomous agents generate user interfaces.

Key capabilities:

- **Streaming UI:** Progressive rendering of components and values on the fly to minimize latency.
- **Two-Way Data Binding:** Seamless state synchronization between client and agent.
- **Local Function Evaluation:** Execution of validation/logic functions registered in Component Catalogs.

---

## 2. Protocol Versioning & Authority

This project targets a single protocol version at a time.

- **Authority Rule:** Default to version **v0.9.1** as the primary authority, unless the user specifies otherwise.
- **Refresh the spec:** Include the phrase **"sync spec"** in your prompt. A `UserPromptSubmit` hook (`.claude/hooks/sync-spec-hook.sh`, wired in `.claude/settings.json`) runs a non-destructive `git fetch upstream` that updates the `upstream/main` ref without touching the fork's working tree or branch.
- Do not hardcode schema contents; read them from the `upstream/main` ref dynamically.
- **How to read the spec** (paths, git commands, critical source-of-truth files): see the `a2ui-sdk-design` skill's "Specifications Navigation".

---

## 3. Conventions

- **No guessed run commands:** Consult the local `README.md` of each subproject for build/run/test steps rather than assuming a sequence.
- **No disposition popups — always plain chat.** Never use the `AskUserQuestion` tool to present dispositions, decisions, or choices. Lay out the options, tradeoffs, and a recommendation as plain chat text so the user keeps full flexibility to respond however they want.

Catalog-authoring and renderer-design conventions live in the `a2ui-sdk-design` skill (read per the top instruction before that work).

### Local testing in a tunnel environment

The dev machine is normally reached through a VS Code dev tunnel, so the controlled browser is remote and `localhost:<port>` does not resolve to the dev machine (see the user profile). When driving the app or agent for live verification — including `review-nightly` — target **tunnel URLs, and set the forwarded ports to public**, unless the user explicitly says to use localhost or that they are not in a tunnel.

- **Client:** set `VITE_A2A_SERVER_URL` to the **agent's tunnel URL** (not `localhost`) so the browser reaches the agent.
- **Agent:** run with `--base-url <agent tunnel URL>` so the agent card advertises the public endpoint. Its default card URL is `http://localhost:<port>`, which the remote browser cannot reach — the message/send POST would target the wrong host and fail even when the card fetch succeeds.
- The agent card is fetched cross-origin; the tunnel ports must be **public** (a private port yields a 404/502 at the tunnel and a `Failed to fetch` in the browser).

### Daily-work harness

The dev workflow (phases → sub-tasks, dispatch, branching, wrap-up) lives in the **`daily-work-harness` plugin** — its skills (`daily-work-harness:pick-up-task` / `:wrap-up` / `:rebase-with-main` / `:grill-to-spec`) and the `daily-workflow.md` reference doc they read. Operational rules it relies on:

- **`_dev/` lives on `main`.** `_dev/TODO.md` and everything under `_dev/docs/` is edited and committed on `main` only — never on a worktree/sub-task branch. Worktree branches carry implementation code only.
- **Implementation plans go to `_dev/docs/plan/`** as `task-<N.M>-<short>.md` — `superpowers:writing-plans` must emit there.
- **Commit convention:** conventional commits — `<type>(phase-<N>): …` for phase/sub-task work, bare `<type>: …` off-phase.

---

## 4. Maintenance & Update Policy

- **SPEC.md is the source of truth for design.** When a design decision changes, update SPEC.md — not this file.
- Keep this file and the `a2ui-sdk-design` skill synchronized with the targeted protocol version as the project evolves.
- When the targeted A2UI version changes, update the Authority Rule in both this file and the skill.
- Suggest documentation updates to the user at the end of a task if any change affects documented files.
