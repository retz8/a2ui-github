import {CATALOG_ID} from 'primer-a2ui-adapter';
import type {Fixture} from './types';

// align: bottom.
export const dialogAlignBottomFixture: Fixture = {
  name: 'dialog-align-bottom',
  messages: [
    {
      version: 'v0.9',
      createSurface: {
        surfaceId: 'dialog-align-bottom',
        catalogId: CATALOG_ID,
      },
    },
    {
      version: 'v0.9',
      updateComponents: {
        surfaceId: 'dialog-align-bottom',
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
            align: 'bottom',
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
