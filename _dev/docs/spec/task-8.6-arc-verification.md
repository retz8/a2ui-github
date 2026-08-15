# Task 8.6 — Arc definition + live verification

Sub-task spec for `**8.6**` under `## Phase 8` in `_dev/TODO.md`: script "the maintainer's morning" and run live continuous 8-beat sessions on the canvas shell until green; arc-green triggers chat-page retirement. Extends `_dev/docs/spec/phase-8-demo-integration.md` (decisions 16–19) and `SPEC.md` §3.1.

## Scope

- The arc script: beat sequencing, glue prompts, the re-composition follow-up, scripted interaction channels, a scripted overlay question, and a scripted fork step.
- Live continuous arc runs on the canvas against the live repo, judged by a per-step checklist, iterated until one fully green run.
- The chat page's retirement and the default-route swap at arc-green.
- Out of scope: any replay consumer for the arc recording; deleting the chat page.

## Locked decisions

### 1. Beat order: inbox-first

The arc runs 8 → 1 → 2 → 3 → 7 → 4 → 5 → 6 — open on "what needs my attention today," drill into PR work, author profile after the review, pivot to issues, close wide on the repo overview. Beat 3 stays immediately after beat 2.

### 2. Prompts contextualize freely

Beat prompts are rewritten flow-native (anaphora, building on what's on stage) rather than kept in their Phase-7 standalone shapes — cross-beat continuity is exactly what the arc verifies. Glue carries the repo naming where a beat needs it.

### 3. One re-composition follow-up, off beat 1

A single "which of these…" follow-up on beat 1's PR list, answered by re-composing the surface (new grouping/annotation, not re-skinning), feeding into beat 2's drill-in.

### 4. Interaction channels are scripted

The script pins each transition's channel. At least one beat transition fires via surface action on an agent-painted surface; the rest via palette utterances. Both channels are demonstrated.

### 5. One scripted overlay question

The script includes a deliberately underspecified prompt whose expected response is a question paint. The checklist requires the overlay to appear, be answered, and dismiss correctly once in the run.

### 6. One scripted fork step

The script includes scrubbing back to a parked paint and firing an agent-bound action / Repaint from it. The checklist requires the fork context to reach the agent, the new paint to land at the head with `parent` set, and the causal link to render. This is 8.5's live end-to-end verification.

### 7. Exact wording is script-authoring detail

Glue text, follow-up phrasing, and where the question and fork steps slot into the order are authored and iterated in the working doc during runs, not locked here.

### 8. Greenness: per-step pass/fail checklist

No 5-axis re-grading. Each script step passes if it lands the intended surface kind via the scripted channel, is data-true on spot-check, is titled, and the shell behaves (hold-and-swap, timeline entry, no crash). Arc-level checks: the re-composition genuinely re-composes, contextual references resolve, the session completes.

### 9. Beats 2 and 6: no special status; remediation on failure only

Phase-spec decision 18 is resolved to its fallback — the stronger-model retry was already spent in 8.1 and was worse. The two beats pass their arc steps like any other under the checklist; the script avoids depending on affordances they unreliably render; residual defects are journaled as known. If a step cannot pass across attempts, the remediation ladder is in-scope: knowledge/prompt tweaks first, tool-shaping last.

### 10. Model: `gemini-3.7-flash` primary, `gemini-3.5-flash` fallback

Arc attempts run on `gemini-3.7-flash` after a smoke turn confirms the model id resolves. If its defect profile regresses on the early beats, drop back to the verified `gemini-3.5-flash` rather than re-tuning knowledge for the new model. One model per session — no mid-arc switching. Greenness is model-agnostic; the journal records which rung the green run used.

### 11. One fully green run = arc-green

A single continuous session with zero checklist failures, journaled step-by-step, completes the sub-task's verification. No confirmation pass.

### 12. Recorder armed every attempt; the green run's recording is kept

Failed attempts' recordings are disposable. No replay consumer is built for the arc recording — the file is kept as deterministic evidence and a demo fallback.

### 13. Artifacts: spec + one working doc

This spec holds the decisions. A new working doc `_dev/docs/arc-verification.md` holds the script at the top and the run journal appended below, mirroring the Phase-7 split. `beat-verification.md` stays closed.

### 14. At arc-green: canvas becomes default, chat demotes

The canvas takes `index.html`; the chat page moves to `chat.html` as a dev-only live-agent reference alongside `dev.html`/`examples.html`. Deletion is deferred post-phase.
