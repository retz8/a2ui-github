import {describe, it, expect, afterEach, vi} from 'vitest';
import {screen, cleanup, waitFor, fireEvent} from '@testing-library/react';
import {renderFixture} from './helpers';
import {formatStringFnFixture} from '../src/fixtures/format-string-fn';
import {validationGateFnFixture} from '../src/fixtures/validation-gate-fn';
import {openUrlFnFixture} from '../src/fixtures/open-url-fn';

// The renderer-level half of task 7.9. The adapter's unit tests prove each adopted function's
// execute() in isolation against a stubbed data context; these prove the three ways a function is
// actually consumed on a surface — as a bound value, as a validation gate, and as an action effect
// — which a stubbed context cannot reach.

afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
});

describe('formatString as a bound value', () => {
  it('interpolates data-model paths into the rendered text', async () => {
    renderFixture(formatStringFnFixture);
    await waitFor(() => expect(screen.getByText('Fix heading levels')).toBeInTheDocument());
  });

  it('resolves a nested function call inside the template', async () => {
    renderFixture(formatStringFnFixture);
    await waitFor(() =>
      expect(screen.getByText('a2ui-project/a2ui — 3 comments')).toBeInTheDocument(),
    );
  });

  it('repaints when the interpolated path changes', async () => {
    renderFixture(formatStringFnFixture);
    const input = await screen.findByPlaceholderText('Pull request title');
    fireEvent.change(input, {target: {value: 'Revert heading cleanup'}});
    await waitFor(() => expect(screen.getByText('Revert heading cleanup')).toBeInTheDocument());
    expect(screen.queryByText('Fix heading levels')).not.toBeInTheDocument();
  });
});

describe('required + not as a validation gate', () => {
  it('disables the submit control while the guarded field is empty', async () => {
    renderFixture(validationGateFnFixture);
    const submit = await screen.findByRole('button', {name: 'Submit review'});
    await waitFor(() => expect(submit).toBeDisabled());
  });

  it('enables it once the field is filled, with no agent round trip', async () => {
    const actionHandler = vi.fn();
    renderFixture(validationGateFnFixture, {actionHandler});
    const input = await screen.findByPlaceholderText('Review comment');
    fireEvent.change(input, {target: {value: 'Looks reasonable to me.'}});
    const submit = await screen.findByRole('button', {name: 'Submit review'});
    await waitFor(() => expect(submit).toBeEnabled());
    expect(actionHandler).not.toHaveBeenCalled();
  });
});

describe('openUrl as an action effect', () => {
  it('opens the url in a new tab and sends no event to the agent', async () => {
    const open = vi.spyOn(window, 'open').mockImplementation(() => null);
    const actionHandler = vi.fn();
    renderFixture(openUrlFnFixture, {actionHandler});
    fireEvent.click(await screen.findByRole('button', {name: 'View on GitHub'}));
    await waitFor(() =>
      expect(open).toHaveBeenCalledWith('https://github.com/a2ui-project/a2ui/pull/1668', '_blank'),
    );
    expect(actionHandler).not.toHaveBeenCalled();
  });
});
