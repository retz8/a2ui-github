import {CATALOG_ID} from 'primer-a2ui-adapter';
import type {Fixture} from './types';

export const textinputDisabledFixture: Fixture = {
  name: 'textinput-disabled',
  messages: [
    {version: 'v0.9', createSurface: {surfaceId: 'textinput-disabled', catalogId: CATALOG_ID}},
    {
      version: 'v0.9',
      updateComponents: {
        surfaceId: 'textinput-disabled',
        components: [{id: 'root', component: 'TextInput', value: 'Cannot edit', disabled: true}],
      },
    },
  ],
};
