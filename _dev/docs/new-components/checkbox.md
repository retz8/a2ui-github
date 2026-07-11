# Checkbox

- **Official documentation URL:** https://primer.style/components/checkbox
- **Real prop surface resolved from:** `@primer/react` installed type declarations at
  `node_modules/@primer/react/dist/Checkbox/Checkbox.d.ts` — a flat type:
  `{ indeterminate?, disabled?, ref?, required?, validationStatus?, value?, 'data-component'? }
  & InputHTMLAttributes<HTMLInputElement>`. No polymorphism in the installed type (the doc's
  `as` row is stale — the implementation renders `<input>` unconditionally). The
  implementation explicitly destructures and handles `checked`, `defaultChecked`, `onChange`,
  and `className` from the input-attribute spread. Real props: `checked` (`boolean`),
  `defaultChecked` (`boolean`), `onChange` (change callback), `indeterminate` (`boolean`,
  implementation default `false`; while set it forces the rendered `checked` to false and
  conveys `aria-checked="mixed"`), `disabled` (`boolean`), `required` (`boolean`, mirrored to
  `aria-required`), `validationStatus` (`'error' | 'success'`, ARIA-only), `value` (`string`,
  hidden form-submission identity, also reused as the input's `name`), `ref`,
  `'data-component'`, and the rest of the input-attribute spread.
- **Component-level description (→ `catalog.json` `description`):** A checkbox input for
  selecting or deselecting a single option; supports checked, unchecked, and indeterminate
  states.

First true input component in the catalog: `checked` is two-way bound — the client writes the
user's toggle back to the bound data-model path (the binder's auto-generated setter; no new
infrastructure). There is no client→server message for a data-model write; the agent reads
checkbox state from a later event's `context` (e.g. a submit button).

---

## Adapter section

### Prop-surface table

| prop | decision | synthetic? | A2UI type | description |
|---|---|---|---|---|
| `checked` | carry (required) | no | `DynamicBoolean` | Whether the checkbox is checked. Two-way bound: user toggles write the new value back to the bound data-model path. |
| `indeterminate` | carry | no | `DynamicBoolean (default: false)` | Shows the partial-selection state (e.g. a select-all over a partly-selected list). While set, it overrides the checked appearance and is conveyed as "mixed" to assistive technologies. |
| `disabled` | carry | no | `DynamicBoolean` | Whether the checkbox is inactive and cannot be toggled. |
| `required` | carry | no | `z.boolean()` | Whether the checkbox must be checked; conveyed to assistive technologies. |
| `validationStatus` | carry | no | `z.enum(['error','success'])` | Informs assistive technologies of validity only; an individual checkbox has no validation styles. |
| `value` | carry | no | `z.string()` | A unique identifier for this checkbox input, never shown to the user; corresponds to the native form-submission value and has no effect outside one. |
| `accessibility` | carry | no | `AccessibilityAttributes` | Label/description for assistive technologies — the checkbox renders no visible label of its own. |

### Functions

None. Checkbox carries no `Action` — the state change *is* the two-way write to `checked`'s
bound path — and needs no local function.

### Dropped / deferred props

| prop | reason |
|---|---|
| `onChange` | Represented by the two-way binding on `checked`; no separate protocol prop. Deferred: an optional `action` only if a future flow needs toggle-initiated agent round-trips. |
| `defaultChecked` | Dropped: uncontrolled mode; the data model owns state in A2UI (initial state is the path's initial value or a literal). |
| `as` | Dropped: doc-stale — the installed type has no `as` and the implementation renders `<input>` unconditionally. |
| `ref`, `data-component`, non-`aria-*` input-attribute spread (`name`, `type`, `tabIndex`, …) | Dropped: no A2UI representation. |
| *(visible label — not a prop)* | Deferred: visible labeling ships with `FormControl` / `FormControl.Label` (6.47); revisit Checkbox's UI wiring then. `accessibility.label` covers the accessible name meanwhile. |

---

## Client section

### Fixture table

| fixture | exercises (coverage axis) | component state / canned values | baselined? |
|---|---|---|---|
| `checkbox` | default render — `checked` literal false | `checked: false`, everything else default | yes |
| `checkbox-checked` | `checked` literal true | `checked: true` | yes |
| `checkbox-bound` | path binding + two-way write-back | `checked: {path: "/notify"}`, data model `{notify: false}`; interaction test: click → `/notify` becomes `true` and the box re-renders checked | no — behavior proven in render/interaction tests; pixels identical to `checkbox` |
| `checkbox-indeterminate` | visually-distinct state — `indeterminate` | `indeterminate: true`, `checked: false` | yes |
| `checkbox-disabled` | visually-distinct states — `disabled` × check-state | mini-gallery, two surfaces in one fixture: `disabled: true, checked: false` and `disabled: true, checked: true` | yes (one PNG) |

Single-axis throughout except `checkbox-disabled`: `disabled` renders distinctly per
check-state (dimmed empty box vs dimmed checkmark), so the two combinations are semantically
coupled into one mini-gallery fixture.

### Prop-coverage map

| adapter prop | covered by |
|---|---|
| `checked` | `checkbox` + `checkbox-checked` (literal) · `checkbox-bound` (bound + two-way write-back) |
| `indeterminate` | `checkbox-indeterminate` |
| `disabled` | `checkbox-disabled` (mini-gallery) |
| `required` | render-test assertion: input required / `aria-required="true"` |
| `validationStatus` | render-test assertion: `error` → `aria-invalid="true"` (ARIA-only per docs) |
| `value` | render-test assertion: renders as the input's `value`/`name` attributes |
| `accessibility` | render-test assertion: `aria-label` / `aria-description` on the input |

---

## Agent section

Omitted. Checkbox emits no `event`-shaped `Action` (no `Action` at all — change is the
two-way data-model write), so per the Orchestration skip rule there is no agent surface to
design.
