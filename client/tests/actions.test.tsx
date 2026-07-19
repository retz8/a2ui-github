import {describe, it, expect, vi, afterEach} from 'vitest';
import {screen, cleanup, fireEvent} from '@testing-library/react';
import {renderFixture} from './helpers';
import {dialogCloseFnFixture} from '../src/fixtures/dialog-close-fn';
import {dialogCloseEventFixture} from '../src/fixtures/dialog-close-event';
import {dialogButtonsFixture} from '../src/fixtures/dialog-buttons';
import {dialogSlotsFixture} from '../src/fixtures/dialog-slots';
import {confirmationDialogFixture} from '../src/fixtures/confirmation-dialog';
import {confirmationDialogEventFixture} from '../src/fixtures/confirmation-dialog-event';
import {contentClickoutsideFnFixture} from '../src/fixtures/content-clickoutside-fn';
import {contentClickoutsideEventFixture} from '../src/fixtures/content-clickoutside-event';
import {anchoredOverlayBoundFixture} from '../src/fixtures/anchored-overlay-bound';
import {anchoredOverlayActionsFnFixture} from '../src/fixtures/anchored-overlay-actions-fn';
import {anchoredOverlayActionsEventFixture} from '../src/fixtures/anchored-overlay-actions-event';
import {buttonFnFixture} from '../src/fixtures/button-fn';
import {buttonEventFixture} from '../src/fixtures/button-event';
import {iconbuttonFnFixture} from '../src/fixtures/iconbutton-fn';
import {iconbuttonEventFixture} from '../src/fixtures/iconbutton-event';
import {tokenRemoveFnFixture} from '../src/fixtures/token-remove-fn';
import {tokenRemoveEventFixture} from '../src/fixtures/token-remove-event';
import {issuelabeltokenRemoveFnFixture} from '../src/fixtures/issuelabeltoken-remove-fn';
import {issuelabeltokenRemoveEventFixture} from '../src/fixtures/issuelabeltoken-remove-event';
import {checkboxBoundFixture} from '../src/fixtures/checkbox-bound';
import {checkboxGroupFixture} from '../src/fixtures/checkbox-group';
import {paginationControlledFixture} from '../src/fixtures/pagination-controlled';
import {radioFnFixture} from '../src/fixtures/radio-fn';
import {radioEventFixture} from '../src/fixtures/radio-event';
import {toggleswitchFnFixture} from '../src/fixtures/toggleswitch-fn';
import {toggleswitchEventFixture} from '../src/fixtures/toggleswitch-event';
import {segmentedcontrolFnFixture} from '../src/fixtures/segmentedcontrol-fn';
import {segmentedcontrolEventFixture} from '../src/fixtures/segmentedcontrol-event';
import {segmentedcontrolBoundFixture} from '../src/fixtures/segmentedcontrol-bound';
import {detailsBoundFixture} from '../src/fixtures/details-bound';
import {detailsClickoutsideFnFixture} from '../src/fixtures/details-clickoutside-fn';
import {selectBoundFixture} from '../src/fixtures/select-bound';
import {textinputActionFnFixture} from '../src/fixtures/textinput-action-fn';
import {textinputActionEventFixture} from '../src/fixtures/textinput-action-event';
import {textinputBoundFixture} from '../src/fixtures/textinput-bound';
import {navlistTrailingactionFnFixture} from '../src/fixtures/navlist-trailingaction-fn';
import {navlistTrailingactionEventFixture} from '../src/fixtures/navlist-trailingaction-event';
import {navlistGroupexpandShowmoreFixture} from '../src/fixtures/navlist-groupexpand';
import {actionlistItemFnFixture} from '../src/fixtures/actionlist-item-fn';
import {actionlistItemEventFixture} from '../src/fixtures/actionlist-item-event';
import {actionlistSelectedBoundFixture} from '../src/fixtures/actionlist-selected-bound';
import {actionlistTrailingactionFnFixture} from '../src/fixtures/actionlist-trailingaction-fn';
import {actionlistTrailingactionEventFixture} from '../src/fixtures/actionlist-trailingaction-event';
import {actionBarIconButtonFnFixture} from '../src/fixtures/action-bar-icon-button-fn';
import {actionBarIconButtonEventFixture} from '../src/fixtures/action-bar-icon-button-event';
import {actionBarMenuFixture} from '../src/fixtures/action-bar-menu';
import {treeViewItemFnFixture} from '../src/fixtures/tree-view-item-fn';
import {treeViewItemEventFixture} from '../src/fixtures/tree-view-item-event';
import {treeViewItemSecondaryActionsFixture} from '../src/fixtures/tree-view-item-secondary-actions';
import {treeViewErrorDialogFixture} from '../src/fixtures/tree-view-error-dialog';
import {underlineNavItemFnFixture} from '../src/fixtures/underline-nav-item-fn';
import {underlineNavItemEventFixture} from '../src/fixtures/underline-nav-item-event';
import {timelineActionsFixture} from '../src/fixtures/timeline-actions';
import {selectPanelItemFnFixture} from '../src/fixtures/selectpanel-item-fn';
import {selectPanelItemEventFixture} from '../src/fixtures/selectpanel-item-event';
import {selectPanelItemSelectedBoundFixture} from '../src/fixtures/selectpanel-item-selected-bound';
import {selectPanelToggleFixture} from '../src/fixtures/selectpanel-toggle';
import {selectPanelOnopenchangeFnFixture} from '../src/fixtures/selectpanel-onopenchange-fn';
import {selectPanelOnopenchangeEventFixture} from '../src/fixtures/selectpanel-onopenchange-event';
import {autocompleteAddnewFnFixture} from '../src/fixtures/autocomplete-addnew-fn';
import {autocompleteAddnewEventFixture} from '../src/fixtures/autocomplete-addnew-event';

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

  it('path-1: Timeline.Actions button functionCall runs consoleLog locally, not via the handler', () => {
    const logSpy = vi.spyOn(console, 'log').mockImplementation(() => {});
    const handler = vi.fn();
    renderFixture(timelineActionsFixture, {actionHandler: handler});

    fireEvent.click(screen.getByRole('button', {name: 'Revert'}));

    expect(logSpy).toHaveBeenCalledWith('[A2UI]', 'revert clicked');
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

  it('two-way write-back: toggling an option in a CheckboxGroup writes the new state and re-renders checked, no client->server action', async () => {
    const handler = vi.fn();
    renderFixture(checkboxGroupFixture, {actionHandler: handler});

    // Baseline: /comments is true, /prs is false.
    expect(screen.getByRole('checkbox', {name: 'Comments'})).toBeChecked();
    const prs = screen.getByRole('checkbox', {name: 'Pull requests'});
    expect(prs).not.toBeChecked();

    fireEvent.click(prs);

    // The option's Checkbox is a normal two-way input: its auto-generated setChecked wrote `true`
    // back to /prs and the box re-renders checked. The CheckboxGroup is a pure grouping wrapper —
    // it emits no Action, so no client->server message is dispatched.
    await vi.waitFor(() =>
      expect(screen.getByRole('checkbox', {name: 'Pull requests'})).toBeChecked(),
    );
    expect(screen.getByRole('checkbox', {name: 'Comments'})).toBeChecked();
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

  it('path-1: TextInput.Action functionCall runs consoleLog locally, not via the handler', () => {
    const logSpy = vi.spyOn(console, 'log').mockImplementation(() => {});
    const handler = vi.fn();
    renderFixture(textinputActionFnFixture, {actionHandler: handler});

    fireEvent.click(screen.getByRole('button', {name: 'Search'}));

    expect(logSpy).toHaveBeenCalledWith('[A2UI]', 'action clicked');
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

  it('path-2: TextInput.Action event is dispatched to the actionHandler', async () => {
    const handler = vi.fn();
    renderFixture(textinputActionEventFixture, {actionHandler: handler});

    fireEvent.click(screen.getByRole('button', {name: 'Search'}));

    await vi.waitFor(() => expect(handler).toHaveBeenCalledTimes(1));
    expect(handler).toHaveBeenCalledWith(
      expect.objectContaining({
        name: 'search',
        surfaceId: 'textinput-action-event',
        sourceComponentId: 'search-action',
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
  it('two-way write-back: toggling a bound Details summary writes open to the data-model path and re-renders expanded', async () => {
    const handler = vi.fn();
    const {container} = renderFixture(detailsBoundFixture, {actionHandler: handler});

    const details = container.querySelector('details') as HTMLDetailsElement;
    expect(details).not.toHaveAttribute('open');

    fireEvent.click(screen.getByText('More info'));

    // The binder's auto-generated setOpen wrote `true` back to /expanded; the disclosure
    // re-renders from the updated data model. No client->server action is dispatched.
    await vi.waitFor(() => expect(container.querySelector('details')).toHaveAttribute('open'));
    expect(handler).not.toHaveBeenCalled();
  });

  it('Details onClickOutside functionCall runs windowAlert locally (and collapses), not via the handler', async () => {
    const alertSpy = vi.spyOn(window, 'alert').mockImplementation(() => undefined);
    const handler = vi.fn();
    const {container} = renderFixture(detailsClickoutsideFnFixture, {actionHandler: handler});

    const details = container.querySelector('details') as HTMLDetailsElement;
    expect(details).toHaveAttribute('open');

    fireEvent.click(document.body);

    expect(alertSpy).toHaveBeenCalledWith('clicked outside');
    expect(handler).not.toHaveBeenCalled();
    await vi.waitFor(() => expect(container.querySelector('details')).not.toHaveAttribute('open'));
    alertSpy.mockRestore();
  });
  it('two-way write-back: choosing a Select option writes to the data-model path and re-renders', async () => {
    const handler = vi.fn();
    renderFixture(selectBoundFixture, {actionHandler: handler});

    const select = screen.getByRole('combobox', {name: 'Label'}) as HTMLSelectElement;
    expect(select.value).toBe('bug');

    fireEvent.change(select, {target: {value: 'docs'}});

    // The binder's auto-generated setValue wrote 'docs' back to /selected; the control re-renders
    // from the updated data model. No client->server action is dispatched for a data-model write.
    await vi.waitFor(() =>
      expect((screen.getByRole('combobox', {name: 'Label'}) as HTMLSelectElement).value).toBe(
        'docs',
      ),
    );
    expect(handler).not.toHaveBeenCalled();
  });

  it('two-way write-back: typing in a bound TextInput writes to the data-model path and re-renders', async () => {
    const handler = vi.fn();
    renderFixture(textinputBoundFixture, {actionHandler: handler});

    fireEvent.change(screen.getByRole('textbox'), {target: {value: 'octocat-labs'}});

    // The binder's auto-generated setValue wrote back to /query; the input re-renders from the
    // updated data model. No client->server action is dispatched for a data-model write.
    await vi.waitFor(() => expect(screen.getByRole('textbox')).toHaveValue('octocat-labs'));
    expect(handler).not.toHaveBeenCalled();
  });
});

describe('NavList.TrailingAction — action paths', () => {
  it('functionCall runs the registered consoleLog locally, not via the handler', () => {
    const logSpy = vi.spyOn(console, 'log').mockImplementation(() => {});
    const handler = vi.fn();
    renderFixture(navlistTrailingactionFnFixture, {actionHandler: handler});

    fireEvent.click(screen.getByRole('button', {name: 'Pin Settings'}));

    expect(logSpy).toHaveBeenCalledWith('[A2UI]', 'navlist-trailingaction-fn clicked');
    expect(handler).not.toHaveBeenCalled();
    logSpy.mockRestore();
  });

  it('event is dispatched to the actionHandler with name/surfaceId/sourceComponentId', async () => {
    const handler = vi.fn();
    renderFixture(navlistTrailingactionEventFixture, {actionHandler: handler});

    fireEvent.click(screen.getByRole('button', {name: 'Pin README'}));

    await vi.waitFor(() => expect(handler).toHaveBeenCalledTimes(1));
    expect(handler).toHaveBeenCalledWith(
      expect.objectContaining({
        name: 'pin',
        surfaceId: 'navlist-trailingaction-event',
        sourceComponentId: 'ta',
      }),
    );
  });
});

describe('NavList.GroupExpand — pagination behavior', () => {
  it('reveals items page by page when "Show more" is clicked', async () => {
    renderFixture(navlistGroupexpandShowmoreFixture);

    // Collapsed initially (pages=2, currentPage=0 shows 0 items).
    expect(screen.queryByRole('link', {name: 'api'})).not.toBeInTheDocument();

    // First expand reveals the first page (api, web).
    fireEvent.click(screen.getByText('Show more repositories'));
    await vi.waitFor(() => expect(screen.getByRole('link', {name: 'api'})).toBeInTheDocument());

    // Second expand reveals the remaining items (docs, infra) from Primer-internal currentPage.
    fireEvent.click(screen.getByText('Show more repositories'));
    await vi.waitFor(() => expect(screen.getByRole('link', {name: 'infra'})).toBeInTheDocument());
  });
});

describe('ActionList action paths', () => {
  it('Item functionCall runs the registered consoleLog locally, not via the handler', () => {
    const logSpy = vi.spyOn(console, 'log').mockImplementation(() => {});
    const handler = vi.fn();
    renderFixture(actionlistItemFnFixture, {actionHandler: handler});

    fireEvent.click(screen.getByText('Copy issue URL'));

    expect(logSpy).toHaveBeenCalledWith('[A2UI]', 'item selected');
    expect(handler).not.toHaveBeenCalled();
    logSpy.mockRestore();
  });

  it('Item event is dispatched to the actionHandler with source metadata', async () => {
    const handler = vi.fn();
    renderFixture(actionlistItemEventFixture, {actionHandler: handler});

    fireEvent.click(screen.getByText('Assign to me'));

    await vi.waitFor(() => expect(handler).toHaveBeenCalledTimes(1));
    expect(handler).toHaveBeenCalledWith(
      expect.objectContaining({
        name: 'select',
        surfaceId: 'actionlist-item-event',
        sourceComponentId: 'a0',
      }),
    );
  });

  it('two-way write-back: clicking a bound Item writes selected back to the data-model path', async () => {
    const handler = vi.fn();
    renderFixture(actionlistSelectedBoundFixture, {actionHandler: handler});

    const bugRow = screen.getByText('bug');
    fireEvent.click(bugRow);

    // The binder's auto-generated setSelected wrote /labels/bug = true; the row re-renders
    // selected. In a listbox the item is an `option`, so the selected state is `aria-selected`.
    // No client->server action is dispatched for the pure data-model write.
    await vi.waitFor(() =>
      expect(document.querySelector('[aria-selected="true"]')).toBeInTheDocument(),
    );
    expect(handler).not.toHaveBeenCalled();
  });

  it('TrailingAction functionCall runs the registered consoleLog locally, not via the handler', () => {
    const logSpy = vi.spyOn(console, 'log').mockImplementation(() => {});
    const handler = vi.fn();
    renderFixture(actionlistTrailingactionFnFixture, {actionHandler: handler});

    fireEvent.click(screen.getByRole('button', {name: 'More options'}));

    expect(logSpy).toHaveBeenCalledWith('[A2UI]', 'trailing action');
    expect(handler).not.toHaveBeenCalled();
    logSpy.mockRestore();
  });

  it('TrailingAction event is dispatched to the actionHandler', async () => {
    const handler = vi.fn();
    renderFixture(actionlistTrailingactionEventFixture, {actionHandler: handler});

    fireEvent.click(screen.getByRole('button', {name: 'Remove label'}));

    await vi.waitFor(() => expect(handler).toHaveBeenCalledTimes(1));
    expect(handler).toHaveBeenCalledWith(
      expect.objectContaining({
        name: 'remove',
        surfaceId: 'actionlist-trailingaction-event',
        sourceComponentId: 'labelrow-ta',
      }),
    );
  });
});

describe('ActionBar action paths', () => {
  it('ActionBar.IconButton functionCall runs consoleLog locally, not via the handler', () => {
    const logSpy = vi.spyOn(console, 'log').mockImplementation(() => {});
    const handler = vi.fn();
    renderFixture(actionBarIconButtonFnFixture, {actionHandler: handler});

    fireEvent.click(screen.getByRole('button', {name: 'Bold'}));

    expect(logSpy).toHaveBeenCalledWith('[A2UI]', 'action-bar-icon-button-fn clicked');
    expect(handler).not.toHaveBeenCalled();
    logSpy.mockRestore();
  });

  it('ActionBar.IconButton event is dispatched to the actionHandler', async () => {
    const handler = vi.fn();
    renderFixture(actionBarIconButtonEventFixture, {actionHandler: handler});

    fireEvent.click(screen.getByRole('button', {name: 'Save'}));

    await vi.waitFor(() => expect(handler).toHaveBeenCalledTimes(1));
    expect(handler).toHaveBeenCalledWith(
      expect.objectContaining({
        name: 'save',
        surfaceId: 'action-bar-icon-button-event',
        sourceComponentId: 'root',
      }),
    );
  });

  it('ActionBar.Menu item functionCall runs consoleLog locally, not via the handler', () => {
    const logSpy = vi.spyOn(console, 'log').mockImplementation(() => {});
    const handler = vi.fn();
    renderFixture(actionBarMenuFixture, {actionHandler: handler});

    fireEvent.click(screen.getByRole('button', {name: 'Actions'}));
    fireEvent.click(screen.getByRole('menuitem', {name: /Cut/}));

    expect(logSpy).toHaveBeenCalledWith('[A2UI]', 'cut');
    expect(handler).not.toHaveBeenCalled();
    logSpy.mockRestore();
  });

  it('ActionBar.Menu item event is dispatched to the actionHandler with the menu as source', async () => {
    const handler = vi.fn();
    renderFixture(actionBarMenuFixture, {actionHandler: handler});

    fireEvent.click(screen.getByRole('button', {name: 'Actions'}));
    fireEvent.click(screen.getByRole('menuitem', {name: /Copy/}));

    await vi.waitFor(() => expect(handler).toHaveBeenCalledTimes(1));
    expect(handler).toHaveBeenCalledWith(
      expect.objectContaining({
        name: 'copy',
        surfaceId: 'action-bar-menu',
        sourceComponentId: 'menu',
      }),
    );
  });
});

describe('TreeView action paths', () => {
  it('Item action functionCall runs consoleLog locally, not via the handler', () => {
    const logSpy = vi.spyOn(console, 'log').mockImplementation(() => {});
    const handler = vi.fn();
    renderFixture(treeViewItemFnFixture, {actionHandler: handler});

    fireEvent.click(screen.getByRole('treeitem', {name: /src/}));

    expect(logSpy).toHaveBeenCalledWith('[A2UI]', 'item selected');
    expect(handler).not.toHaveBeenCalled();
    logSpy.mockRestore();
  });

  it('Item action event is dispatched to the actionHandler', async () => {
    const handler = vi.fn();
    renderFixture(treeViewItemEventFixture, {actionHandler: handler});

    fireEvent.click(screen.getByRole('treeitem', {name: /src/}));

    await vi.waitFor(() => expect(handler).toHaveBeenCalledTimes(1));
    expect(handler).toHaveBeenCalledWith(
      expect.objectContaining({
        name: 'select-item',
        surfaceId: 'tree-view-item-event',
        sourceComponentId: 'item-src',
      }),
    );
  });

  it('Item secondaryActions: the Rename functionCall runs consoleLog locally', () => {
    const logSpy = vi.spyOn(console, 'log').mockImplementation(() => {});
    const handler = vi.fn();
    const {container} = renderFixture(treeViewItemSecondaryActionsFixture, {
      actionHandler: handler,
    });

    // Secondary-action buttons are aria-hidden (reached on hover/focus) and the count-less Rename
    // renders as an IconButton whose accessible name is supplied via tooltip (aria-labelledby, not
    // aria-label), so query the DOM directly for the non-Delete button.
    const rename = Array.from(container.querySelectorAll('button')).find(
      b => b.getAttribute('aria-label') !== 'Delete',
    );
    fireEvent.click(rename!);

    expect(logSpy).toHaveBeenCalledWith('[A2UI]', 'rename');
    expect(handler).not.toHaveBeenCalled();
    logSpy.mockRestore();
  });

  it('Item secondaryActions: the Delete event is dispatched to the actionHandler', async () => {
    const handler = vi.fn();
    const {container} = renderFixture(treeViewItemSecondaryActionsFixture, {
      actionHandler: handler,
    });

    const del = container.querySelector('button[aria-label="Delete"]');
    fireEvent.click(del!);

    await vi.waitFor(() => expect(handler).toHaveBeenCalledTimes(1));
    expect(handler).toHaveBeenCalledWith(expect.objectContaining({name: 'delete'}));
  });

  it('ErrorDialog retryAction event is dispatched; dismissAction runs consoleLog locally', async () => {
    const logSpy = vi.spyOn(console, 'log').mockImplementation(() => {});
    const handler = vi.fn();
    renderFixture(treeViewErrorDialogFixture, {actionHandler: handler});

    fireEvent.click(screen.getByRole('button', {name: 'Retry'}));
    await vi.waitFor(() => expect(handler).toHaveBeenCalledTimes(1));
    expect(handler).toHaveBeenCalledWith(
      expect.objectContaining({name: 'retry-subtree', surfaceId: 'tree-view-error-dialog'}),
    );

    fireEvent.click(screen.getByRole('button', {name: 'Dismiss'}));
    expect(logSpy).toHaveBeenCalledWith('[A2UI]', 'dismissed');
    logSpy.mockRestore();
  });

  it('path-1 (UnderlineNav.Item): selecting a tab runs consoleLog locally, not via the handler', () => {
    const logSpy = vi.spyOn(console, 'log').mockImplementation(() => {});
    const handler = vi.fn();
    renderFixture(underlineNavItemFnFixture, {actionHandler: handler});

    fireEvent.click(screen.getByText('Run local'));

    expect(logSpy).toHaveBeenCalledWith('[A2UI]', 'underline-nav-item clicked');
    expect(handler).not.toHaveBeenCalled();
    logSpy.mockRestore();
  });

  it('path-2 (UnderlineNav.Item): selecting a tab dispatches the event from the item', async () => {
    const handler = vi.fn();
    renderFixture(underlineNavItemEventFixture, {actionHandler: handler});

    fireEvent.click(screen.getByRole('link', {name: /Pull requests/}));

    await vi.waitFor(() => expect(handler).toHaveBeenCalledTimes(1));
    expect(handler).toHaveBeenCalledWith(
      expect.objectContaining({
        name: 'select',
        surfaceId: 'underline-nav-item-event',
        sourceComponentId: 'tab-pulls',
      }),
    );
  });
});

describe('Dialog action paths', () => {
  it('closeAction functionCall runs consoleLog locally; the handler is not called', () => {
    const logSpy = vi.spyOn(console, 'log').mockImplementation(() => {});
    const handler = vi.fn();
    renderFixture(dialogCloseFnFixture, {actionHandler: handler});

    fireEvent.click(screen.getByRole('button', {name: 'Close'}));
    expect(logSpy).toHaveBeenCalledWith('[A2UI]', 'dialog-close-fn closed');
    expect(handler).not.toHaveBeenCalled();
    logSpy.mockRestore();
  });

  it('closeAction event is dispatched to the actionHandler', async () => {
    const handler = vi.fn();
    renderFixture(dialogCloseEventFixture, {actionHandler: handler});

    fireEvent.click(screen.getByRole('button', {name: 'Close'}));
    await vi.waitFor(() => expect(handler).toHaveBeenCalledTimes(1));
    expect(handler).toHaveBeenCalledWith(
      expect.objectContaining({name: 'dialog-close', surfaceId: 'dialog-close-event'}),
    );
  });

  it('footerButtons: the danger event is dispatched; a functionCall entry stays local', async () => {
    const logSpy = vi.spyOn(console, 'log').mockImplementation(() => {});
    const handler = vi.fn();
    renderFixture(dialogButtonsFixture, {actionHandler: handler});

    fireEvent.click(screen.getByRole('button', {name: 'Delete'}));
    await vi.waitFor(() => expect(handler).toHaveBeenCalledTimes(1));
    expect(handler).toHaveBeenCalledWith(
      expect.objectContaining({name: 'confirm-delete', surfaceId: 'dialog-buttons'}),
    );

    fireEvent.click(screen.getByRole('button', {name: 'Later'}));
    expect(logSpy).toHaveBeenCalledWith('[A2UI]', 'later');
    logSpy.mockRestore();
  });

  it('composed DialogButtons: save-changes event dispatches; Cancel and the CloseButton stay local', async () => {
    const logSpy = vi.spyOn(console, 'log').mockImplementation(() => {});
    const handler = vi.fn();
    renderFixture(dialogSlotsFixture, {actionHandler: handler});

    fireEvent.click(screen.getByRole('button', {name: 'Save'}));
    await vi.waitFor(() => expect(handler).toHaveBeenCalledTimes(1));
    expect(handler).toHaveBeenCalledWith(
      expect.objectContaining({name: 'save-changes', surfaceId: 'dialog-slots'}),
    );

    fireEvent.click(screen.getByRole('button', {name: 'Cancel'}));
    expect(logSpy).toHaveBeenCalledWith('[A2UI]', 'cancelled');

    fireEvent.click(screen.getByRole('button', {name: 'Close'}));
    expect(logSpy).toHaveBeenCalledWith('[A2UI]', 'closebutton');
    logSpy.mockRestore();
  });

  it('Popover.Content onClickOutside functionCall runs locally and does not dispatch', () => {
    const logSpy = vi.spyOn(console, 'log').mockImplementation(() => {});
    const handler = vi.fn();
    renderFixture(contentClickoutsideFnFixture, {actionHandler: handler});

    fireEvent.mouseDown(document.body);
    expect(logSpy).toHaveBeenCalledWith('[A2UI]', 'clicked outside');
    expect(handler).not.toHaveBeenCalled();
    logSpy.mockRestore();
  });

  it('Popover.Content onClickOutside event is dispatched to the actionHandler', async () => {
    const handler = vi.fn();
    renderFixture(contentClickoutsideEventFixture, {actionHandler: handler});

    fireEvent.mouseDown(document.body);
    await vi.waitFor(() => expect(handler).toHaveBeenCalledTimes(1));
    expect(handler).toHaveBeenCalledWith(
      expect.objectContaining({name: 'popover-dismiss', surfaceId: 'content-clickoutside-event'}),
    );
  });
});

describe('ConfirmationDialog action paths', () => {
  it('confirmAction/cancelAction functionCall run consoleLog locally; the handler is not called', () => {
    const logSpy = vi.spyOn(console, 'log').mockImplementation(() => {});
    const handler = vi.fn();
    renderFixture(confirmationDialogFixture, {actionHandler: handler});

    fireEvent.click(screen.getByRole('button', {name: 'OK'}));
    expect(logSpy).toHaveBeenCalledWith('[A2UI]', 'confirmed');

    fireEvent.click(screen.getByRole('button', {name: 'Cancel'}));
    expect(logSpy).toHaveBeenCalledWith('[A2UI]', 'cancelled');
    expect(handler).not.toHaveBeenCalled();
    logSpy.mockRestore();
  });

  it('confirmAction event is dispatched to the actionHandler', async () => {
    const handler = vi.fn();
    renderFixture(confirmationDialogEventFixture, {actionHandler: handler});

    fireEvent.click(screen.getByRole('button', {name: 'Delete'}));
    await vi.waitFor(() => expect(handler).toHaveBeenCalledTimes(1));
    expect(handler).toHaveBeenCalledWith(
      expect.objectContaining({name: 'cd-confirm-delete', surfaceId: 'confirmation-dialog-event'}),
    );
  });

  it('cancelAction event is dispatched to the actionHandler', async () => {
    const handler = vi.fn();
    renderFixture(confirmationDialogEventFixture, {actionHandler: handler});

    fireEvent.click(screen.getByRole('button', {name: 'Keep'}));
    await vi.waitFor(() => expect(handler).toHaveBeenCalledTimes(1));
    expect(handler).toHaveBeenCalledWith(
      expect.objectContaining({name: 'cd-cancel-delete', surfaceId: 'confirmation-dialog-event'}),
    );
  });
});

describe('AnchoredOverlay action paths', () => {
  it('two-way write-back: clicking the trigger of a bound-open panel writes /open false and hides the panel', async () => {
    const handler = vi.fn();
    renderFixture(anchoredOverlayBoundFixture, {actionHandler: handler});

    // Bound open starts true → the panel is shown.
    expect(screen.getByText('Panel content')).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', {name: 'Open panel'}));

    // The close gesture called the binder's auto-generated setOpen(false), writing /open false; the
    // panel unmounts. No client->server action is dispatched for a data-model write.
    await vi.waitFor(() => expect(screen.queryByText('Panel content')).not.toBeInTheDocument());
    expect(handler).not.toHaveBeenCalled();
  });

  it('onOpen/onClose functionCall runs consoleLog locally on each gesture; the handler is not called', () => {
    const logSpy = vi.spyOn(console, 'log').mockImplementation(() => {});
    const handler = vi.fn();
    renderFixture(anchoredOverlayActionsFnFixture, {actionHandler: handler});

    // Starts open (open: true). First click is a close gesture -> onClose consoleLog 'closed'.
    fireEvent.click(screen.getByRole('button', {name: 'Open panel'}));
    expect(logSpy).toHaveBeenCalledWith('[A2UI]', 'closed');

    // Second click is an open gesture -> onOpen consoleLog 'opened'.
    fireEvent.click(screen.getByRole('button', {name: 'Open panel'}));
    expect(logSpy).toHaveBeenCalledWith('[A2UI]', 'opened');

    expect(handler).not.toHaveBeenCalled();
    logSpy.mockRestore();
  });

  it('onOpen/onClose event is dispatched to the actionHandler on each gesture', async () => {
    const handler = vi.fn();
    renderFixture(anchoredOverlayActionsEventFixture, {actionHandler: handler});

    // Bound open starts false. First click is an open gesture -> panel-open event.
    fireEvent.click(screen.getByRole('button', {name: 'Open panel'}));
    await vi.waitFor(() => expect(handler).toHaveBeenCalledTimes(1));
    expect(handler).toHaveBeenCalledWith(
      expect.objectContaining({
        name: 'panel-open',
        surfaceId: 'anchored-overlay-actions-event',
        sourceComponentId: 'root',
      }),
    );

    // Second click is a close gesture -> panel-close event.
    fireEvent.click(screen.getByRole('button', {name: 'Open panel'}));
    await vi.waitFor(() => expect(handler).toHaveBeenCalledTimes(2));
    expect(handler).toHaveBeenCalledWith(
      expect.objectContaining({
        name: 'panel-close',
        surfaceId: 'anchored-overlay-actions-event',
        sourceComponentId: 'root',
      }),
    );
  });
});

describe('SelectPanel — action paths', () => {
  it('open gesture: clicking the trigger writes open=true back to the bound path and shows the panel', async () => {
    const handler = vi.fn();
    renderFixture(selectPanelToggleFixture, {actionHandler: handler});

    // Bound open starts false → only the trigger renders.
    expect(screen.queryByText('bug')).not.toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', {name: 'Labels'}));

    // The binder's auto-generated setOpen wrote true back to /open; the panel opens. No
    // client->server action is dispatched for a pure data-model write.
    await vi.waitFor(() => expect(screen.getByText('bug')).toBeInTheDocument());
    expect(handler).not.toHaveBeenCalled();
  });

  it('onOpenChange functionCall runs consoleLog locally on a gesture; the handler is not called', () => {
    const logSpy = vi.spyOn(console, 'log').mockImplementation(() => {});
    const handler = vi.fn();
    renderFixture(selectPanelOnopenchangeFnFixture, {actionHandler: handler});

    // Starts open; the first trigger click is a close gesture → onOpenChange consoleLog 'toggled'.
    fireEvent.click(screen.getByRole('button', {name: 'Labels'}));
    expect(logSpy).toHaveBeenCalledWith('[A2UI]', 'toggled');
    expect(handler).not.toHaveBeenCalled();
    logSpy.mockRestore();
  });

  it('onOpenChange event is dispatched to the actionHandler on a gesture', async () => {
    const handler = vi.fn();
    renderFixture(selectPanelOnopenchangeEventFixture, {actionHandler: handler});

    // Bound open starts false; clicking the trigger is an open gesture → panel-toggle event.
    fireEvent.click(screen.getByRole('button', {name: 'Labels'}));
    await vi.waitFor(() => expect(handler).toHaveBeenCalledTimes(1));
    expect(handler).toHaveBeenCalledWith(
      expect.objectContaining({
        name: 'panel-toggle',
        surfaceId: 'selectpanel-onopenchange-event',
      }),
    );
  });

  it('Item functionCall runs the registered consoleLog locally, not via the handler', async () => {
    const logSpy = vi.spyOn(console, 'log').mockImplementation(() => {});
    const handler = vi.fn();
    renderFixture(selectPanelItemFnFixture, {actionHandler: handler});

    fireEvent.click(screen.getByText('bug'));

    await vi.waitFor(() => expect(logSpy).toHaveBeenCalledWith('[A2UI]', 'item selected'));
    expect(handler).not.toHaveBeenCalled();
    logSpy.mockRestore();
  });

  it('Item event is dispatched to the actionHandler with source metadata', async () => {
    const handler = vi.fn();
    renderFixture(selectPanelItemEventFixture, {actionHandler: handler});

    fireEvent.click(screen.getByText('bug'));

    await vi.waitFor(() => expect(handler).toHaveBeenCalledTimes(1));
    expect(handler).toHaveBeenCalledWith(
      expect.objectContaining({name: 'label-select', surfaceId: 'selectpanel-item-event'}),
    );
  });

  it('two-way write-back: selecting a bound Item writes selected back and the checkmark follows', async () => {
    const handler = vi.fn();
    renderFixture(selectPanelItemSelectedBoundFixture, {actionHandler: handler});

    fireEvent.click(screen.getByText('bug'));

    // The impl wrote /sel/bug = true; the item re-renders selected (aria-selected in a listbox).
    // No client->server action is dispatched for the pure data-model write.
    await vi.waitFor(() =>
      expect(document.querySelector('[aria-selected="true"]')).toBeInTheDocument(),
    );
    expect(handler).not.toHaveBeenCalled();
  });
});

describe('Autocomplete.Menu addNewItem action', () => {
  it('functionCall path: choosing the create row runs consoleLog locally, not via the handler', () => {
    const logSpy = vi.spyOn(console, 'log').mockImplementation(() => {});
    const handler = vi.fn();
    renderFixture(autocompleteAddnewFnFixture, {actionHandler: handler});

    fireEvent.focus(screen.getByRole('combobox'));
    fireEvent.click(screen.getByText('Create new label'));

    expect(logSpy).toHaveBeenCalledWith('[A2UI]', 'create label');
    expect(handler).not.toHaveBeenCalled();
    logSpy.mockRestore();
  });

  it('event path: choosing the create row dispatches create-label to the actionHandler', async () => {
    const handler = vi.fn();
    renderFixture(autocompleteAddnewEventFixture, {actionHandler: handler});

    fireEvent.focus(screen.getByRole('combobox'));
    fireEvent.click(screen.getByText('Create new label'));

    await vi.waitFor(() => expect(handler).toHaveBeenCalledTimes(1));
    expect(handler).toHaveBeenCalledWith(
      expect.objectContaining({
        name: 'create-label',
        surfaceId: 'autocomplete-addnew-event',
      }),
    );
  });
});
