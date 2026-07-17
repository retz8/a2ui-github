# Timeline

- **Official documentation URL:** https://primer.style/components/timeline
- **Real prop surface resolved from:** `@primer/react` installed type declarations at
  `node_modules/@primer/react/dist/Timeline/Timeline.d.ts` (`TimelineProps`), reconciled against
  the implementation at `Timeline.js` (authority on defaults). Code behavior: `clipSidebar` has no
  default (absent → no clipping); `resolveClipSidebar` (`Timeline.js:8–12`) folds `true` → `'both'`
  and passes `'start'`/`'end'` through.
- **Component-level description (→ `catalog.json` `description`):** A vertical list of events
  connected by a line, each entry marked by a badge on the line and carrying its message content.

> `Timeline` ships as a **compound family**, mirroring the component library one-to-one: the root
> plus its subcomponents are each shipped as a sibling catalog leaf in this same 6.46 sub-task,
> each with its own decision doc:
>
> - `timeline-item.md` (`Timeline.Item`) · `timeline-badge.md` (`Timeline.Badge`)
> - `timeline-body.md` (`Timeline.Body`) · `timeline-break.md` (`Timeline.Break`)
> - `timeline-actions.md` (`Timeline.Actions`) · `timeline-avatar.md` (`Timeline.Avatar`)
>
> The root's `children` slot holds the `Item` and `Break` leaves through the permissive
> `ChildList` convention (`stack.md`, `tree-view.md`); `Item`'s `children` holds its `Badge`,
> `Body`, and optional `Avatar`/`Actions` leaves in that same list, exactly as Primer composes
> them. Catalog schema names are PascalCase-concatenated: `Timeline`, `TimelineItem`,
> `TimelineBadge`, `TimelineBody`, `TimelineBreak`, `TimelineActions`, `TimelineAvatar`.

## Conventions established / reused by this family

- **Permissive `ChildList` for containers.** The root, `Item`, `Body`, and `Actions` carry
  `children` as `CommonSchemas.ChildList`.
- **`child: ComponentId` for single-visual wrappers.** `Badge` and `Avatar` carry a synthetic
  `child` (← Primer `children`), per the `TreeView.LeadingVisual` convention — one visual in the
  slot (typically an `Icon` for `Badge`, an `Avatar` for `Avatar`).
- **Pure display family.** No prop anywhere in the family is interaction- or runtime-state-shaped:
  no `Action`, no `Dynamic*`, no local functions, and **no agent section on any leaf** (skip
  rule). Interactive content (e.g. a `Button` inside `Actions`) brings its own action surface.
- **`Break` is an empty decorative leaf** — no props (see `timeline-break.md`).

---

## Adapter section

### Prop-surface table

| prop | decision | synthetic? | A2UI type | description |
|---|---|---|---|---|
| `children` | carry (required) | yes | `ChildList` | The timeline's entries — items and breaks, in display order. |
| `clipSidebar` | carry | no | `z.union([z.boolean(), z.enum(['start','end','both'])]) (no default)` | Which ends of the connecting line are clipped — `true` or `'both'` hides the line above the first and below the last entry; `'start'` or `'end'` clips only that end. |

Row notes:

- **`clipSidebar`** — faithful union, both spellings carried; the implementation folds `true` →
  `'both'` (`Timeline.js:8–12`), so the two render identically.

### Functions

None. The root carries no `Action` and needs no local function.

### Dropped/deferred props

| prop | reason |
|---|---|
| `accessibility` (`aria-*` slice of the `ol` spread) | Not carried: the root is a plain display list — its accessible content is its items; no documented author-facing labelling need (per-component fidelity, as `Text`). |
| `className` | Styling passthrough; no A2UI representation. |
| Non-`aria-*` `ol`-attribute spread (`role` already excluded by the type) | Dropped: no A2UI representation. |

---

## Client section

### Fixture table

| fixture | exercises | component state / canned values | baselined? |
|---|---|---|---|
| `timeline-default` | baseline composition — root/`Item`/`Body` `children`, `Badge` `child` | mirrors the doc default: 3 items, each `Badge`→`Icon(name: "git-commit")` + `Body`→`Text("This is a message")`; root defaults | yes |
| `timeline-clip-sidebar` | root `clipSidebar` | one surface per spelling `[true, 'start', 'end', 'both']` (`true` and `'both'` render identically — both spellings of the carried union are exercised); each 2 items with badge + body | yes (one PNG) |

(Item/badge/body/break/actions/avatar fixtures live in their own leaf docs; `timeline-default` is
the root's baseline and the shared composition backdrop.)

### Prop-coverage map

| adapter prop | covered by |
|---|---|
| `children` | every fixture |
| `clipSidebar` | `timeline-clip-sidebar` |

---

## Agent section

None. The root carries no `Action`, so it emits no event and has no agent section.
