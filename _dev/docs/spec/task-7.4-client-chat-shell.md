# Task 7.4 — Client chat shell

The minimal conversational surface in `client/`: a prompt input + rendered surface area over the
existing A2A middleware. Parent: `_dev/TODO.md` 7.4; phase spec `_dev/docs/spec/phase-7-agent.md`
(decisions 2, 11).

## Scope

- A user types a natural-language prompt, it is sent over A2A, and A2UI surfaces stream in and
  render through the existing pipeline (`MessageProcessor` → `A2uiSurface`, adapter catalog).
- Client-side, verifiable against the Phase-2 deterministic agent. One agent-side exception,
  discovered during verification: the deterministic executor answered only A2UI actions, so a
  canned text-prompt response (a fresh per-prompt chat surface echoing the prompt) is added to
  make the shell's text path live-verifiable.
- The fixture TestSpace and its Playwright baselines keep working; their page URL update is in
  scope (see decision 1).
- Deeper presentation polish and the multi-turn conversational arc are Phase 8.

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

### 3. Chat UX — production-like transcript shell

A conversational transcript: user prompts and agent surfaces render as a message history of
bubbles/cards, with a composer input, a header, and a busy/pending indicator while a stream is
open. The shell is **host chrome, hand-written React using stock Primer components directly**
(composer, button, spinner, layout frame) styled with Primer CSS variables — it does not go through
the A2UI catalog/renderer.

This supersedes the original minimal-UX scope (prompt box + surface area only, no transcript, no
bespoke styling); the production-like chat UI was requested mid-task.

### 4. `contextId` threading in both send paths

The shell captures the A2A `contextId` from responses and threads it into subsequent sends on
**both** paths — text prompts and the existing action handler — so the server keys one
conversation/session across turns. The deterministic agent ignores it harmlessly; correctness is
covered by unit tests.

## Invariants

- The catalog/renderer path is exclusively for agent-generated surfaces; shell chrome never uses
  it.
- The fixture harness remains a permanent dev asset — untouched in behavior, only relocated.
