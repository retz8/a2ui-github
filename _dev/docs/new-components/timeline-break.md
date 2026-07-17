# Timeline.Break

- **Part of the `Timeline` compound family** (6.46) — see `timeline.md` for the family note,
  shared conventions, and the component-level frame.
- **Official documentation URL:** https://primer.style/components/timeline
- **Real prop surface resolved from:** `@primer/react` type declarations at
  `node_modules/@primer/react/dist/Timeline/Timeline.d.ts` (`TimelineBreakProps`), reconciled
  against `Timeline.js`. Code behavior: renders with `role="presentation"` (list-semantics path,
  `Timeline.js:308`); the doc marks it decorative and not conveyed to assistive technologies.
- **Component-level description (→ `catalog.json` `description`):** A decorative separator
  marking a break between groups of timeline entries.

---

## Adapter section

### Prop-surface table

No carried props — an empty decorative leaf.

### Functions

None.

### Dropped/deferred props

| prop | reason |
|---|---|
| `children` | Not carried: the separator is purely decorative (`role="presentation"`) — content inside it would be hidden from assistive technologies; every documented example uses it empty. |
| `className` | Styling passthrough; no A2UI representation. |
| Non-`aria-*` `li`-attribute spread (`role` already excluded by the type) | Dropped: no A2UI representation. |

---

## Client section

### Fixture table

| fixture | exercises | component state / canned values | baselined? |
|---|---|---|---|
| `timeline-break` | the leaf's rendering between entry groups | 2 items · `Break` · 2 items (the doc's "with a break" shape); each item `Badge`→`Icon(name: "git-commit")` + `Body`→`Text("This is a message")` | yes |

### Prop-coverage map

| adapter prop | covered by |
|---|---|
| — (no props) | `timeline-break` proves the leaf renders |

---

## Agent section

None. `Break` carries no `Action`.
