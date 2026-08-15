# Arc verification — "The Maintainer's Morning"

Working doc for task 8.6 (spec: `_dev/docs/spec/task-8.6-arc-verification.md`). The script below is the run
sheet — iterated freely between attempts (wording tweaks are journaled, not re-specced). The journal of live
attempts appends at the bottom. Greenness: one continuous session with zero checklist failures.

## Run setup

- Agent: `llm_agent` on port 10003, `--base-url https://vnw20xbg-10003.asse.devtunnels.ms`,
  `A2UI_RECORD_DIR=.recordings`, model per spec decision 10 (`gemini-3.7-flash` primary,
  `gemini-3.5-flash` fallback).
- Client: vite dev on 5173, `VITE_A2A_SERVER_URL=https://vnw20xbg-10003.asse.devtunnels.ms`;
  drive `https://vnw20xbg-5173.asse.devtunnels.ms/canvas.html`. Both tunnel ports public.
- One session end-to-end: no reloads, no model switch, one agent process.

## Per-step checklist (spec decision 8)

Each step passes iff: **(a)** the intended surface kind lands via the scripted channel, **(b)** data-true on
spot-check against live GitHub, **(c)** paint is titled (agent title or acceptable fallback), **(d)** shell
correct — hold-and-swap (no blank stage), timeline appends, no crash. Arc-level (graded once at the end):
the re-composition genuinely re-composes; contextual references resolve; overlay appeared, was answered,
dismissed; fork context reached the agent and the fork paint carries `parent`; the session completes.

## Script

| # | Beat | Channel | Prompt / action | Expected paint |
|---|------|---------|-----------------|----------------|
| S1 | 8 | palette | "Good morning. What needs my attention today?" | notifications / attention inbox (viewer-scoped) |
| S2 | 1 | palette | "Let's look at a2ui-project/a2ui — show me the open pull requests that need review." | PR list |
| S3 | recomp | palette | "Which of these are ready to merge and which are still failing checks? Regroup them for me." | re-composed PR list (grouped by mergeability, not a re-skin) |
| S4 | 2 | palette | "Open the top one." | PR detail (contextual reference resolves against S3) |
| S5 | 3 | palette + local | "Draft an approving review saying the spec doc looks reasonable." Then fill/touch the form locally. | compose-and-confirm review surface; local validation runs; stops at confirm boundary |
| S6 | 7 | palette | "Who's the author of this PR? What do they work on?" | user profile (author resolved from context) |
| S7 | Q | palette | "Pull up the issues Sarah flagged for me." | **question paint in the overlay** (no Sarah is resolvable; the agent searches, finds nothing, and asks) |
| S8 | Q-answer | overlay answer | Answer via the dialog (pick the sensible option). | overlay dismisses; response paint at head; Q&A recorded on the cause edge |
| S8b | 4 | palette | "Actually — just show me the issues that look stalled waiting on someone." | fuzzy-qualifier issue list |
| S9 | 5 | **surface action** | Click an issue row in S8b's list. | issue detail (the scripted click transition) |
| S10 | fork | **surface action from parked** | Back-scrub to S3's re-composed PR list (history), click a **different** PR's row. | new PR-detail paint at head, `parent` = S3's paint; causal link renders; fork context on the wire |
| S11 | 6 | palette | "Alright — zoom out. Show me the repository itself." | repo overview closer |

Known-unreliable affordances the script must not depend on (spec decision 9): beat 2's PR-detail surface may
render few/no actions (S5/S6 go by palette, never by clicking S4's surface); beat 6's data model may be
empty (nothing downstream of S11 depends on it — it closes the arc).

## Journal

(One entry per attempt: date, model, per-step results, defects, disposition.)

### Attempt 1 — 2026-08-15, `gemini-3.7-flash` — NOT GREEN (transport + S7 wording); rich signal

Steps: S1 ✓ (attention inbox exact: 1 review request, 0 notifications, verified via gh). S2 ✗→✓ (first
dispatch hung ~100 s in the tunnel, "Failed to fetch", shell held S1 correctly; manual re-fire landed a
data-exact 41-PR Needs Review list). S3 ✓ (genuine re-composition: Approved/Ready 8 · Passing-awaiting 5 ·
Failing 5; 4/4 sampled memberships exact; "cancelled → failing" for #2287 accepted; note: widened beyond
the 41 to include approved PRs — defensible reading of "ready to merge"). S4 ✓ ("the top one" → #2107;
checks tally, BEHIND merge state, APPROVED review, commits, body all exact — **beat 2's Phase-7/8.1
defects did not reproduce: data-true AND action affordances present**). S5 ✓ (compose-and-confirm with
pre-filled Approve + drafted comment; local textarea edit persisted; Submit → agent-authored
ConfirmationDialog in the overlay echoing the edited comment — client data model round-tripped; Cancel
answered the overlay, cause label "answered …", agent recovered by repainting PR detail; boundary held).
S6 ✓ (author resolved from context → mit-mit profile; facts verified). S7 ✗ (wording "the ones that matter
this morning" was interpreted, not asked — painted a data-exact P1+recent-bugs list; script re-worded, see
above). S8 moot. S9 ✗ (issue-row click fired the surface-action channel correctly, then the POST hung in
the tunnel; "That action failed", shell held). S10/S11 not reached (attempt already dead).

Shell behavior clean throughout: hold-and-swap never blanked the stage, failed paints never reached stage
or timeline, agent-authored titles led every paint ("PR #2107 — a2ui", "Priority issues — a2ui"), overlay
Q&A recorded on the edge.

Defects/actions: (1) transport — 2 of ~12 SSE POSTs hung ~100 s then failed, requests never reached
uvicorn; suspected stale keep-alive socket reuse at the tunnel data-plane over uvicorn's 5 s
`timeout_keep_alive`; raised to 300 s in `llm_agent/__main__.py` — verify statistically next attempts.
(2) False alarm dismissed: suspected duplicate dispatch / zombie StrictMode wiring was console-reader
re-emission of old log lines; instrumented probe showed exactly one dispatch per turn. (3) S7 wording
iterated toward an unresolvable referent, matching the prompt's ask-don't-pick trigger.

### Attempt 2 — 2026-08-15, `gemini-3.7-flash`, keep-alive 300 s — NOT GREEN (S5 fabrication)

No transport hangs across 7 turns (keep-alive fix holding so far). S1 ✓. S2 ✓ (56 incl. drafts — truthful
`review:required` count with honest Draft badges; interpretation variance vs. attempt 1's `draft:false` 41,
accepted). S3 ✓ richer than attempt 1: per-row annotations ("Approved · Merge conflicts with base", "All CI
checks passing", "Checks failing / unstable", Draft); 3/3 sampled claims exact (#2033 CONFLICTING, #1968
draft all-passing, #1009 draft 9 failures). S4 ✓ per checklist ("top one" → #2107; facts exact; description
paraphrased accurately) — but this run omitted the checks tally and files-changed list that attempt 1
rendered (SPEC §3.2 coverage variance, journaled, non-blocking under the locked checklist). S5 ✗ FABRICATION:
compose + confirm dialog fine (local edit round-tripped into the dialog), but answering **Back to Edit**
painted PR detail showing "retz8 approved these changes" with the draft in the review timeline — depicting a
write that never happened (verified: no such review on the PR) and ignoring the answer's semantics. Attempt
killed. Fix: prompt gained a state-side fabrication wall (never depict post-write state; decline/back-out
returns to the compose surface) in `llm_agent/prompt.py`; golden regenerated; 252 tests green.

### Attempt 3 — 2026-08-15, `gemini-3.7-flash`, fabrication-wall prompt — NOT GREEN (S7 only); every other element green

Zero transport failures across 14+ turns — the keep-alive fix is holding. S1 ✓. S2 ✓ (41 non-draft,
explicitly labeled, count exact). S3 ✓ (richest regroup yet: Ready-to-merge / Failing / Approved-but-blocked
split behind-vs-conflicts / Passing-awaiting, per-row `mergeable_state` annotations; 2/2 sampled exact).
S4 ✓ ("top one" → #2284; +242/−416, 223 files, 1 commit, v1_0←v1_0_firing_1, 13✓/4-skip checks — all exact;
full §3.2 coverage incl. checks tally and changes). S5 ✓ — and the **fabrication fix verified live**:
Cancel on the confirm dialog returned to the compose surface with the draft intact (no depicted approval);
the re-submitted dialog echoed the locally re-typed comment verbatim (data-model round-trip). Driver notes:
palette/textarea focus needs a settled page (cmd-modified keys type literal letters into the A2UI textarea —
use triple-click-select + retype for edits). S6 ✓ (nan-yu resolved from context; name/company/email all
from the public profile; PR states exact). S7 ✗ ("the issue set we agreed to watch" grounded honestly in
real `status: needs-triage` / `waiting-for-author-response` labels — no fabrication, but no question).
S9 ✓ (row click → issue #2232, body/labels exact). S10 ✓ — the fork verified end-to-end: parked S3 via the
titled press-list, stale banner + Return-to-live + Repaint present, row click from parked carried the full
8.5 fork context (title, painted-at, 7-behind, as-of-then data model — seen verbatim in the agent log),
fresh-refetched #2077 painted at head with the "↩ from PRs by Merge Readiness" causal chip. S11 ✓ (repo
closer: stars/forks/open/license/language exact; tagline is a faithful README paraphrase over a null
`description` — the old beat-6 fabrication did not recur).

**In-context wording probe after the script:** "Pull up the issues Sarah flagged for me." → the agent
searched, found no Sarah, and painted a question in the overlay ("Which repository or user did you mean?"
with answer options); answering painted a 236-issue list (exact: 306 open minus 70 PRs). Question cycle
proven live; script updated (S7 Sarah wording, S8 answer, S8b fuzzy beat-4 ask).

### Attempt 4 — 2026-08-15, `gemini-3.7-flash` — **GREEN** ✅

One continuous session, 12 paints, zero checklist failures, zero transport failures. Per step:
S1 ✓ attention queue (review request incl. fresh `mergeable: dirty`, plus the real read-notification list —
all verified exact against gh). S2 ✓ 56 needing review incl. honestly-badged drafts (count exact).
S3 ✓ re-composition (Approved 8 / Passing 6 / Failing 7; live drift on #2196 to `dirty` picked up
correctly — verified). S4 ✓ "the top one" → #2107 at full §3.2 coverage (facts previously verified exact).
S5 ✓ compose-and-confirm: prefilled Approve + draft, local edit (triple-click replace) round-tripped
verbatim into the agent's confirm dialog, Cancel returned to the compose surface — boundary held, no
fabricated state. S6 ✓ mit-mit profile from context (2 sampled PR rows verified). S7 ✓ **the scripted
question paint**: overlay "Which repository or username did Sarah flag issues in?" grounded in a real
empty search across active orgs. S8 ✓ answered (Cancel), overlay dismissed, stage held. S8b ✓ beat 4:
"Stalled Issues" = exactly the 8 `waiting-for-author-response` issues (count verified). S9 ✓ scripted
click → issue #2028 detail (body + first comment verified verbatim). S10 ✓ fork: parked the S3 paint via
the titled press-list (stale banner, Return-to-live, Repaint), clicked #2077 from parked — HISTORICAL
framing in the agent prompt, fresh refetch, new paint at head with the "↩ from PR Status & Checks" causal
chip (+144-line file claim verified). S11 ✓ repo closer (stars/forks/open/license/language exact,
README-grounded About).

Arc-level: re-composition genuinely re-composes ✓ · contextual references resolve ✓ · overlay appeared,
answered, dismissed ✓ (twice: S5 confirm + S7 question) · fork context reached the agent and the fork
paint carries `parent` ✓ · session completed ✓. **Arc-green.**

Consequences executed: recording kept at `agent/recordings/arc/arc-green-2026-08-15.json` (raw session
capture, decision 12); canvas took `index.html` and the chat page demoted to `chat.html` (decision 14) —
vite input map + e2e route + READMEs updated; client typecheck/build/726 tests green; swap verified live
through the tunnel.
