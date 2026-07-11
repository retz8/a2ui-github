import {CATALOG_ID} from 'primer-a2ui-adapter';
import type {Fixture} from './types';

export const radioFixture: Fixture = {
  name: 'radio',
  messages: [
    {version: 'v0.9', createSurface: {surfaceId: 'radio', catalogId: CATALOG_ID}},
    {
      version: 'v0.9',
      updateComponents: {
        surfaceId: 'radio',
        components: [{id: 'root', component: 'Radio', value: 'option-1', name: 'radio-demo'}],
      },
    },
  ],
};
