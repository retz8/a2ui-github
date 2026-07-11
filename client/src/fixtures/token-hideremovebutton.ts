import {CATALOG_ID} from 'primer-a2ui-adapter';
import type {Fixture} from './types';

export const tokenHideremovebuttonFixture: Fixture = {
  name: 'token-hideremovebutton',
  messages: [
    {version: 'v0.9', createSurface: {surfaceId: 'token-hideremovebutton', catalogId: CATALOG_ID}},
    {
      version: 'v0.9',
      updateComponents: {
        surfaceId: 'token-hideremovebutton',
        components: [
          {
            id: 'root',
            component: 'Token',
            text: 'No button',
            hideRemoveButton: true,
            removeAction: {
              functionCall: {
                call: 'consoleLog',
                args: {message: 'token-hideremovebutton'},
                returnType: 'void',
              },
            },
          },
        ],
      },
    },
  ],
};
