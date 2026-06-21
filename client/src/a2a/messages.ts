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
