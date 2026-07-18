import {CATALOG_ID} from 'primer-a2ui-adapter';
import type {Fixture} from './types';

// Content channel bound via path bindings; the data model resolves the title/subtitle.
export const dialogBoundFixture: Fixture = {
  name: 'dialog-bound',
  messages: [
    {
      version: 'v0.9',
      createSurface: {
        surfaceId: 'dialog-bound',
        catalogId: CATALOG_ID,
      },
    },
    {
      version: 'v0.9',
      updateComponents: {
        surfaceId: 'dialog-bound',
        components: [
          {
            id: 'root',
            component: 'Dialog',
            title: {
              path: '/dialog/title',
            },
            subtitle: {
              path: '/dialog/subtitle',
            },
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
    {
      version: 'v0.9',
      updateDataModel: {
        surfaceId: 'dialog-bound',
        path: '/',
        value: {
          dialog: {
            title: 'Bound title',
            subtitle: 'Bound subtitle',
          },
        },
      },
    },
  ],
};
