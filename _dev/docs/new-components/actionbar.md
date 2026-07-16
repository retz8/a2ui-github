# ActionBar

- **Official documentation URL:** https://primer.style/components/action-bar
- **Real prop surface resolved from:** `@primer/react` installed type declarations at
  `node_modules/@primer/react/dist/ActionBar/ActionBar.d.ts`:
  `ActionBar: React.FC<React.PropsWithChildren<ActionBarProps>>` where
  `ActionBarProps = { size?: 'small'|'medium'|'large'; children: React.ReactNode; flush?: boolean;
  className?: string; gap?: 'none'|'condensed' } & A11yProps`, and `A11yProps` is the one-of union
  requiring either `aria-label` or `aria-labelledby`. Defaults from the type/JSDoc (code is
  authority): `size = 'medium'`, `flush = false`, `gap = 'condensed'`.
  Reconciliation notes: the official doc lists an `ActionBar.Button` (text button), but the installed
  exports expose only `IconButton`/`Divider`/`Group`/`Menu` — `ActionBar.Button` is doc-ahead-of-code
  and not shipped. **Automatic overflow** (items that don't fit collapse into an overflow menu) is
  Primer-internal measured behavior on the `ActionBar.IconButton` children — it needs no catalog
  overlay infrastructure; the adapter renders the children and Primer handles the collapse.
- **Component-level description (→ `catalog.json` `description`):** A horizontal toolbar of icon
  buttons, optionally separated into groups by dividers; buttons that don't fit the available width
  collapse into an overflow menu.

> This 6.40 sub-task ships the whole ActionBar family as sibling leaves, each with its own decision
> doc: `actionbar-iconbutton.md` (`ActionBar.IconButton`), `actionbar-divider.md`
> (`ActionBar.Divider`), `actionbar-group.md` (`ActionBar.Group`), and `actionbar-menu.md`
> (`ActionBar.Menu`). Those four are the valid `children` of this container. Reuses the `ChildList`
> container-slot convention established by `stack.md` (6.23) / `button-group.md` (6.28); icon slots
> reference the `Icon` leaf (6.2). Same multi-sibling shape as `SegmentedControl` (6.32).

---

## Adapter section

### Prop-surface table

| prop | decision | synthetic? | A2UI type | description |
|---|---|---|---|---|
| `children` | carry (required) | yes | `ChildList` | The buttons, dividers, groups, and menus contained in the toolbar. |
| `size` | carry | no | `z.enum(['small','medium','large']) (default: "medium")` | The size of the toolbar's buttons. |
| `flush` | carry | no | `z.boolean() (default: false)` | Whether the toolbar sits flush with its container's edge, with no outer padding. |
| `gap` | carry | no | `z.enum(['none','condensed']) (default: "condensed")` | The horizontal spacing between items. |
| `accessibility` | carry (required) | no | `AccessibilityAttributes` | Accessible name for the toolbar, required so assistive technologies can identify it. Maps to `aria-label`, or `aria-labelledby` when naming by another element's id. |

`children` is `carry (required)` — faithful to Primer's required `children: React.ReactNode` (an empty
toolbar is not meaningful). Its slot is the protocol common `CommonSchemas.ChildList` (a static array
of component ids, or a `{componentId, path}` dynamic template), rendered via the `buildChild` helper —
the container-slot convention Stack established. `accessibility` is **required** because `A11yProps`
requires one of `aria-label` / `aria-labelledby`; an icon-only toolbar with no visible text must be
labeled (the same treatment `IconButton` (6.29) gave this identical union).

### Functions

None. The container itself emits no `Action` and needs no local function — the interaction lives on
the child `ActionBar.IconButton` / `ActionBar.Menu` leaves.

### Dropped / deferred props

| prop | reason |
|---|---|
| `className` | Styling passthrough; no A2UI representation. |

---

## Client section

Children are `ActionBar.IconButton` + `ActionBar.Divider` leaves (shipped in this same sub-task).
Build note: `ActionBar` items subscribe an `IntersectionObserver` (for overflow measurement), absent
in jsdom — the vitest render tests need a polyfill/mock; Playwright is unaffected.

### Fixture table

| fixture | exercises (coverage axis) | component state / canned children | baselined? |
|---|---|---|---|
| `action-bar` | content — static `ChildList` (defaults: `size: medium`, `gap: condensed`, `flush: false`) | `children: ['b1','b2','div1','b3']` → three `ActionBar.IconButton`s split by an `ActionBar.Divider`; each button an `Icon` + `aria-label` + a `functionCall consoleLog` action; bar `accessibility.label: "Formatting"` | yes |
| `action-bar-children-template` | content — dynamic template (bound) | `children: {componentId:'tpl', path:'/actions'}`; `tpl` = an `ActionBar.IconButton` with a static `Icon` and `aria-label` bound `{path:'./label'}`; data model `/actions = [{label:'Bold'},{label:'Italic'},{label:'Underline'}]` | yes |
| `action-bar-sizes` | visual enum — `size` | one bar (3 icon buttons) per `['small','medium','large']` | yes (one PNG) |
| `action-bar-gap` | visual enum — `gap` | one bar per `['none','condensed']` | yes (one PNG) |
| `action-bar-flush` | visual state — `flush` | `flush: true` (bar sits flush with the container edge) | yes |
| `action-bar-overflow` | signature behavior — automatic overflow (emergent, not a carried prop) | ~8 `ActionBar.IconButton`s in a fixed narrow (~120px) container → the surplus collapse into a "…" overflow button | yes (collapsed state) |

### Prop-coverage map

| adapter prop | covered by |
|---|---|
| `children` | `action-bar` (static array) + `action-bar-children-template` (dynamic template) |
| `size` | `action-bar-sizes` |
| `gap` | `action-bar-gap` |
| `flush` | `action-bar-flush` |
| `accessibility` | render-test assertion (`aria-label` / `aria-labelledby` forwarded; non-visual) |
| — (overflow behavior) | `action-bar-overflow` — emergent, not a prop; noted for completeness |
