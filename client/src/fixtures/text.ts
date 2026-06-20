import {PRIMER_CATALOG_ID} from 'primer-a2ui-adapter';
import type {Fixture} from './types';

export const textFixture: Fixture = {
  name: 'text',
  messages: [
    {version: 'v0.9', createSurface: {surfaceId: 'text', catalogId: PRIMER_CATALOG_ID}},
    {
      version: 'v0.9',
      updateComponents: {
        surfaceId: 'text',
        components: [{id: 'root', component: 'Text', text: 'Hello from Primer'}],
      },
    },
  ],
};
