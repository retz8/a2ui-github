# TextInput

- **Official documentation URL:** https://primer.style/components/text-input
- **Real prop surface resolved from:** `@primer/react` installed type declarations at
  `node_modules/@primer/react/dist/TextInput/TextInput.d.ts` —
  `TextInputProps = Merge<React.ComponentPropsWithoutRef<'input'>, TextInputNonPassthroughProps>`,
  where `TextInputNonPassthroughProps` adds `{ icon?, loading?, loaderPosition?, loaderText?,
  leadingVisual?, trailingVisual?, trailingAction?, characterLimit? }` and picks
  `{ block, contrast, disabled, monospace, width, maxWidth, minWidth, variant, size,
  validationStatus }` from `StyledWrapperProps` (`internal/components/TextInputWrapper.d.ts`).
  The implementation (`TextInput.js`) explicitly destructures `type` (default `'text'`),
  `required`, `value`, `defaultValue`, `onChange`, `onFocus`, `onBlur`, `loaderPosition`
  (default `'auto'`), `loaderText` (default `'Loading'`) from the spread. `required` is
  mirrored to `aria-required`; `validationStatus` drives `aria-invalid` and wrapper validation
  styling; `characterLimit` renders a live character counter below the input and forces `error`
  styling when exceeded; `loading` shows a loading indicator whose position `loaderPosition`
  controls. `icon`, `variant`, `width`, `minWidth`, `maxWidth` are `@deprecated` in the type.
- **Component-level description (→ `catalog.json` `description`):** A single-line plain-text
  input for entering short free-form text; supports leading/trailing visuals, validation
  states, a loading indicator, and an optional character counter.

`value` is two-way bound (the Checkbox/Textarea pattern): the client writes the user's edits
back to the bound data-model path via the binder's auto-generated setter. There is no
client→server message for a data-model write; the agent reads the input's text from a later
event's `context` (e.g. a submit button).

---

## Adapter section

### Prop-surface table

| prop | decision | synthetic? | A2UI type | description |
|---|---|---|---|---|
| `value` | carry (required) | no | `DynamicString` | The text content. Two-way bound: user edits write back to the bound data-model path. |
| `placeholder` | carry | no | `DynamicString` | Hint text shown while the input is empty. |
| `disabled` | carry | no | `DynamicBoolean` | Whether the input is inactive and cannot be edited. |
| `required` | carry | no | `z.boolean()` | Whether a value is required; conveyed to assistive technologies. |
| `validationStatus` | carry | no | `z.union([z.enum(['error','success']), DataBinding])` | Styles the input to reflect the current validation state. Bindable: an agent can drive it through the data model (there is no `DynamicEnum`, so this is a union of the enum + `DataBinding`) — this realizes the `validationStatus ← /validation` coupling `textinput-action.md` relies on. |
| `type` | carry | no | `z.enum(['text','password','email','number','search','tel','url']) (default: "text")` | The kind of text input; controls masking, keyboard, and input semantics. |
| `loading` | carry | no | `DynamicBoolean` | Whether to show a loading indicator inside the input. |
| `loaderPosition` | carry | no | `z.enum(['auto','leading','trailing']) (default: "auto")` | Where the loading indicator renders; `auto` places it trailing unless a leading visual is present. |
| `loaderText` | carry | no | `z.string() (default: "Loading")` | Screen-reader text conveying the loading state. |
| `leadingVisual` | carry | no | `ComponentId` | A visual rendered inside the input before the typing area. |
| `trailingVisual` | carry | no | `ComponentId` | A visual rendered inside the input after the typing area. |
| `trailingAction` | carry | no | `ComponentId` | An action button rendered inside the input at the trailing edge (e.g. a clear or show/hide toggle). References a `TextInput.Action` (shipped as a sibling leaf; see `textinput-action.md`). |
| `size` | carry | no | `z.enum(['small','medium','large'])` | The input's overall size. |
| `block` | carry | no | `z.boolean() (default: false)` | Expands the input to fill the parent's width. |
| `contrast` | carry | no | `z.boolean() (default: false)` | Uses a higher-contrast background color. |
| `monospace` | carry | no | `z.boolean() (default: false)` | Renders the text in a monospace font. |
| `characterLimit` | carry | no | `z.number()` | Optional character limit; shows a live character counter below the input and applies error styling when exceeded. |
| `accessibility` | carry | no | `AccessibilityAttributes` | Label/description for assistive technologies — the input renders no visible label of its own. |

### Functions

`clearValue({path})` — a local client-side function that clears a data-model path (writes `''`).
TextInput itself carries no `Action` (its state change *is* the two-way write to `value`'s bound
path), but the trailing "Clear" affordance (`textinput-trailing-action`) must reset the input's
bound value: a button can't own another component's value, so clearing is a write to the value's
path. `execute` receives the `DataContext` and calls `.set(path, '')` — the same write the input's
two-way binding performs on edit — and the subscribed input re-renders empty. Joins
`consoleLog`/`windowAlert` in the registry.

### Dropped / deferred props

| prop | reason |
|---|---|
| `icon` | Dropped: `@deprecated` alias for `leadingVisual`/`trailingVisual`. |
| `variant` | Dropped: `@deprecated` alias for `size`. |
| `width`, `minWidth`, `maxWidth` | Dropped: `@deprecated` styling passthroughs, no A2UI representation. |
| `onChange` | Represented by the two-way binding on `value`; no separate protocol prop. |
| `defaultValue` | Dropped: uncontrolled mode; the data model owns state in A2UI. |
| `className`, `style` | Dropped: styling passthroughs, no A2UI representation. |
| `ref`, non-`aria-*` input-attribute spread (`name`, `type` HTML aliases, `autoFocus`, `onFocus`, `onBlur`, `maxLength`, …) | Dropped: no A2UI representation. `placeholder` is the one carried exception (author-facing content channel central to a text input). |
| *(visible label — not a prop)* | Deferred: visible labeling ships with `FormControl` (6.47), same as Checkbox/Textarea; `accessibility.label` covers the accessible name meanwhile. |

---

## Client section

### Fixture table

| fixture | exercises (coverage axis) | component state / canned values | baselined? |
|---|---|---|---|
| `textinput` | default render — `value` literal | `value: "octocat"`, everything else default | yes |
| `textinput-bound` | path binding + two-way write-back | `value: {path: "/query"}`, data model `{query: "octocat"}`; interaction test: type → `/query` updates and the input re-renders | no — behavior proven in render/interaction tests; pixels identical to `textinput` |
| `textinput-placeholder` | `placeholder` while empty | `value: ""`, `placeholder: "Search repositories"` | yes |
| `textinput-disabled` | visually-distinct state — `disabled` | `disabled: true`, `value: "Cannot edit"` | yes |
| `textinput-validation` | visual enum — `validationStatus` | one surface per `['error','success']`, each with a short literal value | yes (one PNG) |
| `textinput-type` | visual enum — `type` | one surface per `['text','password','email','number','search','tel','url']`, each with a literal value (`password` renders masked) | yes (one PNG) |
| `textinput-loading` | `loading` × `loaderPosition` | mini-gallery, four surfaces: `loading: true` at `loaderPosition` `'auto'` / `'leading'` / `'trailing'` (no leading visual), plus a fourth pairing `leadingVisual`→`Icon` with `loading: true` (spinner moves leading under `auto`) | yes (one PNG) |
| `textinput-leading-visual` | slot — `leadingVisual` | `leadingVisual`→`Icon` (SearchIcon), `value: "octocat"` | yes |
| `textinput-trailing-visual` | slot — `trailingVisual` | `trailingVisual`→`Icon` (CheckIcon), `value: "octocat"` | yes |
| `textinput-trailing-action` | slot — `trailingAction` (+ interactive clear) | `value: {path: '/query'}` (data model `/query: "octocat"`); `trailingAction`→`TextInput.Action` (icon `XIcon`, `aria-label: "Clear"`, `action: functionCall clearValue {path: '/query'}`); clicking Clear writes `''` to `/query` and the subscribed input re-renders empty | yes (one PNG; the static render is unchanged — `octocat` + `×`) |
| `textinput-size` | visual enum — `size` | one surface per `['small','medium','large']`, each with a short literal value | yes (one PNG) |
| `textinput-block` | visually-distinct state — `block` | `block: true`, short literal value | yes |
| `textinput-contrast` | visually-distinct state — `contrast` | `contrast: true`, short literal value | yes |
| `textinput-monospace` | visually-distinct state — `monospace` | `monospace: true`, `value: "git rev-parse HEAD"` | yes |
| `textinput-character-limit` | `characterLimit` counter × over-limit | mini-gallery, two surfaces: `characterLimit: 20` + short value (counter below) and `characterLimit: 5` + longer value (over-limit: error styling + alert icon) | yes (one PNG) |

Single-axis throughout except `textinput-loading` and `textinput-character-limit`: the
loading indicator's position is only observable while `loading` is set (and the `auto` branch
only differs when a `leadingVisual` is present), and the over-limit state only exists as a
`characterLimit`×`value` combination — so each is a semantically-coupled mini-gallery.

### Prop-coverage map

| adapter prop | covered by |
|---|---|
| `value` | `textinput` (literal) · `textinput-bound` (bound + two-way write-back) |
| `placeholder` | `textinput-placeholder` |
| `disabled` | `textinput-disabled` |
| `required` | render-test assertion: `aria-required="true"` |
| `validationStatus` | `textinput-validation` (gallery); render-test assertion: `error` → `aria-invalid="true"` |
| `type` | `textinput-type` (gallery, all seven values) |
| `loading` | `textinput-loading` (mini-gallery) |
| `loaderPosition` | `textinput-loading` (mini-gallery: `auto`/`leading`/`trailing` + the `leadingVisual`+`auto` surface) |
| `loaderText` | render-test assertion: visually-hidden loader text present when `loading` is set |
| `leadingVisual` | `textinput-leading-visual` (and the `textinput-loading` fourth surface) |
| `trailingVisual` | `textinput-trailing-visual` |
| `trailingAction` | `textinput-trailing-action` (slot filled with a `TextInput.Action`) |
| `size` | `textinput-size` (gallery) |
| `block` | `textinput-block` |
| `contrast` | `textinput-contrast` |
| `monospace` | `textinput-monospace` |
| `characterLimit` | `textinput-character-limit` (mini-gallery) |
| `accessibility` | render-test assertion: `aria-label` / `aria-description` on the input |

---

## Agent section

Omitted. TextInput emits no `event`-shaped `Action` (no `Action` at all — change is the
two-way data-model write to `value`), so per the Orchestration skip rule there is no agent
surface to design.
