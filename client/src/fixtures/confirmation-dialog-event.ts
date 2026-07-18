import {CATALOG_ID} from 'primer-a2ui-adapter';
import type {Fixture} from './types';

// Both actions on the event path (agent-coupled: cd-confirm-delete / cd-cancel-delete). title <- /cd/title and confirmButtonLoading <- /cd/deleting are the two-way bindings the deterministic agent writes back; the cd-body swap is the self-visible half.
export const confirmationDialogEventFixture: Fixture = {
  name: 'confirmation-dialog-event',
  messages: [
    {
      version: 'v0.9',
      createSurface: {
        surfaceId: 'confirmation-dialog-event',
        catalogId: CATALOG_ID,
      },
    },
    {
      version: 'v0.9',
      updateComponents: {
        surfaceId: 'confirmation-dialog-event',
        components: [
          {
            id: 'root',
            component: 'ConfirmationDialog',
            title: {
              path: '/cd/title',
            },
            confirmButtonContent: 'Delete',
            cancelButtonContent: 'Keep',
            confirmButtonType: 'danger',
            confirmButtonLoading: {
              path: '/cd/deleting',
            },
            confirmAction: {
              event: {
                name: 'cd-confirm-delete',
                context: {},
              },
            },
            cancelAction: {
              event: {
                name: 'cd-cancel-delete',
                context: {},
              },
            },
            children: ['cd-body'],
          },
          {
            id: 'cd-body',
            component: 'Text',
            text: 'This permanently deletes the branch.',
          },
        ],
      },
    },
    {
      version: 'v0.9',
      updateDataModel: {
        surfaceId: 'confirmation-dialog-event',
        path: '/',
        value: {
          cd: {
            title: 'Delete branch?',
            deleting: false,
          },
        },
      },
    },
  ],
};
