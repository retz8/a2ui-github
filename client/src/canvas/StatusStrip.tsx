/**
 * The status strip: the thin always-visible region carrying the status register (phase-8 spec
 * decision 2). Three states — idle hint, in-flight spinner + label, sticky error (cleared by
 * the next dispatch) — plus the always-visible palette affordance for viewers who don't know
 * the shortcut. The in-flight label upgrades to the agent-authored paint title in 8.5.
 */
import {Button, Spinner} from '@primer/react';
import type {CanvasState} from './canvasStore';

export interface StatusStripProps {
  state: CanvasState;
  onSummonPalette: () => void;
}

export function StatusStrip({state, onSummonPalette}: StatusStripProps) {
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
      <Button size="small" onClick={onSummonPalette}>
        Ask
      </Button>
    </div>
  );
}
