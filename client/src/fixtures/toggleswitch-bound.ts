import {CATALOG_ID} from 'primer-a2ui-adapter';
import type {Fixture} from './types';

/**
 * Path-bound `checked` with two-way write-back: toggling writes `/setting` locally via the
 * binder's auto-generated setter, and the switch re-renders on. Proven in the render
 * interaction test; not baselined (pixels are identical to the literal fixtures).
 */
export const toggleswitchBoundFixture: Fixture = {
  name: 'toggleswitch-bound',
  messages: [
    {version: 'v0.9', createSurface: {surfaceId: 'toggleswitch-bound', catalogId: CATALOG_ID}},
    {
      version: 'v0.9',
      updateComponents: {
        surfaceId: 'toggleswitch-bound',
        components: [
          {
            id: 'root',
            component: 'ToggleSwitch',
            checked: {path: '/setting'},
            accessibility: {label: 'Notifications'},
          },
        ],
      },
    },
    {
      version: 'v0.9',
      updateDataModel: {surfaceId: 'toggleswitch-bound', path: '/', value: {setting: false}},
    },
  ],
};
