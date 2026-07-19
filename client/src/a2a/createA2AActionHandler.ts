import type {ActionListener, A2uiMessage} from '@a2ui/web_core/v0_9';
import type {A2AMessageSender, GetSender} from './client';
import {createSenderResolver, sendAndApply} from './client';
import {buildActionMessageParams} from './messages';
import type {A2ASession} from './session';

export interface A2AActionHandlerOptions {
  /** Applies the server-returned A2UI messages back into the processor. */
  apply: (messages: A2uiMessage[]) => void;
  /** Base server URL, e.g. http://localhost:10002. Resolves the agent card. */
  serverUrl?: string;
  /** Pre-resolved / fake sender. Takes precedence over serverUrl (tests). */
  client?: A2AMessageSender;
  /** Shared lazy sender; takes precedence over serverUrl/client (shares one card fetch). */
  getSender?: GetSender;
  /** Conversation session; threads the contextId across turns when given. */
  session?: A2ASession;
}

/**
 * Builds an ActionListener that ships an `event` action to an A2A agent over the event stream and
 * feeds the streamed A2UI back through `apply`. Transport-only: no React or fixture knowledge.
 * The returned listener never throws — wire/extract failures are caught and logged, and `apply`
 * is skipped.
 */
export function createA2AActionHandler(opts: A2AActionHandlerOptions): ActionListener {
  const {apply, serverUrl, client, session} = opts;
  const getSender = opts.getSender ?? createSenderResolver({serverUrl, client});

  return async action => {
    try {
      const sender = await getSender();
      await sendAndApply(sender, buildActionMessageParams(action, session?.get()), apply, session);
    } catch (err) {
      console.error('[A2UI:a2a]', err);
    }
  };
}
