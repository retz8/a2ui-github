---
name: a2ui-sdk-design
description: Provides guidelines and design principles for implementing, expanding, or modifying A2UI client libraries, SDK adapters, catalogs, and backend integrations across different protocol versions.
---

# A2UI SDK & Adapter Design Skill

This skill provides architectural guidance for developing or modifying A2UI catalogs, adapters, renderers, state layers, and communication infrastructure across all protocol versions.

## Specifications Navigation

This project (`a2ui-github`) is a downstream consumer of the A2UI protocol; it does not vendor the spec. The authoritative specification lives in the sibling fork at `../A2UI`, which tracks `a2ui-project/a2ui` via its `upstream` remote.

**Read the spec from the `upstream/main` ref, not the working tree.** The sibling fork is usually checked out on a feature branch with local changes, so the on-disk files can be stale or diverged. The `upstream/main` ref is the canonical, freshly-fetched source.

- **Refresh first:** Include the phrase **"sync spec"** in your prompt to trigger the `UserPromptSubmit` hook, which runs a non-destructive `git fetch upstream` to update the `upstream/main` ref before you rely on it.
- **List a tree:** `git -C ../A2UI ls-tree -r --name-only upstream/main specification/`
- **Read a file in full:** `git -C ../A2UI show upstream/main:specification/v0_9_1/json/server_to_client.json`
- **Search across the spec:** `git -C ../A2UI grep <pattern> upstream/main -- specification/`
- **Authority Rule:** Default to version **v0.9.1** as the primary authority when working on the catalog, adapter, or SDK integrations, unless the user specifies otherwise.

### Critical Sources of Truth

For the targeted version, analyze these core files to inform your design, typically reading each file _in full_:

1. **JSON Schemas (`json/*.json`)**: Absolute authority for message format compliance. Check `server_to_client.json` for stream envelopes, `client_to_server.json` for action events, and `common_types.json` for dynamic binding primitives and other schema `$defs`.
2. **Component & Function Catalogs (`catalogs/<catalog-name>/catalog.json`)**: Authoritative definitions of supported visual components and registered evaluation/validation functions. Use the standard catalog as the structural reference when authoring the Primer/React catalog in this project.
3. **Protocol Semantics (`docs/a2ui_protocol.md`)**: Semantic foundation covering message stream structures, pointer scopes, and two-way binding agreements.
4. **SDK APIs and architecture design (`docs/renderer_guide.md`)**: Required mechanics for state layer separation, reactive models, and component subscription lifecycles to prevent memory leaks. This is the primary reference for the thin React renderer in this project.
