# Pagination

- **Official documentation URL:** https://primer.style/components/pagination
- **Real prop surface resolved from:** `@primer/react` installed type declarations at
  `node_modules/@primer/react/dist/Pagination/Pagination.d.ts` — a **closed** object type
  `PaginationProps` (no `HTMLAttributes` spread in the public surface; extras reach the `<nav>`
  only through `...rest`). No `children`: Pagination **generates its own numbered page links**
  from `pageCount` (`buildPaginationModel` → `buildComponentData`). Each page link is an `<a>`
  carrying **both** `href` (`hrefBuilder(n)`) **and** `onClick` (`onPageChange(e, n)`); the
  onClick wrapper does **not** call `preventDefault`, so href navigation and the JS callback
  both fire unless the consumer preventDefaults inside its handler. Implementation defaults
  (code is authority): `marginPageCount = 1`, `showPages = true`, `surroundingPageCount = 2`,
  `onPageChange = noop`, `hrefBuilder = (n) => "#" + n`. Real props: `pageCount` (required),
  `currentPage` (required), `onPageChange`, `hrefBuilder`, `marginPageCount`, `showPages`
  (`boolean | ResponsiveValue<boolean>`), `surroundingPageCount`, `renderPage`, `className`.
- **Component-level description (→ `catalog.json` `description`):** Navigates a paginated
  collection with numbered page links and previous/next controls.

---

## Adapter section

### Prop-surface table

| prop | decision | synthetic? | A2UI type | description |
|---|---|---|---|---|
| `pageCount` | carry (required) | no | `DynamicNumber` | The total number of pages. |
| `currentPage` | carry (required) | no | `DynamicNumber` | The currently-selected page (1-indexed). Two-way bound: selecting a page writes the new number back to the bound data-model path. |
| `marginPageCount` | carry | no | `z.number() (default: 1)` | How many pages are always shown at the start and end. |
| `showPages` | carry | no | `z.boolean() (default: true)` | Whether numbered page buttons are shown; when off, only the previous and next controls appear. |
| `surroundingPageCount` | carry | no | `z.number() (default: 2)` | How many pages are shown on each side of the current page. |
| `hrefBuilder` | carry | no | `z.string() (default: "#{page}")` | A URL template for each page link; the token `{page}` is replaced with the page number. Provide a real URL to make pages navigable links; the default is an on-surface anchor. |
| `accessibility` | carry | no | `AccessibilityAttributes` | Label for the pagination navigation landmark, distinguishing it when a surface has more than one paginated region. |

### Controlled vs. uncontrolled — one schema, two modes

Primer wires **both** an `href` and an `onClick` onto every page link and never preventDefaults;
the consumer chooses which channel wins. A2UI carries both channels and lets the mode fall out of
whether `currentPage` is **bound** — mirroring Primer, where "controlled" means you wired state and
"uncontrolled" means you didn't:

- **Controlled** — `currentPage` bound to a path (`{path: "/page"}`). The binder emits the
  auto-generated setter (`setCurrentPage`); the render's `onPageChange` calls `preventDefault()` and
  writes the new page to that path. On-surface, no navigation. This is the two-way write-back
  (the Checkbox `checked`/`onChange` precedent), so **`onPageChange` folds into `currentPage`** — no
  separate protocol prop, no `Action`.
- **Uncontrolled** — `currentPage` a literal (`3`) plus a real `hrefBuilder` template. No setter is
  generated, so `onPageChange` is a no-op and the browser follows the templated `href`. Pages are
  real, shareable links.

The `href` is always rendered from the template, so middle-click / copy-link work even in the
controlled mode. Render sketch (build materializes the real version):

```tsx
export const PaginationComponent = createComponentImplementation(
  PaginationApi,
  ({props}) => (
    <PrimerPagination
      pageCount={props.pageCount}
      currentPage={props.currentPage}
      marginPageCount={props.marginPageCount}
      showPages={props.showPages}
      surroundingPageCount={props.surroundingPageCount}
      hrefBuilder={(n) => (props.hrefBuilder ?? '#{page}').replaceAll('{page}', String(n))}
      aria-label={(props.accessibility as {label?: string} | undefined)?.label}
      onPageChange={(e, n) => {
        if (props.setCurrentPage) {
          // controlled: currentPage is bound → intercept, write on-surface
          e.preventDefault();
          props.setCurrentPage(n);
        }
        // uncontrolled: literal currentPage → no setter → let the href navigate
      }}
    />
  ),
);
```

### Functions

None. Pagination carries no `Action` — the page change *is* the two-way write to `currentPage`'s
bound path — and needs no local function.

### Dropped / deferred props

| prop | reason |
|---|---|
| `onPageChange` | Represented by the two-way binding on `currentPage` (the write-back); no separate protocol prop. Deferred: an optional `action` only if a future flow needs page-change-initiated agent round-trips. |
| `renderPage` | Render-prop returning a rendered element per page; a rendering-customization function, not data — no A2UI representation. |
| `className` | Styling passthrough; no A2UI representation. |
| `showPages` `ResponsiveValue<boolean>` arm | Not carried into the projection: the breakpoint-object arm has no authoring-time signal in A2UI; carried as a plain `z.boolean()`. |
| non-`aria-*` `...rest` spread onto the `<nav>` | Dropped: no A2UI representation. |

---

## Client section

### Fixture table

| fixture | exercises (coverage axis) | component state / canned values | baselined? |
|---|---|---|---|
| `pagination` | base — small `pageCount`, no ellipsis, mid current | `pageCount: 5, currentPage: 3` | yes |
| `pagination-large` | `pageCount` — ellipsis at large counts | `pageCount: 15, currentPage: 8` (both ellipses; default margin 1, surrounding 2) | yes |
| `pagination-first` | `currentPage` — Previous disabled at page 1 | `pageCount: 5, currentPage: 1` | yes |
| `pagination-last` | `currentPage` — Next disabled at last page | `pageCount: 5, currentPage: 5` | yes |
| `pagination-no-pages` | `showPages` off — prev/next only | `pageCount: 5, currentPage: 3, showPages: false` | yes |
| `pagination-margin` | `marginPageCount` | `pageCount: 15, currentPage: 8, marginPageCount: 2` | yes |
| `pagination-surrounding` | `surroundingPageCount` | `pageCount: 15, currentPage: 8, surroundingPageCount: 4` | yes |
| `pagination-controlled` | controlled mode — two-way write-back | `pageCount: 5, currentPage: {path: "/page"}`, data model `{page: 2}`; interaction test: click page 4 → `/page` becomes `4`, `aria-current` moves to page 4, no navigation | no — pixels identical to a literal at the same page; behavior proven in the interaction test (Checkbox `-bound` precedent) |

Non-visual render-test assertions (no baselined PNG):

- **`hrefBuilder`** — with `hrefBuilder: "/issues?page={page}"`, the page-3 anchor's `href` is
  `/issues?page=3` (`{page}` token expanded to the page number).
- **Uncontrolled mode** — `currentPage` literal (`3`) + a real `hrefBuilder` → `onPageChange` does
  **not** `preventDefault`; every page anchor carries the real templated `href` (a plain click would
  navigate). Proves the mode switch is driven by whether `currentPage` is bound.
- **`accessibility`** — the `<nav>`'s `aria-label` equals `accessibility.label`.

Single-axis throughout — each fixture isolates one prop against defaults; the large-count fixtures
share `pageCount: 15, currentPage: 8` only as the backdrop that makes `marginPageCount` /
`surroundingPageCount` visible.

### Prop-coverage map

| adapter prop | covered by |
|---|---|
| `pageCount` | `pagination` (small, no ellipsis) + `pagination-large` (ellipsis model) |
| `currentPage` | `pagination-first` + `pagination-last` (visual boundary states) · `pagination-controlled` (bound + two-way write-back) |
| `marginPageCount` | `pagination-margin` |
| `showPages` | `pagination-no-pages` |
| `surroundingPageCount` | `pagination-surrounding` |
| `hrefBuilder` | render-test assertion (template expansion) + uncontrolled-mode render test |
| `accessibility` | render-test assertion (nav `aria-label`) |

---

## Agent section

Omitted. Pagination emits no `event`-shaped `Action` (no `Action` at all — the page change is the
two-way data-model write to `currentPage`), so per the Orchestration skip rule there is no agent
surface to design.
