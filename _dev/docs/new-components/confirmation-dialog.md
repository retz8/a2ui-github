# ConfirmationDialog

- **Official documentation URL:** https://primer.style/components/confirmation-dialog
- **Real prop surface resolved from:** `@primer/react` (v38.28.0) type declarations at
  `node_modules/@primer/react/dist/ConfirmationDialog/ConfirmationDialog.d.ts`
  (`ConfirmationDialogProps & React.PropsWithChildren`), reconciled against the implementation
  at `ConfirmationDialog.js` (authority on defaults). Code defaults
  (`ConfirmationDialog.js:14–27`): `cancelButtonContent = 'Cancel'`,
  `confirmButtonContent = 'OK'`, `confirmButtonType = 'normal'`, `cancelButtonLoading = false`,
  `confirmButtonLoading = false`, `width = 'medium'`; `height` is passed through unset and
  Dialog applies `'auto'`. The component is a rigid wrapper over `Dialog` (6.52): it hard-codes
  `role = 'alertdialog'` and synthesizes exactly two footer buttons (cancel + confirm) wired to
  the single `onClose` callback.
- **Component-level description (→ `catalog.json` `description`):** A modal confirmation prompt
  with exactly two buttons — one to cancel and one to confirm an action — used to confirm a
  user's action before it proceeds; the confirm button can be styled to mark a destructive
  choice.

> Catalog schema name: `ConfirmationDialog`. The imperative `useConfirm()` hook, the `confirm()`
> function, and the `ConfirmOptions` type are out of scope — we ship the declarative
> `<ConfirmationDialog>` component, the same way the Dialog family ships the declarative surface
> and not `useConfirm`-style helpers.

## The `onClose` split — `confirmAction` + `cancelAction`

ConfirmationDialog exposes a single interaction prop, `onClose(gesture)`, where
`gesture ∈ {'confirm','cancel','close-button','escape'}`. Every real consumer branches on that
runtime argument — e.g. Primer's own `DataTable/ErrorDialog.js`:

```js
const onClose = gesture => { if (gesture === 'confirm') onRetry?.(); else onDismiss?.(); };
```

An A2UI `Action`'s context is **authored once, not per-invocation**, so a single `Action` cannot
carry the `gesture === 'confirm'` branch. The branch is therefore **materialized at authoring
time** into two synthetic required `Action`s:

- **`confirmAction`** ← `onClose('confirm')` — the confirm button.
- **`cancelAction`** ← `onClose('cancel' | 'close-button' | 'escape')` — the cancel button, the
  header close button, the Escape key, and the backdrop. This mirrors the component's own
  true/false collapse (the `useConfirm` promise resolves `true` only for `confirm`).

The adapter render wires one handler that dispatches on the gesture:
`onClose={gesture => gesture === 'confirm' ? <run confirmAction> : <run cancelAction>}`.

## Rendering & composition

- **Self-contained overlay — no new infra.** ConfirmationDialog renders through `Dialog`, which
  portals to the document body and manages its own backdrop, focus trap, Escape handling, and
  body-scroll lock. Same overlay path as the Dialog family (6.52) — nothing extra to build, and
  screenshottable.
- **No custom rendering.** Unlike `Dialog`, ConfirmationDialog provides no slot composition: the
  header (title + close button) and footer (the two buttons) are fixed. `children` is the body
  message content only — no header/body/footer slot scanning.
- **One dialog per fixture surface.** The open modal's backdrop covers the viewport, so a
  fixture holds exactly one dialog: enum walks are one isolated surface per **non-default** value
  (the base fixture covers the defaults) — no shared-row galleries. Same rule as the Dialog
  family.
- **No `accessibility` prop.** `ConfirmationDialogProps` is a closed interface with no aria
  spread; the accessible name is wired from `title`, and the role is fixed to `alertdialog`.

---

## Adapter section

### Prop-surface table

| prop | decision | synthetic? | A2UI type | description |
|---|---|---|---|---|
| `confirmAction` (← `onClose('confirm')`) | carry (required) | yes | `Action` | The action performed when the user confirms — clicks the confirm button. |
| `cancelAction` (← `onClose('cancel'\|'close-button'\|'escape')`) | carry (required) | yes | `Action` | The action performed when the user cancels or dismisses the dialog — the cancel button, the close button, the Escape key, or the backdrop. |
| `title` | carry (required) | no | `DynamicString` | The dialog's heading; usually a brief question, and also its accessible name. |
| `cancelButtonContent` | carry | no | `DynamicString (default: "Cancel")` | The label of the button that dismisses the action. |
| `confirmButtonContent` | carry | no | `DynamicString (default: "OK")` | The label of the button that confirms the action. |
| `confirmButtonType` | carry | no | `z.enum(['normal','primary','danger']) (default: "normal")` | The confirm button's visual emphasis; `danger` marks a destructive action. |
| `cancelButtonLoading` | carry | no | `DynamicBoolean` | Whether the cancel button shows a loading state while an operation is pending. |
| `confirmButtonLoading` | carry | no | `DynamicBoolean` | Whether the confirm button shows a loading state while an operation is pending. |
| `overrideButtonFocus` | carry | no | `z.enum(['cancel','confirm'])` | Which button receives focus when the dialog opens; defaults to the confirm button, or the cancel button for a destructive action. |
| `width` | carry | no | `z.union([z.enum(['small','medium','large','xlarge']), z.string(), z.number()]) (default: "medium")` | The dialog's width: preset sizes (small 296px, medium 320px, large 480px, xlarge 640px) or any CSS width value. |
| `height` | carry | no | `z.enum(['small','large','auto']) (default: "auto")` | The dialog's height: small 480px, large 640px, auto sizes to the contents. |
| `children` | carry (optional) | yes | `ChildList` | The dialog's body content — the message or explanation shown above the buttons. |

Notes:

- `confirmAction` / `cancelAction` are synthetic — the single real `onClose(gesture)` callback is
  split at authoring time (see "The `onClose` split" above). Both are required.
- `title` is tightened to **required**; usually a brief question, and the accessible name.
- `overrideButtonFocus` has no static default — the applied focus is computed (confirm button,
  or cancel button when `confirmButtonType === 'danger'`); optional.
- `width` is the same `DialogWidth` union as the Dialog family, but ConfirmationDialog's code
  default is `'medium'` (not Dialog's `'xlarge'`).

### Functions

| name | args | returnType | description |
|---|---|---|---|
| `consoleLog` | `message: string` (The message to log.) | `void` | Logs a message. A local client-side effect invoked from `functionCall` actions. Already registered in the catalog — no new registration. |

### Dropped / deferred props

| prop | reason |
|---|---|
| `className` | Dropped: styling passthrough; no A2UI representation. |

---

## Client section

One dialog per fixture surface (the open modal's backdrop covers the viewport). Every fixture
carries the required `title`, `confirmAction`, and `cancelAction`. Enum/width/height walk
fixtures reuse the base content and vary only their axis.

Base content (shared by the walk fixtures): `title: "Discard changes?"` literal; body `Text`
(`id: 'cd-body'`, `text: "Your unsaved edits will be lost."`); default button labels
(`OK`/`Cancel`); `confirmAction: functionCall consoleLog {message: 'confirmed'}`;
`cancelAction: functionCall consoleLog {message: 'cancelled'}`.

### Fixture table

| fixture | exercises (coverage axis) | component state / canned values | baselined? |
|---|---|---|---|
| `confirmation-dialog` | base — `title` literal, default labels, both actions functionCall | `title: "Discard changes?"`; body `Text` (`id: 'cd-body'`, `text: "Your unsaved edits will be lost."`); `confirmAction: functionCall consoleLog {message: 'confirmed'}`; `cancelAction: functionCall consoleLog {message: 'cancelled'}` | yes |
| `confirmation-dialog-bound` | content channel — bound (path binding) on `title` + both button labels | `title: {path: '/cd/title'}`; `confirmButtonContent: {path: '/cd/confirm'}`; `cancelButtonContent: {path: '/cd/cancel'}`; data model `{cd: {title: 'Bound title', confirm: 'Yes', cancel: 'No'}}`; body `Text`; actions functionCall | yes |
| `confirmation-dialog-event` | both actions — event path (agent-coupled); non-default literal labels; agent-coupling bound props | `title: {path: '/cd/title'}`; `confirmButtonContent: "Delete"`; `cancelButtonContent: "Keep"`; `confirmButtonType: 'danger'`; `confirmButtonLoading: {path: '/cd/deleting'}`; body `Text` (`id: 'cd-body'`, `text: "This permanently deletes the branch."`); `confirmAction: event {name: 'confirm-delete', context: {}}`; `cancelAction: event {name: 'cancel-delete', context: {}}`; data model `{cd: {title: 'Delete branch?', deleting: false}}` | yes |
| `confirmation-dialog-confirm-primary` | `confirmButtonType` — `primary` | base; `confirmButtonType: 'primary'` | yes (one PNG) |
| `confirmation-dialog-confirm-danger` | `confirmButtonType` — `danger` | base; `confirmButtonType: 'danger'` | yes (one PNG) |
| `confirmation-dialog-loading` | `confirmButtonLoading` + `cancelButtonLoading` (same axis on the two fixed buttons) | base; `confirmButtonLoading: true`; `cancelButtonLoading: true` | yes |
| `confirmation-dialog-width-small` / `-large` / `-xlarge` | `width` — non-default presets | base; `width: 'small'` / `'large'` / `'xlarge'` | yes (one PNG each) |
| `confirmation-dialog-width-custom` | `width` — free CSS arm | base; `width: '400px'` | yes |
| `confirmation-dialog-height-small` / `-large` | `height` — non-default values | base; `height: 'small'` / `'large'` | yes (one PNG each) |

Render-test assertions (non-visual):

- **`overrideButtonFocus`** — after mount, `document.activeElement` is the overridden button:
  on a fixture with `overrideButtonFocus: 'cancel'` (non-danger), focus lands on the cancel
  button; plus the computed default asserted on `confirmation-dialog` (→ confirm focused) and
  `confirmation-dialog-confirm-danger` (→ cancel focused, the danger rule). Classified
  non-visual because the focus ring rides on `:focus-visible` heuristics a static screenshot
  cannot capture deterministically (same call as Dialog's `autoFocus`).
- **`role`** (sanity, not a carried prop) — the rendered element's role is the fixed
  `alertdialog`.

### Prop-coverage map

| adapter prop | covered by |
|---|---|
| `confirmAction` | `confirmation-dialog` (functionCall) + `confirmation-dialog-event` (event) |
| `cancelAction` | `confirmation-dialog` (functionCall) + `confirmation-dialog-event` (event) |
| `title` | `confirmation-dialog` (literal) + `confirmation-dialog-bound` (bound) |
| `confirmButtonContent` | `confirmation-dialog` (default) + `confirmation-dialog-bound` (bound) + `confirmation-dialog-event` (custom literal) |
| `cancelButtonContent` | `confirmation-dialog` (default) + `confirmation-dialog-bound` (bound) + `confirmation-dialog-event` (custom literal) |
| `confirmButtonType` | `confirmation-dialog` (`normal` default) + `-confirm-primary` + `-confirm-danger` |
| `confirmButtonLoading` | `confirmation-dialog-loading` |
| `cancelButtonLoading` | `confirmation-dialog-loading` |
| `overrideButtonFocus` | render-test assertion (non-visual) |
| `width` | `-width-small`/`-large`/`-xlarge`/`-custom` (`medium` default in base) |
| `height` | `-height-small`/`-large` (`auto` default in base) |
| `children` | every fixture (body content) |

---

## Agent section

The `confirmation-dialog-event` fixture emits two events — `confirm-delete` (`confirmAction`)
and `cancel-delete` (`cancelAction`). The invented responses are deliberately **distinct**: the
component exists to separate a confirmed action from a cancelled one, so the round-trip must
show that separation mean something. Each response also proves a two-way binding on a different
prop — `confirm-delete` on the `DynamicBoolean` `confirmButtonLoading`, `cancel-delete` on the
`DynamicString` `title` — with the body swap as the self-visible half.

Both responses keep the dialog rendered and mutate inside it — a root swap that removed the
dialog would unrender the bound prop and blind the `updateDataModel` half.

Realizing the coupling edited the paired `confirmation-dialog-event` client fixture in place:
`title` bound to `/cd/title` (initial `'Delete branch?'`) and `confirmButtonLoading` bound to
`/cd/deleting` (initial `false`), with data model `{cd: {title: 'Delete branch?', deleting: false}}`.

### Event-response table

| event | response messages (ordered, with canned values) | visibility coupling (client fixture · bound prop ← path · initial value) |
|---|---|---|
| `confirm-delete` | 1. `updateDataModel {path: '/cd/deleting', value: true}` (the confirm button enters loading — the destructive operation is now in progress) · 2. `updateComponents [{id: 'cd-body', component: 'Text', text: '🗑️ Deleting branch — server received confirm'}]` (surfaceId echoed — stamped at runtime, not authored) | `confirmation-dialog-event` · `confirmButtonLoading ← /cd/deleting` · initial `false` |
| `cancel-delete` | 1. `updateDataModel {path: '/cd/title', value: '✅ Branch kept'}` (the heading updates to reflect the dismissal) · 2. `updateComponents [{id: 'cd-body', component: 'Text', text: 'No changes made — server received cancel'}]` (surfaceId echoed — stamped at runtime, not authored) | `confirmation-dialog-event` · `title ← /cd/title` · initial `'Delete branch?'` |

`confirm-delete` proves the two-way `DynamicBoolean` binding on `confirmButtonLoading`;
`cancel-delete` proves the two-way `DynamicString` binding on `title`. The `unknown-event`
fallback is infra behavior, not authored per component, so it gets no row.
