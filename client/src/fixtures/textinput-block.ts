import {CATALOG_ID} from 'primer-a2ui-adapter';
import type {Fixture} from './types';

export const textinputBlockFixture: Fixture = {
  name: 'textinput-block',
  messages: [
    {version: 'v0.9', createSurface: {surfaceId: 'textinput-block', catalogId: CATALOG_ID}},
    {
      version: 'v0.9',
      updateComponents: {
        surfaceId: 'textinput-block',
        components: [{id: 'root', component: 'TextInput', value: 'Full width', block: true}],
      },
    },
  ],
};
