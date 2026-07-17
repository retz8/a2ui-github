import {CATALOG_ID} from 'primer-a2ui-adapter';
import type {Fixture} from './types';

// width preset: medium.
export const dialogWidthMediumFixture: Fixture = {
  name: 'dialog-width-medium',
  messages: [
    {
      version: 'v0.9',
      createSurface: {
        surfaceId: 'dialog-width-medium',
        catalogId: CATALOG_ID,
      },
    },
    {
      version: 'v0.9',
      updateComponents: {
        surfaceId: 'dialog-width-medium',
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
            width: 'medium',
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
