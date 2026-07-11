import {CATALOG_ID} from 'primer-a2ui-adapter';
import type {A2uiMessage} from '@a2ui/web_core/v0_9';
import type {Fixture} from './types';

// The custom on/off labels are a coupled pair; show each in the state whose label it replaces.
type Arm = {surfaceId: string; checked: boolean; buttonLabelOn?: string; buttonLabelOff?: string};

const ARMS: Arm[] = [
  {surfaceId: 'toggleswitch-custom-labels-off', checked: false, buttonLabelOff: 'Hide'},
  {surfaceId: 'toggleswitch-custom-labels-on', checked: true, buttonLabelOn: 'Show'},
];

function labelSurface(arm: Arm): A2uiMessage[] {
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
            ...(arm.buttonLabelOn ? {buttonLabelOn: arm.buttonLabelOn} : {}),
            ...(arm.buttonLabelOff ? {buttonLabelOff: arm.buttonLabelOff} : {}),
            accessibility: {label: 'Show images'},
          },
        ],
      },
    },
  ];
}

export const toggleswitchCustomLabelsFixture: Fixture = {
  name: 'toggleswitch-custom-labels',
  messages: ARMS.flatMap(labelSurface),
};
