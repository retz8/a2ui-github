/**
 * The live agent reuses semantic surface ids across turns and re-emits createSurface each
 * time. These lock in that a repeat repaints the surface cleanly instead of throwing.
 */
import {describe, it, expect, afterEach} from 'vitest';
import {render, screen, cleanup, waitFor} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import type {MessageSendParams, Part, TaskStatusUpdateEvent} from '@a2a-js/sdk';
import {CATALOG_ID} from 'primer-a2ui-adapter';
import type {A2AMessageSender} from '../a2a/client';
import {Providers} from '../providers';
import {ChatView} from './ChatView';

afterEach(cleanup);

const TURN_ONE = [
  {version: 'v0.9', createSurface: {surfaceId: 'chat', catalogId: CATALOG_ID}},
  {
    version: 'v0.9',
    updateComponents: {
      surfaceId: 'chat',
      components: [
        {id: 'root', component: 'Stack', children: ['a', 'b']},
        {id: 'a', component: 'Text', text: 'alpha'},
        {id: 'b', component: 'Text', text: 'beta'},
      ],
    },
  },
];

// The same surfaceId again — and 'b' is deliberately NOT redeclared, so a patch-in-place
// implementation would leave 'beta' on screen.
const TURN_TWO = [
  {version: 'v0.9', createSurface: {surfaceId: 'chat', catalogId: CATALOG_ID}},
  {
    version: 'v0.9',
    updateComponents: {
      surfaceId: 'chat',
      components: [
        {id: 'root', component: 'Stack', children: ['a']},
        {id: 'a', component: 'Text', text: 'gamma'},
      ],
    },
  },
];

function eventOf(messages: unknown[]): TaskStatusUpdateEvent {
  const parts: Part[] = messages.map(data => ({kind: 'data', data}) as Part);
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

/** Answers each send with a different turn, indexed off how many sends have happened. */
function fakeSender() {
  const sent: MessageSendParams[] = [];
  const turns = [TURN_ONE, TURN_TWO];
  const sender: A2AMessageSender = {
    async *sendMessageStream(params) {
      const turn = turns[Math.min(sent.length, turns.length - 1)];
      sent.push(params);
      yield eventOf(turn);
    },
  };
  return {sender, sent};
}

async function sendPrompt(user: ReturnType<typeof userEvent.setup>, prompt: string) {
  await user.type(screen.getByRole('textbox', {name: /prompt/i}), prompt);
  await user.click(screen.getByRole('button', {name: /send/i}));
  await waitFor(() => expect(screen.queryByTestId('chat-pending')).not.toBeInTheDocument());
}

describe('ChatView repaint', () => {
  it('repaints a re-created surface without stale content or a duplicate entry', async () => {
    const user = userEvent.setup();
    const {sender} = fakeSender();
    render(
      <Providers>
        <ChatView client={sender} />
      </Providers>,
    );

    await sendPrompt(user, 'first prompt');
    expect(await screen.findByText('alpha')).toBeInTheDocument();

    await sendPrompt(user, 'second prompt');

    expect(await screen.findByText('gamma')).toBeInTheDocument();
    expect(screen.queryByText('alpha')).not.toBeInTheDocument();
    expect(screen.queryByText('beta')).not.toBeInTheDocument(); // the stale-content guard
    expect(screen.getAllByTestId('surface-chat')).toHaveLength(1);
    expect(screen.queryByTestId('chat-error-turn')).not.toBeInTheDocument();
  });

  it('places the repainted surface after the prompt that produced it', async () => {
    const user = userEvent.setup();
    const {sender} = fakeSender();
    render(
      <Providers>
        <ChatView client={sender} />
      </Providers>,
    );

    await sendPrompt(user, 'first prompt');
    await sendPrompt(user, 'second prompt');

    const prompt = screen.getByText('second prompt');
    const surface = screen.getByTestId('surface-chat');
    // Locks in the accepted move-to-bottom: a repaint answers the newest turn, so it must
    // not render above the bubble that provoked it.
    expect(prompt.compareDocumentPosition(surface) & Node.DOCUMENT_POSITION_FOLLOWING).toBe(
      Node.DOCUMENT_POSITION_FOLLOWING,
    );
  });
});
