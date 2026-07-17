import {surface} from './stack-helpers';
import {labelItem} from './actionlist-helpers';
import type {Fixture} from './types';

/** `Item.loading` (boolean state): a realistic menu with one item in a loading state. */
export const actionlistItemLoadingFixture: Fixture = {
  name: 'actionlist-item-loading',
  messages: surface('actionlist-item-loading', [
    {id: 'root', component: 'ActionList', role: 'menu', children: ['l0', 'l1', 'l2']},
    ...labelItem('l0', 'Sync fork', {loading: true}),
    ...labelItem('l1', 'Create branch'),
    ...labelItem('l2', 'View history'),
  ]),
};
