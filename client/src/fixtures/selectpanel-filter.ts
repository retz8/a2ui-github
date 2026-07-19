import {spSurface, spItem} from './selectpanel-helpers';
import type {Fixture} from './types';

// `filterValue` (literal "doc"): the list filters locally to the matching item ("documentation").
export const selectPanelFilterFixture: Fixture = {
  name: 'selectpanel-filter',
  messages: spSurface(
    'selectpanel-filter',
    {filterValue: 'doc', title: 'Apply labels', selectionVariant: 'multiple'},
    ['bug', 'documentation', 'enhancement', 'ci'],
    [
      spItem('bug', 'bug'),
      spItem('documentation', 'documentation'),
      spItem('enhancement', 'enhancement'),
      spItem('ci', 'ci'),
    ],
  ),
};
