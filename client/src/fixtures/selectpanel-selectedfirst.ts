import {spSurface, spItem} from './selectpanel-helpers';
import type {Fixture} from './types';

// `showSelectedOptionsFirst`: the two non-adjacent selected items are sorted to the top of the list.
export const selectPanelSelectedfirstFixture: Fixture = {
  name: 'selectpanel-selectedfirst',
  messages: spSurface(
    'selectpanel-selectedfirst',
    {selectionVariant: 'multiple', showSelectedOptionsFirst: true, title: 'Apply labels'},
    ['bug', 'documentation', 'enhancement', 'ci', 'wontfix'],
    [
      spItem('bug', 'bug'),
      spItem('documentation', 'documentation', {selected: true}),
      spItem('enhancement', 'enhancement'),
      spItem('ci', 'ci', {selected: true}),
      spItem('wontfix', 'wontfix'),
    ],
  ),
};
