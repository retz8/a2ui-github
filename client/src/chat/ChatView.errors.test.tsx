/**
 * A failure used to be invisible: one rejected message aborted the whole turn and only
 * reached the browser console. These lock in that the turn survives and the user is told.
 */
import {describe, it, expect, afterEach, beforeEach, vi} from 'vitest';
import {render, screen, cleanup, waitFor} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import type {MessageSendParams, Part, TaskStatusUpdateEvent} from '@a2a-js/sdk';
import {CATALOG_ID} from 'primer-a2ui-adapter';
import type {A2AMessageSender} from '../a2a/client';
import {Providers} from '../providers';
import {ChatView} from './ChatView';

afterEach(cleanup);

let errorSpy: ReturnType<typeof vi.spyOn>;
beforeEach(() => {
  errorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
});
afterEach(() => errorSpy.mockRestore());

// Addresses a surface that was never created — the processor rejects it.
const GHOST = {
  version: 'v0.9',
  updateComponents: {
    surfaceId: 'ghost',
    components: [{id: 'root', component: 'Text', text: 'never rendered'}],
  },
};

const good = (text: string) => [
  {version: 'v0.9', createSurface: {surfaceId: 'chat', catalogId: CATALOG_ID}},
  {
    version: 'v0.9',
    updateComponents: {
      surfaceId: 'chat',
      components: [{id: 'root', component: 'Text', text}],
    },
  },
];

function eventOf(messages: unknown[], final = true): TaskStatusUpdateEvent {
  const parts: Part[] = messages.map(data => ({kind: 'data', data}) as Part);
  return {
    kind: 'status-update',
    taskId: 't1',
    contextId: 'ctx-1',
    final,
    status: {
      state: final ? 'completed' : 'working',
      message: {kind: 'message', role: 'agent', messageId: 'm1', parts},
    },
  };
}

function senderOf(events: TaskStatusUpdateEvent[]) {
  const sent: MessageSendParams[] = [];
  const sender: A2AMessageSender = {
    async *sendMessageStream(params) {
      sent.push(params);
      yield* events;
    },
  };
  return {sender, sent};
}

async function sendPrompt(user: ReturnType<typeof userEvent.setup>, prompt: string) {
  await user.type(screen.getByRole('textbox', {name: /prompt/i}), prompt);
  await user.click(screen.getByRole('button', {name: /send/i}));
}

function renderChat(sender: A2AMessageSender) {
  render(
    <Providers>
      <ChatView client={sender} />
    </Providers>,
  );
}

describe('ChatView failure reporting', () => {
  it('keeps the rest of the response when one message is rejected, and shows the failure', async () => {
    const user = userEvent.setup();
    const {sender} = senderOf([eventOf([GHOST, ...good('hello from the agent')])]);
    renderChat(sender);

    await sendPrompt(user, 'show me');

    expect(await screen.findByText('hello from the agent')).toBeInTheDocument();
    expect(await screen.findByTestId('chat-error-turn')).toHaveTextContent(
      /could not be displayed/i,
    );
    await waitFor(() => expect(screen.queryByTestId('chat-pending')).not.toBeInTheDocument());
  });

  it('keeps consuming the stream after a rejected message', async () => {
    const user = userEvent.setup();
    // The regression for the original bug: a throw in event 1 used to abandon the
    // `for await`, so event 2 was never read.
    const {sender} = senderOf([
      eventOf([GHOST], false),
      eventOf(good('second event survived')),
    ]);
    renderChat(sender);

    await sendPrompt(user, 'show me');

    expect(await screen.findByText('second event survived')).toBeInTheDocument();
  });

  it('collapses consecutive identical failures into one turn', async () => {
    const user = userEvent.setup();
    // Three messages for the same missing surface fail with the identical reason; repeating
    // that once per message would bury the transcript under copies of one problem.
    const {sender} = senderOf([eventOf([GHOST, GHOST, GHOST, ...good('still rendered')])]);
    renderChat(sender);

    await sendPrompt(user, 'show me');

    expect(await screen.findByText('still rendered')).toBeInTheDocument();
    expect(screen.getAllByTestId('chat-error-turn')).toHaveLength(1);
  });

  it('keeps a distinct root cause visible rather than collapsing it away', async () => {
    const user = userEvent.setup();
    // The unknown catalog is the real cause; the follow-up messages then fail with a
    // different, identical-to-each-other reason. Two turns: the cause, then the cascade.
    const {sender} = senderOf([
      eventOf([
        {version: 'v0.9', createSurface: {surfaceId: 'x', catalogId: 'no-such-catalog'}},
        {
          version: 'v0.9',
          updateComponents: {
            surfaceId: 'x',
            components: [{id: 'root', component: 'Text', text: 'a'}],
          },
        },
        {version: 'v0.9', updateDataModel: {surfaceId: 'x', path: '/', contents: {}}},
      ]),
    ]);
    renderChat(sender);

    await sendPrompt(user, 'show me');

    const errors = await screen.findAllByTestId('chat-error-turn');
    expect(errors).toHaveLength(2);
    expect(errors[0]).toHaveTextContent(/no-such-catalog/);
  });

  it('shows a transport failure in the transcript and re-enables the composer', async () => {
    const user = userEvent.setup();
    const failing: A2AMessageSender = {
      // eslint-disable-next-line require-yield
      async *sendMessageStream() {
        throw new Error('wire down');
      },
    };
    renderChat(failing);

    await sendPrompt(user, 'show me');

    expect(await screen.findByTestId('chat-error-turn')).toHaveTextContent(/request failed/i);
    await waitFor(() => expect(screen.queryByTestId('chat-pending')).not.toBeInTheDocument());
    expect(screen.getByRole('textbox', {name: /prompt/i})).not.toBeDisabled();
  });
});
