import {CATALOG_ID} from 'primer-a2ui-adapter';
import type {Fixture} from './types';

export const progressbarSegmentsFixture: Fixture = {
  name: 'progressbar-segments',
  messages: [
    {version: 'v0.9', createSurface: {surfaceId: 'progressbar-segments', catalogId: CATALOG_ID}},
    {
      version: 'v0.9',
      updateComponents: {
        surfaceId: 'progressbar-segments',
        components: [
          {
            id: 'root',
            component: 'ProgressBar',
            segments: [
              {progress: 55, bg: 'success', label: 'TypeScript'},
              {progress: 30, bg: 'accent', label: 'CSS'},
              {progress: 15, bg: 'attention', label: 'Other'},
            ],
          },
        ],
      },
    },
  ],
};
