import {regionLinkIds, regionLinks, surface} from './split-page-layout-helpers';
import type {Fixture} from './types';

/**
 * Root composition exercising the sidebar's distinctive full-height span: header + sidebar +
 * content + footer. The sidebar runs the full height alongside the header, content, and footer,
 * unlike the pane (which sits beside the content only).
 */
export const splitPageLayoutSidebarFixture: Fixture = {
  name: 'split-page-layout-sidebar',
  messages: surface('split-page-layout-sidebar', [
    {
      id: 'root',
      component: 'SplitPageLayout',
      header: 'header',
      sidebar: 'sidebar',
      content: 'content',
      footer: 'footer',
    },
    {id: 'header', component: 'SplitPageLayout.Header', children: ['h-title']},
    {id: 'h-title', component: 'Heading', text: 'Repository settings'},
    {
      id: 'sidebar',
      component: 'SplitPageLayout.Sidebar',
      accessibility: {label: 'Settings navigation'},
      children: regionLinkIds('s'),
    },
    ...regionLinks('s'),
    {id: 'content', component: 'SplitPageLayout.Content', children: ['c-body']},
    {
      id: 'c-body',
      component: 'Text',
      text: 'Manage general settings for this repository, including its name, visibility, and default branch.',
    },
    {id: 'footer', component: 'SplitPageLayout.Footer', children: ['f-note']},
    {id: 'f-note', component: 'Text', text: '© 2026 GitHub'},
  ]),
};
