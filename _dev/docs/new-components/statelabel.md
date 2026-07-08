# StateLabel

- **Official documentation URL:** https://primer.style/components/state-label
- **Real prop surface resolved from:** `@primer/react` installed type declarations at
  `node_modules/@primer/react/dist/StateLabel/StateLabel.d.ts`.
  `StateLabelProps = React.HTMLAttributes<HTMLSpanElement> & { size?: 'small'|'medium';
  variant?: 'normal'|'small' (@deprecated — "use size property with value 'small' or 'medium'
  instead"); status: keyof typeof octiconMap (required) }`. Real props: `status` (17-value enum),
  `size`, the deprecated `variant`, and the full span host-element spread (`children`,
  `className`, `style`, `id`, `title`, `role`, `tabIndex`, all `aria-*`, all `data-*`, all DOM
  event handlers). The official doc documents only `variant` + `status` — it lags the installed
  types; the types are authoritative.
- **Component-level description (→ `catalog.json` `description`):** A badge that displays the
  status of an item such as an issue or pull request, with an icon and color treatment matched
  to the state.

---

## Adapter section

### Prop-surface table

| prop | decision | synthetic? | A2UI type | description |
|---|---|---|---|---|
| `text` | carry (required) | yes | `DynamicString` | The status text to display inside the badge. |
| `status` | carry (required) | no | `z.enum(['issueOpened','issueClosed','issueClosedNotPlanned','pullOpened','pullClosed','pullMerged','draft','issueDraft','pullQueued','unavailable','alertOpened','alertFixed','alertDismissed','alertClosed','open','closed','archived'])` | The state to display; selects the badge's icon and color treatment. Covers issue and pull-request states, security-alert states, and generic open/closed/archived. |
| `size` | carry | no | `z.enum(['small','medium']) (default: "medium")` | The badge's size. |
| `variant` | drop | — | — | — |

### Functions

None. StateLabel carries no `Action` (purely display) and needs no local function.

### Dropped / deferred props

| prop | reason |
|---|---|
| `variant` | Deprecated in the installed types in favor of `size` (same sizing axis: `normal` ≡ `medium`); carrying it would teach the agent deprecated API. |
| `className`, `style` | Styling passthrough; no A2UI representation. |
| `aria-*` slice of the span spread | Not carried: the component self-labels — it auto-derives `aria-label` from an internal per-status label map — so there is no label-less state; no `accessibility` / `AccessibilityAttributes` (per-component fidelity). |
| `id`, `title`, `role`, `tabIndex`, `dir`, `lang`, DOM event handlers, `data-*`, and the rest of the non-`aria-*` span spread | Dropped: no A2UI representation. Purely display component; event handlers are incidental inheritance, so no `Action` is introduced. |

> `children` is not dropped — it is the raw-content channel, superseded by the synthetic `text`
> prop (synthetic-content-prop rule).

---

## Client section

### Fixture table

| fixture | exercises (coverage axis) | component state / canned values | baselined? |
|---|---|---|---|
| `statelabel` | content channel — literal | `text: "Open"`; `status: "issueOpened"` | yes |
| `statelabel-bound` | content channel — bound (path binding) | `text: {path: "/state"}`; data model `{state: "Merged"}`; `status: "pullMerged"` | yes |
| `statelabel-status` | visual enum — `status` | one surface per all 17 values; each surface's `text` = the status value name (self-identifying gallery) | yes (one PNG) |
| `statelabel-size` | visual enum — `size` | one surface per `['small','medium']`; each surface's `text` = the size name; `status: "issueOpened"` on both | yes (one PNG) |

Single-axis throughout: the two content fixtures leave `size` at its default; the size gallery
pins `status` to one value; the status gallery leaves `size` at default. `status` is required
with no default, so every fixture sets it — required-ness, not semantic coupling.

### Prop-coverage map

| adapter prop | covered by |
|---|---|
| `text` | `statelabel` (literal) + `statelabel-bound` (bound) |
| `status` | `statelabel-status` |
| `size` | `statelabel-size` |

---

## Agent section

Omitted. StateLabel emits no `event`-shaped `Action` (no `Action` at all — purely display), so
per the Orchestration skip rule there is no agent surface to design.
