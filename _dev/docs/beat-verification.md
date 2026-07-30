# Beat verification — task 7.7

The working record for task 7.7: the rubric each beat is graded against, and per beat a
round-by-round account of what was observed, what it violated, and which lever fixed it.
Spec: `_dev/docs/spec/task-7.7-beat-verification.md`. Beats: `SPEC.md` §3.1.

## How these rubrics work

The screenshots in `assets/` are **reference, not template**. They record what a person needs on a
given screen — which facts let them decide, what they can act on — not what the surface should look
like. The agent re-composes each surface; two runs of the same prompt may differ and both be good.

So a rubric grades five things and nothing else:

1. **Intent fit** — does the surface serve what was asked.
2. **Data truth** — every value came from a tool call in that turn; nothing invented.
3. **Information sufficiency** — the facts needed to act are present.
4. **Interactivity** — affordances exist, and each is the right kind (local function vs server
   action). Nothing interactive-looking is inert.
5. **Composition quality** — catalog-valid, legible hierarchy, no empty or placeholder sections.

A rubric never requires a particular component, layout, ordering, or field set, and never requires
resemblance to the reference. Each beat's **Not required** list exists to stop over-grading.

`local` = client-side `functionCall`, costs no model turn. `server` = `event`, an agent round-trip.
Every server action must carry context identifying its target; an action whose context cannot say
*which* PR/issue/repo it refers to is a failure even though it validates.

## Reference index

| Beat | Reference |
|---|---|
| 1 | `assets/beat-1-pr-list.png` |
| 2 | `assets/beat-2-pr-header.png`, `-pr-timeline.png`, `-pr-checks-comment-bottom.png`, `-files-changed-tab.png`, `-checks-tab.png`, `-commits-tab.png` |
| 3 | `assets/beat-3-review-form.png` (different repo, light theme — shape reference only) |
| 4 | `assets/beat-4-issue-list.png` |
| 5 | `assets/beat-5-issue-detail.png` |
| 6 | `assets/beat-6-repo-landing-top.png`, `-middle.png`, `-bottom.png` |
| 7 | `assets/beat-7-user-profile-base.png`, `-history.png` |
| 8 | `assets/beat-8-notifications.png` |

---

## Round 0 — before any live turn

Zero LLM calls. Three items, plus one finding.

**Strict example gate.** `agent/tests/test_knowledge_examples.py` now validates through the live
agent's `validate_surface` rather than the deterministic agent's non-strict partial probe. Every
example is a complete surface, so the strict validator is the right one. The four existing examples
pass unchanged — no latent defect. The strengthening is real rather than a call swap: injecting each
defect class into a known-good example, the old gate passed all three and the new one catches all
three.

| Injected defect | old `validate_payload` | new `validate_surface` |
|---|---|---|
| orphaned component | passes | raises — not reachable from `root` |
| unresolvable binding | passes | raises — binding does not resolve |
| missing `createSurface` | passes | raises — incomplete surface |

**Client data-model instrumentation.** `client/src/a2a/dataModelSize.ts` measures the serialized
payload — total bytes, surface count, per-surface breakdown largest-first — and logs one
`[a2ui:datamodel]` line per send. It hooks `clientDataModelMetadata` in `messages.ts`, the single
choke point both send paths funnel through, so text sends and action sends are both covered. Sizes
get recorded per beat below.

**Rubrics.** Written from the reference screenshots and approved before any live run.

**Baseline.** `yarn verify:all` green (adapter 2475 tests, client 529); `uv run pytest` green (186).
Note that `verify:all` covers the yarn workspaces only — the agent is uv-managed and runs separately.

### Finding — stale adapter build masquerades as a product defect

`client/tests/basic-functions.test.tsx` failed 5 of 6, all function-evaluation paths. Root cause:
the client resolves `primer-a2ui-adapter` through its **gitignored `dist/`**, which predated task
7.9 — the runtime catalog carried only the 5 original functions, so the invoker raised "Function not
found in catalog" for every adopted one. Source was correct throughout; `yarn test:all` runs only
`test` across workspaces and never builds, while `yarn verify:all` builds first. Rebuilding the
adapter turned all 6 green. No code was wrong.

Recorded because it is a live trap for this task: a local function added for beat 3 will not resolve
in the browser until the adapter is rebuilt, and the symptom — a function the surface names but the
client cannot find — is indistinguishable from the agent emitting a bad function name. **Any beat
round following an adapter change rebuilds before the run**, and `verify:all` is the gate, never
`test:all`.

---

## Beat 1 — PR list

> "Show me the open pull requests on a2ui-project/a2ui that need review."

**Intent:** a maintainer scanning what is waiting on them.

- **Data truth** — every row is a real open PR of that repository, fetched this turn. No invented
  numbers, titles, authors or counts.
- **Sufficiency** — each row carries enough to decide whether to open it: identity (number and
  title), who raised it, and recent activity. The size of the result set is conveyed somehow.
- **State** — review/CI state is *conveyed*: per row when it varies, **at surface level when the
  filter makes it uniform**. Fetching per-item detail for a list is explicitly not required.
  *(Amended after round 4. The original line demanded per-row state, which conflicts with the
  tool-economy rule: GitHub's search API returns no review decision or check status, so per-row
  state costs two extra calls per row. It is also redundant when the list is already filtered to
  `review:required` — every row shares one state, and the surface says it once.)*
- **Composition** — an enumerable, scannable structure with a consistent per-row shape; not a prose
  paragraph and not one text blob. No empty sections.
- **Interactivity** — a row resolves to a **server** action carrying its PR number. Reordering or
  narrowing rows already fetched is **local**.
- **Reading of "need review"** — the item's actual review state (review requested, not yet
  approved), not a repository label whose name happens to match. The broad reading is the one a
  maintainer means; a label captures a fraction of it.
- **Not required** — GitHub's row layout, labels, task-list progress, linked-issue counts, an exact
  field set, or a server-side "needs review" filter (per-row review state is sufficient).

### Rounds — approved at R4

| R1 (lite) | R1 (flash) | R2 | R3 | R4 ✓ |
|---|---|---|---|---|
| no surface | ![](assets/beat-1-r1.jpg) | ![](assets/beat-1-r2.jpg) | ![](assets/beat-1-r3.jpg) | ![](assets/beat-1-r4.jpg) |

**R1 — `gemini-3.5-flash-lite`, no surface.** Both attempts emitted the same malformed JSON: the
`updateDataModel` message object closed with `]` instead of `}`. Everything else was well-formed.
The parser's incremental heal does not repair a wrong-*type* bracket. Two identical attempts
triggered the model-ceiling diagnostic; `gemini-3.5-flash` produced a valid surface on attempt 1,
same prompt. **Lever: model default → `gemini-3.5-flash`.** Lite cannot reliably close ~7 KB of
nested JSON.

Two client defects surfaced here, both fixed before continuing:

| Observed | Cause |
|---|---|
| Turn vanished entirely — surface removed, nothing rendered, no console error | The agent tears down the half-built surface and apologises as a `TextPart`; the client read only A2UI DataParts, so the apology was dropped. `ChatView` had no transcript kind for agent text. |
| (after the fix) prose split mid-word across bubbles | Prose streams in chunks; one bubble was appended per chunk. Chunks of one send now accumulate into a single entry. |

**R1 (flash) — 2 rubric misses.** Rows inert (`ActionList` with no action); "need review" read as the
repo's literal `status: needs review` label, 5 of 69. Title also oversized. **Levers:** prompt rule
reading intent by state rather than by a same-named label; brand-doc line keeping the surface title
at `small`/`medium` (*"a surface is a panel inside a conversation, not a standalone web page"*).

**R2 — row action fixed and proven live.** Template over `/prs`, `event: open-pull-request` carrying
`{"number": {"path": "number"}}`; clicking a row reached the agent with `number: 2093`. Counters
verified against the search API: 56 `review:required`, 69 open — both exact. Remaining: no per-row
state. New: an `UnderlineNav` rendered as an empty landmark (logged in `deferred-catalog-work.md`),
and its tabs carried no action.

**R3 — regression.** Fixing the *example* to show per-row state backfired: the model took the
prompt's sanctioned escape hatch and unrolled the rows (97 components, no data binding), then
switched the row action to `functionCall: openUrl` — navigating out to github.com, which defeats
`SPEC.md:16` ("agent round-trip, generative on each navigation") and makes any follow-up beat
impossible. The prompt beat the example.

**R4 — approved.** **Levers:** brand-doc rule that navigating to anything the agent could compose is
an `event`, never `openUrl` (reserved for genuinely external destinations); prompt rule making the
bound template the default and unrolling the exception; brand-doc rule against emitting unwired
navigation — which also removed the empty-nav gap. Result: 18 components, template over `/prs`,
`event` action, no dead nav.

The last open line — per-row state — was **not** an agent defect. It was a bad rubric line, amended
above: the search API carries no review decision or check status, so per-row state costs two extra
calls per row against an explicit tool-economy rule, and it is redundant when the whole list shares
one state. The agent was right in all four rounds.

**Client data model:** 2095 B, 1 surface (`prs-needing-review` 2042 B) on the action send.

**Approved surface** → `agent/knowledge/examples/pr-review-queue.json` (data trimmed to 4 rows; the
idiom, not the volume, is the lesson). Retires `review-queue-status-list.json` per spec decision 11.

![action round-trip](assets/beat-1-action-roundtrip.jpg)

## Beat 2 — PR detail

> "Open a2ui-project/a2ui#2123."

**Intent:** enough depth to judge the PR without leaving the surface.

- **Data truth** — title, number, state, author, branches, body, review and check state all fetched.
- **Sufficiency** — the seven of `SPEC.md` §3.2 are each **represented at summary depth**: the
  changed files as a path list carrying per-file ±, the checks as a tally of outcomes, the timeline
  as its content-bearing entries with the total volume stated. An element may be condensed; none may
  be absent. Depth past the summary is offered through an affordance, not rendered up front.
  *(Amended before round 5. The original line asked only that each element be "present in some
  form", which a transcription of GitHub's page satisfies maximally — and that is the wrong target.
  The static page stacks everything because one page must serve every visitor who ever loads it; a
  generative surface composes for the request. Reproducing that architecture spends the user's
  streaming time and the agent's tokens to arrive somewhere they could already have gone, which is
  the whole argument for generating the UI at all. The seven stay a floor so grading stays
  checkable — only depth is discretionary. `SPEC.md` §3.2 carries the same amendment. The reason is
  independent of any round's result: it held before R4 ran and would hold had R4 passed.)*
- **Composition** — the markdown body is **decomposed into catalog primitives** (headings, text,
  lists, links), not dumped as one string, and bounded to what conveys the change — a contributor
  checklist and link definitions are not that. Sections are distinguishable. No wall of prose and no
  unrendered markup or HTML entities.
- **Interactivity** — at least one **server** action that advances the flow, carrying PR context.
  Expand/collapse and "show more" are **local**.
- **Not required** — tabs, a diff view, syntax colouring, check annotations, sidebar ordering.

### Rounds — CLOSED at R8, accepted with known defects (not rubric-approved)

| R1 | R2 | R3 | R4 (2.5-flash probe) | R5 | R6 | R7 | R8 |
|---|---|---|---|---|---|---|---|
| ![](assets/beat-2-r1.jpg) | ![](assets/beat-2-r2-top.jpg) | ![](assets/beat-2-r3-top.jpg) | ![](assets/beat-2-r4-25flash.jpg) | ![](assets/beat-2-r5-top.jpg) | ![](assets/beat-2-r6-top.jpg) | ![](assets/beat-2-r7-top.jpg) | ![](assets/beat-2-r8-top.jpg) |
| | ![](assets/beat-2-r2-files.jpg) | ![](assets/beat-2-r3-files.jpg) | | ![](assets/beat-2-r5-bottom.jpg) | ![](assets/beat-2-r6-bottom.jpg) | ![](assets/beat-2-r7-bottom.jpg) | ![](assets/beat-2-r8-files.jpg) |

**R1 — 4 defects.** Valid on attempt 1 with 8 MCP calls (the sanctioned "drilling into one PR takes
several calls" path). `PageLayout` + `Timeline` + `StateLabel` composed sensibly, but: the markdown
body was one 2 KB `Text` blob; no changed-files list, only "+1,398 / -18 across 19 files"; **zero
actions** anywhere; and the content column wrapped prose at ~8 words.

The narrow column was **not** the agent's fault. `.chat-thread` caps every turn at 768 px, so a
two-column `PageLayout` gets ~400 px of content and ~250 px of pane. That is right for a transcript
and wrong for a generated application view — the constraint Phase 8's canvas exists to remove.
**Levers:** brand-doc rule to decompose a markdown body into components (headings, paragraphs,
lists, links) because there is no markdown component and the agent *is* its renderer; brand-doc rule
that a detail surface offers its next step as an action; prompt rule requiring the changed-files
list; and a client CSS stopgap widening surface turns past the transcript.

**R2 — three fixed, two new.** Markdown decomposed, files list present, four wired actions
(comment / approve / request-changes / close, each carrying `pr_number` and a bound body). But the
branch direction was **inverted** — "into `webframe` from `main`", claiming the change flows the
wrong way — and the file rows collided, "+422 lines" overprinting its `Added` chip.

The width fix was a **no-op**: `width: min(1200px, 100%)` inside a 768 px parent resolves to 768 px.
Replaced with `min(1200px, calc(100vw - 32px))` plus a centring transform, which escapes the parent.
**Levers:** the corrected CSS, and a prompt rule stating a PR merges its HEAD into its BASE.

**R3 — direction, markdown and layout all correct.** Full-width surface, full file paths with ±
chips and no collisions, description decomposed under real headings, one `submit-pr-comment` action
carrying `pr_number` and a bound draft. Five of `SPEC.md` §3.2's seven present.

Two regressed *out*: **CI checks** and **review/merge state**. R3 called `get`, `get_comments`,
`get_files`, `get_review_comments`, `get_reviews` — but not `get_status`/`get_check_runs`, which R2
had called. The included subset oscillates between runs because nothing states what a PR detail must
contain. **Lever:** a prompt rule enumerating all seven required elements explicitly.

**R4 — first attempt blocked, then run on `gemini-2.5-flash` as a downward-tier probe. Grades
nothing.** The credit exhaustion (`429 RESOURCE_EXHAUSTED`) that first blocked it did confirm one
thing: the client rendered *"the language model is temporarily unavailable"* rather than a blank
turn — the round-0 fix working on a failure mode it was not written for.

Re-run after the top-up on `gemini-2.5-flash` rather than the committed `gemini-3.5-flash`, so its
verdict is not a verdict on the seven-element rule — the model is the confound, and spec decision 9
spends ladder turns going *up* a tier, not down. Recorded as a model finding.

| Observed | Against |
|---|---|
| 3m24s to first token, then attempt 1 died on `MAX_TOKENS` at 43,728 chars with no complete surface | thinking tokens draw on the same output budget; attempt 2 recovered, ~6.5 min wall-clock for the turn |
| description dumped as one raw blob — `##`, `**`, `- [ ]` unrendered, `&#34;`/`&amp;` entities leaking | Composition |
| changed files as `+1938 / -31 across 22 files`, no path list — R1's defect verbatim | Sufficiency |
| branches absent entirely; no mergeable/blocked state | Sufficiency (metadata, review state) |
| zero actions — the interactive tree holds only the chat box and Send | Interactivity |
| CI checks present (`16 successful, 3 cancelled, 9 skipped`), reviewers present, timeline rich | the one element R3 lost came back |

Six MCP calls including `get_check_runs`. So the tier that recovered checks simultaneously lost three
elements R3 had — slower, truncation-prone, and below the demo bar on this evidence. **The
seven-element rule remains unverified.**

The timeline it did render — 40+ rows, most of them content-free `sugoi-yuzuru commented on this
pull request` with no body — is what prompted the rubric amendment above. "Timeline present" passed
while "long content is bounded" was violated in spirit, which is the tell that the line was grading
the wrong thing.

### The frame was wrong, not just the rubric

Between R4 and R5 the lever itself was re-examined and rejected. `SCOPE_DESCRIPTION` had accumulated
a screen definition — *"a pull-request detail carries all seven of… the paths, each with additions
and deletions, as a list rather than only an aggregate line total"* — added as R3's lever. That is an
expert system: a hand-authored `if detail then render these seven`, which a static page serves faster
and more reliably than a model can. It also contradicts `SPEC.md` §1, *"don't over-determine the
agent… less dev-specified logic than today's apps, not more."*

The structural cause was that **7.1 shipped no home for domain knowledge.** `brand-guidance.md`
declares its own charter — Primer mechanics only, explicitly *"no domain/triage instructions (what a
given screen should say)"* — and holds to it. So when a round exposed a missing element, the only
reachable lever was to prescribe the screen, because there was nowhere to write what a pull request
*is*.

**Levers (all applied together, per decision 6):**

- **New artifact `agent/knowledge/github-domain.md`** — a third 7.1 knowledge doc, declarative
  register, carrying facts and the decisions that hinge on them and never what a screen contains:
  head-into-base direction, mergeability as three independent gates, review verdicts vs comments and
  latest-per-reviewer, the three comment kinds, bots outnumbering humans, commit statuses *and* check
  runs both on the head SHA, `skipped`/`cancelled` not being failures, issues and PRs sharing one
  number space, labels as local conventions, what stalling actually is, notification `reason`.
  Loaded by `load_domain_knowledge()` and joined into the workflow slot.
- **Deleted from `SCOPE_DESCRIPTION`:** the seven-element sentence, outright, with nothing replacing
  it. Branch direction and the label-vs-state reading **moved** to the domain doc as facts. Tool
  economy stayed — it is about using tools, not about screens.
- The rubric amendment above, and the `SPEC.md` §3.2 depth principle.

Cost noted honestly: removing the enumeration risks the R2/R3 oscillation returning. The discipline
is that the answer is then better domain knowledge, not re-enumeration.

**R5 — the reframe holds; four defects.** `gemini-3.5-flash`, valid on **attempt 1 in 1m48s** (vs
6.5 min and a truncation on the 2.5 probe). Four calls: `get`, then `get_reviews` / `get_comments` /
`get_check_runs`.

What the domain doc produced with the prescriptive rules *deleted*:

| Emitted | Traced to |
|---|---|
| "sugoi-yuzuru wants to merge 14 commits into `main` from `webframe`" | head-into-base fact — the instruction that used to say this was removed |
| a **Merge Status** section synthesising conflicts + checks + reviews, unprompted | "three independent conditions gate a merge" |
| reviewers split by state — approved carries a check, the other five a pending clock | "requested and reviewed are disjoint states" |
| checks as a tally + a `Show check run details` disclosure rather than a dump | summary depth, unprescribed |
| timeline condensed to the two content-bearing reviews; bot review labelled as a bot | "bots can outnumber the human conversation" |

Defects:

| Observed | Against |
|---|---|
| Pre-launch Checklist rendered `[✓]` on all four items; the source body has `- [ ]` on all four. A description paragraph ("Includes web frame sandboxing rules, bridge state synchronization scripts…") appears **nowhere** in the source | Data truth |
| changed files still aggregate-only; `get_files` not called at all this round | Sufficiency |
| "Merge pull request" as the primary button — implies a mutation the agent structurally cannot perform (`SPEC.md` §3 read-only) | Interactivity |
| **zero wired actions**: "Merge pull request", "Comment" and "Show check run details" all inert; the only live control is an author `Link` out to github.com, which the brand doc's own `openUrl` rule forbids | Interactivity |
| a prose preamble above the surface duplicating it and narrating its own composition, raw markdown unrendered in the bubble | ROLE ("never answer in prose when a surface would serve better") |

The first is the **sharp edge of the summary-depth change**: sanctioning condensation invited the
model to author text on the source's behalf, and it flipped a checklist's state. Worse than R4's wall
of prose, which was at least true.

**Levers for R6** — two, both in `ROLE_DESCRIPTION`, since data fidelity and write capability are
facts about *this agent* rather than about GitHub, keeping the domain doc purely factual:

1. **Condensing vs authoring** — shortening a description to its substance is fair; writing a
   sentence its author did not write is not; the state of a thing (a checklist's boxes, a verdict, a
   conclusion) is data reported, never prose smoothed over.
2. **Read-only capability** — every tool is read-only, so an affordance claiming to merge, approve,
   post or close is a promise that cannot be kept; where that is the real next step, compose it and
   stop at the confirm boundary (`SPEC.md` §3).

Deliberately **not** levered: the changed-files miss (the operational line already says drilling in
costs several calls — adding a rule after one round is how the expert system grew last time), and
the prose preamble (likely downstream of the same over-narration instinct as defect 1).

**Flagged, not fixed** (decision 2 — rubrics grade information architecture and interaction, never
visual fidelity): `TimelineAvatar` renders as half-circles clipped at the surface's left edge. Three
compounding layers, only one of them the component, logged with the full diagnosis in
`deferred-catalog-work.md`. Not an agent defect.

**R6 — both levers landed.** Valid attempt 1, 1m29s, three calls. The fabricated checklist is gone;
"Merge pull request" is replaced by a real **compose-and-confirm** — a `Draft your response`
textarea bound to `/review/body` with Comment and Approve, both carrying a server `event`
`submit-review` with `pullNumber`, `reviewType` and the bound body. Reviewers gained explicit
verdicts (Approved / Commented / Pending ×4). New: **"28 checks completed successfully"** — false,
the 28 are 16 successful + 3 cancelled + 9 skipped, and the merge state R5 synthesised disappeared.
Changed files still absent; prose preamble still present.

**R7 — one lever of three landed. Stopped here.** Valid attempt 1, four calls.

| Lever | Result |
|---|---|
| ROLE: the surface is the answer, no preamble | **worked** — no text bubble at all, the surface is the whole response |
| domain: a non-failure is not a success; a mix is `unstable` | **failed** — "All checks have passed (28 successful checks)", worse phrasing than R6 |
| domain: files and commits are separate reads, not part of the PR object | **failed** — `get_files` still never called; "22 files changed" is the PR object's own aggregate |

The checklist is now the round's best result: five `Checkbox` components, `checked: false` **and
`disabled: true`** — faithful to the source *and* correctly non-interactive, the read-only fact
generalising past actions into rendering. Reviewers split into verdicts plus an explicit "Awaiting
Review" group. One server `event` (`post-comment`) carrying `pullNumber`/`owner`/`repo`.

**Stop, per decision 6** — two consecutive rounds producing the same defect, and a lever that is not
working is not repeated. Both surviving defects are Data truth / Sufficiency, and both resisted a
direct prose lever:

- **Checks misreported** (R6, R7). Note R5 got this *right* by reading the pull request's own
  `mergeable_state: unstable`; R6 and R7 got it wrong by tallying the check runs themselves. That
  makes it look less like missing knowledge than like a miscount over a large tool result — which
  prose cannot fix. The remaining options are structural (shaping what the tool returns) or
  accept-and-flag.
- **Changed files absent** (R5, R6, R7). Levered once, in the terms the reframe allows; no effect.

Merge state also absent in both R6 and R7.

**R8 — the file list arrives; the merge state arrives wrong.** One lever: the domain fact that
GitHub computes the merge verdict itself and the pull request carries it (`mergeable`,
`mergeable_state`, with the five states named), and that re-deriving it by tallying check runs is
where the answer goes wrong. Valid attempt 1; **five calls — `get_files` among them for the first
time since R4**.

| Emitted | Verdict |
|---|---|
| a **Changed Files** section: six paths, each with its status and additions, each row wired to a `view-file-diff` event carrying a bound `filename` | **fixed** — three rounds of absence ended |
| a "Merge Eligibility & Status Checks" section | present, and **factually wrong** |
| "Branch is currently out of date. Base branch 'main' has moved on." | `behind` — **false** |
| "python / web tests — passed (30 check runs in total)" | **false** |
| "Update branch" button wired to an `update-branch` event | **read-only violation, regressed** — R6/R7 had this right |
| "jgindin completed final code review comments" | authored characterisation — "final" is the model's inference |

Checked against the public API at the time of the round: `mergeable: true`, **`mergeable_state:
unstable`**, `changed_files: 22`, `commits: 14`, head `93639e6d`. So the file counts are right and
the merge state is not: `unstable` means mergeable-but-a-check-is-not-green, which is neither
"out of date" nor "all passed".

The failure mode is worth recording precisely, because it is the opposite of the one the lever was
written for. **Enumerating the five `mergeable_state` values gave the model a menu to pick from
rather than a field to read.** It produced a confident, well-composed sentence about `behind` — a
state it was handed the vocabulary for — instead of reporting `unstable`. Naming the possible values
of a field is not the same as making the model read it, and can actively license invention.

**Beat 2 stands at:** composition, interactivity, the compose-and-confirm boundary and now the file
list all good; **data truth about merge and check state unresolved after three rounds and two
distinct levers** (R6/R7 semantics of conclusions; R8 authoritative field). Two prose levers have now
failed on the same defect, so per decision 6 prose is not tried a third time. What remains is
structural — shaping what the tool hands back (a resolved check tally and merge verdict, rather than
raw runs the model re-derives from) — or accepting the defect and flagging it.

### Closure

Beat 2 is **closed at R8 as accepted-with-known-defects, not rubric-approved.** Its Data truth line
is not met: the surface states a merge state and a check outcome that the API contradicts.

Two consequences follow and are carried, not resolved here:

1. **No example is folded in from this beat.** Decision 4 folds only *approved* surfaces into
   `agent/knowledge/examples/`, and decision 11 retires an example only once its replacement is
   approved. So `comment-compose-form.json` and the rest stay, and the shipped example set still
   holds one beat-derived example (beat 1's) rather than two.
2. **The structural fix is the open lever.** Shaping the tool result so the agent receives a
   resolved merge verdict and check tally, instead of raw runs it re-derives from. Three rounds of
   evidence point at it, and it plausibly serves beats 4–8 as well, since every list beat also
   re-derives state from raw payloads.

## Beat 3 — compose-and-confirm review *(follows beat 2)*

> "Draft an approving review saying the spec doc looks reasonable."

**Intent:** a review composer that validates locally and stops before posting.

- **Data truth** — targets the PR from beat 2. The surface never states or implies that anything was
  submitted to GitHub.
- **Sufficiency** — which PR is under review, a body input, an approving stance (explicit or chosen),
  and a submit affordance.
- **Composition** — reads as a form: labelled input, visible validation state, clear primary action.
- **Interactivity — load-bearing** — body validation is a **local** function (non-empty, and/or a
  minimum length) bound to the submit affordance's enabled/validation state. Submitting an empty or
  invalid body is **visibly prevented client-side, with no agent turn**. Submit itself resolves to a
  local confirmed state or a **server** action producing a confirmation surface. **Nothing posts** —
  no write tool exists.
- **Not required** — GitHub's radio-group layout, a diff context pane, a preview tab.
- **Never acceptable** — omitting validation to make the beat pass. Proving the local-function
  mechanism end to end is why this beat exists.

*(The task spec's invariant names "beat 5" as the load-bearing one. That is stale numbering — beat 5
is issue-detail and the compose beat is 3, per `SPEC.md` §3.1. Read it as "the compose beat".)*

### Rounds — approved at R2

| R1 | R2 (drafted) | R2 (blocked after Clear) ✓ |
|---|---|---|
| ![](assets/beat-3-r1.jpg) | ![](assets/beat-3-r2-drafted.jpg) | ![](assets/beat-3-r2-blocked.jpg) |

Each round is two live turns: a fresh conversation, beat 2's prompt, then this beat's as a follow-up.
No adapter change was needed — task 7.9 had already adopted `required`, `length`, `regex`, `numeric`,
`email` and `and`/`or`/`not`.

**R1 — form composed, validation absent.** The surface drafted for real: a `Textarea` bound to
`/review_body` pre-filled with "The specification document looks reasonable.", a three-way review-type
radio with Approve preselected, `clearValue` wired as a local call, and a server `event`
(`submit-pr-review`) carrying the PR context. But **zero validation**: clicking Clear emptied the body
and `Submit review` stayed enabled, so an empty submit would have reached the agent. Submit was never
clicked — the emitted surface proves the absence statically, and a click would have cost a turn.

The cause was **our own documentation, not the model.** `brand-guidance.md` pointed the agent at a
`checks` rule — the mechanism `docs/concepts/actions.md` describes upstream, which **this catalog does
not declare** (`"checks"` appears zero times in `catalog.json`) — and then told it client-side
validators "are added on demand as flows need them, not assumed", which stopped being true when 7.9
shipped fourteen of them. Meanwhile nothing said that a dynamic-typed property accepts a function
call. The agent was told the wrong door existed and the right one was never mentioned.

`Button.disabled` is a `DynamicBoolean`, which the protocol defines as *"a boolean value that can be a
literal, a path, or a function call returning a boolean"* — and every adopted validator declares
`returnType: 'boolean'`. The capability was there the whole time.

**Levers:** brand-doc only, both catalog mechanics rather than screen prescription — a rule that a
`Dynamic*` property takes a literal, a `{path}`, or a function call returning that type (the third
form being how a control's state derives from data the user is editing, client-side, with no
round-trip); and a forms rule to gate a submit control by binding `disabled` to a function call over
the input's path, naming the validators that ship and stating that a `required` marker on a
`FormControl` labels but does not enforce.

**R2 — approved.** First try after the fix, valid on attempt 1. The submit button carries:

```json
"disabled": { "call": "not",
  "args": { "value": { "call": "required",
    "args": { "value": { "path": "/reviewBody" } }, "returnType": "boolean" } },
  "returnType": "boolean" }
```

Exercised live rather than inferred — Clear clicked for real, then the field driven:

| Body state | `Submit Review` |
|---|---|
| emptied via `clearValue` | **disabled** |
| "Looks good." typed | enabled |
| cleared again | **disabled** |

Re-evaluates in both directions, on the client, with no agent turn. Stance is a `SegmentedControl`
with Approve preselected; submit is a server `event` carrying `prNumber: 2123` and the bound body;
nothing posts.

**Flagged, not failed** (decision 2):

- The caption *"Your feedback is sent directly to the author"* promises a send the agent structurally
  cannot perform. Nothing claims anything *was* submitted, so Data truth holds — but it is the same
  family as beat 2 R8's "Update branch".
- `required` accepts **whitespace-only** input: `"   "` re-enables submit. That is the upstream
  basic-catalog implementation 7.9 wrapped, and the rubric asks for non-empty rather than
  trimmed-non-empty. Worth knowing before leaning on `required` for a stricter field.

**Approved surface** → `agent/knowledge/examples/pr-review-compose.json`. Retires
`comment-compose-form.json` per decision 11; it adds the compose-and-confirm-with-client-validation
idiom the set lacked. Strict example gate green (186), client suite green (541).

## Beat 4 — issue list, fuzzy intent

> "Which issues on a2ui-project/a2ui look like they're stalled waiting on someone?"

**Intent:** a vague qualifier resolved into a concrete query — inference, not retrieval.

- **Data truth** — real open issues of that repository.
- **Inference** — the agent attempts the interpretation rather than asking which issues are meant; a
  repository is named, so the scope rule gives it no reason to punt. The surface makes evident on
  what basis these issues were selected.
- **Sufficiency** — each row identifies the issue and shows the signal that made it qualify (label,
  last activity, assignee, or similar).
- **Composition** — scannable, consistent rows.
- **Interactivity** — row resolves to a **server** action carrying its issue number; client-side
  narrowing is **local**.
- **Not required** — matching GitHub's label density, sub-issue badges, milestone chips.
- **Fails if** — it answers with a clarifying question instead of an attempt.

### Rounds — approved at R1

| R1 ✓ |
|---|
| ![](assets/beat-4-r1.jpg) |

Valid on attempt 1. Three searches: all open issues, then
`label:"status: waiting-for-author-response"`, then `no:assignee`. Data truth checked against the
API rather than read off the screen — `#2115` is open, opened by `likebean`, updated
`2026-07-28T10:56:26Z`, labels and assignee exact, `is_pr: False`. It queried `is:issue`, so the
shared number space is handled.

One bound template over `/issues` with a **nested** `LabelGroup` template over relative `labels`,
dividers, a `CounterLabel` of 9, and each row resolving to a server `event` `open-issue` carrying
`{"number": {"path": "number"}}`.

**Flagged, not failed** (decision 2):

- **The prose preamble returned** — "Here are the open issues … with the
  `status: waiting-for-author-response` label:", backticks unrendered. The ROLE rule held in beat 2
  R7/R8 and beat 3 R2. First recurrence, so not a two-round pattern.
- **The inference narrowed to one label.** It fetched `no:assignee` and discarded it; the shipped
  set is the label query alone. The Inference line requires the basis be *evident*, not that it be
  any particular basis, and the surface says plainly what it selected on — so it passes as written.
  But "stalled waiting on someone" is broader than "waiting on the author": an unanswered question
  or an untriaged unassigned bug waits on a *maintainer*, and those were fetched and dropped. The
  domain doc's own words are that a label "covers a fraction of what the user means".

**Approved surface** → `agent/knowledge/examples/stalled-issue-list.json` (trimmed to 4 rows; the
idiom, not the volume). Retires `issue-triage-list.json` per decision 11. It earns its place over
`pr-review-queue` by adding the **nested template** — that example has one template, this has two.

## Beat 5 — issue detail

> "Open a2ui-project/a2ui issue #2124."

**Intent:** the full context of one issue.

- **Data truth** — all fields fetched this turn.
- **Sufficiency** — title, number, state, who opened it and when, the body, labels, assignees, and
  the activity timeline including cross-references to other issues or PRs.
- **Composition** — body markdown decomposed; timeline entries legible as discrete events (who did
  what, when), not a wall of prose.
- **Interactivity** — at least one **server** action carrying its target (for example the referenced
  PR); expand/collapse is **local**.
- **Not required** — the projects/milestone/relationships/notifications sidebar blocks, reactions,
  participant avatars.

### Rounds — approved at R3

| R1 | R2 (crashed) | R3 ✓ |
|---|---|---|
| ![](assets/beat-5-r1.jpg) | ![](assets/beat-5-r2-render-failure.jpg) | ![](assets/beat-5-r3.jpg) |

`#2124` was checked against the API first: open, not a PR, opened by `pinieb`, **0 comments**,
labels and assignee as shown. The prompt was run as written rather than swapped for a richer issue —
the prompt is part of the beat definition. The thin timeline turned out not to matter: the
cross-reference lives in the **body**, so the Sufficiency line was genuinely exercised.

**R1 — run chained after beat 4** (same conversation, at the user's direction; beat 5 is otherwise
self-contained). Valid attempt 1. Everything matched the API. Two things arrived unbidden: the
**validation idiom generalized** — the Comment button carried `not(required(/commentDraft))` though
this beat's rubric only asks for expand/collapse to be local, verified live empty → disabled → typed
→ enabled — and it was **arc-aware**, wiring a back arrow to `back-to-stalled-issues` because it knew
it came from beat 4's list. That is Phase 8 behaviour appearing early.

**Defect:** the `#2058` cross-reference was an `openUrl` anchor to github.com. The brand doc's
standing rule is that navigating to anything you could compose is an `event`, and it names a pull
request first.

**Lever.** The rule existed and did not fire, so the interesting question was why. Two rules
collided: the markdown-decomposition rule says a body's "links `Link`" unconditionally, and `Link`
carries an `href` and nothing else — **no action**. The agent followed the rule it was given and had
no expressible way to make a body reference an event; `Button` with `variant: "link"` was never
named. Added to the decomposition section: a body link to something in this domain is not a `Link`;
render it as a `Button variant="link"` carrying an `event` with the target's identity, and reserve
`Link` for genuinely external destinations.

**R2 — could not be graded.** The lever worked at the A2UI level (zero `Link` components, the
cross-reference a `Button variant="link"` carrying `open-pull-request`), but the client rendered
*"This view failed to render."* Diagnosed rather than guessed — see below. Not an agent defect.

**R3 — approved.** Same prompt, same agent process, same assembled prompt as R2; the only difference
was the client fix. R2 died, R3 rendered — about as direct a confirmation as the fix could get.
Zero `Link` components and zero anchors in the DOM, and the rule generalized past the round it was
written for:

| Reference | R1 | R3 |
|---|---|---|
| `a2ui-project/a2ui#2058` | `<a href="…/pull/2058">` | `Button variant="link"` → `open-pull-request {number: 2058}` |
| `@jacobsimionato` | plain text | `Button variant="link"` → `open-user {username: "jacobsimionato"}` |

Plus `add-comment` carrying `issueNumber: 2124` and the bound draft, validation re-verified live in
both directions, and no console errors.

**Client data model:** 3825 B on the chained R1 send — beat 4's entire nine-issue model riding along
with an issue-detail request, against 2095 B for beat 1's single surface. Second data point for the
monotonic growth Phase 8 inherits.

**Approved surface** → `agent/knowledge/examples/issue-detail.json`, replacing the 7.1 example of the
same name per decision 11. It adds in-session navigation for references **inside decomposed
markdown**. With this, all four shipped examples are beat-derived and the original 7.1 set is fully
retired — decision 11's endpoint.

### The render crash behind R2 — a client bug, not an agent one

The agent streams a surface, so the SDK's incremental parser emits `updateComponents` carrying a
component whose function-call-valued prop has `call` but not yet `args`. The binder resolves it
eagerly — `DataContext.resolveSignal` → `Object.entries(undefined)` →
`TypeError: Cannot convert undefined or null to object` — and `SurfaceErrorBoundary` **latched
`failed` permanently**, so a milliseconds-long parse window became a surface that stayed dead for the
session.

It is a race on chunk boundaries, not a property of any surface: beats 3, 4 and 5 R1 survived by
luck. It reads as an agent defect at a glance, so it has plausibly been costing rounds unnoticed.

Everything was eliminated by reproduction, not inspection — `formatString` as a property value, the
render-before-data-model window, and the captured surface's content all render fine in every
application order, batched or streamed, and the identical captured surface replays flawlessly through
the dev page in the same browser and Vite bundle. That is what forced attention onto the application
path.

Fixed in `b26f8fe`: the boundary takes a `resetKey` that `ChatView` bumps per applied message, so
each message buys exactly one retry and a genuinely broken component still settles into the fallback.
`client/tests/streamed-partial-components.test.tsx` pins both halves — complete function-call props
render, half-parsed ones throw — so if the renderer stops throwing we find out rather than silently
keeping a workaround.

## Beat 6 — repository landing

> "Show me the a2ui-project/a2ui repository."

**Intent:** orient someone who has not seen this repository before.

- **Data truth** — name, description, statistics, tree entries and README content all fetched.
- **Sufficiency** — identity and description, at least two headline statistics (stars, forks,
  watchers, commits), the file tree, and README content.
- **Composition** — the tree is presented **hierarchically**; a flat alphabetical dump fails the
  intent, because the thing being communicated is structure. (`TreeView` is the catalog's only
  hierarchical component, so in practice that is what serves it.) README markdown is decomposed. A
  language breakdown, if shown, is proportional rather than a list of numbers.
- **Interactivity** — directory entries expand **locally** or resolve to a **server** action carrying
  their path. If file contents cannot be rendered, no affordance may promise to open one.
- **Not required** — the contribution/deployment/custom-properties blocks, contributor avatars,
  releases, the exact sidebar composition.

## Beat 7 — user profile

> "Who is gspencergoog and what do they work on?"

**Intent:** a picture of one person's identity and focus.

- **Data truth** — profile fields, repositories and activity all fetched; no invented repositories,
  star counts or follower numbers.
- **Sufficiency** — identity (name, login, bio or company), a following-scale signal, and evidence of
  what they work on — repositories, recent activity, or both.
- **Composition** — repositories rendered as a repeated, self-describing shape; each conveys what the
  repository is, not just its name.
- **Interactivity** — a repository entry resolves to a **server** action carrying owner and name;
  expand/collapse is **local**.
- **Not required** — the contribution heatmap (no catalog component expresses it; the headline
  contribution count is sufficient), achievements, organisation badges, the year selector.

## Beat 8 — viewer-centric, ambiguous scope

> "What needs my attention today?"

**Intent:** names neither a repository nor the viewer explicitly — the scope rule must resolve it to
the authenticated user.

- **Scope** — the agent resolves the viewer's identity through tools and scopes to them. Asking which
  repository is meant is a failure; `SPEC.md` §3 makes the viewer the fallback.
- **Data truth** — everything shown genuinely belongs to the viewer. **A thin or empty result is
  rendered honestly and never padded with invented items.** The token reaches public repositories
  only, so the live result is expected to be far thinner than the reference — density is not graded.
- **Sufficiency** — per item: what it is, where it lives, and why it wants attention.
- **Composition** — grouped or prioritised rather than an undifferentiated dump. A thin result yields
  a clean minimal surface, not an empty shell with headings and no content.
- **Interactivity** — an item resolves to a **server** action carrying its target. No affordance may
  imply it changed anything on GitHub; a local toggle is acceptable only as visibly local selection.
- **Not required** — the reference's density, the filters sidebar, repository grouping counts.
