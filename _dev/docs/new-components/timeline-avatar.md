# Timeline.Avatar

- **Part of the `Timeline` compound family** (6.46) — see `timeline.md` for the family note,
  shared conventions, and the component-level frame.
- **Official documentation URL:** https://primer.style/components/timeline
- **Real prop surface resolved from:** `@primer/react` type declarations at
  `node_modules/@primer/react/dist/Timeline/Timeline.d.ts` (`TimelineAvatarProps`). Documented
  (listed on the doc page) but with no prose or example; the surface is the type plus the
  positioning the implementation applies (`TimelineItemAvatar` class, `Timeline.js:387–427` —
  places the avatar beside the entry's badge).
- **Component-level description (→ `catalog.json` `description`):** An avatar shown beside a
  timeline entry's badge, identifying the actor of the event.

---

## Adapter section

### Prop-surface table

| prop | decision | synthetic? | A2UI type | description |
|---|---|---|---|---|
| `child` | carry (required) | yes (← `children`) | `ComponentId` | The avatar shown beside the entry's badge. |

Row notes:

- **`child`** — the render places the referenced component into the wrapped component's
  `children` slot; typically an `Avatar` leaf.

### Functions

None.

### Dropped/deferred props

| prop | reason |
|---|---|
| `children` | Replaced by the synthetic `child` (`ComponentId`) — the wrapper positions a single avatar (per the `TreeView.LeadingVisual` convention). |
| `className` | Styling passthrough; no A2UI representation. |
| Non-`aria-*` `div`-attribute spread | Dropped: no A2UI representation. |

---

## Client section

### Fixture table

| fixture | exercises | component state / canned values | baselined? |
|---|---|---|---|
| `timeline-avatar` | `child` (composed avatar) | one item: `Avatar`→`Avatar` leaf (`src: <data-URI SVG placeholder>` per `avatar.md`'s canned-image convention, `alt: "Octocat"`) + `Badge`→`Icon(name: "git-commit")` + `Body`→`Text("This is a message")` | yes |

### Prop-coverage map

| adapter prop | covered by |
|---|---|
| `child` | `timeline-avatar` |

---

## Agent section

None. `Avatar` carries no `Action`.
