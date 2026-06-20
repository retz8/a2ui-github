# Task 2.3 — Client Test Space + Path-1 + Playwright Baselines — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the client bootstrap page with a canned-fixture test harness that renders the `PRIMER_CATALOG` through the A2UI v0.9 renderer, exercises both action paths (functionCall locally, event via a mocked handler), and locks Primer-rendered visuals with committed Playwright baselines.

**Architecture:** A `TestSpace` page holds a fixture selector (active fixture mirrored in the `?fixture=` URL). Selecting a fixture mounts a fresh `FixtureView`, which builds one `MessageProcessor([PRIMER_CATALOG], actionHandler)`, feeds it the fixture's canned messages, and renders every resulting surface via `A2uiSurface`. `functionCall` actions run locally through the binder/invoker (the registered `consoleLog`); `event` actions are emitted to an injectable `actionHandler` (a dev stub in the app; a `vi.fn()` in tests; the real A2A middleware later in 2.5). vitest covers render + both action paths + the selector; Playwright snapshots each fixture state in chromium.

**Tech Stack:** React 19 + Vite 8, `@a2ui/react/v0_9` + `@a2ui/web_core/v0_9`, `@primer/react`, `primer-a2ui-adapter` (workspace), vitest 4 + `@testing-library/react` + jsdom, `@playwright/test` (chromium).

## Global Constraints

- **Protocol path:** always import v0.9 via the `/v0_9` subpath (`@a2ui/web_core/v0_9`, `@a2ui/react/v0_9`); never the bare (v0.8) entry. Fixture messages use `version: 'v0.9'`.
- **Catalog id:** every fixture's `createSurface.catalogId` is `PRIMER_CATALOG_ID` imported from `primer-a2ui-adapter`.
- **Root component:** each surface's entry component MUST have `id: 'root'` (the renderer renders `id="root"` at base path `/`). Component ids are surface-scoped.
- **Theming:** Primer components render inside `ThemeProvider` + `BaseStyles`, in both the app and the test render helper.
- **Action `oneOf`:** an `Action` is exactly one of `{functionCall: {call, args, returnType}}` or `{event: {name, context?}}`. `functionCall` is local; only `event` reaches the `actionHandler`.
- **Test isolation:** Playwright baselines are chromium-only, generated on macOS (darwin/arm64) and committed; CI visual parity is deferred to Phase 3. `test:e2e` is a separate lane and is NOT part of `test:all`/`verify:all`.
- **Commits:** conventional, `<type>(phase-2): …`.

---

## File Structure

**Create:**
- `client/src/fixtures/types.ts` — `Fixture` interface.
- `client/src/fixtures/text.ts` — literal `Text`.
- `client/src/fixtures/text-bound.ts` — path-bound `Text` + data model.
- `client/src/fixtures/button-fn.ts` — `Button` with a `functionCall` action (path-1).
- `client/src/fixtures/button-event.ts` — `Button` with an `event` action (path-2).
- `client/src/fixtures/button-variants.ts` — five surfaces, one `Button` per variant (visual gallery).
- `client/src/fixtures/index.ts` — `FIXTURES` array + `getFixture`.
- `client/src/test-space/FixtureView.tsx` — processor + surface renderer for one fixture.
- `client/src/test-space/TestSpace.tsx` — selector + URL sync + events panel + `FixtureView`.
- `client/tests/helpers.tsx` — `renderWithPrimer`, `renderFixture`.
- `client/tests/fixtures.test.ts` — structural validity of fixtures.
- `client/tests/render.test.tsx` — Text / bound Text / Button render.
- `client/tests/actions.test.tsx` — path-1 + path-2.
- `client/tests/selector.test.tsx` — selector swap + URL deep-link.
- `client/playwright.config.ts` — chromium visual config.
- `client/e2e/visual.spec.ts` — per-fixture baseline snapshots.

**Modify:**
- `client/src/App.tsx` — render `TestSpace` (replaces bootstrap page).
- `client/src/App.test.tsx` — replace bootstrap smoke with a TestSpace smoke.
- `client/tsconfig.json` — add `"tests"` to `include`.
- `client/vite.config.ts` — exclude `e2e/**` from vitest.
- `client/package.json` — add `@playwright/test` devDep + `test:e2e` script.

---

## Task 1: Fixtures + structural test

Authoring the canned A2UI surfaces and a guard that they are well-formed (right `catalogId`, a `root` component, `version: 'v0.9'`).

**Files:**
- Create: `client/src/fixtures/types.ts`, `text.ts`, `text-bound.ts`, `button-fn.ts`, `button-event.ts`, `button-variants.ts`, `index.ts`
- Modify: `client/tsconfig.json`
- Test: `client/tests/fixtures.test.ts`

**Interfaces:**
- Consumes: `PRIMER_CATALOG_ID` from `primer-a2ui-adapter`; `A2uiMessage` type from `@a2ui/web_core/v0_9`.
- Produces:
  - `interface Fixture { name: string; messages: A2uiMessage[] }`
  - `FIXTURES: Fixture[]` (order: `text`, `text-bound`, `button-fn`, `button-event`, `button-variants`)
  - `getFixture(name: string | null): Fixture` (falls back to `FIXTURES[0]`)
  - named exports: `textFixture`, `textBoundFixture`, `buttonFnFixture`, `buttonEventFixture`, `buttonVariantsFixture`

- [ ] **Step 1: Add `tests` to the client tsconfig include**

Edit `client/tsconfig.json` — change the `include` line:

```json
  "include": ["src", "tests"]
```

- [ ] **Step 2: Write the `Fixture` type**

Create `client/src/fixtures/types.ts`:

```ts
import type {A2uiMessage} from '@a2ui/web_core/v0_9';

export interface Fixture {
  /** Stable id; shown in the selector and used as the ?fixture= URL value. */
  name: string;
  /** Canned A2UI v0.9 messages fed to MessageProcessor.processMessages. */
  messages: A2uiMessage[];
}
```

- [ ] **Step 3: Write the five fixtures**

Create `client/src/fixtures/text.ts`:

```ts
import {PRIMER_CATALOG_ID} from 'primer-a2ui-adapter';
import type {Fixture} from './types';

export const textFixture: Fixture = {
  name: 'text',
  messages: [
    {version: 'v0.9', createSurface: {surfaceId: 'text', catalogId: PRIMER_CATALOG_ID}},
    {
      version: 'v0.9',
      updateComponents: {
        surfaceId: 'text',
        components: [{id: 'root', component: 'Text', text: 'Hello from Primer'}],
      },
    },
  ],
};
```

Create `client/src/fixtures/text-bound.ts`:

```ts
import {PRIMER_CATALOG_ID} from 'primer-a2ui-adapter';
import type {Fixture} from './types';

export const textBoundFixture: Fixture = {
  name: 'text-bound',
  messages: [
    {version: 'v0.9', createSurface: {surfaceId: 'text-bound', catalogId: PRIMER_CATALOG_ID}},
    {
      version: 'v0.9',
      updateComponents: {
        surfaceId: 'text-bound',
        components: [{id: 'root', component: 'Text', text: {path: '/greeting'}}],
      },
    },
    {
      version: 'v0.9',
      updateDataModel: {surfaceId: 'text-bound', path: '/', value: {greeting: 'Bound hello'}},
    },
  ],
};
```

Create `client/src/fixtures/button-fn.ts`:

```ts
import {PRIMER_CATALOG_ID} from 'primer-a2ui-adapter';
import type {Fixture} from './types';

export const buttonFnFixture: Fixture = {
  name: 'button-fn',
  messages: [
    {version: 'v0.9', createSurface: {surfaceId: 'button-fn', catalogId: PRIMER_CATALOG_ID}},
    {
      version: 'v0.9',
      updateComponents: {
        surfaceId: 'button-fn',
        components: [
          {
            id: 'root',
            component: 'Button',
            child: 'label',
            variant: 'primary',
            action: {
              functionCall: {
                call: 'consoleLog',
                args: {message: 'button-fn clicked'},
                returnType: 'void',
              },
            },
          },
          {id: 'label', component: 'Text', text: 'Run local function'},
        ],
      },
    },
  ],
};
```

Create `client/src/fixtures/button-event.ts`:

```ts
import {PRIMER_CATALOG_ID} from 'primer-a2ui-adapter';
import type {Fixture} from './types';

export const buttonEventFixture: Fixture = {
  name: 'button-event',
  messages: [
    {version: 'v0.9', createSurface: {surfaceId: 'button-event', catalogId: PRIMER_CATALOG_ID}},
    {
      version: 'v0.9',
      updateComponents: {
        surfaceId: 'button-event',
        components: [
          {
            id: 'root',
            component: 'Button',
            child: 'label',
            variant: 'primary',
            action: {event: {name: 'submit', context: {}}},
          },
          {id: 'label', component: 'Text', text: 'Send event'},
        ],
      },
    },
  ],
};
```

Create `client/src/fixtures/button-variants.ts`:

```ts
import {PRIMER_CATALOG_ID} from 'primer-a2ui-adapter';
import type {A2uiMessage} from '@a2ui/web_core/v0_9';
import type {Fixture} from './types';

const VARIANTS = ['default', 'primary', 'invisible', 'danger', 'link'] as const;

function variantSurface(variant: string): A2uiMessage[] {
  const surfaceId = `variant-${variant}`;
  return [
    {version: 'v0.9', createSurface: {surfaceId, catalogId: PRIMER_CATALOG_ID}},
    {
      version: 'v0.9',
      updateComponents: {
        surfaceId,
        components: [
          {
            id: 'root',
            component: 'Button',
            child: 'label',
            variant,
            action: {
              functionCall: {call: 'consoleLog', args: {message: variant}, returnType: 'void'},
            },
          },
          {id: 'label', component: 'Text', text: variant},
        ],
      },
    },
  ];
}

export const buttonVariantsFixture: Fixture = {
  name: 'button-variants',
  messages: VARIANTS.flatMap(variantSurface),
};
```

- [ ] **Step 4: Write the fixtures barrel**

Create `client/src/fixtures/index.ts`:

```ts
import {buttonEventFixture} from './button-event';
import {buttonFnFixture} from './button-fn';
import {buttonVariantsFixture} from './button-variants';
import {textBoundFixture} from './text-bound';
import {textFixture} from './text';
import type {Fixture} from './types';

export type {Fixture} from './types';

export const FIXTURES: Fixture[] = [
  textFixture,
  textBoundFixture,
  buttonFnFixture,
  buttonEventFixture,
  buttonVariantsFixture,
];

export function getFixture(name: string | null): Fixture {
  return FIXTURES.find(f => f.name === name) ?? FIXTURES[0];
}
```

- [ ] **Step 5: Write the failing structural test**

Create `client/tests/fixtures.test.ts`:

```ts
import {describe, it, expect} from 'vitest';
import {PRIMER_CATALOG_ID} from 'primer-a2ui-adapter';
import {FIXTURES, getFixture} from '../src/fixtures';

describe('fixtures', () => {
  it('exposes five uniquely-named fixtures', () => {
    expect(FIXTURES).toHaveLength(5);
    const names = FIXTURES.map(f => f.name);
    expect(new Set(names).size).toBe(5);
    expect(names).toEqual(['text', 'text-bound', 'button-fn', 'button-event', 'button-variants']);
  });

  it('every createSurface uses the Primer catalog id and v0.9', () => {
    for (const fixture of FIXTURES) {
      const creates = fixture.messages.filter(m => 'createSurface' in m);
      expect(creates.length).toBeGreaterThan(0);
      for (const m of fixture.messages) {
        expect(m.version).toBe('v0.9');
      }
      for (const m of creates as Array<{createSurface: {catalogId: string}}>) {
        expect(m.createSurface.catalogId).toBe(PRIMER_CATALOG_ID);
      }
    }
  });

  it('every surface defines a root component', () => {
    for (const fixture of FIXTURES) {
      const updates = fixture.messages.filter(m => 'updateComponents' in m) as Array<{
        updateComponents: {components: Array<{id: string}>};
      }>;
      for (const m of updates) {
        const ids = m.updateComponents.components.map(c => c.id);
        expect(ids).toContain('root');
      }
    }
  });

  it('getFixture falls back to the first fixture for unknown names', () => {
    expect(getFixture('nope').name).toBe('text');
    expect(getFixture(null).name).toBe('text');
    expect(getFixture('button-event').name).toBe('button-event');
  });
});
```

- [ ] **Step 6: Run the test to verify it passes**

Run: `yarn workspace client test fixtures`
Expected: PASS, 4 tests. (If `version`/`catalogId`/`root` assertions fail, fix the fixture authoring in Step 3, not the test.)

- [ ] **Step 7: Typecheck**

Run: `yarn workspace client typecheck`
Expected: no errors. (If `A2uiMessage` rejects a literal, confirm each message has `version: 'v0.9'` and exactly one of `createSurface`/`updateComponents`/`updateDataModel`.)

- [ ] **Step 8: Commit**

```bash
git add client/src/fixtures client/tests/fixtures.test.ts client/tsconfig.json
git commit -m "feat(phase-2): add canned A2UI fixtures for the client test space"
```

---

## Task 2: FixtureView + render tests

Render one fixture: build a processor, feed messages, render its surfaces through Primer. No action handler yet — proves render correctness for Text (literal + bound) and Button (with child label).

**Files:**
- Create: `client/src/test-space/FixtureView.tsx`, `client/tests/helpers.tsx`
- Test: `client/tests/render.test.tsx`

**Interfaces:**
- Consumes: `FIXTURES`/`Fixture` from `../fixtures`; `MessageProcessor` from `@a2ui/web_core/v0_9`; `A2uiSurface` from `@a2ui/react/v0_9`; `PRIMER_CATALOG` from `primer-a2ui-adapter`.
- Produces:
  - `FixtureView(props: {fixture: Fixture}): JSX.Element` — renders a `<div data-testid="fixture-view">` wrapping one `<div data-testid={`surface-${id}`}>` per surface.
  - `renderWithPrimer(ui: ReactElement)` — RTL render wrapped in `ThemeProvider` + `BaseStyles`.
  - `renderFixture(fixture: Fixture)` — `renderWithPrimer(<FixtureView fixture={fixture} />)`.

- [ ] **Step 1: Write `FixtureView` (render-only)**

Create `client/src/test-space/FixtureView.tsx`:

```tsx
import {useEffect, useState} from 'react';
import {MessageProcessor} from '@a2ui/web_core/v0_9';
import {A2uiSurface} from '@a2ui/react/v0_9';
import {PRIMER_CATALOG} from 'primer-a2ui-adapter';
import type {Fixture} from '../fixtures';

/** Renders every surface produced by one fixture's canned messages. */
export function FixtureView({fixture}: {fixture: Fixture}) {
  const [processor] = useState(() => {
    const p = new MessageProcessor([PRIMER_CATALOG]);
    p.processMessages(fixture.messages);
    return p;
  });

  const [surfaces, setSurfaces] = useState(() => Array.from(processor.model.surfacesMap.values()));
  useEffect(() => {
    const sync = () => setSurfaces(Array.from(processor.model.surfacesMap.values()));
    const created = processor.onSurfaceCreated(sync);
    const deleted = processor.onSurfaceDeleted(sync);
    return () => {
      created.unsubscribe();
      deleted.unsubscribe();
    };
  }, [processor]);

  return (
    <div data-testid="fixture-view">
      {surfaces.map(surface => (
        <div key={surface.id} data-testid={`surface-${surface.id}`}>
          <A2uiSurface surface={surface} />
        </div>
      ))}
    </div>
  );
}
```

- [ ] **Step 2: Write the test helpers**

Create `client/tests/helpers.tsx`:

```tsx
import type {ReactElement} from 'react';
import {render} from '@testing-library/react';
import {BaseStyles, ThemeProvider} from '@primer/react';
import {FixtureView} from '../src/test-space/FixtureView';
import type {Fixture} from '../src/fixtures';

export function renderWithPrimer(ui: ReactElement) {
  return render(
    <ThemeProvider>
      <BaseStyles>{ui}</BaseStyles>
    </ThemeProvider>,
  );
}

export function renderFixture(fixture: Fixture) {
  return renderWithPrimer(<FixtureView fixture={fixture} />);
}
```

- [ ] **Step 3: Write the failing render tests**

Create `client/tests/render.test.tsx`:

```tsx
import {describe, it, expect, afterEach} from 'vitest';
import {screen, cleanup} from '@testing-library/react';
import {renderFixture} from './helpers';
import {textFixture} from '../src/fixtures/text';
import {textBoundFixture} from '../src/fixtures/text-bound';
import {buttonFnFixture} from '../src/fixtures/button-fn';

afterEach(cleanup);

describe('fixture rendering', () => {
  it('renders a literal Text', () => {
    renderFixture(textFixture);
    expect(screen.getByText('Hello from Primer')).toBeInTheDocument();
  });

  it('renders a path-bound Text from the data model', () => {
    renderFixture(textBoundFixture);
    expect(screen.getByText('Bound hello')).toBeInTheDocument();
  });

  it('renders a Button whose child Text is the label', () => {
    renderFixture(buttonFnFixture);
    expect(screen.getByRole('button', {name: 'Run local function'})).toBeInTheDocument();
  });
});
```

- [ ] **Step 4: Run the render tests to verify they fail**

Run: `yarn workspace client test render`
Expected: FAIL initially only if a wiring bug exists; if all three pass, confirm they exercise real rendering by temporarily breaking the literal text and re-running. Primary expected end state: PASS once `FixtureView`/helpers are correct.

- [ ] **Step 5: Make the render tests pass**

Run: `yarn workspace client test render`
Expected: PASS, 3 tests. Common fixes if failing:
- bound Text empty → confirm `updateDataModel` `value` key matches the `path` (`/greeting`).
- button label missing → confirm Button `child: 'label'` matches the Text component `id: 'label'`.

- [ ] **Step 6: Typecheck**

Run: `yarn workspace client typecheck`
Expected: no errors.

- [ ] **Step 7: Commit**

```bash
git add client/src/test-space/FixtureView.tsx client/tests/helpers.tsx client/tests/render.test.tsx
git commit -m "feat(phase-2): render canned fixtures through PRIMER_CATALOG in the client"
```

---

## Task 3: Action paths (path-1 local, path-2 mocked)

Thread an injectable `actionHandler` through `FixtureView` so `event` actions are observable, and prove the two paths: `functionCall` runs `consoleLog` locally (handler untouched); `event` is emitted to the handler.

**Files:**
- Modify: `client/src/test-space/FixtureView.tsx`, `client/tests/helpers.tsx`
- Test: `client/tests/actions.test.tsx`

**Interfaces:**
- Consumes: `ActionListener` type from `@a2ui/web_core/v0_9`.
- Produces (signature changes):
  - `FixtureView(props: {fixture: Fixture; actionHandler?: ActionListener})`
  - `renderFixture(fixture: Fixture, opts?: {actionHandler?: ActionListener})`
  - The emitted action object has shape `{name: string; surfaceId: string; sourceComponentId: string; timestamp: string; context: Record<string, unknown>}`.

- [ ] **Step 1: Write the failing action tests**

Create `client/tests/actions.test.tsx`:

```tsx
import {describe, it, expect, vi, afterEach} from 'vitest';
import {screen, cleanup, fireEvent} from '@testing-library/react';
import {renderFixture} from './helpers';
import {buttonFnFixture} from '../src/fixtures/button-fn';
import {buttonEventFixture} from '../src/fixtures/button-event';

afterEach(cleanup);

describe('action paths', () => {
  it('path-1: functionCall runs the registered consoleLog locally, not via the handler', () => {
    const logSpy = vi.spyOn(console, 'log').mockImplementation(() => {});
    const handler = vi.fn();
    renderFixture(buttonFnFixture, {actionHandler: handler});

    fireEvent.click(screen.getByRole('button', {name: 'Run local function'}));

    expect(logSpy).toHaveBeenCalledWith('[A2UI]', 'button-fn clicked');
    expect(handler).not.toHaveBeenCalled();
    logSpy.mockRestore();
  });

  it('path-2: event is dispatched to the actionHandler', async () => {
    const handler = vi.fn();
    renderFixture(buttonEventFixture, {actionHandler: handler});

    fireEvent.click(screen.getByRole('button', {name: 'Send event'}));

    await vi.waitFor(() => expect(handler).toHaveBeenCalledTimes(1));
    expect(handler).toHaveBeenCalledWith(
      expect.objectContaining({
        name: 'submit',
        surfaceId: 'button-event',
        sourceComponentId: 'root',
      }),
    );
  });
});
```

- [ ] **Step 2: Run to verify failure**

Run: `yarn workspace client test actions`
Expected: FAIL — `renderFixture` does not accept a second argument / the handler is never wired, so `path-2` never calls `handler` (and TypeScript flags the unknown `opts` arg).

- [ ] **Step 3: Thread `actionHandler` through `FixtureView`**

Edit `client/src/test-space/FixtureView.tsx` — add the import and the prop, and pass it to the processor:

```tsx
import {MessageProcessor} from '@a2ui/web_core/v0_9';
import type {ActionListener} from '@a2ui/web_core/v0_9';
```

```tsx
export function FixtureView({
  fixture,
  actionHandler,
}: {
  fixture: Fixture;
  actionHandler?: ActionListener;
}) {
  const [processor] = useState(() => {
    // TODO(2.5): replace the injected dev-stub actionHandler with the real A2A
    // client middleware so `event` actions go out over the wire to the server.
    const p = new MessageProcessor([PRIMER_CATALOG], actionHandler);
    p.processMessages(fixture.messages);
    return p;
  });
```

(Leave the rest of `FixtureView` unchanged.)

- [ ] **Step 4: Extend `renderFixture` to pass the handler**

Edit `client/tests/helpers.tsx`:

```tsx
import type {ActionListener} from '@a2ui/web_core/v0_9';
```

```tsx
export function renderFixture(fixture: Fixture, opts: {actionHandler?: ActionListener} = {}) {
  return renderWithPrimer(<FixtureView fixture={fixture} actionHandler={opts.actionHandler} />);
}
```

- [ ] **Step 5: Run to verify the action tests pass**

Run: `yarn workspace client test actions`
Expected: PASS, 2 tests.

- [ ] **Step 6: Run the full client suite + typecheck**

Run: `yarn workspace client test && yarn workspace client typecheck`
Expected: PASS — `fixtures`, `render`, `actions` all green; no type errors.

- [ ] **Step 7: Commit**

```bash
git add client/src/test-space/FixtureView.tsx client/tests/helpers.tsx client/tests/actions.test.tsx
git commit -m "feat(phase-2): wire injectable actionHandler and test both action paths"
```

---

## Task 4: TestSpace selector + URL sync + App swap

Wrap `FixtureView` in a page with a fixture selector, mirror the selection in `?fixture=`, surface dispatched events for the manual/Chrome check, and replace the bootstrap `App`.

**Files:**
- Create: `client/src/test-space/TestSpace.tsx`
- Modify: `client/src/App.tsx`, `client/src/App.test.tsx`
- Test: `client/tests/selector.test.tsx`

**Interfaces:**
- Consumes: `FIXTURES`, `getFixture` from `../fixtures`; `FixtureView`; `ActionListener` from `@a2ui/web_core/v0_9`.
- Produces:
  - `TestSpace(props: {actionHandler?: ActionListener}): JSX.Element` — renders a `<select data-testid="fixture-select">` of fixture names, the active `FixtureView` (remounted per fixture via `key`), and a `<ul data-testid="event-log">` of received events (only when no `actionHandler` prop is supplied).
  - `App()` renders `TestSpace` inside `ThemeProvider` + `BaseStyles`.

- [ ] **Step 1: Write `TestSpace`**

Create `client/src/test-space/TestSpace.tsx`:

```tsx
import {useCallback, useState} from 'react';
import type {ActionListener} from '@a2ui/web_core/v0_9';
import {FIXTURES, getFixture} from '../fixtures';
import {FixtureView} from './FixtureView';

function readFixtureFromUrl(): string {
  if (typeof window === 'undefined') return FIXTURES[0].name;
  return getFixture(new URLSearchParams(window.location.search).get('fixture')).name;
}

export function TestSpace({actionHandler}: {actionHandler?: ActionListener} = {}) {
  const [selected, setSelected] = useState(readFixtureFromUrl);
  const [events, setEvents] = useState<string[]>([]);

  // Default dev stub: record + log dispatched events so the manual/Chrome check
  // can see the event path fire. Tests pass their own actionHandler instead.
  const recorder = useCallback<ActionListener>(action => {
    const line = JSON.stringify(action);
    console.log('[A2UI:event]', line);
    setEvents(prev => [...prev, line]);
  }, []);
  const effectiveHandler = actionHandler ?? recorder;

  const onSelect = (name: string) => {
    setSelected(name);
    setEvents([]);
    if (typeof window !== 'undefined') {
      const url = new URL(window.location.href);
      url.searchParams.set('fixture', name);
      window.history.replaceState({}, '', url);
    }
  };

  const fixture = getFixture(selected);

  return (
    <main>
      <label>
        Fixture:{' '}
        <select
          data-testid="fixture-select"
          value={fixture.name}
          onChange={e => onSelect(e.target.value)}
        >
          {FIXTURES.map(f => (
            <option key={f.name} value={f.name}>
              {f.name}
            </option>
          ))}
        </select>
      </label>

      <FixtureView key={fixture.name} fixture={fixture} actionHandler={effectiveHandler} />

      {!actionHandler && (
        <ul data-testid="event-log">
          {events.map((e, i) => (
            <li key={i}>{e}</li>
          ))}
        </ul>
      )}
    </main>
  );
}
```

- [ ] **Step 2: Swap `App` to render `TestSpace`**

Replace the contents of `client/src/App.tsx`:

```tsx
import {BaseStyles, ThemeProvider} from '@primer/react';
import {TestSpace} from './test-space/TestSpace';

export function App() {
  return (
    <ThemeProvider>
      <BaseStyles>
        <TestSpace />
      </BaseStyles>
    </ThemeProvider>
  );
}
```

- [ ] **Step 3: Replace the App smoke test**

Replace the contents of `client/src/App.test.tsx`:

```tsx
import {describe, it, expect, afterEach} from 'vitest';
import {render, screen, cleanup} from '@testing-library/react';
import {App} from './App';

afterEach(cleanup);

describe('App', () => {
  it('mounts the test space with a fixture selector', () => {
    render(<App />);
    expect(screen.getByTestId('fixture-select')).toBeInTheDocument();
  });
});
```

- [ ] **Step 4: Write the failing selector tests**

Create `client/tests/selector.test.tsx`:

```tsx
import {describe, it, expect, afterEach, beforeEach} from 'vitest';
import {render, screen, cleanup, fireEvent, within} from '@testing-library/react';
import {BaseStyles, ThemeProvider} from '@primer/react';
import {TestSpace} from '../src/test-space/TestSpace';

function renderTestSpace() {
  return render(
    <ThemeProvider>
      <BaseStyles>
        <TestSpace />
      </BaseStyles>
    </ThemeProvider>,
  );
}

beforeEach(() => window.history.replaceState({}, '', '/'));
afterEach(cleanup);

describe('TestSpace selector', () => {
  it('lists every fixture and defaults to the first', () => {
    renderTestSpace();
    const select = screen.getByTestId('fixture-select') as HTMLSelectElement;
    expect(within(select).getAllByRole('option')).toHaveLength(5);
    expect(select.value).toBe('text');
    expect(screen.getByText('Hello from Primer')).toBeInTheDocument();
  });

  it('swaps the rendered surface when a new fixture is chosen', () => {
    renderTestSpace();
    fireEvent.change(screen.getByTestId('fixture-select'), {target: {value: 'button-fn'}});
    expect(screen.getByRole('button', {name: 'Run local function'})).toBeInTheDocument();
    expect(screen.queryByText('Hello from Primer')).not.toBeInTheDocument();
  });

  it('deep-links the initial fixture from the ?fixture= URL param', () => {
    window.history.replaceState({}, '', '/?fixture=button-event');
    renderTestSpace();
    expect((screen.getByTestId('fixture-select') as HTMLSelectElement).value).toBe('button-event');
    expect(screen.getByRole('button', {name: 'Send event'})).toBeInTheDocument();
  });
});
```

- [ ] **Step 5: Run to verify failure, then pass**

Run: `yarn workspace client test selector`
Expected: PASS, 3 tests. If the deep-link test fails, confirm `readFixtureFromUrl` reads `window.location.search` and `getFixture` matches by `name`.

- [ ] **Step 6: Full client suite + typecheck**

Run: `yarn workspace client test && yarn workspace client typecheck`
Expected: PASS — `fixtures`, `render`, `actions`, `selector`, `App` all green; no type errors.

- [ ] **Step 7: Commit**

```bash
git add client/src/test-space/TestSpace.tsx client/src/App.tsx client/src/App.test.tsx client/tests/selector.test.tsx
git commit -m "feat(phase-2): add fixture selector test space with URL deep-linking"
```

---

## Task 5: Playwright baselines (with Claude-Chrome gate)

Stand up chromium visual-regression. The Claude-Chrome check is the gate: confirm the render is correct **before** baselines are generated, because a baseline blesses whatever renders as the source of truth.

**Files:**
- Create: `client/playwright.config.ts`, `client/e2e/visual.spec.ts`
- Modify: `client/package.json`, `client/vite.config.ts`

**Interfaces:**
- Consumes: the running app via `vite preview` at `http://localhost:4173`, addressed by `/?fixture=<name>`.
- Produces: committed baseline PNGs under `client/e2e/visual.spec.ts-snapshots/` and a `test:e2e` script.

- [ ] **Step 1: Add Playwright dep + script**

Run:

```bash
yarn workspace client add -D @playwright/test
npx playwright install chromium
```

Then add to `client/package.json` `scripts`:

```json
    "test:e2e": "playwright test"
```

(Note: the browser-binary download in `playwright install` may be blocked on a restricted network; run it where downloads are allowed.)

- [ ] **Step 2: Exclude e2e from vitest**

Edit `client/vite.config.ts` so vitest does not try to run Playwright specs:

```ts
import react from '@vitejs/plugin-react';
import {configDefaults, defineConfig} from 'vitest/config';

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./src/setupTests.ts'],
    exclude: [...configDefaults.exclude, 'e2e/**'],
    server: {
      // Inline Primer so Vite transforms its internal CSS imports
      // (otherwise externalized .css hits Node's loader and throws).
      deps: {inline: ['@primer/react']},
    },
  },
});
```

- [ ] **Step 3: Write the Playwright config**

Create `client/playwright.config.ts`:

```ts
import {defineConfig, devices} from '@playwright/test';

export default defineConfig({
  testDir: './e2e',
  fullyParallel: true,
  expect: {toHaveScreenshot: {animations: 'disabled'}},
  use: {baseURL: 'http://localhost:4173'},
  projects: [
    {
      name: 'chromium',
      use: {...devices['Desktop Chrome'], viewport: {width: 1024, height: 768}},
    },
  ],
  webServer: {
    command: 'yarn build && yarn preview --port 4173 --strictPort',
    url: 'http://localhost:4173',
    reuseExistingServer: !process.env.CI,
    timeout: 120_000,
  },
});
```

- [ ] **Step 4: Write the visual spec**

Create `client/e2e/visual.spec.ts` (fixture names hardcoded so the spec does not import the React/Primer app graph into the Node test context):

```ts
import {test, expect} from '@playwright/test';

const FIXTURE_NAMES = ['text', 'text-bound', 'button-fn', 'button-event', 'button-variants'];

for (const name of FIXTURE_NAMES) {
  test(`baseline: ${name}`, async ({page}) => {
    await page.goto(`/?fixture=${name}`);
    await expect(page.getByTestId('fixture-view')).toBeVisible();
    await expect(page).toHaveScreenshot(`${name}.png`, {fullPage: true});
  });
}
```

- [ ] **Step 5: GATE — Claude-Chrome live confirmation (manual, no artifact)**

Start the app and confirm Primer styling is correct *before* generating baselines:

```bash
yarn workspace client dev
```

Using Claude-in-Chrome, open and eyeball each state:
- `/?fixture=text`, `/?fixture=text-bound`, `/?fixture=button-fn`, `/?fixture=button-event`
- `/?fixture=button-variants` — confirm all five buttons render with visibly distinct Primer treatments: `default`, `primary`, `invisible`, `danger`, `link`.

Click `button-fn` (console shows `[A2UI] button-fn clicked`) and `button-event` (the `event-log` list shows the dispatched event). Only proceed once the rendering looks correct — the next step freezes it.

- [ ] **Step 6: Generate and verify baselines**

Run:

```bash
yarn workspace client test:e2e --update-snapshots
```

Expected: 5 baseline PNGs created under `client/e2e/visual.spec.ts-snapshots/`. Then verify they pass clean:

```bash
yarn workspace client test:e2e
```

Expected: PASS, 5 tests, no diffs.

- [ ] **Step 7: Confirm `test:e2e` is excluded from the aggregate lanes**

Run: `yarn verify:all`
Expected: runs build/typecheck/lint/`test` across workspaces and stays green; it does NOT run Playwright (client `test` is vitest only). Confirm no browser launches.

- [ ] **Step 8: Commit (including baselines)**

```bash
git add client/playwright.config.ts client/e2e client/vite.config.ts client/package.json yarn.lock
git commit -m "test(phase-2): add chromium Playwright visual baselines for the test space"
```

(If `npx playwright install` modified no tracked files, omit untracked browser caches; commit only the snapshots and config.)

---

## Verification bar coverage (spec decision 10)

| Spec bar item | Where covered |
|---|---|
| vitest: catalog render of `Text`/`Button` | Task 2 (`render.test.tsx`) |
| vitest: both action paths, transport mocked client-side | Task 3 (`actions.test.tsx`) |
| Playwright: committed visual-regression baselines of Primer `Text`/`Button` | Task 5 (`visual.spec.ts` + `visual.spec.ts-snapshots/`) |
| Claude-Chrome: dev-time live confirmation of Primer styling | Task 5, Step 5 (gate) |
| Test-space topology: one `MessageProcessor`, canned-local in, `event` to handler | Tasks 2–4 (`FixtureView` + `TestSpace`) |
| Variant fidelity (visual) | Task 1 `button-variants` fixture + Task 5 baseline |
| "Green" extends across the client workspace | Task 5, Step 7 (`verify:all`) |

Out of scope here (later sub-tasks): deterministic A2A server + pytest conformance (2.4); genuine FE↔server wire round-trip (2.5). Anything crossing the wire in 2.3 is mocked.
