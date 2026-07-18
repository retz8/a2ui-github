import {CATALOG_ID} from 'primer-a2ui-adapter';
import type {Fixture} from './types';

// position side-sheet: left.
export const dialogPositionLeftFixture: Fixture = {
  name: 'dialog-position-left',
  messages: [
    {
      version: 'v0.9',
      createSurface: {
        surfaceId: 'dialog-position-left',
        catalogId: CATALOG_ID,
      },
    },
    {
      version: 'v0.9',
      updateComponents: {
        surfaceId: 'dialog-position-left',
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
            position: 'left',
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
