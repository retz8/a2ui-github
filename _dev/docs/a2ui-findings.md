# A2UI catalog-authoring findings

Running notes on friction and principles discovered while translating a real design
system (Primer/React) into an A2UI catalog. These are general — they feed the Phase 3
catalog-writing harness, not just one component. Captured during the Phase 2.1–2.2 grills.

## 1. Content-via-`children` components force a synthetic content prop

Many design-system components take their content through React **`children`**
(`<Text>Hello</Text>`), not a value prop. A2UI `children`/`ChildList` are
**`ComponentId` references to other components**, never raw strings — so "children is
the content" does not translate.

When a component's content is raw text rather than nested components, the catalog must
**introduce a synthetic value prop** to carry it (e.g. `text: DynamicString` on `Text`).
The component stays a true leaf; the synthetic prop is the A2UI-idiomatic content
channel. This is an additive deviation from a strict 1:1 prop translation, forced by the
protocol's composition model.

## 2. `CommonSchemas` covers the protocol surface, not the design-system surface

`@a2ui/web_core/v0_9`'s `CommonSchemas` provides exactly three kinds of primitive:

- **dynamic-value wrappers** — `DynamicString/Number/Boolean/Value/StringList`
  (each a `literal | {path} | {call}` union),
- **structural** — `ComponentId`, `ChildList`, `AnyComponent`,
- **interaction/validation** — `Action`, `FunctionCall`, `CheckRule`, `Checkable`,
  `AccessibilityAttributes`.

It has **no element/tag/`React.ElementType` analog** — element selection is a renderer
concern the protocol has no opinion about. Consequence for authoring:

- **Compose `CommonSchemas`** for the protocol surface (content/binding/actions).
- **Author local `z.enum`s** for design-system styling props (`as`, `size`, `weight`,
  `whiteSpace` on Primer `Text`) — there is no shared primitive to lean on, and they are
  validated/enumerated locally.

## 3. Faithful translation carries the commons a component's real type exposes

Schemas are authored **props-only** as `z.object({...}).strict()` (the binder strips the
envelope fields `component`/`id` itself; `unevaluatedProperties: false` mirrors `.strict()`
in `catalog.json`). What that prop surface *contains* is dictated by the component's
**actual TypeScript type**, not by a uniform catalog-wide base.

The basic catalog spreads a shared base (`accessibility?` + a numeric layout `weight?`)
into *every* component — a basic-catalog choice, not a framework requirement. But omitting
commons **wholesale** (the original 2.1 stance) is equally wrong. The correct rule is
**per-component fidelity** — carry a protocol common exactly when the component's real type
exposes that capability:

- Primer `Button` is typed `… & React.ButtonHTMLAttributes<HTMLButtonElement>`; the
  `aria-*` slice of that spread is genuine accessibility surface, so Button carries
  `accessibility` (composing `CommonSchemas.AccessibilityAttributes`, as a nested
  `accessibility: {label?, description?}` prop — the shape `ComponentCommon` uses upstream).
- Primer `Text` is `PolymorphicProps<As, 'span', {size, weight, whiteSpace}>` with no such
  spread — so `Text` carries **no** `accessibility`.

Consistency across the catalog is therefore per-component fidelity, **not** a uniform base.
`.strict()` / `unevaluatedProperties: false` still enforces "no props beyond the real ones."

**Open consequence (Phase 4):** the protocol's per-child layout `weight` is a number;
Primer's `Text.weight` is a font-weight enum. Under strict translation `weight` means the
*font* weight, so the protocol's *layout* weight has nowhere to live. Revisit when
Row/Column arrive — that is where layout weight first matters.

## 4. zod and `catalog.json` are dual-maintained by hand; no exporter ships

The two representations of a component serve two consumers — the **client** consumes the
runtime **zod** form (render + binder); the **agent/server** consumes the declarative
**`catalog.json`** form.

- `@a2ui/web_core` ships the basic catalog as **two separate hand-maintained artifacts**:
  the zod `basic_catalog` and a static `schemas/catalogs/basic/catalog.json`. Upstream
  dual-maintains by hand.
- **No public catalog→`catalog.json` exporter exists** in `@a2ui/web_core` or
  `@a2ui/react`. The `zod-to-json-schema` dependency is generic/internal, not a
  "produce a valid A2UI catalog" function.
- A correct generator is non-trivial: it must map `CommonSchemas` members to **hosted
  `$ref`s** (not inline-expand the unions), assemble the `$defs` envelope
  (`anyComponent`/`anyFunction`), convert the function format, and respect the
  **wire-vs-resolved arg divergence** (e.g. a function arg is `DynamicString` on the wire
  but the resolved `string` at execute time — a generator can't infer which to emit).

Until that generator exists (the Phase 3 harness), hand-author both forms and guard them
with a **structural parity test** — name-set + required-set + enum-set per component, plus
function name/arg-set — which tolerates the deliberate `$ref`-vs-inline and
wire-vs-resolved differences rather than demanding byte-equality.

## 5. A2UI has no common type for general HTML attributes (protocol gap)

`AccessibilityAttributes` is the **only** slice of a React component's `*HTMLAttributes`
surface that A2UI can represent. Translating a design system built on
`React.ButtonHTMLAttributes<HTMLButtonElement>` (and siblings), only the `aria-*` portion
maps to a protocol common; the rest — `type`, `name`, `value`, `form`, `tabIndex`,
`data-*`, and event handlers (which instead map to `Action`) — has **no A2UI
representation and is dropped**.

This is a protocol gap, not merely an authoring choice: any design-system-native catalog
that faithfully translates HTML-attribute-bearing components will hit it. **Candidate A2UI
OSS contribution:** a general `HtmlAttributes` common type (or an extensible escape hatch)
so these props have a home rather than being silently dropped.
