# Event Round-Trip Integration (Task 2.5) Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Wire the real `@a2a-js/sdk` client as the renderer's `actionHandler` so a Button `event` travels over A2A to the deterministic server, and the server's canned A2UI response feeds back into the same `MessageProcessor` to re-render — closing the Phase 2 event round-trip across the JS↔Python boundary.

**Architecture:** A new transport-only module, `client/src/a2a/`, exposes a framework-agnostic `createA2AActionHandler({apply, serverUrl})` factory — the durable, releasable seam. It marshals an A2UI client action into an A2A `MessageSendParams` (one version-tagged `DataPart`), sends it via `A2AClient`, extracts the A2UI messages back out of the returned completed `Task`, and hands them to an injected `apply` callback. The dev test space (`App` → `TestSpace` → `FixtureView`) is throwaway scaffolding: `FixtureView` resolves the processor↔handler construction cycle via a late-binding closure and consumes the factory through a handler-factory prop. The recorder/event-log stub is removed; the A2A handler becomes the dev app's default.

**Tech Stack:** TypeScript, React 19, Vite 8, vitest (jsdom + RTL), `@a2a-js/sdk@^0.3.13` (client), `@a2ui/web_core@^0.10.1` (`MessageProcessor`, types), `@a2ui/react` (`A2uiSurface`), Primer.

## Global Constraints

- **Transport is the official `@a2a-js/sdk`** (client entrypoint `@a2a-js/sdk/client`), pinned to the **0.3.x line** (`^0.3.13`) to match the server's Python `a2a-sdk` 0.3.x. No hand-rolled JSON-RPC `fetch`.
- **Verified `@a2a-js/sdk@0.3.13` API** (do not guess; these are read from the package's `.d.ts`):
  - `A2AClient.fromCardUrl(agentCardUrl: string, options?): Promise<A2AClient>` (static factory).
  - `A2AClient.sendMessage(params: MessageSendParams): Promise<SendMessageResponse>` where `SendMessageResponse = JSONRPCErrorResponse | SendMessageSuccessResponse`; the error variant has an `error` field, the success variant has `result: Task | Message`.
  - `DataPart = { kind: 'data'; data: { [k: string]: unknown }; metadata?: {...} }`; `Message = { kind: 'message'; role: 'user' | 'agent'; messageId: string; parts: Part[]; ... }`; `Task = { kind: 'task'; id; contextId; status: TaskStatus; ... }`; `TaskStatus = { state; message?: Message; timestamp? }`.
- **Wire contract (already settled by the 2.4 server's `_extract_action`):** the request DataPart `data` is exactly `{ version: 'v0.9', action }`; the response A2UI rides as version-tagged `DataPart`s on the completed Task's **status message** (`task.status.message.parts`).
- **Agent-card path is `/.well-known/agent-card.json`** (verified: Python `a2a.utils.constants.AGENT_CARD_WELL_KNOWN_PATH`; matches the JS default resolver path).
- **Protocol version literal is `'v0.9'`** on every marshalled and extracted message.
- **Server URL via `import.meta.env.VITE_A2A_SERVER_URL`, default `http://localhost:10002`.**
- **`createA2AActionHandler` is the durable released seam** — transport-only, framework-agnostic, no React/fixture knowledge. `FixtureView`/`TestSpace`/`App` are disposable dev scaffolding.
- **The released seam never throws into React:** wire/extract failures are caught and `console.error('[A2UI:a2a]', …)`; `apply` is not called on failure.
- **`processMessages` is the validator** — extraction filters by part kind + `version === 'v0.9'` only; no redundant schema re-validation in the factory.
- **The genuine FE↔server wire round-trip is manual, not in CI** (Task 7). CI covers marshalling/extraction/handler with the transport mocked, plus the re-render reactivity (Task 5).
- **Imports:** `@a2ui/web_core/v0_9` always (never the bare v0.8 entry). Type names `A2uiClientAction`, `A2uiMessage`, `ActionListener` are exported from there.
- **Commit convention:** `feat(phase-2): …` / `test(phase-2): …` / `chore(phase-2): …` / `docs(phase-2): …`.
- **`_dev/` is never touched on the worktree branch** — this plan produces code + `client/README.md` only.

## File Structure

- `client/src/a2a/messages.ts` — **create.** Pure A2UI↔A2A mapping: `buildActionMessageParams(action)` and `extractA2uiMessages(result)`. No SDK client, no React. The Phase-5 streaming reuse point.
- `client/src/a2a/createA2AActionHandler.ts` — **create.** The released factory. Owns `A2AClient` construction (lazy, memoized), the marshal→send→extract→apply flow, and catch-and-log.
- `client/tests/a2a.test.ts` — **create.** Unit tests for `messages.ts` + the factory (fake client injected).
- `client/tests/round-trip-render.test.tsx` — **create.** CI proof that a server-style `updateDataModel`+`updateComponents` to an existing surface reactively re-renders.
- `client/tests/a2a-sdk.smoke.test.ts` — **create.** One-line proof the dep resolves under Vite/vitest ESM.
- `client/src/test-space/FixtureView.tsx` — **modify.** Prop `actionHandler` → `makeActionHandler`; late-binding closure.
- `client/src/test-space/TestSpace.tsx` — **modify.** Prop pass-through; remove recorder + event-log.
- `client/src/App.tsx` — **modify.** Wire `createA2AActionHandler` as the default `makeActionHandler` from `VITE_A2A_SERVER_URL`.
- `client/tests/helpers.tsx` — **modify.** Wrap `opts.actionHandler` into a `makeActionHandler` factory (back-compat; keeps existing tests verbatim).
- `client/src/vite-env.d.ts` — **modify.** Type `VITE_A2A_SERVER_URL` on `ImportMetaEnv`.
- `client/package.json` — **modify.** Add `@a2a-js/sdk`.
- `client/README.md` — **modify.** Env var + 3-check manual-verify checklist + run commands.

---

### Task 1: Add `@a2a-js/sdk` and prove it resolves under the bundler

Adds the client transport dependency and a smoke test confirming the hashed-chunk ESM package resolves under Vite/vitest (a real risk with bundled SDKs).

**Files:**
- Modify: `client/package.json` (dependencies)
- Create: `client/tests/a2a-sdk.smoke.test.ts`

**Interfaces:**
- Consumes: nothing.
- Produces: `@a2a-js/sdk/client` importable in client code and tests; `A2AClient` resolvable.

- [ ] **Step 1: Add the dependency**

In `client/package.json`, add to `"dependencies"` (keep alphabetical, before `@a2ui/react`):

```json
    "@a2a-js/sdk": "^0.3.13",
```

- [ ] **Step 2: Install**

Run: `yarn install`
Expected: completes green; `@a2a-js/sdk` resolves at the workspace root `node_modules`.

- [ ] **Step 3: Write the resolution smoke test**

Create `client/tests/a2a-sdk.smoke.test.ts`:

```ts
import {describe, it, expect} from 'vitest';
import {A2AClient} from '@a2a-js/sdk/client';

describe('@a2a-js/sdk resolution', () => {
  it('exposes A2AClient.fromCardUrl under the bundler', () => {
    expect(typeof A2AClient.fromCardUrl).toBe('function');
  });
});
```

- [ ] **Step 4: Run the smoke test**

Run: `yarn workspace client run test -- a2a-sdk.smoke`
Expected: PASS. (If it fails to resolve the ESM chunks, that is the resolution issue this task exists to surface — fix the import/version before proceeding.)

- [ ] **Step 5: Commit**

```bash
git add client/package.json client/tests/a2a-sdk.smoke.test.ts ../yarn.lock
git commit -m "chore(phase-2): add @a2a-js/sdk client dependency for 2.5 round-trip"
```

---

### Task 2: Pure A2UI↔A2A message mapping (`messages.ts`)

The transport-agnostic marshalling and extraction. TDD. This is the function Phase 5 reuses per streaming chunk.

**Files:**
- Create: `client/src/a2a/messages.ts`
- Create (start): `client/tests/a2a.test.ts`

**Interfaces:**
- Consumes: `A2uiClientAction`, `A2uiMessage` from `@a2ui/web_core/v0_9`; `MessageSendParams`, `Task`, `Message`, `Part` from `@a2a-js/sdk`.
- Produces:
  - `buildActionMessageParams(action: A2uiClientAction): MessageSendParams`
  - `extractA2uiMessages(result: Task | Message): A2uiMessage[]`

- [ ] **Step 1: Write the failing tests**

Create `client/tests/a2a.test.ts`:

```ts
import {describe, it, expect} from 'vitest';
import type {Task, Message} from '@a2a-js/sdk';
import type {A2uiClientAction} from '@a2ui/web_core/v0_9';
import {buildActionMessageParams, extractA2uiMessages} from '../src/a2a/messages';

const action = {
  name: 'submit',
  surfaceId: 'button-event',
  sourceComponentId: 'root',
} as unknown as A2uiClientAction;

describe('buildActionMessageParams', () => {
  it('wraps the action in a single v0.9 DataPart on a user message', () => {
    const params = buildActionMessageParams(action);
    expect(params.message.kind).toBe('message');
    expect(params.message.role).toBe('user');
    expect(typeof params.message.messageId).toBe('string');
    expect(params.message.messageId.length).toBeGreaterThan(0);
    expect(params.message.parts).toEqual([
      {kind: 'data', data: {version: 'v0.9', action}},
    ]);
  });
});

describe('extractA2uiMessages', () => {
  const a2uiMsg = {
    version: 'v0.9',
    updateDataModel: {surfaceId: 'button-event', path: '/submitted', value: true},
  };

  it('pulls version-tagged DataParts off a completed task status message', () => {
    const task = {
      kind: 'task',
      id: 't1',
      contextId: 'c1',
      status: {
        state: 'completed',
        message: {
          kind: 'message',
          role: 'agent',
          messageId: 'm1',
          parts: [
            {kind: 'text', text: 'ignore me'},
            {kind: 'data', data: a2uiMsg},
            {kind: 'data', data: {version: 'v0.8', stale: true}},
          ],
        },
      },
    } as unknown as Task;
    expect(extractA2uiMessages(task)).toEqual([a2uiMsg]);
  });

  it('falls back to a direct agent message reply', () => {
    const message = {
      kind: 'message',
      role: 'agent',
      messageId: 'm2',
      parts: [{kind: 'data', data: a2uiMsg}],
    } as unknown as Message;
    expect(extractA2uiMessages(message)).toEqual([a2uiMsg]);
  });

  it('returns [] when the task status has no message', () => {
    const task = {
      kind: 'task',
      id: 't3',
      contextId: 'c3',
      status: {state: 'completed'},
    } as unknown as Task;
    expect(extractA2uiMessages(task)).toEqual([]);
  });
});
```

- [ ] **Step 2: Run tests to verify they fail**

Run: `yarn workspace client run test -- a2a.test`
Expected: FAIL — cannot resolve `../src/a2a/messages`.

- [ ] **Step 3: Write the implementation**

Create `client/src/a2a/messages.ts`:

```ts
import type {MessageSendParams, Task, Message, Part} from '@a2a-js/sdk';
import type {A2uiClientAction, A2uiMessage} from '@a2ui/web_core/v0_9';

const A2UI_VERSION = 'v0.9' as const;

/** Wrap an A2UI client action as A2A send params carrying one v0.9 A2UI DataPart. */
export function buildActionMessageParams(action: A2uiClientAction): MessageSendParams {
  return {
    message: {
      kind: 'message',
      role: 'user',
      messageId: crypto.randomUUID(),
      parts: [{kind: 'data', data: {version: A2UI_VERSION, action}}],
    },
  };
}

/**
 * Pull A2UI messages out of an A2A send result.
 *
 * Phase 2's deterministic server returns a single completed Task whose status
 * message carries the canned A2UI as version-tagged DataParts. A direct agent
 * Message reply is also supported.
 *
 * TODO(phase-5): streaming — when the real agent generates progressively, call
 * this per chunk over sendMessageStream's A2AStreamEventData (Task |
 * TaskStatusUpdateEvent) instead of against one terminal Task.
 */
export function extractA2uiMessages(result: Task | Message): A2uiMessage[] {
  const parts: Part[] =
    result.kind === 'task' ? (result.status.message?.parts ?? []) : result.parts;
  return parts
    .filter((p): p is Extract<Part, {kind: 'data'}> => p.kind === 'data')
    .map(p => p.data)
    .filter((d): d is A2uiMessage => (d as {version?: unknown}).version === A2UI_VERSION);
}
```

- [ ] **Step 4: Run tests to verify they pass**

Run: `yarn workspace client run test -- a2a.test`
Expected: PASS (all `buildActionMessageParams` + `extractA2uiMessages` cases).

- [ ] **Step 5: Commit**

```bash
git add client/src/a2a/messages.ts client/tests/a2a.test.ts
git commit -m "feat(phase-2): A2UI<->A2A message marshalling/extraction for the round-trip"
```

---

### Task 3: `createA2AActionHandler` factory

The durable released seam: marshal → send via `A2AClient` → extract → `apply`, with lazy memoized client resolution and catch-and-log. TDD with an injected fake client.

**Files:**
- Create: `client/src/a2a/createA2AActionHandler.ts`
- Modify: `client/tests/a2a.test.ts` (append the factory suite)

**Interfaces:**
- Consumes: `buildActionMessageParams`, `extractA2uiMessages` (Task 2); `A2AClient` from `@a2a-js/sdk/client`; `MessageSendParams`, `SendMessageResponse` from `@a2a-js/sdk`; `ActionListener`, `A2uiMessage` from `@a2ui/web_core/v0_9`.
- Produces:
  - `interface A2AMessageSender { sendMessage(params: MessageSendParams): Promise<SendMessageResponse> }`
  - `interface A2AActionHandlerOptions { apply: (messages: A2uiMessage[]) => void; serverUrl?: string; client?: A2AMessageSender }`
  - `createA2AActionHandler(opts: A2AActionHandlerOptions): ActionListener`

- [ ] **Step 1: Write the failing tests (append to `client/tests/a2a.test.ts`)**

Add these imports at the top of the file (alongside the existing ones):

```ts
import {vi, beforeEach, afterEach} from 'vitest';
import type {MessageSendParams, SendMessageResponse, Task} from '@a2a-js/sdk';
import {createA2AActionHandler} from '../src/a2a/createA2AActionHandler';
```

Append:

```ts
describe('createA2AActionHandler', () => {
  const a2uiMsg = {
    version: 'v0.9',
    updateComponents: {
      surfaceId: 'button-event',
      components: [{id: 'label', component: 'Text', text: 'done'}],
    },
  };
  const okResponse = {
    jsonrpc: '2.0',
    id: 1,
    result: {
      kind: 'task',
      id: 't1',
      contextId: 'c1',
      status: {
        state: 'completed',
        message: {
          kind: 'message',
          role: 'agent',
          messageId: 'm1',
          parts: [{kind: 'data', data: a2uiMsg}],
        },
      },
    } as Task,
  } as SendMessageResponse;

  let errSpy: ReturnType<typeof vi.spyOn>;
  beforeEach(() => {
    errSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
  });
  afterEach(() => errSpy.mockRestore());

  it('marshals the action, sends it, and applies the extracted messages', async () => {
    const sendMessage = vi.fn().mockResolvedValue(okResponse);
    const apply = vi.fn();
    const handler = createA2AActionHandler({apply, client: {sendMessage}});

    await handler(action);

    expect(sendMessage).toHaveBeenCalledTimes(1);
    const sent = sendMessage.mock.calls[0][0] as MessageSendParams;
    expect(sent.message.parts[0]).toEqual({kind: 'data', data: {version: 'v0.9', action}});
    expect(apply).toHaveBeenCalledWith([a2uiMsg]);
  });

  it('catch-and-logs a thrown send failure without applying', async () => {
    const sendMessage = vi.fn().mockRejectedValue(new Error('wire down'));
    const apply = vi.fn();
    const handler = createA2AActionHandler({apply, client: {sendMessage}});

    await handler(action);

    expect(apply).not.toHaveBeenCalled();
    expect(errSpy).toHaveBeenCalledWith('[A2UI:a2a]', expect.any(Error));
  });

  it('catch-and-logs a JSON-RPC error response without applying', async () => {
    const sendMessage = vi.fn().mockResolvedValue({
      jsonrpc: '2.0',
      id: 1,
      error: {code: -32000, message: 'nope'},
    } as SendMessageResponse);
    const apply = vi.fn();
    const handler = createA2AActionHandler({apply, client: {sendMessage}});

    await handler(action);

    expect(apply).not.toHaveBeenCalled();
    expect(errSpy).toHaveBeenCalled();
  });
});
```

- [ ] **Step 2: Run tests to verify they fail**

Run: `yarn workspace client run test -- a2a.test`
Expected: FAIL — cannot resolve `../src/a2a/createA2AActionHandler`.

- [ ] **Step 3: Write the implementation**

Create `client/src/a2a/createA2AActionHandler.ts`:

```ts
import {A2AClient} from '@a2a-js/sdk/client';
import type {MessageSendParams, SendMessageResponse} from '@a2a-js/sdk';
import type {ActionListener, A2uiMessage} from '@a2ui/web_core/v0_9';
import {buildActionMessageParams, extractA2uiMessages} from './messages';

const AGENT_CARD_PATH = '/.well-known/agent-card.json';

/** The slice of A2AClient the handler needs; lets tests inject a fake. */
export interface A2AMessageSender {
  sendMessage(params: MessageSendParams): Promise<SendMessageResponse>;
}

export interface A2AActionHandlerOptions {
  /** Applies the server-returned A2UI messages back into the processor. */
  apply: (messages: A2uiMessage[]) => void;
  /** Base server URL, e.g. http://localhost:10002. Resolves the agent card. */
  serverUrl?: string;
  /** Pre-resolved / fake sender. Takes precedence over serverUrl (tests). */
  client?: A2AMessageSender;
}

/**
 * Builds an ActionListener that ships an `event` action to an A2A agent and
 * feeds the agent's A2UI response back through `apply`. Transport-only: no React
 * or fixture knowledge. The returned listener never throws — wire/extract
 * failures are caught and logged, and `apply` is skipped.
 */
export function createA2AActionHandler(opts: A2AActionHandlerOptions): ActionListener {
  const {apply, serverUrl, client} = opts;
  let senderPromise: Promise<A2AMessageSender> | undefined;

  const getSender = (): Promise<A2AMessageSender> => {
    if (client) return Promise.resolve(client);
    if (!serverUrl) {
      return Promise.reject(new Error('createA2AActionHandler: serverUrl or client required'));
    }
    // Lazily resolve the agent card once; clear the cache on failure so a later
    // click retries (e.g. after the dev server is started).
    if (!senderPromise) {
      senderPromise = A2AClient.fromCardUrl(`${serverUrl}${AGENT_CARD_PATH}`).catch(err => {
        senderPromise = undefined;
        throw err;
      });
    }
    return senderPromise;
  };

  return async action => {
    try {
      const sender = await getSender();
      const response = await sender.sendMessage(buildActionMessageParams(action));
      if ('error' in response) {
        console.error('[A2UI:a2a]', response.error);
        return;
      }
      apply(extractA2uiMessages(response.result));
    } catch (err) {
      console.error('[A2UI:a2a]', err);
    }
  };
}
```

- [ ] **Step 4: Run tests to verify they pass**

Run: `yarn workspace client run test -- a2a.test`
Expected: PASS (messages + handler suites).

- [ ] **Step 5: Commit**

```bash
git add client/src/a2a/createA2AActionHandler.ts client/tests/a2a.test.ts
git commit -m "feat(phase-2): createA2AActionHandler — the A2A round-trip seam"
```

---

### Task 4: Wire the factory into the dev app; remove the recorder stub

Connect the released seam through the throwaway scaffolding: late-binding in `FixtureView`, strip the recorder/event-log from `TestSpace`, make A2A the `App` default, type the env var, and keep existing tests green via a back-compat helper wrap.

**Files:**
- Modify: `client/src/test-space/FixtureView.tsx`
- Modify: `client/src/test-space/TestSpace.tsx`
- Modify: `client/src/App.tsx`
- Modify: `client/tests/helpers.tsx`
- Modify: `client/src/vite-env.d.ts`

**Interfaces:**
- Consumes: `createA2AActionHandler` (Task 3); `A2uiMessage`, `ActionListener` from `@a2ui/web_core/v0_9`.
- Produces: `FixtureView` + `TestSpace` prop `makeActionHandler?: (apply: (messages: A2uiMessage[]) => void) => ActionListener`. `renderFixture(fixture, {actionHandler?})` keeps its existing signature.

- [ ] **Step 1: Late-bind the handler in `FixtureView`**

Replace the top of `client/src/test-space/FixtureView.tsx` (imports + the component signature + the `useState` initializer) with:

```tsx
import {useEffect, useState} from 'react';
import {MessageProcessor} from '@a2ui/web_core/v0_9';
import type {ActionListener, A2uiMessage} from '@a2ui/web_core/v0_9';
import {A2uiSurface} from '@a2ui/react/v0_9';
import {PRIMER_CATALOG} from 'primer-a2ui-adapter';
import type {Fixture} from '../fixtures';

/** Renders every surface produced by one fixture's canned messages. */
export function FixtureView({
  fixture,
  makeActionHandler,
}: {
  fixture: Fixture;
  makeActionHandler?: (apply: (messages: A2uiMessage[]) => void) => ActionListener;
}) {
  const [processor] = useState(() => {
    // Late-binding: `apply` reaches the processor that is created right below.
    // The handler only fires on a click, long after construction, so the
    // temporal cycle is harmless.
    let target: {processMessages: (m: A2uiMessage[]) => void} | undefined;
    const apply = (messages: A2uiMessage[]) => target?.processMessages(messages);
    const handler = makeActionHandler?.(apply);
    const p = new MessageProcessor([PRIMER_CATALOG], handler);
    target = p;
    p.processMessages(fixture.messages);
    return p;
  });
```

Leave the rest of the component (the `surfaces` state, the `useEffect`, and the returned JSX) unchanged.

- [ ] **Step 2: Strip the recorder from `TestSpace`**

Replace the entire `client/src/test-space/TestSpace.tsx` with:

```tsx
import {useState} from 'react';
import type {ActionListener, A2uiMessage} from '@a2ui/web_core/v0_9';
import {FIXTURES, getFixture} from '../fixtures';
import {FixtureView} from './FixtureView';

function readFixtureFromUrl(): string {
  if (typeof window === 'undefined') return FIXTURES[0].name;
  return getFixture(new URLSearchParams(window.location.search).get('fixture')).name;
}

export function TestSpace({
  makeActionHandler,
}: {
  makeActionHandler?: (apply: (messages: A2uiMessage[]) => void) => ActionListener;
} = {}) {
  const [selected, setSelected] = useState(readFixtureFromUrl);

  const onSelect = (name: string) => {
    setSelected(name);
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

      <FixtureView key={fixture.name} fixture={fixture} makeActionHandler={makeActionHandler} />
    </main>
  );
}
```

- [ ] **Step 3: Make A2A the `App` default**

Replace the entire `client/src/App.tsx` with:

```tsx
import {useCallback} from 'react';
import {BaseStyles, ThemeProvider} from '@primer/react';
import type {ActionListener, A2uiMessage} from '@a2ui/web_core/v0_9';
import {createA2AActionHandler} from './a2a/createA2AActionHandler';
import {TestSpace} from './test-space/TestSpace';

const SERVER_URL = import.meta.env.VITE_A2A_SERVER_URL ?? 'http://localhost:10002';

export function App() {
  const makeActionHandler = useCallback(
    (apply: (messages: A2uiMessage[]) => void): ActionListener =>
      createA2AActionHandler({apply, serverUrl: SERVER_URL}),
    [],
  );

  return (
    <ThemeProvider>
      <BaseStyles>
        <TestSpace makeActionHandler={makeActionHandler} />
      </BaseStyles>
    </ThemeProvider>
  );
}
```

- [ ] **Step 4: Keep existing tests green via a back-compat helper wrap**

In `client/tests/helpers.tsx`, replace the `renderFixture` function with:

```tsx
export function renderFixture(fixture: Fixture, opts: {actionHandler?: ActionListener} = {}) {
  const makeActionHandler = opts.actionHandler ? () => opts.actionHandler! : undefined;
  return renderWithPrimer(<FixtureView fixture={fixture} makeActionHandler={makeActionHandler} />);
}
```

(The existing `ActionListener` import and `renderWithPrimer` stay as-is.)

- [ ] **Step 5: Type the env var**

Replace `client/src/vite-env.d.ts` with:

```ts
/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_A2A_SERVER_URL?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
```

- [ ] **Step 6: Run the full client suite + typecheck**

Run: `yarn workspace client run test`
Expected: PASS — including the unchanged `render.test`, `actions.test` (path-1 + path-2), `fixtures.test`, `selector.test`, and the new `a2a` tests.

Run: `yarn workspace client run typecheck`
Expected: no errors.

- [ ] **Step 7: Commit**

```bash
git add client/src/test-space/FixtureView.tsx client/src/test-space/TestSpace.tsx \
  client/src/App.tsx client/tests/helpers.tsx client/src/vite-env.d.ts
git commit -m "feat(phase-2): wire A2A handler as the dev-app default; drop the recorder stub"
```

---

### Task 5: Re-render reactivity CI test

Prove in CI that applying a server-style response (`updateDataModel` + `updateComponents`) to an *existing* surface reactively re-renders — the previously-flagged unknown, converted to an automated check. No wire; the canned response is fed straight into the processor.

**Files:**
- Create: `client/tests/round-trip-render.test.tsx`

**Interfaces:**
- Consumes: `MessageProcessor` from `@a2ui/web_core/v0_9`; `A2uiSurface` from `@a2ui/react/v0_9`; `PRIMER_CATALOG` from `primer-a2ui-adapter`; `buttonEventFixture`; `renderWithPrimer` from `./helpers`.
- Produces: nothing (test-only).

- [ ] **Step 1: Write the failing test**

Create `client/tests/round-trip-render.test.tsx`:

```tsx
import {describe, it, expect, afterEach} from 'vitest';
import {screen, cleanup, waitFor} from '@testing-library/react';
import {MessageProcessor} from '@a2ui/web_core/v0_9';
import {A2uiSurface} from '@a2ui/react/v0_9';
import {PRIMER_CATALOG} from 'primer-a2ui-adapter';
import {renderWithPrimer} from './helpers';
import {buttonEventFixture} from '../src/fixtures/button-event';

afterEach(cleanup);

describe('round-trip re-render', () => {
  it('re-renders an existing surface when the server-style response is applied', async () => {
    const processor = new MessageProcessor([PRIMER_CATALOG]);
    processor.processMessages(buttonEventFixture.messages);
    const surface = Array.from(processor.model.surfacesMap.values())[0];

    renderWithPrimer(<A2uiSurface surface={surface} />);

    // Before: enabled button, original label.
    expect(screen.getByRole('button', {name: 'Send event'})).not.toBeDisabled();

    // Apply the canned response the deterministic server returns for `submit`
    // (surfaceId stamped, as the server does before sending).
    processor.processMessages([
      {
        version: 'v0.9',
        updateDataModel: {surfaceId: 'button-event', path: '/submitted', value: true},
      },
      {
        version: 'v0.9',
        updateComponents: {
          surfaceId: 'button-event',
          components: [
            {id: 'label', component: 'Text', text: '✅ Sent — server received submit'},
          ],
        },
      },
    ]);

    // After: label flipped and the button disabled (binds to /submitted).
    await waitFor(() =>
      expect(screen.getByText('✅ Sent — server received submit')).toBeInTheDocument(),
    );
    expect(screen.getByRole('button')).toBeDisabled();
  });
});
```

- [ ] **Step 2: Run the test**

Run: `yarn workspace client run test -- round-trip-render`
Expected: PASS.

> If it FAILS because the label/disabled state does not update, that is a genuine renderer-reactivity finding — debug it with `superpowers:systematic-debugging` (likely the surface reference or signal subscription), do not weaken the assertions. The fix belongs in this task.

- [ ] **Step 3: Commit**

```bash
git add client/tests/round-trip-render.test.tsx
git commit -m "test(phase-2): CI proof that a server-style update re-renders the surface"
```

---

### Task 6: Manual-verify checklist + run commands in `client/README.md`

Document the env var and the reproducible 3-check manual round-trip (the project "no guessed run commands" rule).

**Files:**
- Modify: `client/README.md`

**Interfaces:**
- Consumes: the running `agent/` server (Task 2.4, on `main`) and the wired client (Tasks 1–4).
- Produces: documentation only.

- [ ] **Step 1: Replace the skeleton README body**

Replace the contents of `client/README.md` with:

```markdown
# client

The thin React + [Primer](https://primer.style/) demo app that renders A2UI surfaces through
[`primer-a2ui-adapter`](../primer-a2ui-adapter) and round-trips Button `event` actions to the
deterministic A2A server in [`agent/`](../agent).

The fixture-driven test space is a **dev oracle**: known-good A2UI loaded locally, so no LLM is
involved during development. `functionCall` actions run locally; `event` actions go over A2A to the
server and the response feeds back into the same processor to re-render.

## Commands

```bash
yarn workspace client run dev        # vite dev server
yarn workspace client run build      # tsc --noEmit && vite build
yarn workspace client run typecheck
yarn workspace client run test       # vitest (jsdom + RTL)
yarn workspace client run test:e2e   # playwright visual regression
```

## A2A server URL

The client sends `event` actions to `VITE_A2A_SERVER_URL` (default `http://localhost:10002`):

```bash
VITE_A2A_SERVER_URL=http://localhost:10002 yarn workspace client run dev
```

When developing over a VS Code tunnel, the forwarded localhost port is reachable at its
`https://<id>-10002.<region>.devtunnels.ms` URL; point the var there if the browser origin cannot
reach localhost directly. The server's CORS policy already allows localhost and `*.devtunnels.ms`.

## Manual round-trip verification (not in CI)

Closes the genuine FE↔server `event` round-trip. CI covers marshalling/extraction and re-render
reactivity with the transport mocked; this confirms the real wire.

1. Start the deterministic server: `cd agent && uv run python -m deterministic_agent --host localhost --port 10002`.
2. Start the client: `yarn workspace client run dev`, open it, select the **button-event** fixture.
3. **Re-render:** click **Send event** → the label flips to `✅ Sent — server received submit` and
   the button becomes disabled. (Confirm live in Claude Chrome with before/after screenshots.)
4. **Wire confirmed:** the request actually hit the Python server — verify via the server log or a
   `message/send` POST to `:10002` in the browser Network panel (not just the UI changing).
5. **Failure path:** stop the server and click again → the console logs `[A2UI:a2a]` with the error
   and the UI stays put (no throw).
```

> Run command verified against `agent/README.md`: `uv run python -m deterministic_agent --host localhost --port 10002`.

- [ ] **Step 2: Commit**

```bash
git add client/README.md
git commit -m "docs(phase-2): client README — A2A server URL + manual round-trip checklist"
```

---

### Task 7: Manual round-trip + Claude Chrome live confirmation

The actual manual verification gate. Not a code change — produces evidence, no commit.

**Files:** none (verification only).

**Interfaces:**
- Consumes: the wired client (Tasks 1–6) + the `agent/` server.
- Produces: confirmation (screenshots / notes) that the live round-trip passes all three checks.

- [ ] **Step 1: Start the server**

Run: `cd agent && uv run python -m deterministic_agent --host localhost --port 10002`
Expected: A2A server listening on `:10002`; `curl http://localhost:10002/.well-known/agent-card.json` returns the agent card JSON.

- [ ] **Step 2: Start the client**

Run: `yarn workspace client run dev`
Open the dev URL (or its tunneled URL), select the **button-event** fixture.

- [ ] **Step 3: Confirm the three checks in Claude Chrome**

- **Re-render:** click **Send event**; capture before/after screenshots showing the label flip to `✅ Sent — server received submit` and the button disabled.
- **Wire confirmed:** observe the `message/send` request to `:10002` in the Network panel (or the server log line).
- **Failure path:** stop the server, click again; confirm a `[A2UI:a2a]` console error and an unchanged UI.

- [ ] **Step 4: Report**

Summarize the three checks (pass/fail) with the Chrome screenshots. No commit. If any check fails, debug with `superpowers:systematic-debugging` and route the fix back to the owning task (Task 4 for wiring, Task 5/renderer for re-render).

---

## Self-Review

**Spec coverage (against `_dev/docs/spec/phase-2-complete-component-slice.md` + TODO 2.5):**
- "Wire the real A2A client middleware as the `actionHandler`" → Tasks 3 (factory) + 4 (wiring).
- Decision #5 `event` path over A2A to the server, response re-renders → Tasks 3, 4, 5, 7.
- Decision #9 response feeds back into the *same* processor → Task 4 late-binding `apply` seam.
- Decision #10 CI = mocked transport on the client; manual = genuine wire; Claude Chrome live → Tasks 2/3/5 (CI) + 6/7 (manual + Chrome).
- Decision #2 single-shot now, parsing extractable for Phase 5 streaming → Task 2 (`extractA2uiMessages` + `TODO(phase-5)`).
- "no LLM in dev" rationale → Task 6 README framing.

**Placeholder scan:** every code step shows full code; every run step gives the exact command + expected result. The only deferred specifics are flagged as in-task verifications (agent run command vs `agent/README.md`; re-render reactivity as a real debug branch) — not silent gaps.

**Type consistency:** `makeActionHandler: (apply: (messages: A2uiMessage[]) => void) => ActionListener` is identical across `FixtureView`, `TestSpace`, `App`, and the `helpers` wrap. `apply: (messages: A2uiMessage[]) => void` matches `createA2AActionHandler`'s option. `A2AMessageSender.sendMessage` returns `Promise<SendMessageResponse>`, matching the real `A2AClient.sendMessage` signature, so the fake and the real client are interchangeable. `extractA2uiMessages` consumes `Task | Message` (= `SendMessageSuccessResponse['result']`).
</content>
</invoke>
