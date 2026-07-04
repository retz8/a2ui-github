# Design Catalog Component

## Adapter section

This step produces the **adapter section** of the component decision doc, at the
project's component-decision location (this project:
`_dev/docs/new-components/<component-name>.md`).

### Inputs

Two inputs, both required:

1. **The component's official documentation URL** — human-provided. This is the source
   of the documented prop surface and the prose semantics that become the eventual
   `catalog.json` descriptions.
2. **The component's real prop surface** — agent-resolved from its installed type
   declarations.

### Real-prop resolution method

Locate the component's type in the installed package's type declarations and follow
intersections and spreads to enumerate every real prop. Then reconcile that surface
against the official doc: the doc gives the documented surface and its meaning; the
types give the exhaustive surface, including anything the doc omits that must still be
carried or explicitly dropped. Neither source alone is sufficient — the types can expose
props the doc doesn't mention (e.g. an inherited HTML-attribute spread), and the doc
supplies the semantic meaning the types alone don't carry.

### Prop-surface decision checklist

Walk every real prop found above (plus any synthetic prop introduced below) and make
one decision per prop:

- **Carry / drop / defer.**
  - **Drop** props with no A2UI representation. In particular, the non-`aria-*` slice
    of an inherited HTML-attribute spread (`type`, `name`, `tabIndex`, `data-*`, and
    similar) has no protocol representation and is dropped.
  - **Defer** props that are not JSON-serializable — most commonly element-typed props
    (a prop typed to accept a rendered element/node) — recording a reason for each.
  - Otherwise **carry** the prop into the schema.

- **Synthetic-content-prop rule.** When a component takes its content through
  `children` as raw content (text, not references to other components), introduce a
  synthetic value prop to carry it — the component stays a true leaf, and the synthetic
  prop is the A2UI-idiomatic content channel. Example: `text` on Text. When a
  component's content is itself a nested component reference rather than raw content,
  the synthetic prop is typed as a `ComponentId` instead of a value — example: `child`
  on Button. A synthetic value prop still needs an A2UI type, decided by the same
  A2UI-type-selection rule below (a displayed value bound to data is typically
  `DynamicString` — example: `text` on Text).

- **A2UI type selection**, per carried prop:
  - **Bound runtime state** (drives at render time from data or an async operation) →
    the matching `CommonSchemas.Dynamic*` wrapper (`DynamicBoolean`, `DynamicString`,
    etc.).
  - **Fixed authoring-time configuration** (set once, never data-driven) → a plain
    `z.boolean()` / `z.string()` / `z.number()`.
  - **Enums** → a local `z.enum` (there is no `DynamicEnum`), regardless of whether the
    value is otherwise bound or fixed.
  - **Interaction** (a click/press/etc. handler) → `Action`.
  - **A reference to another component as content** → `ComponentId`.
  - **Accessibility** → `AccessibilityAttributes`.

- **Per-component fidelity.** Carry a protocol common only where the component's real
  type exposes that capability — never as a uniform base applied to every component.
  Concretely: Button carries `accessibility` because its real type spreads
  `ButtonHTMLAttributes` (exposing the `aria-*` surface); Text's real type has no such
  spread, so Text carries no `accessibility`. Consistency across the catalog is
  per-component fidelity, not a shared base.

- **De-branded description.** Author each prop's semantic description here — what the
  prop does, in domain terms. Never name the design system or renderer in the
  description; it is read by the generating agent, which has no use for that detail.

Only **spec-navigation** — reading the upstream protocol spec itself — points to the
`a2ui-sdk-design` skill. The conventions above are self-contained here.

### Decision-doc format

The component decision doc is one markdown file per component with:

- **A component-level header**: the component name, its official documentation URL,
  and a reference to its resolved type (where the real prop surface was resolved from).
- **One section per surface.** This step's output is the **adapter section**,
  consisting of:
  - A **prop-surface table** with columns `prop | decision (carry/drop/defer) | synthetic? | A2UI type | description`.
  - A **functions list** — name, args, returnType — for each local function the
    component needs (e.g. an effect invoked from an `Action`).
  - A **deferrals list** — prop, reason — for every prop deferred above.

#### Example (modelled on Button; teaching-sized, not the full component)

| prop | decision | synthetic? | A2UI type | description |
|---|---|---|---|---|
| `child` | carry | yes | `ComponentId` | The component used as the button's label. |
| `action` | carry | no | `Action` | The action performed when the button is clicked. |
| `variant` | carry | no | `z.enum(['default','primary','invisible','danger','link'])` | The visual style; `primary` marks the main call-to-action. |
| `disabled` | carry | no | `DynamicBoolean` | Whether the button is disabled and cannot be clicked. |
| `accessibility` | carry | no | `AccessibilityAttributes` | Accessibility label/description for assistive technologies. |
| `icon` | defer | — | — | Element-typed; not JSON-serializable. Carry as a `ComponentId` child once an Icon component exists. |

Functions:

| name | args | returnType |
|---|---|---|
| `consoleLog` | `message: string` | `void` |

Deferrals:

| prop | reason |
|---|---|
| `icon` | Element-typed; not JSON-serializable. Carry as a `ComponentId` child once an Icon component exists. |

### Append-convention

There is one shared decision doc per component, at the project's component-decision
location, and one section per surface within it. Later surfaces (client, agent) append
their own sections to the same doc as their design steps run — they never restructure
or rewrite an existing section.

### Doc quality bar

The doc is well-structured markdown, read by a human and by the Build LLM — nothing
parses it programmatically. The bar is **completeness and unambiguity**: it must contain
everything an autonomous Build run needs, so that run requires no human in the loop.
