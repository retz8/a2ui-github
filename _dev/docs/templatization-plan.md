# Templatization plan

Plan for generalizing `a2ui-github` into a reusable shape: any A2UI app = a design-system library (Primer / Atlassian / MUI …) × a domain agent (GitHub / Jira / Calendar …). Approach: **repo-per-instance + harness-as-plugin.**

`a2ui-github` is the **reference instance**. The template and the harness plugin are derived from it.

## Three artifacts

| Artifact | Scope | Owns |
|---|---|---|
| **Daily-work harness plugin** | General — not A2UI, not user-specific | `pick-up-task`, `wrap-up`, `rebase-with-main`, `daily-workflow.md`, the harness operational rules; scaffolds + drives `_dev/` |
| **A2UI template repo** | Adoptable by anyone building an A2UI app | code scaffold (adapter / client / agent), `SPEC.md`, `CLAUDE.md`, the init skill, the pinned-ref spec-fetch. Vendors **no** A2UI content |
| **Reference instance** (`a2ui-github`) | This project | The matured source the template and harness are extracted from |

The two artifacts are independently adoptable: the harness works on non-A2UI projects; the template works without the harness.

## Ownership boundary

- **Template repo = the product.** Code scaffold, `SPEC.md`, `CLAUDE.md`, init skill, build config.
- **Harness plugin = the process.** Skills, `daily-workflow.md`, and the `_dev/` working area (`TODO.md`, `docs/spec/`, `docs/plan/`, `docs/handoff/`) — scaffolded and driven by the plugin. `_dev/` is a harness artifact, not a template artifact.

## Init skill

Template-owned, ships in the template's `.claude/skills/`. One-shot, do-everything setup:

1. Fill `{{...}}` placeholders across the code, `SPEC.md`, and `CLAUDE.md`.
2. Interview and write `SPEC.md` §3 Demo inline.
3. Fetch `a2ui-sdk-design` from canonical upstream at the pinned protocol-version ref; materialize into the instance's `.claude/skills/`.
4. Install the harness plugin — **opt-in, default-yes**.
5. Self-delete on success.

Variables: `{{Library}}`, `{{libraryPkg}}`, `{{adapterPkg}}`, `{{Domain}}`, `{{mcp}}`, `{{version}}`, `{{repoSlug}}`.

## SPEC.md and CLAUDE.md

Both are **physical template-repo artifacts** with `{{...}}` placeholders, swapped at init. Claude Code only auto-loads the repo's own `CLAUDE.md`, so it must live in the repo.

- **`SPEC.md`** — §1, §2, §4–§7 are mostly placeholder-fill. §3 Demo is authored per instance (init interview). Substitution is **placeholder-fill, not global find/replace** — three spots need care:
  - §6 "a **GitHub** URL pointing to the hosted catalog.json" is the github.com *host* (invariant), not the domain — must not be swapped to `{{Domain}}`.
  - §1 "diff view", §2 `openPR(...)`, §8 "diff viewer" are domain-flavored *examples* — specialized while authoring §3, not via a token.
  - §4 "`sx` passthrough" is a library-flavored term, not the `{{Library}}` name.
- **`CLAUDE.md`** — content is project-facing rules (what-is-A2UI, protocol version, conventions, maintenance) **plus a pointer to the harness plugin**. The harness mechanics live in the plugin, not restated here.

## Spec & skill sourcing

The template vendors none of A2UI's own content. It pins a protocol version (`{{version}}`) and sources upstream artifacts from canonical `a2ui-project/a2ui` at that ref:

- **Schemas / spec** — read from the canonical repo at the pinned ref. No local fork, no sibling `../A2UI`, no `sync-spec` hook.
- **`a2ui-sdk-design`** — fetched at the pinned ref by init, materialized into the instance (committed, persistent). Bumping the protocol version is a re-fetch.

## Sequencing

**Track A — harness plugin (early, independent).** Extract the general harness into a plugin soon; `a2ui-github` consumes it and dogfoods the general / not-user-specific property.

**Track B — A2UI template (baseline early, enriched late).**
1. **After Phase 2** — extract the baseline template: workspace + build config, adapter scaffold (placeholders), the minimal FE space + first catalog component as the worked example, `SPEC.md` / `CLAUDE.md` (placeholders), init skill, pinned-ref spec-fetch. FE-only — no agent yet. This is a **checkpoint extraction, not a release**.
2. Continue building `a2ui-github` as the reference; correct the baseline as the shape firms up.
3. **After `a2ui-github` is done** — additively fold in the catalog-writing skill (Phase 3) and the agent scaffold (Phase 5, domain / MCP placeholders). Finalize as the adoptable template — its first real use.
