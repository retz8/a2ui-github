import {regionLinkIds, regionLinks, surface} from './split-page-layout-helpers';
import type {Comp} from './split-page-layout-helpers';
import type {Fixture} from './types';

/**
 * Gallery: the pane `width` axis (the panel-width representative for Pane/Sidebar), one surface per
 * named size `[small, medium, large]` plus one custom `{min, default, max}` px constraint.
 */
const WIDTHS: {suffix: string; width: Comp['width']}[] = [
  {suffix: 'small', width: 'small'},
  {suffix: 'medium', width: 'medium'},
  {suffix: 'large', width: 'large'},
  {suffix: 'custom', width: {min: '160px', default: '240px', max: '320px'}},
];

export const splPaneWidthFixture: Fixture = {
  name: 'spl-pane-width',
  messages: WIDTHS.flatMap(({suffix, width}) =>
    surface(`spl-pane-width-${suffix}`, [
      {id: 'root', component: 'SplitPageLayout', content: 'content', pane: 'pane'},
      {id: 'content', component: 'SplitPageLayout.Content', children: ['c-body']},
      {id: 'c-body', component: 'Text', text: `Pane width: ${suffix}.`},
      {
        id: 'pane',
        component: 'SplitPageLayout.Pane',
        width,
        accessibility: {label: 'Secondary navigation'},
        children: regionLinkIds('p'),
      },
      ...regionLinks('p'),
    ]),
  ),
};
