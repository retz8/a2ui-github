import {CATALOG_ID} from 'primer-a2ui-adapter';
import type {Fixture} from './types';

export const headingFixture: Fixture = {
  name: 'heading',
  messages: [
    {version: 'v0.9', createSurface: {surfaceId: 'heading', catalogId: CATALOG_ID}},
    {
      version: 'v0.9',
      updateComponents: {
        surfaceId: 'heading',
        components: [{id: 'root', component: 'Heading', text: 'Heading from Primer'}],
      },
    },
  ],
};
