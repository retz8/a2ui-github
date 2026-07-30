# Task 7.7 — Beat-by-beat verification and refinement

Drives each beat of SPEC §3.1's capability matrix through the live stack and iterates on the agent's
knowledge artifacts until they pass. Parent: `_dev/TODO.md` 7.7; `_dev/docs/spec/phase-7-agent.md`
decisions 1, 8, 9; SPEC.md §3.1. This task carries Phase 7's definition of done.

## Scope

- Driving the eight beats of SPEC §3.1 through the live stack — real model, full catalog, live
  GitHub MCP, the client chat shell — and refining the 7.1 knowledge artifacts until each beat
  meets its rubric.
- Verifying, per beat, that the rendered surface is genuinely interactive, with local function
  calls and server actions deliberately distinguished.
- Growing the adapter's local functions where a beat's surface demands one.
- Producing the verification record: rubrics, per-round screenshots, defects, and the fixes that
  resolved them.
- Resolving the phase spec's open item on the concrete local-function list.
- Out of scope: multi-turn conversation flow, session-arc behavior, and the client's surface
  lifecycle — all Phase 8.

## Locked decisions

### 1. Beats judged individually

Beats are verified as capabilities, not as a narrative: SPEC §3.1 is a covering set spanning domain,
screen archetype, scope resolution, and intent clarity, and sequencing them into a demo arc is Phase
8's work. Seven of the eight are self-contained prompts run in their own conversation; only beat 3
depends on a predecessor and runs as a follow-up to beat 2. A beat fails this task only for a reason
internal to it — invalid or unrenderable surface, wrong or missing data, poor composition, missing
interactivity. A failure caused by the agent losing the prior turn's context is an arc failure,
recorded as a Phase-8 item, and does not block Phase 7.

### 2. Written per-beat rubrics as the pass bar

Each beat has a rubric stated as checkable claims rather than taste. Rubrics assert information
architecture and interaction only — never visual fidelity to any reference. Iteration continues
autonomously until a beat's rubric passes; anything that passes the rubric but still looks wrong is
flagged rather than silently fixed. Every rubric is written before any live run and approved by
the user in a single gate. If driving a beat reveals the rubric itself is wrong, work stops and the
rubric is raised for revision rather than rewritten to match the output.

### 3. Real GitHub screenshots as reference only

Screenshots of the live GitHub UI ground the rubrics in what a maintainer actually needs on each
screen. They are reference material for authoring the rubrics and never enter the model's prompt in
any form — not as image input, not transcribed into the brand-guidance doc. The durable residue of
the reference material is the approved beat surfaces themselves, which become curated examples.

### 4. Approved surfaces become the curated examples

A beat's approved surface is folded into `agent/knowledge/examples/` as it is approved, so later
beats run with it in the prompt. Only approved output is ever folded in — mid-iteration output never
becomes an example. Folding is followed by one final confirmation pass running every beat once
against the shipped prompt, since incremental folding means the prompt each beat was verified
against is not the final one.

### 5. Mostly self-contained beats

Because the matrix replaced the narrative arc, seven beats stand alone and cost one turn per round;
only beat 3 replays a predecessor (beat 2). Each iteration round starts a fresh conversation, because
re-running a beat into a conversation already holding that beat's failed surface produces a
contaminated verdict. The confirmation pass runs every beat once against the shipped prompt.

### 6. Managed turn budget with hard stops

Live turns are governed by a managed total budget across the task rather than a fixed round count
per beat, spent where beats actually need it. Work on a beat stops and returns to the user when two
consecutive rounds produce the same defect — a lever that is not working is not repeated. Within a
round, every defect that round exposed is collected and all fixes are applied together before
re-running; fixes are never applied one at a time with a re-run between them.

### 7. Interactivity verified by kind

Every local function call on a beat's surface is actually clicked, since it costs no model turn and
a function that is not registered fails only at runtime. Every server action is audited statically
from the emitted A2UI: the action exists and carries context sufficient to identify its target. One
live server-action click is spent across the whole task, on beat 1's row action. Beat 3's client-side
validation is exercised for real, including misuse, and is never bypassed to make the beat pass.

### 8. Deliberate local-vs-server assignment in the rubrics

Each rubric states, per interactive affordance, whether it should be a local function call or a
server action, and client-side interactivity is placed deliberately across every beat rather
than only the compose beat. Growing the local-function set is a purpose of this task, not a contingency. A
function is added when a beat's rubric cannot be met without it, built as a full adapter change with
its own tests and catalog parity, and recorded in the verification journal.

### 9. Model and diagnostic ladder

`gemini-3.5-flash` is the default and the model the demo runs on; beats are verified on it. The
model is never switched mid-loop, since tuning does not transfer across models. When a defect
survives iteration and looks like a model ceiling rather than a prompt problem, one turn is spent
re-running that round on `gemini-3.1-pro-preview` — the ladder's remaining rung. A pass at a higher
tier ends prose tuning and is recorded as a model finding; an identical failure eliminates the
hypothesis and iteration continues.

*Amended during beat 6. This decision originally named `gemini-3.5-flash-lite` as the default with
`gemini-3.5-flash` as the ladder's first rung. Lite is below this task's floor on two independent
observations — beat 1 produced no surface at all on it, both attempts dying on the same malformed
bracket, and beat 6 on lite regressed past its own first round: one tool call, no README, no tree,
zero affordances, and an outright-invented description. The default moved to `gemini-3.5-flash` at
beat 1 and every beat has been verified there since; this amendment brings the decision into line
with that, leaving `gemini-3.1-pro-preview` as the sole remaining rung.*

### 10. The verification journal

A single journal records the task: per beat, its rubric, a side-by-side row of that beat's round
screenshots, and per round a table of observed defects against the rubric line each violates and the
lever that fixed it. Only approved surface JSON is committed; failed rounds are represented by the
offending fragment quoted inline rather than the full dump. Screenshots live alongside the repo's
existing tracked images. One commit per approved beat, carrying that beat's journal section,
screenshots, fixes, and new example together, so the commit history reads as the verification
record. The journal is permanent — it is the derivation record for the examples the agent ships
with.

### 11. Example set shape

All four 7.1 examples are superseded by beats and retired as their replacements are approved:
`review-queue-status-list` by the PR-list beat, `comment-compose-form` by the compose beat,
`issue-triage-list` by the issue-list beat, and `issue-detail` by the issue-detail beat. The shipped
set is therefore derived entirely from approved beat surfaces. A beat's surface is folded in only if
it adds an idiom the set lacks; shipping structurally duplicate examples teaches one idiom twice at
the cost of prompt weight. Retirement is incremental — an example is removed only once its
replacement is approved, so the prompt is never left without coverage of an idiom.

### 12. Client data-model growth is instrumented, not fixed

The per-send client data-model payload is logged and its size recorded per turn in the journal. It
is not capped or pruned in this task: the fresh-conversation-per-round design already bounds
accumulation to a chain's length, and the payload's growth policy is a surface-lifecycle decision
belonging to Phase 8. The logging also prevents a silent send failure from being misattributed to a
prompt defect. The recorded sizes are the empirical input Phase 8 needs.

### 13. Strengthened example gate before the beats

The conformance gate on the curated examples is moved from the deterministic agent's non-strict
partial probe to the live agent's strict complete-surface validation, before any beat runs. Every
example is a complete surface, so the strict validator — including topology and binding
resolvability — is the correct one, and a latent defect in an existing example surfaces on its own
rather than being blamed on a beat.

### 14. Local environment

The task runs against localhost throughout, not a dev tunnel: the browser, the client, and the agent
are on the same machine, so no tunnel URLs and no advertised base URL are involved. Only the live
agent participates; the deterministic agent is not part of this task.

### 15. Work lands on `main`

The task runs on `main` with no worktree. Nothing else is in flight to isolate from, its output is
refinement rather than a feature build, and the per-beat commit — journal, screenshots, fixes, and
example together — exists intact only on a single branch.

### 16. Definition of done

The task is done when every beat passes its approved rubric including the interactivity assignment;
the confirmation pass reproduces every beat against the shipped prompt; the example set holds the
distinct-idiom set with its conformance gate green; the repository's build, lint, typecheck, and
test suites are green, with any new adapter function or client instrumentation carrying its own
tests; the journal is complete across all beats and rounds including the recorded data-model sizes;
and the phase spec's local-function open item is answered in writing. This closes Phase 7.

## Invariants

- Beat 5 proves the local-function mechanism end to end. Making it pass without genuinely exercising
  client-side validation is not a pass.
- Rubrics are never rewritten to match the output they are grading.
- Reference screenshots never reach the model.

## Open items

- Whether the demo model suffices is answered by this task's evidence rather than assumed; a model
  finding from the diagnostic ladder is recorded for Phase 8 rather than acted on here.
