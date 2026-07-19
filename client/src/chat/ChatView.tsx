import {useState} from 'react';
import {Button, Spinner, Textarea} from '@primer/react';
import {MessageProcessor} from '@a2ui/web_core/v0_9';
import type {A2uiMessage} from '@a2ui/web_core/v0_9';
import {A2uiSurface} from '@a2ui/react/v0_9';
import {CATALOG} from 'primer-a2ui-adapter';
import type {A2ASenderOptions} from '../a2a/client';
import {createSenderResolver} from '../a2a/client';
import {createA2AActionHandler} from '../a2a/createA2AActionHandler';
import {createA2ASession} from '../a2a/session';
import {streamUserMessage} from '../a2a/streamUserMessage';
import {useSurfaces} from '../a2ui/useSurfaces';

/**
 * The minimal chat shell: prompt box + surface area + pending state. Host chrome only — stock
 * Primer components outside the catalog path; agent-generated surfaces render through
 * A2uiSurface. Both send paths (prompts and component actions) share one session and one lazily
 * resolved A2A client.
 */
export function ChatView({serverUrl, client}: A2ASenderOptions) {
  const [wiring] = useState(() => {
    const session = createA2ASession();
    const getSender = createSenderResolver({serverUrl, client});
    // Late-binding: `apply` reaches the processor that is created right below.
    // The handler only fires on a response, long after construction, so the
    // temporal cycle is harmless.
    // eslint-disable-next-line prefer-const
    let target: {processMessages: (m: A2uiMessage[]) => void} | undefined;
    const apply = (messages: A2uiMessage[]) => target?.processMessages(messages);
    const actionHandler = createA2AActionHandler({apply, getSender, session});
    const processor = new MessageProcessor([CATALOG], actionHandler);
    target = processor;
    return {processor, getSender, session, apply};
  });

  const [text, setText] = useState('');
  const [pending, setPending] = useState(false);
  const surfaces = useSurfaces(wiring.processor);

  const send = async () => {
    const prompt = text.trim();
    if (!prompt || pending) return;
    setText('');
    setPending(true);
    try {
      await streamUserMessage(prompt, {
        getSender: wiring.getSender,
        apply: wiring.apply,
        session: wiring.session,
      });
    } finally {
      setPending(false);
    }
  };

  return (
    <main>
      <div data-testid="chat-surfaces">
        {surfaces.map(surface => (
          <div key={surface.id} data-testid={`surface-${surface.id}`}>
            <A2uiSurface surface={surface} />
          </div>
        ))}
      </div>
      {pending && <Spinner size="small" data-testid="chat-pending" />}
      <form
        onSubmit={e => {
          e.preventDefault();
          void send();
        }}
      >
        <Textarea
          aria-label="Prompt"
          placeholder="Ask about the repository…"
          value={text}
          disabled={pending}
          onChange={e => setText(e.target.value)}
          onKeyDown={e => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault();
              void send();
            }
          }}
        />
        <Button type="submit" disabled={pending || !text.trim()}>
          Send
        </Button>
      </form>
    </main>
  );
}
