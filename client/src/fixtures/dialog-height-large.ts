import {CATALOG_ID} from 'primer-a2ui-adapter';
import type {Fixture} from './types';

// height: large.
export const dialogHeightLargeFixture: Fixture = {
  name: 'dialog-height-large',
  messages: [
    {
      version: 'v0.9',
      createSurface: {
        surfaceId: 'dialog-height-large',
        catalogId: CATALOG_ID,
      },
    },
    {
      version: 'v0.9',
      updateComponents: {
        surfaceId: 'dialog-height-large',
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
            height: 'large',
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
