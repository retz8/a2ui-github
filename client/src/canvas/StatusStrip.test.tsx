/**
 * The status strip (task 8.2): the thin always-visible region for the status register
 * (phase-8 spec decision 2) — idle hint, in-flight spinner + label, sticky error — plus the
 * visible palette affordance.
 */
import {describe, it, expect, vi} from 'vitest';
import {screen} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {renderWithPrimer} from '../../tests/helpers';
import {createCanvasStore} from './canvasStore';
import {StatusStrip} from './StatusStrip';

describe('StatusStrip', () => {
  it('idle: shows the summon hint', () => {
    const store = createCanvasStore();
    renderWithPrimer(<StatusStrip state={store.getState()} onSummonPalette={() => {}} />);
    expect(screen.getByText(/⌘K to ask/)).toBeInTheDocument();
  });

  it('always shows the palette affordance, and clicking it summons', async () => {
    const onSummonPalette = vi.fn();
    const store = createCanvasStore();
    renderWithPrimer(<StatusStrip state={store.getState()} onSummonPalette={onSummonPalette} />);
    await userEvent.click(screen.getByRole('button', {name: /ask/i}));
    expect(onSummonPalette).toHaveBeenCalled();
  });

  it('in flight: shows the paint label', () => {
    const store = createCanvasStore();
    store.beginPaint('open PRs — generating…');
    renderWithPrimer(<StatusStrip state={store.getState()} onSummonPalette={() => {}} />);
    expect(screen.getByTestId('canvas-pending')).toHaveTextContent('open PRs — generating…');
  });

  it('error: sticky failure text as an alert', () => {
    const store = createCanvasStore();
    store.reportError('The agent request failed.');
    renderWithPrimer(<StatusStrip state={store.getState()} onSummonPalette={() => {}} />);
    expect(screen.getByRole('alert')).toHaveTextContent('The agent request failed.');
  });
});
