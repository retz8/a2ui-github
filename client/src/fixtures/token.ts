import {CATALOG_ID} from 'primer-a2ui-adapter';
import type {Fixture} from './types';

export const tokenFixture: Fixture = {
  name: 'token',
  messages: [
    {version: 'v0.9', createSurface: {surfaceId: 'token', catalogId: CATALOG_ID}},
    {
      version: 'v0.9',
      updateComponents: {
        surfaceId: 'token',
        components: [{id: 'root', component: 'Token', text: 'Token from Primer'}],
      },
    },
  ],
};
