import {CATALOG_ID} from 'primer-a2ui-adapter';
import type {Fixture} from './types';

export const textinputActionDisabledFixture: Fixture = {
  name: 'textinput-action-disabled',
  messages: [
    {
      version: 'v0.9',
      createSurface: {surfaceId: 'textinput-action-disabled', catalogId: CATALOG_ID},
    },
    {
      version: 'v0.9',
      updateComponents: {
        surfaceId: 'textinput-action-disabled',
        components: [
          {
            id: 'root',
            component: 'TextInput.Action',
            disabled: true,
            icon: 'glyph',
            accessibility: {label: 'Clear'},
            action: {
              functionCall: {call: 'consoleLog', args: {message: 'clear'}, returnType: 'void'},
            },
          },
          {id: 'glyph', component: 'Icon', name: 'x'},
        ],
      },
    },
  ],
};
