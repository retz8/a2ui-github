import {CATALOG_ID} from 'primer-a2ui-adapter';
import type {Fixture} from './types';

export const checkboxCheckedFixture: Fixture = {
  name: 'checkbox-checked',
  messages: [
    {version: 'v0.9', createSurface: {surfaceId: 'checkbox-checked', catalogId: CATALOG_ID}},
    {
      version: 'v0.9',
      updateComponents: {
        surfaceId: 'checkbox-checked',
        components: [
          {
            id: 'root',
            component: 'Checkbox',
            checked: true,
            accessibility: {label: 'Notify me about updates'},
          },
        ],
      },
    },
  ],
};
