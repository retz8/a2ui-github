import {A2AClient} from '@a2a-js/sdk/client';
import type {MessageSendParams, SendMessageResponse} from '@a2a-js/sdk';
import type {ActionListener, A2uiMessage} from '@a2ui/web_core/v0_9';
import {buildActionMessageParams, extractA2uiMessages} from './messages';

const AGENT_CARD_PATH = '/.well-known/agent-card.json';

/** The slice of A2AClient the handler needs; lets tests inject a fake. */
export interface A2AMessageSender {
  sendMessage(params: MessageSendParams): Promise<SendMessageResponse>;
}

export interface A2AActionHandlerOptions {
  /** Applies the server-returned A2UI messages back into the processor. */
  apply: (messages: A2uiMessage[]) => void;
  /** Base server URL, e.g. http://localhost:10002. Resolves the agent card. */
  serverUrl?: string;
  /** Pre-resolved / fake sender. Takes precedence over serverUrl (tests). */
  client?: A2AMessageSender;
}

/**
 * Builds an ActionListener that ships an `event` action to an A2A agent and
 * feeds the agent's A2UI response back through `apply`. Transport-only: no React
 * or fixture knowledge. The returned listener never throws — wire/extract
 * failures are caught and logged, and `apply` is skipped.
 */
export function createA2AActionHandler(opts: A2AActionHandlerOptions): ActionListener {
  const {apply, serverUrl, client} = opts;
  let senderPromise: Promise<A2AMessageSender> | undefined;

  const getSender = (): Promise<A2AMessageSender> => {
    if (client) return Promise.resolve(client);
    if (!serverUrl) {
      return Promise.reject(new Error('createA2AActionHandler: serverUrl or client required'));
    }
    // Lazily resolve the agent card once; clear the cache on failure so a later
    // click retries (e.g. after the dev server is started).
    if (!senderPromise) {
      senderPromise = A2AClient.fromCardUrl(`${serverUrl}${AGENT_CARD_PATH}`).catch(err => {
        senderPromise = undefined;
        throw err;
      });
    }
    return senderPromise;
  };

  return async action => {
    try {
      const sender = await getSender();
      const response = await sender.sendMessage(buildActionMessageParams(action));
      if ('error' in response) {
        console.error('[A2UI:a2a]', response.error);
        return;
      }
      apply(extractA2uiMessages(response.result));
    } catch (err) {
      console.error('[A2UI:a2a]', err);
    }
  };
}
