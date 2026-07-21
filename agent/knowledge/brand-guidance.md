# Primer brand guidance

Rules for composing A2UI surfaces that read as genuine GitHub (Primer) product UI, not merely
schema-valid trees. Per-component semantics already live in the catalog's own component
descriptions; this doc carries only the **cross-component, brand-level** rules the catalog cannot
state — and only rules that change what you emit. A rule the model would already follow earns no
place here.

Register: imperative. Read each line as an instruction. Explanations appear only where the bare
rule would be ambiguous.

Scope: this doc is fitted to _this_ catalog and the GitHub issue/PR triage-and-compose domain it
serves. It is not a general-purpose Primer distillation, and it deliberately holds no
domain/triage instructions (what a given screen should _say_) — only how to build it in Primer's
visual language.

---

## Composition and layout

- Wrap every surface in a single root container and give it `id: "root"`. Never emit a bare leaf
  (a lone `Text`, `Label`, `Button`) as the surface root.
- Reach for `Stack` as the default container. Use `direction: "vertical"` for a stacked screen and
  `direction: "horizontal"` for a row of peers (a title beside its counter, a set of actions).
- Set spacing with `Stack`'s `gap` token, never by inserting empty spacer components. Use
  `"condensed"` for tightly-related items (an icon and its label), `"normal"` for distinct
  sections.
- Use `PageLayout` (or `SplitPageLayout`) only for a genuine multi-region screen — a header plus
  main content plus a supporting pane. For a single column of content, a `Stack` is correct and a
  page layout is over-structure.
- Put primary content in the content region and secondary metadata (assignees, labels, milestones)
  in the pane, never the reverse. Anchor the pane with `position: "end"` so it sits to the trailing
  side, as GitHub does.
- Lead a screen that represents a page with a `PageHeader`: the title, its state, and its context
  belong there, not improvised from loose `Heading` and `Label` leaves.

## Typography and text

- Use exactly one `Heading` for the surface's primary title. Use additional headings only to label
  genuine subsections, and step their `as` level down (`h1` → `h2` → `h3`) rather than restyling
  size on the same level.
- Render list-item primary labels as `Text`, not `Heading`. Reserve `Heading` for section titles.
- Use `weight: "semibold"` to mark a primary label within a row (an issue title). Do not bold whole
  paragraphs of body text.
- Constrain any single line that can overflow — a branch ref, a long title in a narrow pane — with
  `Truncate`. Do not let free text set the width of a row.
- Render every timestamp with `RelativeTime` bound to an ISO-8601 `datetime`. Never hand-format
  "3 days ago" into a literal `Text` string.

## Status, labels, and metadata

- Show the open/closed/merged/draft state of an issue or PR with `StateLabel`, and match its
  `status` to the real state (`issueOpened`, `pullMerged`, `draft`, …). This is the one badge that
  carries GitHub's state color-and-icon treatment; do not approximate it with a plain `Label`.
- Represent a repository label (the colored issue tags) with `IssueLabelToken`, and set `fillColor`
  to the label's own color so the token reads as that label. A generic `Label` is not a repo label.
- Group multiple repo labels in a `LabelGroup` so they wrap and truncate as a set, rather than
  laying tokens out by hand in a `Stack`.
- Show a quantity that annotates a heading or a tab with `CounterLabel` (e.g. the count beside
  "Issues"), not with parenthesized text baked into a label string.
- Show a group of users compactly with `AvatarStack`; use a single `Avatar` only for one actor.
  Always set a meaningful `alt`.
- Give every `Icon` used as a status or action cue an accessibility label. A decorative icon that
  merely repeats an adjacent text label may omit it, but an icon that carries meaning alone must
  not.

## Actions and interactivity

- Emit at most one `variant: "primary"` button per surface — the single most likely next action
  (Comment, Submit, Merge). Render secondary actions as `default`, and low-emphasis or dismissive
  actions (Cancel) as `invisible`.
- Group related buttons in a `ButtonGroup` so they read as one control cluster, with the primary
  action last (trailing), matching GitHub's dialog and form footers.
- Attach a server `event` action for anything that must reach the agent (opening an item, posting a
  comment, applying a label). Reserve local `functionCall` actions for purely client-side effects
  — clearing a draft field, logging — never for an operation the agent must observe.
- Put the row-level open/navigate action on the `ActionList.Item` (or `NavList.Item`) itself, not
  on a nested button, so the whole row is the target.
- Carry per-item identity in an action's `context` (the issue `number`, the item id). Keep static
  identifiers as literal values; use a `{path}` only when the value must come from the data model.

## Data binding and templating

- Render a list whose length is data-driven as a template: set the container's `children` to
  `{componentId, path}` and author one template component. Do not unroll a known-length list into
  hand-written items when the data comes from a tool.
- Reference item fields from inside a template with **relative** JSON pointers — `{"path": "title"}`,
  no leading slash. Reserve absolute paths (leading slash) for the surface-level data model outside
  a template.
- Seed every bound path with an `updateDataModel` on `"/"` in the same sequence. Never bind a
  component to a path the surface never populates.
- Bind a two-way control (a selectable `ActionList.Item`, a `Checkbox`, a `Textarea` value) to a
  data-model path so the user's change writes back; the click or keystroke updates that path
  automatically. Seed it with a sensible initial value.
- Enable multi-select on a list by setting the container's `selectionVariant: "multiple"` and
  binding each item's `selected`; do not fake selection with swapped icons.

## Forms and input

- Wrap every input in a `FormControl` (or a `CheckboxGroup` / `RadioGroup` for a set) carrying a
  visible `FormControlLabel`. Never emit a naked `TextInput` or `Textarea` with no associated label.
- Use `Textarea` for a comment or description (multi-line free text) and `TextInput` for a short
  single-line value (a name, a search term).
- Mark a required field with `required` on both the `FormControl` and the input, so the label's
  required indicator and the input's own requirement stay consistent.
- State a field's constraints in a `FormControlCaption`, not in placeholder text — the placeholder
  disappears once the user types.
- Do not attach a `checks` validation rule unless the referenced function exists in the catalog's
  function set. Client-side validation functions are added on demand as flows need them, not
  assumed.

## When to use X vs Y

Grounded in the catalog's own component descriptions — the distinctions the schema permits but does
not enforce.

- **`ActionList` vs `NavList`:** use `ActionList` for a list of options or actions that _act on_ the
  current context (triage a row, select PRs). Use `NavList` for navigation _between_ pages/sections,
  where one item is the current location — it renders the active state, `ActionList` does not.
- **`Label` vs `StateLabel` vs `IssueLabelToken`:** `Label` is a generic metadata badge (a category,
  a plain status word). `StateLabel` is specifically the issue/PR open-closed-merged badge with
  state color and icon. `IssueLabelToken` is specifically a repository label, filled with that
  label's color. Match the semantic, not just the look.
- **`Token` vs `IssueLabelToken`:** `IssueLabelToken` is for repo labels (color-filled). `Token` is
  the general removable metadata chip (a selected assignee, a filter). Do not use a plain `Token`
  where a colored repo label is meant.
- **`StackItem` vs `Stack` child:** put a component directly in `Stack.children` by default. Wrap it
  in a `StackItem` only when that one child must `grow` to fill or `shrink` — the wrapper exists for
  that control and nothing else.
- **`Dialog` vs `Popover`:** use a `Dialog` for a focused, blocking task that traps focus (confirm a
  destructive action, a small modal form). Use a `Popover` for brief, non-blocking contextual
  content anchored to an element. Do not put a form the user must complete in a `Popover`.
- **`Button` vs `IconButton` vs `Link`:** a `Button` performs an action and shows a text label; an
  `IconButton` performs an action with an icon alone and _requires_ an accessibility label; a `Link`
  navigates to a URL. Do not use a `Button` to navigate, and do not use a `Link` styled as a button
  to perform a stateful action.
- **`PageLayout` vs `SplitPageLayout`:** use `PageLayout` for a flexible header/content/pane/sidebar
  arrangement. Use `SplitPageLayout` for the fixed full-width-header/footer split with an adjacent
  panel. Prefer `PageLayout` unless the fixed split is specifically wanted.
- **`Timeline` vs `ActionList`:** use a `Timeline` for a chronological sequence of events connected
  on a line (an issue's comment/commit history). Use an `ActionList` for a flat set of selectable or
  actionable rows. A conversation history is a timeline, not a list.
