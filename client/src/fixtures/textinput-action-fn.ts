import {CATALOG_ID} from 'primer-a2ui-adapter';
import type {Fixture} from './types';

// Standalone TextInput.Action whose action runs the local consoleLog function (functionCall path).
export const textinputActionFnFixture: Fixture = {
  name: 'textinput-action-fn',
  messages: [
    {version: 'v0.9', createSurface: {surfaceId: 'textinput-action-fn', catalogId: CATALOG_ID}},
    {
      version: 'v0.9',
      updateComponents: {
        surfaceId: 'textinput-action-fn',
        components: [
          {
            id: 'root',
            component: 'TextInput.Action',
            icon: 'glyph',
            accessibility: {label: 'Search'},
            action: {
              functionCall: {
                call: 'consoleLog',
                args: {message: 'action clicked'},
                returnType: 'void',
              },
            },
          },
          {id: 'glyph', component: 'Icon', name: 'search'},
        ],
      },
    },
  ],
};
