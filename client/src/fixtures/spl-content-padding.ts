import {surface} from './split-page-layout-helpers';
import type {Fixture} from './types';

/**
 * Gallery: the content `padding` axis (the padding representative for all regions), one surface per
 * `[none, condensed, normal]`.
 */
const PADDINGS = ['none', 'condensed', 'normal'] as const;

export const splContentPaddingFixture: Fixture = {
  name: 'spl-content-padding',
  messages: PADDINGS.flatMap(padding =>
    surface(`spl-content-padding-${padding}`, [
      {id: 'root', component: 'SplitPageLayout', content: 'content'},
      {id: 'content', component: 'SplitPageLayout.Content', padding, children: ['c-body']},
      {id: 'c-body', component: 'Text', text: `Inner padding: ${padding}.`},
    ]),
  ),
};
