# Popover.Content

- **Part of the `Popover` compound family** (6.56) — see `popover.md` for the family note, the
  rendering/composition conventions, and the component-level frame.
- **Official documentation URL:** https://primer.style/components/popover
- **Real prop surface resolved from:** `@primer/react` type declarations at
  `node_modules/@primer/react/dist/Popover/Popover.d.ts` (`PopoverContentProps`), reconciled
  against the implementation at `Popover.js` (authority on defaults: `width = "small"`,
  `height = "fit-content"`, `overflow = "auto"`).
- **Component-level description (→ `catalog.json` `description`):** The visible content box of a
  popover, holding its heading, message text, and action controls.

Composed as the child of `Popover` (see `popover.md`).

---

## Adapter section

### Prop-surface table

| prop | decision | synthetic? | A2UI type | description |
|---|---|---|---|---|
| `children` | carry (required) | yes | `ChildList` | The content shown inside the box — heading, message text, and action controls. |
| `width` | carry | no | `z.enum(['xsmall','small','medium','large','xlarge','auto']) (default: "small")` | The width of the content box. |
| `height` | carry | no | `z.enum(['small','medium','large','xlarge','auto','fit-content']) (default: "fit-content")` | The height of the content box. |
| `overflow` | carry | no | `z.enum(['auto','hidden','scroll','visible']) (default: "auto")` | How content exceeding the box's bounds is handled. |
| `onClickOutside` | carry | no | `Action` | The action performed when a click occurs outside the box, typically to dismiss it. |
| `as` | carry | no | `z.enum(['div','section','aside']) (default: "div")` | The HTML element used for the box; the choices are display-equivalent and differ only in semantic/landmark identity. |
| `accessibility` | carry | no | `AccessibilityAttributes` | Accessible name, description, and role for the content region, for assistive technologies. |

Notes:

- `children` is tightened to **required**: the box's only content channel (see `popover.md`
  Rendering & composition).
- `onClickOutside` → optional `Action` (the `Dialog` `closeAction ← onClose` precedent). It is
  the popover's **only** dismissal signal — unlike `Dialog`, there is no built-in Escape /
  backdrop — so it is the hook that lets an outside-click drive a local `functionCall` or an
  agent `event`. It does not forward the callback's DOM event argument (`Action` context is
  authored, not per-invocation).

### Functions

| name | args | returnType | description |
|---|---|---|---|
| `consoleLog` | `message: string` (The message to log.) | `void` | Logs a message. A local client-side effect invoked from `functionCall` actions. Already registered in the catalog — no new registration. |

### Dropped / deferred props

| prop | reason |
|---|---|
| `ignoreClickRefs` | Dropped: an array of live DOM refs (`RefObject<HTMLElement>[]`) excluded from outside-click detection; not JSON-serializable (the `Dialog` `returnFocusRef`/`initialFocusRef` precedent). |
| `className` / `style` and the rest of the non-`aria-*` `HTMLDivElement` spread | Dropped: styling passthroughs / no A2UI representation (categorical). |

---

## Client section

Every fixture is a composed `Popover` → `Popover.Content` → content tree over the canonical
content defined in `popover.md` (`Heading#popover-heading`, `Text#popover-message`,
`Button#popover-action`), with `open: true` + `relative: true` for visibility. This section
covers the `Popover.Content` props.

### Fixture table

| fixture | exercises (coverage axis) | component state / canned values | baselined? |
|---|---|---|---|
| `content-width` | `width` enum | one surface per the 6 widths; else base | yes (one PNG) |
| `content-height` | `height` enum | one surface per the 6 heights; else base | yes (one PNG) |
| `content-overflow` | `overflow` enum | `height: small` + long overflowing content; one surface per the 4 values | yes (one PNG) |
| `content-clickoutside-fn` | `onClickOutside` — functionCall path | `onClickOutside: functionCall consoleLog {message: 'clicked outside'}`; else base | yes |
| `content-clickoutside-event` | `onClickOutside` — event path (agent-coupled) | `onClickOutside: event {name: 'popover-dismiss', context: {}}`; `Text#popover-message` `text: {path: '/dismissNote'}` + data model `{dismissNote: 'Click outside to dismiss'}` | yes |

Render-test assertions (non-visual):

- **`as`** — the rendered box element matches each enum value (`div` / `section` / `aside`
  render identically, so no baseline).
- **`accessibility`** — the authored `aria-*` attributes are emitted on the content box.

### Prop-coverage map

| adapter prop | covered by |
|---|---|
| `children` | every fixture (the box content); default `width`/`height` covered by `popover-base` (`popover.md`) |
| `width` | `content-width` (`small` default in base) |
| `height` | `content-height` (`fit-content` default in base) |
| `overflow` | `content-overflow` (`auto` default in base) |
| `onClickOutside` | `content-clickoutside-fn` (functionCall) + `content-clickoutside-event` (event) |
| `as` | render-test assertion (non-visual) |
| `accessibility` | render-test assertion (non-visual) |

---

## Agent section

The box emits one event, `popover-dismiss`, from its `onClickOutside` action
(`content-clickoutside-event`). The server **acknowledges** the outside-click and keeps the
popover open showing the acknowledgment — exercising both update mechanisms visibly (the
`Dialog` `dialog-close` precedent): a root swap that closed the popover would unrender the bound
prop and blind the `updateDataModel` half.

### Event-response table

| event | response messages (ordered, with canned values) | visibility coupling (client fixture · bound prop ← path · initial value) |
|---|---|---|
| `popover-dismiss` | 1. `updateDataModel {path: '/dismissNote', value: 'Server acknowledged the dismissal.'}` · 2. `updateComponents [{id: 'popover-heading', component: 'Heading', text: '✅ Dismissed'}]` (surfaceId echoed — stamped at runtime, not authored) | `content-clickoutside-event` · `Text#popover-message` `text ← /dismissNote` · initial `'Click outside to dismiss'` |

The `/dismissNote` write is visible only through the `text ← /dismissNote` coupling — the half
that proves two-way data binding; the heading swap is the self-visible half of the response.
