# Select.OptGroup

- **Official documentation URL:** https://primer.style/components/select
- **Real prop surface resolved from:** `@primer/react` installed type declarations at
  `node_modules/@primer/react/dist/Select/Select.d.ts` — `OptGroup: React.FC<React.PropsWithChildren<
  React.HTMLProps<HTMLOptGroupElement>>>`. The implementation (`Select.js`) is a pure passthrough:
  `props => <optgroup {...props} />`. There are no named Primer props — the whole surface is the
  inherited `HTMLOptGroupElement` type: `label` (the group heading), `disabled` (whole-group), plus
  `children` (the options), `id`, `className`, `data-*`.
- **Component-level description (→ `catalog.json` `description`):** A labelled grouping of related
  options within a dropdown.

> This is the option-group leaf for `Select` (see `select.md`), shipped as a sibling in the same 6.31
> sub-task. Its `children` slot references `Select.Option` and uses the `ChildList` container-slot
> convention established in `stack.md`.

---

## Adapter section

### Prop-surface table

| prop | decision | synthetic? | A2UI type | description |
|---|---|---|---|---|
| `children` | carry (optional) | yes | `ChildList` | The options contained in this group. |
| `label` | carry (optional) | no | `DynamicString` | The group's heading text. |
| `disabled` | carry | no | `DynamicBoolean` | Whether every option in this group is disabled. |

`children` and `label` are `carry (optional)`, faithful to the installed `HTMLOptGroupElement` type.
`label` is `DynamicString` so groups can also be template-generated.

### Functions

None. `Select.OptGroup` carries no `Action` and needs no local function.

### Dropped / deferred props

| prop | reason |
|---|---|
| `id`, `className`, `style`, `data-*`, and the rest of the non-`aria-*` `HTMLOptGroupElement` spread | Dropped: no A2UI representation. |
| `accessibility` | Not carried: a content grouping; its `label` is the accessible name (per-component fidelity). |

---

## Client section

Option groups render only inside a `Select`, so every fixture is a `Select` containing
`Select.OptGroup`s, each wrapping `Select.Option`s. The dynamic-template path for `children` is
covered by `Select`'s `select-children-template` (the same framework binder).

### Fixture table

| fixture | exercises (coverage axis) | component state / canned values | baselined? |
|---|---|---|---|
| `selectoptgroup` | default — static `children` + `label` headings | a `Select` → 2 `Select.OptGroup` ("Open"/"Closed"), each with 2 `Select.Option` | yes |
| `selectoptgroup-disabled` | visually-distinct state — `disabled` | a `Select` → 2 OptGroups, one `disabled:true` (its options dimmed) | yes |

### Prop-coverage map

| adapter prop | covered by |
|---|---|
| `children` | `selectoptgroup` (static). Dynamic-template path covered by `Select`'s `select-children-template`. |
| `label` | `selectoptgroup` (literal headings) |
| `disabled` | `selectoptgroup-disabled` |

---

## Agent section

Omitted. `Select.OptGroup` emits no `event`-shaped `Action` (no `Action` at all), so per the
Orchestration skip rule there is no agent surface to design.
