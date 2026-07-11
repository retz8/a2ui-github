# IssueLabelToken

- **Official documentation URL:** https://primer.style/components/token
- **Real prop surface resolved from:** `@primer/react` installed type declarations at
  `node_modules/@primer/react/dist/Token/IssueLabelToken.d.ts` + `TokenBase.d.ts` (v38.28.0).
  `IssueLabelToken: PolymorphicForwardRefComponent<"span" | "a" | "button", IssueLabelTokenProps>`
  where `IssueLabelTokenProps = TokenBaseProps & { fillColor?: string }` and
  `TokenBaseProps = { as?: 'button' | 'a' | 'span'; onRemove?: () => void;
  hideRemoveButton?: boolean; isSelected?: boolean; text: React.ReactNode;
  id?: number | string; size?: 'small' | 'medium' | 'large' | 'xlarge'; disabled?: boolean }
  & Omit<React.HTMLProps<HTMLSpanElement | HTMLButtonElement | HTMLAnchorElement>, 'size' | 'id'>`.
  No `leadingVisual` (that prop is `Token`-only). Documented default: `as: "span"`. (`size`'s
  `'medium'` default is code-level only — not in the documented props table, so not recorded.)
- **Component-level description (→ `catalog.json` `description`):** A compact token representing
  an issue label, filled with the label's corresponding color. Optionally removable via a remove
  action.

> A sibling main-entry export of `Token` sharing `TokenBaseProps`; Token's decision doc is
> `token.md` (same 6.12 sub-task).

---

## Adapter section

### Prop-surface table

| prop | decision | synthetic? | A2UI type | description |
|---|---|---|---|---|
| `text` | carry (required) | no | `DynamicString` | The text label inside the token. |
| `fillColor` | carry | no | `DynamicString` | The color corresponding to the label the token represents; the token's fill and text derive from it. |
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
| `onClick`, `onFocus`, `href`, `tabIndex`, `className`, `style`, `children`, `data-*`, and the rest of the non-`aria-*` host-element spread | Dropped: no A2UI representation. `onClick` is incidental host-element inheritance, absent from the documented props table — the component's designed interaction is removal, carried as `removeAction`. The `aria-*` slice is carried as `accessibility`. |

---

## Client section

### Fixture table

| fixture | exercises (coverage axis) | component state / canned values | baselined? |
|---|---|---|---|
| `issuelabeltoken` | content — literal | `text: "Issue label from Primer"` | yes |
| `issuelabeltoken-bound` | content — bound (path binding) | `text: {path: "/labelText"}`; data model `{labelText: "Bound label"}` | yes |
| `issuelabeltoken-fillcolor` | state — `fillColor` | `text: "bug"`; `fillColor: "#d73a4a"` | yes |
| `issuelabeltoken-sizes` | visual enum — `size` | one surface per `['small','medium','large','xlarge']`; each `text` = the size name | yes (one PNG) |
| `issuelabeltoken-selected` | state — `isSelected` | `text: "Selected"`; `isSelected: true` | yes |
| `issuelabeltoken-disabled` | state — `disabled` (coupled: needs `removeAction` so non-interactivity is observable) | `text: "Disabled"`; `disabled: true`; `removeAction: functionCall consoleLog {message: "issuelabeltoken-disabled"}` | yes |
| `issuelabeltoken-remove-fn` | interaction — functionCall path | `text: "Remove me"`; `removeAction: functionCall consoleLog {message: "issue-label-remove clicked"}` | yes |
| `issuelabeltoken-remove-event` | interaction — event path | IssueLabelToken (id `token`): `text: "bug"`; `fillColor: "#d73a4a"`; `disabled: {path: "/removed"}`; `removeAction: event {name: "issue-label-remove", context: {}}` · sibling status `Text` (id `status`): `text: "Waiting for server…"` · data model `{removed: false}` | yes |
| `issuelabeltoken-hideremovebutton` | state — `hideRemoveButton` (coupled: needs `removeAction` to have a button to hide) | `text: "No button"`; `removeAction: functionCall consoleLog {message: "issuelabeltoken-hideremovebutton"}`; `hideRemoveButton: true` | yes |

Single-axis: each fixture isolates one prop. The two semantic couplings are
`hideRemoveButton` + `removeAction` (a hidden button needs a remove action to hide) and
`disabled` + `removeAction` (non-interactivity needs an interaction to suppress).

### Prop-coverage map

| adapter prop | covered by |
|---|---|
| `text` | `issuelabeltoken` (literal) + `issuelabeltoken-bound` (bound) |
| `fillColor` | `issuelabeltoken-fillcolor` (+ set in `issuelabeltoken-remove-event`) |
| `as` | render-test assertion (rendered root element tag per `['span','button','a']`) |
| `removeAction` | `issuelabeltoken-remove-fn` (functionCall) + `issuelabeltoken-remove-event` (event) |
| `hideRemoveButton` | `issuelabeltoken-hideremovebutton` |
| `isSelected` | `issuelabeltoken-selected` |
| `id` | render-test assertion (DOM id wiring, non-visual) |
| `size` | `issuelabeltoken-sizes` |
| `disabled` | `issuelabeltoken-disabled` (+ bound via `issuelabeltoken-remove-event` `disabled ← /removed`) |
| `accessibility` | render-test assertion (non-visual) |

---

## Agent section

IssueLabelToken's `removeAction` accepts the `event` shape, so an agent section applies. One event
name is emitted by the paired client event fixture: `issue-label-remove` (component-prefixed — the
deterministic agent keys canned responses globally by event name, and `Token` also emits a remove
event).

### Event-response table

| event | response messages (ordered, with canned values) | visibility coupling (client fixture · bound prop ← path · initial value) |
|---|---|---|
| `issue-label-remove` | 1. `updateDataModel {path: '/removed', value: true}` · 2. `updateComponents [{id: 'status', component: 'Text', text: '✅ Removed — server received issue-label-remove'}]` (surfaceId echoed — stamped at runtime, not authored) | `issuelabeltoken-remove-event` · `disabled ← /removed` · initial `/removed = false` |

The status-line swap (`updateComponents`) is self-visible; it targets the sibling status `Text`
rather than the token itself because a component swap that removed the token would also remove the
coupling target. The `/removed` write (`updateDataModel`) is visible only through the
`disabled ← /removed` coupling — after `issue-label-remove`, the token goes visibly inert — which
is the half that proves two-way data binding on the token itself.
