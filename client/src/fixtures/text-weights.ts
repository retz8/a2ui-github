import {CATALOG_ID} from 'primer-a2ui-adapter';
import type {A2uiMessage} from '@a2ui/web_core/v0_9';
import type {Fixture} from './types';

// The weight enum on a single Text; other props left at their defaults.
const WEIGHTS = ['light', 'normal', 'medium', 'semibold'] as const;

function weightSurface(weight: (typeof WEIGHTS)[number]): A2uiMessage[] {
  const surfaceId = `text-weight-${weight}`;
  return [
    {version: 'v0.9', createSurface: {surfaceId, catalogId: CATALOG_ID}},
    {
      version: 'v0.9',
      updateComponents: {
        surfaceId,
        components: [{id: 'root', component: 'Text', text: weight, weight}],
      },
    },
  ];
}

export const textWeightsFixture: Fixture = {
  name: 'text-weights',
  messages: WEIGHTS.flatMap(weightSurface),
};
