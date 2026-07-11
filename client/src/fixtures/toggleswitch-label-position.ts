import {CATALOG_ID} from 'primer-a2ui-adapter';
import type {A2uiMessage} from '@a2ui/web_core/v0_9';
import type {Fixture} from './types';

const POSITIONS = ['start', 'end'] as const;

function positionSurface(position: (typeof POSITIONS)[number]): A2uiMessage[] {
  const surfaceId = `toggleswitch-label-position-${position}`;
  return [
    {version: 'v0.9', createSurface: {surfaceId, catalogId: CATALOG_ID}},
    {
      version: 'v0.9',
      updateComponents: {
        surfaceId,
        components: [
          {
            id: 'root',
            component: 'ToggleSwitch',
            checked: true,
            statusLabelPosition: position,
            accessibility: {label: 'Notifications'},
          },
        ],
      },
    },
  ];
}

export const toggleswitchLabelPositionFixture: Fixture = {
  name: 'toggleswitch-label-position',
  messages: POSITIONS.flatMap(positionSurface),
};
