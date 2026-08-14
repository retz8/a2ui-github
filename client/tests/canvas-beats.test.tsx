/**
 * The canvas beat gate (tasks 8.2 + 8.3): every recorded beat (task 8.1), replayed through the
 * real canvas store + turn runner — the automated definition-of-done for "a paint lands on the
 * stage" (phase-8 spec decision 17: shell verification on fixtures, zero LLM calls).
 *
 * Complements `beat-fixtures.test.tsx` (the 8.1 recording gate): that one proves the
 * recordings are consumable; this one proves the canvas shell consumes them — zero apply
 * failures, the stage pointer on the last-created surface, single occupancy, a rendered
 * surface, the live paint assigned, and the in-flight state settled back to idle. The chained
 * pair at the end exercises hold-and-swap over an occupied stage: the real recordings are
 * stitched back-to-back (the shell consumes message streams, not meaning).
 */
import {describe, it, expect} from 'vitest';
import {screen} from '@testing-library/react';
import {MessageProcessor} from '@a2ui/web_core/v0_9';
import {CATALOG} from 'primer-a2ui-adapter';
import {BEAT_FIXTURES, messagesOf} from '../src/beats/beatFixtures';
import type {BeatFixture} from '../src/beats/beatFixtures';
import {createCanvasStore} from '../src/canvas/canvasStore';
import {createTurnRunner} from '../src/canvas/canvasTurn';
import {replayBeatOnCanvas} from '../src/canvas/replayBeat';
import {CanvasStage} from '../src/canvas/CanvasStage';
import {renderWithPrimer} from './helpers';

/** The last surface the painting turn creates — the one decision 3 says takes the stage. */
function lastCreatedSurfaceId(fixture: BeatFixture): string {
  const turn = fixture.turns[fixture.turns.length - 1];
  const creates = messagesOf(turn).filter(m => 'createSurface' in m) as Array<{
    createSurface: {surfaceId: string};
  }>;
  return creates[creates.length - 1].createSurface.surfaceId;
}

function setup() {
  const processor = new MessageProcessor([CATALOG]);
  const store = createCanvasStore();
  const runner = createTurnRunner({
    processor,
    store,
    createStaging: () => new MessageProcessor([CATALOG]),
  });
  return {processor, store, runner};
}

describe('canvas shell over the recorded beats', () => {
  describe.each(BEAT_FIXTURES.map(f => [f.name, f] as const))('%s', (_name, fixture) => {
    it('replays through the canvas turn runner and lands the paint on the stage', async () => {
      const {processor, store, runner} = setup();

      await replayBeatOnCanvas(fixture, {runner, store, paced: false});

      const state = store.getState();
      // The whole stream applied: any per-message failure lands in the sticky error.
      expect(state.error).toBeNull();
      // Last createSurface wins the stage; the live registry is exactly canvas occupancy.
      expect(state.stageId).toBe(lastCreatedSurfaceId(fixture));
      expect(Array.from(processor.model.surfacesMap.keys())).toEqual([state.stageId]);
      // The turn produced the live paint and settled back to idle.
      expect(state.livePaint).toMatchObject({surfaceId: state.stageId});
      expect(state.inFlight).toBeNull();

      // And the stage actually renders it.
      renderWithPrimer(<CanvasStage processor={processor} state={state} />);
      expect(screen.getByTestId('canvas-stage')).not.toBeEmptyDOMElement();
    });
  });

  it('a second beat over the occupied stage swaps in and snapshots the outgoing paint', async () => {
    const [first, second] = BEAT_FIXTURES;
    const {processor, store, runner} = setup();

    await replayBeatOnCanvas(first, {runner, store, paced: false});
    const firstStage = store.getState().stageId;
    const firstPaintId = store.getState().livePaint?.paintId;
    await replayBeatOnCanvas(second, {runner, store, paced: false});

    const state = store.getState();
    expect(state.error).toBeNull();
    expect(state.stageId).toBe(lastCreatedSurfaceId(second));
    // Serialize-on-swap: the first beat's paint departed into the timeline, deep-frozen,
    // and left the live registry (the data-model growth fix — reporting sees only the stage).
    expect(state.timeline).toHaveLength(1);
    expect(state.timeline[0]).toMatchObject({paintId: firstPaintId, surfaceId: firstStage});
    expect(Object.keys(state.timeline[0].tree).length).toBeGreaterThan(0);
    expect(Object.isFrozen(state.timeline[0].tree)).toBe(true);
    expect(state.livePaint?.paintId).not.toBe(firstPaintId);
    expect(Array.from(processor.model.surfacesMap.keys())).toEqual([state.stageId]);
  });
});
