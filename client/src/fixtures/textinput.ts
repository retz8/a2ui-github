import {CATALOG_ID} from 'primer-a2ui-adapter';
import type {Fixture} from './types';

export const textinputFixture: Fixture = {
  name: 'textinput',
  messages: [
    {version: 'v0.9', createSurface: {surfaceId: 'textinput', catalogId: CATALOG_ID}},
    {
      version: 'v0.9',
      updateComponents: {
        surfaceId: 'textinput',
        components: [{id: 'root', component: 'TextInput', value: 'octocat'}],
      },
    },
  ],
};
