# Autocomplete.Overlay

- **Official documentation URL:** https://primer.style/react/Autocomplete/ (see the family note in
  `autocomplete.md`).
- **Real prop surface resolved from:** `@primer/react` installed type declarations at
  `node_modules/@primer/react/dist/Autocomplete/AutocompleteOverlay.d.ts` —
  `{ menuAnchorRef?, overlayProps?, children? } & Partial<OverlayProps> & Pick<AriaAttributes,
  'aria-labelledby'>`. Reconciled against the official doc, whose `Autocomplete.Overlay` props table
  lists only three own props (`menuAnchorRef`, `children`, `overlayProps`) and marks the rest
  *"inherited additional props from Overlay component."*
- **Component-level description (→ `catalog.json` `description`):** The floating panel that contains
  an autocomplete's suggestion menu.

A pure structural container mirroring Primer's `<Autocomplete.Overlay>` wrapper — the `children` slot
holds the Menu; the panel auto-positions against the input via the Autocomplete context.

The entire `Partial<OverlayProps>` spread (`width`, `height`, `maxHeight`, `maxWidth`, `overflow`,
`preventOverflow`, `visibility`, `anchorSide`, `responsiveVariant`, positioning, `role`,
`aria-labelledby`, …) is **incidentally inherited, not documented** as `Autocomplete.Overlay`'s own
surface, so it drops per per-component fidelity ("never carry merely because the installed type
incidentally inherits it"). The deprecated `overlayProps` bag being the only documented path to reach
that sizing confirms it is not a first-class capability here.

---

## Adapter section

### Prop-surface table

| prop | decision | synthetic? | A2UI type | description |
|---|---|---|---|---|
| `children` | carry (optional) | yes | `ChildList` | The suggestion menu shown inside the floating panel. |

### Functions

None.

### Dropped / deferred props

| prop | reason |
|---|---|
| `menuAnchorRef` | Ref-typed; not JSON-serializable. The panel auto-positions against the input via the Autocomplete context. |
| `overlayProps` | `@deprecated` untyped `Partial<OverlayProps>` passthrough bag; no A2UI representation. |
| `width`, `height`, `maxHeight`, `maxWidth`, `overflow`, `preventOverflow`, `visibility`, `anchorSide`, `responsiveVariant`, `position`/`top`/`left`/`right`/`bottom`, `role`, `aria-labelledby`, and the rest of the `Partial<OverlayProps>` spread | Dropped: not in `Autocomplete.Overlay`'s documented prop surface — incidentally inherited from the `Overlay` component. Per per-component fidelity, not carried. |

---

## Client section

Fixtures live on the root (`autocomplete.md`) — the Overlay never renders standalone; it is the
floating panel holding the Menu in every composed fixture.

### Prop-coverage map

| adapter prop | covered by |
|---|---|
| `children` | every fixture (the Menu inside the panel; the open panel is covered by the menu render-tests, per the root's open-menu deferral) |

---

## Agent section

Omitted. `Autocomplete.Overlay` emits no `Action` (it is a pure structural container), so there is
no agent surface to design.
