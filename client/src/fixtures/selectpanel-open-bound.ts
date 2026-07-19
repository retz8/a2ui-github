import {spSurface, spItem} from './selectpanel-helpers';
import type {Fixture} from './types';

// `open` as a path binding: the panel's visibility resolves from `/open` (true) through the renderer.
export const selectPanelOpenBoundFixture: Fixture = {
  name: 'selectpanel-open-bound',
  messages: spSurface(
    'selectpanel-open-bound',
    {open: {path: '/open'}, title: 'Apply labels', selectionVariant: 'multiple'},
    ['bug', 'documentation', 'enhancement'],
    [
      spItem('bug', 'bug'),
      spItem('documentation', 'documentation'),
      spItem('enhancement', 'enhancement'),
    ],
    {open: true},
  ),
};
