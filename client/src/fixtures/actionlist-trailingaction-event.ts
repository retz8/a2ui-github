import {surface} from './stack-helpers';
import type {Fixture} from './types';

/**
 * `TrailingAction.action` — event (→ agent) + coupling. A realistic "manage labels" menu; the
 * `bug` row's trailing action (a trash button) fires the `remove` event. `Item.disabled` is bound
 * to `/removed` (initially false, written only by the server — TrailingAction carries no two-way
 * state). The deterministic agent writes `/removed = true` and swaps the `status` Text; the write
 * is visible through the neighboring `Item.disabled ← /removed` coupling — the removed row greys
 * out. The root is a `Stack` hosting `[list, status]`.
 */
export const actionlistTrailingactionEventFixture: Fixture = {
  name: 'actionlist-trailingaction-event',
  messages: surface(
    'actionlist-trailingaction-event',
    [
      {id: 'root', component: 'Stack', align: 'start', children: ['list', 'status']},
      {id: 'list', component: 'ActionList', role: 'menu', children: ['labelrow', 'other']},
      {
        id: 'labelrow',
        component: 'ActionList.Item',
        disabled: {path: '/removed'},
        children: ['labelrow-label', 'labelrow-ta'],
      },
      {id: 'labelrow-label', component: 'Text', text: 'bug'},
      {
        id: 'labelrow-ta',
        component: 'ActionList.TrailingAction',
        icon: 'labelrow-ta-icon',
        label: 'Remove label',
        action: {event: {name: 'remove', context: {label: 'bug'}}},
      },
      {id: 'labelrow-ta-icon', component: 'Icon', name: 'trash'},
      {id: 'other', component: 'ActionList.Item', children: ['other-label']},
      {id: 'other-label', component: 'Text', text: 'enhancement'},
      {id: 'status', component: 'Text', text: 'Manage labels'},
    ],
    {removed: false},
  ),
};
