import {describe, it, expect, afterEach, beforeEach} from 'vitest';
import {render, screen, cleanup, fireEvent, within} from '@testing-library/react';
import {BaseStyles, ThemeProvider} from '@primer/react';
import {TestSpace} from '../src/test-space/TestSpace';

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
  it('lists every fixture and defaults to the first', () => {
    renderTestSpace();
    const select = screen.getByTestId('fixture-select') as HTMLSelectElement;
    expect(within(select).getAllByRole('option')).toHaveLength(5);
    expect(select.value).toBe('text');
    expect(screen.getByText('Hello from Primer')).toBeInTheDocument();
  });

  it('swaps the rendered surface when a new fixture is chosen', () => {
    renderTestSpace();
    fireEvent.change(screen.getByTestId('fixture-select'), {target: {value: 'button-fn'}});
    expect(screen.getByRole('button', {name: 'Run local function'})).toBeInTheDocument();
    expect(screen.queryByText('Hello from Primer')).not.toBeInTheDocument();
  });

  it('deep-links the initial fixture from the ?fixture= URL param', () => {
    window.history.replaceState({}, '', '/?fixture=button-event');
    renderTestSpace();
    expect((screen.getByTestId('fixture-select') as HTMLSelectElement).value).toBe('button-event');
    expect(screen.getByRole('button', {name: 'Send event'})).toBeInTheDocument();
  });
});
