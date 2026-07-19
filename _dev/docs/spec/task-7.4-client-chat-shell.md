# Task 7.4 — Client chat shell

The minimal conversational surface in `client/`: a prompt input + rendered surface area over the
existing A2A middleware. Parent: `_dev/TODO.md` 7.4; phase spec `_dev/docs/spec/phase-7-agent.md`
(decisions 2, 11).

## Scope

- A user types a natural-language prompt, it is sent over A2A, and A2UI surfaces stream in and
  render through the existing pipeline (`MessageProcessor` → `A2uiSurface`, adapter catalog).
- Client-only. No agent-side changes; verifiable against the Phase-2 deterministic agent.
- The fixture TestSpace and its Playwright baselines keep working; their page URL update is in
  scope (see decision 1).
- Presentation polish, conversational chrome, and transcript UX are Phase 8.

## Locked decisions

### 1. Two Vite pages — chat is the default, fixtures move to a dev page

The chat client is the default page; the fixture TestSpace becomes a dedicated dev page. The
Playwright baselines' navigation URLs shift to the dev page — a mechanical update across the
baseline specs, no behavior change. Exact page naming is implementation detail.

### 2. Streaming-native transport

User text is sent as an A2A `TextPart` message via `sendMessageStream`, with per-event extraction
of A2UI messages (`Task | TaskStatusUpdateEvent`) — retiring the standing terminal-Task `TODO` in
the A2A extraction helper. The deterministic agent's single-terminal-Task reply is the degenerate
case and remains the live verification target; the progressive case is covered by unit tests over
mocked stream events.

### 3. Minimal UX — prompt box + surface area + pending state

No transcript, no message-history list. The agent's rendered surface is the response view; the
shell adds only a prompt input and a busy/pending indicator while a stream is open. The shell is
**host chrome, hand-written React using stock Primer components directly** (e.g. prompt input,
button, spinner, layout frame) — it does not go through the A2UI catalog/renderer, and gets no
bespoke styling or layout work.

### 4. `contextId` threading in both send paths

The shell captures the A2A `contextId` from responses and threads it into subsequent sends on
**both** paths — text prompts and the existing action handler — so the server keys one
conversation/session across turns. The deterministic agent ignores it harmlessly; correctness is
covered by unit tests.

## Invariants

- The catalog/renderer path is exclusively for agent-generated surfaces; shell chrome never uses
  it.
- The fixture harness remains a permanent dev asset — untouched in behavior, only relocated.
