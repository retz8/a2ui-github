/**
 * The command palette (task 8.2): the summonable language input — speak and dismiss.
 * Summoning (⌘K, the strip affordance, auto-open) is CanvasApp's job, not the palette's.
 */
import {describe, it, expect, vi} from 'vitest';
import {screen} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {renderWithPrimer} from '../../tests/helpers';
import {Palette} from './Palette';

describe('Palette', () => {
  it('renders nothing while closed', () => {
    renderWithPrimer(
      <Palette open={false} blocked={false} onDismiss={() => {}} onSubmit={() => {}} />,
    );
    expect(screen.queryByRole('textbox')).toBeNull();
  });

  it('focuses its input when opened', () => {
    renderWithPrimer(<Palette open blocked={false} onDismiss={() => {}} onSubmit={() => {}} />);
    expect(screen.getByRole('textbox')).toHaveFocus();
  });

  it('Enter dispatches the trimmed utterance and clears the input', async () => {
    const onSubmit = vi.fn();
    renderWithPrimer(<Palette open blocked={false} onDismiss={() => {}} onSubmit={onSubmit} />);
    const input = screen.getByRole('textbox');
    await userEvent.type(input, '  show my PRs  {Enter}');
    expect(onSubmit).toHaveBeenCalledWith('show my PRs');
    expect(input).toHaveValue('');
  });

  it('Enter on an empty input dispatches nothing', async () => {
    const onSubmit = vi.fn();
    renderWithPrimer(<Palette open blocked={false} onDismiss={() => {}} onSubmit={onSubmit} />);
    await userEvent.type(screen.getByRole('textbox'), '{Enter}');
    expect(onSubmit).not.toHaveBeenCalled();
  });

  it('Escape dismisses without dispatching', async () => {
    const onDismiss = vi.fn();
    const onSubmit = vi.fn();
    renderWithPrimer(<Palette open blocked={false} onDismiss={onDismiss} onSubmit={onSubmit} />);
    await userEvent.type(screen.getByRole('textbox'), 'half-typed{Escape}');
    expect(onDismiss).toHaveBeenCalled();
    expect(onSubmit).not.toHaveBeenCalled();
  });

  it('while blocked, send is refused with a cue instead of dispatching', async () => {
    const onSubmit = vi.fn();
    renderWithPrimer(<Palette open blocked onDismiss={() => {}} onSubmit={onSubmit} />);
    await userEvent.type(screen.getByRole('textbox'), 'another ask{Enter}');
    expect(onSubmit).not.toHaveBeenCalled();
    expect(screen.getByText(/wait/i)).toBeInTheDocument();
  });
});
