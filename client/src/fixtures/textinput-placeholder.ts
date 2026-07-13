import {CATALOG_ID} from 'primer-a2ui-adapter';
import type {Fixture} from './types';

export const textinputPlaceholderFixture: Fixture = {
  name: 'textinput-placeholder',
  messages: [
    {version: 'v0.9', createSurface: {surfaceId: 'textinput-placeholder', catalogId: CATALOG_ID}},
    {
      version: 'v0.9',
      updateComponents: {
        surfaceId: 'textinput-placeholder',
        components: [
          {id: 'root', component: 'TextInput', value: '', placeholder: 'Search repositories'},
        ],
      },
    },
  ],
};
