# ActionMenu.Button

- **Part of the `ActionMenu` compound family** (6.39) — see `actionmenu.md` for the family note,
  composition model, and the component-level frame.
- **Official documentation URL:** https://primer.style/components/action-menu
- **Real prop surface resolved from:** `@primer/react` type declarations at
  `node_modules/@primer/react/dist/ActionMenu/ActionMenu.d.ts` — `ActionMenuButtonProps = ButtonProps`
  (documented as "syntactical sugar"), reconciled against the shipped `Button` leaf (`button.md`).
  Identical prop surface to `Button`, **minus `action`**: Primer owns the trigger's click (it toggles
  the menu), so the trigger carries no action of its own.
- **Component-level description (→ `catalog.json` `description`):** The button that opens the menu.

A faithful twin of the `Button` leaf surface with the interaction slot removed — the click is owned
by the parent `ActionMenu`. Same A2UI types as `button.md` for every carried prop.

---

## Adapter section

### Prop-surface table

| prop | decision | synthetic? | A2UI type | description |
|---|---|---|---|---|
| `child` | carry | yes | `ComponentId` | The component used as the button's label. |
| `variant` | carry | no | `z.enum(['default','primary','invisible','danger','link']) (default: "default")` | The visual style; `primary` marks the main call-to-action, `danger` a destructive action, `invisible`/`link` for minimal contexts. |
| `size` | carry | no | `z.enum(['small','medium','large'])` | The button's size. |
| `alignContent` | carry | no | `z.enum(['start','center'])` | How the label is aligned within the button when leading/trailing visuals are present. |
| `disabled` | carry | no | `DynamicBoolean` | Whether the button is disabled and cannot be activated. |
| `loading` | carry | no | `DynamicBoolean` | Whether the button is in a loading state, showing a progress indicator in place of any leading/trailing visual. |
| `inactive` | carry | no | `DynamicBoolean` | Whether the button appears disabled but remains interactive. |
| `count` | carry | no | `DynamicString` | A value shown alongside the label for counter-style buttons. |
| `block` | carry | no | `z.boolean()` | Whether the button expands to fill its container's width. |
| `labelWrap` | carry | no | `z.boolean()` | Whether the label may wrap onto multiple lines when longer than the button width. |
| `loadingAnnouncement` | carry | no | `z.string()` | Text announced to assistive technologies while the button is loading. |
| `icon` | carry | no | `ComponentId` | An icon rendered as the button's sole content, for an icon-only trigger. |
| `leadingVisual` | carry | no | `ComponentId` | A visual rendered before the label. |
| `trailingVisual` | carry | no | `ComponentId` | A visual rendered after the label (e.g. a dropdown caret). |
| `trailingAction` | carry | no | `ComponentId` | A trailing affordance rendered after the label. |
| `accessibility` | carry | no | `AccessibilityAttributes` | Accessibility label/description for assistive technologies. |

### Functions

None. The trigger carries no `Action` and needs no local function.

### Dropped / deferred props

| prop | reason |
|---|---|
| `action` (`onClick`) | Primer owns the trigger's click — it toggles the parent menu — so the trigger has no action of its own. Carrying it would invent a conflicting second click meaning the library does not have. |
| `as`, `href` | Behavioral polymorphism / link-button variant; no representation on this leaf (the `button.md` precedent). |
| `type`, `name`, `tabIndex`, `data-*`, and the rest of the non-`aria-*` `ButtonHTMLAttributes` spread | Dropped: no A2UI representation. |

---

## Agent section

Omitted. `ActionMenu.Button` emits no `event`-shaped `Action` (no `Action` at all — its click is
owned by the parent menu), so per the Orchestration skip rule there is no agent surface to design.

---
