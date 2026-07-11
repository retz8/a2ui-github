import {CATALOG_ID} from 'primer-a2ui-adapter';
import type {A2uiMessage} from '@a2ui/web_core/v0_9';
import type {Fixture} from './types';

const SIZES = ['small', 'medium', 'large', 'xlarge'] as const;

function sizeSurface(size: (typeof SIZES)[number]): A2uiMessage[] {
  const surfaceId = `issuelabeltoken-size-${size}`;
  return [
    {version: 'v0.9', createSurface: {surfaceId, catalogId: CATALOG_ID}},
    {
      version: 'v0.9',
      updateComponents: {
        surfaceId,
        components: [{id: 'root', component: 'IssueLabelToken', text: size, size}],
      },
    },
  ];
}

export const issuelabeltokenSizesFixture: Fixture = {
  name: 'issuelabeltoken-sizes',
  messages: SIZES.flatMap(sizeSurface),
};
