# UnderlineNav.Item

- **Official documentation URL:** https://primer.style/components/underline-nav
- **Real prop surface resolved from:** `@primer/react` installed type declarations at
  `node_modules/@primer/react/dist/UnderlineNav/UnderlineNavItem.d.ts` (v38.28.0):
  `UnderlineNavItemProps = { children?: React.ReactNode; onSelect?: (event) => void;
  'aria-current'?: 'page' | 'step' | 'location' | 'date' | 'time' | 'true' | 'false' | boolean;
  icon? (@deprecated); leadingVisual?: React.ReactElement; as?: React.ElementType | 'a';
  counter?: number | string } & LinkProps` (`LinkProps` = `href`, `download`, `hrefLang`, `media`,
  `ping`, `rel`, `target`, `type`, `referrerPolicy`; polymorphic, default element `'a'`). The doc's
  props table lists only `href` from the `LinkProps` slice.
- **Component-level description (→ `catalog.json` `description`):** A single navigation tab;
  navigates via its link or performs an action when selected, and can mark itself the current page.

> Part of the `UnderlineNav` compound family (6.43) — see `underline-nav.md` for the family
> overview and shared conventions (the `ChildList` root slot, composed-centered coverage).

## Interaction model

Unlike `NavList.Item` (href-only), this item **documents a select handler** — `onSelect`, fired on
both click and keyboard selection — so it carries an optional `Action` (`action ← onSelect`)
alongside its optional `href`. A tab can be a pure link, selection-driven, or both. This makes the
item the family's **sole agent site**.

---

## Adapter section

### Prop-surface table

| prop | decision | synthetic? | A2UI type | description |
|---|---|---|---|---|
| `text` | carry (required) | yes | `DynamicString` | The tab's label. |
| `action` | carry | no | `Action` | The action performed when the tab is selected by click or keyboard. |
| `href` | carry | no | `DynamicString` | The URL the tab navigates to. |
| `aria-current` | carry | no | `z.enum(['page','step','location','date','time','true','false'])` | Marks this tab as the user's current page or location. |
| `leadingVisual` | carry | no | `ComponentId` | A visual rendered before the tab's label, typically an icon. |
| `counter` | carry | no | `DynamicString` | The count displayed in a counter label after the tab's label. |

`aria-current` carries the string tokens (the type's `boolean` collapses to `'true'`/`'false'` —
NavList.Item precedent). `counter` is a display value → `DynamicString` even when usually numeric
(Button `count` precedent).

### Functions

| name | args | returnType | description |
|---|---|---|---|
| `consoleLog` | `message: string` (The message to log.) | `void` | Logs a message. A local client-side effect invoked from the tab's `functionCall` action. Already registered in the catalog — no new registration. |

### Dropped / deferred props

| prop | reason |
|---|---|
| `icon` | Deprecated in the installed types in favor of `leadingVisual` — nothing to carry. |
| `as` | Polymorphic selector that switches the item's identity (anchor vs. router-link) — a behavior switch, not a display-equivalent set. `href` carries the link behavior. |
| `target`, `download`, `hrefLang`, `media`, `ping`, `rel`, `type`, `referrerPolicy` (the `LinkProps` remainder) | Dropped: doc-omitted anchor-attribute passthrough (only `href` is documented); tab navigation is same-view by the component's own contract. |
| `className`, `style`, and the rest of the non-`aria-*` host-element spread | Dropped: no A2UI representation. |

> `children` is not dropped — it is the raw-content channel, superseded by the synthetic `text`
> prop (synthetic-content-prop rule: raw text → synthetic value prop typed `DynamicString`; the
> tab's decorated parts already have dedicated props — `leadingVisual`, `counter`).

---

## Client section

Literal axes (`text`, `href`, `aria-current`, `leadingVisual`, `counter`) are covered by the
composed `underline-nav` baseline; the bound `text`/`href` proof comes via the parent's
`underline-nav-children-template` (same framework binder — Breadcrumbs.Item precedent). The item's
own fixtures isolate the two action shapes. Each renders inside a realistic `UnderlineNav`, never a
bare item.

### Fixture table

| fixture | exercises (coverage axis) | component state / canned values | baselined? |
|---|---|---|---|
| `underline-nav-item-fn` | interaction — `functionCall` path | 2-tab nav (`aria-label: "Repository"`); tab "Run local" with `action: functionCall consoleLog {message: "underline-nav-item clicked"}` | yes |
| `underline-nav-item-event` | interaction — `event` path | 2-tab nav (`aria-label: "Repository"`) — `t1` "Overview" (`href: "#/overview"`); `tab-pulls` "Pull requests" (`counter: {path: '/pullsCount'}`, `href: '#/pulls'`, `action: event {name: 'select', context: {tab: 'pulls'}}`); data model `/pullsCount = "4"`. **No tab carries `aria-current` initially** — the response marks `tab-pulls` current, and the root throws an invariant if two tabs are current at once. | yes |

### Prop-coverage map

| adapter prop | covered by |
|---|---|
| `text` | composed `underline-nav` baseline (literal, every tab) + `underline-nav-children-template` (bound, same framework binder) |
| `action` | `underline-nav-item-fn` (functionCall) + `underline-nav-item-event` (event) |
| `href` | composed `underline-nav` baseline + render-test assertion (anchor `href` attribute) |
| `aria-current` | composed `underline-nav` baseline (`t1` current) + render-test assertion (`aria-current` values) |
| `leadingVisual` | composed `underline-nav` baseline (`t1`–`t3` icons) |
| `counter` | composed `underline-nav` baseline (`t2`/`t3`) + `underline-nav-loading` |

---

## Agent section

`Item`'s `action` accepts the `event` shape, so an agent section applies. One event name is emitted
by the paired client event fixture: `select`. This is the **only agent site in the UnderlineNav
family**.

### Event-response table

| event | response messages (ordered, with canned values) | visibility coupling (client fixture · bound prop ← path · initial value) |
|---|---|---|
| `select` (context `{tab: 'pulls'}`) | 1. `updateDataModel {path: '/pullsCount', value: '5'}` · 2. `updateComponents [{id: 'tab-pulls', component: 'UnderlineNav.Item', text: 'Pull requests', 'aria-current': 'page', counter: {path: '/pullsCount'}, href: '#/pulls', action: (same event)}]` (surfaceId echoed — stamped at runtime, not authored) | `underline-nav-item-event` · `counter ← /pullsCount` · initial `/pullsCount = "4"` |

The response is the plausible server reaction to a tab selection: confirm the selection and refresh
the selected tab's data. The `updateComponents` swap is self-visible — the re-emitted tab gains
`aria-current: 'page'`, so the underline appears on it (the component's signature visual). The
`/pullsCount` write is visible only through the fixture's `counter ← /pullsCount` binding (4 → 5),
the half that proves two-way data binding on the component itself.
