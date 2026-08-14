/**
 * The canvas beat-replay driver (task 8.2): drives a recorded beat through the canvas apply
 * pipeline, paced by the recorded offsets by default so progressive rendering is observable,
 * instant for tests and the `&instant` param.
 */
import {describe, it, expect, vi, afterEach} from 'vitest';
import type {A2uiMessage} from '@a2ui/web_core/v0_9';
import {createCanvasStore} from './canvasStore';
import {replayBeatOnCanvas} from './replayBeat';
import type {BeatFixture} from '../beats/beatFixtures';

const msg = (id: number) => ({version: 'v0.9', marker: id}) as unknown as A2uiMessage;

function fixture(overrides: Partial<BeatFixture> = {}): BeatFixture {
  return {
    name: 'beat-1-test',
    beat: 1,
    title: 'test beat',
    prompt: 'show me',
    model: 'test-model',
    recordedAt: '2026-08-14T00:00:00Z',
    contextId: 'ctx',
    chainedFrom: null,
    turns: [
      {
        taskId: 't1',
        kind: 'utterance',
        prompt: 'show me',
        action: null,
        outcome: 'completed',
        durationMs: 300,
        batches: [
          {offsetMs: 0, messages: [msg(1)], texts: []},
          {offsetMs: 100, messages: [msg(2)], texts: ['here you go']},
          {offsetMs: 250, messages: [], texts: ['done']},
        ],
      },
    ],
    ...overrides,
  };
}

afterEach(() => {
  vi.useRealTimers();
});

describe('replayBeatOnCanvas', () => {
  it('instant mode applies each non-empty batch separately, in order', async () => {
    const store = createCanvasStore();
    const applied: A2uiMessage[][] = [];
    await replayBeatOnCanvas(fixture(), {apply: m => applied.push(m), store, paced: false});
    expect(applied).toEqual([[msg(1)], [msg(2)]]);
  });

  it('wraps the replay in a paint: in-flight during, settled after', async () => {
    const store = createCanvasStore();
    let inFlightDuringApply = false;
    await replayBeatOnCanvas(fixture(), {
      apply: () => {
        inFlightDuringApply = store.getState().inFlight !== null;
      },
      store,
      paced: false,
    });
    expect(inFlightDuringApply).toBe(true);
    expect(store.getState().inFlight).toBeNull();
  });

  it("accumulates a turn's agent texts into one growing ambient notice", async () => {
    // Recorded texts are stream fragments (a sentence can split mid-word across events), so the
    // notice shows the turn's accumulated prose — the same grouping the chat transcript does.
    const store = createCanvasStore();
    const seen: string[] = [];
    store.subscribe(() => {
      const notice = store.getState().notice;
      if (notice && seen[seen.length - 1] !== notice.text) seen.push(notice.text);
    });
    await replayBeatOnCanvas(fixture(), {apply: () => {}, store, paced: false});
    expect(seen).toEqual(['here you go', 'here you godone']);
  });

  it('paced mode holds each batch until its recorded offset', async () => {
    vi.useFakeTimers();
    const store = createCanvasStore();
    const applied: number[] = [];
    const done = replayBeatOnCanvas(fixture(), {
      apply: m => applied.push((m[0] as unknown as {marker: number}).marker),
      store,
      paced: true,
    });
    await vi.advanceTimersByTimeAsync(0);
    expect(applied).toEqual([1]);
    await vi.advanceTimersByTimeAsync(99);
    expect(applied).toEqual([1]);
    await vi.advanceTimersByTimeAsync(1);
    expect(applied).toEqual([1, 2]);
    await vi.advanceTimersByTimeAsync(150);
    await done;
    expect(store.getState().inFlight).toBeNull();
  });

  it('replays every turn of a multi-turn fixture in order', async () => {
    const store = createCanvasStore();
    const multi = fixture();
    multi.turns = [
      {...multi.turns[0], batches: [{offsetMs: 0, messages: [msg(1)], texts: []}]},
      {...multi.turns[0], batches: [{offsetMs: 0, messages: [msg(2)], texts: []}]},
    ];
    const applied: number[] = [];
    await replayBeatOnCanvas(multi, {
      apply: m => applied.push((m[0] as unknown as {marker: number}).marker),
      store,
      paced: false,
    });
    expect(applied).toEqual([1, 2]);
  });
});
