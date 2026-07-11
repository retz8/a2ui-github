import {CATALOG_ID} from 'primer-a2ui-adapter';
import type {A2uiMessage} from '@a2ui/web_core/v0_9';
import type {Fixture} from './types';

// The size enum on a single Spinner; all other props left at their defaults so size is
// the only differing axis.
const SIZES = ['small', 'medium', 'large'] as const;

function sizeSurface(size: (typeof SIZES)[number]): A2uiMessage[] {
  const surfaceId = `spinner-size-${size}`;
  return [
    {version: 'v0.9', createSurface: {surfaceId, catalogId: CATALOG_ID}},
    {
      version: 'v0.9',
      updateComponents: {
        surfaceId,
        components: [{id: 'root', component: 'Spinner', size}],
      },
    },
  ];
}

export const spinnerSizesFixture: Fixture = {
  name: 'spinner-sizes',
  messages: SIZES.flatMap(sizeSurface),
};
