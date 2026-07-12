import {describe, it, expect, vi, afterEach} from 'vitest';
import {screen, cleanup, fireEvent} from '@testing-library/react';
import {renderFixture} from './helpers';
import {buttonFnFixture} from '../src/fixtures/button-fn';
import {buttonEventFixture} from '../src/fixtures/button-event';
import {iconbuttonFnFixture} from '../src/fixtures/iconbutton-fn';
import {iconbuttonEventFixture} from '../src/fixtures/iconbutton-event';
import {tokenRemoveFnFixture} from '../src/fixtures/token-remove-fn';
import {tokenRemoveEventFixture} from '../src/fixtures/token-remove-event';
import {issuelabeltokenRemoveFnFixture} from '../src/fixtures/issuelabeltoken-remove-fn';
import {issuelabeltokenRemoveEventFixture} from '../src/fixtures/issuelabeltoken-remove-event';
import {checkboxBoundFixture} from '../src/fixtures/checkbox-bound';
import {paginationControlledFixture} from '../src/fixtures/pagination-controlled';
import {radioFnFixture} from '../src/fixtures/radio-fn';
import {radioEventFixture} from '../src/fixtures/radio-event';
import {toggleswitchFnFixture} from '../src/fixtures/toggleswitch-fn';
import {toggleswitchEventFixture} from '../src/fixtures/toggleswitch-event';
import {segmentedcontrolFnFixture} from '../src/fixtures/segmentedcontrol-fn';
import {segmentedcontrolEventFixture} from '../src/fixtures/segmentedcontrol-event';
import {segmentedcontrolBoundFixture} from '../src/fixtures/segmentedcontrol-bound';

afterEach(cleanup);

describe('action paths', () => {
  it('path-1: functionCall runs the registered consoleLog locally, not via the handler', () => {
    const logSpy = vi.spyOn(console, 'log').mockImplementation(() => {});
    const handler = vi.fn();
    renderFixture(buttonFnFixture, {actionHandler: handler});

    fireEvent.click(screen.getByRole('button', {name: 'Run local function'}));

    expect(logSpy).toHaveBeenCalledWith('[A2UI]', 'button-fn clicked');
    expect(handler).not.toHaveBeenCalled();
    logSpy.mockRestore();
  });

  it('path-2: event is dispatched to the actionHandler', async () => {
    const handler = vi.fn();
    renderFixture(buttonEventFixture, {actionHandler: handler});

    fireEvent.click(screen.getByRole('button', {name: 'Send event'}));

    await vi.waitFor(() => expect(handler).toHaveBeenCalledTimes(1));
    expect(handler).toHaveBeenCalledWith(
      expect.objectContaining({
        name: 'submit',
        surfaceId: 'button-event',
        sourceComponentId: 'root',
      }),
    );
  });

  it('IconButton functionCall runs the registered consoleLog locally, not via the handler', () => {
    const logSpy = vi.spyOn(console, 'log').mockImplementation(() => {});
    const handler = vi.fn();
    renderFixture(iconbuttonFnFixture, {actionHandler: handler});

    fireEvent.click(screen.getByRole('button', {name: 'Like'}));

    expect(logSpy).toHaveBeenCalledWith('[A2UI]', 'iconbutton-fn clicked');
    expect(handler).not.toHaveBeenCalled();
    logSpy.mockRestore();
  });

  it('IconButton event is dispatched to the actionHandler', async () => {
    const handler = vi.fn();
    renderFixture(iconbuttonEventFixture, {actionHandler: handler});

    fireEvent.click(screen.getByRole('button', {name: 'Approve'}));

    await vi.waitFor(() => expect(handler).toHaveBeenCalledTimes(1));
    expect(handler).toHaveBeenCalledWith(
      expect.objectContaining({
        name: 'approve',
        surfaceId: 'iconbutton-event',
        sourceComponentId: 'root',
      }),
    );
  });

  it('Token removeAction functionCall runs consoleLog locally, not via the handler', () => {
    const logSpy = vi.spyOn(console, 'log').mockImplementation(() => {});
    const handler = vi.fn();
    renderFixture(tokenRemoveFnFixture, {actionHandler: handler});

    fireEvent.click(screen.getByRole('button', {name: 'Remove token'}));

    expect(logSpy).toHaveBeenCalledWith('[A2UI]', 'token-remove clicked');
    expect(handler).not.toHaveBeenCalled();
    logSpy.mockRestore();
  });

  it('Token removeAction event is dispatched to the actionHandler', async () => {
    const handler = vi.fn();
    renderFixture(tokenRemoveEventFixture, {actionHandler: handler});

    fireEvent.click(screen.getByRole('button', {name: 'Remove token'}));

    await vi.waitFor(() => expect(handler).toHaveBeenCalledTimes(1));
    expect(handler).toHaveBeenCalledWith(
      expect.objectContaining({
        name: 'token-remove',
        surfaceId: 'token-remove-event',
        sourceComponentId: 'token',
      }),
    );
  });

  it('IssueLabelToken removeAction functionCall runs consoleLog locally, not via the handler', () => {
    const logSpy = vi.spyOn(console, 'log').mockImplementation(() => {});
    const handler = vi.fn();
    renderFixture(issuelabeltokenRemoveFnFixture, {actionHandler: handler});

    fireEvent.click(screen.getByRole('button', {name: 'Remove token'}));

    expect(logSpy).toHaveBeenCalledWith('[A2UI]', 'issue-label-remove clicked');
    expect(handler).not.toHaveBeenCalled();
    logSpy.mockRestore();
  });

  it('IssueLabelToken removeAction event is dispatched to the actionHandler', async () => {
    const handler = vi.fn();
    renderFixture(issuelabeltokenRemoveEventFixture, {actionHandler: handler});

    fireEvent.click(screen.getByRole('button', {name: 'Remove token'}));

    await vi.waitFor(() => expect(handler).toHaveBeenCalledTimes(1));
    expect(handler).toHaveBeenCalledWith(
      expect.objectContaining({
        name: 'issue-label-remove',
        surfaceId: 'issuelabeltoken-remove-event',
        sourceComponentId: 'issuelabeltoken',
      }),
    );
  });

  it('two-way write-back: toggling a bound Checkbox writes to the data-model path and re-renders checked', async () => {
    const handler = vi.fn();
    renderFixture(checkboxBoundFixture, {actionHandler: handler});

    const box = screen.getByRole('checkbox', {name: 'Notify me about updates'});
    expect(box).not.toBeChecked();

    fireEvent.click(box);

    // The binder's auto-generated setChecked wrote `true` back to /notify; the box re-renders
    // from the updated data model. No client->server action is dispatched for a data-model write.
    await vi.waitFor(() =>
      expect(screen.getByRole('checkbox', {name: 'Notify me about updates'})).toBeChecked(),
    );
    expect(handler).not.toHaveBeenCalled();
  });

  it('two-way write-back: clicking a page in a controlled Pagination writes the new page and moves aria-current, no navigation', async () => {
    const handler = vi.fn();
    renderFixture(paginationControlledFixture, {actionHandler: handler});

    // Bound to /page (initially 2) -> page 2 is current.
    expect(screen.getByRole('link', {name: 'Page 2'})).toHaveAttribute('aria-current', 'page');

    fireEvent.click(screen.getByRole('link', {name: 'Page 4'}));

    // The binder's auto-generated setCurrentPage wrote `4` back to /page; aria-current moves to
    // page 4. onPageChange preventDefaulted, so no navigation and no client->server action.
    await vi.waitFor(() =>
      expect(screen.getByRole('link', {name: 'Page 4'})).toHaveAttribute('aria-current', 'page'),
    );
    expect(screen.getByRole('link', {name: 'Page 2'})).not.toHaveAttribute('aria-current');
    expect(handler).not.toHaveBeenCalled();
  });

  it('path-1 (Radio): functionCall runs consoleLog locally, not via the handler', () => {
    const logSpy = vi.spyOn(console, 'log').mockImplementation(() => {});
    const handler = vi.fn();
    renderFixture(radioFnFixture, {actionHandler: handler});

    fireEvent.click(screen.getByRole('radio'));

    expect(logSpy).toHaveBeenCalledWith('[A2UI]', 'radio-fn selected');
    expect(handler).not.toHaveBeenCalled();
    logSpy.mockRestore();
  });

  it('path-2 (Radio): event is dispatched to the actionHandler', async () => {
    const handler = vi.fn();
    renderFixture(radioEventFixture, {actionHandler: handler});

    fireEvent.click(screen.getByRole('radio'));

    await vi.waitFor(() => expect(handler).toHaveBeenCalledTimes(1));
    expect(handler).toHaveBeenCalledWith(
      expect.objectContaining({
        name: 'select',
        surfaceId: 'radio-event',
        sourceComponentId: 'radio',
      }),
    );
  });

  it('path-1: ToggleSwitch functionCall runs consoleLog locally on flip, not via the handler', () => {
    const logSpy = vi.spyOn(console, 'log').mockImplementation(() => {});
    const handler = vi.fn();
    renderFixture(toggleswitchFnFixture, {actionHandler: handler});

    fireEvent.click(screen.getByRole('button'));

    expect(logSpy).toHaveBeenCalledWith('[A2UI]', 'toggleswitch-fn toggled');
    expect(handler).not.toHaveBeenCalled();
    logSpy.mockRestore();
  });

  it('path-2: ToggleSwitch event is dispatched to the actionHandler on flip', async () => {
    const handler = vi.fn();
    renderFixture(toggleswitchEventFixture, {actionHandler: handler});

    fireEvent.click(screen.getByRole('button'));

    await vi.waitFor(() => expect(handler).toHaveBeenCalledTimes(1));
    expect(handler).toHaveBeenCalledWith(
      expect.objectContaining({
        name: 'toggle',
        surfaceId: 'toggleswitch-event',
        sourceComponentId: 'toggleswitch',
      }),
    );
  });

  it('path-1 (SegmentedControl): selecting a segment runs consoleLog locally, not via the handler', () => {
    const logSpy = vi.spyOn(console, 'log').mockImplementation(() => {});
    const handler = vi.fn();
    renderFixture(segmentedcontrolFnFixture, {actionHandler: handler});

    fireEvent.click(screen.getByRole('button', {name: 'Raw'}));

    expect(logSpy).toHaveBeenCalledWith('[A2UI]', 'segment changed');
    expect(handler).not.toHaveBeenCalled();
    logSpy.mockRestore();
  });

  it('path-2 (SegmentedControl): selecting a segment dispatches the event from the container', async () => {
    const handler = vi.fn();
    renderFixture(segmentedcontrolEventFixture, {actionHandler: handler});

    fireEvent.click(screen.getByRole('button', {name: 'Blame'}));

    await vi.waitFor(() => expect(handler).toHaveBeenCalledTimes(1));
    expect(handler).toHaveBeenCalledWith(
      expect.objectContaining({
        name: 'change',
        surfaceId: 'segmentedcontrol-event',
        sourceComponentId: 'control',
      }),
    );
  });

  it('two-way write-back: clicking a segment writes selectedIndex to the bound path and re-renders selected', async () => {
    const handler = vi.fn();
    renderFixture(segmentedcontrolBoundFixture, {actionHandler: handler});

    // /view starts 0 -> Preview active.
    expect(screen.getByRole('button', {name: 'Preview'})).toHaveAttribute('aria-current', 'true');

    fireEvent.click(screen.getByRole('button', {name: 'Blame'}));

    // The binder's auto-generated setSelectedIndex wrote 2 back to /view; the control re-renders
    // from the updated data model. No client->server action is dispatched for a data-model write.
    await vi.waitFor(() =>
      expect(screen.getByRole('button', {name: 'Blame'})).toHaveAttribute('aria-current', 'true'),
    );
    expect(screen.getByRole('button', {name: 'Preview'})).not.toHaveAttribute(
      'aria-current',
      'true',
    );
    expect(handler).not.toHaveBeenCalled();
  });
});
