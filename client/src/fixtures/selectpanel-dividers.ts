import {spSurface, spItem} from './selectpanel-helpers';
import type {Fixture} from './types';

// `showItemDividers`: a divider is shown above each item.
export const selectPanelDividersFixture: Fixture = {
  name: 'selectpanel-dividers',
  messages: spSurface(
    'selectpanel-dividers',
    {showItemDividers: true, title: 'Apply labels', selectionVariant: 'multiple'},
    ['bug', 'documentation', 'enhancement', 'ci'],
    [
      spItem('bug', 'bug'),
      spItem('documentation', 'documentation'),
      spItem('enhancement', 'enhancement'),
      spItem('ci', 'ci'),
    ],
  ),
};
