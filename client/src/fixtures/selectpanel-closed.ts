import {spSurface, spItem} from './selectpanel-helpers';
import type {Fixture} from './types';

// `open: false` — only the trigger renders; the panel is absent from the DOM (render-test only).
export const selectPanelClosedFixture: Fixture = {
  name: 'selectpanel-closed',
  messages: spSurface(
    'selectpanel-closed',
    {open: false, title: 'Apply labels', selectionVariant: 'multiple'},
    ['bug', 'documentation'],
    [spItem('bug', 'bug'), spItem('documentation', 'documentation')],
  ),
};
