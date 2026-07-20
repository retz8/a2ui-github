import type {
  MessageSendParams,
  Task,
  TaskArtifactUpdateEvent,
  TaskStatusUpdateEvent,
  Message,
  Part,
} from '@a2a-js/sdk';
import type {A2uiClientAction, A2uiMessage} from '@a2ui/web_core/v0_9';

/**
 * What `sendMessageStream` yields. The SDK declares this union on its client but does not export
 * it publicly, so it is restated here from the public event types.
 */
export type A2AStreamEventData = Message | Task | TaskStatusUpdateEvent | TaskArtifactUpdateEvent;

const A2UI_VERSION = 'v0.9' as const;

/** Wrap an A2UI client action as A2A send params carrying one v0.9 A2UI DataPart. */
export function buildActionMessageParams(
  action: A2uiClientAction,
  contextId?: string,
): MessageSendParams {
  return {
    message: {
      kind: 'message',
      role: 'user',
      messageId: crypto.randomUUID(),
      contextId,
      parts: [{kind: 'data', data: {version: A2UI_VERSION, action}}],
    },
  };
}

/** Wrap user prompt text as A2A send params carrying one TextPart. */
export function buildTextMessageParams(text: string, contextId?: string): MessageSendParams {
  return {
    message: {
      kind: 'message',
      role: 'user',
      messageId: crypto.randomUUID(),
      contextId,
      parts: [{kind: 'text', text}],
    },
  };
}

/**
 * Pull A2UI messages out of a single A2A stream event.
 *
 * A2UI rides the status message of `Task` / `TaskStatusUpdateEvent` (and the parts of a direct
 * agent `Message`) as version-tagged DataParts. `TaskArtifactUpdateEvent` is ignored — our agents
 * never deliver A2UI as artifacts.
 */
export function extractA2uiMessagesFromEvent(event: A2AStreamEventData): A2uiMessage[] {
  let parts: Part[];
  switch (event.kind) {
    case 'message':
      parts = event.parts;
      break;
    case 'task':
    case 'status-update':
      parts = event.status.message?.parts ?? [];
      break;
    default:
      return [];
  }
  return (
    parts
      .filter((p): p is Extract<Part, {kind: 'data'}> => p.kind === 'data')
      .map(p => p.data as unknown)
      // Keyed off the inline `version` field each A2UI message carries — NOT the
      // DataPart's MIME metadata (the A2A SDK tags version there, not in `data`).
      .filter((d): d is A2uiMessage => (d as {version?: unknown}).version === A2UI_VERSION)
  );
}

/** Pull A2UI messages out of a non-streaming A2A send result. */
export function extractA2uiMessages(result: Task | Message): A2uiMessage[] {
  return extractA2uiMessagesFromEvent(result);
}

/** The conversation contextId carried by an A2A stream event, if any. */
export function extractContextId(event: A2AStreamEventData): string | undefined {
  return event.contextId;
}
