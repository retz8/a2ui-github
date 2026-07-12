import {CATALOG_ID} from 'primer-a2ui-adapter';
import type {A2uiMessage} from '@a2ui/web_core/v0_9';
import type {Fixture} from './types';

const SIZES = ['small', 'medium'] as const;

function sizeSurface(size: (typeof SIZES)[number]): A2uiMessage[] {
  const surfaceId = `segmentedcontrol-size-${size}`;
  return [
    {version: 'v0.9', createSurface: {surfaceId, catalogId: CATALOG_ID}},
    {
      version: 'v0.9',
      updateComponents: {
        surfaceId,
        components: [
          {
            id: 'root',
            component: 'SegmentedControl',
            selectedIndex: 0,
            size,
            accessibility: {label: `File view (${size})`},
            children: ['s0', 's1', 's2'],
          },
          {id: 's0', component: 'SegmentedControlButton', label: 'Preview'},
          {id: 's1', component: 'SegmentedControlButton', label: 'Raw'},
          {id: 's2', component: 'SegmentedControlButton', label: 'Blame'},
        ],
      },
    },
  ];
}

/** Visual enum: one surface per `size` value, three segments each. */
export const segmentedcontrolSizeFixture: Fixture = {
  name: 'segmentedcontrol-size',
  messages: SIZES.flatMap(sizeSurface),
};
