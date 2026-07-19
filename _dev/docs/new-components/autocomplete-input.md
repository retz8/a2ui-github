# Autocomplete.Input

- **Official documentation URL:** https://primer.style/react/Autocomplete/ (see the family note in
  `autocomplete.md`).
- **Real prop surface resolved from:** `@primer/react` installed type declarations at
  `node_modules/@primer/react/dist/Autocomplete/AutocompleteInput.d.ts` —
  `PolymorphicForwardRefComponent<typeof TextInput, { as?, openOnFocus? }>` — i.e. the **entire
  `TextInput` surface** (`node_modules/@primer/react/dist/TextInput/TextInput.d.ts`; see
  `textinput.md`) plus two own props (`as`, `openOnFocus`). Input code default `openOnFocus = false`.
- **Component-level description (→ `catalog.json` `description`):** The text field of an
  autocomplete; the text typed into it filters the suggestion list.

A faithful mirror of `TextInput`: it carries the same curated subset `textinput.md` locked, with two
component-specific decisions and two tightenings.

- `value` is `carry (optional)` (not required as on `TextInput`): `<Autocomplete.Input />` is
  routinely rendered bare, its text managed by the Autocomplete context. It stays **two-way bound**
  — the render fn wires `onChange` to Autocomplete's `setInputValue` (always, to drive filtering)
  **and** the binder's `setValue` (when a path is bound, so the data model observes the typed query;
  the agent reads it for remote filtering / `addNewItem`).
- `type` is tightened to `z.enum(['text','search'])` (from `TextInput`'s seven) — the only two types
  that cohere with a suggestion field; the checklist's curated-projection rule.

---

## Adapter section

### Prop-surface table

| prop | decision | synthetic? | A2UI type | description |
|---|---|---|---|---|
| `value` | carry (optional) | no | `DynamicString` | The text typed into the field; drives suggestion filtering. Two-way bound: user edits write back to the bound data-model path. |
| `placeholder` | carry | no | `DynamicString` | Hint text shown while the field is empty. |
| `disabled` | carry | no | `DynamicBoolean` | Whether the field is inactive and cannot be edited. |
| `required` | carry | no | `z.boolean()` | Whether a value is required; conveyed to assistive technologies. |
| `validationStatus` | carry | no | `z.union([z.enum(['error','success']), DataBinding])` | Styles the field to reflect the current validation state. Bindable through the data model (there is no `DynamicEnum`, so a union of the enum + `DataBinding`). |
| `type` | carry | no | `z.enum(['text','search']) (default: "text")` | The kind of text input; `search` adds search semantics. |
| `loading` | carry | no | `DynamicBoolean` | Whether to show a loading indicator inside the field. |
| `loaderPosition` | carry | no | `z.enum(['auto','leading','trailing']) (default: "auto")` | Where the loading indicator renders. |
| `loaderText` | carry | no | `z.string() (default: "Loading")` | Screen-reader text conveying the loading state. |
| `leadingVisual` | carry | no | `ComponentId` | A visual rendered inside the field before the typing area. |
| `trailingVisual` | carry | no | `ComponentId` | A visual rendered inside the field after the typing area. |
| `trailingAction` | carry | no | `ComponentId` | An action button rendered inside the field at the trailing edge (references a `TextInput.Action`). |
| `size` | carry | no | `z.enum(['small','medium','large'])` | The field's overall size. |
| `block` | carry | no | `z.boolean() (default: false)` | Expands the field to fill the parent's width. |
| `contrast` | carry | no | `z.boolean() (default: false)` | Uses a higher-contrast background color. |
| `monospace` | carry | no | `z.boolean() (default: false)` | Renders the text in a monospace font. |
| `characterLimit` | carry | no | `z.number()` | Optional character limit; shows a live counter and error styling when exceeded. |
| `accessibility` | carry | no | `AccessibilityAttributes` | Label/description for assistive technologies. |

### Functions

None (the trailing-action clear affordance reuses the already-registered `clearValue`; see
`textinput.md`).

### Dropped / deferred props

| prop | reason |
|---|---|
| `as` | Polymorphic `React.ComponentType` input-renderer swap — a behavior/identity switch and internal wiring, not a display-equivalent tag choice. Dropped per the polymorphic-selector rule. |
| `openOnFocus` | `@deprecated` (removed in v38). |
| `icon`, `variant`, `width`, `minWidth`, `maxWidth` | Dropped (inherited from the `TextInput` mirror): `@deprecated` aliases / styling passthroughs. |
| `onChange`, `defaultValue` | Represented by the two-way binding on `value` / uncontrolled mode; the data model owns state. |
| `className`, `style`, `name`, `autoFocus`, `onFocus`, `onBlur`, and the rest of the non-`aria-*` input-attribute spread | Dropped: no A2UI representation. `placeholder` is the one carried exception. |
| *(visible label — not a prop)* | Deferred: visible labeling ships with `FormControl` (6.47); `accessibility.label` covers the accessible name meanwhile. |

---

## Client section

Fixtures live on the root (`autocomplete.md`) — the Input never renders standalone. The Input's
styling props render pixel-identically to the baselined `textinput.md` fixtures, so per the client
Option-A decision they are covered by **render-test assertions** (forwarded to the underlying
`TextInput`), not re-baselined. The autocomplete-specific input states are baselined on the root.

### Prop-coverage map

| adapter prop | covered by |
|---|---|
| `value` | `autocomplete` (literal) · `autocomplete-value-bound` (bound + two-way write-back, render-test) |
| `placeholder` | `autocomplete-placeholder` |
| `disabled` | `autocomplete-disabled` |
| `leadingVisual` | `autocomplete` (search icon) |
| `required` | render-test assertion: `aria-required="true"` |
| `validationStatus` | render-test assertion: forwarded; `error` → `aria-invalid="true"` (identical to `textinput-validation`) |
| `type` | render-test assertion: `search` semantics forwarded |
| `loading` | render-test assertion: loader forwarded |
| `loaderPosition` | render-test assertion: forwarded |
| `loaderText` | render-test assertion: visually-hidden loader text present when `loading` set |
| `trailingVisual` | render-test assertion: forwarded |
| `trailingAction` | render-test assertion: `TextInput.Action` forwarded (reuses `clearValue`) |
| `size` | render-test assertion: forwarded (identical to `textinput-size`) |
| `block` | render-test assertion: forwarded |
| `contrast` | render-test assertion: forwarded |
| `monospace` | render-test assertion: forwarded |
| `characterLimit` | render-test assertion: counter forwarded |
| `accessibility` | render-test assertion: `aria-label` / `aria-description` on the input |

---

## Agent section

Omitted. `Autocomplete.Input` emits no `event`-shaped `Action` (its `value` change is the two-way
data-model write), so per the Orchestration skip rule there is no agent surface to design.
