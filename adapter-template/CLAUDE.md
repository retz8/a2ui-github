# CLAUDE.md — a2ui-app

## How to Use these Guides

> **INSTRUCTION FOR ALL AGENTS — do this before any task:**
>
> 1. **Read [SPEC.md](SPEC.md) in full.** It is the authoritative high-level design for this project.
> 2. **For designing the catalog, adapter, renderer, or backend integrations:** also read the
>    `a2ui-sdk-design` skill in full (installed at init).

This file (`CLAUDE.md`) holds only the **operational rules** not covered elsewhere. It does **not** restate the project design (that lives in SPEC.md) or the spec-navigation/design mechanics (those live in the `a2ui-sdk-design` skill).

`a2ui-app` is a **downstream consumer** of the A2UI protocol — not the protocol repo itself. The protocol, schemas, and standard catalogs are published by `a2ui-project/a2ui`; the build depends only on the `@a2ui/*` npm packages, never on a local checkout of the protocol. Read the canonical spec directly from `a2ui-project/a2ui` at the pinned version (see §2).

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

- **Authority Rule:** Default to version **{{version}}** as the primary authority, unless the user specifies otherwise.
- **Read the spec from canonical, pinned by `{{version}}`.** There is no sibling fork and no `sync-spec` hook. Read `a2ui-project/a2ui` directly via a throwaway shallow clone, deriving the spec path from `{{version}}` by replacing dots with underscores (`v0.9.1` → `specification/v0_9_1/`):

  ```bash
  tmp=$(mktemp -d) && git clone --depth 1 https://github.com/a2ui-project/a2ui "$tmp"
  git -C "$tmp" ls-tree -r --name-only HEAD specification/v0_9_1/      # list spec files
  git -C "$tmp" show HEAD:specification/v0_9_1/<file>                    # read one
  git -C "$tmp" grep <pattern> HEAD -- specification/v0_9_1/            # search
  rm -rf "$tmp"                                                          # clean up
  ```

  This reads off `main`. For a reproducible read, pin a recorded commit SHA in place of `HEAD`/`--depth 1` rather than cloning the moving tip.
- **Two version axes — don't conflate them.** `{{version}}` pins the *spec directory* you read (the catalog-format version). The *protocol minor* implemented at runtime (e.g. `v0_9`) is pinned by the installed `@a2ui/*` packages' subpath, not by `{{version}}`. Keep them aligned but treat them as distinct.
- Do not hardcode schema contents; read them from canonical at the pinned version dynamically.

---

## 3. Conventions

- **No guessed run commands:** Consult the local `README.md` of each subproject for build/run/test steps rather than assuming a sequence.

Catalog-authoring and renderer-design conventions live in the `a2ui-sdk-design` skill (read per the top instruction before that work).

### Daily-work harness

If you opted into the daily-work harness at init, the dev workflow (phases → sub-tasks, dispatch, branching, wrap-up) lives in that plugin and its skills — see the plugin's own docs. This template does not restate its mechanics.

---

## 4. Maintenance & Update Policy

- **SPEC.md is the source of truth for design.** When a design decision changes, update SPEC.md — not this file.
- Keep this file and the `a2ui-sdk-design` skill synchronized with the targeted protocol version as the project evolves.
- When the targeted A2UI version changes, update the Authority Rule (`{{version}}`) in both this file and the skill.
- Suggest documentation updates to the user at the end of a task if any change affects documented files.
