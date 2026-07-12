# TextInput.Action

- **Official documentation URL:** https://primer.style/components/text-input
- **Real prop surface resolved from:** `@primer/react` installed type declarations at
  `node_modules/@primer/react/dist/internal/components/TextInputInnerAction.d.ts`
  (`TextInputActionProps = Omit<React.ButtonHTMLAttributes<HTMLButtonElement>,
  'aria-label' | 'size' | 'tooltipDirection'> & { children?, 'aria-label'?, tooltipDirection?,
  icon?: FunctionComponent<IconProps>, variant? }`), reconciled against
  `TextInputInnerAction.js`. Implementation facts: `variant` defaults to `'invisible'`; the
  icon path renders an `IconButton` (size `small`) when `icon && !children && aria-label`;
  `tooltipDirection` defaults to `'s'`; `type` is hardcoded `'button'`; `aria-label` serves as
  **both** the accessible name and the visible tooltip text; a warning fires when no accessible
  label is supplied. `children` and `variant` are `@deprecated` in the type.
- **Component-level description (→ `catalog.json` `description`):** An icon action button
  rendered inside a text input at its trailing edge — triggers an action such as clearing the
  field or toggling password visibility.

> The trailing-action affordance for `TextInput` (see `textinput.md`), shipped as a sibling
> leaf in the same 6.30 sub-task. `TextInput`'s `trailingAction` prop references a
> `TextInput.Action` by `ComponentId`.

---

## Adapter section

### Prop-surface table

| prop | decision | synthetic? | A2UI type | description |
|---|---|---|---|---|
| `action` | carry (required) | no | `Action` | The action performed when the button is clicked. |
| `icon` | carry | no | `ComponentId` | The icon rendered inside the button. |
| `disabled` | carry | no | `DynamicBoolean` | Whether the button is disabled and cannot be clicked. |
| `tooltipDirection` | carry | no | `z.enum(['n','ne','e','se','s','sw','w','nw']) (default: "s")` | Position of the tooltip relative to the button. |
| `accessibility` | carry | no | `AccessibilityAttributes` | Accessible label for the button; also shown as the button's tooltip text. |

### Functions

None new. `TextInput.Action`'s `functionCall` action path reuses the catalog's existing
`consoleLog` function (registered with `Button`); it registers no local function of its own.

### Dropped / deferred props

| prop | reason |
|---|---|
| `children` | Dropped: `@deprecated` — text-input action buttons should only use icons; content comes via `icon`. |
| `variant` | Dropped: `@deprecated` — the implementation forces the `'invisible'` variant. |
| `type` | Dropped: the implementation hardcodes `'button'`; not author-facing. |
| `aria-labelledby`, and the rest of the non-`aria-*` `ButtonHTMLAttributes` spread (`name`, `tabIndex`, `form`, `onFocus`, …) | Dropped: no A2UI representation. `onClick` is carried as `action`; `aria-label` is carried via `accessibility`. |

---

## Client section

### Fixture table

| fixture | exercises (coverage axis) | component state / canned values | baselined? |
|---|---|---|---|
| `textinput-action-fn` | interaction — functionCall path | standalone `TextInput.Action`, `icon`→`Icon` (SearchIcon), `accessibility.label: "Search"`, `action: functionCall consoleLog {message: "action clicked"}` | yes |
| `textinput-action-event` | interaction — event path + full agent round-trip | a `Stack` of: a `TextInput` (`value ← /query`, initial `"octocat"`; `validationStatus ← /validation`, initial unset) whose `trailingAction`→`TextInput.Action` (`icon`→`Icon` (SearchIcon), `accessibility.label: "Search"`, `action: event {name: "search", context: {query: {path: "/query"}}}`); and a sibling `Text` (id `result`, initial `""`) | yes |
| `textinput-action-disabled` | visually-distinct state — `disabled` | standalone `TextInput.Action`, `disabled: true`, `icon`→`Icon` (XIcon), `accessibility.label: "Clear"` | yes |
| `textinput-action-tooltip` | manual visual review — `tooltipDirection` | one `TextInput.Action` per `['n','ne','e','se','s','sw','w','nw']`, each `icon`→`Icon` + `accessibility.label: "<direction>"` | no — the tooltip is invisible at rest and the baseline harness is static-render-only; loaded live and hovered for manual review |

### Prop-coverage map

| adapter prop | covered by |
|---|---|
| `action` | `textinput-action-fn` (functionCall) · `textinput-action-event` (event) |
| `icon` | every fixture (the button's icon) |
| `disabled` | `textinput-action-disabled` |
| `tooltipDirection` | render-test assertion (rendered tooltip carries the direction per enum value) · `textinput-action-tooltip` (manual hover review, non-baselined) |
| `accessibility` | render-test assertion: `aria-label` on the button |

---

## Agent section

`TextInput.Action`'s `action` accepts the `event` shape, so an agent section applies. One event
name is emitted by the paired client event fixture: `search`.

### Event-response table

| event | response messages (ordered, with canned values) | visibility coupling (client fixture · bound prop ← path · initial value) |
|---|---|---|
| `search` (context `{query}` carries the current `/query` value → `"octocat"`) | 1. `updateDataModel {path: '/validation', value: 'success'}` · 2. `updateComponents [{id: 'result', component: 'Text', text: 'Found 3 repositories for "octocat"'}]` (the text echoes the **received** `context.query`; surfaceId echoed — stamped at runtime, not authored) | `textinput-action-event` · `TextInput.validationStatus ← /validation` · initial `/validation` unset (neutral) |

The event carries the user's typed value (`context.query ← /query`), so the agent receives real
input. The response drives both mechanisms: the `/validation` write (`updateDataModel`) is
visible only through the parent `TextInput`'s `validationStatus ← /validation` coupling — the
half that proves two-way data binding on the input (after `search`, the field turns green);
the `result` `Text` swap (`updateComponents`) is self-visible and echoes the received query,
proving the agent read the user's input.
