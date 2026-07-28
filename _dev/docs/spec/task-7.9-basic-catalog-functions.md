# Task 7.9 — Basic-catalog local-function adoption

Adopt the A2UI basic catalog's 14 client-side functions into `primer-a2ui-adapter`, which today
declares 5 hand-rolled functions and none of the basic set. Parent: `_dev/TODO.md` Phase 7;
phase spec `_dev/docs/spec/phase-7-agent.md` (decision 8, local functions).

## Scope

- The 14 functions declared in the official basic `catalog.json`: `required`, `regex`, `length`,
  `numeric`, `email`, `formatString`, `formatNumber`, `formatCurrency`, `formatDate`, `pluralize`,
  `openUrl`, `and`, `or`, `not`.
- Adapter-only. The agent reads the catalog through its schema manager and the SDK injects the full
  catalog schema into the prompt, so the functions reach the model with no agent-side change.
- Runs **before 7.7**. 7.7's fix-levers are the prose artifacts (prompt, examples, brand doc); a
  change to what the agent is allowed to emit must land before beat-by-beat verification starts,
  not during it.
- Worked this session, locally — not delegated.

## Locked decisions

### 1. Own sub-task, positioned before 7.7

The adoption is its own sub-task rather than a step inside 7.7. `formatString` changes the shape of
every surface the agent emits — bound-string composition instead of precomputed whole strings — so
landing it mid-loop would invalidate every prior beat observation. Numbered `7.9` (append-only; no
renumbering of shipped, issue-linked work) and placed in the TODO list immediately above `7.7`,
with the phase order line carrying the sequencing.

### 2. All 14 adopted; the 11 operators deferred

The full declared set is taken, including `formatCurrency`, `email`, `numeric` and `regex`, which
have no obvious beat behind them — the implementations are supplied by `@a2ui/web_core`, so the
marginal cost is one entry each, and cherry-picking means re-litigating the set the first time a
beat wants one.

The 11 operators `web_core` implements but the basic catalog does not declare (`add`, `subtract`,
`multiply`, `divide`, `equals`, `not_equals`, `greater_than`, `less_than`, `contains`,
`starts_with`, `ends_with`) stay out until a flow binds one. They would add prompt surface with no
beat behind them.

### 3. Wrap `web_core`'s implementations; do not re-export them

Each function gets a thin wrapper in the adapter that authors our own zod args schema and delegates
`execute` to the corresponding `@a2ui/web_core` implementation.

The alternative — registering `BASIC_FUNCTIONS` wholesale — was rejected because their schemas are
not compatible with the zod↔`catalog.json` parity test: `length` and `numeric` are `ZodEffects`
rather than `ZodObject`, and `formatString` declares a `returnType` that disagrees with the
published catalog. Accommodating those would mean weakening the parity gate permanently, for all
functions including the existing 5. The parity test's value is that `catalog.json` — the only
contract the agent has — is checked against an independently expressed schema; wrapping preserves
that and gives us control over the arg contract the agent sees.

A drift guard is included: an assertion that our arg-name sets match `BASIC_FUNCTION_APIS`, so an
upstream arg change surfaces as a test failure rather than a runtime mismatch.

### 4. Wrapper fidelity

- **Coercion is kept.** `web_core` applies `z.coerce` deliberately — the catalog invoker parses args
  on every invocation and throws on failure, so coercion is the runtime's tolerance for a model
  emitting a number where a string is declared. A thrown error inside a render is a worse failure
  mode than a silent coercion, and 7.7 is about to generate these args from an LLM at volume.
- **The object-level `.refine()` on `length` and `numeric`** — "must provide either min or max" — is
  not reproduced. Keeping our schemas plain `ZodObject`s is what makes the parity test work; the
  constraint is carried in the `catalog.json` description instead, which is the surface that steers
  the agent.
- **`formatString` declares `returnType: string`**, matching the published basic catalog rather than
  the `any` its implementation carries. `returnType` is a declaration the agent reads, and `any`
  tells the model nothing. Behavior is unchanged.

### 5. Parity test: required-ness derived syntactically

The parity test's required-ness check moves from `isOptional()` to whether the arg schema is a
`ZodOptional`. `isOptional()` is a semantic "accepts undefined" probe that coercion defeats —
`z.coerce.string().isOptional()` is `true` — which would misreport four required args as optional.
The syntactic check cannot be fooled and leaves the existing 5 functions' results unchanged. Applied
to the function branch; the stale "all zod args are required" test title is corrected with it.

### 6. Verification standard

Unit tests and zod↔`catalog.json` parity for all 14, matching the standard the shipped 5 already
set. Beyond that, a small set of targeted client fixtures covering the three *consumption paths*
rather than one per function — the existing incidental-fixture pattern only proves the
action-effect path, and 11 of the 14 are not action-shaped:

- `formatString` rendering and updating through the renderer (its contract requires returning a
  reactive computed stream and interacting with the data context — a unit test against a stub
  context proves none of that, and it touches every bound string).
- a validation function driving validation state.
- `openUrl`, the one function matching the already-proven action-effect shape.

Per-function client fixtures with Playwright baselines were rejected: functions have no visual prop
surface, so a baseline tests the host component's rendering, not the function. The exhaustive
Phase-6 prop-walk standard does not transfer.

### 7. Descriptions authored in our own voice

The `catalog.json` descriptions are written as agent-facing guidance grounded in the v0.9.1 basic
catalog implementation guide's semantics, following the pattern the shipped 5 set — not copied
verbatim from the official catalog. The descriptions are the agent's only instruction on when to
call each function.

## Invariants

- No agent-side change. The adoption is complete when the adapter ships the functions; the model
  receives them through the existing catalog injection.
- The zod↔`catalog.json` parity gate stays strict. No decision in this task may be satisfied by
  loosening it.
