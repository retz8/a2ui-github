import {CATALOG_ID} from 'primer-a2ui-adapter';
import type {Fixture} from './types';

// width preset: xlarge.
export const confirmationDialogWidthXlargeFixture: Fixture = {
  name: 'confirmation-dialog-width-xlarge',
  messages: [
    {
      version: 'v0.9',
      createSurface: {
        surfaceId: 'confirmation-dialog-width-xlarge',
        catalogId: CATALOG_ID,
      },
    },
    {
      version: 'v0.9',
      updateComponents: {
        surfaceId: 'confirmation-dialog-width-xlarge',
        components: [
          {
            id: 'root',
            component: 'ConfirmationDialog',
            title: 'Discard changes?',
            width: 'xlarge',
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
