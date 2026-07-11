# Textarea

- **Official documentation URL:** https://primer.style/components/textarea
- **Real prop surface resolved from:** `@primer/react` installed type declarations at
  `node_modules/@primer/react/dist/Textarea/Textarea.d.ts` — a flat type:
  `{ disabled?, validationStatus?, block?, resize?, contrast?, className?, minHeight?,
  maxHeight?, style?, characterLimit? } & TextareaHTMLAttributes<HTMLTextAreaElement>` + ref.
  No polymorphism in the installed type (the doc's `as` row is stale — the implementation
  renders `<textarea>` inside `TextInputBaseWrapper` unconditionally). The implementation
  explicitly destructures `value`, `required`, `rows` (default `7`), `cols` (default `30`),
  `resize` (default `'both'`), `onChange`, and `defaultValue` from the spread. `required` is
  mirrored to `aria-required`; `validationStatus` drives `aria-invalid` and wrapper validation
  styling; `characterLimit` renders a live character counter below the textarea and forces
  `error` styling when exceeded; `minHeight`/`maxHeight` merge into the element's inline style
  as pixel bounds.
- **Component-level description (→ `catalog.json` `description`):** A multiline plain-text
  input for entering longer free-form text; supports validation states and an optional
  character counter.

`value` is two-way bound (the Checkbox pattern): the client writes the user's edits back to
the bound data-model path via the binder's auto-generated setter. There is no client→server
message for a data-model write; the agent reads the textarea's text from a later event's
`context` (e.g. a submit button).

---

## Adapter section

### Prop-surface table

| prop | decision | synthetic? | A2UI type | description |
|---|---|---|---|---|
| `value` | carry (required) | no | `DynamicString` | The multiline text content. Two-way bound: user edits write back to the bound data-model path. |
| `placeholder` | carry | no | `DynamicString` | Hint text shown while the textarea is empty. |
| `disabled` | carry | no | `DynamicBoolean` | Whether the textarea is inactive and cannot be edited. |
| `required` | carry | no | `z.boolean()` | Whether a value is required; conveyed to assistive technologies. |
| `validationStatus` | carry | no | `z.enum(['error','success'])` | Styles the textarea to reflect the current validation state. |
| `block` | carry | no | `z.boolean() (default: false)` | Expands the textarea to fill the parent's width. |
| `resize` | carry | no | `z.enum(['none','both','horizontal','vertical']) (default: "both")` | Which directions the user may resize the textarea in. |
| `contrast` | carry | no | `z.boolean() (default: false)` | Uses a higher-contrast background color. |
| `rows` | carry | no | `z.number() (default: 7)` | Visible height in text rows. |
| `cols` | carry | no | `z.number() (default: 30)` | Visible width in character columns. |
| `characterLimit` | carry | no | `z.number()` | Optional character limit; shows a live character counter below the textarea and applies error styling when exceeded. |
| `minHeight` | carry | no | `z.number()` | Minimum height of the textarea in pixels; bounds user resizing. |
| `maxHeight` | carry | no | `z.number()` | Maximum height of the textarea in pixels; bounds user resizing. |
| `accessibility` | carry | no | `AccessibilityAttributes` | Label/description for assistive technologies — the textarea renders no visible label of its own. |

### Functions

None. Textarea carries no `Action` — the state change *is* the two-way write to `value`'s
bound path — and needs no local function.

### Dropped / deferred props

| prop | reason |
|---|---|
| `onChange` | Represented by the two-way binding on `value`; no separate protocol prop. |
| `defaultValue` | Dropped: uncontrolled mode; the data model owns state in A2UI. |
| `as` | Dropped: doc-stale — the installed type has no `as`; the implementation renders `<textarea>` unconditionally. |
| `className`, `style` | Dropped: styling passthroughs, no A2UI representation. |
| `ref`, non-`aria-*` textarea-attribute spread (`name`, `autoFocus`, `maxLength`, `wrap`, …) | Dropped: no A2UI representation. `placeholder` is the one carried exception (author-facing content channel central to a text input). |
| *(visible label — not a prop)* | Deferred: visible labeling ships with `FormControl` (6.47), same as Checkbox; `accessibility.label` covers the accessible name meanwhile. |

---

## Client section

### Fixture table

| fixture | exercises (coverage axis) | component state / canned values | baselined? |
|---|---|---|---|
| `textarea` | default render — `value` literal | `value: "A multiline\ncomment draft."`, everything else default | yes |
| `textarea-bound` | path binding + two-way write-back | `value: {path: "/draft"}`, data model `{draft: "A multiline\ncomment draft."}`; interaction test: type → `/draft` updates and the textarea re-renders | no — behavior proven in render/interaction tests; pixels identical to `textarea` |
| `textarea-placeholder` | `placeholder` while empty | `value: ""`, `placeholder: "Leave a comment"` | yes |
| `textarea-disabled` | visually-distinct state — `disabled` | `disabled: true`, `value: "Cannot edit this"` | yes |
| `textarea-validation` | visual enum — `validationStatus` | one surface per `['error','success']`, each with a short literal value | yes (one PNG) |
| `textarea-block` | `block` | `block: true`, short literal value | yes |
| `textarea-contrast` | `contrast` | `contrast: true`, short literal value | yes |
| `textarea-rows` | sizing — `rows` | `rows: 3`, short literal value | yes |
| `textarea-cols` | sizing — `cols` | `cols: 60`, short literal value | yes |
| `textarea-character-limit` | `characterLimit` counter × over-limit | mini-gallery, two surfaces: `characterLimit: 40` + short value (counter below) and `characterLimit: 10` + longer value (over-limit: error styling + alert icon) | yes (one PNG) |
| `textarea-min-height` | sizing — `minHeight` | `minHeight: 200`, short literal value | yes |

Single-axis throughout except `textarea-character-limit`: the over-limit state only exists as
a `characterLimit`×`value` combination, so the two surfaces are semantically coupled into one
mini-gallery.

### Prop-coverage map

| adapter prop | covered by |
|---|---|
| `value` | `textarea` (literal) · `textarea-bound` (bound + two-way write-back) |
| `placeholder` | `textarea-placeholder` |
| `disabled` | `textarea-disabled` |
| `required` | render-test assertion: `aria-required="true"` |
| `validationStatus` | `textarea-validation` (gallery); render-test assertion: `error` → `aria-invalid="true"` |
| `block` | `textarea-block` |
| `resize` | render-test assertion: `data-resize` equals each enum value |
| `contrast` | `textarea-contrast` |
| `rows` | `textarea-rows` |
| `cols` | `textarea-cols` |
| `characterLimit` | `textarea-character-limit` (mini-gallery) |
| `minHeight` | `textarea-min-height` |
| `maxHeight` | render-test assertion: inline `max-height` style |
| `accessibility` | render-test assertion: `aria-label` / `aria-description` on the textarea |

---

## Agent section

Omitted. Textarea emits no `event`-shaped `Action` (no `Action` at all — change is the
two-way data-model write), so per the Orchestration skip rule there is no agent surface to
design.
