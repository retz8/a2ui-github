import {CATALOG_ID} from 'primer-a2ui-adapter';
import type {A2uiMessage} from '@a2ui/web_core/v0_9';
import type {Fixture} from './types';

// The barSize enum on a single-bar ProgressBar; each surface pins progress to 65 so height is
// the only differing axis.
const SIZES = ['small', 'default', 'large'] as const;

function sizeSurface(barSize: (typeof SIZES)[number]): A2uiMessage[] {
  const surfaceId = `progressbar-size-${barSize}`;
  return [
    {version: 'v0.9', createSurface: {surfaceId, catalogId: CATALOG_ID}},
    {
      version: 'v0.9',
      updateComponents: {
        surfaceId,
        components: [
          {
            id: 'root',
            component: 'ProgressBar',
            progress: 65,
            barSize,
            accessibility: {label: barSize},
          },
        ],
      },
    },
  ];
}

export const progressbarSizesFixture: Fixture = {
  name: 'progressbar-sizes',
  messages: SIZES.flatMap(sizeSurface),
};
