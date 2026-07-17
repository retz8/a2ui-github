import {CATALOG_ID} from 'primer-a2ui-adapter';
import type {Fixture} from './types';

// width free CSS arm: 400px.
export const dialogWidthCustomFixture: Fixture = {
  name: 'dialog-width-custom',
  messages: [
    {
      version: 'v0.9',
      createSurface: {
        surfaceId: 'dialog-width-custom',
        catalogId: CATALOG_ID,
      },
    },
    {
      version: 'v0.9',
      updateComponents: {
        surfaceId: 'dialog-width-custom',
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
            width: '400px',
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
