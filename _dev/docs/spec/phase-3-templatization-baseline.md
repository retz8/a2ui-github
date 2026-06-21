# Phase 3 — Templatization baseline

Extract an FE + deterministic-agent baseline template from the post-Phase-2 shape, as an in-repo checkpoint (not a release). Realizes Track B step 1 of `_dev/docs/templatization-plan.md`.

## Scope

- Produce `adapter-template/` — a templatized, **empty-but-wired** scaffold derived from the reference instance (adapter + client + deterministic agent + root config + docs + `.claude/`).
- Author the **init skill** that materializes an instance from the template.
- Verify the extraction by materialize-then-build, plus a library-agnosticism check.
- Out of scope: the real domain/LLM agent, a published CLI, and any worked-example component.

## Locked decisions

### 1. The baseline is an empty-but-wired scaffold

The template ships all plumbing and placeholders but **zero domain content** — no catalog component, no client fixtures, no canned agent response. The adopter's first component is what lights the stack up. A template that renders its own working example is incoherent when the component library is the variable, so no "minimal working example" is kept.

### 2. The deterministic agent is included, as harness plumbing only

The deterministic A2A server is treated as reusable infrastructure (a token-free local round-trip harness valuable to any design-system × A2UI project), not as the deferred domain agent. It ships as plumbing + a **stubbed executor** with no canned responses — consistent with decision 1 (there is no component to answer). This corrects the plan's "FE-only — no agent yet": the deterministic test-harness agent is in; only the real domain/LLM agent stays deferred.

### 3. The template lives in-repo as `adapter-template/`

The baseline is assembled and version-controlled inside `a2ui-github` at the repo root as `adapter-template/`, kept next to the reference instance it is derived from so corrections through Phases 4–7 are a local diff. Promotion to a standalone `git init` repo — and the first real init-against-a-clone — is deferred to the post-Phase-7 finalization.

### 4. Placeholder split: code subset vs. prose; no domain tokens yet

Every placeholder in code/config must have a real referent that makes the scaffold build, so code/config carry only the build-relevant subset (`{{Library}}`, `{{libraryPkg}}`, `{{adapterPkg}}`, `{{version}}`, `{{repoSlug}}`). `{{Domain}}` and `{{mcp}}` are **absent from the baseline entirely** — they have nothing to bind to with only the deterministic stub, and arrive with the real agent post-Phase-7. Prose docs (`SPEC.md`, `CLAUDE.md`) are mostly domain-agnostic copy-paste + token substitution per the templatization plan; only SPEC.md §3 Demo is manually authored at init.

### 5. Placeholders span paths, and substitution is data-driven

The adapter package name (`primer-a2ui-adapter`) is the `{{adapterPkg}}` token **including its directory name**. The fill therefore operates uniformly over file contents **and** file/directory names (one scan, no special-cased rename list); the adapter directory is token-named in the staging tree and renamed on materialize. The `client/` and `agent/` directory names are generic and stay literal.

### 6. Spec sourcing drops the fork and the hook

The baseline carries no sibling `../A2UI` fork, no `sync-spec` hook, and no wiring for it. `adapter-template/CLAUDE.md` §2 replaces that machinery with pinned-ref canonical prose plus a **concrete fetch recipe parameterized by `{{version}}`** for reading `a2ui-project/a2ui` at that ref. The build has no spec-time dependency (`CommonSchemas` etc. come from `@a2ui/*` npm packages). `a2ui-sdk-design` is **not vendored**; the init skill fetches it at the pinned ref.

### 7. Init skill: all five steps authored, mechanical fill data-driven

Init is authored complete (fill, §3 interview, `a2ui-sdk-design` fetch, harness-plugin install, self-delete) and structured to survive Phase 4–7 corrections. The mechanical placeholder-fill is **data-driven** — scan for `{{...}}` tokens, prompt once per token, substitute contents+paths — not a hardcoded per-file edit list. The core loop (fill, §3 interview, self-delete) is smoke-tested this phase; the fetch and harness-install steps are authored with concrete commands but their **live end-to-end run is deferred** to the post-Phase-7 dogfood.

### 8. Self-delete is guarded so the smoke test never triggers it

Self-delete is a discrete terminal step the verification harness never invokes; the smoke test drives fill → verify only and asserts the init skill files still exist afterward. A real adopter run executes all five steps including self-delete.

### 9. Definition of done: materialize-then-build, plus an agnosticism check

Verification is two parts. (a) **Materialization smoke test:** copy `adapter-template/`, fill with the reference instance's own values (Primer / a2ui-github / v0.9.1), then run the full verify — `build:all` / `typecheck` / `lint` / `test:all` plus the agent's `uv sync` / `pytest` — asserting all green, zero `{{...}}` tokens remain, and init files still present. "Green" for the empty scaffold means compiles + lints + smoke tests pass + nothing references missing domain content. (b) **Agnosticism check:** grep the template's code + config for hardcoded library/domain identifiers outside placeholders and the plan's known prose care-spots → none. Explicitly excluded from the bar: live runs of fetch/harness-install, and building a second real design-system instance.

### 10. Extraction manifest

**Excluded (reference instance only):** `_dev/` entirely (a harness artifact, not a template artifact); the `sync-spec` hook and its settings wiring; the vendored `a2ui-sdk-design` skill; `settings.local.json`, `.claude/worktrees/`; `node_modules/`, `.venv/`, and lockfiles (`yarn.lock`, `uv.lock`); all domain/example content (`Text`/`Button`, fixtures, canned responses, `console-log`, component-specific tests).

**Included (as placeholdered scaffold + plumbing + smoke tests):** the adapter scaffold (catalog envelope over `CommonSchemas`, empty `components/`, `catalog.json` empty `$defs`, barrel, placeholdered package); the client (test-space wiring + `a2a/` action-handler + app shell, empty `fixtures/`); the agent (deterministic-server plumbing + stubbed executor + entry point + placeholdered `pyproject.toml` + README + pytest smoke scaffolding); root build config; `SPEC.md` + `CLAUDE.md` + `README` (placeholdered); `.claude/` carrying the init skill and a clean `settings.json` (no hook, harness not pre-enabled).

### 11. CLI is a deferred delivery vehicle; the fill core stays separable

A future `npx` scaffolder and the init skill are two vehicles over one materialization core. The CLI is deferred to post-Phase-7; the baseline builds toward it only by keeping the mechanical fill core (token scan → content/path substitution → dir rename → no-tokens assertion) cleanly separable from the Claude-Code-only steps (§3 interview, fetch, harness install). No CLI seam, `bin/`, or publish wiring is added now.

### 12. Doc and settings minor locks

`adapter-template/SPEC.md` §3 Demo ships as a clearly-marked authoring stub the init interview replaces. `adapter-template/CLAUDE.md` keeps a pointer to the harness plugin without restating its mechanics, and the plugin is not pre-enabled in the template's `settings.json` (init installs it opt-in, default-yes).

## Invariants

- Zero domain content in the baseline — no component, no fixtures, no canned responses.
- Every placeholder in code/config has a real referent that makes the materialized scaffold build.
- The template is library-agnostic — never accidentally Primer-shaped.

## Open items (deferred by decision)

- The real domain/LLM agent and the `{{Domain}}`/`{{mcp}}` tokens — folded in post-Phase-7.
- Live end-to-end runs of init's `a2ui-sdk-design` fetch and harness-plugin install — proven at the post-Phase-7 dogfood.
- The `npx` CLI delivery vehicle — built post-Phase-7 over the separable fill core.
- Promotion of `adapter-template/` to a standalone repo — post-Phase-7 finalization.
