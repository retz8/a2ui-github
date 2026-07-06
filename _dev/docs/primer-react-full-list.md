# Primer React — full component list

> **Purpose:** the complete inventory of components in `@primer/react`, for Phase 6 catalog
> selection. This records **what components exist**, not the detail of each. Code is the
> authority; the doc site is cross-referenced only to surface differences.

## Sources

- **Authority (code):** `node_modules/@primer/react` **v38.28.0**, read from its generated
  registry `@primer/react/generated/components.json` (78 entries) and the `.d.ts` export
  barrels. This file is generated from the source, so `status` and `importPath` reflect what
  the code actually ships.
- **Cross-reference (doc):** <https://primer.style/product/components/>.
- **Icons:** `@primer/octicons-react` **v19.28.1** — a **separate package**, 379 `*Icon` React
  components. Primer's own `Octicon` wrapper is deprecated (see reconciliation).

`status` values in the registry: `stable` (none present at this version), `beta`, `alpha`,
`draft`, `deprecated`. Most main-entry components are `alpha` — that is Primer's normal baseline,
not a warning.

---

## Main entry — `@primer/react` (58)

Layout & structure:
- `Stack` [alpha] · subs: `Stack.Item`
- `PageLayout` [alpha] · subs: Header, Content, Pane, Sidebar, Footer
- `SplitPageLayout` [alpha] · subs: Header, Content, Pane, Sidebar, Footer
- `PageHeader` [beta] · subs: TitleArea, LeadingAction, Title, Actions, Breadcrumbs, Description, Navigation, …
- `Header` [alpha] · subs: Header.Item, Header.Link
- `Truncate` [alpha]
- `Portal` [alpha]

Text & content:
- `Heading` [alpha]
- `Text` [alpha]  ← **already in catalog**
- `Link` [alpha]
- `BranchName` [alpha]
- `RelativeTime` [alpha]

Buttons & actions:
- `Button` [alpha]  ← **already in catalog**
- `IconButton` [alpha]
- `ButtonGroup` [alpha]

Labels & status:
- `Label` [alpha]
- `LabelGroup` [alpha]
- `StateLabel` [alpha]
- `CounterLabel` [alpha]
- `Token` [alpha] · subs: `IssueLabelToken`
- `Flash` [alpha]
- `Spinner` [alpha]
- `ProgressBar` [alpha] · subs: ProgressBar.Item

Avatars:
- `Avatar` [alpha]
- `AvatarStack` [alpha]

Lists, tables, nav:
- `ActionList` [beta] · subs: Item, LinkItem, LeadingVisual, TrailingVisual, TrailingAction, Description, Group, GroupHeading, Heading
- `ActionMenu` [beta] · subs: Button, Anchor, Overlay
- `ActionBar` [alpha] · subs: IconButton, Divider, Group, Menu
- `NavList` [alpha] · subs: Item, LeadingVisual, TrailingVisual, SubNav, Group, GroupHeading, Divider, …
- `SubNav` [alpha] · subs: SubNav.Link, SubNav.Links
- `UnderlineNav` [beta] · subs: UnderlineNav.Item
- `Breadcrumbs` [alpha] · subs: Breadcrumbs.Item
- `TreeView` [beta] · subs: Item, LeadingVisual, TrailingVisual, DirectoryIcon, SubTree, ErrorDialog
- `Pagination` [alpha]
- `Timeline` [alpha] · subs: Item, Badge, Body, Break, Actions, Avatar

Forms & inputs:
- `FormControl` [alpha] · subs: Label, Caption, Validation, LeadingVisual
- `TextInput` [alpha] · subs: TextInput.Action
- `Textarea` [alpha]
- `Select` [alpha]
- `Checkbox` [alpha]
- `CheckboxGroup` [alpha] · subs: Label, Caption, Validation
- `Radio` [alpha]
- `RadioGroup` [alpha] · subs: Label, Caption, Validation
- `SegmentedControl` [alpha] · subs: Button, IconButton
- `SelectPanel` [alpha]
- `Autocomplete` [alpha] · subs: Input, Overlay, Menu
- `ToggleSwitch` [alpha]

Overlays & disclosure:
- `Dialog` [alpha] · subs: Body, Buttons, CloseButton, Footer, Header, Title
- `ConfirmationDialog` [alpha]
- `Overlay` [alpha]
- `AnchoredOverlay` [alpha]
- `Popover` [alpha] · subs: Popover.Content
- `Details` [alpha] · subs: Details.Summary
- `Tooltip` (deprecated variant lives here too — see below)

Misc:
- `SkeletonBox` [alpha]
- `CircleBadge` [deprecated] · subs: CircleBadge.Icon
- `TextInputWithTokens` [deprecated]
- `KeybindingHint` [draft]

---

## Experimental entry — `@primer/react/experimental` (12)

- `DataTable` [alpha] · subs: `Table` + Head, Body, Row, Header, Cell, Container, Title, Pagination, SortHeader, …
- `Blankslate` [draft] · subs: Visual, Heading, Description, PrimaryAction, SecondaryAction
- `Card` [draft] · subs: Icon, Image, Heading, Description, Action, Metadata
- `InlineMessage` [alpha]
- `IssueLabel` [alpha]
- `TopicTag` [draft] · subs: TopicTag.Group
- `UnderlinePanels` [draft] · subs: Tab, Panel
- `SkeletonAvatar` [alpha]
- `SkeletonText` [alpha]
- `Hidden` [draft]
- `FeatureFlags` [draft]
- `SelectPanel` [deprecated] (the experimental-entry variant; the main-entry `SelectPanel` is the live one)

---

## Deprecated entry — `@primer/react/deprecated` (7)

- `Octicon` [deprecated]  ← icon rendering; use `@primer/octicons-react` directly instead
- `Dialog` [deprecated] (superseded by main-entry `Dialog`)
- `UnderlineNav` [deprecated] (superseded by main-entry `UnderlineNav` beta)
- `TabNav` [deprecated]
- `Tooltip` [deprecated] (superseded by the `next` variant)
- `Pagehead` [deprecated]
- `FilteredSearch` [deprecated]

---

## Next entry — `@primer/react/next` (1)

- `Tooltip` [beta] — the current Tooltip; the main/deprecated Tooltips are older.

---

## Doc-vs-code reconciliation (trust code)

- **`Box` is gone.** Long-standing Primer knowledge treats `Box` as the core layout primitive,
  but v38 **removed it from the main entry** (confirmed: not in `dist/index.d.ts`). Layout is now
  `Stack` + component-level props. Do **not** plan around `Box`.
- **`Octicon` is deprecated-only.** The main entry does not export `Octicon`. Icons are the
  separate `@primer/octicons-react` package (379 `*Icon` SVG components), imported and rendered
  directly. A catalog "Icon" leaf would wrap an octicon from that package, not Primer's `Octicon`.
- **Versioned duplicates.** `Tooltip`, `Dialog`, `SelectPanel`, and `UnderlineNav` each appear at
  more than one entry/status. The live one is: `Tooltip` → `/next` [beta]; `Dialog` → main [alpha];
  `SelectPanel` → main [alpha]; `UnderlineNav` → main [beta]. The `/deprecated` (and one
  experimental `SelectPanel`) copies are superseded.
- **On code, not on the doc index page:** the doc components index did not surface `Flash`,
  `Header`, `SubNav`, `Portal`, `Hidden`, `FeatureFlags`, `IssueLabel`, `TopicTag`, `Pagehead`,
  `TabNav`, `FilteredSearch`, `Octicon`. Some are deprecated/experimental/internal on the doc side
  but **do ship in code** — code is authority, so they are listed above.
- **Status is not availability.** `alpha` is the baseline for most shipped main-entry components;
  it does not mean unavailable. `deprecated` is the real "avoid" signal.
</content>
