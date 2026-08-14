/**
 * The status strip: the thin always-visible region carrying the status register (phase-8 spec
 * decision 2). Three states — idle hint, in-flight spinner + label, sticky error (cleared by
 * the next dispatch). Status only: the palette affordance is the canvas's floating Ask pill.
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
      <div className="canvas-status-message">
        {state.error ? (
          <span className="canvas-status-error" role="alert" data-testid="canvas-error">
            {state.error}
          </span>
        ) : state.inFlight ? (
          <span className="canvas-status-pending" data-testid="canvas-pending">
            <Spinner size="small" />
            {state.inFlight.label}
          </span>
        ) : (
          <span className="canvas-status-hint">⌘K to ask</span>
        )}
      </div>
    </div>
  );
}
