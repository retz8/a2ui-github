import {surface} from './stack-helpers';
import {labelItem} from './actionlist-helpers';
import type {Fixture} from './types';

/**
 * `Item.action` — functionCall (local): a realistic menu where selecting the first item runs the
 * registered `consoleLog` locally (no server round-trip). Proven in the action test.
 */
export const actionlistItemFnFixture: Fixture = {
  name: 'actionlist-item-fn',
  messages: surface('actionlist-item-fn', [
    {id: 'root', component: 'ActionList', role: 'menu', children: ['i0', 'i1', 'i2']},
    ...labelItem('i0', 'Copy issue URL', {
      action: {
        functionCall: {call: 'consoleLog', args: {message: 'item selected'}, returnType: 'void'},
      },
    }),
    ...labelItem('i1', 'Edit issue'),
    ...labelItem('i2', 'Lock conversation'),
  ]),
};
