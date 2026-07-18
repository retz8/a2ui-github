import {surface} from './stack-helpers';
import type {Fixture} from './types';

/**
 * `Item.action` — functionCall (local): a 2-tab nav where selecting "Run local" runs the registered
 * `consoleLog` locally (no server round-trip). Proven in the action test.
 */
export const underlineNavItemFnFixture: Fixture = {
  name: 'underline-nav-item-fn',
  messages: surface('underline-nav-item-fn', [
    {id: 'root', component: 'UnderlineNav', 'aria-label': 'Repository', children: ['t0', 't1']},
    {id: 't0', component: 'UnderlineNav.Item', text: 'Overview', href: '#/overview'},
    {
      id: 't1',
      component: 'UnderlineNav.Item',
      text: 'Run local',
      action: {
        functionCall: {
          call: 'consoleLog',
          args: {message: 'underline-nav-item clicked'},
          returnType: 'void',
        },
      },
    },
  ]),
};
