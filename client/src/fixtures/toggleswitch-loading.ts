import {CATALOG_ID} from 'primer-a2ui-adapter';
import type {A2uiMessage} from '@a2ui/web_core/v0_9';
import type {Fixture} from './types';

// `loading` renders distinctly per check-state, so the two arms are shown together.
const ARMS = [
  {surfaceId: 'toggleswitch-loading-off', checked: false},
  {surfaceId: 'toggleswitch-loading-on', checked: true},
] as const;

function loadingSurface(arm: (typeof ARMS)[number]): A2uiMessage[] {
  return [
    {version: 'v0.9', createSurface: {surfaceId: arm.surfaceId, catalogId: CATALOG_ID}},
    {
      version: 'v0.9',
      updateComponents: {
        surfaceId: arm.surfaceId,
        components: [
          {
            id: 'root',
            component: 'ToggleSwitch',
            checked: arm.checked,
            loading: true,
            accessibility: {label: 'Notifications'},
          },
        ],
      },
    },
  ];
}

export const toggleswitchLoadingFixture: Fixture = {
  name: 'toggleswitch-loading',
  messages: ARMS.flatMap(loadingSurface),
};
