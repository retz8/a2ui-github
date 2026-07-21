# Task 7.8 — Examples showcase page

A third client dev page that renders the 7.1 agent knowledge examples one at a time, so the curated
`{intent → surface}` corpus can be verified visually. Parent: `_dev/TODO.md` 7.8; phase spec
`_dev/docs/spec/phase-7-agent.md`. Depends only on 7.1 (`agent/knowledge/examples/`), already merged;
parallel to the whole 7.2→7.7 chain.

## Scope

- A new client page (own html + tsx entry, wired into the Vite build) that reads
  `agent/knowledge/examples/*.json` and renders each example's surface through the existing render
  pipeline, with the example's natural-language intent shown alongside.
- A vitest mount gate over the examples, and a README line documenting the page.
- Client-only, read-only on the agent examples. No changes to the examples themselves, the chat
  shell (7.4), the agent runtime, or the catalog.

## Locked decisions

### 1. Register — a third dev oracle, not a demo

A dev oracle in the same family as `dev.html`: zero-chrome, inheriting the dev page's simplicity, its
audience the developer verifying that the curated examples render as intended. The one thing it adds
over `dev.html` is showing each example's natural-language intent next to its rendered surface. A
polished external-facing demo is not this task (that would be a Phase-8 surface).

### 2. Cross-subproject coupling — `import.meta.glob`, single source of truth

The client reaches `agent/knowledge/examples/*.json` — a different subproject, outside the yarn
workspace — via Vite `import.meta.glob` (eager). Vite bundles the JSON at build; the agent examples
stay the one canonical copy and the page only reads them. No copy or sync step, so the page
auto-reflects 7.1/7.7 edits. 7.8 is a read-only consumer.

### 3. Layout — selector, one example at a time

A dropdown selector with an `?example=` URL param, showing one example at a time — not a gallery. The
examples are page-level surfaces (issue-detail is a full `PageLayout`; comment-compose-form a full
form), each of which needs the full viewport; stacking them would have them fight for space.

### 4. Intent display — dropdown by name, intent as caption

The dropdown lists examples by `name` (the kebab id, URL-clean for `?example=`); the example's
`intent` renders as a caption directly above the rendered surface. Seeing the request against its
resulting UI is the verification value.

### 5. Action handling — no handler; local functions live, events inert

No action handler is wired. Local `functionCall` actions run live (e.g. `clearValue` clears the
draft, `consoleLog` logs) — legitimate interactivity to verify. `event` actions are inert. Wiring the
deterministic A2A server or the live agent is out of scope; `event` round-trips belong to the chat
shell against a real agent.

### 6. Component structure — new `ExamplesSpace` reusing `FixtureView`

A new thin selector wrapper (`ExamplesSpace`) reuses `FixtureView` as the shared renderer — an
example is structurally a `Fixture` plus `intent`, consumed as-is. `TestSpace` is not generalized: it
is coupled to the fixtures registry and its lazy `load()` (built for hundreds of modules), whereas
the examples arrive eagerly from the glob, use a different URL key, and add the intent caption. The
new page follows the existing `dev.html` → `dev.tsx` → `test-space/` convention (new html entry +
entry tsx + own dir); exact names settle at implementation.

### 7. Testing / DoD gate — glob-driven vitest mount test, no Playwright

The gate is a glob-driven, count-agnostic vitest mount test: it renders every example through the
page and asserts it mounts (surface present, no throw), automatically covering any example 7.7 adds.
No Playwright baselines — they fight the living-artifact churn and the examples are page-level and
noisy; the `?example=` URL makes adding one baseline trivial later if ever needed.

### 8. Server-independence

Because no handler is wired, the examples page has zero server dependency — no `VITE_A2A_SERVER_URL`,
no agent, no tunnel — and renders standalone in plain `vite dev` and in CI. Stated as a decision so a
server is not wired in later.

### 9. Definition of done

In scope: the new html/tsx entry, `ExamplesSpace`, and the `rollupOptions.input` wiring; the
`import.meta.glob` coupling; the vitest mount gate; and a README line documenting the examples page as
a third, server-independent dev page.

## Invariants

- Read-only on `agent/knowledge/examples/` — 7.8 never edits the examples (that surface is 7.1/7.7's).
- No Playwright baselines, no server/handler wiring, no chat-shell (7.4), agent-runtime, or catalog
  changes.

## Open items

- Confirm Vite `server.fs.allow` reaches `agent/` during `vite dev`; add `server.fs.allow` if it does
  not. (The production build bundles via the glob and does not hit `fs.allow`.)
- Confirm an `event` action firing with no handler does not throw; add a trivial no-op handler if it
  does.
