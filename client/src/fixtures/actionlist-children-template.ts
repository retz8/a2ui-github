import {surface} from './stack-helpers';
import type {Fixture} from './types';

/**
 * Root `children` as a dynamic template (bound): the `ActionList` expands one `Item` per entry in
 * the data model's `/items` array, each item's label bound to `./title` within its scope.
 */
export const actionlistChildrenTemplateFixture: Fixture = {
  name: 'actionlist-children-template',
  messages: surface(
    'actionlist-children-template',
    [
      {
        id: 'root',
        component: 'ActionList',
        role: 'menu',
        children: {componentId: 'tpl', path: '/items'},
      },
      {id: 'tpl', component: 'ActionList.Item', children: ['tpl-lv', 'tpl-label']},
      {id: 'tpl-lv', component: 'ActionList.LeadingVisual', children: ['tpl-icon']},
      {id: 'tpl-icon', component: 'Icon', name: 'git-pull-request', accessibility: {label: 'pr'}},
      {id: 'tpl-label', component: 'Text', text: {path: 'title'}},
    ],
    {items: [{title: 'View pull request'}, {title: 'Merge'}, {title: 'Close'}]},
  ),
};
