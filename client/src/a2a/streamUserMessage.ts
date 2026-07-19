import type {A2uiMessage} from '@a2ui/web_core/v0_9';
import type {GetSender} from './client';
import {sendAndApply} from './client';
import {buildTextMessageParams} from './messages';
import type {A2ASession} from './session';

export interface StreamUserMessageOptions {
  getSender: GetSender;
  /** Applies the streamed A2UI messages into the processor. */
  apply: (messages: A2uiMessage[]) => void;
  /** Conversation session; threads the contextId across turns when given. */
  session?: A2ASession;
}

/**
 * Ship one user prompt to the agent and feed the streamed A2UI back through `apply`. Resolves
 * when the stream closes — awaiting this is the pending state. Never throws: wire/extract
 * failures are caught and logged, and `apply` is skipped.
 */
export async function streamUserMessage(
  text: string,
  opts: StreamUserMessageOptions,
): Promise<void> {
  const {getSender, apply, session} = opts;
  try {
    const sender = await getSender();
    await sendAndApply(sender, buildTextMessageParams(text, session?.get()), apply, session);
  } catch (err) {
    console.error('[A2UI:a2a]', err);
  }
}
