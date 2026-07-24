import {describe, it, expect, afterEach, vi, beforeEach} from 'vitest';
import {render, screen, cleanup} from '@testing-library/react';
import {SurfaceErrorBoundary} from './SurfaceErrorBoundary';

afterEach(cleanup);

// React logs the caught error; keep test output clean.
beforeEach(() => {
  vi.spyOn(console, 'error').mockImplementation(() => {});
});
afterEach(() => {
  vi.restoreAllMocks();
});

function Bomb(): never {
  throw new Error('surface render exploded');
}

describe('SurfaceErrorBoundary', () => {
  it('renders its child when nothing throws', () => {
    render(
      <SurfaceErrorBoundary surfaceId="s1">
        <div>healthy surface</div>
      </SurfaceErrorBoundary>,
    );
    expect(screen.getByText('healthy surface')).toBeInTheDocument();
  });

  it('shows the fallback instead of propagating a render crash', () => {
    render(
      <SurfaceErrorBoundary surfaceId="s1">
        <Bomb />
      </SurfaceErrorBoundary>,
    );
    expect(screen.getByTestId('surface-error-s1')).toBeInTheDocument();
    expect(screen.getByText('This view failed to render.')).toBeInTheDocument();
  });

  it('contains the crash to the failing surface only', () => {
    render(
      <>
        <SurfaceErrorBoundary surfaceId="bad">
          <Bomb />
        </SurfaceErrorBoundary>
        <SurfaceErrorBoundary surfaceId="good">
          <div>still alive</div>
        </SurfaceErrorBoundary>
      </>,
    );
    expect(screen.getByTestId('surface-error-bad')).toBeInTheDocument();
    expect(screen.getByText('still alive')).toBeInTheDocument();
  });
});
