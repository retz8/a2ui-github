# Icon

- **Official documentation URL:** https://primer.style/foundations/icons
  (prop semantics: the `@primer/octicons-react` README, https://github.com/primer/octicons/tree/main/packages/react)
- **Real prop surface resolved from:** `node_modules/@primer/octicons-react/dist/icons.d.ts`
  (`IconProps = { 'aria-label', className, fill, size, verticalAlign }`; the package exports 379
  named icon components, all of the identical type `Icon = React.FC<IconProps>`). The package's
  `OcticonProps` interface belongs to the deprecated `Octicon` wrapper pattern and is not the
  authoritative surface.
- **Component-level description (→ `catalog.json` `description`):** A vector icon, selected by
  name from a fixed icon set, used to visually communicate meaning, state, or action.

Build notes:

- `Icon` is a synthetic component: no single component of this name exists in the wrapped
  package. The render resolves `name` to the matching named export.
- **Name mapping:** the `name` enum holds the kebab-case form of each export minus its `Icon`
  suffix (`alert` → `AlertIcon`, `git-pull-request` → `GitPullRequestIcon`, `heart-fill` →
  `HeartFillIcon`). The enum is generated from the installed export list
  (`@primer/octicons-react` v19.28.1, 379 entries).
- `@primer/octicons-react` is currently only a transitive dependency; promote it to a declared
  dependency of the adapter package.
- No `event`-shaped action → **no agent section** (skip rule).

---

## Adapter section

### Prop-surface table

| prop | decision | synthetic? | A2UI type | description |
|---|---|---|---|---|
| `name` | carry (required) | yes | `z.enum([...all 379 kebab-case icon names])` | The name of the icon to display, from the icon set. |
| `size` | carry | no | `z.enum(['small','medium','large']) (default: "small")` | The rendered size of the icon. |
| `fill` | carry | no | `z.enum(['default','muted','accent','success','attention','severe','danger','open','closed','done']) (default: "default")` | The icon's semantic color role; `default` inherits the surrounding text color. |
| `accessibility` | carry | no | `AccessibilityAttributes` | Label for assistive technologies; an unlabeled icon is decorative and hidden from them. |

Row notes:

- **`size`** — the installed type is `number | 'small' | 'medium' | 'large'`; the numeric half
  is a deliberate tightening (dropped). The keywords are native to the wrapped component
  (16/32/64 px); the documented default is 16 (= `small`).
- **`fill`** — the installed type is a raw CSS color string; the semantic-role enum is a
  deliberate tightening. The render maps each role to the design system's functional
  foreground-color token (`muted` → `--fgColor-muted`, `success` → `--fgColor-success`, …,
  theme-aware); `default` leaves fill unset so the icon inherits the surrounding text color
  (`currentColor`).
- **`accessibility`** — render maps `label` → `aria-label` (icon exposes `role="img"`); with no
  label the icon renders `aria-hidden`.

### Functions

None — pure display leaf, no local effects.

### Dropped/deferred props

| prop | reason |
|---|---|
| `className` | Named styling passthrough — no A2UI representation. |
| `verticalAlign` | `@deprecated` in the installed types. |

---

## Client section

### Fixture table

| fixture | exercises | component state / canned values | baselined? |
|---|---|---|---|
| `icon-names` | `name` enum — representative sample | one surface per `['alert', 'check', 'git-pull-request', 'rocket', 'x']`; `size`/`fill` at defaults | yes (one PNG) |
| `icon-sizes` | visual enum — `size` | one surface per `['small','medium','large']`; `name: "rocket"`; `fill` default | yes (one PNG) |
| `icon-fills` | visual enum — `fill` | one surface per `['default','muted','accent','success','attention','severe','danger','open','closed','done']`; `name: "heart-fill"`; `size` default | yes (one PNG) |

### Prop-coverage map

| adapter prop | covered by |
|---|---|
| `name` | `icon-names` (5-icon visual sample) + render-test assertion: every one of the 379 enum values resolves to a real icon export (mapping totality) |
| `size` | `icon-sizes` |
| `fill` | `icon-fills` |
| `accessibility` | render-test assertions — labeled icon exposes its label to assistive tech (`role="img"` + label); unlabeled icon is hidden from it (`aria-hidden`) |
