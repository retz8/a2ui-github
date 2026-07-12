import {CATALOG_ID} from 'primer-a2ui-adapter';
import type {Fixture} from './types';

/**
 * Event-path fixture paired with the deterministic agent's `token-remove` response.
 * The surface root (id `root`) is a `Stack` hosting `[token, status]`. The Token is the event
 * source; its `disabled` binds to `/removed` so the server's `updateDataModel` write is visible
 * as the token going inert. The sibling status `Text` (id `status`) is the agent's
 * `updateComponents` target; the Stack root now renders it, so the status-swap half of the
 * round-trip is visible alongside the token-disabling half.
 */
export const tokenRemoveEventFixture: Fixture = {
  name: 'token-remove-event',
  messages: [
    {version: 'v0.9', createSurface: {surfaceId: 'token-remove-event', catalogId: CATALOG_ID}},
    {
      version: 'v0.9',
      updateComponents: {
        surfaceId: 'token-remove-event',
        components: [
          {id: 'root', component: 'Stack', align: 'start', children: ['token', 'status']},
          {
            id: 'token',
            component: 'Token',
            text: 'Remove me',
            disabled: {path: '/removed'},
            removeAction: {event: {name: 'token-remove', context: {}}},
          },
          {id: 'status', component: 'Text', text: 'Waiting for server…'},
        ],
      },
    },
    {
      version: 'v0.9',
      updateDataModel: {surfaceId: 'token-remove-event', path: '/', value: {removed: false}},
    },
  ],
};
