/**
 * The agent answers in prose when it cannot build a surface: a validator-exhausted turn tears the
 * half-built surface down and apologises as a TextPart. That text used to be dropped on the floor —
 * only DataParts were read — so the turn ended with the surface removed, nothing rendered, and not
 * even a console error. These lock in that the agent's words reach the transcript.
 */
import {describe, it, expect, afterEach} from 'vitest';
import {render, screen, cleanup, waitFor} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import type {Part, TaskStatusUpdateEvent} from '@a2a-js/sdk';
import {CATALOG_ID} from 'primer-a2ui-adapter';
import type {A2AMessageSender} from '../a2a/client';
import {Providers} from '../providers';
import {ChatView} from './ChatView';

afterEach(cleanup);

const APOLOGY = 'Sorry — I could not build a surface for that.';

const surface = (text: string) => [
  {version: 'v0.9', createSurface: {surfaceId: 'chat', catalogId: CATALOG_ID}},
  {
    version: 'v0.9',
    updateComponents: {surfaceId: 'chat', components: [{id: 'root', component: 'Text', text}]},
  },
];

function eventOf(parts: Part[], final = true): TaskStatusUpdateEvent {
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

const textEvent = (text: string, final = true) => eventOf([{kind: 'text', text}], final);
const surfaceEvent = (text: string, final = true) =>
  eventOf(
    surface(text).map(data => ({kind: 'data', data}) as Part),
    final,
  );

function senderOf(events: TaskStatusUpdateEvent[]): A2AMessageSender {
  return {
    async *sendMessageStream() {
      yield* events;
    },
  };
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

describe('ChatView agent text', () => {
  it('renders a text-only response, so a turn that built no surface still says something', async () => {
    const user = userEvent.setup();
    renderChat(senderOf([textEvent(APOLOGY)]));

    await sendPrompt(user, 'show me');

    expect(await screen.findByText(APOLOGY)).toBeInTheDocument();
    await waitFor(() => expect(screen.queryByTestId('chat-pending')).not.toBeInTheDocument());
  });

  it('shows agent text alongside a surface when the turn carries both', async () => {
    const user = userEvent.setup();
    renderChat(senderOf([textEvent('here is what I found', false), surfaceEvent('rendered')]));

    await sendPrompt(user, 'show me');

    expect(await screen.findByText('here is what I found')).toBeInTheDocument();
    expect(await screen.findByText('rendered')).toBeInTheDocument();
  });

  it('joins streamed chunks into one bubble, so prose is not split mid-word', async () => {
    const user = userEvent.setup();
    // The agent streams prose in parts; one bubble per part split words in half.
    renderChat(
      senderOf([
        textEvent('Here are the open pull requests on ', false),
        textEvent('a2ui-project/a2ui.', true),
      ]),
    );

    await sendPrompt(user, 'show me');

    const bubbles = await screen.findAllByTestId('chat-agent-text');
    expect(bubbles).toHaveLength(1);
    expect(bubbles[0]).toHaveTextContent('Here are the open pull requests on a2ui-project/a2ui.');
  });

  it('opens no bubble for a whitespace-only response', async () => {
    const user = userEvent.setup();
    renderChat(senderOf([textEvent('   ')]));

    await sendPrompt(user, 'show me');

    await waitFor(() => expect(screen.queryByTestId('chat-pending')).not.toBeInTheDocument());
    expect(screen.queryByTestId('chat-agent-text')).not.toBeInTheDocument();
  });

  it('does not render an agent bubble for a surface-only turn', async () => {
    const user = userEvent.setup();
    renderChat(senderOf([surfaceEvent('rendered')]));

    await sendPrompt(user, 'show me');

    expect(await screen.findByText('rendered')).toBeInTheDocument();
    expect(screen.queryByTestId('chat-agent-text')).not.toBeInTheDocument();
  });
});
