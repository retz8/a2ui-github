# SegmentedControl.Button

- **Official documentation URL:** https://primer.style/components/segmented-control
- **Real prop surface resolved from:** `@primer/react` installed type declarations at
  `node_modules/@primer/react/dist/SegmentedControl/SegmentedControlButton.d.ts`:
  `SegmentedControlButtonProps = { children: string; selected?: boolean; defaultSelected?: boolean;
  leadingVisual?: FunctionComponent<IconProps> | ReactElement; leadingIcon?: (deprecated alias of
  leadingVisual); disabled?: boolean; count?: number | string } & ButtonHTMLAttributes`. Reconciled
  against `SegmentedControlButton.js`: renders the segment's `children` as its visible label; the
  parent overrides `selected` positionally (see `segmentedcontrol.md`).
- **Component-level description (→ `catalog.json` `description`):** A single text-labeled segment
  within a segmented control.

> The text segment leaf for `SegmentedControl` (see `segmentedcontrol.md`), shipped as a sibling
> leaf in the same 6.32 sub-task. It renders only inside a `SegmentedControl`. Icon slots reference
> the `Icon` leaf (6.2).

---

## Adapter section

### Prop-surface table

| prop | decision | synthetic? | A2UI type | description |
|---|---|---|---|---|
| `label` | carry (required) | yes (← `children`) | `DynamicString` | The visible text label of the segment. |
| `leadingVisual` | carry | no | `ComponentId` | An icon displayed before the label. |
| `count` | carry | no | `DynamicString` | An optional count displayed after the label. |
| `disabled` | carry | no | `DynamicBoolean` | Whether the segment is disabled and cannot be selected. |
| `accessibility` | carry | no | `AccessibilityAttributes` | Accessibility label/description for assistive technologies, beyond the visible label. |

`label` is the synthetic content channel for Primer's raw-text `children` (the Text precedent —
literal or path-bound `DynamicString`), required as the segment's primary content. `leadingVisual` is
an element-typed prop carried as a `ComponentId` child (the `Icon` leaf exists — 6.2 — so no
deferral, matching Button's `icon` backfill). `count` carries its `number | string` union as
`DynamicString` (a display value, per Button's `count` precedent). `accessibility` is carried
optional on the interactive-component basis Button established (the segment's `ButtonHTMLAttributes`
spread genuinely exposes the `aria-*` surface); the visible `label` already supplies the accessible
name, so it is optional.

### Functions

None. `SegmentedControl.Button` carries no `Action` — the change handler lives on the parent — and
needs no local function.

### Dropped / deferred props

| prop | reason |
|---|---|
| `selected`, `defaultSelected` | Represented by the parent's `selectedIndex` (selection is centralized on the container; a segment's selected-ness is derived, as the example's `selected={selectedIndex === i}`). |
| `leadingIcon` | Deprecated alias of `leadingVisual`. |
| `className`, `style` | Styling passthroughs; no A2UI representation. |
| non-`aria-*` `ButtonHTMLAttributes` spread (`type`, `name`, `tabIndex`, `data-*`, …) | Dropped: no A2UI representation. |

---

## Client section

Every fixture is parent-wrapped — the segment renders only inside a `SegmentedControl` (the
`Stack.Item` precedent). The `label` **bound** path is already proven by the parent's
`segmentedcontrol-children-template` fixture (same framework binder), so this leaf covers `label`
with literal content only.

### Fixture table

| fixture | exercises (coverage axis) | component state / canned values | baselined? |
|---|---|---|---|
| `segmentedcontrolbutton` | content — `label` literal (+ defaults) | parent `SegmentedControl` (`selectedIndex: 0`) → 3 segments with literal labels (`Preview`/`Raw`/`Blame`) | yes |
| `segmentedcontrolbutton-leadingvisual` | slot — `leadingVisual` (`ComponentId` → `Icon`) | 3 segments, each a `leadingVisual` `Icon` (eye / code / git-commit octicons) before its label | yes |
| `segmentedcontrolbutton-count` | visually-distinct state — `count` | segments with `count` set (a trailing counter) | yes |
| `segmentedcontrolbutton-disabled` | visually-distinct state — `disabled` | one segment `disabled: true` | yes |

### Prop-coverage map

| adapter prop | covered by |
|---|---|
| `label` | `segmentedcontrolbutton` (literal); bound path covered by the parent's `segmentedcontrol-children-template` (same framework binder) |
| `leadingVisual` | `segmentedcontrolbutton-leadingvisual` |
| `count` | `segmentedcontrolbutton-count` |
| `disabled` | `segmentedcontrolbutton-disabled` |
| `accessibility` | render-test assertion (`aria-label` / `aria-description` on the segment) |

---

## Agent section

Omitted. `SegmentedControl.Button` emits no `event`-shaped `Action` (no `Action` at all — the change
handler is the parent's), so per the Orchestration skip rule there is no agent surface to design.
