import {CATALOG_ID} from 'primer-a2ui-adapter';
import type {Fixture} from './types';

export const toggleswitchFnFixture: Fixture = {
  name: 'toggleswitch-fn',
  messages: [
    {version: 'v0.9', createSurface: {surfaceId: 'toggleswitch-fn', catalogId: CATALOG_ID}},
    {
      version: 'v0.9',
      updateComponents: {
        surfaceId: 'toggleswitch-fn',
        components: [
          {
            id: 'root',
            component: 'ToggleSwitch',
            checked: false,
            accessibility: {label: 'Notifications'},
            action: {
              functionCall: {
                call: 'consoleLog',
                args: {message: 'toggleswitch-fn toggled'},
                returnType: 'void',
              },
            },
          },
        ],
      },
    },
  ],
};
