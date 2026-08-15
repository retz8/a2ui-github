/**
 * The canvas page: the canvas-first shell — a full-screen stage, an overlay slot for question
 * paints, a summonable command palette as the language control plane, a thin status strip,
 * transient ambient notices, and the top-edge history chrome. It owns only layout and the
 * page-level affordances (palette summon, beat replay); the runtime graph and every dispatch
 * handler live in `createCanvasWiring`, built once at mount.
 *
 * `?beat=N[,M…]` replays recorded beats in sequence (paced by the recorded offsets; `&instant`
 * collapses the waits) — the zero-LLM verification path.
 */
import {useEffect, useRef, useState, useSyncExternalStore} from 'react';
import {Button} from '@primer/react';
import type {A2ASenderOptions} from '../a2a/client';
import {getBeatFixture} from '../beats/beatFixtures';
import {createCanvasWiring} from './createCanvasWiring';
import {replayBeatOnCanvas} from './replayBeat';
import {AmbientNotice} from './components/AmbientNotice';
import {CanvasOverlay} from './components/CanvasOverlay';
import {CanvasStage} from './components/CanvasStage';
import {HistoryChrome} from './components/HistoryChrome';
import {ParkedStage} from './components/ParkedStage';
import {Palette} from './components/Palette';
import {StatusStrip} from './components/StatusStrip';
import './CanvasApp.css';

export function CanvasApp({serverUrl, client}: A2ASenderOptions) {
  const [wiring] = useState(() => createCanvasWiring({serverUrl, client}));

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
