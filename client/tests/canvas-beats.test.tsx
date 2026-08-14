/**
 * The task-8.2 canvas gate: every recorded beat (task 8.1), replayed through the real canvas
 * store + applier — the automated definition-of-done for "a paint lands on the stage"
 * (phase-8 spec decision 17: shell verification on fixtures, zero LLM calls).
 *
 * Complements `beat-fixtures.test.tsx` (the 8.1 recording gate): that one proves the
 * recordings are consumable; this one proves the canvas shell consumes them — zero apply
 * failures, the stage pointer on the last-created surface, single occupancy, a rendered
 * surface, and the in-flight state settled back to idle.
 */
import {describe, it, expect} from 'vitest';
import {screen} from '@testing-library/react';
import {MessageProcessor} from '@a2ui/web_core/v0_9';
import {CATALOG} from 'primer-a2ui-adapter';
import {BEAT_FIXTURES, messagesOf} from '../src/beats/beatFixtures';
import type {BeatFixture} from '../src/beats/beatFixtures';
import {createCanvasStore} from '../src/canvas/canvasStore';
import {createCanvasApplier} from '../src/canvas/canvasApplier';
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

describe('canvas shell over the recorded beats', () => {
  describe.each(BEAT_FIXTURES.map(f => [f.name, f] as const))('%s', (_name, fixture) => {
    it('replays through the canvas pipeline and lands the paint on the stage', async () => {
      const processor = new MessageProcessor([CATALOG]);
      const store = createCanvasStore();
      const apply = createCanvasApplier({processor, store});

      await replayBeatOnCanvas(fixture, {apply, store, paced: false});

      const state = store.getState();
      // The whole stream applied: any per-message failure lands in the sticky error.
      expect(state.error).toBeNull();
      // Last createSurface wins the stage; delete-on-replace leaves it the sole occupant.
      expect(state.stageId).toBe(lastCreatedSurfaceId(fixture));
      expect(Array.from(processor.model.surfacesMap.keys())).toEqual([state.stageId]);
      // The paint settled back to idle.
      expect(state.inFlight).toBeNull();

      // And the stage actually renders it.
      renderWithPrimer(<CanvasStage processor={processor} state={state} />);
      expect(screen.getByTestId('canvas-stage')).not.toBeEmptyDOMElement();
    });
  });
});
