# Handoff — Task 7.4 Client chat shell

**State: implementation complete and live-verified; awaiting `wrap-up` (merge + TODO tick).**

- Branch: `phase-7/4-client-chat-shell` (worktree `../a2ui-github-worktrees/phase-7-4-client-chat-shell`), 5 commits ahead of `main`:
  1. `eae0e34` missing darwin Playwright baselines blessed (PageHeader/Breadcrumbs/UnderlineNav — side effect, separate commit)
  2. `8508f61` the chat shell itself (two pages, streaming A2A, contextId session, ChatView)
  3. `c93e2d8` deterministic agent: canned text-prompt response (spec exception, recorded in spec)
  4. `d332dc3` production-like chat UI (transcript bubbles/cards, composer, header)
  5. `cd7391c` interactive canned chat response (in-card catalog Button → submit round-trip)
- All gates green at `cd7391c`: repo build/typecheck/lint, 407 client vitest, 69 agent pytest, 212 Playwright baselines (URL moved to `dev.html`, no pixel changes).
- Live verification done headlessly and by the user through the tunnel: prompt → streamed surface; second prompt threads `contextId`; in-card Acknowledge button round-trips and disables via `/submitted` binding.

## Left for wrap-up

- Merge branch to `main`, tick 7.4 in `_dev/TODO.md`.
- Spec amendment: decision 3's "minimal UX / no bespoke styling" line is superseded — the user requested the production-like chat UI mid-task (transcript layout, Primer CSS vars). The agent-side exception is already recorded in the spec's Scope.
- Dev servers may still be running on the home Mac: agent `localhost:10002` (base-url = tunnel), client dev `localhost:5173` (`VITE_A2A_SERVER_URL` = agent tunnel URL); kill before wrap-up if still up.
