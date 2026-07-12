import {CATALOG_ID} from 'primer-a2ui-adapter';
import type {Fixture} from './types';

/**
 * Event-path fixture paired with the deterministic agent's `issue-label-remove` response.
 * The surface root (id `root`) is a `Stack` hosting `[issuelabeltoken, status]`. The
 * IssueLabelToken is the event source; its `disabled` binds to `/removed` so the server's
 * `updateDataModel` write is visible as the token going inert. The sibling status `Text`
 * (id `status`) is the agent's `updateComponents` target; the Stack root now renders it, so the
 * status-swap half of the round-trip is visible alongside the token-disabling half.
 */
export const issuelabeltokenRemoveEventFixture: Fixture = {
  name: 'issuelabeltoken-remove-event',
  messages: [
    {
      version: 'v0.9',
      createSurface: {surfaceId: 'issuelabeltoken-remove-event', catalogId: CATALOG_ID},
    },
    {
      version: 'v0.9',
      updateComponents: {
        surfaceId: 'issuelabeltoken-remove-event',
        components: [
          {id: 'root', component: 'Stack', children: ['issuelabeltoken', 'status']},
          {
            id: 'issuelabeltoken',
            component: 'IssueLabelToken',
            text: 'bug',
            fillColor: '#d73a4a',
            disabled: {path: '/removed'},
            removeAction: {event: {name: 'issue-label-remove', context: {}}},
          },
          {id: 'status', component: 'Text', text: 'Waiting for server…'},
        ],
      },
    },
    {
      version: 'v0.9',
      updateDataModel: {
        surfaceId: 'issuelabeltoken-remove-event',
        path: '/',
        value: {removed: false},
      },
    },
  ],
};
