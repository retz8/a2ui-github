import {regionLinkIds, regionLinks, surface} from './split-page-layout-helpers';
import type {Fixture} from './types';

/**
 * State: `resizable` — the pane exposes a draggable resize handle along its divider. The drag
 * itself is a pointer interaction (not baselined as motion); this fixture proves the handle
 * renders in the resizable state.
 */
export const splPaneResizableFixture: Fixture = {
  name: 'spl-pane-resizable',
  messages: surface('spl-pane-resizable', [
    {id: 'root', component: 'SplitPageLayout', content: 'content', pane: 'pane'},
    {id: 'content', component: 'SplitPageLayout.Content', children: ['c-body']},
    {id: 'c-body', component: 'Text', text: 'Drag the pane edge to resize it.'},
    {
      id: 'pane',
      component: 'SplitPageLayout.Pane',
      resizable: true,
      accessibility: {label: 'Secondary navigation'},
      children: regionLinkIds('p'),
    },
    ...regionLinks('p'),
  ]),
};
