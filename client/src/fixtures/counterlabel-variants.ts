import {CATALOG_ID} from 'primer-a2ui-adapter';
import type {A2uiMessage} from '@a2ui/web_core/v0_9';
import type {Fixture} from './types';

// The variant enum on a single CounterLabel; count fixed so variant styling is the
// only differing axis.
const VARIANTS = ['primary', 'secondary'] as const;

function variantSurface(variant: (typeof VARIANTS)[number]): A2uiMessage[] {
  const surfaceId = `counterlabel-variant-${variant}`;
  return [
    {version: 'v0.9', createSurface: {surfaceId, catalogId: CATALOG_ID}},
    {
      version: 'v0.9',
      updateComponents: {
        surfaceId,
        components: [{id: 'root', component: 'CounterLabel', count: '12', variant}],
      },
    },
  ];
}

export const counterlabelVariantsFixture: Fixture = {
  name: 'counterlabel-variants',
  messages: VARIANTS.flatMap(variantSurface),
};
