# Task 3.2 — Templatized docs + `.claude/`

Covers the prose/config surface of `adapter-template/`: `SPEC.md`, `CLAUDE.md`, all READMEs, and a clean `.claude/settings.json`. Implements TODO item **3.2** under Phase 3 (`_dev/docs/spec/phase-3-templatization-baseline.md`), the prose counterpart to 3.1's code tree.

## Scope

- Author every README in the template tree — root + `{{adapterPkg}}` + `client` + `agent` — closing all the `<!-- ... authored in 3.2 -->` markers 3.1 left.
- Author `adapter-template/SPEC.md` and `adapter-template/CLAUDE.md` as placeholdered artifacts.
- Author a clean `adapter-template/.claude/settings.json`.

## Locked decisions

### 1. Full prose surface, not just the root README

3.2 owns every README with an open `authored in 3.2` marker, plus the root README — not only the four headline artifacts. The TODO's singular "README" is shorthand; leaving the per-package markers open would ship dangling comments.

### 2. SPEC.md is the adopter's forward-looking design skeleton

`SPEC.md` describes the app the adopter intends to build, not the empty template's current state. The reference instance's §1–§7 structure is the reusable scaffold; the adopter fills tokens and authors §3.

### 3. `{{Domain}}` and `{{mcp}}` are introduced as prose tokens

These two tokens are bound to the scattered domain references in `SPEC.md` (§1 framing, §4 "domain-semantic", §5/§7 MCP). They remain absent from code/config, where 3.1's deferral stands (a code/config token must have a real build referent; prose has no build constraint). This **amends phase-3 decision 4**: "absent from the baseline entirely" narrows to "absent from baseline code/config." The data-driven init scan finds them wherever they live.

### 4. §3 Demo stays an authored-at-init stub

The §3 demo arc is structurally domain-shaped and is not tokenized; it ships as the marked authoring stub the init interview replaces (phase-3 decision 12 stands).

### 5. SPEC.md agent/transport stays the forward-looking real stack

§5/§7 keep the intended real stack ("A2A + Python + ADK + `{{mcp}}`", "React + `{{Library}}`"). ADK stays a literal, non-token prescribed default (agent-framework, neither library- nor domain-specific). The deterministic harness is not described in SPEC.md — that reality lives in the agent README. The personal reference "mirroring retz8/spartan-a2ui-adapter" is dropped. The plan's named care-spots (§1 "diff view", §2 `openPR(...)`, §4 "`sx`", §6 GitHub-as-host, §8 "diff viewer") are left for init-time specialization.

### 6. CLAUDE.md: de-forked header, self-contained §2 fetch recipe, kept §1/§3/§4

The header's sibling-fork / `upstream/main` phrasing is rewritten to no-fork canonical prose. §2 carries a self-contained fetch recipe: a throwaway shallow clone of canonical `a2ui-project/a2ui`, using the existing `ls-tree`/`show`/`grep` navigation vocabulary, with the spec path derived from `{{version}}` by transforming dots to underscores (`v0.9.1` → `specification/v0_9_1/`), read off `main` (the pin is the version directory; a recorded SHA is noted as the reproducibility option). §2 documents — does not decide — the two-version split: the protocol minor (`v0_9`) is pinned by the installed `@a2ui/*` packages' subpath and is not `{{version}}`. §1 is kept verbatim; §4 is kept with light `{{version}}` touch; the §3 harness subsection collapses to a bare pointer to the harness plugin (phase-3 decision 12).

### 7. settings.json ships empty/minimal

The template's `settings.json` carries no `hooks`, no `enabledPlugins`, and no `extraKnownMarketplaces`. Init registers the marketplace and enables the plugin together on opt-in. No `retz8-harness` reference reaches an adopter who declines the harness. The marketplace-registration line is pushed into 3.3 (authored, live-run deferred).

### 8. READMEs get a minimal pass; substantive rework deferred

All READMEs: token substitution preserving current style. Per-package markers are closed with short current-style blurbs, not deep rewrites. The root README's `agent/ — (planned)` line gets a one-line factual fix (the deterministic agent now ships). Substantive README rework is deferred to pre-Phase-7.

## Invariants

- Prose docs may carry domain tokens; code/config tokens must have a real build referent.
- The template stays library- and domain-agnostic by default — no `retz8-harness` reference for an adopter who declines the harness.

## Open items

- The phase-3 decision-4 amendment (narrowing "absent from the baseline entirely" to code/config) is to be reflected when that spec is next updated.
- Substantive README rework is deferred to pre-Phase-7.
