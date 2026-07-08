import {CATALOG_ID} from 'primer-a2ui-adapter';
import type {A2uiMessage} from '@a2ui/web_core/v0_9';
import type {Fixture} from './types';

// The size enum on a single Label; other props left at their defaults.
const SIZES = ['small', 'large'] as const;

function sizeSurface(size: (typeof SIZES)[number]): A2uiMessage[] {
  const surfaceId = `label-size-${size}`;
  return [
    {version: 'v0.9', createSurface: {surfaceId, catalogId: CATALOG_ID}},
    {
      version: 'v0.9',
      updateComponents: {
        surfaceId,
        components: [{id: 'root', component: 'Label', text: size, size}],
      },
    },
  ];
}

export const labelSizesFixture: Fixture = {
  name: 'label-sizes',
  messages: SIZES.flatMap(sizeSurface),
};
