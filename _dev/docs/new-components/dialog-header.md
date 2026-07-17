# Dialog.Header

- **Part of the `Dialog` compound family** (6.52) — see `dialog.md` for the family note, the
  rendering/composition conventions, and the component-level frame.
- **Official documentation URL:** https://primer.style/components/dialog
- **Real prop surface resolved from:** `@primer/react` (v38.28.0) type declarations at
  `node_modules/@primer/react/dist/Dialog/Dialog.d.ts` (`Dialog.Header`), reconciled against
  the implementation at `Dialog.js:264` — a fixed `<div>` wrapper spreading its rest props;
  the type's polymorphic `as` is not handled by the implementation.
- **Component-level description (→ `catalog.json` `description`):** A custom header region for
  a dialog, replacing the default title/subtitle/close-button header.

Composed as a child of `Dialog` (slot-scanned — see `dialog.md`); hosts `DialogTitle`,
`DialogSubtitle`, and `DialogCloseButton` in its `children`.

---

## Adapter section

### Prop-surface table

| prop | decision | synthetic? | A2UI type | description |
|---|---|---|---|---|
| `children` | carry (optional) | yes | `ChildList` | The dialog's header content, replacing the default title/subtitle/close-button header. |

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

Covered by the family's composed fixture, `dialog-slots` — the shared composition backdrop for
all seven sub-leaves.

### Fixture table

| fixture | exercises (coverage axis) | component state / canned values | baselined? |
|---|---|---|---|
| `dialog-slots` | all seven sub-leaves in their natural composition — slot overrides + their content channels | root `Dialog`: `title: "Edit notification settings"` (required on the root; the slot header supersedes the default header that would render it); `closeAction: functionCall consoleLog {message: 'dialog closed'}`; `children`: `DialogHeader` (`DialogTitle` `text: {path: '/dialog/title'}` + data model `{dialog: {title: 'Edit notification settings'}}` · `DialogSubtitle` `text: "Changes apply to all devices"` · `DialogCloseButton` `closeAction: functionCall consoleLog {message: 'closebutton'}`) · `DialogBody` (`Text` `id: 'slots-body-text'`, `text: "Notification preferences form would render here."`) · `DialogFooter` (`DialogButtons` `buttons`: `{content: 'Save', buttonType: 'primary', action: event {name: 'save-changes', context: {}}}` · `{content: 'Cancel', buttonType: 'default', action: functionCall consoleLog {message: 'cancelled'}}`) | yes |

Render-test assertions (non-visual): slot routing — the custom sections render
(`data-component="Dialog.Header"` / `"Dialog.Body"` / `"Dialog.Footer"` present) and the
default header/footer are absent when overridden.

### Prop-coverage map

| adapter prop | covered by |
|---|---|
| `children` | `dialog-slots` (hosts `DialogTitle` + `DialogSubtitle` + `DialogCloseButton`) + slot-routing render-test |

---

## Agent section

Omitted. Carries no `Action`, so it emits no event and has no agent surface.
