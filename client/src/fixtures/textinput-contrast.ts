import {CATALOG_ID} from 'primer-a2ui-adapter';
import type {Fixture} from './types';

export const textinputContrastFixture: Fixture = {
  name: 'textinput-contrast',
  messages: [
    {version: 'v0.9', createSurface: {surfaceId: 'textinput-contrast', catalogId: CATALOG_ID}},
    {
      version: 'v0.9',
      updateComponents: {
        surfaceId: 'textinput-contrast',
        components: [{id: 'root', component: 'TextInput', value: 'High contrast', contrast: true}],
      },
    },
  ],
};
