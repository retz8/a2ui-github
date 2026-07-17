import {surface} from './split-page-layout-helpers';
import type {Fixture} from './types';

/**
 * Content — dynamic-template `ChildList` (the template representative for all regions, since the
 * `ChildList` common is identical across regions). The content's `children` expand a `Text` bound
 * to `./label` over the `/items` array in the data model.
 */
export const splContentChildrenTemplateFixture: Fixture = {
  name: 'spl-content-children-template',
  messages: surface(
    'spl-content-children-template',
    [
      {id: 'root', component: 'SplitPageLayout', content: 'content'},
      {
        id: 'content',
        component: 'SplitPageLayout.Content',
        children: {componentId: 'tpl', path: '/items'},
      },
      {id: 'tpl', component: 'Text', text: {path: 'label'}},
    ],
    {items: [{label: 'Alpha'}, {label: 'Beta'}]},
  ),
};
