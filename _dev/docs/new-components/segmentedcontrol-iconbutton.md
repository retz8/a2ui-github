# SegmentedControl.IconButton

- **Official documentation URL:** https://primer.style/components/segmented-control
- **Real prop surface resolved from:** `@primer/react` installed type declarations at
  `node_modules/@primer/react/dist/SegmentedControl/SegmentedControlIconButton.d.ts`:
  `SegmentedControlIconButtonProps = { 'aria-label': string (required); icon:
  FunctionComponent<IconProps> | ReactElement (required); selected?: boolean; defaultSelected?:
  boolean; description?: string; tooltipDirection?: TooltipDirection; disabled?: boolean } &
  ButtonHTMLAttributes`, where `TooltipDirection = 'nw' | 'n' | 'ne' | 'e' | 'se' | 's' | 'sw' | 'w'`.
  Reconciled against `SegmentedControlIconButton.js`: an icon-only segment; the parent overrides
  `selected` positionally (see `segmentedcontrol.md`).
- **Component-level description (→ `catalog.json` `description`):** A single icon-only segment within
  a segmented control.

> The icon-only segment leaf for `SegmentedControl` (see `segmentedcontrol.md`), shipped as a sibling
> leaf in the same 6.32 sub-task. It renders only inside a `SegmentedControl`. The `icon` slot
> references the `Icon` leaf (6.2).

---

## Adapter section

### Prop-surface table

| prop | decision | synthetic? | A2UI type | description |
|---|---|---|---|---|
| `icon` | carry (required) | no | `ComponentId` | The icon representing the segment. |
| `accessibility` | carry (required) | no | `AccessibilityAttributes` | Accessible label for the icon-only segment; must include a label (it renders no visible text). |
| `description` | carry | no | `DynamicString` | Supplementary text shown in a tooltip in place of the label. |
| `tooltipDirection` | carry | no | `z.enum(['nw','n','ne','e','se','s','sw','w'])` | The direction the tooltip opens relative to the segment. |
| `disabled` | carry | no | `DynamicBoolean` | Whether the segment is disabled and cannot be selected. |

`icon` is an element-typed required prop carried as a `ComponentId` child (the `Icon` leaf exists —
6.2 — so no deferral). Primer's required `aria-label` maps to `accessibility` carried **required**:
the aria-label is an accessibility attribute (not visible content), so it routes to
`accessibility.label`, and requiring the object is the strongest signal the shared
`AccessibilityAttributes` common allows (its `label` field is itself optional, so the description
notes a label must be provided). `description` (the tooltip copy) is user-facing text, carried
`DynamicString` for parity with the other content props. `tooltipDirection` is a curated `z.enum`
over its full documented value set.

### Functions

None. `SegmentedControl.IconButton` carries no `Action` — the change handler lives on the parent —
and needs no local function.

### Dropped / deferred props

| prop | reason |
|---|---|
| `selected`, `defaultSelected` | Represented by the parent's `selectedIndex` (selection is centralized on the container; a segment's selected-ness is derived). |
| `className` | Styling passthrough; no A2UI representation. |
| non-`aria-*` `ButtonHTMLAttributes` spread (`type`, `name`, `tabIndex`, `data-*`, …) | Dropped: no A2UI representation. |

---

## Client section

Every fixture is parent-wrapped — the segment renders only inside a `SegmentedControl` (the
`Stack.Item` precedent). `description` and `tooltipDirection` govern a tooltip that is
hover/focus-triggered and hidden in a static baseline, so they are non-baselineable statically (the
LabelGroup/AvatarStack precedent for interaction-triggered props) and covered by render-test
assertions.

### Fixture table

| fixture | exercises (coverage axis) | component state / canned values | baselined? |
|---|---|---|---|
| `segmentedcontroliconbutton` | content — `icon` (+ required `accessibility`, defaults) | parent `SegmentedControl` (`selectedIndex: 0`) → 3 icon-only segments (zoom / list / browser octicons), each with an `accessibility.label` | yes |
| `segmentedcontroliconbutton-disabled` | visually-distinct state — `disabled` | one icon segment `disabled: true` | yes |

### Prop-coverage map

| adapter prop | covered by |
|---|---|
| `icon` | every fixture (the segment's content) |
| `accessibility` | render-test assertion (required `aria-label` present on the segment) |
| `description` | render-test assertion (tooltip content wired; hover-triggered, non-baselineable statically) |
| `tooltipDirection` | render-test assertion (direction forwarded; tooltip hover-triggered) |
| `disabled` | `segmentedcontroliconbutton-disabled` |

---

## Agent section

Omitted. `SegmentedControl.IconButton` emits no `event`-shaped `Action` (no `Action` at all — the
change handler is the parent's), so per the Orchestration skip rule there is no agent surface to
design.
