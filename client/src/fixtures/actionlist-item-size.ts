import {surface} from './stack-helpers';
import {labelItem} from './actionlist-helpers';
import type {Fixture} from './types';

// Gallery over `Item.size`: a realistic short list per value, both rows at the gallery size.
const SIZES = ['medium', 'large'] as const;

export const actionlistItemSizeFixture: Fixture = {
  name: 'actionlist-item-size',
  messages: SIZES.flatMap(size =>
    surface(`actionlist-item-size-${size}`, [
      {id: 'root', component: 'ActionList', role: 'menu', children: ['s0', 's1']},
      ...labelItem('s0', 'View pull request', {size}),
      ...labelItem('s1', 'Merge pull request', {size}),
    ]),
  ),
};
