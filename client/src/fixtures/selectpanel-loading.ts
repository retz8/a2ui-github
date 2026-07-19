import {spSurface, spItem} from './selectpanel-helpers';
import type {Fixture} from './types';

// `loading: true` — the panel shows its loading state in place of the list.
export const selectPanelLoadingFixture: Fixture = {
  name: 'selectpanel-loading',
  messages: spSurface(
    'selectpanel-loading',
    {loading: true, title: 'Apply labels', selectionVariant: 'multiple'},
    ['bug', 'documentation', 'enhancement'],
    [
      spItem('bug', 'bug'),
      spItem('documentation', 'documentation'),
      spItem('enhancement', 'enhancement'),
    ],
  ),
};
