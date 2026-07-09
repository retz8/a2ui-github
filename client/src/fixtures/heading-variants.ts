import {CATALOG_ID} from 'primer-a2ui-adapter';
import type {A2uiMessage} from '@a2ui/web_core/v0_9';
import type {Fixture} from './types';

// The variant enum on a single Heading; other props left at their defaults.
const VARIANTS = ['large', 'medium', 'small'] as const;

function variantSurface(variant: (typeof VARIANTS)[number]): A2uiMessage[] {
  const surfaceId = `heading-variant-${variant}`;
  return [
    {version: 'v0.9', createSurface: {surfaceId, catalogId: CATALOG_ID}},
    {
      version: 'v0.9',
      updateComponents: {
        surfaceId,
        components: [{id: 'root', component: 'Heading', text: variant, variant}],
      },
    },
  ];
}

export const headingVariantsFixture: Fixture = {
  name: 'heading-variants',
  messages: VARIANTS.flatMap(variantSurface),
};
