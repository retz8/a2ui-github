# Stack.Item

- **Official documentation URL:** https://primer.style/components/stack/
- **Real prop surface resolved from:** `@primer/react` installed type declarations at
  `node_modules/@primer/react/dist/Stack/Stack.d.ts`. `StackItem:
  PolymorphicForwardRefComponent<ElementType, StackProps<ElementType>>` (the declared type
  reuses `StackProps`, but the documented and semantically-real surface is `StackItemProps<As>
  = React.PropsWithChildren<{ as?: As; grow?: boolean | ResponsiveValue<boolean>; shrink?:
  boolean | ResponsiveValue<boolean>; className?: string }>`). Implementation defaults (JSDoc,
  corroborated by the flex CSS): `grow = false`, `shrink = true`. `grow`/`shrink` carry the
  same `ResponsiveValue` union as Stack's scale props.
- **Component-level description (→ `catalog.json` `description`):** Wraps a single child within
  a stack to control whether it grows to fill or shrinks to fit the available space.

> This is the per-child sizing wrapper for `Stack` (see `stack.md`), shipped as a sibling leaf
> in the same 6.23 sub-task. It uses the `responsive(inner)` and `ChildList` conventions
> established in `stack.md`.

---

## Adapter section

### Prop-surface table

| prop | decision | synthetic? | A2UI type | description |
|---|---|---|---|---|
| `children` | carry (optional) | yes | `ChildList` | The components wrapped by this item. |
| `grow` | carry | no | `responsive(z.boolean()) (default: false)` | Whether the item expands to fill available space along the stack axis. |
| `shrink` | carry | no | `responsive(z.boolean()) (default: true)` | Whether the item shrinks to fit the available space along the stack axis. |
| `as` | carry | no | `z.enum(['div','span','section','nav','article','aside','header','footer','main','ul','ol','li']) (default: "div")` | The HTML element used to render the item wrapper; `li` is included because a stack item is the natural list element. |

`children` is `carry (optional)`, faithful to Primer. `grow`/`shrink` carry their full
`ResponsiveValue` union via the `responsive()` helper with a plain `z.boolean()` scalar arm —
Primer does not data-bind these, so no `DynamicBoolean` (that would be redesign). The `as` set
is Stack's set plus `li`.

### Functions

None. Stack.Item is a pure layout wrapper — no `Action`, no local function.

### Dropped / deferred props

| prop | reason |
|---|---|
| `className` | Styling passthrough; no A2UI representation. |
| accessibility (`aria-*`) | Not carried: a non-interactive layout wrapper with no author-facing accessibility channel of its own (per-component fidelity). |

---

## Client section

`grow`/`shrink` are flex properties that only manifest inside a `Stack` parent, so every
fixture is a `Stack` containing `Stack.Item`s. Filler children are `Button` leaves.

Inherited conventions (from Stack's client design call): the `ChildList` dynamic-template
binding path is a framework mechanism already proven by Stack's `stack-children-template`, so
Stack.Item covers `children` with static content only. The responsive arm is covered by a
render-test assertion (forwarding) with the visual pattern demoed on Stack's `stack-responsive`
— no separate Stack.Item responsive fixture; multi-viewport baseline infra stays deferred.

### Fixture table

| fixture | exercises (coverage axis) | component state / canned values | baselined? |
|---|---|---|---|
| `stackitem` | content — static child (+ defaults `grow: false`, `shrink: true`) | horizontal `Stack` → 3 `Stack.Item`s, each wrapping a `Button` ("One"/"Two"/"Three"); default sizing | yes |
| `stackitem-grow` | visually-distinct state — `grow` | horizontal `Stack` wider than its content → 3 `Stack.Item`s wrapping `Button`s; the middle item `grow: true` → visibly expands to fill the free space | yes |
| `stackitem-shrink` | visually-distinct state — `shrink` | horizontal `Stack` constrained narrower than natural content → 3 `Stack.Item`s wrapping wide `Button`s; two `shrink: true` (compress) vs one `shrink: false` (keeps size) | yes |

### Prop-coverage map

| adapter prop | covered by |
|---|---|
| `children` | `stackitem` (static child; also wrapped in `-grow`/`-shrink`). Dynamic-template path covered by Stack's `stack-children-template` (same framework binder). |
| `grow` | `stackitem-grow` |
| `shrink` | `stackitem-shrink` |
| `as` | render-test assertion (rendered item element tag per the enum; non-visual) |
| responsive arm (`grow`/`shrink`) | render-test assertion (responsive `data-*` emitted + forwarded); visual pattern demoed on Stack's `stack-responsive` |

---

## Agent section

Omitted. Stack.Item emits no `event`-shaped `Action` (no `Action` at all — it is a pure layout
wrapper), so per the Orchestration skip rule there is no agent surface to design.
