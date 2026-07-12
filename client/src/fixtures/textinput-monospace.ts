import {CATALOG_ID} from 'primer-a2ui-adapter';
import type {Fixture} from './types';

export const textinputMonospaceFixture: Fixture = {
  name: 'textinput-monospace',
  messages: [
    {version: 'v0.9', createSurface: {surfaceId: 'textinput-monospace', catalogId: CATALOG_ID}},
    {
      version: 'v0.9',
      updateComponents: {
        surfaceId: 'textinput-monospace',
        components: [
          {id: 'root', component: 'TextInput', value: 'git rev-parse HEAD', monospace: true},
        ],
      },
    },
  ],
};
