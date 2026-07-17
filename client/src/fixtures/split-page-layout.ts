import {regionLinkIds, regionLinks, surface} from './split-page-layout-helpers';
import type {Fixture} from './types';

/**
 * Root composition: all five-region shape exercised via header + content + pane + footer. Each
 * region slot references its own region leaf (`SplitPageLayout.Header` / `.Content` / `.Pane` /
 * `.Footer`), which renders the real Primer subcomponent. Sidebar is shown separately
 * (`split-page-layout-sidebar`) since pane and sidebar are alternative side regions.
 */
export const splitPageLayoutFixture: Fixture = {
  name: 'split-page-layout',
  messages: surface('split-page-layout', [
    {
      id: 'root',
      component: 'SplitPageLayout',
      header: 'header',
      content: 'content',
      pane: 'pane',
      footer: 'footer',
    },
    {id: 'header', component: 'SplitPageLayout.Header', children: ['h-title']},
    {id: 'h-title', component: 'Heading', text: 'Repository settings'},
    {id: 'content', component: 'SplitPageLayout.Content', children: ['c-body']},
    {
      id: 'c-body',
      component: 'Text',
      text: 'Manage general settings for this repository, including its name, visibility, and default branch.',
    },
    {
      id: 'pane',
      component: 'SplitPageLayout.Pane',
      accessibility: {label: 'Settings navigation'},
      children: regionLinkIds('p'),
    },
    ...regionLinks('p'),
    {id: 'footer', component: 'SplitPageLayout.Footer', children: ['f-note']},
    {id: 'f-note', component: 'Text', text: '© 2026 GitHub'},
  ]),
};
