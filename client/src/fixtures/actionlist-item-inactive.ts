import {surface} from './stack-helpers';
import {labelItem} from './actionlist-helpers';
import type {Fixture} from './types';

/**
 * `Item.inactiveText` (boolean-ish state): a realistic menu with one temporarily-unavailable item;
 * setting `inactiveText` is what marks the item inactive.
 */
export const actionlistItemInactiveFixture: Fixture = {
  name: 'actionlist-item-inactive',
  messages: surface('actionlist-item-inactive', [
    {id: 'root', component: 'ActionList', role: 'menu', children: ['x0', 'x1', 'x2']},
    ...labelItem('x0', 'Merge pull request', {inactiveText: 'Unavailable during outage'}),
    ...labelItem('x1', 'Close pull request'),
    ...labelItem('x2', 'Convert to draft'),
  ]),
};
