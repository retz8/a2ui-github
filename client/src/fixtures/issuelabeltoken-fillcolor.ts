import {CATALOG_ID} from 'primer-a2ui-adapter';
import type {Fixture} from './types';

export const issuelabeltokenFillcolorFixture: Fixture = {
  name: 'issuelabeltoken-fillcolor',
  messages: [
    {
      version: 'v0.9',
      createSurface: {surfaceId: 'issuelabeltoken-fillcolor', catalogId: CATALOG_ID},
    },
    {
      version: 'v0.9',
      updateComponents: {
        surfaceId: 'issuelabeltoken-fillcolor',
        components: [{id: 'root', component: 'IssueLabelToken', text: 'bug', fillColor: '#d73a4a'}],
      },
    },
  ],
};
