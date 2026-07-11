import {CATALOG_ID} from 'primer-a2ui-adapter';
import type {A2uiMessage} from '@a2ui/web_core/v0_9';
import type {Fixture} from './types';

// `disabled` renders distinctly per check-state, so the two arms are shown together.
const ARMS = [
  {surfaceId: 'toggleswitch-disabled-off', checked: false},
  {surfaceId: 'toggleswitch-disabled-on', checked: true},
] as const;

function disabledSurface(arm: (typeof ARMS)[number]): A2uiMessage[] {
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
            disabled: true,
            accessibility: {label: 'Notifications'},
          },
        ],
      },
    },
  ];
}

export const toggleswitchDisabledFixture: Fixture = {
  name: 'toggleswitch-disabled',
  messages: ARMS.flatMap(disabledSurface),
};
