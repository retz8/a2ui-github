# Popover

- **Official documentation URL:** https://primer.style/components/popover
- **Real prop surface resolved from:** `@primer/react` type declarations at
  `node_modules/@primer/react/dist/Popover/Popover.d.ts` (`PopoverProps`,
  `PopoverContentProps`), reconciled against the implementation at `Popover.js` (authority on
  defaults). Code defaults: root `caret = "top"`, `open`/`relative` falsy; Content
  `width = "small"`, `height = "fit-content"`, `overflow = "auto"`.
- **Component-level description (→ `catalog.json` `description`):** A floating content container
  anchored near a related element, used to bring attention to it with brief contextual content.

> `Popover` ships as a **compound family** (6.56), mirroring the component library one-to-one:
> the root plus its content box are each shipped as a sibling catalog leaf in this same
> sub-task, each with its own decision doc:
>
> - `popover-content.md` (`Popover.Content`)
>
> Catalog schema names are PascalCase-concatenated: `Popover`, `PopoverContent`.

## Rendering & composition

- **Positioned container — no new infra (simpler than `Dialog`).** Popover does **not** portal
  and has no backdrop, focus trap, Escape handling, or body-scroll lock. It renders as a
  positioned `<div>` — `position: absolute` over the layout by default, in-flow when `relative`
  — whose visuals are driven by `data-open` / `data-relative` / `data-caret` attributes. It
  renders straight through the normal adapter→renderer path with nothing extra to build.
- **Composition.** The root wraps a single `Popover.Content`; `Popover.Content` wraps arbitrary
  content leaves (`Heading` / `Text` / `Button` / …). Both children slots are the permissive
  `ChildList`, carried as the synthetic content channel and tightened to **required** (unlike
  `Dialog`, neither leaf has any other content channel — an empty popover renders nothing).
- **Fixture visibility.** A popover renders only when `open: true`, and default positioning is
  `absolute` (needs a positioned anchor). To get deterministic, self-contained screenshots the
  baselined fixtures set **`open: true` + `relative: true`** (in-flow, no anchor), with a
  canonical `Heading` + `Text` + `Button` as content.
- **`accessibility` on `Popover.Content` only.** The content box is the region assistive tech
  lands in and may need an accessible name/role; the root is a bare positioning wrapper with no
  independent semantics and carries no `accessibility`.

---

## Adapter section

### Prop-surface table

| prop | decision | synthetic? | A2UI type | description |
|---|---|---|---|---|
| `children` | carry (required) | yes | `ChildList` | The popover's content — typically a single content box. |
| `caret` | carry | no | `z.enum(['top','bottom','left','right','bottom-left','bottom-right','top-left','top-right','left-bottom','left-top','right-bottom','right-top']) (default: "top")` | Where the pointing arrow attaches, indicating the direction of the element the popover is anchored to. |
| `open` | carry | no | `DynamicBoolean` | Whether the popover is currently shown. |
| `relative` | carry | no | `z.boolean() (default: false)` | Whether the popover positions in-flow relative to its parent instead of floating over the layout. |
| `as` | carry | no | `z.enum(['div','section','aside']) (default: "div")` | The HTML element used for the wrapper; the choices are display-equivalent and differ only in semantic/landmark identity. |

Notes:

- `children` is tightened to **required**: the popover's only content channel (see Rendering &
  composition).
- `open` is the controlled visibility state → `DynamicBoolean`, two-way bound like `Dialog`'s
  `open` — the binder auto-generates `setOpen`, so a bound path can be written from the agent to
  show/hide the popover. Absent (unbound) it is pure authoring-time visibility.
- `relative` is fixed authoring-time configuration (a layout-strategy choice, never data-driven)
  → plain `z.boolean()`.

### Functions

None. The root carries no `Action` and needs no local function.

### Dropped / deferred props

| prop | reason |
|---|---|
| `className` / `style` / `id` / `tabIndex` / `data-*` / `ref` and the rest of the non-`aria-*` `HTMLDivElement` spread | Dropped: no A2UI representation (categorical). |

---

## Client section

Every fixture is a composed `Popover` → `Popover.Content` → content tree, with the canonical
content `Heading` (`id: 'popover-heading'`, "Popover") + `Text` (`id: 'popover-message'`,
"Click outside to dismiss") + `Button` (`id: 'popover-action'`). Baselines set `open: true` +
`relative: true` for visibility (see Rendering & composition). This section covers the **root**
props; the `Popover.Content` props are covered by the fixtures in `popover-content.md`.

### Fixture table

| fixture | exercises (coverage axis) | component state / canned values | baselined? |
|---|---|---|---|
| `popover-base` | base — root `children`, default `caret`, `open` literal; Content `children`, default `width`/`height` | `relative: true`; `open: true`; `caret: top`; Content default; canonical content | yes |
| `popover-caret` | `caret` enum | one surface per the 12 caret values; each otherwise = base | yes (one PNG) |
| `popover-open-bound` | `open` — two-way path binding | `open: {path: '/popoverOpen'}` + data model `{popoverOpen: true}`; else base | yes |

Render-test assertions (non-visual):

- **`relative`** — `data-relative` reflects the prop; the `true` case is already baselined in
  `popover-base`, and the default `false` (absolute) case only manifests visually against
  surrounding layout an isolated fixture does not have deterministically.
- **`as`** — the rendered wrapper element matches each enum value (`div` / `section` / `aside`
  render identically, so no baseline).

### Prop-coverage map

| adapter prop | covered by |
|---|---|
| `children` | every fixture (the content box) |
| `caret` | `popover-caret` (`top` default in base) |
| `open` | `popover-base` (literal) + `popover-open-bound` (bound) |
| `relative` | render-test assertion (`true` baselined in base) |
| `as` | render-test assertion (non-visual) |

---

## Agent section

Omitted. The root carries no `Action`, so it emits no event and has no agent surface. The
family's only event, `popover-dismiss`, derives from `Popover.Content`'s `onClickOutside` and
lives in `popover-content.md`.
