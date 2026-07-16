import {surface} from './stack-helpers';
import {labelItem} from './actionlist-helpers';
import type {Fixture} from './types';

/** Root `showDividers` (boolean state): a realistic 4-item list with a divider above each item. */
export const actionlistDividersFixture: Fixture = {
  name: 'actionlist-dividers',
  messages: surface('actionlist-dividers', [
    {
      id: 'root',
      component: 'ActionList',
      role: 'menu',
      showDividers: true,
      children: ['h0', 'h1', 'h2', 'h3'],
    },
    ...labelItem('h0', 'View pull request'),
    ...labelItem('h1', 'Merge pull request'),
    ...labelItem('h2', 'Close pull request'),
    ...labelItem('h3', 'Delete branch'),
  ]),
};
