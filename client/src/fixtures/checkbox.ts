import {CATALOG_ID} from 'primer-a2ui-adapter';
import type {Fixture} from './types';

export const checkboxFixture: Fixture = {
  name: 'checkbox',
  messages: [
    {version: 'v0.9', createSurface: {surfaceId: 'checkbox', catalogId: CATALOG_ID}},
    {
      version: 'v0.9',
      updateComponents: {
        surfaceId: 'checkbox',
        components: [
          {
            id: 'root',
            component: 'Checkbox',
            checked: false,
            accessibility: {label: 'Notify me about updates'},
          },
        ],
      },
    },
  ],
};
