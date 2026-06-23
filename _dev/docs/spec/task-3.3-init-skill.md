# Task 3.3 — Init skill

Authors the init skill that materializes a real instance from `adapter-template/`, the template's permanent `.claude/skills/` content, and the root mechanical-fill script. Implements TODO **3.3** under Phase 3 (`_dev/docs/spec/phase-3-templatization-baseline.md`). Authoring only — "green" is proven in 3.4.

## Scope

- A standalone mechanical-fill script at the template root.
- The init skill that drives materialization: token collection, demo-arc interview, fill, plugin install, self-delete.
- The template's permanent `.claude/skills/` content (`a2ui-sdk-design`), plus the plugins enabled in `settings.json`.
- Out of scope: running the verification (3.4), and the future CLI delivery vehicle.

## Locked decisions

### 1. Mechanical core is a standalone non-interactive script

The fill logic is a standalone script (node), not prose the agent executes. It reads a values map, substitutes tokens across file **contents and file/directory names**, renames the token-named directories, and asserts no `{{…}}` tokens remain afterward. It never prompts — values come in, the filled tree comes out. Justified by two needs: the init skill must perform the fill, and the 3.4 smoke test must run it non-interactively and deterministically.

### 2. No scan/discovery step

The token set is known (8 tokens), so the script does not discover tokens before filling. The only token-presence check is the post-fill assertion that none remain.

### 3. Token set is the 8 known tokens, all collected up front

Six build tokens (`{{adapterPkg}}`, `{{agentPkg}}`, `{{Library}}`, `{{libraryPkg}}`, `{{version}}`, `{{repoSlug}}`) and two prose tokens (`{{Domain}}`, `{{mcp}}`). All eight are collected in the first init step and written to the values map the script consumes.

### 4. Input contract is a values file

The script's input is a values file (JSON), not flags. The init skill writes it before invoking the script; the 3.4 smoke test commits a fixed fixture values file; a future CLI maps its flags into the same file. The values file is a transient init input, removed on self-delete.

### 5. Script lives at the template root

The fill script is a first-class materialization core at `adapter-template/` root, not subordinate to the init skill (a future CLI is its consumer, not the skill). Two consequences: it is added to the eslint `ignores` (it would otherwise be linted during 3.4's verify, since self-delete is never triggered there), and self-delete removes both the root script and the init skill directory.

### 6. Init flow

The init skill performs five phases, in order:

1. **Collect all 8 tokens** → values file. This step is the future-CLI seam — the CLI replaces exactly this step with flags.
2. **Demo-arc interview** → the SPEC §3 Demo narrative (Claude judgment).
3. **Run the fill script** on the values file, and **author the SPEC §3 Demo prose** (replacing the authoring stub).
4. **Enable the daily-work harness + superpowers plugins** in `settings.json` (opt-in, default-yes).
5. **Guarded self-delete.**

### 7. Mechanical fill is separable from the Claude-only steps

The mechanical part (write values file → run fill script) is cleanly separated from the Claude-judgment steps (demo-arc interview, §3 authoring, plugin install, self-delete). A future CLI subsumes exactly step 1 plus the fill. No CLI seam, `bin/`, or publish wiring is added now; the script may be reimplemented (e.g. in Rust) as the post-Phase-7 publish vehicle, with the locked design carrying over.

### 8. Self-delete is structurally guarded

Self-delete exists only in the init skill's terminal step. The 3.4 smoke test invokes the fill script directly and never the skill, so self-delete is never triggered and the smoke test asserts the init files still exist afterward. A real adopter run executes all five phases including self-delete.

### 9. `a2ui-sdk-design` is vendored into the template, edited

`a2ui-sdk-design` ships in the template's `.claude/skills/` as default content (not fetched). Its Specifications Navigation section is rewritten: the `../A2UI` sibling-fork / sync-spec / `upstream/main` machinery is replaced with the pinned-ref fetch from `a2ui-project/a2ui` parameterized by `{{version}}` (matching `CLAUDE.md` §2). The `a2ui-github` self-reference and the Primer examples are genericized to placeholders.

### 10. The superpowers skill set comes from the plugin, not vendored

The planning/execution skills the nightly routine depends on (`writing-plans`, `subagent-driven-development`, and their closure) come from the **superpowers plugin** (`superpowers@claude-plugins-official`), enabled in the committed `settings.json`. A repo-scoped nightly inherits the plugin from those committed settings, getting the whole self-consistent skill set with no `.claude/skills/` copies and no `skills-lock.json`. Init step 4 enables this plugin alongside the harness.

### 11. Only `a2ui-sdk-design` is vendored; it is permanent template content

`a2ui-sdk-design` — the project's own skill, in no plugin — is the only vendored skill; it survives materialization and is never self-deleted. Only the init skill and the root fill script self-delete.

## Invariants

- The fill script is non-interactive — values in, filled tree out; it never prompts.
- The superpowers skills come from the plugin enabled in the committed `settings.json` (so the nightly inherits them); only `a2ui-sdk-design`, the project's own skill, is vendored.

## Open items

- The Rust CLI publish vehicle, and whether it reuses or reimplements the fill script — deferred to post-Phase-7.
- Whether a headless/cron nightly honors `enabledPlugins` and installs from the marketplace at startup — plugin mode assumes yes (mirrors the harness plugin); to be confirmed in Phase 4.
