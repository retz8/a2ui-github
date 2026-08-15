# Task 8.8 — Docs & code wrap-up

Task spec for `**8.8**` under `## Phase 8` in `_dev/TODO.md`: refresh the stale READMEs and refactor `client/src/canvas/`. Extends the phase spec (`phase-8-demo-integration.md`); this spec records the decisions locked in the 8.8 grill, including the chat page's final disposition deferred there by phase decision 19.

## Scope

- Docs half: the four READMEs (root, `primer-a2ui-adapter/`, `client/`, `agent/`), the tunnel-content relocation, `.superpowers/sdd/` deletion, an MIT `LICENSE`, and the `CLAUDE.md` tunnel-pointer change.
- Code half: the `client/src/canvas/` refactor plus the shared-module extraction it requires.
- Out of scope: `adapter-template/` and its mirrored docs (Post-Phase-8 territory; the template may be dropped entirely — decided there, not here); any general `CLAUDE.md` refresh beyond the tunnel move.

## Locked decisions

### 1. Root README: layered showcase + map, localhost only

The root README leads as a showcase (what this is, `THESIS.md` pointer, hero recording) followed by a practitioner's map (monorepo layout, the three packages' roles, setup). Hard rule: **map, not manual** — anything package-specific lives in that package's README; the root says what each package is and links down. It documents the localhost workflow only, and fixes the stale facts (agent no longer "planned", canvas as the default page, script drift).

### 2. Hero recording: fresh mp4, the 1–2–3 cut

A fresh capture made during the morning live visual test — mp4, not a reused thesis asset. Content is the minimum paradigm cut, ~12–15s in one take: empty canvas → palette utterance → progressive paint, then a follow-up → hold-and-swap. Recorded against the live a2ui repo. Embedded via GitHub's uploaded-attachment URL (a committed mp4 does not render inline), so it does not live in `docs/assets/`.

### 3. Tunnel environment: out of all READMEs, into `_dev/`

No tunnel content in any README. One doc under `_dev/docs/` holds the tunnel environment and its useful dev scripts; `CLAUDE.md`'s existing tunnel section shrinks to a pointer at it. That pointer change is `CLAUDE.md`'s only edit in this task. The client README's inline tunnel setup is deleted in its rewrite.

### 4. Chat page: kept, as a public alternative interface

The final call on phase decision 19: `chat.html` is kept — not dev-only, but a demonstration of the conventional chat interface, for people who want to try the GitHub agent through chat. The client README documents it as a first-class page.

### 5. Client README: live agent primary

Reframed around the live LLM agent as the primary path (the deterministic agent no longer fronts the doc); documents the beat-replay URL params and the palette shortcut; the Phase-2-era deterministic round-trip verification procedure is dropped.

### 6. Adapter and agent READMEs

The adapter README is rewritten to reflect reality (the shipped catalog and its components, parity testing — no more skeleton/stub claims). The agent README is factually sound and gets only the jargon scrub per decision 7.

### 7. Phase-vocabulary scrub, docs and comments both

READMEs speak timelessly — no phase/task-number references. Code comments are rewritten to state the constraint itself rather than cite where it was decided, with a spec-file pointer only where the invariant is too big to restate; the comment scrub happens per-file as the refactor touches them, not as a separate sweep.

### 8. Repo hygiene

`.superpowers/sdd/` leftovers are deleted. An MIT `LICENSE` is added.

### 9. Refactor scope

In: a shared transport module both pages consume, ending the canvas → `chat/` dependency (the shared pieces re-home out of `chat/`); decomposition of the `CanvasApp` wiring closure; splitting `canvasTurn` along its real seams only — no splitting for line-count's sake; light directory grouping where it falls out naturally. Out: CSS restructuring, a UI-strings module, and new tests as a goal — existing coverage must keep pointing at moved logic, nothing more.

### 10. Refactor standard and bar

The `toss-frontend-fundamentals` skill governs the refactor (readability > predictability > cohesion > coupling). The bar is behavior-identical.

### 11. Execution: refactor delegated first, docs live after

Sequential, one track: the refactor runs first, delegated to the nightly routine tonight; the docs half is done live in-session after the refactor PR merges, so docs are written against the finished tree. The `_dev/` tunnel doc lands on `main`; everything else rides the task branch.

### 12. Delegation shape: spec-only, plan delegated too

The refactor issue references this spec and names the Toss skill as the governing standard; `superpowers:writing-plans` is named as the Plan skill — the nightly plans its own decomposition, then executes it. No plan is written before delegation.

### 13. Verification gate, split by environment

Nightly gate: build + typecheck + lint + full vitest. Morning review (local): plan-vs-diff, `verify:all` + Playwright with zero snapshot churn expected, and a live visual test on the running canvas — then merge.
