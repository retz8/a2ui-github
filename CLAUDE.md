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

Catalog-authoring and renderer-design conventions live in the `a2ui-sdk-design` skill (read per the top instruction before that work).

---

## 4. Maintenance & Update Policy

- **SPEC.md is the source of truth for design.** When a design decision changes, update SPEC.md — not this file.
- Keep this file and the `a2ui-sdk-design` skill synchronized with the targeted protocol version as the project evolves.
- When the targeted A2UI version changes, update the Authority Rule in both this file and the skill.
- Suggest documentation updates to the user at the end of a task if any change affects documented files.
