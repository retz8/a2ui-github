import {CATALOG_ID} from 'primer-a2ui-adapter';
import type {Fixture} from './types';

export const tokenSelectedFixture: Fixture = {
  name: 'token-selected',
  messages: [
    {version: 'v0.9', createSurface: {surfaceId: 'token-selected', catalogId: CATALOG_ID}},
    {
      version: 'v0.9',
      updateComponents: {
        surfaceId: 'token-selected',
        components: [{id: 'root', component: 'Token', text: 'Selected', isSelected: true}],
      },
    },
  ],
};
