import {CATALOG_ID} from 'primer-a2ui-adapter';
import type {Fixture} from './types';

export const tokenRemoveFnFixture: Fixture = {
  name: 'token-remove-fn',
  messages: [
    {version: 'v0.9', createSurface: {surfaceId: 'token-remove-fn', catalogId: CATALOG_ID}},
    {
      version: 'v0.9',
      updateComponents: {
        surfaceId: 'token-remove-fn',
        components: [
          {
            id: 'root',
            component: 'Token',
            text: 'Remove me',
            removeAction: {
              functionCall: {
                call: 'consoleLog',
                args: {message: 'token-remove clicked'},
                returnType: 'void',
              },
            },
          },
        ],
      },
    },
  ],
};
