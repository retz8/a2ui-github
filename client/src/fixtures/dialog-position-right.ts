import {CATALOG_ID} from 'primer-a2ui-adapter';
import type {Fixture} from './types';

// position side-sheet: right.
export const dialogPositionRightFixture: Fixture = {
  name: 'dialog-position-right',
  messages: [
    {
      version: 'v0.9',
      createSurface: {
        surfaceId: 'dialog-position-right',
        catalogId: CATALOG_ID,
      },
    },
    {
      version: 'v0.9',
      updateComponents: {
        surfaceId: 'dialog-position-right',
        components: [
          {
            id: 'root',
            component: 'Dialog',
            title: 'Delete this file?',
            subtitle: 'This action cannot be undone',
            closeAction: {
              functionCall: {
                call: 'consoleLog',
                args: {
                  message: 'dialog closed',
                },
                returnType: 'void',
              },
            },
            children: ['dialog-body'],
            position: 'right',
          },
          {
            id: 'dialog-body',
            component: 'Text',
            text: 'The file README.md will be permanently removed.',
          },
        ],
      },
    },
  ],
};
