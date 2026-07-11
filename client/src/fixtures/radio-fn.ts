import {CATALOG_ID} from 'primer-a2ui-adapter';
import type {Fixture} from './types';

export const radioFnFixture: Fixture = {
  name: 'radio-fn',
  messages: [
    {version: 'v0.9', createSurface: {surfaceId: 'radio-fn', catalogId: CATALOG_ID}},
    {
      version: 'v0.9',
      updateComponents: {
        surfaceId: 'radio-fn',
        components: [
          {
            id: 'root',
            component: 'Radio',
            value: 'option-1',
            name: 'radio-fn',
            action: {
              functionCall: {
                call: 'consoleLog',
                args: {message: 'radio-fn selected'},
                returnType: 'void',
              },
            },
          },
        ],
      },
    },
  ],
};
