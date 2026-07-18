import {CATALOG_ID} from 'primer-a2ui-adapter';
import type {Fixture} from './types';

// align: top.
export const dialogAlignTopFixture: Fixture = {
  name: 'dialog-align-top',
  messages: [
    {
      version: 'v0.9',
      createSurface: {
        surfaceId: 'dialog-align-top',
        catalogId: CATALOG_ID,
      },
    },
    {
      version: 'v0.9',
      updateComponents: {
        surfaceId: 'dialog-align-top',
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
            align: 'top',
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
