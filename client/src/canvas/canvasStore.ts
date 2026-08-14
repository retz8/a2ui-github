/**
 * The canvas store: one hand-rolled external store (subscribe + snapshot, read by React via
 * useSyncExternalStore) owning the 8.2 + 8.3 slice of the phase-8 canvas state — stage and
 * overlay occupancy, in-flight status, the live paint's metadata, and the append-only timeline
 * of departed-paint snapshots. Written from non-React code (the turn runner, the replay driver,
 * the A2A callbacks), which is why it is a closure module and not component state. 8.4 grows it:
 * head/viewing (time travel) and the ring policy over `timeline`.
 */
import type {LivePaint, PaintSnapshot} from './paint';

/** The pending question paint occupying the overlay slot. */
export interface OverlayState {
  surfaceId: string;
  /** The dialog's title when statically known — the question, for cause records and labels. */
  question?: string;
}

export interface CanvasState {
  /** The surface occupying the stage; null is the empty canvas. */
  stageId: string | null;
  /** Metadata of the stage's paint; its snapshot completes when the paint departs. */
  livePaint: LivePaint | null;
  /** The one transient question paint above the stage; null when no question is pending. */
  overlay: OverlayState | null;
  /** Append-only, chronologically ordered snapshots of departed paints (8.4 adds the ring cap). */
  timeline: readonly PaintSnapshot[];
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
  setLivePaint(livePaint: LivePaint | null): void;
  setOverlay(overlay: OverlayState | null): void;
  appendSnapshot(snapshot: PaintSnapshot): void;
  /** Monotonic paint ids — never reused; causes reference ids, not slots. */
  nextPaintId(): number;
  showNotice(text: string): void;
  dismissNotice(key: number): void;
  bumpApplied(): void;
}

export function createCanvasStore(): CanvasStore {
  let state: CanvasState = {
    stageId: null,
    livePaint: null,
    overlay: null,
    timeline: [],
    inFlight: null,
    error: null,
    notice: null,
    appliedSeq: 0,
  };
  let noticeKey = 0;
  let paintId = 0;
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
    setLivePaint: livePaint => set({livePaint}),
    setOverlay: overlay => set({overlay}),
    appendSnapshot: snapshot => set({timeline: [...state.timeline, snapshot]}),
    nextPaintId: () => ++paintId,
    showNotice: text => set({notice: {key: noticeKey++, text}}),
    dismissNotice: key => {
      if (state.notice?.key === key) set({notice: null});
    },
    bumpApplied: () => set({appliedSeq: state.appliedSeq + 1}),
  };
}
