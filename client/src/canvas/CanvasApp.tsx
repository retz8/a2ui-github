/**
 * The canvas page (task 8.2): the canvas-first shell — a full-screen stage, a summonable
 * command palette as the language control plane, a thin status strip, and transient ambient
 * notices (phase-8 spec decisions 1–3). Transport is the chat page's, reused wholesale; every
 * inbound message goes through the canvas applier, which enforces the stage semantics.
 *
 * `?beat=N` replays a task-8.1 recorded beat onto the stage (paced by the recorded offsets;
 * `&instant` collapses the waits) — the zero-LLM verification path of spec decision 17.
 */
import {useEffect, useRef, useState, useSyncExternalStore} from 'react';
import {MessageProcessor} from '@a2ui/web_core/v0_9';
import type {ActionListener} from '@a2ui/web_core/v0_9';
import {CATALOG} from 'primer-a2ui-adapter';
import type {A2ASenderOptions} from '../a2a/client';
import {createSenderResolver} from '../a2a/client';
import {createA2AActionHandler} from '../a2a/createA2AActionHandler';
import {createA2ASession} from '../a2a/session';
import {streamUserMessage} from '../a2a/streamUserMessage';
import {describeAction} from '../chat/describeAction';
import {describeError} from '../chat/describeError';
import {getBeatFixture} from '../beats/beatFixtures';
import {createCanvasStore} from './canvasStore';
import {createCanvasApplier} from './canvasApplier';
import {replayBeatOnCanvas} from './replayBeat';
import {AmbientNotice} from './AmbientNotice';
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
    const apply = createCanvasApplier({processor, store});
    const getClientDataModel = () => processor.getClientDataModel();

    // Agent prose streams as fragments; one growing notice per paint, chat-style grouping.
    let prose = '';
    const beginPaint = (label: string) => {
      prose = '';
      store.beginPaint(label);
    };
    const reportAgentText = (text: string) => {
      prose += text;
      if (prose.trim()) store.showNotice(prose);
    };

    const rawActionHandler = createA2AActionHandler({
      apply,
      getSender,
      session,
      getClientDataModel,
      onError: err => store.reportError(`That action failed. ${describeError(err)}`),
      onAgentText: reportAgentText,
      onActionStart: action => {
        const subject = describeAction(action);
        beginPaint(subject ? `${subject} — generating…` : 'Generating…');
      },
      onActionSettled: () => store.endPaint(),
    });
    // The 8.2 interaction guard: agent-bound actions are blocked while a paint is in flight
    // (spec decision 11's final answer for this channel; 8.3 adds the status cue and the
    // local-vs-agent-bound split).
    const actionHandler: ActionListener = action => {
      if (store.getState().inFlight) return;
      return rawActionHandler(action);
    };

    const sendUtterance = async (utterance: string) => {
      if (store.getState().inFlight) return;
      beginPaint('Generating…');
      try {
        await streamUserMessage(utterance, {
          getSender,
          apply,
          session,
          getClientDataModel,
          onError: err => store.reportError(`The agent request failed. ${describeError(err)}`),
          onAgentText: reportAgentText,
        });
      } finally {
        store.endPaint();
      }
    };

    return {store, processor, apply, sendUtterance};
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
      apply: wiring.apply,
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
      <AmbientNotice notice={state.notice} onDismiss={wiring.store.dismissNotice} />
      <Palette
        open={paletteOpen}
        blocked={state.inFlight !== null}
        onDismiss={() => setPaletteOpen(false)}
        onSubmit={utterance => {
          setPaletteOpen(false);
          void wiring.sendUtterance(utterance);
        }}
      />
      <StatusStrip state={state} onSummonPalette={() => setPaletteOpen(true)} />
    </main>
  );
}
