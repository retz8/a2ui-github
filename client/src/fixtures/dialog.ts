import {CATALOG_ID} from 'primer-a2ui-adapter';
import type {Fixture} from './types';

// The base Dialog: literal title + subtitle, a body Text, all defaults (xlarge/auto/center/center).
export const dialogFixture: Fixture = {
  name: 'dialog',
  messages: [
    {
      version: 'v0.9',
      createSurface: {
        surfaceId: 'dialog',
        catalogId: CATALOG_ID,
      },
    },
    {
      version: 'v0.9',
      updateComponents: {
        surfaceId: 'dialog',
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
