import {Component, type ReactNode} from 'react';

type Props = {surfaceId: string; children: ReactNode};
type State = {failed: boolean};

/**
 * Containment for one agent surface: surfaces render progressively from an unvalidated
 * stream, so a bad component must degrade to a fallback note instead of unmounting the
 * whole chat. Keyed per surface — a retried surface mounts a fresh boundary.
 */
export class SurfaceErrorBoundary extends Component<Props, State> {
  state: State = {failed: false};

  static getDerivedStateFromError(): State {
    return {failed: true};
  }

  componentDidCatch(error: unknown) {
    console.error(`[A2UI:render] surface ${this.props.surfaceId} failed to render`, error);
  }

  render() {
    if (this.state.failed) {
      return (
        <div className="chat-surface-error" data-testid={`surface-error-${this.props.surfaceId}`}>
          This view failed to render.
        </div>
      );
    }
    return this.props.children;
  }
}
