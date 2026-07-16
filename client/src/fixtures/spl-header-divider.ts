import {surface} from './split-page-layout-helpers';
import type {Fixture} from './types';

/**
 * Gallery: the header `divider` axis (the horizontal-divider representative for Header/Footer), one
 * surface per `[none, line]`. Each is a minimal Root (header + content) so the divider is visible
 * along the header/content edge.
 */
const DIVIDERS = ['none', 'line'] as const;

export const splHeaderDividerFixture: Fixture = {
  name: 'spl-header-divider',
  messages: DIVIDERS.flatMap(divider =>
    surface(`spl-header-divider-${divider}`, [
      {id: 'root', component: 'SplitPageLayout', header: 'header', content: 'content'},
      {id: 'header', component: 'SplitPageLayout.Header', divider, children: ['h-title']},
      {id: 'h-title', component: 'Heading', text: 'Repository settings'},
      {id: 'content', component: 'SplitPageLayout.Content', children: ['c-body']},
      {id: 'c-body', component: 'Text', text: `Header divider: ${divider}.`},
    ]),
  ),
};
