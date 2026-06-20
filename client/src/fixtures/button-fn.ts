import {PRIMER_CATALOG_ID} from 'primer-a2ui-adapter';
import type {Fixture} from './types';

export const buttonFnFixture: Fixture = {
  name: 'button-fn',
  messages: [
    {version: 'v0.9', createSurface: {surfaceId: 'button-fn', catalogId: PRIMER_CATALOG_ID}},
    {
      version: 'v0.9',
      updateComponents: {
        surfaceId: 'button-fn',
        components: [
          {
            id: 'root',
            component: 'Button',
            child: 'label',
            variant: 'primary',
            action: {
              functionCall: {
                call: 'consoleLog',
                args: {message: 'button-fn clicked'},
                returnType: 'void',
              },
            },
          },
          {id: 'label', component: 'Text', text: 'Run local function'},
        ],
      },
    },
  ],
};
