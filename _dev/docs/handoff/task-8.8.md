# Handoff — task 8.8 (docs & code wrap-up)

## Where things stand

**Code half: DONE.** PR #120 merged to `main` (`224fd56`) after the live visual test passed all four checks (palette → progressive paint, hold-and-swap, time-travel dispatch from a parked view, zero-LLM beat replay). Three post-merge fixes landed on `main` during the same live review:

- `15a669d` — hold the parked view while a forked paint streams; jump to live moved from dispatch to landing (spec decision 5 amended; THESIS §5c gained the rule in `2e0b90f`).
- `916d3bd` — `<no-surface/>` shell marker: the agent declines unsupported (write) actions with prose only — no refetch, no repaint. Prompt golden regenerated.
- `edee174` — `client/src/canvas/` grouped: root spine (CanvasApp, createCanvasWiring, canvasStore, replayBeat) + `components/` + `turn/` + `timeline/`.

All suites green after each: 731 client tests, 257 agent tests, typecheck/prettier clean. Playwright unaffected (moves only).

**Docs half: in progress** (user-driven, on `main`): tunnel doc rewrite (`7a28776`), adapter README + MIT LICENSE (`8c88347`), agent README scrub (`a82c769`). `.superpowers/sdd/` already gone.

## Remaining (docs half, per spec)

- Root README — layered showcase + map, `THESIS.md` pointer, localhost-only workflow (spec decision 1).
- Hero mp4 — fresh ~12–15s capture (empty canvas → paint → follow-up → swap), embedded via GitHub upload URL (decision 2).
- Client README — live-agent-primary rewrite; chat page documented as first-class; beat-replay params + palette shortcut (decisions 4–5).

Then tick 8.8 and consider Phase 8 `[done]`.

## Open threads

- Dev servers (agent 10003, client 5173) stopped at wrap-up; run commands in `_dev/docs/tunnel-environment.md`. The hero recording needs them live.
