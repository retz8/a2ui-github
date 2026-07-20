import {useEffect, useRef, useState} from 'react';
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
import './ChatView.css';

/** One transcript entry: a typed user prompt, or an agent surface keyed by its id. */
type Turn = {kind: 'user'; key: number; text: string} | {kind: 'surface'; id: string};

/**
 * The chat shell: header, scrollable transcript (user bubbles interleaved with agent
 * surfaces), composer pinned at the bottom. Host chrome only — Primer components plus
 * Primer CSS vars; agent-generated surfaces render through A2uiSurface. Both send paths
 * (prompts and component actions) share one session and one lazily resolved A2A client.
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

  const [turns, setTurns] = useState<Turn[]>([]);
  const [text, setText] = useState('');
  const [pending, setPending] = useState(false);
  const userTurnKey = useRef(0);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Keep the transcript in step with the processor: append newly created surfaces in
  // arrival order, drop deleted ones.
  useEffect(() => {
    const sync = () => {
      const liveIds = Array.from(wiring.processor.model.surfacesMap.keys());
      setTurns(prev => {
        const live = new Set(liveIds);
        const kept = prev.filter(t => t.kind !== 'surface' || live.has(t.id));
        const known = new Set(
          kept.filter((t): t is Extract<Turn, {kind: 'surface'}> => t.kind === 'surface').map(t => t.id),
        );
        const added = liveIds.filter(id => !known.has(id));
        return added.length ? [...kept, ...added.map(id => ({kind: 'surface' as const, id}))] : kept;
      });
    };
    sync();
    const created = wiring.processor.onSurfaceCreated(sync);
    const deleted = wiring.processor.onSurfaceDeleted(sync);
    return () => {
      created.unsubscribe();
      deleted.unsubscribe();
    };
  }, [wiring.processor]);

  // Follow the conversation: stick to the bottom as turns and the pending state arrive.
  useEffect(() => {
    const el = scrollRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [turns, pending]);

  const send = async () => {
    const prompt = text.trim();
    if (!prompt || pending) return;
    setText('');
    setTurns(prev => [...prev, {kind: 'user', key: userTurnKey.current++, text: prompt}]);
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
    <main className="chat-app">
      <header className="chat-header">
        <span className="chat-header-title">a2ui-github</span>
        <span className="chat-header-sub">agent-generated UI over A2A</span>
      </header>

      <div className="chat-scroll" ref={scrollRef}>
        <div className="chat-thread">
          {turns.length === 0 && !pending && (
            <div className="chat-empty">Ask about the repository to get started.</div>
          )}
          {turns.map(turn =>
            turn.kind === 'user' ? (
              <div key={`user-${turn.key}`} className="chat-user-turn">
                {turn.text}
              </div>
            ) : (
              (surface =>
                surface && (
                  <div key={turn.id} className="chat-surface-turn" data-testid={`surface-${turn.id}`}>
                    <A2uiSurface surface={surface} />
                  </div>
                ))(wiring.processor.model.surfacesMap.get(turn.id))
            ),
          )}
          {pending && (
            <div className="chat-pending" data-testid="chat-pending">
              <Spinner size="small" />
              Generating…
            </div>
          )}
        </div>
      </div>

      <div className="chat-composer-bar">
        <form
          className="chat-composer"
          onSubmit={e => {
            e.preventDefault();
            void send();
          }}
        >
          <div className="chat-composer-input">
            <Textarea
              aria-label="Prompt"
              placeholder="Ask about the repository…"
              block
              rows={Math.min(6, text.split('\n').length)}
              resize="none"
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
          </div>
          <Button type="submit" variant="primary" disabled={pending || !text.trim()}>
            Send
          </Button>
        </form>
        <div className="chat-hint">Enter to send · Shift+Enter for a new line</div>
      </div>
    </main>
  );
}
