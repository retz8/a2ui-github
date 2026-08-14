/**
 * The canvas apply pipeline: the single entry through which streamed A2UI messages (live agent
 * and beat replay alike) reach the canvas's processor. After each batch it enforces the 8.2
 * stage semantics from the task spec:
 *
 * - **Naive replace / delete-on-replace** — the stage holds one surface; anything else live in
 *   the processor is deleted, so the live registry equals canvas occupancy from day one and
 *   `getClientDataModel` reports only the stage. (8.3 layers hold-and-swap timing over this;
 *   8.4 snapshots the outgoing surface before the delete.)
 * - **Last-createSurface-wins** — when one batch creates several surfaces, the most recently
 *   created one keeps the stage.
 */
import type {A2uiMessage} from '@a2ui/web_core/v0_9';
import {applyA2uiMessages} from '../a2ui/applyMessages';
import type {A2uiMessageTarget} from '../a2ui/applyMessages';
import {describeError} from '../chat/describeError';
import type {CanvasStore} from './canvasStore';

/** The applier needs occupancy, not just per-id lookup; MessageProcessor satisfies it. */
export interface CanvasTarget extends A2uiMessageTarget {
  readonly model: {
    getSurface(id: string): unknown;
    surfacesMap: ReadonlyMap<string, unknown>;
  };
}

export interface CanvasApplierOptions {
  processor: CanvasTarget;
  store: CanvasStore;
}

export function createCanvasApplier({processor, store}: CanvasApplierOptions) {
  return (messages: A2uiMessage[]): void => {
    applyA2uiMessages(processor, messages, {
      onMessageError: err =>
        store.reportError(`Part of this response could not be displayed. ${describeError(err)}`),
    });

    // Enforce single occupancy: surfacesMap keeps insertion order, so the last key is the most
    // recently created surface — the stage. Everything before it is deleted from the processor.
    const ids = Array.from(processor.model.surfacesMap.keys());
    const stageId = ids.length ? ids[ids.length - 1] : null;
    for (const id of ids.slice(0, -1)) {
      processor.processMessages([
        {version: 'v0.9', deleteSurface: {surfaceId: id}} as unknown as A2uiMessage,
      ]);
    }

    store.setStage(stageId);
    store.bumpApplied();
  };
}
