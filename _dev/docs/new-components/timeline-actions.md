# Timeline.Actions

- **Part of the `Timeline` compound family** (6.46) — see `timeline.md` for the family note,
  shared conventions, and the component-level frame.
- **Official documentation URL:** https://primer.style/components/timeline
- **Real prop surface resolved from:** `@primer/react` type declarations at
  `node_modules/@primer/react/dist/Timeline/Timeline.d.ts` (`TimelineActionsProps`). Documented
  (listed on the doc page) but with no prose or example; the surface is the type plus the
  positioning the implementation applies (`TimelineItemActions` class, `Timeline.js:346–386`).
- **Component-level description (→ `catalog.json` `description`):** Action controls displayed
  with a timeline entry, such as buttons.

---

## Adapter section

### Prop-surface table

| prop | decision | synthetic? | A2UI type | description |
|---|---|---|---|---|
| `children` | carry (required) | yes | `ChildList` | The action controls shown with the entry. |

### Functions

None. `Actions` is a positioned wrapper — interactive content inside it (e.g. a `Button`) brings
its own action surface; the fixture's `Button` uses the already-registered `consoleLog`.

### Dropped/deferred props

| prop | reason |
|---|---|
| `className` | Styling passthrough; no A2UI representation. |
| Non-`aria-*` `div`-attribute spread | Dropped: no A2UI representation. |

---

## Client section

### Fixture table

| fixture | exercises | component state / canned values | baselined? |
|---|---|---|---|
| `timeline-actions` | `children` (composed action controls) | one item: `Badge`→`Icon(name: "git-commit")` + `Body`→`Text("This is a message")` + `Actions`→`Button` (`child`→`Text("Revert")`, `action: functionCall consoleLog {message: "revert clicked"}`) | yes |

### Prop-coverage map

| adapter prop | covered by |
|---|---|
| `children` | `timeline-actions` |

---

## Agent section

None. `Actions` carries no `Action` prop of its own; the composed `Button`'s event surface
belongs to the `Button` leaf.
