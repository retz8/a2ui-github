# KeybindingHint

- **Official documentation URL:** https://primer.style/components/keybinding-hint
- **Real prop surface resolved from:** `@primer/react` installed type declarations at
  `node_modules/@primer/react/dist/KeybindingHint/props.d.ts`. `KeybindingHintProps` is a
  **closed interface** — no HTML-attribute spread, no polymorphic `as`, no `children`, no
  event handlers, no `aria-*` surface; the component handles accessibility internally
  (renders a `<kbd>` element, inserts visually-hidden "then" sequence separators, expands
  key names for screen readers). Real props: `keys` (`string`, required), `format`
  (`'condensed' | 'full'`, implementation default `"condensed"`), `variant`
  (`'normal' | 'onEmphasis' | 'onPrimary'`, implementation default `"normal"`), `size`
  (`'small' | 'normal'`, implementation default `"normal"`), `className`. The module's
  `getAccessibleKeybindingHintString` and `PlatformOverrideProvider` exports are
  utilities, not props — out of scope.
- **Component-level description (→ `catalog.json` `description`):** A styled hint
  indicating an available keyboard shortcut, displaying the keys to press.

---

## Adapter section

### Prop-surface table

| prop | decision | synthetic? | A2UI type | description |
|---|---|---|---|---|
| `keys` | carry (required) | no | `DynamicString` | The keybinding to display: full key names, `+` joins keys into a chord (`"Mod+k"`), a space joins chords into a sequence (`"a b"`); `"Mod"` means the platform's primary modifier. |
| `format` | carry | no | `z.enum(['condensed','full']) (default: "condensed")` | Display format: `condensed` shows compact symbols for menus and tooltips; `full` spells keys out for prose. |
| `variant` | carry | no | `z.enum(['normal','onEmphasis','onPrimary']) (default: "normal")` | Color treatment matching the surface behind the hint: `onEmphasis` for emphasis-colored backgrounds, `onPrimary` for primary buttons. |
| `size` | carry | no | `z.enum(['small','normal']) (default: "normal")` | Size of the hint. |
| `className` | drop | — | — | — |

`keys` is the content channel — there is no `children`, so no synthetic content prop is
introduced; it is typed `DynamicString` so the content channel stays bindable. No
`accessibility` carry: the interface exposes no `aria-*` surface and the component is
self-labeling (per-component fidelity). No `Action`.

### Functions

None. KeybindingHint is a pure display leaf — no `Action`, no local function.

### Dropped / deferred props

| prop | reason |
|---|---|
| `className` | Styling passthrough; no A2UI representation. |

---

## Client section

### Fixture table

| fixture | exercises (coverage axis) | component state / canned values | baselined? |
|---|---|---|---|
| `keybindinghint` | content — literal | `keys: "Mod+k"`, all else default | yes |
| `keybindinghint-bound` | content — bound (proves path binding) | `keys: {path: "/keys"}`; data model `{keys: "Control+Shift+p"}` | yes |
| `keybindinghint-formats` | visual enum — `format` | one surface per `['condensed','full']`; each `keys: "Mod+Shift+k"` (modifier-heavy chord so the spelled-out form visibly diverges) | yes (one PNG) |
| `keybindinghint-variants` | visual enum — `variant` | one surface per `['normal','onEmphasis','onPrimary']`; each `keys: "Mod+k"` | yes (one PNG) |
| `keybindinghint-sizes` | visual enum — `size` | one surface per `['small','normal']`; each `keys: "Mod+k"` | yes (one PNG) |

`onEmphasis`/`onPrimary` are designed for colored backgrounds; the fixture harness
renders on the default surface, so those gallery rows render low-contrast in the
baseline. No in-catalog container exists to supply a matching background, so the gallery
on the default background is the deterministic pixel record of each value.

### Prop-coverage map

| adapter prop | covered by |
|---|---|
| `keys` | `keybindinghint` (literal) + `keybindinghint-bound` (bound) |
| `format` | `keybindinghint-formats` |
| `variant` | `keybindinghint-variants` |
| `size` | `keybindinghint-sizes` |

---

## Agent section

Omitted. KeybindingHint emits no `event`-shaped `Action` (no `Action` at all — it is a
pure display leaf), so per the Orchestration skip rule there is no agent surface to
design.
