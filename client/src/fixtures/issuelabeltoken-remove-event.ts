import {CATALOG_ID} from 'primer-a2ui-adapter';
import type {Fixture} from './types';

/**
 * Event-path fixture paired with the deterministic agent's `issue-label-remove` response.
 * The IssueLabelToken is the surface root (id `root`) and the event source; its `disabled` binds
 * to `/removed` so the server's `updateDataModel` write is visible as the token going inert.
 * A sibling status `Text` (id `status`) is the agent's `updateComponents` target. (No container
 * component ships at 6.12, so the status is not rendered as a visible sibling here; the
 * data-binding half — the token disabling — is fully rendered and gated.)
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
          {
            id: 'root',
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
