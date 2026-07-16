# TreeView.ErrorDialog

- **Part of the `TreeView` compound family** (6.45) — see `tree-view.md` for the family note,
  shared conventions, and the component-level frame.
- **Official documentation URL:** https://primer.style/components/tree-view
- **Real prop surface resolved from:** `@primer/react` type declarations at
  `node_modules/@primer/react/dist/TreeView/TreeView.d.ts` (`TreeViewErrorDialogProps`),
  reconciled against `TreeView.js` (authority on defaults). Code default (`TreeView.js:1361`):
  `title = "Error"`.
- **Component-level description (→ `catalog.json` `description`):** A dialog shown when a tree
  item's contents fail to load, offering the option to retry or dismiss.

## Overlay-infra dependency

`ErrorDialog` renders a modal overlay. Overlay rendering is infrastructure arriving with `Dialog`
(6.52). The build consumes that infra; if it is not landed at build time, this leaf defers per the
build skill's "consumes, never builds infra" rule (recorded in `deferred-catalog-work.md`).
`ErrorDialog` is placed as a child of a `SubTree` in the `error` state, mirroring how Primer shows
it.

---

## Adapter section

### Prop-surface table

| prop | decision | synthetic? | A2UI type | description |
|---|---|---|---|---|
| `children` | carry (required) | yes | `ChildList` | The error message content shown in the dialog. |
| `title` | carry (optional) | no | `z.string() (default: "Error")` | The dialog's heading. |
| `retryAction` | carry (optional) | yes (← `onRetry`) | `Action` | An effect performed when the user chooses to retry — a local function or a server event. |
| `dismissAction` | carry (optional) | yes (← `onDismiss`) | `Action` | An effect performed when the user dismisses the dialog. |

### Functions

| name | args | returnType | description |
|---|---|---|---|
| `consoleLog` | `message: string` (The message to log.) | `void` | Logs a message. A local client-side effect invoked from the dialog's `functionCall` action. Already registered in the catalog — no new registration. |

### Dropped/deferred props

None beyond the mapping above (`onRetry`/`onDismiss` → `Action`s).

---

## Client section

### Fixture table

| fixture | exercises | component state / canned values | baselined? |
|---|---|---|---|
| `tree-view-error-dialog` | `children`, `title`, `retryAction` (event), `dismissAction` (functionCall) | structured as `Item > SubTree(state: error) > [ErrorDialog]`; `title: "Failed to load"`; body `Text` child `text: {path: "/retryMessage"}` + data model `{retryMessage: "Could not load the folder"}` (agent-coupling); `retryAction: event {name: "retry-subtree", context: {}}`; `dismissAction: functionCall consoleLog {message: "dismissed"}` | yes |

### Prop-coverage map

| adapter prop | covered by |
|---|---|
| `children` | `tree-view-error-dialog` (the body `Text`) |
| `title` | `tree-view-error-dialog` |
| `retryAction` | `tree-view-error-dialog` (event) |
| `dismissAction` | `tree-view-error-dialog` (functionCall) |

---

## Agent section

`ErrorDialog`'s `retryAction` accepts the `event` shape. One event name is emitted by the paired
client event fixture: `retry-subtree`. (`dismissAction` is a `functionCall` → local, no agent
response.)

### Event-response table

| event | response messages (ordered, with canned values) | visibility coupling (client fixture · bound prop ← path · initial value) |
|---|---|---|
| `retry-subtree` | 1. `updateDataModel {path: '/retryMessage', value: 'Retrying…'}` · 2. `updateComponents [{id: '<subtree>', component: 'TreeViewSubTree', state: 'loading', count: 3}]` (error→loading swap; surfaceId echoed — stamped at runtime, not authored) | `tree-view-error-dialog` · body `Text.text ← /retryMessage` · initial `/retryMessage = 'Could not load the folder'` |

The `SubTree` swap from `error` to `loading` is the self-visible reaction; the `/retryMessage`
write is visible through the dialog body `Text.text ← /retryMessage` coupling — the half that
proves two-way data binding on the rendered content.
