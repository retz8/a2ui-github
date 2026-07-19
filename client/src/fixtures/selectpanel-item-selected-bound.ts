import {spSurface, spItem} from './selectpanel-helpers';
import type {Fixture} from './types';

// `SelectPanel.Item.selected` — two-way write-back. The `bug` item's `selected` is bound to
// `/sel/bug` (initially false); clicking it writes `true` back and the checkmark follows the data
// model (render-test only).
export const selectPanelItemSelectedBoundFixture: Fixture = {
  name: 'selectpanel-item-selected-bound',
  messages: spSurface(
    'selectpanel-item-selected-bound',
    {selectionVariant: 'multiple', title: 'Apply labels'},
    ['bug', 'documentation', 'enhancement'],
    [
      spItem('bug', 'bug', {selected: {path: '/sel/bug'}}),
      spItem('documentation', 'documentation'),
      spItem('enhancement', 'enhancement'),
    ],
    {sel: {bug: false}},
  ),
};
