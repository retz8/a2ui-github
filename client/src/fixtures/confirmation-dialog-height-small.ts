import {CATALOG_ID} from 'primer-a2ui-adapter';
import type {Fixture} from './types';

// height: small.
export const confirmationDialogHeightSmallFixture: Fixture = {
  name: 'confirmation-dialog-height-small',
  messages: [
    {
      version: 'v0.9',
      createSurface: {
        surfaceId: 'confirmation-dialog-height-small',
        catalogId: CATALOG_ID,
      },
    },
    {
      version: 'v0.9',
      updateComponents: {
        surfaceId: 'confirmation-dialog-height-small',
        components: [
          {
            id: 'root',
            component: 'ConfirmationDialog',
            title: 'Discard changes?',
            height: 'small',
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
