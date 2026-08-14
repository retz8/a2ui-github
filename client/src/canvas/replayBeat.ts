/**
 * Drives a recorded beat (task 8.1 fixture) through the canvas apply pipeline — the zero-LLM
 * verification path of phase-8 spec decision 17. Paced by the recorded `offsetMs` by default,
 * so the replay rehearses the same progressive-streaming behaviour the live agent produces;
 * instant mode collapses the waits for tests and the `&instant` query param.
 *
 * Unlike `beats/replay.ts` (the 8.1 gate's bare apply-loop), this rehearses the full shell:
 * in-flight state around each turn, and the recorded agent prose routed into the ambient-notice
 * channel.
 */
import type {A2uiMessage} from '@a2ui/web_core/v0_9';
import type {BeatFixture} from '../beats/beatFixtures';
import type {CanvasStore} from './canvasStore';

export interface ReplayBeatOptions {
  /** The canvas apply pipeline; one call per recorded batch, exactly as the live client does. */
  apply: (messages: A2uiMessage[]) => void;
  store: CanvasStore;
  /** Honour the recorded offsets (default); false applies everything immediately. */
  paced?: boolean;
}

const sleep = (ms: number) => new Promise<void>(resolve => setTimeout(resolve, ms));

export async function replayBeatOnCanvas(
  fixture: BeatFixture,
  {apply, store, paced = true}: ReplayBeatOptions,
): Promise<void> {
  for (const turn of fixture.turns) {
    store.beginPaint('Generating…');
    try {
      let elapsed = 0;
      // Recorded texts are stream fragments (a sentence can split mid-word across events), so
      // the notice carries the turn's accumulated prose — the same grouping the chat transcript
      // uses — rather than one flickering notice per fragment.
      let prose = '';
      for (const batch of turn.batches) {
        if (paced && batch.offsetMs > elapsed) {
          await sleep(batch.offsetMs - elapsed);
          elapsed = batch.offsetMs;
        }
        if (batch.messages.length) apply(batch.messages);
        for (const text of batch.texts) {
          prose += text;
          if (prose.trim()) store.showNotice(prose);
        }
      }
    } finally {
      store.endPaint();
    }
  }
}
