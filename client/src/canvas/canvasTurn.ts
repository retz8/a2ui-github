/**
 * The turn runner (task 8.3): every agent/replay turn enters the canvas through a turn it
 * begins, applies batches into, and ends — the hold-and-swap gate of phase-8 spec decision 10,
 * mechanised as validate-then-replay (task-8.3 spec decision 3):
 *
 * - **Staged mode** (occupied stage): messages for surfaces created this turn stream into a
 *   per-turn staging processor (the validator) and are buffered; at turn end the net-effect
 *   rule decides — a surviving surface replays into the single live processor and swaps in,
 *   a turn whose creations were cleaned up again is discarded and the stage holds. Messages
 *   targeting a live surface not created this turn apply directly, progressively (decision 2).
 * - **Progressive mode** (empty canvas): the paint streams straight onto the stage, as 8.2 did.
 * - **Question paints** (decisions 5–6): a validated surface whose root component is a
 *   `ConfirmationDialog` routes to the overlay slot, never the stage or the timeline.
 * - **Timeline entries** (task-8.4 decision 1): a landing stage paint appends its entry with a
 *   null snapshot — the live head. **Serialize-on-swap** (decision 4 + phase decision 14) then
 *   fills that entry when the surface leaves the canvas, before its removal from the live
 *   processor; intermediates of a multi-surface turn append already departed.
 * - **Cancel** (decision 9): aborts the transport signal and discards the staged work; a
 *   canceled paint never reaches the stage and never enters the timeline.
 */
import type {A2uiMessage} from '@a2ui/web_core/v0_9';
import {applyA2uiMessages} from '../a2ui/applyMessages';
import {describeError} from '../chat/describeError';
import type {CanvasStore} from './canvasStore';
import type {PaintCause} from './paint';
import {describeCause} from './paint';
import {serializeSurface} from './snapshotSurface';
import type {SnapshotSourceSurface} from './snapshotSurface';

/** The slice of a live/staging surface the runner reads: root type, title, catalog, serialization. */
export interface CanvasSurface extends SnapshotSourceSurface {
  componentsModel: SnapshotSourceSurface['componentsModel'] & {
    get(id: string): {type: string; properties: Record<string, unknown>} | undefined;
  };
  /** Captured into the entry so rehydration can rebuild the surface's createSurface. */
  catalog: {readonly id: string};
}

/** The slice of MessageProcessor the runner drives; MessageProcessor satisfies it. */
export interface TurnProcessor {
  processMessages(messages: A2uiMessage[]): void;
  readonly model: {
    getSurface(id: string): CanvasSurface | undefined;
    readonly surfacesMap: ReadonlyMap<string, CanvasSurface>;
    deleteSurface(id: string): void;
  };
}

export interface TurnHandle {
  /** Aborts the turn's transport when the turn is canceled. */
  readonly signal: AbortSignal;
  readonly canceled: boolean;
  /** Apply one streamed batch — the routing described in the module header. */
  apply(messages: A2uiMessage[]): void;
  /** The stream is exhausted: run the gate — swap in, or discard. No-op if canceled. */
  end(): void;
  /** Last-intent-wins: abort transport, discard the staged work, free the in-flight slot. */
  cancel(): void;
}

export interface TurnRunnerOptions {
  /** The single persistent live processor — the live registry (phase decision 14). */
  processor: TurnProcessor;
  store: CanvasStore;
  /** Fresh per-turn staging processor over the same catalog (no action handler needed). */
  createStaging: () => TurnProcessor;
}

export interface TurnRunner {
  readonly current: TurnHandle | null;
  /** Begin a turn; an in-flight one is canceled first (last-intent-wins). */
  begin(cause: PaintCause): TurnHandle;
  /**
   * Remove the pending question paint from the canvas and the live registry. Shared by Q&A's
   * two exits — answering (the answer is captured into the next cause by the caller) and
   * speaking past it (no trace).
   */
  removeOverlay(): void;
}

/** Questions-are-dialogs: the structural recognition rule (task-8.3 spec decision 6). */
const QUESTION_ROOT_TYPE = 'ConfirmationDialog';
/** Every surface's root component id, fixed by the renderer. */
const ROOT_COMPONENT_ID = 'root';

const HELD_FAILURE_TEXT = 'The paint failed and was discarded — keeping the current view.';
const EMPTY_FAILURE_TEXT = 'The paint failed and was withdrawn.';
const CANVAS_CLEARED_TEXT = 'The agent cleared the canvas.';

type MessageTarget = {kind: 'create' | 'update' | 'delete' | 'other'; surfaceId?: string};

function targetOf(message: A2uiMessage): MessageTarget {
  const m = message as {
    createSurface?: {surfaceId?: unknown};
    updateComponents?: {surfaceId?: unknown};
    updateDataModel?: {surfaceId?: unknown};
    deleteSurface?: {surfaceId?: unknown};
  };
  const id = (v: {surfaceId?: unknown} | undefined) =>
    typeof v?.surfaceId === 'string' ? v.surfaceId : undefined;
  if (m.createSurface) return {kind: 'create', surfaceId: id(m.createSurface)};
  if (m.updateComponents) return {kind: 'update', surfaceId: id(m.updateComponents)};
  if (m.updateDataModel) return {kind: 'update', surfaceId: id(m.updateDataModel)};
  if (m.deleteSurface) return {kind: 'delete', surfaceId: id(m.deleteSurface)};
  return {kind: 'other'};
}

const rootTypeOf = (processor: TurnProcessor, surfaceId: string): string | undefined =>
  processor.model.getSurface(surfaceId)?.componentsModel.get(ROOT_COMPONENT_ID)?.type;

/** The dialog's title when statically known — a literal on the wire, not a data binding. */
function questionTitleOf(processor: TurnProcessor, surfaceId: string): string | undefined {
  const root = processor.model.getSurface(surfaceId)?.componentsModel.get(ROOT_COMPONENT_ID);
  const title = root?.properties?.title as {literalString?: unknown} | string | undefined;
  if (typeof title === 'string') return title;
  return typeof title?.literalString === 'string' ? title.literalString : undefined;
}

export function createTurnRunner({processor, store, createStaging}: TurnRunnerOptions): TurnRunner {
  let current: TurnHandle | null = null;

  const reportMessageError = (err: unknown) =>
    store.reportError(`Part of this response could not be displayed. ${describeError(err)}`);

  /** Materialize a live surface's content — the snapshot half of a paint entry. */
  const snapshotOf = (surfaceId: string) => {
    const surface = processor.model.getSurface(surfaceId);
    if (!surface) return null;
    return Object.freeze({...serializeSurface(surface), capturedAt: Date.now()});
  };

  /** A landed stage paint enters the timeline as the live head — snapshot pending. */
  const appendLiveEntry = (surfaceId: string, cause: PaintCause) => {
    const surface = processor.model.getSurface(surfaceId);
    if (!surface) return;
    store.appendEntry({
      paintId: store.nextPaintId(),
      surfaceId,
      catalogId: surface.catalog.id,
      cause,
      paintedAt: Date.now(),
      snapshot: null,
    });
  };

  /** Serialize-on-swap: the stage is leaving the canvas — fill its entry, then remove. */
  const retireStage = () => {
    const {stageId, timeline} = store.getState();
    if (stageId) {
      const head = timeline[timeline.length - 1];
      if (head && head.surfaceId === stageId && head.snapshot === null) {
        const snapshot = snapshotOf(stageId);
        if (snapshot) store.fillSnapshot(head.paintId, snapshot);
      }
      processor.model.deleteSurface(stageId);
    }
    store.setStage(null);
  };

  /** A newer question replaces any pending one — an unanswered question leaves no trace. */
  const replaceOverlay = (surfaceId: string) => {
    const pending = store.getState().overlay;
    if (pending && pending.surfaceId !== surfaceId)
      processor.model.deleteSurface(pending.surfaceId);
    store.setOverlay({surfaceId, question: questionTitleOf(processor, surfaceId)});
  };

  const removeOverlay = () => {
    const overlay = store.getState().overlay;
    if (!overlay) return;
    processor.model.deleteSurface(overlay.surfaceId);
    store.setOverlay(null);
    store.bumpApplied();
  };

  const begin = (cause: PaintCause): TurnHandle => {
    current?.cancel();

    const controller = new AbortController();
    // The mode is fixed at dispatch: an occupied stage holds and swaps; an empty canvas
    // streams progressively (phase decision 10).
    const stagedMode = store.getState().stageId !== null;
    const staging = stagedMode ? createStaging() : null;
    /** Surface ids this turn created — the turn's own paint, as opposed to live surfaces. */
    const createdIds = new Set<string>();
    /** Staged-mode buffer: the messages replayed into the live processor at swap. */
    const buffered: A2uiMessage[] = [];
    let canceled = false;

    /** Decision 3: every non-final stage surface of a turn still enters the timeline. */
    const retireIntermediate = (surfaceId: string) => {
      const surface = processor.model.getSurface(surfaceId);
      if (surface) {
        // An intermediate lands and departs in one breath — its entry arrives already filled.
        store.appendEntry({
          paintId: store.nextPaintId(),
          surfaceId,
          catalogId: surface.catalog.id,
          cause,
          paintedAt: Date.now(),
          snapshot: snapshotOf(surfaceId),
        });
        processor.model.deleteSurface(surfaceId);
      }
    };

    const applyProgressive = (messages: A2uiMessage[]) => {
      for (const message of messages) {
        const {kind, surfaceId} = targetOf(message);
        if (kind === 'create' && surfaceId) createdIds.add(surfaceId);
      }
      applyA2uiMessages(processor, messages, {onMessageError: reportMessageError});
      // Single occupancy: the most recently created surface keeps the stage.
      const ids = Array.from(processor.model.surfacesMap.keys());
      for (const id of ids.slice(0, -1)) retireIntermediate(id);
      store.setStage(ids.length ? ids[ids.length - 1] : null);
      store.bumpApplied();
    };

    const applyStaged = (messages: A2uiMessage[]) => {
      let touchedLive = false;
      for (const message of messages) {
        const {kind, surfaceId} = targetOf(message);
        // The turn's own paint: staging shadows live, so a same-id repaint streams off-stage.
        if (surfaceId !== undefined && (createdIds.has(surfaceId) || kind === 'create')) {
          createdIds.add(surfaceId);
          applyA2uiMessages(staging as TurnProcessor, [message], {
            onMessageError: reportMessageError,
          });
          buffered.push(message);
          continue;
        }
        if (surfaceId !== undefined && processor.model.getSurface(surfaceId)) {
          const state = store.getState();
          if (kind !== 'delete') {
            // Decision 2: an update to an already-visible surface applies live, progressively.
            applyA2uiMessages(processor, [message], {onMessageError: reportMessageError});
          } else if (state.overlay?.surfaceId === surfaceId) {
            // The agent withdrew its question; questions never enter the timeline.
            processor.model.deleteSurface(surfaceId);
            store.setOverlay(null);
          } else if (state.stageId === surfaceId) {
            // Decision 4: a deliberate delete of the live stage — snapshot, remove, go empty.
            retireStage();
            store.showNotice(CANVAS_CLEARED_TEXT);
          } else {
            processor.model.deleteSurface(surfaceId);
          }
          touchedLive = true;
          continue;
        }
        // Unknown target (an update racing ahead of its create, or a malformed message):
        // stage it — errors surface through the same channel, stray deletes no-op.
        applyA2uiMessages(staging as TurnProcessor, [message], {
          onMessageError: reportMessageError,
        });
        buffered.push(message);
      }
      if (touchedLive) store.bumpApplied();
    };

    const endProgressive = () => {
      const stageId = store.getState().stageId;
      if (!stageId) {
        // The net-effect rule on the empty canvas: created, then cleaned up again.
        if (createdIds.size > 0) store.reportError(EMPTY_FAILURE_TEXT);
        return;
      }
      if (rootTypeOf(processor, stageId) === QUESTION_ROOT_TYPE) {
        // A question over the empty canvas: overlay slot, empty stage, no timeline entry.
        replaceOverlay(stageId);
        store.setStage(null);
        store.bumpApplied();
        return;
      }
      appendLiveEntry(stageId, cause);
    };

    const endStaged = () => {
      const survivors = Array.from((staging as TurnProcessor).model.surfacesMap.keys());
      if (survivors.length === 0) {
        // The net-effect rule: the turn's paint no longer exists — discard, hold the stage.
        // A turn that painted nothing at all (updates only) is simply not a paint.
        if (createdIds.size > 0) store.reportError(HELD_FAILURE_TEXT);
        return;
      }
      const survivorSet = new Set(survivors);
      const replayable = buffered.filter(message => {
        const {surfaceId} = targetOf(message);
        return surfaceId !== undefined && survivorSet.has(surfaceId);
      });
      // Classify in staging, before replay: dialogs to the overlay, the rest are stage paints.
      const stagePaints = survivors.filter(
        id => rootTypeOf(staging as TurnProcessor, id) !== QUESTION_ROOT_TYPE,
      );
      const questions = survivors.filter(
        id => rootTypeOf(staging as TurnProcessor, id) === QUESTION_ROOT_TYPE,
      );

      // The swap: retire the outgoing stage (serialize-on-swap), then replay the validated
      // paint into the live processor.
      if (stagePaints.length > 0) retireStage();
      applyA2uiMessages(processor, replayable, {onMessageError: reportMessageError});
      for (const id of stagePaints.slice(0, -1)) retireIntermediate(id);
      if (stagePaints.length > 0) {
        const stageId = stagePaints[stagePaints.length - 1];
        store.setStage(stageId);
        appendLiveEntry(stageId, cause);
      }
      for (const id of questions.slice(0, -1)) processor.model.deleteSurface(id);
      if (questions.length > 0) replaceOverlay(questions[questions.length - 1]);
      store.bumpApplied();
    };

    const handle: TurnHandle = {
      signal: controller.signal,
      get canceled() {
        return canceled;
      },
      apply: messages => {
        if (canceled) return;
        if (stagedMode) applyStaged(messages);
        else applyProgressive(messages);
      },
      end: () => {
        if (canceled) return;
        try {
          if (stagedMode) endStaged();
          else endProgressive();
        } finally {
          if (current === handle) {
            current = null;
            store.endPaint();
          }
        }
      },
      cancel: () => {
        if (canceled) return;
        canceled = true;
        controller.abort();
        if (!stagedMode && createdIds.size > 0) {
          // Progressive paints stream straight onto the stage; a canceled one must not
          // linger there — it never happened (never enters the timeline either).
          for (const id of createdIds) {
            if (processor.model.getSurface(id)) processor.model.deleteSurface(id);
          }
          const stageId = store.getState().stageId;
          if (stageId && createdIds.has(stageId)) store.setStage(null);
          store.bumpApplied();
        }
        if (current === handle) {
          current = null;
          store.endPaint();
        }
      },
    };

    current = handle;
    store.beginPaint(describeCause(cause));
    return handle;
  };

  return {
    get current() {
      return current;
    },
    begin,
    removeOverlay,
  };
}
