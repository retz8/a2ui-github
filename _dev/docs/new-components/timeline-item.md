# Timeline.Item

- **Part of the `Timeline` compound family** (6.46) — see `timeline.md` for the family note,
  shared conventions, and the component-level frame.
- **Official documentation URL:** https://primer.style/components/timeline
- **Real prop surface resolved from:** `@primer/react` type declarations at
  `node_modules/@primer/react/dist/Timeline/Timeline.d.ts` (`TimelineItemProps`), reconciled
  against `Timeline.js` (authority on defaults). Code behavior: `condensed` has no default
  (absent → regular padding and a badge background).
- **Component-level description (→ `catalog.json` `description`):** A single entry on the
  timeline — a badge on the connecting line plus its body content, with an optional avatar and
  action controls.

---

## Adapter section

### Prop-surface table

| prop | decision | synthetic? | A2UI type | description |
|---|---|---|---|---|
| `children` | carry (required) | yes | `ChildList` | The entry's badge and body, plus an optional avatar and action controls. |
| `condensed` | carry | no | `z.boolean() (default: false)` | Whether the entry renders with reduced vertical padding and no badge background. |

### Functions

None.

### Dropped/deferred props

| prop | reason |
|---|---|
| `className` | Styling passthrough; no A2UI representation. |
| Non-`aria-*` `li`-attribute spread | Dropped: no A2UI representation. |

---

## Client section

### Fixture table

| fixture | exercises | component state / canned values | baselined? |
|---|---|---|---|
| `timeline-item-condensed` | visually-distinct state — `condensed` | 3 items all `condensed: true`, each `Badge`→`Icon(name: "git-commit")` + `Body`→`Text("This is a message")` (the doc's condensed example) | yes |

The `children` composition axis is covered by the root's `timeline-default` fixture (see
`timeline.md`).

### Prop-coverage map

| adapter prop | covered by |
|---|---|
| `children` | every fixture (badge + body composed in every item) |
| `condensed` | `timeline-item-condensed` |

---

## Agent section

None. `Item` carries no `Action`.
