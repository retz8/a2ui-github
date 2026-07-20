import {spSurface, spItem} from './selectpanel-helpers';
import type {Fixture} from './types';

// Open/close gesture (two-way write-back): `open` is bound to `/open` (initially false). Clicking
// the trigger writes `true`; Escape / outside-click writes `false` (render-test only).
export const selectPanelToggleFixture: Fixture = {
  name: 'selectpanel-toggle',
  messages: spSurface(
    'selectpanel-toggle',
    {open: {path: '/open'}, title: 'Apply labels', selectionVariant: 'multiple'},
    ['bug', 'documentation', 'enhancement'],
    [
      spItem('bug', 'bug'),
      spItem('documentation', 'documentation'),
      spItem('enhancement', 'enhancement'),
    ],
    {open: false},
  ),
};
