import {CATALOG_ID} from 'primer-a2ui-adapter';
import type {Fixture} from './types';

// width preset: small.
export const dialogWidthSmallFixture: Fixture = {
  name: 'dialog-width-small',
  messages: [
    {
      version: 'v0.9',
      createSurface: {
        surfaceId: 'dialog-width-small',
        catalogId: CATALOG_ID,
      },
    },
    {
      version: 'v0.9',
      updateComponents: {
        surfaceId: 'dialog-width-small',
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
            width: 'small',
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
