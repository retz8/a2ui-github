import {surface} from './stack-helpers';
import {labelItem} from './actionlist-helpers';
import type {Fixture} from './types';

/**
 * `Item.action` — event (→ agent) + coupling + bound `selected` (the two-way-binding proof). The
 * surface root is a `Stack` hosting `[list, status]`. The "Assign to me" item's `selected` is bound
 * to `/assigned` (initially false); clicking it first writes `/assigned = true` optimistically (so
 * the event's `context.assigned` carries the new value), then fires the `select` event. The
 * deterministic agent echoes `/assigned` and swaps the `status` Text; the `/assigned` write is
 * visible through the `selected ← /assigned` coupling — the checkmark follows the data model.
 */
export const actionlistItemEventFixture: Fixture = {
  name: 'actionlist-item-event',
  messages: surface(
    'actionlist-item-event',
    [
      {id: 'root', component: 'Stack', align: 'start', children: ['list', 'status']},
      {
        id: 'list',
        component: 'ActionList',
        role: 'listbox',
        selectionVariant: 'single',
        children: ['a0', 'a1'],
      },
      ...labelItem('a0', 'Assign to me', {
        selected: {path: '/assigned'},
        action: {event: {name: 'select', context: {assigned: {path: '/assigned'}}}},
      }),
      ...labelItem('a1', 'Request changes'),
      {id: 'status', component: 'Text', text: 'Choose an action'},
    ],
    {assigned: false},
  ),
};
