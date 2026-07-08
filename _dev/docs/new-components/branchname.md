# BranchName

- **Official documentation URL:** https://primer.style/components/branch-name
- **Real prop surface resolved from:** `@primer/react` installed type declarations at
  `node_modules/@primer/react/dist/BranchName/BranchName.d.ts`, following the `PolymorphicProps`
  spread in `node_modules/@primer/react/dist/utils/modern-polymorphic.d.ts`.
  `BranchNameProps<As> = PolymorphicProps<As, 'a', { className?: string }>`, which expands to
  `DistributiveOmit<React.ComponentPropsWithRef<'a'> & { className? }, 'as'> & { as?: As }`.
  Real props: `className`, the polymorphic `as` (default `"a"`), and the full `a` host-element
  spread (`children`, `href`, `target`, `rel`, `download`, `ref`, `style`, `id`, `title`, `role`,
  `tabIndex`, `dir`, `lang`, all `aria-*`, all `data-*`, all DOM event handlers).
- **Component-level description (→ `catalog.json` `description`):** A styled label that displays
  the name of a branch, rendered as a link when it navigates to a destination or as plain text
  when the reference is contextual.

---

## Adapter section

### Prop-surface table

| prop | decision | synthetic? | A2UI type | description |
|---|---|---|---|---|
| `text` | carry (required) | yes | `DynamicString` | The branch name text to display. |
| `href` | carry | no | `DynamicString` | The URL the branch name links to; clicking the label navigates there. |
| `as` | carry | no | `z.enum(['a','span']) (default: "a")` | The HTML element used to render the label: an anchor when the branch name navigates, a plain span when the reference is contextual text. |
| `className` | drop | — | — | — |

### Functions

None. BranchName carries no `Action` (interaction is native link navigation via `href`) and needs
no local function.

### Dropped / deferred props

| prop | reason |
|---|---|
| `className` | Styling passthrough; no A2UI representation. |
| `aria-*` slice of the anchor host-element spread | Not carried: the label is self-labeling — its accessible name is the branch name text itself, with no label-less state — so no `accessibility` / `AccessibilityAttributes` (per-component fidelity). |
| `target`, `rel`, `download`, `ref`, `style`, `id`, `title`, `role`, `tabIndex`, `dir`, `lang`, DOM event handlers, `data-*`, and the rest of the non-`aria-*` anchor spread | Dropped: no A2UI representation. `href` alone is carried from this spread as the designed navigation channel; event handlers are incidental inheritance, so no `Action` is introduced. |

> `children` is not dropped — it is the raw-content channel, superseded by the synthetic `text`
> prop (synthetic-content-prop rule).

---

## Client section

### Fixture table

| fixture | exercises (coverage axis) | component state / canned values | baselined? |
|---|---|---|---|
| `branchname` | content channel — literal (+ documented default link mode) | `text: "main"`; `href: "https://github.com/a2ui-project/a2ui/tree/main"` | yes |
| `branchname-bound` | content channel — bound (path binding) | `text: {path: "/branch"}`; data model `{branch: "feature/login"}` | yes |
| `branchname-as` | visual enum — `as` | one surface per `['a','span']`; each surface's `text` = the tag name | yes (one PNG) |

Single-axis: `href` on the `branchname` fixture is the one semantic coupling (the documented
default mode is a real link, not a dead anchor); no other combination.

### Prop-coverage map

| adapter prop | covered by |
|---|---|
| `text` | `branchname` (literal) + `branchname-bound` (bound) |
| `href` | render-test assertion against the `branchname` fixture (non-visual — `href` presence changes no styling; asserts the rendered anchor carries the `href`) |
| `as` | `branchname-as` |

---

## Agent section

Omitted. BranchName emits no `event`-shaped `Action` (no `Action` at all — interaction is native
link navigation), so per the Orchestration skip rule there is no agent surface to design.
