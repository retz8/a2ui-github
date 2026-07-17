import {surface} from './stack-helpers';
import {labelItem} from './actionlist-helpers';
import type {Fixture} from './types';

// Gallery over `Item.variant`: a realistic short list per value, the last row carrying the variant.
const VARIANTS = ['default', 'danger'] as const;

export const actionlistItemVariantFixture: Fixture = {
  name: 'actionlist-item-variant',
  messages: VARIANTS.flatMap(variant =>
    surface(`actionlist-item-variant-${variant}`, [
      {id: 'root', component: 'ActionList', role: 'menu', children: ['v0', 'v1']},
      ...labelItem('v0', 'Edit issue'),
      ...labelItem('v1', variant === 'danger' ? 'Delete issue' : 'Close issue', {variant}),
    ]),
  ),
};
