/**
 * The paint vocabulary (task 8.3): the typed cause every paint records, the live paint's
 * metadata, and the materialized snapshot the timeline stores (phase-8 spec decisions 4–6, 12).
 * Display strings are derived from the cause at render time, never stored — `describeCause`
 * is the permanent fallback the 8.5 agent-authored titles later sit on top of.
 */
import type {A2uiClientAction} from '@a2ui/web_core/v0_9';
import {describeAction} from '../chat/describeAction';

/** What produced a paint. `parent: null` means the canvas was empty when the edge fired. */
export type PaintCause =
  | {kind: 'utterance'; parent: number | null; payload: {text: string}}
  | {kind: 'surface-action'; parent: number | null; payload: {action: A2uiClientAction}}
  | {
      kind: 'overlay-answer';
      parent: number | null;
      /** The question (the overlay's title, when known) and the raw action event, verbatim. */
      payload: {question?: string; answer: A2uiClientAction};
    };

/** Metadata of the paint currently holding the stage; its snapshot completes when it departs. */
export interface LivePaint {
  paintId: number;
  surfaceId: string;
  cause: PaintCause;
  /** Epoch ms of the moment the paint took the stage. */
  paintedAt: number;
}

/**
 * The materialized record of a departed paint: serialized final state, captured once at
 * replacement (serialize-on-swap). Content is deep-frozen; message logs are a different
 * artifact (the verification fixtures) and are never conflated with this.
 */
export interface PaintSnapshot {
  paintId: number;
  surfaceId: string;
  /** Flat component-id → component-tree-node map — the A2UI wire shape. */
  tree: Readonly<Record<string, unknown>>;
  dataModel: unknown;
  cause: PaintCause;
  paintedAt: number;
  /** Epoch ms of the serialize-on-swap capture. */
  capturedAt: number;
}

const MAX_UTTERANCE_LABEL = 48;

const truncate = (text: string): string =>
  text.length <= MAX_UTTERANCE_LABEL ? text : `${text.slice(0, MAX_UTTERANCE_LABEL).trimEnd()}…`;

/**
 * The in-flight status label derived from a paint's cause — the utterance itself, the action's
 * subject, or the answered question. Always ends in "generating…" so the strip reads as
 * activity, matching the 8.2 labels this replaces.
 */
export function describeCause(cause: PaintCause): string {
  switch (cause.kind) {
    case 'utterance':
      return `“${truncate(cause.payload.text)}” — generating…`;
    case 'surface-action': {
      const subject = describeAction(cause.payload.action);
      return subject ? `${subject} — generating…` : 'Generating…';
    }
    case 'overlay-answer': {
      if (cause.payload.question) return `answered “${cause.payload.question}” — generating…`;
      const subject = describeAction(cause.payload.answer);
      return subject ? `${subject} — generating…` : 'Generating…';
    }
  }
}
