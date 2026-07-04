# Task 4.1 — Adapter Surface Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Author the adapter surface of the two catalog-authoring skills — the adapter *design* procedure into `design-catalog-component/SKILL.md` and the adapter *build/test* procedure into `build-catalog-component/SKILL.md` — and establish the shared decision-doc contract.

**Architecture:** The deliverable is **prose in two `SKILL.md` files**, no product code. The Design section captures the prop-surface decision checklist that produces the decision doc; the Build & Test section captures the mechanical loop that transcribes that doc into the adapter artifacts. Because nothing is executed, each task's verification is a **read-through** against the already-shipped `Text`/`Button` adapter artifacts in `primer-a2ui-adapter/` — "if I followed this procedure, would I reproduce those files?" — not a test run. Worked code appears only as teaching-sized inline snippets modelled on the real files.

**Tech Stack:** Markdown (Claude skill `SKILL.md` bodies). Ground-truth artifacts are TypeScript/zod/JSON under `primer-a2ui-adapter/`.

## Global Constraints

- **Two target files, body sections only:** `.claude/skills/design-catalog-component/SKILL.md` and `.claude/skills/build-catalog-component/SKILL.md`. **No YAML frontmatter** — frontmatter/overview/orchestration are deferred to 4.4.
- **No product code is written.** Validation is a read-through against the shipped `Text`/`Button` adapter artifacts.
- **Self-contained:** the prop-surface checklist embeds the catalog-authoring conventions (per-component fidelity, bound-state-vs-config, de-branding, synthetic-content-prop). Only **spec-navigation** points to the `a2ui-sdk-design` skill; nothing else is pointed out for. No dependency on `_dev/docs` findings.
- **Teaching-sized inline snippets**, not a full reproduction of both components. Full ground truth stays in the repo (that is what the read-through checks against).
- **Descriptions belong to Design** (recorded in the decision doc); the **render is fully mechanical** from the decision-doc table (Build), with no render-specific field in the doc.
- **Decision doc is well-structured markdown**, prop surface as a table; the bar is completeness/unambiguity so an autonomous Build run needs no human.
- **4.1 locks only the shared frame:** the component-level header, the full adapter section, and the append-convention (one doc per component, one section per surface, later surfaces append rather than restructure). Client/agent section internals are left to 4.2/4.3.
- **Location is a project convention:** the skills refer to "the project's component-decision location"; this project's is `_dev/docs/new-components/<component-name>.md`.
- **Branch & commits:** implementation lands in a worktree `phase-4/1-adapter-surface` off `main` (via `daily-work-harness:rebase-with-main`), carrying only the `.claude/skills/**` files — never `_dev/`. Conventional commits: `feat(phase-4): …`.

**Source artifacts to model against (read these first):**
- Design substance: `_dev/docs/plan/task-2.1-catalog-foundation-text.md` and `_dev/docs/plan/task-2.2-button.md` (their "Global Constraints" + "Notes for the implementer"); `_dev/docs/a2ui-findings.md`; `.claude/skills/a2ui-sdk-design/SKILL.md` ("Catalog Authoring Conventions").
- Adapter code ground truth: `primer-a2ui-adapter/src/components/{text,button}/{*.schema.ts,*.tsx,*.schema.test.ts,*.test.tsx,index.ts}`; `primer-a2ui-adapter/src/functions/console-log.ts` (+ `.test.ts`); `primer-a2ui-adapter/src/catalog.ts`; `primer-a2ui-adapter/src/catalog.test.ts`; `primer-a2ui-adapter/src/catalog.parity.test.ts`; `primer-a2ui-adapter/catalogs/v0.9.1/catalog.json`.

---

## File Structure

- `.claude/skills/design-catalog-component/SKILL.md` — **created** (Task 1). Body only. Holds the adapter *design* section: the prop-surface checklist, the two inputs + real-prop resolution method, and the decision-doc format + inline example + append-convention (the shared frame).
- `.claude/skills/build-catalog-component/SKILL.md` — **created** (Task 2). Body only. Holds the adapter *build/test* section: the mechanical loop that transcribes the decision-doc table into the six adapter artifacts + the optional functions sub-loop.
- `.claude/skills/new-catalog-component/` — **removed** (Task 1). Empty, untracked; retired by the re-spec.

Task 1 must precede Task 2: the Build section consumes the decision-doc format that Task 1 defines.

---

### Task 1: Design skill — adapter section

Author the adapter *design* procedure into `design-catalog-component/SKILL.md`: the prop-surface checklist (input → design call → locked table) and the decision-doc contract it produces. This task also establishes the shared frame (header + append-convention) that 4.2/4.3 extend.

**Files:**
- Create: `.claude/skills/design-catalog-component/SKILL.md`
- Remove: `.claude/skills/new-catalog-component/` (empty dir)

**Interfaces:**
- Consumes: nothing (first task).
- Produces: the **decision-doc format** — a markdown component doc with a component-level header (`name`, official doc URL, resolved-type reference) and per-surface sections, whose adapter section is a **prop-surface table** with columns `prop | decision (carry/drop/defer) | synthetic? | A2UI type | description`, plus a **functions** list and a **deferrals** list. Task 2's Build section relies on exactly these column names and the header fields.

- [ ] **Step 1: Read the source artifacts**

Read the four design-substance sources and the two shipped schemas (`button.schema.ts`, `text.schema.ts`) listed under Global Constraints. Confirm the prop-surface decisions they encode before writing any prose.

- [ ] **Step 2: Remove the retired empty skill folder**

```bash
rmdir .claude/skills/new-catalog-component
```
Expected: succeeds (the folder is empty and untracked).

- [ ] **Step 3: Write the section intro + the two inputs**

Create `.claude/skills/design-catalog-component/SKILL.md` starting with the adapter section (no frontmatter). Content:
- One line stating the adapter design step produces the **adapter section of the component decision doc** at the project's component-decision location (this project: `_dev/docs/new-components/<component-name>.md`).
- **Two inputs**, both required: (a) the component's **official documentation URL** — human-provided; source of the documented surface and the prose semantics that become descriptions; (b) the component's **real prop surface**, agent-resolved from its **installed type declarations**.
- **Real-prop resolution method**, prescribed concretely but design-system-agnostic: locate the component's type in the installed package's declarations and follow intersections/spreads to enumerate every real prop; reconcile against the official doc (doc gives documented surface + meaning, types give the exhaustive surface + what must be dropped). No package- or path-specific detail baked in.

- [ ] **Step 4: Write the prop-surface decision checklist**

Add the checklist — the per-prop design call. For each real (and synthetic) prop, decide, embedding the conventions self-contained:
- **Carry / drop / defer.** Drop props with no A2UI representation (the non-`aria-*` HTML-attribute spread — `type`, `name`, `tabIndex`, `data-*`); defer non-JSON-serializable/element-typed props with a reason.
- **Synthetic-content-prop rule.** When a component takes content via `children` (raw content, not component references), introduce a synthetic value prop to carry it (`text` on Text; `child` as a `ComponentId` on Button).
- **A2UI type selection.** Bound runtime state → `Dynamic*`; fixed authoring-time configuration → plain (`z.boolean`/`z.string`/`z.number`); enums → `z.enum` (no `DynamicEnum`); interaction → `Action`; content reference → `ComponentId`; accessibility → `AccessibilityAttributes`.
- **Per-component fidelity.** Carry a protocol common **only where the component's real type exposes that capability** — not a uniform base (Button carries `accessibility` because its type spreads `ButtonHTMLAttributes`; Text does not).
- **De-branded description.** Author the semantic description here; never name the design system/renderer.

State that only **spec-navigation** (reading the upstream protocol spec) points to the `a2ui-sdk-design` skill; the conventions above are stated inline, not pointed out for.

- [ ] **Step 5: Write the decision-doc format + inline example + append-convention (the shared frame)**

Add the contract:
- **Decision-doc format:** the component-level header (name · official doc URL · resolved-type reference) and the adapter section = the prop-surface table (columns `prop | decision | synthetic? | A2UI type | description`) + a **functions** list (name · args · returnType, when the component needs a local function) + a **deferrals** list (prop · reason).
- **One inline filled-table example** — a teaching-sized snippet of a filled adapter table, modelled on `Button` (rows for `child`, `action`, `variant`, `disabled`, `accessibility`, a deferral row for `icon`, and the `consoleLog` function). Not the full component.
- **Append-convention:** one shared doc per component; one section per surface; later surfaces (client, agent) **append** their sections and never restructure the doc. Frame the location as "the project's component-decision location."
- State that the doc is **well-structured markdown** read by a human and by the Build LLM (nothing parses it); the bar is **completeness and unambiguity** so an autonomous Build run needs no human.

- [ ] **Step 6: Read-through validation against `Text` + `Button`**

Walk the checklist as written and confirm it reproduces the real decisions (no code executed — compare against the shipped files):
- **Button:** required `child` (synthetic `ComponentId`) + `action` (`Action`); `variant`/`size`/`alignContent` (`z.enum`); `disabled`/`loading`/`inactive` (`DynamicBoolean`); `count` (`DynamicString`); `block`/`labelWrap` (plain `z.boolean`); `loadingAnnouncement` (plain `z.string`); `accessibility` (`AccessibilityAttributes`, carried because the type spreads `ButtonHTMLAttributes`); deferrals `icon`/`leadingVisual`/`trailingVisual`/`trailingAction`; the `consoleLog` function. Cross-check against `primer-a2ui-adapter/src/components/button/button.schema.ts` and `_dev/docs/plan/task-2.2-button.md`.
- **Text:** synthetic `text` (`DynamicString`, required) + `as`/`size`/`weight`/`whiteSpace` (local `z.enum`); **no** `accessibility`. Cross-check against `primer-a2ui-adapter/src/components/text/text.schema.ts`.

Fix any checklist wording that would not reproduce these. Expected: both reproduce exactly.

- [ ] **Step 7: Commit**

```bash
git add .claude/skills/design-catalog-component/SKILL.md
git commit -m "feat(phase-4): author adapter design section + decision-doc contract"
```

---

### Task 2: Build & Test skill — adapter section

Author the adapter *build/test* procedure into `build-catalog-component/SKILL.md`: the mechanical loop that transcribes the decision-doc table (from Task 1) into the six adapter artifacts and their tests, plus the optional local-function sub-loop. No human input.

**Files:**
- Create: `.claude/skills/build-catalog-component/SKILL.md`

**Interfaces:**
- Consumes: the **decision-doc format** from Task 1 (header fields; table columns `prop | decision | synthetic? | A2UI type | description`; functions list; deferrals list).
- Produces: nothing downstream in 4.1 (client/agent build sections are 4.2/4.3).

- [ ] **Step 1: Read the adapter code ground truth**

Read the adapter code artifacts listed under Global Constraints — the two component folders, `console-log.ts`, `catalog.ts`, `catalog.test.ts`, `catalog.parity.test.ts`, `catalog.json` — and the task structure of `_dev/docs/plan/task-2.1-*.md` / `task-2.2-*.md`. This is the loop the Build section captures.

- [ ] **Step 2: Write the section intro**

Create `.claude/skills/build-catalog-component/SKILL.md` starting with the adapter section (no frontmatter). One line: the adapter build/test step **consumes the component's decision doc** and mechanically materializes the adapter artifacts + tests; it takes **no human input** (any judgment already happened in Design).

- [ ] **Step 3: Write the mechanical loop — the six adapter artifacts, in order**

Author each as a step with a teaching-sized snippet modelled on the shipped files:
1. **zod schema** — `src/components/<name>/<name>.schema.ts`: each table row → a zod line (A2UI type → `CommonSchemas.*` / `z.enum` / plain; required vs `.optional()`); `ComponentApi` is **props-only** (no `component`/`id`) and ends `.strict()`. Model: `button.schema.ts`.
2. **render** — `<name>.tsx`: a plain-props `View` + `createComponentImplementation` wiring. Mechanical mappings **derived from the table types**: `Action`→`onClick`, `ComponentId`→`buildChild`, `AccessibilityAttributes`→`aria-*`, `Dynamic*`→resolved primitive. Capture the conventions as build notes: pass resolved props explicitly (no spread — resolved props carry extra binder setters); cast `accessibility` to the resolved shape; tolerate the missing-`ThemeProvider` warning. Model: `button.tsx`, `text.tsx`.
3. **`catalog.json` entry** — `catalogs/<version>/catalog.json`: each row → `$ref` hosted `common_types` (commons/`Dynamic*`) or `type`+`enum` (enums) or plain `type`; the `component` discriminator const; `required`; `unevaluatedProperties: false`; **descriptions copied from the decision doc**; add the component to `$defs.anyComponent.oneOf`. Model: `catalog.json`.
4. **parity registry entry** — `src/catalog.parity.test.ts`: add the component to the `COMPONENTS` registry map (the existing `describe.each` loop covers it — no per-component assertions to copy). Model: `catalog.parity.test.ts`.
5. **catalog registration** — `src/catalog.ts`: add the component implementation to the `new Catalog(...)` components array. Model: `catalog.ts`.
6. **catalog smoke test** — `src/catalog.test.ts`: add a `registers the <name> component` assertion. Model: `catalog.test.ts`.

- [ ] **Step 4: Write the optional local-function sub-loop**

Add it as a clearly-marked optional branch, triggered only when a component's `action` targets a local `functionCall`. Steps: author `createFunctionImplementation` in `src/functions/<name>.ts` (zod arg is the **resolved** value; `catalog.json` types it as the wire `Dynamic*`); register it in `catalog.ts`; add it to `catalog.json` `functions` + `$defs.anyFunction.oneOf`; add it to the parity `FUNCTIONS` registry. Model: `console-log.ts`, the `functions.consoleLog` block in `catalog.json`, and the `FUNCTIONS` registry in `catalog.parity.test.ts`.

- [ ] **Step 5: Read-through validation against `Text` + `Button`**

Walk the loop from each component's decision-doc table and confirm it reproduces the shipped artifacts (no code executed — compare against the files):
- **Button:** reproduces `button.schema.ts`, `button.tsx`, the `Button` block + `anyComponent` in `catalog.json`, the `Button` `COMPONENTS` entry, the `catalog.ts` registration, the `catalog.test.ts` assertion, and the `consoleLog` function surface (schema/registration/`catalog.json`/parity).
- **Text:** reproduces `text.schema.ts`, `text.tsx`, the `Text` block in `catalog.json`, and its registration/parity/smoke entries.

Fix any step whose transcription would not reproduce these. Expected: both reproduce exactly.

- [ ] **Step 6: Commit**

```bash
git add .claude/skills/build-catalog-component/SKILL.md
git commit -m "feat(phase-4): author adapter build/test section"
```

---

## Self-Review

- **Spec coverage:** Task 1 covers spec decisions 1 (design checklist), 3 (descriptions→Design), 4 (content set), 5 (markdown-not-schema), 6 (shared frame + append-convention + contract via SKILL.md format + inline example), 7 (no frontmatter). Task 2 covers decisions 2 (mechanical loop + functions sub-loop), 3 (render mechanical), 7 (no frontmatter), 8 (read-through validation, no kept docs). Both invariants (prose-only, no product code; Build takes no human input) hold — 4.1 writes no decision docs (decision 8) and no `_dev/` files.
- **Placeholder scan:** no product-code placeholders; snippets are "model on `<file>`" because the shipped files are the ground truth and the skill uses teaching-sized snippets, not full reproductions (Global Constraints).
- **Consistency:** the decision-doc column names (`prop | decision | synthetic? | A2UI type | description`), header fields, and functions/deferrals lists are defined identically in Task 1's Produces block and consumed verbatim in Task 2 Step 3.
