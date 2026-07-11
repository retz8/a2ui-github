import {CATALOG_ID} from 'primer-a2ui-adapter';
import type {Fixture} from './types';

export const issuelabeltokenSelectedFixture: Fixture = {
  name: 'issuelabeltoken-selected',
  messages: [
    {
      version: 'v0.9',
      createSurface: {surfaceId: 'issuelabeltoken-selected', catalogId: CATALOG_ID},
    },
    {
      version: 'v0.9',
      updateComponents: {
        surfaceId: 'issuelabeltoken-selected',
        components: [
          {id: 'root', component: 'IssueLabelToken', text: 'Selected', isSelected: true},
        ],
      },
    },
  ],
};
