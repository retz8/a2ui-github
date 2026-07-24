import {describe, it, expect, afterEach, beforeEach, vi} from 'vitest';
import {render, screen, cleanup} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import type {Part, TaskStatusUpdateEvent} from '@a2a-js/sdk';
import type {A2AMessageSender} from '../a2a/client';
import {Providers} from '../providers';
import {ChatView} from './ChatView';

// The real adapter catalog, with Text swapped for an always-throwing implementation:
// drives a genuine surface render crash through MessageProcessor + A2uiSurface.
vi.mock('primer-a2ui-adapter', async importOriginal => {
  const actual = await importOriginal<typeof import('primer-a2ui-adapter')>();
  const {Catalog} = await import('@a2ui/web_core/v0_9');
  const {createComponentImplementation} = await import('@a2ui/react/v0_9');
  const {z} = await import('zod');
  const BombText = createComponentImplementation({name: 'Text', schema: z.object({text: z.any()})}, () => {
    throw new Error('surface render exploded');
  });
  return {...actual, CATALOG: new Catalog(actual.CATALOG_ID, [BombText])};
});

afterEach(cleanup);

beforeEach(() => {
  vi.spyOn(console, 'error').mockImplementation(() => {});
});
afterEach(() => {
  vi.restoreAllMocks();
});

function surfaceEvent(catalogId: string): TaskStatusUpdateEvent {
  const messages = [
    {version: 'v0.9', createSurface: {surfaceId: 'chat', catalogId}},
    {
      version: 'v0.9',
      updateComponents: {
        surfaceId: 'chat',
        components: [{id: 'root', component: 'Text', text: 'hello from the agent'}],
      },
    },
  ];
  const parts: Part[] = messages.map(data => ({kind: 'data', data}));
  return {
    kind: 'status-update',
    taskId: 't1',
    contextId: 'ctx-1',
    final: true,
    status: {
      state: 'completed',
      message: {kind: 'message', role: 'agent', messageId: 'm1', parts},
    },
  };
}

describe('ChatView surface crash containment', () => {
  it('shows the surface fallback and keeps the chat shell alive', async () => {
    const {CATALOG_ID} = await import('primer-a2ui-adapter');
    const sender: A2AMessageSender = {
      // eslint-disable-next-line require-yield
      async *sendMessageStream() {
        yield surfaceEvent(CATALOG_ID);
      },
    };
    render(
      <Providers>
        <ChatView client={sender} />
      </Providers>,
    );

    const user = userEvent.setup();
    await user.type(screen.getByRole('textbox', {name: /prompt/i}), 'show me open PRs');
    await user.click(screen.getByRole('button', {name: /send/i}));

    // The crashing surface degrades to its fallback…
    expect(await screen.findByTestId('surface-error-chat')).toBeInTheDocument();
    expect(screen.getByText('This view failed to render.')).toBeInTheDocument();
    // …while the rest of the transcript and the composer survive.
    expect(screen.getByText('show me open PRs')).toBeInTheDocument();
    expect(screen.getByRole('textbox', {name: /prompt/i})).toBeInTheDocument();
  });
});
