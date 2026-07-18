import {CATALOG_ID} from 'primer-a2ui-adapter';
import type {Fixture} from './types';

// closeAction on the functionCall path (consoleLog, local).
export const dialogCloseFnFixture: Fixture = {
  name: 'dialog-close-fn',
  messages: [
    {
      version: 'v0.9',
      createSurface: {
        surfaceId: 'dialog-close-fn',
        catalogId: CATALOG_ID,
      },
    },
    {
      version: 'v0.9',
      updateComponents: {
        surfaceId: 'dialog-close-fn',
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
                  message: 'dialog-close-fn closed',
                },
                returnType: 'void',
              },
            },
            children: ['dialog-body'],
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
