import {CATALOG_ID} from 'primer-a2ui-adapter';
import type {Fixture} from './types';

// The trailingAction slot filled with a TextInput.Action (icon-only clear button). `value` is
// bound to /query so the clear is a real interaction: the button's action is a `clearValue`
// functionCall that writes '' to /query, and the input — subscribed to that path — re-renders empty.
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
          {id: 'root', component: 'TextInput', value: {path: '/query'}, trailingAction: 'clear'},
          {
            id: 'clear',
            component: 'TextInput.Action',
            icon: 'clear-icon',
            accessibility: {label: 'Clear'},
            action: {
              functionCall: {call: 'clearValue', args: {path: '/query'}, returnType: 'void'},
            },
          },
          {id: 'clear-icon', component: 'Icon', name: 'x'},
        ],
      },
    },
    {
      version: 'v0.9',
      updateDataModel: {
        surfaceId: 'textinput-trailing-action',
        path: '/',
        value: {query: 'octocat'},
      },
    },
  ],
};
