import {CATALOG_ID} from 'primer-a2ui-adapter';
import type {A2uiMessage} from '@a2ui/web_core/v0_9';
import type {Fixture} from './types';

// The size enum on a single icon; fill left at its default.
const SIZES = ['small', 'medium', 'large'] as const;

function sizeSurface(size: (typeof SIZES)[number]): A2uiMessage[] {
  const surfaceId = `icon-size-${size}`;
  return [
    {version: 'v0.9', createSurface: {surfaceId, catalogId: CATALOG_ID}},
    {
      version: 'v0.9',
      updateComponents: {
        surfaceId,
        components: [
          {id: 'root', component: 'Icon', name: 'rocket', size, accessibility: {label: size}},
        ],
      },
    },
  ];
}

export const iconSizesFixture: Fixture = {
  name: 'icon-sizes',
  messages: SIZES.flatMap(sizeSurface),
};
