import {CATALOG_ID} from 'primer-a2ui-adapter';
import type {Fixture} from './types';

export const toggleswitchFixture: Fixture = {
  name: 'toggleswitch',
  messages: [
    {version: 'v0.9', createSurface: {surfaceId: 'toggleswitch', catalogId: CATALOG_ID}},
    {
      version: 'v0.9',
      updateComponents: {
        surfaceId: 'toggleswitch',
        components: [
          {
            id: 'root',
            component: 'ToggleSwitch',
            checked: false,
            accessibility: {label: 'Notifications'},
          },
        ],
      },
    },
  ],
};
