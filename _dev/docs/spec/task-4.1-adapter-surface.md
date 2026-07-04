# Task 4.1 — Adapter surface

Covers TODO `**4.1**` under Phase 4. Authors the adapter surface of both catalog-authoring skills and establishes the decision-doc contract. The two-skill architecture lives in `phase-4-catalog-authoring-skill.md`; this spec holds the 4.1-scoped decisions.

## Scope

- Write the adapter **design** procedure into the Design skill's `SKILL.md`, and the adapter **build/test** procedure into the Build & Test skill's `SKILL.md` (body sections only).
- Establish the shared decision-doc contract: the component-level frame plus the adapter section.
- Validated against the shipped `Text`/`Button` adapter artifacts.

## Locked decisions

### 1. Adapter design procedure — the prop-surface checklist

The Design skill's adapter section is the prop-surface decision checklist (input → design call → locked table, per phase spec #5). Its content is the per-prop decision axes — carry/drop/defer, synthetic-or-not, A2UI type, de-branded description — embedding the authoring conventions self-contained (per-component fidelity, bound-state-vs-config, de-branding, and the synthetic-content-prop rule). Its two inputs are the component's official doc URL and the agent-resolved installed types.

### 2. Adapter build/test procedure — the mechanical loop

The Build & Test skill's adapter section captures the mechanical loop that transcribes the decision doc: the zod schema, the render, the `catalog.json` entry plus its `anyComponent` coverage, the parity-test registry entry, the catalog registration, and the catalog smoke test. The local-function sub-loop is an optional branch, triggered only when a component's action targets a local function call — adapter-side, touching the catalog registration, the `catalog.json` functions surface, and the parity function registry.

### 3. Design/Build seam for the adapter

Design produces the decision-doc table **including the de-branded descriptions** (a semantic judgment call). Build & Test **transcribes** the table into every adapter artifact and its tests. The render is **fully mechanical from the table** — its Phase-2 conventions and gotchas are build-procedure notes, not per-component decisions — so no render-specific field enters the decision doc.

### 4. Decision-doc content set

The doc's adapter section holds: a component-level **header** (name, official doc URL, the resolved-type reference the real surface came from), the **prop-surface table** (one row per real and synthetic prop, columns: decision, synthetic?, A2UI type, description), a **functions** entry when one is needed, and **deferrals** (dropped or deferred props with their reason).

### 5. Decision doc is well-structured markdown, not a rigid schema

The doc is read by the human and by the Build & Test LLM — nothing parses it — so it is a well-structured markdown file, with the prop surface presented as a table because that is the clearest form for per-prop rows. The real requirement is not schema rigidity but **completeness and unambiguity**: the doc must pin every prop clearly enough that an autonomous Build run needs no human (the Phase-5 precondition).

### 6. 4.1 locks only the shared frame

4.1 fixes the component-level header, the full adapter section, and the **append-convention** — one shared doc per component, one section per surface, later surfaces append rather than restructure. The internal shape of the client and agent sections is left to 4.2/4.3's own grills. The contract is established through the format described in the Design `SKILL.md` plus one inline filled-table example, not through a kept full doc.

### 7. No frontmatter at 4.1

4.1 writes body sections only into both `SKILL.md` files. Frontmatter, overview, and orchestration are deferred to 4.4.

### 8. Validation is a read-through; decision docs come from 4.4's dogfood

4.1 validates the adapter design and build procedures by reading them through against the shipped `Text`/`Button` adapter artifacts — would following them reproduce those artifacts. 4.1 produces **no** kept decision docs. Running the Design skill to produce docs is dogfooding, which belongs at 4.4; the complete `Text`/`Button` decision docs are produced and kept as the canonical examples there.

## Invariants

- Everything 4.1 authors is prose in the two `SKILL.md` files; no product code is written (validation is a read-through against existing artifacts).
- The Build & Test adapter procedure takes no human input; the only human judgment for the adapter is the prop-surface design call in the Design skill.

## Open items

- None.
