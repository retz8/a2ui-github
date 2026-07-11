import {CATALOG_ID} from 'primer-a2ui-adapter';
import type {A2uiMessage} from '@a2ui/web_core/v0_9';
import type {Fixture} from './types';

const SIZES = ['small', 'medium', 'large', 'xlarge'] as const;

function sizeSurface(size: (typeof SIZES)[number]): A2uiMessage[] {
  const surfaceId = `token-size-${size}`;
  return [
    {version: 'v0.9', createSurface: {surfaceId, catalogId: CATALOG_ID}},
    {
      version: 'v0.9',
      updateComponents: {
        surfaceId,
        components: [{id: 'root', component: 'Token', text: size, size}],
      },
    },
  ];
}

export const tokenSizesFixture: Fixture = {
  name: 'token-sizes',
  messages: SIZES.flatMap(sizeSurface),
};
