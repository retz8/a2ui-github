import {spSurface, spItem} from './selectpanel-helpers';
import type {Fixture} from './types';

// `showSelectAll` (coupled with `multiple`): a "select all" control is shown above the list.
export const selectPanelSelectallFixture: Fixture = {
  name: 'selectpanel-selectall',
  messages: spSurface(
    'selectpanel-selectall',
    {selectionVariant: 'multiple', showSelectAll: true, title: 'Apply labels'},
    ['bug', 'documentation', 'enhancement', 'ci'],
    [
      spItem('bug', 'bug'),
      spItem('documentation', 'documentation'),
      spItem('enhancement', 'enhancement'),
      spItem('ci', 'ci'),
    ],
  ),
};
