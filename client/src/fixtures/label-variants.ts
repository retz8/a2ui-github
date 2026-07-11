import {CATALOG_ID} from 'primer-a2ui-adapter';
import type {A2uiMessage} from '@a2ui/web_core/v0_9';
import type {Fixture} from './types';

// The color-variant enum on a single Label; size left at its default.
const VARIANTS = [
  'default',
  'primary',
  'secondary',
  'accent',
  'success',
  'attention',
  'severe',
  'danger',
  'done',
  'sponsors',
] as const;

function variantSurface(variant: (typeof VARIANTS)[number]): A2uiMessage[] {
  const surfaceId = `label-variant-${variant}`;
  return [
    {version: 'v0.9', createSurface: {surfaceId, catalogId: CATALOG_ID}},
    {
      version: 'v0.9',
      updateComponents: {
        surfaceId,
        components: [{id: 'root', component: 'Label', text: variant, variant}],
      },
    },
  ];
}

export const labelVariantsFixture: Fixture = {
  name: 'label-variants',
  messages: VARIANTS.flatMap(variantSurface),
};
