import {CATALOG_ID} from 'primer-a2ui-adapter';
import type {Fixture} from './types';

export const toggleswitchCheckedFixture: Fixture = {
  name: 'toggleswitch-checked',
  messages: [
    {version: 'v0.9', createSurface: {surfaceId: 'toggleswitch-checked', catalogId: CATALOG_ID}},
    {
      version: 'v0.9',
      updateComponents: {
        surfaceId: 'toggleswitch-checked',
        components: [
          {
            id: 'root',
            component: 'ToggleSwitch',
            checked: true,
            accessibility: {label: 'Notifications'},
          },
        ],
      },
    },
  ],
};
