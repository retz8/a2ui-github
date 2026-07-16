import {surface} from './split-page-layout-helpers';
import type {Fixture} from './types';

/** Gallery: the content `width` axis, one surface per `[full, medium, large, xlarge]`. */
const WIDTHS = ['full', 'medium', 'large', 'xlarge'] as const;

export const splContentWidthFixture: Fixture = {
  name: 'spl-content-width',
  messages: WIDTHS.flatMap(width =>
    surface(`spl-content-width-${width}`, [
      {id: 'root', component: 'SplitPageLayout', content: 'content'},
      {id: 'content', component: 'SplitPageLayout.Content', width, children: ['c-body']},
      {
        id: 'c-body',
        component: 'Text',
        text: `The content region caps its maximum width at the "${width}" size.`,
      },
    ]),
  ),
};
