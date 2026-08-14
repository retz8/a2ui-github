/**
 * The status strip: the thin always-visible region carrying the status register (phase-8 spec
 * decision 2). In-flight spinner + label, or sticky error (cleared by the next dispatch);
 * idle is quiet — no status means an empty bar, and the ⌘K shortcut lives on the Ask pill.
 * The in-flight label upgrades to the agent-authored paint title in 8.5.
 */
import {Spinner} from '@primer/react';
import type {CanvasState} from './canvasStore';

export interface StatusStripProps {
  state: CanvasState;
}

export function StatusStrip({state}: StatusStripProps) {
  return (
    <div className="canvas-status-strip">
      <div className="canvas-status-message" data-testid="canvas-status">
        {state.error ? (
          <span className="canvas-status-error" role="alert" data-testid="canvas-error">
            {state.error}
          </span>
        ) : state.inFlight ? (
          <span className="canvas-status-pending" data-testid="canvas-pending">
            <Spinner size="small" />
            {state.inFlight.label}
          </span>
        ) : null}
      </div>
    </div>
  );
}
