import {spSurface, spItem} from './selectpanel-helpers';
import type {Fixture} from './types';

// `SelectPanel.Item.disabled` — one item cannot be selected.
export const selectPanelItemDisabledFixture: Fixture = {
  name: 'selectpanel-item-disabled',
  messages: spSurface(
    'selectpanel-item-disabled',
    {selectionVariant: 'multiple', title: 'Apply labels'},
    ['bug', 'documentation', 'enhancement'],
    [
      spItem('bug', 'bug'),
      spItem('documentation', 'documentation', {disabled: true}),
      spItem('enhancement', 'enhancement'),
    ],
  ),
};
