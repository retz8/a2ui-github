/**
 * The task-8.1 fixture gate.
 *
 * These recordings are what tasks 8.2-8.4 verify the canvas shell against with zero LLM calls
 * (phase-8 spec decision 17), so this suite is what says they are actually consumable: the set
 * is complete, each is a real stream rather than a dump, and each replays through the client's
 * own apply path into a rendered surface.
 */
import {describe, it, expect} from 'vitest';
import {MessageProcessor} from '@a2ui/web_core/v0_9';
import {CATALOG, CATALOG_ID} from 'primer-a2ui-adapter';
import {BEAT_FIXTURES, getBeatFixture, messagesOf} from '../src/beats/beatFixtures';
import type {BeatFixture, BeatTurn} from '../src/beats/beatFixtures';
import {replayTurn} from '../src/beats/replay';

/** The eight beats of SPEC.md §3.1, which the arc in 8.6 is sequenced from. */
const EXPECTED_BEATS = [1, 2, 3, 4, 5, 6, 7, 8];

function paintingTurn(fixture: BeatFixture): BeatTurn {
  return fixture.turns[fixture.turns.length - 1];
}

describe('beat fixtures', () => {
  it('covers all eight beats exactly once', () => {
    expect(BEAT_FIXTURES.map(f => f.beat)).toEqual(EXPECTED_BEATS);
    expect(new Set(BEAT_FIXTURES.map(f => f.name)).size).toBe(BEAT_FIXTURES.length);
  });

  it('records the prompt and the model each beat was driven with', () => {
    for (const fixture of BEAT_FIXTURES) {
      expect(fixture.prompt.length).toBeGreaterThan(0);
      expect(fixture.model.length).toBeGreaterThan(0);
      expect(fixture.recordedAt).toMatch(/^\d{4}-\d{2}-\d{2}T/);
    }
  });

  it('getBeatFixture resolves by beat number', () => {
    expect(getBeatFixture(1)?.beat).toBe(1);
    expect(getBeatFixture(99)).toBeUndefined();
  });

  describe.each(BEAT_FIXTURES.map(f => [f.name, f] as const))('%s', (_name, fixture) => {
    const turn = paintingTurn(fixture);

    it('completed, so it carries a paint rather than an apology', () => {
      expect(turn.outcome).toBe('completed');
    });

    it('paints on the Primer catalog at v0.9', () => {
      // A turn may create more than one surface — the last takes the stage and all enter the
      // timeline (phase-8 spec decision 3) — so this asserts the catalog, not a count.
      const messages = messagesOf(turn);
      const creates = messages.filter(m => 'createSurface' in m) as Array<{
        createSurface: {catalogId: string};
      }>;
      expect(creates.length).toBeGreaterThanOrEqual(1);
      for (const create of creates) expect(create.createSurface.catalogId).toBe(CATALOG_ID);
      for (const message of messages) expect(message.version).toBe('v0.9');
    });

    it('is a stream, not a dump: many batches, in non-decreasing arrival order', () => {
      // A single batch would mean the recording flattened the turn, which cannot drive
      // 8.2's progressive-streaming path or 8.3's hold-and-swap.
      expect(turn.batches.length).toBeGreaterThan(1);
      const offsets = turn.batches.map(b => b.offsetMs);
      expect([...offsets].sort((a, b) => a - b)).toEqual(offsets);
    });

    it('replays through the client apply path into a rendered surface', () => {
      const processor = new MessageProcessor([CATALOG]);
      const {failures} = replayTurn(processor, turn);

      expect(failures).toEqual([]);
      const created = messagesOf(turn).find(m => 'createSurface' in m) as {
        createSurface: {surfaceId: string};
      };
      const surface = processor.model.getSurface(created.createSurface.surfaceId);
      expect(surface).toBeTruthy();
    });
  });
});
