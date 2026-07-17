import {regionLinkIds, regionLinks, surface} from './split-page-layout-helpers';
import type {Fixture} from './types';

/** Gallery: the pane `position` axis, one surface per `[start, end]` (which side of the content). */
const POSITIONS = ['start', 'end'] as const;

export const splPanePositionFixture: Fixture = {
  name: 'spl-pane-position',
  messages: POSITIONS.flatMap(position =>
    surface(`spl-pane-position-${position}`, [
      {id: 'root', component: 'SplitPageLayout', content: 'content', pane: 'pane'},
      {id: 'content', component: 'SplitPageLayout.Content', children: ['c-body']},
      {id: 'c-body', component: 'Text', text: 'The main content area.'},
      {
        id: 'pane',
        component: 'SplitPageLayout.Pane',
        position,
        accessibility: {label: 'Secondary navigation'},
        children: regionLinkIds('p'),
      },
      ...regionLinks('p'),
    ]),
  ),
};
