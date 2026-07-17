# Dialog

- **Official documentation URL:** https://primer.style/components/dialog
- **Real prop surface resolved from:** `@primer/react` (v38.28.0) type declarations at
  `node_modules/@primer/react/dist/Dialog/Dialog.d.ts` (`DialogProps`, `DialogButtonProps`),
  reconciled against the implementation at `Dialog.js` (authority on defaults). Code defaults
  (`Dialog.js:109–119`): `title = 'Dialog'`, `subtitle = ''`, `role = 'dialog'`,
  `width = 'xlarge'` (the doc page's `medium` is stale — code wins), `height = 'auto'`,
  `position = 'center'`, `footerButtons = []`. The deprecated `DialogV1` is superseded and out
  of scope.
- **Component-level description (→ `catalog.json` `description`):** A modal window overlaid on
  the page for focused tasks such as confirming an action, asking for disambiguation, or
  presenting a small form; it traps focus and blocks interaction with the page beneath until
  closed.

> `Dialog` ships as a **compound family** (6.52), mirroring the component library one-to-one:
> the root plus its subcomponents are each shipped as a sibling catalog leaf in this same
> sub-task, each with its own decision doc:
>
> - `dialog-header.md` (`Dialog.Header`) · `dialog-body.md` (`Dialog.Body`) ·
>   `dialog-footer.md` (`Dialog.Footer`)
> - `dialog-title.md` (`Dialog.Title`) · `dialog-subtitle.md` (`Dialog.Subtitle`)
> - `dialog-buttons.md` (`Dialog.Buttons`) · `dialog-closebutton.md` (`Dialog.CloseButton`)
>
> Catalog schema names are PascalCase-concatenated: `Dialog`, `DialogHeader`, `DialogTitle`,
> `DialogSubtitle`, `DialogBody`, `DialogFooter`, `DialogButtons`, `DialogCloseButton`.

## Rendering & composition

- **Self-contained overlay — no new infra.** Dialog portals to the document body and manages
  its own backdrop, focus trap, Escape handling, and body-scroll lock. It renders through the
  normal adapter→renderer path with nothing extra to build and is screenshottable (the
  `ConfirmationDialog`/`TreeView.ErrorDialog` precedent, 6.45).
- **Slot scanning.** The root's `children` are slot-scanned: `DialogHeader` / `DialogBody` /
  `DialogFooter` children replace the default header/body/footer sections; every remaining
  child renders as the default body's content. The permissive `ChildList` carries both, exactly
  as the library composes them. `DialogTitle`/`DialogSubtitle`/`DialogCloseButton` compose
  inside `DialogHeader`; `DialogButtons` composes inside `DialogFooter`.
- **One dialog per fixture surface.** The open modal's backdrop covers the viewport, so a
  fixture holds exactly one dialog: enum walks are one isolated surface per **non-default**
  value (the base fixture covers the defaults) — no shared-row galleries.
- **No `accessibility` prop anywhere in the family.** `DialogProps` is a closed interface with
  no aria spread; the accessible name/description are wired automatically from
  `title`/`subtitle` (or a custom header's `DialogTitle`/`DialogSubtitle`), and
  `DialogCloseButton`'s accessible name is hardcoded by the library.

## Shared local type — `dialogButton`

One element of a dialog's button row. Defined once here; used by the root's `footerButtons`
and by `DialogButtons.buttons` (`dialog-buttons.md`).

| field | A2UI type | description |
|---|---|---|
| `content` | `DynamicString` — required | The button's label. |
| `buttonType` | `z.enum(['default','primary','danger','normal']) (default: "default")` | The button's visual emphasis; `normal` is a legacy alias the implementation maps to `default`. |
| `action` (← `onClick`) | `Action` — required | The action performed when the button is clicked. |
| `autoFocus` | `z.boolean() (default: false)` | Whether this button receives focus when the dialog opens; only the first entry marked applies. |
| `disabled` | `DynamicBoolean` | Whether the button is disabled and cannot be clicked. |
| `loading` | `DynamicBoolean` | Whether the button shows a loading state while an operation is pending. |

Dropped from each entry: `ref` (DOM ref, not serializable); the rest of the inherited button
surface (`variant`, `size`, visuals, …) — the curated pulls above are the element's surface;
the full surface lives on the shipped `Button` leaf.

---

## Adapter section

### Prop-surface table

| prop | decision | synthetic? | A2UI type | description |
|---|---|---|---|---|
| `title` | carry (required) | no | `DynamicString` | The dialog's heading; also its accessible name. |
| `subtitle` | carry | no | `DynamicString (default: "")` | Secondary text rendered below the title; also the accessible description. |
| `children` | carry (optional) | yes | `ChildList` | The dialog's body content; may include header/body/footer slot components to replace those sections. |
| `closeAction` (← `onClose`) | carry (required) | yes | `Action` | Performed when the user closes the dialog — the close button, the Escape key, or clicking the backdrop. |
| `footerButtons` | carry | no | `z.array(dialogButton) (default: [])` | The buttons rendered in the dialog's footer. |
| `role` | carry | no | `z.enum(['dialog','alertdialog']) (default: "dialog")` | The dialog's semantic role; `alertdialog` marks an interruption that requires a response. |
| `width` | carry | no | `z.union([z.enum(['small','medium','large','xlarge']), z.string(), z.number()]) (default: "xlarge")` | The dialog's width: preset sizes (small 296px, medium 320px, large 480px, xlarge 640px) or any CSS width value. |
| `height` | carry | no | `z.enum(['small','large','auto']) (default: "auto")` | The dialog's height: small 480px, large 640px, auto sizes to the contents. |
| `position` | carry | no | `z.union([z.enum(['center','left','right']), responsive(z.enum(['left','right','bottom','fullscreen','center']))]) (default: "center")` | Where the dialog appears: centered over the page or as a side sheet; narrow viewports may use a bottom sheet or fullscreen. |
| `align` | carry | no | `z.enum(['top','center','bottom']) (default: "center")` | Vertical alignment when the dialog is centered. |

Notes:

- `title` is tightened to **required** against the installed optional type: the code fallback
  `'Dialog'` is an accessible-name fallback, unreachable once the prop is required.
- `closeAction` does not forward the library callback's gesture parameter
  (`'close-button' | 'escape'`) — `Action` context is authored, not per-invocation.
- `position`'s responsive-object arm follows the established `responsive()` convention
  (`stack.md`, `split-page-layout.md`); `bottom` and `fullscreen` exist only in that arm and
  take effect only below the narrow breakpoint.

### Functions

| name | args | returnType | description |
|---|---|---|---|
| `consoleLog` | `message: string` (The message to log.) | `void` | Logs a message. A local client-side effect invoked from `functionCall` actions. Already registered in the catalog — no new registration. |

### Dropped / deferred props

| prop | reason |
|---|---|
| `renderHeader` / `renderBody` / `renderFooter` | Deferred: function-typed render props, not JSON-serializable. Their capability — a custom header/body/footer — is carried by the `DialogHeader`/`DialogBody`/`DialogFooter` slot leaves; backfill only if a custom-frame need appears that the slot leaves cannot cover. |
| `returnFocusRef` / `initialFocusRef` | Dropped: DOM refs, not serializable. Initial focus is covered by `footerButtons[].autoFocus`. |
| `className` / `style` / `data-component` | Dropped: styling/test passthroughs; no A2UI representation. |

---

## Client section

One dialog per fixture surface (see Rendering & composition); every fixture carries the
required `title` and `closeAction`. Enum-walk fixtures reuse the base content and vary only
their axis.

### Fixture table

| fixture | exercises (coverage axis) | component state / canned values | baselined? |
|---|---|---|---|
| `dialog` | base — `title`+`subtitle` literal; body `children`; all defaults (`xlarge`/`auto`/`center`/`center`) | `title: "Delete this file?"`; `subtitle: "This action cannot be undone"`; body `Text` (`id: 'dialog-body'`, `text: "The file README.md will be permanently removed."`); `closeAction: functionCall consoleLog {message: 'dialog closed'}` | yes |
| `dialog-bound` | content channel — bound (path binding) | `title: {path: '/dialog/title'}`; `subtitle: {path: '/dialog/subtitle'}`; data model `{dialog: {title: 'Bound title', subtitle: 'Bound subtitle'}}`; body `Text`; `closeAction: functionCall consoleLog {message: 'dialog closed'}` | yes |
| `dialog-close-fn` | `closeAction` — functionCall path | base content; `closeAction: functionCall consoleLog {message: 'dialog-close-fn closed'}` | yes |
| `dialog-close-event` | `closeAction` — event path (agent-coupled) | `title: "Notice"`; `subtitle: {path: '/closeStatus'}` + data model `{closeStatus: 'Press Esc, the X, or the backdrop to close'}`; body `Text` (`id: 'dialog-body'`, `text: "Close this dialog using the X, Escape, or the backdrop."`); `closeAction: event {name: 'dialog-close', context: {}}` | yes |
| `dialog-buttons` | `footerButtons` — `content` + full `buttonType` walk + action shapes (agent-coupled) | base content (`id: 'dialog-body'` on the body `Text`); `footerButtons`: `{content: 'Later', buttonType: 'default', action: functionCall consoleLog {message: 'later'}}` · `{content: 'Save', buttonType: 'primary', autoFocus: true, action: functionCall consoleLog {message: 'save'}}` · `{content: 'Delete', buttonType: 'danger', disabled: {path: '/deleted'}, action: event {name: 'confirm-delete', context: {}}}` · `{content: 'Dismiss', buttonType: 'normal', action: functionCall consoleLog {message: 'dismiss'}}`; data model `{deleted: false}` | yes |
| `dialog-button-states` | `footerButtons[].disabled` + `[].loading` | base content; two buttons: `{content: 'Disabled', disabled: true, action: functionCall consoleLog {message: 'noop'}}` · `{content: 'Loading', loading: true, action: functionCall consoleLog {message: 'noop'}}` | yes |
| `dialog-width-small` / `-medium` / `-large` | `width` — non-default presets | base content; `width: 'small'` / `'medium'` / `'large'` | yes (one PNG each) |
| `dialog-width-custom` | `width` — free CSS arm | base content; `width: '400px'` | yes |
| `dialog-height-small` / `-large` | `height` — non-default values | base content; `height: 'small'` / `'large'` | yes (one PNG each) |
| `dialog-position-left` / `-right` | `position` — scalar side-sheet arm | base content; `position: 'left'` / `'right'` | yes (one PNG each) |
| `dialog-align-top` / `-bottom` | `align` — non-default values | base content; `align: 'top'` / `'bottom'` | yes (one PNG each) |

(The composed sub-leaf fixture `dialog-slots` lives in the sub docs — see `dialog-header.md`
et al.; it is the shared composition backdrop for the whole family.)

Render-test assertions (non-visual):

- **`role`** — the rendered element's role attribute matches each enum value; `dialog` default
  when unset.
- **`footerButtons[].autoFocus`** — after mount, `document.activeElement` is the `autoFocus`
  button (`dialog-buttons`'s `Save`); classified non-visual because the focus ring rides on
  `:focus-visible` heuristics that a static screenshot cannot capture deterministically.
- **`position` responsive arm** — the per-viewport `data-position-*` attributes are emitted
  and forwarded; the narrow-only `bottom`/`fullscreen` visuals are deferred
  (`deferred-catalog-work.md`, multi-viewport baseline infra).

### Prop-coverage map

| adapter prop | covered by |
|---|---|
| `title` | `dialog` (literal) + `dialog-bound` (bound) |
| `subtitle` | `dialog` (literal) + `dialog-bound` (bound) |
| `children` | every fixture (the body content) |
| `closeAction` | `dialog-close-fn` (functionCall) + `dialog-close-event` (event) |
| `footerButtons` | `dialog-buttons` (`content`, `buttonType` walk, both action shapes) + `dialog-button-states` (`disabled`, `loading`) + render-test (`autoFocus`) |
| `role` | render-test assertion (non-visual) |
| `width` | `dialog-width-small`/`-medium`/`-large` + `dialog-width-custom` (`xlarge` default in base) |
| `height` | `dialog-height-small`/`-large` (`auto` default in base) |
| `position` | `dialog-position-left`/`-right` (scalar) + render-test (responsive arm); narrow-only visuals deferred |
| `align` | `dialog-align-top`/`-bottom` (`center` default in base) |

---

## Agent section

The family's client fixtures emit three events. Two derive from this root's adapter table —
`dialog-close` (`closeAction`) and `confirm-delete` (a `footerButtons` entry's `action`);
the third, `save-changes`, derives from `DialogButtons.buttons[].action` and lives in
`dialog-buttons.md`.

All responses keep the dialog rendered and mutate inside it — a root swap that removed the
dialog would unrender the bound prop and blind the `updateDataModel` half.

### Event-response table

| event | response messages (ordered, with canned values) | visibility coupling (client fixture · bound prop ← path · initial value) |
|---|---|---|
| `dialog-close` | 1. `updateDataModel {path: '/closeStatus', value: '✅ Close received — server acknowledged the dismissal'}` · 2. `updateComponents [{id: 'dialog-body', component: 'Text', text: 'The server has logged this dialog as dismissed.'}]` (surfaceId echoed — stamped at runtime, not authored) | `dialog-close-event` · `subtitle ← /closeStatus` · initial `'Press Esc, the X, or the backdrop to close'` |
| `confirm-delete` | 1. `updateDataModel {path: '/deleted', value: true}` (the danger button disables — the action cannot be repeated) · 2. `updateComponents [{id: 'dialog-body', component: 'Text', text: '🗑️ Deleted — server received confirm-delete'}]` (surfaceId echoed — stamped at runtime, not authored) | `dialog-buttons` · danger button `disabled ← /deleted` · initial `false` |

The `confirm-delete` coupling proves the two-way `disabled: DynamicBoolean` binding on the
`dialogButton` element type itself; the body swap is the self-visible half of each response.
