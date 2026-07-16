import {surface} from './stack-helpers';
import {labelItem} from './actionlist-helpers';
import type {Fixture} from './types';

/** `Item.disabled` (boolean state): a realistic menu with one disabled row. */
export const actionlistItemDisabledFixture: Fixture = {
  name: 'actionlist-item-disabled',
  messages: surface('actionlist-item-disabled', [
    {id: 'root', component: 'ActionList', role: 'menu', children: ['d0', 'd1', 'd2']},
    ...labelItem('d0', 'Edit issue'),
    ...labelItem('d1', 'Delete issue', {disabled: true}),
    ...labelItem('d2', 'Lock conversation'),
  ]),
};
