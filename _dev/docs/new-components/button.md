# Button

- **Official documentation URL:** https://primer.style/components/button
- **Real prop surface resolved from:** `node_modules/@primer/react/dist/Button/types.d.ts`
  (`ButtonProps = { alignContent, icon, leadingVisual, trailingVisual, trailingAction, children, count } & ButtonBaseProps`;
  `ButtonBaseProps = { variant, size, disabled, block, loading, loadingAnnouncement, inactive, labelWrap } & React.ButtonHTMLAttributes<HTMLButtonElement>`).
  Reached from `Button.d.ts` → `ButtonComponent: PolymorphicForwardRefComponent<"button", ButtonProps>` → `./types`.
- **Component-level description (→ `catalog.json` `description`):** An interactive button that initiates an action on a page or form when activated.

> Produced by the clean-context validation walk of `design-catalog-component` (task 4.4),
> reconciled to the shipped `Button` on code-affecting rows. Reconciliation notes are inline.

---

## Adapter section

### Prop-surface table

| prop | decision | synthetic? | A2UI type | description |
|---|---|---|---|---|
| `child` | carry (required) | yes | `ComponentId` | The component used as the button's label. |
| `action` | carry (required) | no | `Action` | The action performed when the button is activated. |
| `variant` | carry | no | `z.enum(['default','primary','invisible','danger','link']) (default: "default")` | The visual style; `primary` marks the main call-to-action, `danger` marks a destructive action, `invisible` and `link` are for minimal contexts. |
| `size` | carry | no | `z.enum(['small','medium','large'])` | The button's size. |
| `alignContent` | carry | no | `z.enum(['start','center'])` | How the label is aligned within the button when leading/trailing visuals are present. |
| `disabled` | carry | no | `DynamicBoolean` | Whether the button is disabled and cannot be activated. |
| `loading` | carry | no | `DynamicBoolean` | Whether the button is in a loading state, showing a progress indicator in place of any leading/trailing visual. |
| `inactive` | carry | no | `DynamicBoolean` | Whether the button appears disabled but remains interactive (e.g. while a transient error prevents normal function). |
| `count` | carry | no | `DynamicString` | A value shown alongside the label for counter-style buttons. |
| `block` | carry | no | `z.boolean()` | Whether the button expands to fill its container's width. |
| `labelWrap` | carry | no | `z.boolean()` | Whether the label may wrap onto multiple lines when longer than the button width. |
| `loadingAnnouncement` | carry | no | `z.string()` | Text announced to assistive technologies while the button is loading. |
| `accessibility` | carry | no | `AccessibilityAttributes` | Accessibility label/description for assistive technologies. |
| `icon` | defer | — | — | — |
| `leadingVisual` | defer | — | — | — |
| `trailingVisual` | defer | — | — | — |
| `trailingAction` | defer | — | — | — |

> **Reconciliation — `count`.** The real type is `number | string`; the shipped Button carries
> it as a display value → `DynamicString`. The clean-context walk proposed `DynamicNumber`
> (a gate-row divergence, not a skill defect — the union-type rule now covers this case).

### Functions

| name | args | returnType | description |
|---|---|---|---|
| `consoleLog` | `message: string` (The message to log.) | `void` | Logs a message. A local client-side effect invoked from the button's `functionCall` action. |

### Dropped/deferred props

| prop | reason |
|---|---|
| `icon` | Element-typed (`FunctionComponent<IconProps> \| ElementType \| ReactElement \| null`); not JSON-serializable. Belongs to the icon-only button variant; carry as a `ComponentId` child once an Icon component exists. |
| `leadingVisual` | Element-typed; not JSON-serializable. Carry as a `ComponentId` child once an Icon component exists. |
| `trailingVisual` | Element-typed; not JSON-serializable. Carry as a `ComponentId` child once an Icon component exists. |
| `trailingAction` | Element-typed; not JSON-serializable. Carry as a `ComponentId` child once a suitable component exists. |
| `as` | Polymorphic render-target that switches the button's identity (e.g. `as='a'` for a link); behavioral polymorphism with no protocol representation on this leaf. |
| `href` | Belongs to the link-button variant (`as='a'`), not the standard button; no representation on this leaf. |
| `type`, `name`, `tabIndex`, `form`, `value`, `id`, `data-*`, and the rest of the non-`aria-*` `React.ButtonHTMLAttributes<HTMLButtonElement>` spread | Dropped: no A2UI representation. (The interaction slot `onClick` is carried as the synthetic `action`; the `aria-*` slice is carried as `accessibility`.) |

---

## Client section

> The fixture set below is the exhaustive one the skill's prop-walk yields (one scenario per
> carried prop). The **shipped repo currently implements a subset** — `button-fn`,
> `button-event`, `button-variants` — with the remaining fixtures deferred backfill.

### Fixture table

| fixture | exercises | component state / canned values | baselined? |
|---|---|---|---|
| `button-fn` | interaction — functionCall path | `child`→`label` ("Run local function"); `variant: primary`; `action: functionCall consoleLog {message: "button-fn clicked"}` | yes |
| `button-event` | interaction — event path | `child`→`label` ("Send event"); `variant: primary`; `disabled: {path: "/submitted"}`; `action: event {name: "submit", context: {}}`; data model `{submitted: false}` | yes |
| `button-variants` | visual enum — `variant` | one surface per `['default','primary','invisible','danger','link']`; each `child`→`label` (the variant name); `action: functionCall consoleLog {message: <variant>}` | yes (one PNG) |
| `button-sizes` | visual enum — `size` | one surface per `['small','medium','large']`; each `child`→`label` (the size name); `action: functionCall consoleLog {message: <size>}` | yes (one PNG) |
| `button-aligncontent` | visual enum — `alignContent` | one surface per `['start','center']`; each `child`→`label`; `block: true` (so alignment is observable within a wide button); `action: functionCall consoleLog {message: <align>}` | yes (one PNG) |
| `button-disabled` | visually-distinct state — `disabled` | `child`→`label` ("Disabled"); `disabled: true`; `action: event {name: "noop", context: {}}` | yes |
| `button-inactive` | visually-distinct state — `inactive` | `child`→`label` ("Inactive"); `inactive: true`; `action: event {name: "noop", context: {}}` | yes |
| `button-loading` | visually-distinct state — `loading` (+ coupled `loadingAnnouncement`) | `child`→`label` ("Loading"); `loading: true`; `loadingAnnouncement: "Saving changes…"`; `action: event {name: "noop", context: {}}` | yes |
| `button-block` | visually-distinct state — `block` | `child`→`label` ("Full width"); `block: true`; `action: functionCall consoleLog {message: "block"}` | yes |
| `button-labelwrap` | visually-distinct state — `labelWrap` | `child`→`label` (long text that would overflow); `labelWrap: true`; `action: functionCall consoleLog {message: "labelWrap"}` | yes |
| `button-count` | visually-distinct state — `count` | `child`→`label` ("Watch"); `count: "42"`; `action: functionCall consoleLog {message: "count"}` | yes |

### Prop-coverage map

| adapter prop | covered by |
|---|---|
| `child` | every button fixture (the label) |
| `action` | `button-fn` (functionCall) + `button-event` (event) |
| `variant` | `button-variants` |
| `size` | `button-sizes` |
| `alignContent` | `button-aligncontent` |
| `disabled` | `button-disabled` (+ bound via `button-event` `disabled ← /submitted`) |
| `inactive` | `button-inactive` |
| `loading` | `button-loading` |
| `loadingAnnouncement` | render-test assertion (non-visual) — set in `button-loading` |
| `block` | `button-block` |
| `labelWrap` | `button-labelwrap` |
| `count` | `button-count` |
| `accessibility` | render-test assertion (non-visual) |

---

## Agent section

Button's `action` accepts the `event` shape, so an agent section applies. One event name is emitted by the paired client event fixture: `submit`.

### Event-response table

| event | response messages (ordered, with canned values) | visibility coupling (client fixture · bound prop ← path · initial value) |
|---|---|---|
| `submit` | 1. `updateDataModel {path: '/submitted', value: true}` · 2. `updateComponents [{id: 'label', component: 'Text', text: '✅ Sent — server received submit'}]` (surfaceId echoed — stamped at runtime, not authored) | `button-event` · `disabled ← /submitted` · initial `/submitted = false` |

The label swap (`updateComponents`) is self-visible; the `/submitted` write (`updateDataModel`) is visible only through the `disabled ← /submitted` coupling, which is the half that proves two-way data binding on the button itself (after `submit`, the button becomes disabled).
