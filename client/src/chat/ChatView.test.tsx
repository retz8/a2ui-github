import {describe, it, expect, afterEach} from 'vitest';
import {render, screen, cleanup, waitFor} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import type {MessageSendParams, Part, TaskStatusUpdateEvent} from '@a2a-js/sdk';
import {CATALOG_ID} from 'primer-a2ui-adapter';
import type {A2AMessageSender} from '../a2a/client';
import {Providers} from '../providers';
import {ChatView} from './ChatView';

afterEach(cleanup);

const SURFACE_MESSAGES = [
  {version: 'v0.9', createSurface: {surfaceId: 'chat', catalogId: CATALOG_ID}},
  {
    version: 'v0.9',
    updateComponents: {
      surfaceId: 'chat',
      components: [{id: 'root', component: 'Text', text: 'hello from the agent'}],
    },
  },
];

function surfaceEvent(contextId = 'ctx-1'): TaskStatusUpdateEvent {
  const parts: Part[] = SURFACE_MESSAGES.map(data => ({kind: 'data', data}));
  return {
    kind: 'status-update',
    taskId: 't1',
    contextId,
    final: true,
    status: {
      state: 'completed',
      message: {kind: 'message', role: 'agent', messageId: 'm1', parts},
    },
  };
}

function fakeSender() {
  const sent: MessageSendParams[] = [];
  let release: () => void = () => {};
  const gate = new Promise<void>(resolve => {
    release = resolve;
  });
  const sender: A2AMessageSender = {
    async *sendMessageStream(params) {
      sent.push(params);
      await gate;
      yield surfaceEvent();
    },
  };
  return {sender, sent, release};
}

function renderChat(sender: A2AMessageSender) {
  return render(
    <Providers>
      <ChatView client={sender} />
    </Providers>,
  );
}

async function sendPrompt(text: string) {
  const user = userEvent.setup();
  await user.type(screen.getByRole('textbox', {name: /prompt/i}), text);
  await user.click(screen.getByRole('button', {name: /send/i}));
}

describe('ChatView', () => {
  it('sends the prompt, shows pending while the stream is open, then renders the surface', async () => {
    const {sender, sent, release} = fakeSender();
    renderChat(sender);

    await sendPrompt('show me open PRs');

    expect(sent).toHaveLength(1);
    expect(sent[0].message.parts).toEqual([{kind: 'text', text: 'show me open PRs'}]);
    expect(screen.getByTestId('chat-pending')).toBeInTheDocument();

    release();

    expect(await screen.findByText('hello from the agent')).toBeInTheDocument();
    await waitFor(() => expect(screen.queryByTestId('chat-pending')).not.toBeInTheDocument());
  });

  it('disables the input and send button while pending', async () => {
    const {sender, release} = fakeSender();
    renderChat(sender);

    await sendPrompt('hi');

    expect(screen.getByRole('textbox', {name: /prompt/i})).toBeDisabled();
    expect(screen.getByRole('button', {name: /send/i})).toBeDisabled();
    release();
    await waitFor(() => expect(screen.getByRole('textbox', {name: /prompt/i})).toBeEnabled());
  });

  it('threads the captured contextId into the next prompt', async () => {
    const {sender, sent, release} = fakeSender();
    renderChat(sender);

    await sendPrompt('first');
    release();
    await waitFor(() => expect(screen.getByRole('textbox', {name: /prompt/i})).toBeEnabled());

    await sendPrompt('second');

    expect(sent[0].message.contextId).toBeUndefined();
    expect(sent[1].message.contextId).toBe('ctx-1');
  });

  it('does not send an empty prompt', async () => {
    const {sender, sent} = fakeSender();
    renderChat(sender);
    const user = userEvent.setup();

    await user.click(screen.getByRole('button', {name: /send/i}));

    expect(sent).toHaveLength(0);
  });
});
