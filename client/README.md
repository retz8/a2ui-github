# client

The thin React + [Primer](https://primer.style/) demo app that renders A2UI surfaces through
[`primer-a2ui-adapter`](../primer-a2ui-adapter).

> 🚧 **Skeleton.** Currently renders a static "bootstrap OK" page to prove the workspace edge and
> Primer wiring. `@a2ui/react`/`@a2ui/web_core` are installed but no surface is mounted yet — real
> A2UI rendering lands in a later phase.

## Commands

```bash
yarn workspace client run dev        # vite dev server
yarn workspace client run build      # tsc --noEmit && vite build
yarn workspace client run typecheck
yarn workspace client run test       # vitest (jsdom + RTL)
```
