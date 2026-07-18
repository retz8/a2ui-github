import {CATALOG_ID} from 'primer-a2ui-adapter';
import type {Fixture} from './types';

// width: free CSS arm (400px).
export const confirmationDialogWidthCustomFixture: Fixture = {
  name: 'confirmation-dialog-width-custom',
  messages: [
    {
      version: 'v0.9',
      createSurface: {
        surfaceId: 'confirmation-dialog-width-custom',
        catalogId: CATALOG_ID,
      },
    },
    {
      version: 'v0.9',
      updateComponents: {
        surfaceId: 'confirmation-dialog-width-custom',
        components: [
          {
            id: 'root',
            component: 'ConfirmationDialog',
            title: 'Discard changes?',
            width: '400px',
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
