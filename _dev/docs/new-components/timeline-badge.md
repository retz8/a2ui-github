# Timeline.Badge

- **Part of the `Timeline` compound family** (6.46) — see `timeline.md` for the family note,
  shared conventions, and the component-level frame.
- **Official documentation URL:** https://primer.style/components/timeline
- **Real prop surface resolved from:** `@primer/react` type declarations at
  `node_modules/@primer/react/dist/Timeline/Timeline.d.ts` (`TimelineBadgeProps`,
  `TimelineBadgeVariants`), reconciled against `Timeline.js` (authority on defaults). Code
  behavior: `variant` has no default (absent → neutral gray styling).
- **Component-level description (→ `catalog.json` `description`):** The marker on the timeline's
  connecting line for one entry — a small circle holding an icon, colored by variant.

---

## Adapter section

### Prop-surface table

| prop | decision | synthetic? | A2UI type | description |
|---|---|---|---|---|
| `child` | carry (required) | yes (← `children`) | `ComponentId` | The icon shown inside the badge circle. |
| `variant` | carry | no | `z.enum(['accent','success','attention','severe','danger','done','open','closed','sponsors']) (no default — neutral)` | The color variant of the badge. |

Row notes:

- **`child`** — the render places the referenced component into the wrapped component's
  `children` slot; typically an `Icon` leaf.

### Functions

None.

### Dropped/deferred props

| prop | reason |
|---|---|
| `children` | Replaced by the synthetic `child` (`ComponentId`) — the badge circle holds a single visual (per the `TreeView.LeadingVisual` convention). |
| `className` | Styling passthrough; no A2UI representation. |
| Non-`aria-*` `div`-attribute spread | Dropped: no A2UI representation. |

---

## Client section

### Fixture table

| fixture | exercises | component state / canned values | baselined? |
|---|---|---|---|
| `timeline-badge-variants` | visual enum — `variant` | one item per each of the 9 variants `['accent','success','attention','severe','danger','done','open','closed','sponsors']`; each `Badge`→`Icon(name: "git-commit")` + `Body`→`Text(<variant name>)` | yes (one PNG) |

The unset-`variant` (neutral) rendering and the `child` axis are covered by the root's
`timeline-default` fixture (see `timeline.md`).

### Prop-coverage map

| adapter prop | covered by |
|---|---|
| `child` | every fixture (every badge holds an icon) |
| `variant` | `timeline-badge-variants` |

---

## Agent section

None. `Badge` carries no `Action`.
