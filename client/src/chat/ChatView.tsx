import {useEffect, useRef, useState} from 'react';
import {Button, Spinner, Textarea} from '@primer/react';
import {MessageProcessor} from '@a2ui/web_core/v0_9';
import type {A2uiClientDataModel, A2uiMessage} from '@a2ui/web_core/v0_9';
import {A2uiSurface} from '@a2ui/react/v0_9';
import {CATALOG} from 'primer-a2ui-adapter';
import type {A2ASenderOptions} from '../a2a/client';
import {createSenderResolver} from '../a2a/client';
import {createA2AActionHandler} from '../a2a/createA2AActionHandler';
import {describeAction} from './describeAction';
import {describeError} from './describeError';
import {createA2ASession} from '../a2a/session';
import {streamUserMessage} from '../a2a/streamUserMessage';
import {applyA2uiMessages} from '../a2ui/applyMessages';
import type {A2uiMessageTarget} from '../a2ui/applyMessages';
import {SurfaceErrorBoundary} from './SurfaceErrorBoundary';
import './ChatView.css';

/**
 * One transcript entry: a typed user prompt, an agent surface keyed by its id, prose the agent
 * sent instead of (or alongside) a surface, or a failure.
 */
type Turn =
  | {kind: 'user'; key: number; text: string}
  | {kind: 'surface'; id: string}
  | {kind: 'agent-text'; key: number; seq: number; text: string}
  | {kind: 'error'; key: number; text: string};

/**
 * The chat shell: header, scrollable transcript (user bubbles interleaved with agent
 * surfaces), composer pinned at the bottom. Host chrome only — Primer components plus
 * Primer CSS vars; agent-generated surfaces render through A2uiSurface. Both send paths
 * (prompts and component actions) share one session and one lazily resolved A2A client.
 */
export function ChatView({serverUrl, client}: A2ASenderOptions) {
  // Declared before `wiring` so the action handler, the applier, and the send paths can
  // capture the (stable) setters.
  const [pending, setPending] = useState(false);
  const [pendingLabel, setPendingLabel] = useState('Generating…');
  const [turns, setTurns] = useState<Turn[]>([]);
  const turnKey = useRef(0);

  const [wiring] = useState(() => {
    // Identifies the current send, so streamed prose chunks group into one bubble per turn. A
    // plain counter rather than a React ref: it is only ever touched from these callbacks, and a
    // ref read inside this initializer reads as render-phase access.
    let sendSeq = 0;
    // Opens a new grouping window for agent prose. Exposed as a call rather than a counter so
    // nothing outside this closure mutates wiring state.
    const beginSend = () => {
      sendSeq += 1;
    };
    const session = createA2ASession();
    const getSender = createSenderResolver({serverUrl, client});
    // Late-binding: `apply` reaches the processor that is created right below.
    // The handler only fires on a response, long after construction, so the
    // temporal cycle is harmless.
    // eslint-disable-next-line prefer-const
    let target:
      | (A2uiMessageTarget & {getClientDataModel: () => A2uiClientDataModel | undefined})
      | undefined;

    // Consecutive identical failures collapse into one entry: a rejected createSurface makes
    // every later message for that id fail with the same text, which would otherwise fill the
    // transcript with copies of one problem.
    const reportFailure = (text: string) =>
      setTurns(prev => {
        const last = prev[prev.length - 1];
        if (last?.kind === 'error' && last.text === text) return prev;
        return [...prev, {kind: 'error', key: turnKey.current++, text}];
      });

    // The agent's own words. Prose streams in chunks, so chunks of the SAME send accumulate into
    // one entry — appending per chunk split words in half ("…on **a2ui-project/a2" | "ui**…").
    // A new send always starts a new bubble, and a leading blank chunk opens none.
    const reportAgentText = (text: string) =>
      setTurns(prev => {
        const last = prev[prev.length - 1];
        if (last?.kind === 'agent-text' && last.seq === sendSeq) {
          return [...prev.slice(0, -1), {...last, text: last.text + text}];
        }
        if (!text.trim()) return prev;
        return [...prev, {kind: 'agent-text', key: turnKey.current++, seq: sendSeq, text}];
      });

    const apply = (messages: A2uiMessage[]) => {
      if (!target) return;
      applyA2uiMessages(target, messages, {
        onMessageError: err =>
          reportFailure(`Part of this response could not be displayed. ${describeError(err)}`),
      });
    };
    const getClientDataModel = () => target?.getClientDataModel();
    const actionHandler = createA2AActionHandler({
      apply,
      getSender,
      session,
      getClientDataModel,
      onError: err => reportFailure(`That action failed. ${describeError(err)}`),
      onAgentText: reportAgentText,
      // Mirror the text path: a clicked action drives the same loading indicator, with
      // an informational label derived from the action (falls back to the generic one).
      onActionStart: action => {
        beginSend();
        const subject = describeAction(action);
        setPendingLabel(subject ? `${subject} — generating…` : 'Generating…');
        setPending(true);
      },
      onActionSettled: () => setPending(false),
    });
    const processor = new MessageProcessor([CATALOG], actionHandler);
    target = processor;
    return {
      processor,
      beginSend,
      getSender,
      session,
      apply,
      getClientDataModel,
      reportFailure,
      reportAgentText,
    };
  });

  const [text, setText] = useState('');
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
          kept
            .filter((t): t is Extract<Turn, {kind: 'surface'}> => t.kind === 'surface')
            .map(t => t.id),
        );
        const added = liveIds.filter(id => !known.has(id));
        return added.length
          ? [...kept, ...added.map(id => ({kind: 'surface' as const, id}))]
          : kept;
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
    wiring.beginSend();
    setTurns(prev => [...prev, {kind: 'user', key: turnKey.current++, text: prompt}]);
    setPendingLabel('Generating…');
    setPending(true);
    try {
      await streamUserMessage(prompt, {
        getSender: wiring.getSender,
        apply: wiring.apply,
        session: wiring.session,
        getClientDataModel: wiring.getClientDataModel,
        onError: err => wiring.reportFailure(`The agent request failed. ${describeError(err)}`),
        onAgentText: wiring.reportAgentText,
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
            ) : turn.kind === 'agent-text' ? (
              <div
                key={`agent-text-${turn.key}`}
                className="chat-agent-text-turn"
                data-testid="chat-agent-text"
              >
                {turn.text}
              </div>
            ) : turn.kind === 'error' ? (
              <div
                key={`error-${turn.key}`}
                className="chat-error-turn"
                data-testid="chat-error-turn"
                role="alert"
              >
                {turn.text}
              </div>
            ) : (
              (surface =>
                surface && (
                  <div
                    key={turn.id}
                    className="chat-surface-turn"
                    data-testid={`surface-${turn.id}`}
                  >
                    <SurfaceErrorBoundary surfaceId={turn.id}>
                      <A2uiSurface surface={surface} />
                    </SurfaceErrorBoundary>
                  </div>
                ))(wiring.processor.model.surfacesMap.get(turn.id))
            ),
          )}
          {pending && (
            <div className="chat-pending" data-testid="chat-pending">
              <Spinner size="small" />
              {pendingLabel}
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
