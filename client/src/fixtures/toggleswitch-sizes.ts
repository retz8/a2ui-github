import {CATALOG_ID} from 'primer-a2ui-adapter';
import type {A2uiMessage} from '@a2ui/web_core/v0_9';
import type {Fixture} from './types';

const SIZES = ['small', 'medium'] as const;

function sizeSurface(size: (typeof SIZES)[number]): A2uiMessage[] {
  const surfaceId = `toggleswitch-size-${size}`;
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
            size,
            accessibility: {label: 'Notifications'},
          },
        ],
      },
    },
  ];
}

export const toggleswitchSizesFixture: Fixture = {
  name: 'toggleswitch-sizes',
  messages: SIZES.flatMap(sizeSurface),
};
