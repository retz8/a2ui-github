import {CATALOG_ID} from 'primer-a2ui-adapter';
import type {Fixture} from './types';

// confirmButtonType: primary.
export const confirmationDialogConfirmPrimaryFixture: Fixture = {
  name: 'confirmation-dialog-confirm-primary',
  messages: [
    {
      version: 'v0.9',
      createSurface: {
        surfaceId: 'confirmation-dialog-confirm-primary',
        catalogId: CATALOG_ID,
      },
    },
    {
      version: 'v0.9',
      updateComponents: {
        surfaceId: 'confirmation-dialog-confirm-primary',
        components: [
          {
            id: 'root',
            component: 'ConfirmationDialog',
            title: 'Discard changes?',
            confirmButtonType: 'primary',
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
  ],
};
