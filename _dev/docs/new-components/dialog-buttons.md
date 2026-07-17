# Dialog.Buttons

- **Part of the `Dialog` compound family** (6.52) — see `dialog.md` for the family note, the
  rendering/composition conventions, the component-level frame, and the shared `dialogButton`
  local type this leaf consumes.
- **Official documentation URL:** https://primer.style/components/dialog
- **Real prop surface resolved from:** `@primer/react` (v38.28.0) type declarations at
  `node_modules/@primer/react/dist/Dialog/Dialog.d.ts` (`Dialog.Buttons`:
  `React.FC<React.PropsWithChildren<{buttons: DialogButtonProps[]}>>`), reconciled against the
  implementation at `Dialog.js:324` — maps the `buttons` array to buttons (`buttonType
  'normal'` mapped to `'default'` for back-compat; the first `autoFocus` entry focused); the
  declared `children` are not rendered.
- **Component-level description (→ `catalog.json` `description`):** A row of action buttons
  rendered inside a dialog's footer.

Composed inside `DialogFooter`.

---

## Adapter section

### Prop-surface table

| prop | decision | synthetic? | A2UI type | description |
|---|---|---|---|---|
| `buttons` | carry (required) | no | `z.array(dialogButton)` | The buttons rendered as the dialog's footer actions. |

`dialogButton` is the shared local element type defined in `dialog.md` (`content` ·
`buttonType` · `action` · `autoFocus` · `disabled` · `loading`).

### Functions

| name | args | returnType | description |
|---|---|---|---|
| `consoleLog` | `message: string` (The message to log.) | `void` | Logs a message. A local client-side effect invoked from `functionCall` actions. Already registered in the catalog — no new registration. |

### Dropped / deferred props

| prop | reason |
|---|---|
| `children` | Dropped: declared via `PropsWithChildren` but never rendered by the implementation — code is authority. |

---

## Client section

Covered by the family's composed fixture, `dialog-slots` — full canned values in
`dialog-header.md`. Its `buttons` array carries both action shapes: `Save`
(`buttonType: 'primary'`, `action: event {name: 'save-changes', context: {}}`) and `Cancel`
(`buttonType: 'default'`, `action: functionCall consoleLog {message: 'cancelled'}`).

### Prop-coverage map

| adapter prop | covered by |
|---|---|
| `buttons` | `dialog-slots` (one event-shaped entry + one functionCall entry; the full `buttonType` walk and `disabled`/`loading`/`autoFocus` element states are proven on the root's `footerButtons` fixtures — same shared type) |

---

## Agent section

`buttons[].action` accepts the `event` shape. One event name is emitted by the paired client
fixture: `save-changes` (the `Cancel` entry is a `functionCall` → local, no agent response).

### Event-response table

| event | response messages (ordered, with canned values) | visibility coupling (client fixture · bound prop ← path · initial value) |
|---|---|---|
| `save-changes` | 1. `updateDataModel {path: '/dialog/title', value: '✅ Settings saved'}` (the custom header's `DialogTitle` re-renders) · 2. `updateComponents [{id: 'slots-body-text', component: 'Text', text: 'The server saved your changes — you can close this dialog.'}]` (surfaceId echoed — stamped at runtime, not authored) | `dialog-slots` · `DialogTitle.text ← /dialog/title` · initial `'Edit notification settings'` |

The `/dialog/title` write resolves through the slot-composed subtree (root `children` →
`DialogHeader` → `DialogTitle`) — the coupling that proves data binding at depth inside the
compound family; the body swap inside `DialogBody` is the self-visible half.
