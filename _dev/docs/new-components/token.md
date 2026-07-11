# Token

- **Official documentation URL:** https://primer.style/components/token
- **Real prop surface resolved from:** `@primer/react` installed type declarations at
  `node_modules/@primer/react/dist/Token/Token.d.ts` + `TokenBase.d.ts` (v38.28.0).
  `Token: PolymorphicForwardRefComponent<"a" | "button" | "span", TokenProps>` where
  `TokenProps = TokenBaseProps & { leadingVisual?: React.ElementType }` and
  `TokenBaseProps = { as?: 'button' | 'a' | 'span'; onRemove?: () => void;
  hideRemoveButton?: boolean; isSelected?: boolean; text: React.ReactNode;
  id?: number | string; size?: 'small' | 'medium' | 'large' | 'xlarge'; disabled?: boolean }
  & Omit<React.HTMLProps<HTMLSpanElement | HTMLButtonElement | HTMLAnchorElement>, 'size' | 'id'>`.
  Documented default: `as: "span"`. (`size`'s `'medium'` default is code-level only — not in the
  documented props table, so not recorded.)
- **Component-level description (→ `catalog.json` `description`):** A compact representation of
  an object, typically used to show a collection of related metadata. Optionally removable via a
  remove action.

> The docs page also covers `IssueLabelToken`, a sibling main-entry export sharing
> `TokenBaseProps`; it has its own decision doc at `issue-label-token.md` (same 6.12 sub-task).

---

## Adapter section

### Prop-surface table

| prop | decision | synthetic? | A2UI type | description |
|---|---|---|---|---|
| `text` | carry (required) | no | `DynamicString` | The text label inside the token. |
| `leadingVisual` | carry | no | `ComponentId` | A component rendered before the token's text (e.g. an icon). Not rendered at the small size. |
| `as` | carry | no | `z.enum(['span','button','a']) (default: "span")` | The element the token renders as: a static span, a button, or a link. |
| `removeAction` (⇐ `onRemove`) | carry | yes | `Action` | The action performed when the user removes the token — via the remove button, or Backspace/Delete while focused. Omitting it renders no remove button. |
| `hideRemoveButton` | carry | no | `DynamicBoolean` | Whether the remove button is hidden; keyboard removal remains available when a remove action is set. |
| `isSelected` | carry | no | `DynamicBoolean` | Whether the token is in a selected state. |
| `id` | carry | no | `DynamicString` | A unique identifier associated with the token. |
| `size` | carry | no | `z.enum(['small','medium','large','xlarge'])` | How large the token is rendered. |
| `disabled` | carry | no | `DynamicBoolean` | Whether the token is disabled and non-interactive. |
| `accessibility` | carry | no | `AccessibilityAttributes` | Accessibility label/description for assistive technologies. |

### Functions

| name | args | returnType | description |
|---|---|---|---|
| `consoleLog` | `message: string` (The message to log.) | `void` | Logs a message. A local client-side effect invoked from the token's `functionCall`-shaped remove action. Already registered in the catalog. |

### Dropped / deferred props

| prop | reason |
|---|---|
| `onClick`, `onFocus`, `href`, `tabIndex`, `className`, `style`, `children`, `data-*`, and the rest of the non-`aria-*` host-element spread | Dropped: no A2UI representation. `onClick` is incidental host-element inheritance, absent from the documented props table — Token's designed interaction is removal, carried as `removeAction`. The `aria-*` slice is carried as `accessibility`. |

---

## Client section

### Fixture table

| fixture | exercises (coverage axis) | component state / canned values | baselined? |
|---|---|---|---|
| `token` | content — literal | `text: "Token from Primer"` | yes |
| `token-bound` | content — bound (path binding) | `text: {path: "/tokenText"}`; data model `{tokenText: "Bound token"}` | yes |
| `token-leadingvisual` | slot — `leadingVisual` | `text: "With icon"`; `leadingVisual` → an `Icon` child | yes |
| `token-sizes` | visual enum — `size` | one surface per `['small','medium','large','xlarge']`; each `text` = the size name | yes (one PNG) |
| `token-selected` | state — `isSelected` | `text: "Selected"`; `isSelected: true` | yes |
| `token-disabled` | state — `disabled` (coupled: needs `removeAction` so non-interactivity is observable) | `text: "Disabled"`; `disabled: true`; `removeAction: functionCall consoleLog {message: "token-disabled"}` | yes |
| `token-remove-fn` | interaction — functionCall path | `text: "Remove me"`; `removeAction: functionCall consoleLog {message: "token-remove clicked"}` | yes |
| `token-remove-event` | interaction — event path | Token (id `token`): `text: "Remove me"`; `disabled: {path: "/removed"}`; `removeAction: event {name: "token-remove", context: {}}` · sibling status `Text` (id `status`): `text: "Waiting for server…"` · data model `{removed: false}` | yes |
| `token-hideremovebutton` | state — `hideRemoveButton` (coupled: needs `removeAction` to have a button to hide) | `text: "No button"`; `removeAction: functionCall consoleLog {message: "token-hideremovebutton"}`; `hideRemoveButton: true` | yes |

Single-axis: each fixture isolates one prop. The two semantic couplings are
`hideRemoveButton` + `removeAction` (a hidden button needs a remove action to hide) and
`disabled` + `removeAction` (non-interactivity needs an interaction to suppress).

### Prop-coverage map

| adapter prop | covered by |
|---|---|
| `text` | `token` (literal) + `token-bound` (bound) |
| `leadingVisual` | `token-leadingvisual` |
| `as` | render-test assertion (rendered root element tag per `['span','button','a']`) |
| `removeAction` | `token-remove-fn` (functionCall) + `token-remove-event` (event) |
| `hideRemoveButton` | `token-hideremovebutton` |
| `isSelected` | `token-selected` |
| `id` | render-test assertion (DOM id wiring, non-visual) |
| `size` | `token-sizes` |
| `disabled` | `token-disabled` (+ bound via `token-remove-event` `disabled ← /removed`) |
| `accessibility` | render-test assertion (non-visual) |

---

## Agent section

Token's `removeAction` accepts the `event` shape, so an agent section applies. One event name is
emitted by the paired client event fixture: `token-remove` (component-prefixed — the deterministic
agent keys canned responses globally by event name, and `IssueLabelToken` also emits a remove
event).

### Event-response table

| event | response messages (ordered, with canned values) | visibility coupling (client fixture · bound prop ← path · initial value) |
|---|---|---|
| `token-remove` | 1. `updateDataModel {path: '/removed', value: true}` · 2. `updateComponents [{id: 'status', component: 'Text', text: '✅ Removed — server received token-remove'}]` (surfaceId echoed — stamped at runtime, not authored) | `token-remove-event` · `disabled ← /removed` · initial `/removed = false` |

The status-line swap (`updateComponents`) is self-visible; it targets the sibling status `Text`
rather than the Token itself because a component swap that removed the Token would also remove the
coupling target. The `/removed` write (`updateDataModel`) is visible only through the
`disabled ← /removed` coupling — after `token-remove`, the token goes visibly inert — which is the
half that proves two-way data binding on the token itself.
