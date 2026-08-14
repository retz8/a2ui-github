/**
 * The canvas page (task 8.2): stage + palette + status strip + ambient notice assembled over
 * the chat page's transport, with the ?beat= fixture-replay affordance.
 */
import {describe, it, expect, afterEach} from 'vitest';
import {render, screen, cleanup, waitFor} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import type {MessageSendParams, Part, TaskStatusUpdateEvent} from '@a2a-js/sdk';
import {CATALOG_ID} from 'primer-a2ui-adapter';
import type {A2AMessageSender} from '../a2a/client';
import {Providers} from '../providers';
import {CanvasApp} from './CanvasApp';

afterEach(() => {
  cleanup();
  window.history.replaceState(null, '', window.location.pathname);
});

const SURFACE_MESSAGES = [
  {version: 'v0.9', createSurface: {surfaceId: 'answer', catalogId: CATALOG_ID}},
  {
    version: 'v0.9',
    updateComponents: {
      surfaceId: 'answer',
      components: [{id: 'root', component: 'Text', text: 'hello from the agent'}],
    },
  },
];

const ACTIONABLE_MESSAGES = [
  {version: 'v0.9', createSurface: {surfaceId: 'list', catalogId: CATALOG_ID}},
  {
    version: 'v0.9',
    updateComponents: {
      surfaceId: 'list',
      components: [
        {
          id: 'root',
          component: 'Button',
          child: 'label',
          action: {event: {name: 'open-issue', context: {}}},
        },
        {id: 'label', component: 'Text', text: 'Open issue'},
      ],
    },
  },
];

function eventOf(
  messages: Record<string, unknown>[],
  texts: string[] = [],
  contextId = 'ctx-1',
): TaskStatusUpdateEvent {
  const parts: Part[] = [
    ...texts.map(text => ({kind: 'text', text}) as Part),
    ...messages.map(data => ({kind: 'data', data}) as Part),
  ];
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

/** Every send yields `script[i]` (gated when `gated`), in call order. */
function scriptedSender(script: TaskStatusUpdateEvent[], gated = false) {
  const sent: MessageSendParams[] = [];
  let release: () => void = () => {};
  const gate = new Promise<void>(resolve => {
    release = resolve;
  });
  const sender: A2AMessageSender = {
    async *sendMessageStream(params) {
      const index = sent.length;
      sent.push(params);
      if (gated) await gate;
      yield script[Math.min(index, script.length - 1)];
    },
  };
  return {sender, sent, release};
}

function renderCanvas(sender?: A2AMessageSender) {
  return render(
    <Providers>
      <CanvasApp client={sender} />
    </Providers>,
  );
}

async function ask(text: string) {
  await userEvent.type(screen.getByRole('textbox', {name: /ask the agent/i}), `${text}{Enter}`);
}

describe('CanvasApp', () => {
  it('auto-opens the palette on an empty idle canvas', () => {
    renderCanvas();
    expect(screen.getByRole('textbox', {name: /ask the agent/i})).toHaveFocus();
  });

  it('Esc dismisses; ⌘K and the floating Ask pill summon it back', async () => {
    renderCanvas();
    // While the palette is open, the pill yields to it — one call-to-action at a time.
    expect(screen.queryByRole('button', {name: /^ask$/i})).toBeNull();

    await userEvent.keyboard('{Escape}');
    expect(screen.queryByRole('textbox', {name: /ask the agent/i})).toBeNull();

    await userEvent.keyboard('{Meta>}k{/Meta}');
    expect(screen.getByRole('textbox', {name: /ask the agent/i})).toBeInTheDocument();

    await userEvent.keyboard('{Escape}');
    await userEvent.click(screen.getByRole('button', {name: /^ask$/i}));
    expect(screen.getByRole('textbox', {name: /ask the agent/i})).toBeInTheDocument();
  });

  it('an utterance closes the palette, shows in-flight, and lands the paint on the stage', async () => {
    const {sender, sent, release} = scriptedSender([eventOf(SURFACE_MESSAGES)], true);
    renderCanvas(sender);

    await ask('show me something');

    expect(sent).toHaveLength(1);
    expect(screen.queryByRole('textbox', {name: /ask the agent/i})).toBeNull();
    expect(screen.getByTestId('canvas-pending')).toBeInTheDocument();

    release();

    expect(await screen.findByText('hello from the agent')).toBeInTheDocument();
    await waitFor(() => expect(screen.queryByTestId('canvas-pending')).toBeNull());
  });

  it('routes agent prose into the ambient notice', async () => {
    const {sender} = scriptedSender([eventOf(SURFACE_MESSAGES, ['here you go'])]);
    renderCanvas(sender);

    await ask('show me something');

    expect(await screen.findByTestId('canvas-notice')).toHaveTextContent('here you go');
  });

  it('a stage surface action dispatches to the agent and repaints the stage', async () => {
    const {sender, sent} = scriptedSender([
      eventOf(ACTIONABLE_MESSAGES),
      eventOf(SURFACE_MESSAGES),
    ]);
    renderCanvas(sender);

    await ask('show me issues');
    await userEvent.click(await screen.findByRole('button', {name: 'Open issue'}));

    expect(await screen.findByText('hello from the agent')).toBeInTheDocument();
    expect(sent).toHaveLength(2);
    expect(screen.queryByText('Open issue')).toBeNull();
  });

  it('blocks agent-bound surface actions while a paint is in flight', async () => {
    // First send resolves immediately with the actionable surface; the second stays gated so
    // the click's paint is observably in flight when the third click arrives.
    const sent: MessageSendParams[] = [];
    let release: () => void = () => {};
    const gate = new Promise<void>(resolve => {
      release = resolve;
    });
    const sender: A2AMessageSender = {
      async *sendMessageStream(params) {
        const index = sent.length;
        sent.push(params);
        if (index === 0) {
          yield eventOf(ACTIONABLE_MESSAGES);
          return;
        }
        await gate;
        yield eventOf(SURFACE_MESSAGES);
      },
    };
    renderCanvas(sender);
    await ask('show me issues');
    const button = await screen.findByRole('button', {name: 'Open issue'});

    await userEvent.click(button);
    expect(await screen.findByTestId('canvas-pending')).toBeInTheDocument();
    await userEvent.click(button);

    expect(sent).toHaveLength(2);
    release();
    await waitFor(() => expect(screen.queryByTestId('canvas-pending')).toBeNull());
  });

  it('?beat= replays a recorded beat onto the stage', async () => {
    window.history.replaceState(null, '', '?beat=1&instant');
    renderCanvas();

    await waitFor(() => {
      const stage = screen.getByTestId('canvas-stage');
      expect(stage).not.toBeEmptyDOMElement();
    });
    // Replay runs and settles; the palette did not auto-open over it.
    await waitFor(() => expect(screen.queryByTestId('canvas-pending')).toBeNull());
  });

  it('?beat= with an unknown beat reports a sticky error', async () => {
    window.history.replaceState(null, '', '?beat=42');
    renderCanvas();
    expect(await screen.findByRole('alert')).toHaveTextContent(/beat/i);
  });
});
