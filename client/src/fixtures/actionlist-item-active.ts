import {surface} from './stack-helpers';
import {labelItem} from './actionlist-helpers';
import type {Fixture} from './types';

/** `Item.active` (boolean state): a realistic nav-style list with one item marked as the current page. */
export const actionlistItemActiveFixture: Fixture = {
  name: 'actionlist-item-active',
  messages: surface('actionlist-item-active', [
    {id: 'root', component: 'ActionList', role: 'menu', children: ['n0', 'n1', 'n2']},
    ...labelItem('n0', 'Overview'),
    ...labelItem('n1', 'Pull requests', {active: true}),
    ...labelItem('n2', 'Issues'),
  ]),
};
