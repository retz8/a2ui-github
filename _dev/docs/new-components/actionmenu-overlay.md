# ActionMenu.Overlay

- **Part of the `ActionMenu` compound family** (6.39) — see `actionmenu.md` for the family note,
  composition model, and the component-level frame.
- **Official documentation URL:** https://primer.style/components/action-menu
- **Real prop surface resolved from:** `@primer/react` type declarations at
  `node_modules/@primer/react/dist/ActionMenu/ActionMenu.d.ts` — `MenuOverlayProps =
  Partial<OverlayProps> & Pick<AnchoredOverlayProps, 'align'|'side'|'variant'|'displayInViewport'> &
  {children: React.ReactNode, onPositionChange?}`. Positioning enums from `@primer/behaviors`
  `anchored-position.d.ts` (`AnchorSide`, `AnchorAlignment`); sizing enums from `Overlay.d.ts`
  (`heightMap` → `height`, `widthMap` → `width`; `maxHeight` = `keyof Omit<heightMap,'auto'|'initial'>`,
  `maxWidth` = `keyof Omit<widthMap,'auto'>`). Positioning code defaults shared with `AnchoredOverlay`
  (`side = 'outside-bottom'`, `align = 'start'`, `variant.narrow = 'anchored'`).
- **Component-level description (→ `catalog.json` `description`):** The floating surface holding the
  menu's options, positioned relative to the trigger.

The menu's positioning surface — a `Pick` of the `AnchoredOverlay` (6.55) positioning props plus the
discrete `Overlay` sizing enums. The untyped remainder of `Partial<OverlayProps>` (the passthrough
bag) is dropped, as on the `AnchoredOverlay` leaf; only the discrete sizing enums are carried.

---

## Adapter section

### Prop-surface table

| prop | decision | synthetic? | A2UI type | description |
|---|---|---|---|---|
| `children` | carry (required) | yes | `ChildList` | The list of options shown in the menu. |
| `align` | carry | no | `z.enum(['start','center','end']) (default: "start")` | How the menu aligns along the trigger's edge. |
| `side` | carry | no | `z.enum(['outside-bottom','outside-top','outside-left','outside-right','inside-top','inside-bottom','inside-left','inside-right','inside-center']) (default: "outside-bottom")` | Which side of the trigger the menu opens toward. |
| `variant` | carry | no | `z.enum(['anchored','fullscreen']) (default: "anchored")` | Narrow-screen presentation: stay anchored to the trigger, or expand to fullscreen. |
| `displayInViewport` | carry | no | `z.boolean()` | Whether the menu is kept within the viewport bounds. |
| `width` | carry | no | `z.enum(['small','medium','large','xlarge','xxlarge','auto'])` | The menu's width: preset sizes, or `auto` to fit its content. |
| `height` | carry | no | `z.enum(['xsmall','small','medium','large','xlarge','auto','initial','fit-content'])` | The menu's height: preset sizes, or content-driven (`auto`/`initial`/`fit-content`). |
| `maxHeight` | carry | no | `z.enum(['xsmall','small','medium','large','xlarge','fit-content'])` | The menu's maximum height; a longer list is capped and scrolls. |
| `maxWidth` | carry | no | `z.enum(['small','medium','large','xlarge','xxlarge'])` | The menu's maximum width. |

### Functions

None. The overlay carries no `Action` and needs no local function.

### Dropped / deferred props

| prop | reason |
|---|---|
| `onPositionChange` | Observational layout-readback callback (reports the computed position); no author-facing capability. |
| the untyped remainder of `Partial<OverlayProps>` (`visibility`, `overflow`, `position`/`top`/`left`/`right`/`bottom`, `role`, `style`, `className`, `data-*`, …) | Untyped passthrough bag; no single A2UI representation. The discrete sizing it reaches (`width`/`height`/`maxHeight`/`maxWidth`) is carried directly (the `AnchoredOverlay` `overlayProps` precedent). |

---

## Agent section

Omitted. `ActionMenu.Overlay` emits no `event`-shaped `Action` (no `Action` at all), so per the
Orchestration skip rule there is no agent surface to design.

---
