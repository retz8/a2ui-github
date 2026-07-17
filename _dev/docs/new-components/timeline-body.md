# Timeline.Body

- **Part of the `Timeline` compound family** (6.46) — see `timeline.md` for the family note,
  shared conventions, and the component-level frame.
- **Official documentation URL:** https://primer.style/components/timeline
- **Real prop surface resolved from:** `@primer/react` type declarations at
  `node_modules/@primer/react/dist/Timeline/Timeline.d.ts` (`TimelineBodyProps`).
- **Component-level description (→ `catalog.json` `description`):** The message content of a
  timeline entry, shown beside its badge.

---

## Adapter section

### Prop-surface table

| prop | decision | synthetic? | A2UI type | description |
|---|---|---|---|---|
| `children` | carry (required) | yes | `ChildList` | The entry's message content. |

### Functions

None.

### Dropped/deferred props

| prop | reason |
|---|---|
| `className` | Styling passthrough; no A2UI representation. |
| Non-`aria-*` `div`-attribute spread | Dropped: no A2UI representation. |

---

## Client section

### Fixture table

No fixture of its own — `Body` is composed in every fixture of the family; the root's
`timeline-default` (see `timeline.md`) is its baseline.

### Prop-coverage map

| adapter prop | covered by |
|---|---|
| `children` | every fixture (the message content of every item) |

---

## Agent section

None. `Body` carries no `Action`.
