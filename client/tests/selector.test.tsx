import {describe, it, expect, afterEach, beforeEach} from 'vitest';
import {render, screen, cleanup, fireEvent, within, waitFor} from '@testing-library/react';
import {BaseStyles, ThemeProvider} from '@primer/react';
import {TestSpace} from '../src/test-space/TestSpace';
import {FIXTURES} from '../src/fixtures';

function renderTestSpace() {
  return render(
    <ThemeProvider>
      <BaseStyles>
        <TestSpace />
      </BaseStyles>
    </ThemeProvider>,
  );
}

beforeEach(() => window.history.replaceState({}, '', '/'));
afterEach(cleanup);

describe('TestSpace selector', () => {
  it('lists every fixture and defaults to the first', async () => {
    renderTestSpace();
    const select = screen.getByTestId('fixture-select') as HTMLSelectElement;
    // The option list is populated from the cheap name list — no fixture body imported yet.
    expect(within(select).getAllByRole('option')).toHaveLength(FIXTURES.length);
    expect(select.value).toBe('text');
    // The selected fixture's body loads on demand, so its rendered output appears asynchronously.
    expect(await screen.findByText('Hello from Primer')).toBeInTheDocument();
  });

  it('swaps the rendered surface when a new fixture is chosen', async () => {
    renderTestSpace();
    fireEvent.change(screen.getByTestId('fixture-select'), {target: {value: 'button-fn'}});
    expect(await screen.findByRole('button', {name: 'Run local function'})).toBeInTheDocument();
    await waitFor(() => expect(screen.queryByText('Hello from Primer')).not.toBeInTheDocument());
  });

  it('deep-links the initial fixture from the ?fixture= URL param', async () => {
    window.history.replaceState({}, '', '/?fixture=button-event');
    renderTestSpace();
    expect((screen.getByTestId('fixture-select') as HTMLSelectElement).value).toBe('button-event');
    expect(await screen.findByRole('button', {name: 'Send event'})).toBeInTheDocument();
  });
});
