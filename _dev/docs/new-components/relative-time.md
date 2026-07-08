# RelativeTime

- **Official documentation URL:** https://primer.style/components/relative-time
- **Real prop surface resolved from:** `@primer/react` installed type declarations at
  `node_modules/@primer/react/dist/RelativeTime/RelativeTime.d.ts` (v38.28.0) — a thin React
  wrapper (`@lit-labs/react`) around `@github/relative-time-element` (v5.2.0)'s
  `RelativeTimeElement`; the prop surface follows from the element's writable properties
  (`node_modules/@github/relative-time-element/dist/relative-time-element.d.ts`) plus the
  wrapper's own handling of `date`/`datetime`/`children`/`noTitle`. `format`'s installed type
  includes the deprecated aliases `micro`/`elapsed` alongside the resolved
  `auto`/`relative`/`duration`/`datetime`; `precision` is `Unit` =
  `'year'|'month'|'week'|'day'|'hour'|'minute'|'second'|'millisecond'`.
- **Component-level description (→ `catalog.json` `description`):** Displays a timestamp as
  localized relative time (e.g. "3 days ago"), an elapsed duration, or an absolute localized
  date, depending on format and distance from now. A non-interactive display primitive.

---

## Adapter section

### Prop-surface table

| prop | decision | synthetic? | A2UI type | description |
|---|---|---|---|---|
| `datetime` | carry (required) | no | `DynamicString` | The moment in time to display, as an ISO 8601 datetime string. |
| `format` | carry | no | `z.enum(['auto','relative','duration','datetime']) (default: "auto")` | How to present the time: `auto` switches from relative to an absolute date past the threshold; `relative` is always relative; `duration` shows the elapsed duration; `datetime` shows an absolute localized date. |
| `formatStyle` | carry | no | `z.enum(['long','short','narrow'])` | The verbosity of the formatted output (e.g. "3 days ago" vs "3d"). |
| `tense` | carry | no | `z.enum(['auto','past','future']) (default: "auto")` | Which tense to render relative time in. |
| `precision` | carry | no | `z.enum(['year','month','week','day','hour','minute','second','millisecond']) (default: "second")` | The smallest unit shown when displaying elapsed/duration time. |
| `threshold` | carry | no | `z.string() (default: "P30D")` | ISO 8601 duration beyond which display switches from relative to an absolute date. |
| `prefix` | carry | no | `z.string() (default: "on")` | Text prepended to an absolute date (e.g. "on Jan 1, 2026"). |
| `second` | carry | no | `z.enum(['numeric','2-digit'])` | How the seconds part of an absolute date is rendered. |
| `minute` | carry | no | `z.enum(['numeric','2-digit'])` | How the minutes part of an absolute date is rendered. |
| `hour` | carry | no | `z.enum(['numeric','2-digit'])` | How the hours part of an absolute date is rendered. |
| `weekday` | carry | no | `z.enum(['short','long','narrow'])` | How the weekday part of an absolute date is rendered. |
| `day` | carry | no | `z.enum(['numeric','2-digit'])` | How the day part of an absolute date is rendered. |
| `month` | carry | no | `z.enum(['numeric','2-digit','short','long','narrow']) (default: "numeric")` | How the month part of an absolute date is rendered. |
| `year` | carry | no | `z.enum(['numeric','2-digit'])` | How the year part of an absolute date is rendered. |
| `timeZoneName` | carry | no | `z.enum(['long','short','shortOffset','longOffset','shortGeneric','longGeneric'])` | Whether and how the time-zone name is appended to an absolute date. |
| `noTitle` | carry | no | `z.boolean()` | Suppresses the hover tooltip showing the full formatted date. |

### Functions

None. RelativeTime carries no `Action` and needs no local function.

### Dropped / deferred props

| prop | reason |
|---|---|
| `children` | Dropped: fallback/light-DOM text rendered only until the element formats the date; with `datetime` required, the renderer always formats — no A2UI content channel (the content is computed from `datetime`, so no synthetic prop either). |
| `date` | Dropped: `Date`-object channel, not JSON-serializable and fully redundant with the carried `datetime` string. |
| `format` values `micro`, `elapsed` | Curated out of the carried enum: deprecated aliases (of relative+narrow style and `duration` respectively) — same rationale as excluding deprecated components from the ship set. |
| `onRelativeTimeUpdated` | Dropped: a render-lifecycle notification, not a designed user interaction — no `Action`. |
| `timeZone`, `hourCycle` | Dropped: read-only getters on the element, not settable props. |
| `update()` | Dropped: imperative method, not a prop. |
| `as` | Dropped: swaps the underlying custom element — identity-switching, not a display-equivalent selector. |
| `aria-*` slice of the host-element spread | Not carried: display primitive with no author-facing accessibility surface; the element's built-in `title` already carries the full-date affordance — so no `accessibility` / `AccessibilityAttributes` (per-component fidelity). |
| `className`, `style`, `ref`, `data-*`, DOM event handlers, and the rest of the non-`aria-*` host-element spread | Dropped: no A2UI representation. |

---

## Client section

### Canned-value determinism convention

RelativeTime's rendered text is a function of the current clock, so canned values are chosen
so baselines cannot drift:

- **Relative/duration-rendered fixtures** compute `datetime` as a coarse offset from now at
  module load (e.g. now−3 days → renders "3 days ago" at any run time). Offsets are coarse
  (days/months) and never near a unit boundary, so the text cannot tick between runs.
- **Absolute-rendered fixtures** (`format: datetime`, the Intl parts, `prefix`) use a fixed
  ISO string — absolute rendering does not depend on now, so it is stable by nature.
- Fixtures rendering hour/time-zone parts additionally require the Playwright context pinned
  to a fixed time zone: `use.timezoneId: 'UTC'` in `client/playwright.config.ts` (currently
  absent; added by the build).

### Fixture table

| fixture | exercises (coverage axis) | component state / canned values | baselined? |
|---|---|---|---|
| `relative-time` | content channel — literal | `datetime:` computed now−3 days → "3 days ago" | yes |
| `relative-time-bound` | content channel — bound (path binding) | `datetime: {path: "/timestamp"}`; data model `{timestamp:` computed now−3 days`}` | yes |
| `relative-time-formats` | visual enum — `format` | one surface per `['auto','relative','duration','datetime']`; `relative`/`duration` → computed now−3 days; `auto`/`datetime` → fixed `2025-01-01T12:00:00Z` (`auto` is past the default threshold → absolute) | yes (one PNG) |
| `relative-time-format-styles` | visual enum — `formatStyle` | one surface per `['long','short','narrow']`; each `format: "relative"`, computed now−3 days | yes (one PNG) |
| `relative-time-tenses` | visual enum — `tense` | one surface per `['auto','past','future']`; `future` → computed now+3 days, others → computed now−3 days | yes (one PNG) |
| `relative-time-precision` | coupled — `precision` × `format: duration` | `format: "duration"`, `precision: "month"`, computed now−100 days → "3 months" (the default `second` would spill into days/hours/minutes) | yes |
| `relative-time-threshold` | visually-distinct config — `threshold` | `threshold: "P1Y"`, computed now−60 days → stays relative ("2 months ago") where the default `P30D` would flip to absolute | yes |
| `relative-time-prefix` | visually-distinct config — `prefix` | `prefix: "updated"`, `format: "datetime"`, fixed ISO → "updated Jan 1, 2025 …" | yes |
| `relative-time-datetime-parts` | coupled — the 8 Intl part props as one absolute-date shape | `format: "datetime"`, fixed `2025-01-01T12:00:00Z`; `weekday: "long"`, `month: "long"`, `day: "2-digit"`, `year: "numeric"`, `hour: "2-digit"`, `minute: "2-digit"`, `second: "2-digit"`, `timeZoneName: "short"` | yes |

Single-axis otherwise; the two coupled fixtures are the semantic-coupling exceptions:
`precision` is only meaningful under `format: duration`, and the 8 Intl parts jointly compose
one `Intl.DateTimeFormat` date shape (8 separate galleries would be ~25 near-identical
absolute strings, with sub-minute surfaces clock-tick unstable).

### Prop-coverage map

| adapter prop | covered by |
|---|---|
| `datetime` | `relative-time` (literal) + `relative-time-bound` (bound) |
| `format` | `relative-time-formats` |
| `formatStyle` | `relative-time-format-styles` |
| `tense` | `relative-time-tenses` |
| `precision` | `relative-time-precision` |
| `threshold` | `relative-time-threshold` |
| `prefix` | `relative-time-prefix` |
| `second`, `minute`, `hour`, `weekday`, `day`, `month`, `year`, `timeZoneName` | `relative-time-datetime-parts` |
| `noTitle` | render-test assertion (non-visual) — render with `noTitle: true` and assert the `title` attribute is absent, plus its presence by default |

Every carried prop appears in the coverage map.

---

## Agent section

Omitted. RelativeTime emits no `event`-shaped `Action` (it emits no `Action` at all), so per
the Orchestration skip rule ("a component with no event-shaped action gets no agent section")
there is no agent surface to design.
