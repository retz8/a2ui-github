import {describe, it, expect, beforeEach, afterEach, vi} from 'vitest';
import type {Task, Message, MessageSendParams, SendMessageResponse} from '@a2a-js/sdk';
import type {A2uiClientAction} from '@a2ui/web_core/v0_9';
import {buildActionMessageParams, extractA2uiMessages} from '../src/a2a/messages';
import {createA2AActionHandler, agentCardUrl} from '../src/a2a/createA2AActionHandler';

const action = {
  name: 'submit',
  surfaceId: 'surface-1',
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
    updateDataModel: {surfaceId: 'surface-1', path: '/submitted', value: true},
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

describe('createA2AActionHandler', () => {
  const a2uiMsg = {
    version: 'v0.9',
    updateDataModel: {surfaceId: 'surface-1', path: '/received', value: true},
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
    expect(errSpy).toHaveBeenCalledWith('[A2UI:a2a]', expect.objectContaining({code: -32000}));
  });

  it('catch-and-logs when neither client nor serverUrl is provided', async () => {
    const apply = vi.fn();
    const handler = createA2AActionHandler({apply});
    await handler(action);
    expect(apply).not.toHaveBeenCalled();
    expect(errSpy).toHaveBeenCalledWith('[A2UI:a2a]', expect.any(Error));
  });
});

describe('agentCardUrl', () => {
  const CARD = '/.well-known/agent-card.json';

  it('appends the card path to a base URL without a trailing slash', () => {
    expect(agentCardUrl('https://host.example')).toBe(`https://host.example${CARD}`);
  });

  it('collapses a trailing slash instead of producing a double slash', () => {
    expect(agentCardUrl('https://host.example/')).toBe(`https://host.example${CARD}`);
  });

  it('collapses multiple trailing slashes', () => {
    expect(agentCardUrl('http://localhost:10002///')).toBe(`http://localhost:10002${CARD}`);
  });
});
