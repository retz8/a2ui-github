import {CATALOG_ID} from 'primer-a2ui-adapter';
import type {Fixture} from './types';

export const checkboxIndeterminateFixture: Fixture = {
  name: 'checkbox-indeterminate',
  messages: [
    {version: 'v0.9', createSurface: {surfaceId: 'checkbox-indeterminate', catalogId: CATALOG_ID}},
    {
      version: 'v0.9',
      updateComponents: {
        surfaceId: 'checkbox-indeterminate',
        components: [
          {
            id: 'root',
            component: 'Checkbox',
            checked: false,
            indeterminate: true,
            accessibility: {label: 'Select all items'},
          },
        ],
      },
    },
  ],
};
