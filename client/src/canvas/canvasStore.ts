/**
 * The canvas store: one hand-rolled external store (subscribe + snapshot, read by React via
 * useSyncExternalStore) owning the 8.2 slice of the phase-8 canvas state — stage occupancy and
 * in-flight status. Written from non-React code (the applier, the replay driver, the A2A
 * callbacks), which is why it is a closure module and not component state. Later sub-tasks grow
 * it: overlay (8.3), timeline/head/viewing (8.4).
 */

export interface CanvasState {
  /** The surface occupying the stage; null is the empty canvas. */
  stageId: string | null;
  /** Set while a paint is streaming; its label feeds the status strip. */
  inFlight: {label: string} | null;
  /** Sticky failure text; cleared by the next dispatch (beginPaint). */
  error: string | null;
  /** The one transient ambient notice; keyed so a repeat restarts the fade. */
  notice: {key: number; text: string} | null;
  /** Bumped per applied batch — re-renders the stage and resets its error boundary. */
  appliedSeq: number;
}

export interface CanvasStore {
  getState(): CanvasState;
  subscribe(listener: () => void): () => void;
  beginPaint(label: string): void;
  endPaint(): void;
  reportError(text: string): void;
  setStage(stageId: string | null): void;
  showNotice(text: string): void;
  dismissNotice(key: number): void;
  bumpApplied(): void;
}

export function createCanvasStore(): CanvasStore {
  let state: CanvasState = {
    stageId: null,
    inFlight: null,
    error: null,
    notice: null,
    appliedSeq: 0,
  };
  let noticeKey = 0;
  const listeners = new Set<() => void>();

  const set = (patch: Partial<CanvasState>) => {
    state = {...state, ...patch};
    for (const listener of listeners) listener();
  };

  return {
    getState: () => state,
    subscribe: listener => {
      listeners.add(listener);
      return () => listeners.delete(listener);
    },
    beginPaint: label => set({inFlight: {label}, error: null}),
    endPaint: () => set({inFlight: null}),
    reportError: text => set({error: text}),
    setStage: stageId => set({stageId}),
    showNotice: text => set({notice: {key: noticeKey++, text}}),
    dismissNotice: key => {
      if (state.notice?.key === key) set({notice: null});
    },
    bumpApplied: () => set({appliedSeq: state.appliedSeq + 1}),
  };
}
