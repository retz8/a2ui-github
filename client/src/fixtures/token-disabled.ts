import {CATALOG_ID} from 'primer-a2ui-adapter';
import type {Fixture} from './types';

export const tokenDisabledFixture: Fixture = {
  name: 'token-disabled',
  messages: [
    {version: 'v0.9', createSurface: {surfaceId: 'token-disabled', catalogId: CATALOG_ID}},
    {
      version: 'v0.9',
      updateComponents: {
        surfaceId: 'token-disabled',
        components: [
          {
            id: 'root',
            component: 'Token',
            text: 'Disabled',
            disabled: true,
            removeAction: {
              functionCall: {
                call: 'consoleLog',
                args: {message: 'token-disabled'},
                returnType: 'void',
              },
            },
          },
        ],
      },
    },
  ],
};
