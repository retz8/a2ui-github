/**
 * The canvas page (tasks 8.2–8.4): the canvas-first shell — a full-screen stage, an overlay
 * slot for question paints, a summonable command palette as the language control plane, a thin
 * status strip, transient ambient notices, and the top-edge history chrome (phase-8 spec
 * decisions 1–3, 9). Transport is the chat page's, reused wholesale; every inbound turn runs
 * through the canvas turn runner, which enforces hold-and-swap, the validation gate, and the
 * live-registry lifecycle.
 *
 * Interaction policy while a paint is in flight (spec decision 11 + task-8.4 decision 16):
 * palette utterances and Repaint are last-intent-wins; agent-bound surface actions — live or
 * parked — are blocked with a status cue; answering an overlay question and all shell chrome
 * (Back, the list, return-to-live) are always live.
 *
 * Time travel (task 8.4): every cause records the paint the user was looking at (`parent`)
 * and whether the view was parked (`forked`, with the parent's title denormalised). Any
 * dispatch from a parked view jumps to live first — the parked session's unmount commits its
 * write-back — and a forked turn reports the parked snapshot's data model, not the head's.
 *
 * `?beat=N[,M…]` replays task-8.1 recorded beats in sequence (paced by the recorded offsets;
 * `&instant` collapses the waits) — the zero-LLM verification path of spec decision 17.
 */
import {useEffect, useRef, useState, useSyncExternalStore} from 'react';
import {Button} from '@primer/react';
import {MessageProcessor} from '@a2ui/web_core/v0_9';
import type {ActionListener, A2uiClientAction, A2uiClientDataModel} from '@a2ui/web_core/v0_9';
import type {ReactComponentImplementation} from '@a2ui/react/v0_9';
import {CATALOG} from 'primer-a2ui-adapter';
import type {A2ASenderOptions} from '../a2a/client';
import {createSenderResolver, sendAndApply} from '../a2a/client';
import type {ForkContext} from '../a2a/messages';
import {buildActionMessageParams} from '../a2a/messages';
import {createA2ASession} from '../a2a/session';
import {streamUserMessage} from '../a2a/streamUserMessage';
import {describeError} from '../shared/describeError';
import {getBeatFixture} from '../beats/beatFixtures';
import {createCanvasStore, currentPaintId} from './canvasStore';
import {createTurnRunner} from './canvasTurn';
import type {PaintCause, PaintEntry} from './paint';
import {entryTitle} from './paint';
import type {ParkedSession} from './parkedSession';
import {createParkedSession} from './parkedSession';
import {replayBeatOnCanvas} from './replayBeat';
import {AmbientNotice} from './AmbientNotice';
import {CanvasOverlay} from './CanvasOverlay';
import {CanvasStage} from './CanvasStage';
import {HistoryChrome} from './HistoryChrome';
import {ParkedStage} from './ParkedStage';
import {Palette} from './Palette';
import {StatusStrip} from './StatusStrip';
import './CanvasApp.css';

const BLOCKED_CUE = 'Hold on — a paint is in flight. Try again when it lands.';

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
    const parentId = () => currentPaintId(store.getState());
    /** The active parked session, registered by ParkedStage on mount (not a React ref). */
    const parkedHolder: {session: ParkedSession<ReactComponentImplementation> | null} = {
      session: null,
    };

    /** The fork half of a cause: parked ⇒ forked, with the parent's title denormalised. */
    const forkFields = (): {forked: boolean; parentTitle?: string} => {
      const state = store.getState();
      if (state.viewing === null) return {forked: false};
      const entry = state.timeline.find(e => e.paintId === state.viewing);
      return {forked: true, ...(entry ? {parentTitle: entryTitle(entry)} : {})};
    };

    /**
     * The wire half of a fork (task-8.5 decisions 9–10): the parked paint's identity,
     * attached as message metadata so the agent knows the turn acts on a historical view.
     * Captured by callers BEFORE the jump-to-live at dispatch; undefined while live.
     */
    const forkContextOf = (): ForkContext | undefined => {
      const state = store.getState();
      if (state.viewing === null) return undefined;
      const index = state.timeline.findIndex(e => e.paintId === state.viewing);
      if (index < 0) return undefined;
      const entry = state.timeline[index];
      return {
        paintId: entry.paintId,
        title: entryTitle(entry),
        paintedAt: entry.paintedAt,
        // Depth behind the live head at dispatch — the agent-meaningful position (ring
        // indexes shift under eviction; the paintId is the stable identifier).
        position: state.timeline.length - 1 - index,
      };
    };

    /** A forked turn reports the parked view's data model — what the user acted on. */
    const parkedClientDataModel = (): A2uiClientDataModel | undefined => {
      const parked = parkedHolder.session;
      const surface = parked?.processor.model.getSurface(parked.surfaceId);
      if (!parked || !surface) return undefined;
      return {
        version: 'v0.9',
        surfaces: {[parked.surfaceId]: surface.dataModel.get('/') as Record<string, unknown>},
      };
    };

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

    /** Cause, data model and fork context are captured by the caller BEFORE the
     * jump-to-live at dispatch. */
    const dispatchUtterance = async (
      text: string,
      cause: PaintCause,
      dataModel?: A2uiClientDataModel,
      forkContext?: ForkContext,
    ) => {
      store.returnToLive();
      const turn = startTurn(cause);
      try {
        await streamUserMessage(text, {
          getSender,
          apply: turn.apply,
          session,
          getClientDataModel: () => dataModel ?? getClientDataModel(),
          signal: turn.signal,
          onError: err => store.reportError(`The agent request failed. ${describeError(err)}`),
          onAgentText: reportAgentText,
          forkContext,
          onPaintMeta: turn.acceptPaintMeta,
        });
      } finally {
        turn.end();
      }
    };

    const sendUtterance = (utterance: string) => {
      // Q5: speaking past a pending question dismisses it, no trace. Last-intent-wins over
      // any in-flight paint is the runner's job (begin cancels it, aborting the transport).
      runner.removeOverlay();
      const fork = forkFields();
      const cause: PaintCause = {
        kind: 'utterance',
        parent: parentId(),
        ...fork,
        payload: {text: utterance},
      };
      return dispatchUtterance(
        utterance,
        cause,
        fork.forked ? parkedClientDataModel() : undefined,
        forkContextOf(),
      );
    };

    const sendCausedAction = async (
      action: A2uiClientAction,
      cause: PaintCause,
      dataModel?: A2uiClientDataModel,
      forkContext?: ForkContext,
    ) => {
      store.returnToLive();
      const turn = startTurn(cause);
      try {
        const sender = await getSender();
        await sendAndApply(
          sender,
          buildActionMessageParams(
            action,
            session.get(),
            dataModel ?? getClientDataModel(),
            forkContext,
          ),
          turn.apply,
          session,
          reportAgentText,
          turn.signal,
          turn.acceptPaintMeta,
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
        // remove the dialog at dispatch (task-8.3 spec decision 8) — always live. Answering
        // from a parked view is an ordinary fork (task-8.4 decision 15).
        const fork = forkFields();
        const cause: PaintCause = {
          kind: 'overlay-answer',
          parent: parentId(),
          ...fork,
          payload: {question: state.overlay.question, answer: action},
        };
        const dataModel = fork.forked ? parkedClientDataModel() : undefined;
        const forkContext = forkContextOf();
        runner.removeOverlay();
        return sendCausedAction(action, cause, dataModel, forkContext);
      }
      if (state.inFlight) {
        // Spec decision 11: agent-bound actions are blocked while a paint is in flight —
        // a status cue instead of firing.
        store.showNotice(BLOCKED_CUE);
        return;
      }
      return sendCausedAction(action, {
        kind: 'surface-action',
        parent: parentId(),
        forked: false,
        payload: {action},
      });
    };

    /** Actions fired from a parked surface: same blocked class, forked consequence. */
    const parkedActionHandler: ActionListener = action => {
      if (store.getState().inFlight) {
        store.showNotice(BLOCKED_CUE);
        return;
      }
      const fork = forkFields();
      const cause: PaintCause = {
        kind: 'surface-action',
        parent: parentId(),
        ...fork,
        payload: {action},
      };
      return sendCausedAction(action, cause, parkedClientDataModel(), forkContextOf());
    };

    const createParked = (entry: PaintEntry) =>
      createParkedSession(entry, {catalogs: [CATALOG], store, onAction: parkedActionHandler});

    /** Register a mounted parked session; the returned teardown commits its write-back. */
    const attachParked = (parked: ParkedSession<ReactComponentImplementation>) => {
      parkedHolder.session = parked;
      return () => {
        parked.commit();
        if (parkedHolder.session === parked) parkedHolder.session = null;
      };
    };

    /** Repaint (task-8.4 decision 11): regenerate the parked view by re-firing its cause. */
    const repaint = () => {
      const state = store.getState();
      const entry =
        state.viewing !== null ? state.timeline.find(e => e.paintId === state.viewing) : undefined;
      if (!entry) return;
      runner.removeOverlay();
      const base = {parent: entry.paintId, forked: true, parentTitle: entryTitle(entry)};
      const dataModel = parkedClientDataModel();
      const forkContext = forkContextOf();
      const cause = entry.cause;
      if (cause.kind === 'utterance') {
        void dispatchUtterance(
          cause.payload.text,
          {kind: 'utterance', ...base, payload: cause.payload},
          dataModel,
          forkContext,
        );
      } else if (cause.kind === 'surface-action') {
        void sendCausedAction(
          cause.payload.action,
          {kind: 'surface-action', ...base, payload: cause.payload},
          dataModel,
          forkContext,
        );
      } else {
        void sendCausedAction(
          cause.payload.answer,
          {kind: 'overlay-answer', ...base, payload: cause.payload},
          dataModel,
          forkContext,
        );
      }
    };

    return {store, processor, runner, sendUtterance, repaint, createParked, attachParked};
  });

  const state = useSyncExternalStore(wiring.store.subscribe, wiring.store.getState);

  // The ?beat= replay affordance, read once at mount. A comma-separated list runs in sequence.
  const [beatParams] = useState(() => {
    const params = new URLSearchParams(window.location.search);
    const beat = params.get('beat');
    return beat === null
      ? null
      : {beats: beat.split(',').map(Number), instant: params.has('instant')};
  });

  // The palette auto-opens on an empty idle canvas (nothing else to do there) — unless a
  // beat replay is about to occupy the stage.
  const [paletteOpen, setPaletteOpen] = useState(beatParams === null);

  const replayStarted = useRef(false);
  useEffect(() => {
    if (!beatParams || replayStarted.current) return;
    replayStarted.current = true;
    void (async () => {
      for (const beat of beatParams.beats) {
        const fixture = getBeatFixture(beat);
        if (!fixture) {
          wiring.store.reportError(`Unknown beat: ${beat}. Recorded beats are 1–8.`);
          return;
        }
        await replayBeatOnCanvas(fixture, {
          runner: wiring.runner,
          store: wiring.store,
          paced: !beatParams.instant,
        });
      }
    })();
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

  const parkedEntry =
    state.viewing !== null ? state.timeline.find(e => e.paintId === state.viewing) : undefined;

  return (
    <main className={parkedEntry ? 'canvas-app canvas-app--parked' : 'canvas-app'}>
      {parkedEntry ? (
        <ParkedStage
          key={parkedEntry.paintId}
          entry={parkedEntry}
          create={wiring.createParked}
          attach={wiring.attachParked}
        />
      ) : (
        <CanvasStage processor={wiring.processor} state={state} />
      )}
      <CanvasOverlay processor={wiring.processor} state={state} />
      <AmbientNotice notice={state.notice} onDismiss={wiring.store.dismissNotice} />
      <HistoryChrome
        state={state}
        onPark={wiring.store.park}
        onReturnToLive={wiring.store.returnToLive}
        onRepaint={wiring.repaint}
      />
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
