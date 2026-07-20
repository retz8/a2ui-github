# Task 7.1 — Agent knowledge curation

The combined research/curation task producing the agent's two knowledge artifacts — the Primer
brand-guidance doc and the curated GitHub-domain idiom examples. Parent: `_dev/TODO.md` 7.1;
phase spec `_dev/docs/spec/phase-7-agent.md` (decisions 5, 6). Both artifacts are living,
refined in 7.7. This task is delegated to the nightly routine.

## Scope

- Research the official Primer product docs and distill the brand-guidance doc.
- Curate and author 4 catalog-validated GitHub-domain idiom examples.
- Ship the examples' catalog-conformance pytest gate.
- No prompt-assembly code (7.2), no catalog/adapter/client changes.

## Locked decisions

### 1. Purpose — close the schema-valid → GitHub-real gap

Structural validity is already handled elsewhere (full-schema injection, validator + retry loop);
these artifacts target what schema and validator cannot express. Division of labor: the brand doc
owns visual/brand fidelity plus when-X-vs-Y component-selection rules; the examples own
compositional/wiring idioms plus selection-by-demonstration. Research extracts only what changes
the agent's output — a rule the model would follow anyway earns no place.

### 2. Sources

The official Primer product docs (`primer.style/product`): the Getting started and Patterns
sections feed the brand doc; the Components descriptions — restricted to the shipped catalog
set — serve as curation fuel for the examples and as the source of the when-X-vs-Y disambiguation
rules, which are their only brand-doc output. No auditing or fixing of the Phase-6 catalog
descriptions: a genuinely broken description is noted as a side-finding, not fixed.

### 3. Brand-doc inclusion filter — output-changing for our screens

Every candidate rule passes two gates: *catalog-expressible* (the agent can act on it through the
shipped catalog surface) and *triage/compose-relevant* (a surface this agent generates would
plausibly trigger it). Fail either → cut. The demo domain is a relevance lens only; no
triage-domain instructions enter the doc. Consequence accepted: the doc is fitted to this catalog
and domain, not a reusable general-purpose Primer distillation.

### 4. Brand-doc form

Imperative rule register, with explanation only where the bare rule would be ambiguous.
Consumer-shaped thematic organization (not source-site-shaped), including the when-X-vs-Y rules
as a section. No numeric size cap; instead an earn-your-place gate — every rule must cite, at
curation time (not in the doc), the failure it prevents; 7.7 deletes rules that never fire.
Human-readable and clean to hand off to 7.2.

### 5. Example unit shape — request → full message sequence

Each example is a short natural-language user intent paired with the complete A2UI message
sequence answering it, in exactly the output format the agent must emit. The intent is context
inside the example; the surrounding prompt never routes intents to examples. Tool-result data is
excluded for now; the named-field file envelope keeps that a future additive upgrade.

### 6. Example set — 4, adjacent-not-identical to the beats

Same GitHub domain and visual language as the demo beats, but deliberately not the literal beat
surfaces, so the beats stay honest evals: an issue-triage list (list templating + data binding),
a status-heavy variant list (state/check semantics), an issue detail (multi-region composition
depth), and a comment/label compose form (form + actions). 7.7 may add examples if a beat keeps
failing.

### 7. Validation — agent-side pytest conformance only

A pytest gate walks the example files by glob and validates every component entry against the
adapter's `catalog.json` — an early delivery of the phase spec's mandated L0 examples check.
No client-side render fixtures or Playwright baselines in this task. Human verification is
reading the artifact files themselves.

### 8. Layout

A self-contained `agent/knowledge/` corner that 7.2 may wire up or relocate: the brand doc as
`brand-guidance.md` (markdown), the examples as one pretty-printed JSON file each under
`knowledge/examples/`, and the conformance test in the agent test suite. Examples use a
named-field envelope (name, intent, messages).

### 9. Message-sequence grounding — fixtures first, online spec for deltas

The primary template for message-sequence shape is the in-repo deterministic-agent fixtures
(conformance-tested, proven end-to-end). The online repo `github.com/a2ui-project/a2ui`
(v0.9.1 spec) covers what the fixtures don't exercise. The `../A2UI` sibling is not available
to the delegated run and is not referenced.

### 10. Definition of done + scope guards

Structural DoD: the brand doc exists per decisions 3–4; the 4 example files exist per decisions
5–6 and 8; the conformance test exists and the whole agent pytest suite is green. Guards: no
changes to catalog, adapter, or client (findings noted in the PR description, not fixed); no
prompt-assembly code; no self-judged quality bar beyond the structural gates — PR review and the
7.7 refinement loop are the quality gates.

## Invariants

- Artifacts must hand off cleanly to 7.2 (consumable as-is by prompt assembly) and be
  human-readable for the user's verification.
- All spec/reference reading uses the online `github.com/a2ui-project/a2ui` repo, not the local
  sibling fork.
