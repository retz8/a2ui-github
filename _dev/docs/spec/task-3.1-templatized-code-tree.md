# Task 3.1 — Templatized code tree

Extract the code half of `adapter-template/` from the post-Phase-2 reference instance — adapter + client + deterministic agent + root build config — domain content stripped, the remainder placeholdered in contents and paths. Realizes sub-task 3.1 of `_dev/docs/spec/phase-3-templatization-baseline.md`. Structural completeness only; "green" is proven in 3.4.

## Scope

- Create `adapter-template/` carrying the adapter, client, deterministic-agent, and root-config scaffolds as an empty-but-wired tree.
- Strip all domain content (`Text`/`Button`, fixtures, canned responses, `console-log`, component-specific tests) and replace what remains with placeholders and marked seams.
- Sweep the reference instance itself to the neutralized identifiers so reference and template do not drift.
- Out of scope for 3.1: the prose docs (`SPEC.md`/`CLAUDE.md`/root and per-package README *content*), `.claude/`, the init skill, and any verification — those belong to 3.2/3.3/3.4.

## Locked decisions

### 1. Token set

Six tokens, amending the phase spec's decision 4:

- `{{Library}}` — the design-system display name (Pascal, e.g. `Primer`). **Prose-only** — it does not appear in the 3.1 code tree; it lands in 3.2's docs.
- `{{libraryPkg}}` — the library npm package (`@primer/react`). The only library token in 3.1 code/config; survives in `package.json` dependencies.
- `{{adapterPkg}}` — the adapter package name `primer-a2ui-adapter`, **including its directory name**.
- `{{agentPkg}}` — the agent uv-project name (`pyproject.toml` `name`, currently `a2ui-github-agent`). Names the umbrella project housing the agent group (the deterministic harness now, a real agent later), not the deterministic module.
- `{{version}}` — the catalog version (`v0.9.1`). Drives the catalog directory/path and the catalog-id URL only.
- `{{repoSlug}}` — `retz8/a2ui-github`. Doubles as the repo identity and the host segment of the catalog-id URL.

`{{Domain}}` and `{{mcp}}` remain deferred to the post-Phase-7 real-agent batch.

### 2. Frozen literals — protocol pinned to v0.9

The protocol namespace stays literal, not tokenized: the `v0_9` import namespace, `version="v0.9"`, and `VERSION_0_9`. The template targets A2UI protocol v0.9; adopting a later protocol (e.g. a future 1.0) is a deliberate `@a2ui/*` package-major migration, not a token re-fill. The v0.9 support is stated explicitly in the prose docs (3.2); the frozen code literals are its embodiment. Also literal: `github.com/blob/main` in the catalog-id, the `deterministic_agent/` module and its imports, the `client/` and `agent/` directory names, and the root config files.

### 3. Neutralized identifiers, swept in both template and reference

Library-named code identifiers are renamed to library-neutral forms — `PRIMER_CATALOG` → `CATALOG`, `PRIMER_CATALOG_ID` → `CATALOG_ID`, and the Python catalog label `from_path("primer", …)` → `from_path("adapter", …)`. The package name already encodes library identity; the catalog symbols do not repeat it. This rename is applied to the reference instance as well as the template, so the two do not diverge.

### 4. Empty catalog envelope

The adapter ships an empty catalog: an empty component/function construction, and a `catalog.json` with empty `components`, `functions`, and `$defs` (no `anyComponent`/`anyFunction`). `catalog.json` carries no inline comment (it stays pure data). A link to the official A2UI v0.9 specification is left as a comment in `catalog.ts`, using the frozen protocol form. The first component reintroduces the envelope's `oneOf` members. If the schema loader rejects a fully-empty catalog, fall back to a minimal never-matching but valid form.

### 5. Stubbed agent: component-free proof-of-receipt

The deterministic agent ships as plumbing plus a stubbed executor that returns no component. On an action it echoes a component-free `updateDataModel` proof-of-receipt stamped with the surfaceId — keeping the token-free round-trip demonstrable without any catalog component. The `responses.py` fixture-loading and surfaceId-stamping machinery is kept but empty (`_EVENT_FIXTURES` empty, empty `fixtures/`). The agent's repo/phase-flavored identity is neutralized: `pyproject` `name` → `{{agentPkg}}`, descriptions and README lose the repo name, phase numbers, and the repo-named reserved-module-slot note; the agent-card name stays its descriptive literal.

### 6. Catalog-id URL decomposition

The catalog-id URL is decomposed as `https://github.com/{{repoSlug}}/blob/main/{{adapterPkg}}/catalogs/{{version}}/catalog.json`, in both `catalog-id.ts` and `catalog.json`. The `github.com/blob/main` GitHub-hosting skeleton is kept as the default; an adopter hosting elsewhere edits it. The reference's `TODO(phase-2)` comment is reframed into an adopter-facing marker comment describing this as the canonical hosted catalog URL and a fill/decision point.

### 7. Client library-coupling stripped to marked seams

The Primer-API-shaped spots in the client are removed rather than tokenized, to keep the baseline library-agnostic: `App.tsx` renders the test space bare with a marker comment at the theme-provider wrap point, and the `vite.config` library CSS-inline is dropped to a marker comment. `{{libraryPkg}}` consequently disappears from client code/config and survives only as a `package.json` dependency (a real build referent via install resolution). The adopter setup-requirements prose for these seams is authored in the README during 3.2.

### 8. Test survival — plumbing smoke kept, domain stripped, three conversions

Tests are reduced to the plumbing-smoke layer that stands green with zero domain content; everything asserting a concrete component, fixture, or canned response is stripped. Surviving: the adapter catalog-envelope smoke (trimmed `catalog.test`), the client transport/app-shell smoke (`a2a-sdk.smoke`, a scrubbed `a2a.test`, `App.test`), and the agent import/server/catalog-load smoke (`test_smoke`, neutralized `test_server`, trimmed `test_catalog`, `helpers.py`). Three conversions: scrub the catalog-literal mock payloads out of the client `a2a.test`, trim `catalog.test` to envelope assertions, and replace the agent `test_executor` with the proof-of-receipt smoke. Stripped: adapter parity + component + console-log tests; client `actions`/`render`/`round-trip-render`/`fixtures`/`selector`/`helpers`; agent `test_responses`/`test_conformance`.

### 9. Playwright scaffolding kept with a smoke

The Playwright visual-regression scaffolding (config, `test:e2e` script, dependency) is kept as reusable harness infra. The committed baseline PNGs and the component visual spec are dropped; the spec is replaced with a non-screenshot smoke (app shell mounts), so no platform-locked baseline is committed. Playwright is not part of the green bar.

### 10. Marker conventions and empty directories

Every empty-but-wired stub carries adopter-facing guidance. Files with comment support (`catalog.ts`, `responses.py`, `executor.py`, the client seams) get inline marker comments. Empty directories (`components/`, both `fixtures/`) get a one-line marker file that both keeps the directory tracked and carries the "add your component / canned response here" note. `catalog.json` carries no inline marker. The `index.html` title is neutralized to a generic literal.

### 11. README ownership split

3.1 produces the code tree and its terse in-code marker comments. The substantive README prose — adopter setup requirements and templatized per-package descriptions — is authored in 3.2's docs pass. README files are carried over in 3.1 with tokens substituted and skeleton/phase notes dropped; their setup-requirements sections are 3.2's.

## Invariants

- Zero domain content in the baseline — no component, no fixtures, no canned responses.
- Every placeholder in code/config has a real referent that makes the materialized scaffold build.
- The template is library-agnostic — never accidentally Primer-shaped, including in API-shaped spots a package-name token alone would not cover.

## Open items

- Whether the schema loader accepts a fully-empty `catalog.json`; if not, decision 4's minimal never-matching fallback is used. Confirmed during 3.1 implementation.
