import {CATALOG_ID} from 'primer-a2ui-adapter';
import type {Fixture} from './types';

// The trailingAction slot filled with a TextInput.Action (icon-only clear button).
export const textinputTrailingActionFixture: Fixture = {
  name: 'textinput-trailing-action',
  messages: [
    {
      version: 'v0.9',
      createSurface: {surfaceId: 'textinput-trailing-action', catalogId: CATALOG_ID},
    },
    {
      version: 'v0.9',
      updateComponents: {
        surfaceId: 'textinput-trailing-action',
        components: [
          {id: 'root', component: 'TextInput', value: 'octocat', trailingAction: 'clear'},
          {
            id: 'clear',
            component: 'TextInput.Action',
            icon: 'clear-icon',
            accessibility: {label: 'Clear'},
            action: {
              functionCall: {call: 'consoleLog', args: {message: 'clear'}, returnType: 'void'},
            },
          },
          {id: 'clear-icon', component: 'Icon', name: 'x'},
        ],
      },
    },
  ],
};
