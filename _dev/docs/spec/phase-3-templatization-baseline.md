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

### 4. Placeholder split: code/config subset vs. prose

Every placeholder in code/config must have a real referent that makes the scaffold build, so code/config carry only the build-relevant subset (`{{adapterPkg}}`, `{{agentPkg}}`, `{{Library}}`, `{{libraryPkg}}`, `{{version}}`, `{{repoSlug}}`). `{{Domain}}` and `{{mcp}}` live in prose only (`SPEC.md`, `README`) — they have no build referent, so they stay off the build surface while remaining part of the templatized prose. Prose docs are mostly domain-agnostic copy-paste + token substitution per the templatization plan; only SPEC.md §3 Demo is manually authored at init.

### 5. Placeholders span paths, and substitution is data-driven

The adapter package name (`primer-a2ui-adapter`) is the `{{adapterPkg}}` token **including its directory name**. The fill therefore operates uniformly over file contents **and** file/directory names (one scan, no special-cased rename list); the adapter directory is token-named in the staging tree and renamed on materialize. The `client/` and `agent/` directory names are generic and stay literal.

### 6. Spec sourcing drops the fork and the hook

The baseline carries no sibling `../A2UI` fork, no `sync-spec` hook, and no wiring for it. `adapter-template/CLAUDE.md` §2 replaces that machinery with pinned-ref canonical prose plus a **concrete fetch recipe parameterized by `{{version}}`** for reading `a2ui-project/a2ui` at that ref. The build has no spec-time dependency (`CommonSchemas` etc. come from `@a2ui/*` npm packages). `a2ui-sdk-design` is **vendored** into the template's `.claude/skills/` as default content (not fetched), with its Specifications Navigation rewritten to use the same `{{version}}`-parameterized pinned-ref fetch from `a2ui-project/a2ui`.

### 7. Init skill: all steps authored, mechanical fill via a standalone script

Init is authored complete and structured to survive Phase 4–7 corrections. Its phases: collect the 8 tokens, demo-arc interview, run the fill + author SPEC §3 prose, install the harness plugin, guarded self-delete. The mechanical placeholder-fill is a **standalone non-interactive script** that substitutes the known 8-token set across contents+paths, renames the token-named directories, and asserts no `{{...}}` remain — no scan step, no hardcoded per-file edit list. The fill script is smoke-tested this phase (3.4); the Claude-only steps (demo-arc interview, §3 authoring, harness-plugin install) are authored with concrete commands but their **live end-to-end run is deferred** to the post-Phase-7 dogfood; self-delete is authored and structurally guarded so the smoke test never triggers it.

### 8. Self-delete is guarded so the smoke test never triggers it

Self-delete is a discrete terminal step the verification harness never invokes; the smoke test drives fill → verify only and asserts the init skill files still exist afterward. A real adopter run executes all five steps including self-delete.

### 9. Definition of done: materialize-then-build, plus an agnosticism check

Verification is two parts. (a) **Materialization smoke test:** copy `adapter-template/`, fill with the reference instance's own values (Primer / a2ui-github / v0.9.1), then run the full verify — `build:all` / `typecheck` / `lint` / `test:all` plus the agent's `uv sync` / `pytest` — asserting all green, zero `{{...}}` tokens remain, and init files still present. "Green" for the empty scaffold means compiles + lints + smoke tests pass + nothing references missing domain content. (b) **Agnosticism check:** grep the template's code + config for hardcoded library/domain identifiers outside placeholders and the plan's known prose care-spots → none. Explicitly excluded from the bar: live runs of fetch/harness-install, and building a second real design-system instance.

### 10. Extraction manifest

**Excluded (reference instance only):** `_dev/` entirely (a harness artifact, not a template artifact); the `sync-spec` hook and its settings wiring; `settings.local.json`, `.claude/worktrees/`; the `.agents/` skill-symlink indirection; `node_modules/`, `.venv/`, and lockfiles (`yarn.lock`, `uv.lock`); all domain/example content (`Text`/`Button`, fixtures, canned responses, `console-log`, component-specific tests).

**Included (as placeholdered scaffold + plumbing + smoke tests):** the adapter scaffold (catalog envelope over `CommonSchemas`, empty `components/`, `catalog.json` empty `$defs`, barrel, placeholdered package); the client (test-space wiring + `a2a/` action-handler + app shell, empty `fixtures/`); the agent (deterministic-server plumbing + stubbed executor + entry point + placeholdered `pyproject.toml` + README + pytest smoke scaffolding); root build config plus the root fill script (added to the eslint `ignores`); `SPEC.md` + `CLAUDE.md` + `README` (placeholdered); `.claude/` carrying the init skill (self-deleting), the permanent vendored skill set (`a2ui-sdk-design` edited + the 7 superpowers skills as real, de-referenced directories), and a clean `settings.json` (no hook, harness not pre-enabled).

### 11. CLI is a deferred delivery vehicle; the fill core stays separable

The init skill and a future CLI are two delivery vehicles for the same materialization; the CLI is deferred to post-Phase-7. The baseline builds toward it by keeping the mechanical fill (values-file input → content/path substitution → dir rename → no-tokens assertion) cleanly separable from the Claude-only steps (demo-arc interview, §3 authoring, harness install, self-delete) — the CLI subsumes exactly the token collection plus the fill. The fill is a standalone node script now; the CLI may reimplement it (e.g. in Rust), with the locked design carrying over. No CLI seam, `bin/`, or publish wiring is added now.

### 12. Doc and settings minor locks

`adapter-template/SPEC.md` §3 Demo ships as a clearly-marked authoring stub the init interview replaces. `adapter-template/CLAUDE.md` keeps a pointer to the harness plugin without restating its mechanics, and the plugin is not pre-enabled in the template's `settings.json` (init installs it opt-in, default-yes).

## Invariants

- Zero domain content in the baseline — no component, no fixtures, no canned responses.
- Every placeholder in code/config has a real referent that makes the materialized scaffold build.
- The template is library-agnostic — never accidentally Primer-shaped.

## Open items (deferred by decision)

- The real domain/LLM agent — folded in post-Phase-7. (The `{{Domain}}`/`{{mcp}}` tokens already ship in prose.)
- Live end-to-end runs of init's Claude-only steps (demo-arc interview, §3 authoring, harness-plugin install) — proven at the post-Phase-7 dogfood.
- The CLI delivery vehicle (npx or otherwise) — built post-Phase-7; the locked fill design carries over.
- Promotion of `adapter-template/` to a standalone repo — post-Phase-7 finalization.
