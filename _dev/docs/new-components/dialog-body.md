# Dialog.Body

- **Part of the `Dialog` compound family** (6.52) — see `dialog.md` for the family note, the
  rendering/composition conventions, and the component-level frame.
- **Official documentation URL:** https://primer.style/components/dialog
- **Real prop surface resolved from:** `@primer/react` (v38.28.0) type declarations at
  `node_modules/@primer/react/dist/Dialog/Dialog.d.ts` (`Dialog.Body`), reconciled against the
  implementation at `Dialog.js:300` — a fixed `<div>` wrapper spreading its rest props; the
  type's polymorphic `as` is not handled by the implementation.
- **Component-level description (→ `catalog.json` `description`):** A custom body region for a
  dialog, replacing the default scrollable body.

Composed as a child of `Dialog` (slot-scanned — see `dialog.md`).

---

## Adapter section

### Prop-surface table

| prop | decision | synthetic? | A2UI type | description |
|---|---|---|---|---|
| `children` | carry (optional) | yes | `ChildList` | The dialog's scrollable body content, replacing the default body. |

### Functions

None. Carries no `Action` and needs no local function.

### Dropped / deferred props

| prop | reason |
|---|---|
| `as` | Dropped: the type claims polymorphism but the implementation renders a fixed `div` — code is authority. |
| non-`aria-*` div HTML-attribute spread | Dropped: no A2UI representation (categorical). |
| `className` / `style` | Dropped: styling passthroughs; no A2UI representation. |

---

## Client section

Covered by the family's composed fixture, `dialog-slots` — full canned values in
`dialog-header.md`. Its body child is the `Text` (`id: 'slots-body-text'`) that the
`save-changes` agent response swaps.

### Prop-coverage map

| adapter prop | covered by |
|---|---|
| `children` | `dialog-slots` (hosts the body `Text`) + slot-routing render-test (`data-component="Dialog.Body"`) |

---

## Agent section

Omitted. Carries no `Action`, so it emits no event and has no agent surface. (Its hosted
`Text` is the `updateComponents` target of the `save-changes` response — see
`dialog-buttons.md`.)
