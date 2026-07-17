# Dialog.CloseButton

- **Part of the `Dialog` compound family** (6.52) — see `dialog.md` for the family note, the
  rendering/composition conventions, and the component-level frame.
- **Official documentation URL:** https://primer.style/components/dialog
- **Real prop surface resolved from:** `@primer/react` (v38.28.0) type declarations at
  `node_modules/@primer/react/dist/Dialog/Dialog.d.ts` (`Dialog.CloseButton`:
  `React.FC<React.PropsWithChildren<{onClose: () => void; onKeyDown?: KeyboardEventHandler}>>`),
  reconciled against the implementation at `Dialog.js:362` — renders a canned invisible X icon
  button with a hardcoded accessible name (`"Close"`); the declared `children` are not
  rendered.
- **Component-level description (→ `catalog.json` `description`):** An icon button that closes
  the dialog, rendered inside a custom dialog header.

Composed inside `DialogHeader`.

---

## Adapter section

### Prop-surface table

| prop | decision | synthetic? | A2UI type | description |
|---|---|---|---|---|
| `closeAction` (← `onClose`) | carry (required) | yes | `Action` | Performed when the close button is clicked. |

### Functions

| name | args | returnType | description |
|---|---|---|---|
| `consoleLog` | `message: string` (The message to log.) | `void` | Logs a message. A local client-side effect invoked from `functionCall` actions. Already registered in the catalog — no new registration. |

### Dropped / deferred props

| prop | reason |
|---|---|
| `onKeyDown` | Dropped: focus-trap keyboard plumbing — the same low-level DOM-handler surface the categorical HTML-attribute drop covers everywhere; no A2UI semantics. |
| `children` | Dropped: declared via `PropsWithChildren` but never rendered by the implementation — code is authority. |

No `accessibility` prop: the accessible name is hardcoded by the library (see `dialog.md`).

---

## Client section

Covered by the family's composed fixture, `dialog-slots` — full canned values in
`dialog-header.md`. Its `closeAction` is the fixture's `functionCall` arm
(`consoleLog {message: 'closebutton'}`).

### Prop-coverage map

| adapter prop | covered by |
|---|---|
| `closeAction` | `dialog-slots` (functionCall) |

---

## Agent section

Omitted. `closeAction` in the paired client fixture is a `functionCall` → local, no agent
response (the `event` shape of a dialog-closing action is proven on the root's
`dialog-close-event` — see `dialog.md`).
