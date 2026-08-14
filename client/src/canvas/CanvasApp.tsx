/**
 * The canvas page (tasks 8.2 + 8.3): the canvas-first shell — a full-screen stage, an overlay
 * slot for question paints, a summonable command palette as the language control plane, a thin
 * status strip, and transient ambient notices (phase-8 spec decisions 1–3). Transport is the
 * chat page's, reused wholesale; every inbound turn runs through the canvas turn runner, which
 * enforces hold-and-swap, the validation gate, and the live-registry lifecycle.
 *
 * Interaction policy while a paint is in flight (spec decision 11): palette utterances are
 * last-intent-wins (the runner cancels the in-flight turn, the transport aborts); agent-bound
 * surface actions are blocked with a status cue; answering an overlay question is always live.
 *
 * `?beat=N` replays a task-8.1 recorded beat onto the stage (paced by the recorded offsets;
 * `&instant` collapses the waits) — the zero-LLM verification path of spec decision 17.
 */
import {useEffect, useRef, useState, useSyncExternalStore} from 'react';
import {Button} from '@primer/react';
import {MessageProcessor} from '@a2ui/web_core/v0_9';
import type {ActionListener, A2uiClientAction} from '@a2ui/web_core/v0_9';
import {CATALOG} from 'primer-a2ui-adapter';
import type {A2ASenderOptions} from '../a2a/client';
import {createSenderResolver, sendAndApply} from '../a2a/client';
import {buildActionMessageParams} from '../a2a/messages';
import {createA2ASession} from '../a2a/session';
import {streamUserMessage} from '../a2a/streamUserMessage';
import {describeError} from '../chat/describeError';
import {getBeatFixture} from '../beats/beatFixtures';
import {createCanvasStore} from './canvasStore';
import {createTurnRunner} from './canvasTurn';
import type {PaintCause} from './paint';
import {replayBeatOnCanvas} from './replayBeat';
import {AmbientNotice} from './AmbientNotice';
import {CanvasOverlay} from './CanvasOverlay';
import {CanvasStage} from './CanvasStage';
import {Palette} from './Palette';
import {StatusStrip} from './StatusStrip';
import './CanvasApp.css';

export function CanvasApp({serverUrl, client}: A2ASenderOptions) {
  const [wiring] = useState(() => {
    const store = createCanvasStore();
    const session = createA2ASession();
    const getSender = createSenderResolver({serverUrl, client});
    const processor = new MessageProcessor([CATALOG], action => actionHandler(action));
    const runner = createTurnRunner({
      processor,
      store,
      createStaging: () => new MessageProcessor([CATALOG]),
    });
    const getClientDataModel = () => processor.getClientDataModel();
    const parentId = () => store.getState().livePaint?.paintId ?? null;

    // Agent prose streams as fragments; one growing notice per paint, chat-style grouping.
    let prose = '';
    const startTurn = (cause: PaintCause) => {
      prose = '';
      return runner.begin(cause);
    };
    const reportAgentText = (text: string) => {
      prose += text;
      if (prose.trim()) store.showNotice(prose);
    };

    const sendUtterance = async (utterance: string) => {
      // Q5: speaking past a pending question dismisses it, no trace. Last-intent-wins over
      // any in-flight paint is the runner's job (begin cancels it, aborting the transport).
      runner.removeOverlay();
      const turn = startTurn({kind: 'utterance', parent: parentId(), payload: {text: utterance}});
      try {
        await streamUserMessage(utterance, {
          getSender,
          apply: turn.apply,
          session,
          getClientDataModel,
          signal: turn.signal,
          onError: err => store.reportError(`The agent request failed. ${describeError(err)}`),
          onAgentText: reportAgentText,
        });
      } finally {
        turn.end();
      }
    };

    const sendCausedAction = async (action: A2uiClientAction, cause: PaintCause) => {
      const turn = startTurn(cause);
      try {
        const sender = await getSender();
        await sendAndApply(
          sender,
          buildActionMessageParams(action, session.get(), getClientDataModel()),
          turn.apply,
          session,
          reportAgentText,
          turn.signal,
        );
      } catch (err) {
        if (!turn.signal.aborted) {
          console.error('[A2UI:a2a]', err);
          store.reportError(`That action failed. ${describeError(err)}`);
        }
      } finally {
        turn.end();
      }
    };

    const actionHandler: ActionListener = action => {
      const state = store.getState();
      if (state.overlay && action.surfaceId === state.overlay.surfaceId) {
        // Answering the question (either dialog action): capture the Q&A into the cause and
        // remove the dialog at dispatch (task-8.3 spec decision 8) — always live.
        const cause: PaintCause = {
          kind: 'overlay-answer',
          parent: parentId(),
          payload: {question: state.overlay.question, answer: action},
        };
        runner.removeOverlay();
        return sendCausedAction(action, cause);
      }
      if (state.inFlight) {
        // Spec decision 11: agent-bound actions are blocked while a paint is in flight —
        // a status cue instead of firing.
        store.showNotice('Hold on — a paint is in flight. Try again when it lands.');
        return;
      }
      return sendCausedAction(action, {
        kind: 'surface-action',
        parent: parentId(),
        payload: {action},
      });
    };

    return {store, processor, runner, sendUtterance};
  });

  const state = useSyncExternalStore(wiring.store.subscribe, wiring.store.getState);

  // The ?beat= replay affordance, read once at mount.
  const [beatParams] = useState(() => {
    const params = new URLSearchParams(window.location.search);
    const beat = params.get('beat');
    return beat === null ? null : {beat: Number(beat), instant: params.has('instant')};
  });

  // The palette auto-opens on an empty idle canvas (nothing else to do there) — unless a
  // beat replay is about to occupy the stage.
  const [paletteOpen, setPaletteOpen] = useState(beatParams === null);

  const replayStarted = useRef(false);
  useEffect(() => {
    if (!beatParams || replayStarted.current) return;
    replayStarted.current = true;
    const fixture = getBeatFixture(beatParams.beat);
    if (!fixture) {
      wiring.store.reportError(`Unknown beat: ${beatParams.beat}. Recorded beats are 1–8.`);
      return;
    }
    void replayBeatOnCanvas(fixture, {
      runner: wiring.runner,
      store: wiring.store,
      paced: !beatParams.instant,
    });
  }, [beatParams, wiring]);

  // ⌘K (or Ctrl+K) summons the palette from anywhere on the page.
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setPaletteOpen(true);
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, []);

  return (
    <main className="canvas-app">
      <CanvasStage processor={wiring.processor} state={state} />
      <CanvasOverlay processor={wiring.processor} state={state} />
      <AmbientNotice notice={state.notice} onDismiss={wiring.store.dismissNotice} />
      <Palette
        open={paletteOpen}
        onDismiss={() => setPaletteOpen(false)}
        onSubmit={utterance => {
          setPaletteOpen(false);
          void wiring.sendUtterance(utterance);
        }}
      />
      {/* The canvas's one call-to-action; yields to the palette while it is open. */}
      {!paletteOpen && (
        <Button
          variant="primary"
          size="large"
          className="canvas-ask-pill"
          aria-label="Ask"
          onClick={() => setPaletteOpen(true)}
        >
          Ask <kbd className="canvas-ask-kbd">⌘K</kbd>
        </Button>
      )}
      <StatusStrip state={state} />
    </main>
  );
}
