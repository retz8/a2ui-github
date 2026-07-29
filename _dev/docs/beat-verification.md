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
  title), who raised it, and at least one state signal (review state and/or CI). The size of the
  result set is conveyed somehow.
- **Composition** — an enumerable, scannable structure with a consistent per-row shape; not a prose
  paragraph and not one text blob. No empty sections.
- **Interactivity** — a row resolves to a **server** action carrying its PR number. Reordering or
  narrowing rows already fetched is **local**.
- **Not required** — GitHub's row layout, labels, task-list progress, linked-issue counts, an exact
  field set, or a server-side "needs review" filter (per-row review state is sufficient).

## Beat 2 — PR detail

> "Open a2ui-project/a2ui#2123."

**Intent:** enough depth to judge the PR without leaving the surface.

- **Data truth** — title, number, state, author, branches, body, review and check state all fetched.
- **Sufficiency** — the seven of `SPEC.md` §3.2 are each present in some form: metadata, description,
  review state, CI checks, reviewers, comment timeline, files-changed summary.
- **Composition** — the markdown body is **decomposed into catalog primitives** (headings, text,
  lists, links), not dumped as one string. Sections are distinguishable. Long content is bounded
  rather than allowed to run.
- **Interactivity** — at least one **server** action that advances the flow, carrying PR context.
  Expand/collapse and "show more" are **local**.
- **Not required** — tabs, a diff view, syntax colouring, check annotations, sidebar ordering.

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
