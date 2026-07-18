import {CATALOG_ID} from 'primer-a2ui-adapter';
import type {Fixture} from './types';

// Content channel: bound (path binding) on title + both button labels.
export const confirmationDialogBoundFixture: Fixture = {
  name: 'confirmation-dialog-bound',
  messages: [
    {
      version: 'v0.9',
      createSurface: {
        surfaceId: 'confirmation-dialog-bound',
        catalogId: CATALOG_ID,
      },
    },
    {
      version: 'v0.9',
      updateComponents: {
        surfaceId: 'confirmation-dialog-bound',
        components: [
          {
            id: 'root',
            component: 'ConfirmationDialog',
            title: {
              path: '/cd/title',
            },
            confirmButtonContent: {
              path: '/cd/confirm',
            },
            cancelButtonContent: {
              path: '/cd/cancel',
            },
            confirmAction: {
              functionCall: {
                call: 'consoleLog',
                args: {
                  message: 'confirmed',
                },
                returnType: 'void',
              },
            },
            cancelAction: {
              functionCall: {
                call: 'consoleLog',
                args: {
                  message: 'cancelled',
                },
                returnType: 'void',
              },
            },
            children: ['cd-body'],
          },
          {
            id: 'cd-body',
            component: 'Text',
            text: 'Your unsaved edits will be lost.',
          },
        ],
      },
    },
    {
      version: 'v0.9',
      updateDataModel: {
        surfaceId: 'confirmation-dialog-bound',
        path: '/',
        value: {
          cd: {
            title: 'Bound title',
            confirm: 'Yes',
            cancel: 'No',
          },
        },
      },
    },
  ],
};
