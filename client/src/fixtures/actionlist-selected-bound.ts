import {surface} from './stack-helpers';
import {labelItem} from './actionlist-helpers';
import type {Fixture} from './types';

/**
 * `Item.selected` — two-way binding + write-back (the Checkbox-bound precedent). A `multiple`
 * label list; the `bug` row's `selected` is bound to `/labels/bug` (initially false). A click
 * optimistically writes `true` back through the binder's auto-generated setter and the row
 * re-renders selected. Behavioral — proven in the interaction test, not visually baselined.
 */
export const actionlistSelectedBoundFixture: Fixture = {
  name: 'actionlist-selected-bound',
  messages: surface(
    'actionlist-selected-bound',
    [
      {
        id: 'root',
        component: 'ActionList',
        role: 'listbox',
        selectionVariant: 'multiple',
        children: ['b0', 'b1', 'b2'],
      },
      ...labelItem('b0', 'bug', {selected: {path: '/labels/bug'}}),
      ...labelItem('b1', 'enhancement'),
      ...labelItem('b2', 'documentation'),
    ],
    {labels: {bug: false}},
  ),
};
