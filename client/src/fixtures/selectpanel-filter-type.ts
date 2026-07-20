import {spSurface, spItem} from './selectpanel-helpers';
import type {Fixture} from './types';

// `filterValue` two-way write-back: typing into the filter writes `/filter` and narrows the list
// (render-test only — the static harness cannot drive typing).
export const selectPanelFilterTypeFixture: Fixture = {
  name: 'selectpanel-filter-type',
  messages: spSurface(
    'selectpanel-filter-type',
    {filterValue: {path: '/filter'}, title: 'Apply labels', selectionVariant: 'multiple'},
    ['bug', 'documentation', 'enhancement', 'ci'],
    [
      spItem('bug', 'bug'),
      spItem('documentation', 'documentation'),
      spItem('enhancement', 'enhancement'),
      spItem('ci', 'ci'),
    ],
    {filter: ''},
  ),
};
