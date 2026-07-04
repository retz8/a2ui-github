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
carried or explicitly dropped.

### Prop-surface decision checklist

Walk every real prop found above (plus any synthetic prop introduced below) and make
one decision per prop:

- **Carry / drop / defer.**
  - **Drop** props with no A2UI representation. In particular, the non-`aria-*` slice
    of an inherited HTML-attribute spread (`type`, `name`, `tabIndex`, `data-*`, and
    similar) has no protocol representation and is dropped.
  - **Defer** props that are not JSON-serializable — most commonly element-typed props
    (a prop typed to accept a rendered element/node) — recording a reason for each.
  - Otherwise **carry** the prop into the schema. Record required-ness in the same
    decision cell: `carry (required)` when the prop is required, bare `carry` when it's
    optional. As a heuristic: the synthetic content channel and the primary interaction
    prop are required; a real prop's required-ness otherwise follows its installed type
    unless the design deliberately tightens it.
  - When the component's official documentation specifies a default value for a carried
    prop, record it as an annotation in that row's `A2UI type` cell, e.g.
    `z.enum([...]) (default: "span")`. Only record a default when the doc documents one.

- **Synthetic-content-prop rule.** When a component takes its content through
  `children` as raw content (text, not references to other components), introduce a
  synthetic value prop to carry it — the component stays a true leaf, and the synthetic
  prop is the A2UI-idiomatic content channel. Example: `text` on Text. When a
  component's content is itself a nested component reference rather than raw content,
  the synthetic prop is typed as a `ComponentId` instead of a value — example: `child`
  on Button. A synthetic value prop still gets its A2UI type from the type-selection
  rule below (typically `DynamicString`).

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

### The design call (human gate)

Run the call in three stages — never as one table dump:

1. **Present the real prop list.** Every prop the installed types expose, before any
   A2UI judgment — own props and inherited spreads shown as such — so the human sees
   the full ground truth the decisions are made against.
2. **Present the proposed A2UI prop table.** The checklist applied to every prop. Where
   a checklist rule decides cleanly, state the decision explicitly. Mark every row whose
   decision is *not* clear-cut as **`not sure`** — typical cases: bound-state-vs-config
   borderlines, tightening an optional prop to required, defer-vs-carry edges, a
   questionable synthetic prop.
3. **Resolve the `not sure` props one by one with the human.** For each, in turn: state
   the prop's semantics, the plausible options, and the tradeoff — then the human
   decides and the row is filled. Do not batch them into a single question.

Only after every row is decided does the human lock the table and the doc get written.

### Decision-doc format

The component decision doc is one markdown file per component with:

- **A component-level header**: the component name, its official documentation URL,
  a reference to its resolved type (where the real prop surface was resolved from), and
  a de-branded component-level description (becomes the `catalog.json` entry's
  `description`).
- **One section per surface.** This step's output is the **adapter section**,
  consisting of:
  - A **prop-surface table** with columns `prop | decision | synthetic? | A2UI type | description`,
    where `decision` is one of carry/drop/defer. Required-ness and defaults stay in-cell
    annotations as decided in the checklist (`carry (required)`; `(default: "span")` in
    the `A2UI type` cell) — no extra columns.
  - A **functions list** — name, args, returnType, a de-branded function-level
    description, and a de-branded description per arg — for each local function the
    component needs (e.g. an effect invoked from an `Action`).
  - A **dropped/deferred props list** — prop, reason — for every prop dropped or
    deferred above. A categorical drop (e.g. the non-`aria-*` slice of an inherited
    HTML-attribute spread) may be recorded as one grouped row rather than one row per
    attribute.

#### Example (modelled on Button; teaching-sized, not the full component)

Component-level description: An interactive button that triggers an action when clicked.

| prop | decision | synthetic? | A2UI type | description |
|---|---|---|---|---|
| `child` | carry (required) | yes | `ComponentId` | The component used as the button's label. |
| `action` | carry (required) | no | `Action` | The action performed when the button is clicked. |
| `variant` | carry | no | `z.enum(['default','primary','invisible','danger','link']) (default: "default")` | The visual style; `primary` marks the main call-to-action. |
| `disabled` | carry | no | `DynamicBoolean` | Whether the button is disabled and cannot be clicked. |
| `accessibility` | carry | no | `AccessibilityAttributes` | Accessibility label/description for assistive technologies. |
| `icon` | defer | — | — | — |

Functions:

| name | args | returnType | description |
|---|---|---|---|
| `consoleLog` | `message: string` (The message to log.) | `void` | Logs a message to the browser console. A local client-side effect. |

Dropped/deferred props:

| prop | reason |
|---|---|
| `icon` | Element-typed; not JSON-serializable. Carry as a `ComponentId` child once an Icon component exists. |
| `type`, `name`, `tabIndex`, `data-*`, and the rest of the non-`aria-*` `ButtonHTMLAttributes` spread | Dropped: no A2UI representation. |

### Append-convention

There is one shared decision doc per component, at the project's component-decision
location, and one section per surface within it. Later surfaces (client, agent) append
their own sections to the same doc as their design steps run — they never restructure
or rewrite an existing section.

### Doc quality bar

The doc is well-structured markdown, read by a human and by the Build LLM — nothing
parses it programmatically. The bar is **completeness and unambiguity**: it must contain
everything an autonomous Build run needs, so that run requires no human in the loop.

## Client section

This step produces the **client section** of the same component decision doc, appended
after the adapter section. Its fixture set is derived from the locked adapter
prop-surface table — the client design call cannot start until that table is locked.

### The prop-walk

Walk the locked adapter prop-surface table prop-by-prop; for each **carried** prop,
accumulate the scenario(s) it introduces into the fixture set, per this mapping:

| Prop kind (from the adapter table) | Scenario(s) it introduces |
|---|---|
| content-bearing `Dynamic*` (a synthetic value prop) | a **literal** fixture + a **bound** fixture (proves path binding) |
| `Action` | one fixture **per action shape** it accepts (`functionCall`, `event`) |
| a **visually-distinct** enum | a **gallery** fixture — one surface per enum value |
| a **visually-distinct** `Dynamic*`/config prop (e.g. `disabled`, `loading`, `block`, `count`) | a fixture with that state **set** |
| a **child/slot** `ComponentId` prop (e.g. Button's `child`) | **no fixture of its own** — exercised as the content of every fixture of its parent |
| a **non-visual** prop (e.g. `accessibility`, `loadingAnnouncement`) | **no fixture** — a render-test assertion instead |

**Single-axis by default:** each fixture isolates one prop's scenario, all other props at
defaults; combine props into one fixture only when semantically coupled (e.g. `loading`
+ `loadingAnnouncement`).

**Exhaustiveness:** the deduped union of these scenarios is the fixture set. Every
carried prop must appear in the coverage map (format below) — a visual prop via a
baselined fixture, a non-visual prop via a render-test assertion.

### The design call (human gate)

The client design call runs through the same three-stage human gate defined above
(present the derived surface → propose, marking unclear rows `not sure` → resolve, then
lock) — the mechanics are not repeated here. The fixture-set brainstorm from the
prop-walk is the core of this call's proposal stage; the genuine `not sure` residue is
thin — mainly the **visual-vs-non-visual** classification of a prop and
**semantic-coupling** calls.

### Client-section format

Continuing the same decision doc, the client section consists of:

- A **fixture table** with columns
  `fixture | exercises (coverage axis) | component state / canned values | baselined?`.
  Canned values live in-cell: literal strings; bound fixtures as `{path}` plus the
  data-model value that resolves it; events as `{name, context}`; enum values spelled
  out. A gallery is one row noting "one surface per enum value."
- A **prop-coverage map** with columns `adapter prop | covered by` — every carried
  adapter-table prop maps to the fixture(s) that exercise it, or to `render-test
  assertion` for a non-visual prop. This map is the completeness contract: a missing row
  means the fixture set is incomplete.

As with the adapter section, the client section is appended to the same decision doc and
never restructures the adapter section already there (per the append-convention above).

#### Example (modelled on Button + Text; teaching-sized, not every prop)

Fixture table (Button):

| fixture | exercises | component state / canned values | baselined? |
|---|---|---|---|
| `button-fn` | interaction — functionCall path | `child`→`label` ("Run local function"); `variant: primary`; `action: functionCall consoleLog {message: "button-fn clicked"}` | yes |
| `button-event` | interaction — event path | `child`→`label` ("Send event"); `variant: primary`; `action: event {name: "submit", context: {}}` | yes |
| `button-variants` | visual enum — `variant` | one surface per `['default','primary','invisible','danger','link']`; each `child`→`label` (the variant name); `action: functionCall consoleLog {message: <variant>}` | yes (one PNG) |
| `button-disabled` | visually-distinct state — `disabled` | `child`→`label` ("Disabled"); `disabled: true`; `action: event {name: "noop", context: {}}` | yes |

Prop-coverage map (Button):

| adapter prop | covered by |
|---|---|
| `child` | every button fixture (the label) |
| `action` | `button-fn` (functionCall) + `button-event` (event) |
| `variant` | `button-variants` |
| `disabled` | `button-disabled` |
| `accessibility` | render-test assertion (non-visual) |

The shipped repo predates this exhaustive standard, so `button-disabled` above is an
example of a fixture the prop-walk *would* generate that the current repo does not yet
carry (backfill deferred).

Text's content axis, in the same format: `text` (literal, `text: "Hello from Primer"`)
and `text-bound` (bound, `text: {path: "/greeting"}` + data model
`{greeting: "Bound hello"}`) — demonstrating the content-channel rule (literal + bound).

## Agent section

This step produces the **agent section** of the same component decision doc, appended
after the client section. Its response set is derived from the locked adapter
prop-surface table — specifically, its `event`-shaped `Action` rows, in the order they
appear there.

### The design call

Walk each `event`-shaped `Action` the component emits; for each event name, design the
canned A2UI response the deterministic agent returns. The response is an **invented**
design artifact — "what would a plausible server do in reaction to this event?" — not a
derivation from anything upstream. The component's doc-header official documentation URL
is the plausibility reference: it grounds what a real reaction to the event would
sensibly look like, without dictating one.

**No-agent-surface rule.** The `functionCall` action shape runs locally client-side and
never reaches the agent, so it produces no agent fixture. A component with no
event-shaped action (e.g. Text) gets no agent section at all — the analog of "Text
carries no accessibility."

### Output is response + coupling, one unit

The design call's output per event is the response messages, with concrete canned
values, together with the visibility coupling that renders them.

**The visibility principle.** A response should drive both update mechanisms where the
component supports them — `updateComponents` (a component swap, self-visible) and
`updateDataModel` (a path write, visible only when a rendered prop binds that path) —
and every data-model write must bind to a rendered prop in the paired client event
fixture, else the write is invisible and untestable. Realizing the coupling edits the
paired client event fixture in place (the bound prop + an initial data-model value).

**The design call (human gate).** The agent design call runs through the same
three-stage human gate already defined in this skill (present the derived surface →
propose, marking unclear rows `not sure` → resolve, then lock); the mechanics are not
restated here. Uniquely for this surface, the residue is **thick**: because the response
is invented rather than derived, the proposal itself is the judgment — which data-model
path to write, what confirmation content, which prop to couple — so the human's review is
substantive co-design, not a rubber-stamp.

As with the earlier sections, the agent section is appended to the same decision doc and
never restructures the adapter or client sections already there (per the append-convention
above).

### Agent-section format

Continuing the same decision doc, the agent section consists of one **event-response
table**, one row per event the component emits, with columns
`event | response messages (ordered, with canned values) | visibility coupling (client fixture · bound prop ← path · initial value)`.
Response and coupling live in one table because they are one design unit per event.

**Fallback note:** the unknown-event fallback is infra behavior, not authored per
component, so it gets no row — the way the client section does not re-document
`TestSpace`.

#### Example (teaching-sized, modelled on Button)

| event | response messages | visibility coupling |
|---|---|---|
| `submit` | 1. `updateDataModel {path: '/submitted', value: true}` · 2. `updateComponents [{id: 'label', component: 'Text', text: '✅ Sent — server received submit'}]` (surfaceId echoed — stamped at build, not authored) | `button-event` · `disabled ← /submitted` · initial `/submitted = false` |

The response exercises both mechanisms: the label swap is self-visible; the
`/submitted` write is visible only through the `disabled ← /submitted` coupling, which is
the half that proves two-way data binding on the component itself.
