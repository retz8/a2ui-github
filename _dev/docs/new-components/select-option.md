# Select.Option

- **Official documentation URL:** https://primer.style/components/select
- **Real prop surface resolved from:** `@primer/react` installed type declarations at
  `node_modules/@primer/react/dist/Select/Select.d.ts` — `Option: React.FC<React.PropsWithChildren<
  React.HTMLProps<HTMLOptionElement> & { value: string }>>`. The implementation
  (`Select.js`) is a pure passthrough: `props => <option {...props} />`. The only named prop is
  `value: string` (required); the label comes through `children` as raw text; everything else is the
  inherited `HTMLOptionElement` spread (`disabled`, `selected`, `label`, `hidden`, `id`, …).
- **Component-level description (→ `catalog.json` `description`):** A single selectable option within
  a dropdown, carrying a visible label and an underlying value.

> This is an option leaf for `Select` (see `select.md`), shipped as a sibling in the same 6.31
> sub-task. `text` and `value` are typed `DynamicString` so an option set can be generated from a
> bound data array via the `ChildList` dynamic template (`select-children-template`).

---

## Adapter section

### Prop-surface table

| prop | decision | synthetic? | A2UI type | description |
|---|---|---|---|---|
| `text` | carry (required) | yes | `DynamicString` | The option's visible label. |
| `value` | carry (required) | no | `DynamicString` | The option's underlying value, matched against the select's selected value. |
| `disabled` | carry | no | `DynamicBoolean` | Whether this option cannot be selected. |

### Functions

None. `Select.Option` carries no `Action` and needs no local function.

### Dropped / deferred props

| prop | reason |
|---|---|
| `selected` | Dropped: selection is controlled by the parent select's two-way-bound `value` (an option is selected when its value matches), so a separate `selected` would conflict. |
| `label` (HTML attr), `id`, `hidden`, `className`, `style`, `data-*`, and the rest of the non-`aria-*` `HTMLOptionElement` spread | Dropped: no A2UI representation. |
| `accessibility` | Not carried: an option is a content leaf; its visible text is its accessible name (per-component fidelity, as with `Text`). |

---

## Client section

Options render only inside a `Select`, so every fixture is a `Select` containing `Select.Option`s
(the `Stack.Item`-inside-`Stack` precedent). The dynamic-template path for `text`/`value` is covered
by `Select`'s `select-children-template` (the same framework binder), so this component covers
`text` with static content.

### Fixture table

| fixture | exercises (coverage axis) | component state / canned values | baselined? |
|---|---|---|---|
| `selectoption` | default — `text` literal + `value` selection | a `Select` (`value:'feature'`) → 3 `Select.Option` ("Bug"/"Feature"/"Docs", values `bug`/`feature`/`docs`) | yes |
| `selectoption-disabled` | visually-distinct state — `disabled` | a `Select` → 3 Options, the middle one `disabled:true` | yes |

### Prop-coverage map

| adapter prop | covered by |
|---|---|
| `text` | `selectoption` (literal). Dynamic-template path covered by `Select`'s `select-children-template`. |
| `value` | render-test assertion: rendered as the `<option>`'s `value`; drives selection matched against `Select.value` (also exercised by `selectoption` selecting "Feature"). |
| `disabled` | `selectoption-disabled` |

---

## Agent section

Omitted. `Select.Option` emits no `event`-shaped `Action` (no `Action` at all), so per the
Orchestration skip rule there is no agent surface to design.
