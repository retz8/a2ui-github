import {CATALOG_ID} from 'primer-a2ui-adapter';
import type {Fixture} from './types';

export const labelFixture: Fixture = {
  name: 'label',
  messages: [
    {version: 'v0.9', createSurface: {surfaceId: 'label', catalogId: CATALOG_ID}},
    {
      version: 'v0.9',
      updateComponents: {
        surfaceId: 'label',
        components: [{id: 'root', component: 'Label', text: 'Label from Primer'}],
      },
    },
  ],
};
