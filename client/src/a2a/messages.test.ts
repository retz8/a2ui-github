import {describe, it, expect} from 'vitest';
import type {
  Message,
  Part,
  Task,
  TaskArtifactUpdateEvent,
  TaskStatusUpdateEvent,
} from '@a2a-js/sdk';
import type {A2uiClientAction} from '@a2ui/web_core/v0_9';
import {
  buildActionMessageParams,
  buildTextMessageParams,
  extractA2uiMessages,
  extractA2uiMessagesFromEvent,
  extractContextId,
} from './messages';

const A2UI_DATA = {version: 'v0.9', createSurface: {surfaceId: 's', catalogId: 'cat'}};
const DATA_PART: Part = {kind: 'data', data: A2UI_DATA};
const TEXT_PART: Part = {kind: 'text', text: 'hello'};
const FOREIGN_PART: Part = {kind: 'data', data: {version: 'v0.8', foo: 1}};

const ACTION = {name: 'click', surfaceId: 's'} as unknown as A2uiClientAction;

function agentMessage(parts: Part[], contextId?: string): Message {
  return {kind: 'message', role: 'agent', messageId: 'm1', parts, contextId};
}

function task(parts: Part[] | undefined, contextId = 'ctx-task'): Task {
  return {
    kind: 'task',
    id: 't1',
    contextId,
    status: {state: 'completed', message: parts ? agentMessage(parts) : undefined},
  };
}

function statusUpdate(parts: Part[] | undefined, contextId = 'ctx-status'): TaskStatusUpdateEvent {
  return {
    kind: 'status-update',
    taskId: 't1',
    contextId,
    final: false,
    status: {state: 'working', message: parts ? agentMessage(parts) : undefined},
  };
}

function artifactUpdate(parts: Part[]): TaskArtifactUpdateEvent {
  return {
    kind: 'artifact-update',
    taskId: 't1',
    contextId: 'ctx-artifact',
    artifact: {artifactId: 'a1', parts},
  };
}

describe('buildTextMessageParams', () => {
  it('wraps user text as a single TextPart user message', () => {
    const params = buildTextMessageParams('show me open PRs');
    expect(params.message.kind).toBe('message');
    expect(params.message.role).toBe('user');
    expect(params.message.messageId).toBeTruthy();
    expect(params.message.parts).toEqual([{kind: 'text', text: 'show me open PRs'}]);
    expect(params.message.contextId).toBeUndefined();
  });

  it('threads a contextId when given', () => {
    const params = buildTextMessageParams('again', 'ctx-9');
    expect(params.message.contextId).toBe('ctx-9');
  });
});

describe('buildActionMessageParams', () => {
  it('wraps the action as a version-tagged DataPart without a contextId by default', () => {
    const params = buildActionMessageParams(ACTION);
    expect(params.message.parts).toEqual([{kind: 'data', data: {version: 'v0.9', action: ACTION}}]);
    expect(params.message.contextId).toBeUndefined();
  });

  it('threads a contextId when given', () => {
    const params = buildActionMessageParams(ACTION, 'ctx-9');
    expect(params.message.contextId).toBe('ctx-9');
  });
});

describe('extractA2uiMessagesFromEvent', () => {
  it('extracts version-tagged data parts from a direct agent Message', () => {
    expect(extractA2uiMessagesFromEvent(agentMessage([DATA_PART]))).toEqual([A2UI_DATA]);
  });

  it('extracts from a Task status message', () => {
    expect(extractA2uiMessagesFromEvent(task([DATA_PART]))).toEqual([A2UI_DATA]);
  });

  it('extracts from a TaskStatusUpdateEvent status message', () => {
    expect(extractA2uiMessagesFromEvent(statusUpdate([DATA_PART]))).toEqual([A2UI_DATA]);
  });

  it('ignores TaskArtifactUpdateEvent parts', () => {
    expect(extractA2uiMessagesFromEvent(artifactUpdate([DATA_PART]))).toEqual([]);
  });

  it('filters out text parts and non-v0.9 data parts', () => {
    const event = statusUpdate([TEXT_PART, FOREIGN_PART, DATA_PART]);
    expect(extractA2uiMessagesFromEvent(event)).toEqual([A2UI_DATA]);
  });

  it('returns [] for a Task with no status message', () => {
    expect(extractA2uiMessagesFromEvent(task(undefined))).toEqual([]);
  });
});

describe('extractA2uiMessages (terminal result)', () => {
  it('still extracts from a completed Task', () => {
    expect(extractA2uiMessages(task([DATA_PART]))).toEqual([A2UI_DATA]);
  });

  it('still extracts from a direct agent Message', () => {
    expect(extractA2uiMessages(agentMessage([DATA_PART]))).toEqual([A2UI_DATA]);
  });
});

describe('extractContextId', () => {
  it('reads contextId from each event kind', () => {
    expect(extractContextId(agentMessage([], 'ctx-msg'))).toBe('ctx-msg');
    expect(extractContextId(task([]))).toBe('ctx-task');
    expect(extractContextId(statusUpdate([]))).toBe('ctx-status');
    expect(extractContextId(artifactUpdate([]))).toBe('ctx-artifact');
  });

  it('returns undefined for a Message without one', () => {
    expect(extractContextId(agentMessage([]))).toBeUndefined();
  });
});
