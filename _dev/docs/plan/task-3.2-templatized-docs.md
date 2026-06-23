# Plan — Task 3.2: Templatized docs + `.claude/`

Implements TODO **3.2** (Phase 3). Specs: `_dev/docs/spec/phase-3-templatization-baseline.md`,
`_dev/docs/spec/task-3.2-templatized-docs.md`.

Goal: author the prose/config surface of `adapter-template/` — every README, `SPEC.md`,
`CLAUDE.md`, and a clean `.claude/settings.json` — as placeholdered, library-/domain-agnostic
artifacts, closing the `<!-- authored in 3.2 -->` markers 3.1 left.

## Token vocabulary (already established by 3.1)

- `{{Library}}` — design-system display name (e.g. Primer)
- `{{libraryPkg}}` — design-system npm package (e.g. `@primer/react`)
- `{{adapterPkg}}` — adapter package name **and** its directory
- `{{agentPkg}}` — Python agent package name
- `{{version}}` — A2UI protocol version (e.g. `v0.9.1`)
- `{{repoSlug}}` — GitHub `owner/repo`
- **New prose-only tokens (this task):** `{{Domain}}`, `{{mcp}}` — SPEC.md only, never code/config
  (phase-3 decision 4 narrowed by task-3.2 decision 3).

## Steps

1. **Root `adapter-template/README.md`** (new file). Derive from reference `README.md`:
   tokenize (`a2ui-github` → repo identity stays generic; `Primer` → `{{Library}}`,
   `primer-a2ui-adapter` → `{{adapterPkg}}`). Fix the `agent/ — (planned)` bullet to state the
   deterministic A2A server ships now (task-3.2 decision 8). Keep getting-started / root-scripts
   sections verbatim (commands are token-free). Keep the in-development banner.

2. **`adapter-template/{{adapterPkg}}/README.md`** — close the `setup requirements & usage prose`
   marker with a short current-style blurb (what the package is, how a `catalog.json` is hosted,
   build prerequisites). Keep existing tokenized title + Commands block. Minimal pass
   (decision 8); no deep rewrite.

3. **`adapter-template/client/README.md`** — close the `setup requirements (theme provider, vite
   CSS-inline)` marker with a short current-style blurb generalized off the reference client README
   (theme provider wrapping, fixture dev-oracle). Keep Commands + A2A-server-URL sections. Drop the
   Primer/devtunnel-specific manual-verify detail (domain/instance-specific); keep it generic.

4. **`adapter-template/agent/README.md`** — close the `setup & usage prose` marker. Already largely
   authored in 3.1; verify the prose is token-free and accurate (deterministic harness, real agent
   in a separate slot). Add any missing setup note. Minimal pass.

5. **`adapter-template/SPEC.md`** (new file). Derive from reference `SPEC.md`:
   - Keep the §1–§7 skeleton structure (forward-looking design skeleton — decision 2).
   - Tokenize: `Primer` → `{{Library}}`, `@primer/react` → `{{libraryPkg}}`, version → `{{version}}`,
     the domain framing (GitHub maintainer triage, "GitHub-semantic") → `{{Domain}}`,
     GitHub MCP → `{{mcp}}` (decision 3).
   - §3 Demo: ship as a clearly-marked **authoring stub** the init interview replaces
     (decision 4 / phase-3 decision 12). Do not tokenize the demo arc.
   - §5/§7: keep the forward-looking real stack — A2A + Python + ADK + `{{mcp}}`, React + `{{Library}}`.
     ADK stays a literal non-token default (decision 5). The deterministic harness is **not**
     described here (lives in agent README).
   - Drop the "mirroring retz8/spartan-a2ui-adapter" personal reference (decision 5).
   - Leave the plan's named care-spots (§1 "diff view", §2 `openPR(...)`, §4 "`sx`", §6
     GitHub-as-host, §8 "diff viewer") for init-time specialization — do not tokenize them.

6. **`adapter-template/CLAUDE.md`** (new file). Derive from reference `CLAUDE.md`:
   - Header: rewrite the sibling-fork / `upstream/main` phrasing to no-fork canonical prose
     (decision 6).
   - §1 "What is A2UI?": keep verbatim.
   - §2: self-contained fetch recipe — throwaway shallow clone of canonical `a2ui-project/a2ui`,
     spec path derived from `{{version}}` by dots→underscores (`v0.9.1` → `specification/v0_9_1/`),
     read off `main`; note recorded-SHA as the reproducibility option. Document (not decide) the
     two-version split: protocol minor `v0_9` is pinned by the installed `@a2ui/*` package subpath
     and is **not** `{{version}}`. Drop the `sync spec` hook machinery.
   - §3 Conventions: keep "no guessed run commands"; collapse the daily-work-harness subsection to a
     **bare pointer** to the harness plugin (no restated mechanics — decision 6 / phase-3 dec 12).
   - §4 Maintenance: keep with light `{{version}}` touch.

7. **`adapter-template/.claude/settings.json`** (new file). Ship empty/minimal: no `hooks`, no
   `enabledPlugins`, no `extraKnownMarketplaces` (decision 7). Just `{}` or a minimal skeleton —
   init wires the marketplace + plugin opt-in (deferred to 3.3).

8. **Sweep + verify (in-scope checks):**
   - No new code/config token leaks: confirm `{{Domain}}`/`{{mcp}}` appear only in SPEC.md.
   - Grep the authored files for accidental hardcoded `Primer`/`@primer`/`GitHub`-domain
     identifiers outside placeholders and the kept care-spots (agnosticism spot-check).
   - Markdown sanity read.
   - Note: the full materialize-then-build green gate is **3.4's** job, not 3.2's. 3.2 authors prose;
     it does not run `build:all`. Run available repo lint/format on touched files where cheap.

## Out of scope

- The init skill / mechanical fill (3.3).
- Materialization smoke test + agnosticism grep harness (3.4).
- Any code/config change, any `{{Domain}}`/`{{mcp}}` in code.
- Marketplace-registration line in settings.json (pushed to 3.3).
