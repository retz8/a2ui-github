import {CATALOG_ID} from 'primer-a2ui-adapter';
import type {Fixture} from './types';

export const textinputTrailingVisualFixture: Fixture = {
  name: 'textinput-trailing-visual',
  messages: [
    {
      version: 'v0.9',
      createSurface: {surfaceId: 'textinput-trailing-visual', catalogId: CATALOG_ID},
    },
    {
      version: 'v0.9',
      updateComponents: {
        surfaceId: 'textinput-trailing-visual',
        components: [
          {id: 'root', component: 'TextInput', value: 'octocat', trailingVisual: 'tv'},
          {id: 'tv', component: 'Icon', name: 'check'},
        ],
      },
    },
  ],
};
