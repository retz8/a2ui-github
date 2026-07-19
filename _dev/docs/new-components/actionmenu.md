# ActionMenu

- **Official documentation URL:** https://primer.style/components/action-menu
- **Real prop surface resolved from:** `@primer/react` (v38.28.0) type declarations at
  `node_modules/@primer/react/dist/ActionMenu/ActionMenu.d.ts` — root `ActionMenuProps` =
  `{children, open?, onOpenChange?} & Pick<AnchoredOverlayProps, 'anchorRef'>` — reconciled against
  the doc. Subcomponents `ActionMenu.Button` (= `ButtonProps`), `ActionMenu.Anchor`
  (`{children, id?} & React.HTMLAttributes`), `ActionMenu.Overlay`
  (`Partial<OverlayProps> & Pick<AnchoredOverlayProps, 'align'|'side'|'variant'|'displayInViewport'> &
  {children, onPositionChange?}`), `ActionMenu.Divider` (= `ActionListDividerProps`). Positioning
  enums from `@primer/behaviors` `anchored-position.d.ts` (`AnchorSide`, `AnchorAlignment`); sizing
  enums from `Overlay.d.ts` (`heightMap`/`widthMap`); positioning code defaults shared with
  `AnchoredOverlay` (`side = 'outside-bottom'`, `align = 'start'`, `variant.narrow = 'anchored'`).
- **Component-level description (→ `catalog.json` `description`):** A trigger element that opens a
  floating menu of actions or options positioned relative to itself; the menu opens and dismisses by
  mouse or keyboard, and choosing an item closes it.

> `ActionMenu` ships as a **compound family**, mirroring the component library one-to-one (the
> `ActionList` 6.38 precedent): the root plus its subcomponents are each shipped as a sibling catalog
> leaf in this same 6.39 sub-task, each with its own decision doc:
>
> - `actionmenu-button.md` (`ActionMenu.Button`) — the trigger button
> - `actionmenu-anchor.md` (`ActionMenu.Anchor`) — a custom-element trigger
> - `actionmenu-overlay.md` (`ActionMenu.Overlay`) — the floating menu surface
> - `actionmenu-divider.md` (`ActionMenu.Divider`) — a separator within the menu
>
> The root's `children` slot holds a trigger (`ActionMenu.Button` **or** `ActionMenu.Anchor`) plus an
> `ActionMenu.Overlay`; the overlay's `children` slot holds the menu content — an `ActionList` (6.38)
> plus optional `ActionMenu.Divider`s — through the permissive `ChildList` convention
> (`action-list.md`, `stack.md`). Primer's own type-based slotting places each child; the agent
> composes per the library's structure. `ActionMenu.Divider` is the sibling twin of `ActionList.Divider`.

## Rendering & composition

- **Family renders Primer's compound.** Each leaf renders its `ActionMenu.*` counterpart; the root
  renders Primer's `<ActionMenu>` and its `ChildList` slots the trigger and overlay via Primer's
  type-based slotting (the `ActionList` family model). `ActionMenu.Overlay` renders
  `<ActionMenu.Overlay>` and slots the `ActionList` menu content the same way.
- **Self-contained overlay — no new infra.** The menu portals to the document body and manages its
  own focus trap, Escape handling, outside-click dismissal, and roving item focus, rendering through
  the normal adapter→renderer path (the `Dialog` 6.52 / `AnchoredOverlay` 6.55 precedent). It is
  screenshottable open at regular viewport.
- **Trigger wiring.** Primer owns the trigger's click — it toggles the menu open/closed — so the
  trigger (`ActionMenu.Button` or `ActionMenu.Anchor`) carries **no `action`** of its own. The
  `ActionMenu.Anchor` child is resolved with `buildChild` and rendered inside `<ActionMenu.Anchor>`;
  the referenced component is presentational in the anchor role.
- **`open` two-way write-back.** The binder auto-generates `setOpen` from the `DynamicBoolean` `open`
  (the `Checkbox` `setChecked` / `AnchoredOverlay` precedent); `onOpenChange` is wired to it, so an
  open-gesture calls `setOpen(true)` and a close-gesture (Escape, outside-click, item-select) calls
  `setOpen(false)`. `open` is **optional**: when it is omitted Primer runs the menu uncontrolled with
  its own internal open state (unlike `AnchoredOverlay`, whose `open` is required — ActionMenu
  supports the uncontrolled mode). The gesture-kind parameter of `onOpenChange` is not forwarded —
  the write-back is boolean.
- **Narrow-fullscreen visual deferral.** `Overlay.variant: 'fullscreen'` manifests only below the
  narrow breakpoint; the prop ships, but its narrow-viewport **visual baseline** is deferred to
  multi-viewport capture infra (`deferred-catalog-work.md`, the `AnchoredOverlay` precedent).
  Regular-viewport visuals are fully baselined; a render-test asserts `variant`'s `{narrow}` mapping.

---

## Adapter section

### Prop-surface table

| prop | decision | synthetic? | A2UI type | description |
|---|---|---|---|---|
| `children` | carry (required) | yes | `ChildList` | The menu's trigger and the overlay of options it opens. |
| `open` | carry | no | `DynamicBoolean` | Whether the menu is currently open; the trigger's open and close gestures write this value back automatically. |

### Functions

None. The root carries no `Action` and needs no local function.

### Dropped / deferred props

| prop | reason |
|---|---|
| `onOpenChange` | The open/closed state setter; folded into the `open` two-way write-back (`setOpen`), not a separate surface. |
| `anchorRef` | Ref-typed anchor wiring — not JSON-serializable. The trigger is carried as a child in `children`. |

---

## Client section

Family-wide and **composed-centered** (the `action-list.md` / `pageheader.md` model): the container
leaves (root `children`, `Overlay.children`, `Divider`) and the trigger are covered by one
richly-assembled open-menu baseline rather than near-identical surfaces; the `Overlay` positioning
enums and the `open` state get their own single-axis fixtures.

**Every fixture is a realistic `ActionMenu` surface.** Filler content is GitHub-triage-flavored and
built from already-shipped leaves (`Button`, `IconButton`, `Avatar`, the `ActionList` family, `Icon`,
`Text`, `Label`). The baseline harness is static (`goto → screenshot`, no gesture driving), so only
`open: true` renders in a Playwright baseline; the open/close gesture and the two-way write-back are
exercised by vitest render-tests (userEvent). The menu portals and positions absolutely, so one open
menu per baseline surface (the `AnchoredOverlay` "one overlay per surface" precedent).

**`ActionMenu.Button` is covered lightly.** It renders the exact `Button` surface already baselined
exhaustively on the `Button` leaf (6.4); its Button-inherited visual enums are **not** re-galleried
here — the trigger's identity as a Button is asserted by render-test, its rendering proven upstream.

Base composition for every fixture: trigger `ActionMenu.Button` (child `Text` "Actions") · open
`ActionMenu.Overlay` · `ActionList`[`Item`("View pull request", `LeadingVisual`→`Icon`
git-pull-request), `Item`("Edit"), `ActionMenu.Divider`, `Item`("Delete branch", `variant: danger`,
`LeadingVisual`→`Icon` trash)].

### Fixture table

| fixture | exercises (coverage axis) | component state / canned values | baselined? |
|---|---|---|---|
| `actionmenu` | composed baseline — root/Overlay `children` + `Divider` + Button trigger, all defaults | `open: true`; base composition | yes |
| `actionmenu-open-bound` | `open` — bound (path binding) | `open: {path: '/open'}` + data model `{open: true}`; base composition | yes |
| `actionmenu-open-closed` | `open: false` — menu hidden | `open: false`; base → render-test (only the trigger renders; overlay absent from DOM) | no (render-test) |
| `actionmenu-toggle` | open/close gesture (two-way write-back) | render-test (vitest): click trigger → `setOpen(true)`; Escape / outside-click / item-select → `setOpen(false)` | no (render-test) |
| `actionmenu-anchor` | `ActionMenu.Anchor` — custom-element trigger | `open: true`; trigger is `ActionMenu.Anchor`(child → `IconButton` kebab) instead of `ActionMenu.Button`; base overlay | yes |
| `actionmenu-trigger-icon` | `ActionMenu.Button` — Button slot forwarding (representative) | `open: true`; trigger `ActionMenu.Button`(child `Text` "Actions", `trailingVisual`→`Icon` triangle-down); base overlay | yes |
| `actionmenu-align-center` / `-end` | `Overlay.align` — non-default values | `open: true`; `align: 'center'` / `'end'` | yes (one PNG each) |
| `actionmenu-side-<v>` | `Overlay.side` — placement walk | one surface per non-default value (`outside-top`, `outside-left`, `outside-right`, `inside-top`, `inside-bottom`, `inside-left`, `inside-right`, `inside-center`); `open: true`; `side: <v>` | yes (one PNG each) |
| `actionmenu-width-<v>` | `Overlay.width` — preset walk | one surface per preset (`small`, `medium`, `large`, `xlarge`, `xxlarge`); `open: true`; `width: <v>` | yes (one PNG each) |
| `actionmenu-height-<v>` | `Overlay.height` — preset walk | one surface per preset (`xsmall`, `small`, `medium`, `large`, `xlarge`); `open: true`; `height: <v>`; menu content tall enough to show the fixed height | yes (one PNG each) |
| `actionmenu-maxheight` | `Overlay.maxHeight` — long list caps + scrolls | `open: true`; long `ActionList` (~12 items); `maxHeight: 'small'` | yes |

### Render-test assertions (non-visual)

- **`open: false`** — the overlay is absent from the DOM; only the trigger renders.
- **open/close gesture** — clicking the trigger calls the binder's `setOpen(true)`; Escape /
  outside-click / item-select calls `setOpen(false)` (`actionmenu-toggle`).
- **`ActionMenu.Button` forwarding** — the trigger's `variant`/`size`/`disabled`/… props reach the
  rendered Button (smoke); its visual matrix is proven on the `Button` leaf, not re-baselined.
- **`Overlay.width: 'auto'`** and **`Overlay.height` content-driven values** (`auto`/`initial`/
  `fit-content`) — forwarded; visually ≈ the content-sized base, not separately baselined.
- **`Overlay.maxWidth`** — forwarded; no distinct visual to bless with a normal-width menu.
- **`Overlay.displayInViewport`** — the menu renders open with it set (smoke); its viewport-edge
  effect is non-deterministic in the static single-viewport harness, not baselined.
- **`Overlay.variant`** — `'fullscreen'` maps to `{narrow: 'fullscreen'}`; its narrow-viewport visual
  baseline is deferred (`deferred-catalog-work.md`).
- **`ActionMenu.Anchor` `accessibility`** and **`ActionMenu.Button` `loadingAnnouncement`/
  `accessibility`** — forwarded (non-visual), asserted where set.

### Prop-coverage map

| adapter prop | covered by |
|---|---|
| root `children` | every fixture (trigger + overlay assembly) |
| root `open` | `actionmenu` (literal true) + `actionmenu-open-bound` (bound) + `actionmenu-open-closed` (false, render-test) + `actionmenu-toggle` (gesture, render-test) |
| `ActionMenu.Button.*` (`child`, `variant`, `size`, `alignContent`, `disabled`, `loading`, `inactive`, `count`, `block`, `labelWrap`, `loadingAnnouncement`, `icon`, `leadingVisual`, `trailingVisual`, `trailingAction`, `accessibility`) | `actionmenu` + `actionmenu-trigger-icon` (label + trailing visual) + render-test (Button prop forwarding) |
| `ActionMenu.Anchor.child` | `actionmenu-anchor` |
| `ActionMenu.Overlay.children` | every fixture (the menu content) |
| `ActionMenu.Overlay.align` | `actionmenu-align-center` / `-end` |
| `ActionMenu.Overlay.side` | `actionmenu-side-*` (8 non-default surfaces) |
| `ActionMenu.Overlay.width` | `actionmenu-width-*` (5 presets) + render-test (`auto`) |
| `ActionMenu.Overlay.height` | `actionmenu-height-*` (5 presets) + render-test (content-driven values) |
| `ActionMenu.Overlay.maxHeight` | `actionmenu-maxheight` |
| `ActionMenu.Overlay.maxWidth` | render-test (forwarding) |
| `ActionMenu.Overlay.variant` | render-test (mapping; fullscreen visual deferred) |
| `ActionMenu.Overlay.displayInViewport` | render-test (smoke) |
| `ActionMenu.Divider` | `actionmenu` (composed) |

---

## Agent section

Omitted for the entire family. No leaf carries an `event`-shaped `Action` (no `Action` at all): the
root's only interaction is open/close, realized by the two-way `open` binding, and item-select events
belong to the referenced `ActionList.Item` leaf (`action-list-item.md`, already covered). Per the
Orchestration skip rule there is no agent surface to design.
