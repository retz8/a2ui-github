---
name: init
description: Use ONCE on a fresh a2ui-app template clone to materialize a real instance — collect the 8 tokens, interview for the demo, fill placeholders, author SPEC §3, install the daily-work harness (opt-in), then self-delete.
---

# Init — materialize this template into a real A2UI app

This template is an **unfilled scaffold**: it carries `{{...}}` placeholders and zero domain
content. This skill turns it into a real instance in one pass. Run it **once, on a fresh clone**,
before any build. It self-deletes on success, so it never runs against an already-materialized repo.

The flow has a mechanical half and a judgment half, deliberately separable:

- **Mechanical** (phase 1 token collection + the phase-3 fill) — values in, filled tree out. This is
  the **future-CLI seam**: a CLI will replace exactly the token-collection step with flags writing the
  same values file, then call the same `fill.mjs`.
- **Judgment** (phases 2, the §3 authoring in phase 3, and phase 4) — interview, prose authoring, and
  the opt-in harness install. These stay Claude-driven.

Do the five phases **in order**.

---

## Phase 1 — Collect the 8 tokens → `init.values.json`

The template uses exactly **8 tokens**. Six are build-relevant (they appear in code/config and must
have real referents that build); two are prose-only. Interview the adopter for each, then write the
values file. Do **not** invent values — ask.

| Token | What it is | Example |
|---|---|---|
| `adapterPkg` | The publishable adapter's npm package name **and** its directory name (one token spans both — the `{{adapterPkg}}/` dir is renamed by the fill). | `primer-a2ui-adapter` |
| `agentPkg` | The Python agent project name (`agent/pyproject.toml` `[project].name`). | `github-a2a-agent` |
| `Library` | The design-system display name, used in prose. | `Primer` |
| `libraryPkg` | The design-system npm package the client depends on. | `@primer/react` |
| `version` | The pinned A2UI spec/catalog version, `vX.Y.Z` (also the `catalogs/{{version}}/` dir). | `v0.9.1` |
| `repoSlug` | The GitHub `owner/repo` where `catalog.json` is hosted (used in the catalog-ID URL). | `retz8/a2ui-github` |
| `Domain` | The domain phrase the app serves (prose only). | `GitHub maintainer triage` |
| `mcp` | The MCP server the agent will use (prose only). | `GitHub MCP` |

Write the values file at the template root with **bare keys** (no braces):

```bash
cat > init.values.json <<'JSON'
{
  "adapterPkg": "...",
  "agentPkg": "...",
  "Library": "...",
  "libraryPkg": "...",
  "version": "...",
  "repoSlug": "...",
  "Domain": "...",
  "mcp": "..."
}
JSON
```

> **CLI seam:** everything above this line is what a future CLI subsumes (its flags write the same
> `init.values.json`). Everything below stays Claude-driven.

---

## Phase 2 — Demo-arc interview

`SPEC.md` §3 (Demo) is the one section that is **not** tokenized — the demo arc is inherently
`{{Domain}}`-shaped. Interview the adopter to gather it (don't write yet — §3 is authored in phase 3,
after the fill, so the surrounding `{{...}}` are already resolved). Cover:

- The **anchor flow** — the single end-to-end story the demo tells.
- **Persona framing** — who is driving and what they're trying to do.
- **Action scope** — read-only vs. compose-and-confirm vs. write.
- The **prompt-arc beats** — broad → narrow → drill → act.
- **Detail-view depth** — how far a drill-down goes.

Hold this narrative for phase 3.

---

## Phase 3 — Run the fill + author SPEC §3

**3a. Fill the placeholders** (mechanical, non-interactive):

```bash
node fill.mjs init.values.json
```

Expect: `fill: done — N file(s) filled, M path(s) renamed, 0 tokens left.` and exit 0. The fill
substitutes every `{{...}}` across contents and file/dir names, renames the token-named directories
(`{{adapterPkg}}/`, `catalogs/{{version}}/`), and asserts none remain. It **excludes** the init
machinery (this skill, `fill.mjs`, `init.values.json`) from its scan, so those keep their literal
`{{...}}` documentation — that is expected and is cleaned up by the phase-5 self-delete. If the script
exits non-zero, stop and resolve the reported residual tokens before continuing — do **not** proceed
to self-delete.

**3b. Author `SPEC.md` §3** — replace the `⚠️ Authoring stub — replaced at init` block with the demo
narrative from phase 2. While authoring, hand-specialize the domain-flavored **examples** elsewhere in
the spec (these are intentionally not tokens, per the templatization plan's care-spots):

- §1 "diff view", §2 `openPR(...)`, §8 "diff viewer" — replace with examples from your own `{{Domain}}`.
- **Leave alone:** the §6 "a GitHub URL pointing to the hosted `catalog.json`" — that is the
  **github.com host** (invariant), not your domain. And the §4 "`sx` passthrough" term — a
  library-flavored concept, not the `{{Library}}` name.

---

## Phase 4 — Install the daily-work harness (opt-in, default-yes)

Ask the adopter whether to install the daily-work harness plugin (**default yes**). It supplies the
phases → sub-tasks → branching → wrap-up workflow referenced in `CLAUDE.md` §3.

If **yes**, register the marketplace and enable the plugin by writing the instance's
`.claude/settings.json`:

```json
{
  "extraKnownMarketplaces": {
    "retz8-harness": {
      "source": { "source": "github", "repo": "retz8/daily-work-harness" }
    }
  },
  "enabledPlugins": {
    "daily-work-harness@retz8-harness": true
  }
}
```

Equivalent interactive form:

```text
/plugin marketplace add retz8/daily-work-harness
/plugin install daily-work-harness@retz8-harness
```

If the adopter **declines**, leave `.claude/settings.json` as `{}` — no `retz8-harness` reference
reaches them. The vendored skills under `.claude/skills/` (the `a2ui-sdk-design` design guide and the
superpowers planning/execution set) are **not** a plugin and work regardless of this choice.

---

## Phase 5 — Guarded self-delete

Only after phases 1–3 succeeded — the fill reported `0 tokens left.` **and** §3 no longer contains the
authoring stub — remove the init machinery:

```bash
rm -f fill.mjs init.values.json
rm -rf .claude/skills/init
```

**Guards:**

- Do **not** self-delete if `fill.mjs` exited non-zero, or if `SPEC.md` §3 still contains the
  `Authoring stub — replaced at init` marker.
- Delete **only** `fill.mjs`, `init.values.json`, and `.claude/skills/init/`. Everything else under
  `.claude/skills/` (`a2ui-sdk-design` + the seven superpowers skills) is **permanent template
  content** — never delete it.

After self-delete, the repo is a normal, fully-materialized project. Proceed to the build steps in
`README.md`.
