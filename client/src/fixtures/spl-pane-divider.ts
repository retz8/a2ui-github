import {regionLinkIds, regionLinks, surface} from './split-page-layout-helpers';
import type {Fixture} from './types';

/**
 * Gallery: the pane `divider` axis (the vertical-divider representative for Pane/Sidebar), one
 * surface per `[none, line]` (drawn along the pane/content edge).
 */
const DIVIDERS = ['none', 'line'] as const;

export const splPaneDividerFixture: Fixture = {
  name: 'spl-pane-divider',
  messages: DIVIDERS.flatMap(divider =>
    surface(`spl-pane-divider-${divider}`, [
      {id: 'root', component: 'SplitPageLayout', content: 'content', pane: 'pane'},
      {id: 'content', component: 'SplitPageLayout.Content', children: ['c-body']},
      {id: 'c-body', component: 'Text', text: 'The main content area.'},
      {
        id: 'pane',
        component: 'SplitPageLayout.Pane',
        divider,
        accessibility: {label: 'Secondary navigation'},
        children: regionLinkIds('p'),
      },
      ...regionLinks('p'),
    ]),
  ),
};
