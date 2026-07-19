# Task 7.4 — Client chat shell: implementation plan

## Context

Phase 7 needs a way for a human to talk to the agent: today `client/` only renders canned fixtures
(`TestSpace`) and can send *component actions* over A2A — there is no user-text path and no
conversational page. Task 7.4 (spec: `_dev/docs/spec/task-7.4-client-chat-shell.md`) adds the
minimal chat shell: a prompt box + surface area on a default page, streaming-native transport,
`contextId` threading, with the fixture harness relocated to a dev page. Verifiable end-to-end
against the Phase-2 deterministic agent — confirmed during exploration: its executor treats a
text-only message as the unknown-action fallback and still returns a canned surface
(`agent/deterministic_agent/executor.py:34`), and its card advertises `streaming=True`, so
`message/stream` works today.

Locked decisions (from the task spec): two Vite pages (chat default, fixtures on a dev page);
`sendMessageStream` with per-event extraction (retires the `TODO` in `client/src/a2a/messages.ts`);
minimal UX (prompt box + surface area + pending state) built from stock Primer components as host
chrome outside the catalog path; `contextId` threaded through both send paths.

## Harness steps (before code)

1. Copy this plan to `_dev/docs/plan/task-7.4-client-chat-shell.md`, commit on `main`
   (`docs(phase-7): plan task 7.4`).
2. Create the worktree `phase-7/4-client-chat-shell` off `main` (per
   `daily-work-harness:rebase-with-main`). All code below lands on that branch; `_dev/` stays on
   `main`.

Implementation follows TDD (`superpowers:test-driven-development`): each numbered step below is
test-first where a test target exists.

## Implementation

### 1. Two Vite pages

- `client/dev.html` — new page, same skeleton as `index.html` (title "dev"), loading
  `src/dev.tsx`.
- `client/vite.config.ts` — add `build.rollupOptions.input` listing both HTML files (dev server
  and preview serve `dev.html` with no extra config).
- Extract the Primer providers + CSS side-effect imports (currently split between
  `client/src/main.tsx` and `client/src/App.tsx`) into a shared `client/src/providers.tsx`
  (`ThemeProvider` + `BaseStyles` + the `@primer/primitives` CSS imports with their existing
  comments).
- `client/src/dev.tsx` — mounts the fixture app: move the current `App.tsx` content (fixture
  selector wiring + `SERVER_URL` action-handler plumbing) to `client/src/test-space/DevApp.tsx`.
- `client/src/App.tsx` — becomes the chat app (step 3); `client/src/main.tsx` keeps mounting it.
- `client/src/App.test.tsx` — split: `DevApp` test keeps the fixture-select assertion; new chat
  test in step 3.
- `client/e2e/visual.spec.ts:220` — `page.goto(`/dev.html?fixture=${name}`)`. Only the URL
  changes; `FixtureView` markup is untouched so all baselines stay valid.

### 2. A2A layer — streaming, text path, contextId

All in `client/src/a2a/`:

- `messages.ts`
  - `buildTextMessageParams(text, contextId?)` — `TextPart` user message (mirrors
    `buildActionMessageParams`).
  - `buildActionMessageParams(action, contextId?)` — optional `contextId` on the message.
  - `extractA2uiMessagesFromEvent(event: A2AStreamEventData): A2uiMessage[]` — per-event
    extraction: `Message` → `parts`; `Task`/`TaskStatusUpdateEvent` → `status.message.parts`;
    `TaskArtifactUpdateEvent` → ignored (A2UI rides status messages in our stack; note it in a
    comment). Existing version-tag filter logic is reused; the terminal-Task `TODO` comment is
    retired and `extractA2uiMessages` becomes a thin wrapper for the non-stream result shape.
  - `extractContextId(event): string | undefined` — from `Message.contextId` / `Task.contextId` /
    status-update `contextId`.
- `session.ts` (new) — `createA2ASession()`: a tiny mutable holder `{get, set}` for the
  conversation `contextId`, shared by both send paths.
- `client.ts` (new) — the lazy agent-card resolution currently inlined in
  `createA2AActionHandler.ts` (`getSender`), extracted so both paths share it. The test seam
  `A2AMessageSender` grows `sendMessageStream(params): AsyncGenerator<A2AStreamEventData>` and
  moves here.
- `createA2AActionHandler.ts` — switches to `sendMessageStream` + per-event extraction/apply;
  accepts an optional `session` and threads `contextId` both ways (send + capture). Error behavior
  unchanged (never throws, logs, skips apply).
- `streamUserMessage.ts` (new) — `streamUserMessage({getSender, session, text, apply})`: builds
  text params with the session's `contextId`, iterates the stream, applies extracted messages per
  event, captures `contextId` into the session; resolves when the stream closes (drives the
  pending state); logs errors like the action handler.

Unit tests (`messages.test.ts`, `streamUserMessage.test.ts`, `createA2AActionHandler.test.ts`)
with fake senders (async generators): all four event kinds, contextId capture-and-resend on both
paths, version-tag filtering, error swallow.

### 3. Chat page UI

- `client/src/chat/ChatView.tsx` — owns one `MessageProcessor([CATALOG], actionHandler)` with the
  shared session; renders:
  - surface area: same subscription pattern as `FixtureView` — extract that
    `onSurfaceCreated`/`onSurfaceDeleted` → state logic into a shared hook
    `client/src/a2ui/useSurfaces.ts` used by both (FixtureView render output unchanged).
  - prompt box: Primer `Textarea` (or `TextInput`) + `Button` "Send"; Enter submits; input +
    button disabled while pending; Primer `Spinner` as the pending indicator. Stock components,
    default styling — host chrome only, no catalog involvement.
- `client/src/App.tsx` (chat app) — providers + `ChatView`, `SERVER_URL` from
  `VITE_A2A_SERVER_URL` (same pattern as today).
- Component test: fake sender streaming a canned surface — pending appears then clears, surface
  renders, second send carries the captured `contextId`.

### 4. Verification

- Full repo gates: `yarn build:all` / typecheck / `lint:all` / `test:all` (root orchestration),
  plus `client` unit tests.
- `yarn workspace client test:e2e` — all existing baselines pass with the dev-page URL (no pixel
  changes expected).
- Live wire check: run the deterministic agent per `agent/README.md`; open the chat page; type
  anything → the fallback canned surface streams in and renders; a second prompt confirms
  `contextId` reuse (visible in the request payload). In the tunnel environment use the tunnel
  URLs / public ports per `CLAUDE.md` (client `VITE_A2A_SERVER_URL` → agent tunnel URL); on
  localhost the defaults stand.
- Wrap-up (`daily-work-harness:wrap-up`) owns the merge + TODO tick when done.
