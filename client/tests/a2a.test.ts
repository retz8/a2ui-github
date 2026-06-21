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
