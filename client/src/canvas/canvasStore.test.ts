/**
 * The canvas store (task 8.2): stage occupancy + in-flight status, per phase-8 spec
 * decision 21 scoped to the 8.2 slice. Timeline/head/viewing/overlay arrive in 8.3/8.4.
 */
import {describe, it, expect, vi} from 'vitest';
import {createCanvasStore} from './canvasStore';

describe('createCanvasStore', () => {
  it('starts empty and idle', () => {
    const store = createCanvasStore();
    expect(store.getState()).toEqual({
      stageId: null,
      inFlight: null,
      error: null,
      notice: null,
      appliedSeq: 0,
    });
  });

  it('beginPaint marks in-flight with its label; endPaint settles back to idle', () => {
    const store = createCanvasStore();
    store.beginPaint('Generating…');
    expect(store.getState().inFlight).toEqual({label: 'Generating…'});
    store.endPaint();
    expect(store.getState().inFlight).toBeNull();
  });

  it('errors are sticky until the next dispatch clears them', () => {
    const store = createCanvasStore();
    store.reportError('the agent request failed');
    expect(store.getState().error).toBe('the agent request failed');
    store.endPaint();
    expect(store.getState().error).toBe('the agent request failed');
    store.beginPaint('Generating…');
    expect(store.getState().error).toBeNull();
  });

  it('setStage moves the stage pointer', () => {
    const store = createCanvasStore();
    store.setStage('pull-request-list');
    expect(store.getState().stageId).toBe('pull-request-list');
    store.setStage(null);
    expect(store.getState().stageId).toBeNull();
  });

  it('each notice gets a fresh key so repeats restart the fade', () => {
    const store = createCanvasStore();
    store.showNotice('done');
    const first = store.getState().notice;
    store.showNotice('done');
    const second = store.getState().notice;
    expect(first?.text).toBe('done');
    expect(second?.text).toBe('done');
    expect(second?.key).not.toBe(first?.key);
  });

  it('dismissNotice clears only the notice it was issued for', () => {
    const store = createCanvasStore();
    store.showNotice('first');
    const stale = store.getState().notice!.key;
    store.showNotice('second');
    store.dismissNotice(stale);
    expect(store.getState().notice?.text).toBe('second');
    store.dismissNotice(store.getState().notice!.key);
    expect(store.getState().notice).toBeNull();
  });

  it('bumpApplied increments appliedSeq', () => {
    const store = createCanvasStore();
    store.bumpApplied();
    store.bumpApplied();
    expect(store.getState().appliedSeq).toBe(2);
  });

  it('notifies subscribers on every mutation and stops after unsubscribe', () => {
    const store = createCanvasStore();
    const listener = vi.fn();
    const unsubscribe = store.subscribe(listener);
    store.beginPaint('Generating…');
    expect(listener).toHaveBeenCalledTimes(1);
    unsubscribe();
    store.endPaint();
    expect(listener).toHaveBeenCalledTimes(1);
  });

  it('getState returns a new immutable snapshot per mutation (useSyncExternalStore contract)', () => {
    const store = createCanvasStore();
    const before = store.getState();
    store.beginPaint('Generating…');
    const after = store.getState();
    expect(after).not.toBe(before);
    expect(before.inFlight).toBeNull();
  });
});
