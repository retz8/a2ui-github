import {CATALOG_ID} from 'primer-a2ui-adapter';
import type {Fixture} from './types';

export const radioCheckedFixture: Fixture = {
  name: 'radio-checked',
  messages: [
    {version: 'v0.9', createSurface: {surfaceId: 'radio-checked', catalogId: CATALOG_ID}},
    {
      version: 'v0.9',
      updateComponents: {
        surfaceId: 'radio-checked',
        components: [
          {
            id: 'root',
            component: 'Radio',
            value: 'option-1',
            name: 'radio-demo',
            checked: true,
          },
        ],
      },
    },
  ],
};
