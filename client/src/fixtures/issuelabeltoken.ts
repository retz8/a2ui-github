import {CATALOG_ID} from 'primer-a2ui-adapter';
import type {Fixture} from './types';

export const issuelabeltokenFixture: Fixture = {
  name: 'issuelabeltoken',
  messages: [
    {version: 'v0.9', createSurface: {surfaceId: 'issuelabeltoken', catalogId: CATALOG_ID}},
    {
      version: 'v0.9',
      updateComponents: {
        surfaceId: 'issuelabeltoken',
        components: [{id: 'root', component: 'IssueLabelToken', text: 'Issue label from Primer'}],
      },
    },
  ],
};
