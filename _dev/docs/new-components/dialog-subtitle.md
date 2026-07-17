# Dialog.Subtitle

- **Part of the `Dialog` compound family** (6.52) — see `dialog.md` for the family note, the
  rendering/composition conventions, and the component-level frame.
- **Official documentation URL:** https://primer.style/components/dialog
- **Real prop surface resolved from:** `@primer/react` (v38.28.0) type declarations at
  `node_modules/@primer/react/dist/Dialog/Dialog.d.ts` (`Dialog.Subtitle`), reconciled against
  the implementation at `Dialog.js:291` — renders a fixed `<h2>` spreading its rest props (not
  polymorphic).
- **Component-level description (→ `catalog.json` `description`):** Secondary text rendered
  below the dialog's title inside a custom dialog header.

Composed inside `DialogHeader` (mirrors `PageHeader.Title`: raw text content → synthetic
`text`; the fixed heading element means no `as`).

---

## Adapter section

### Prop-surface table

| prop | decision | synthetic? | A2UI type | description |
|---|---|---|---|---|
| `text` | carry (required) | yes | `DynamicString` | Secondary text shown below the dialog's title. |

### Functions

None. Carries no `Action` and needs no local function.

### Dropped / deferred props

| prop | reason |
|---|---|
| non-`aria-*` heading HTML-attribute spread | Dropped: no A2UI representation (categorical). |
| `className` | Dropped: styling passthrough; no A2UI representation. |

> `children` is not dropped — it is the raw-content channel, superseded by the synthetic `text`
> prop (synthetic-content-prop rule: raw text content → synthetic value prop typed
> `DynamicString`).

---

## Client section

Covered by the family's composed fixture, `dialog-slots` — full canned values in
`dialog-header.md`. `Subtitle` carries the **literal** arm of the family's shared `text`
channel (`text: "Changes apply to all devices"`); the bound arm is proven on the sibling
`DialogTitle` (see `dialog-title.md` for the split rationale).

### Prop-coverage map

| adapter prop | covered by |
|---|---|
| `text` | `dialog-slots` — literal arm (bound arm on `DialogTitle`) |

---

## Agent section

Omitted. Carries no `Action`, so it emits no event and has no agent surface.
