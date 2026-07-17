import {surface} from './stack-helpers';
import {labelItem} from './actionlist-helpers';
import type {Fixture} from './types';

// Gallery over the root `variant`: the same realistic list rendered at each offset variant.
const VARIANTS = ['inset', 'horizontal-inset', 'full'] as const;

export const actionlistVariantFixture: Fixture = {
  name: 'actionlist-variant',
  messages: VARIANTS.flatMap(variant =>
    surface(`actionlist-variant-${variant}`, [
      {id: 'root', component: 'ActionList', role: 'menu', variant, children: ['w0', 'w1', 'w2']},
      ...labelItem('w0', 'View pull request'),
      ...labelItem('w1', 'Merge pull request'),
      ...labelItem('w2', 'Close pull request'),
    ]),
  ),
};
