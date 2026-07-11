import {describe, it, expect, vi, afterEach} from 'vitest';
import {screen, cleanup, fireEvent} from '@testing-library/react';
import {renderFixture} from './helpers';
import {buttonFnFixture} from '../src/fixtures/button-fn';
import {buttonEventFixture} from '../src/fixtures/button-event';
import {tokenRemoveFnFixture} from '../src/fixtures/token-remove-fn';
import {tokenRemoveEventFixture} from '../src/fixtures/token-remove-event';
import {issuelabeltokenRemoveFnFixture} from '../src/fixtures/issuelabeltoken-remove-fn';
import {issuelabeltokenRemoveEventFixture} from '../src/fixtures/issuelabeltoken-remove-event';

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
        sourceComponentId: 'root',
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
        sourceComponentId: 'root',
      }),
    );
  });
});
