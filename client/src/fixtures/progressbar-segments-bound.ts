import {CATALOG_ID} from 'primer-a2ui-adapter';
import type {Fixture} from './types';

// The same three segments as progressbar-segments, but the first segment's width is bound to
// the data model — exercising a data-binding resolved inside a synthetic array element.
export const progressbarSegmentsBoundFixture: Fixture = {
  name: 'progressbar-segments-bound',
  messages: [
    {
      version: 'v0.9',
      createSurface: {surfaceId: 'progressbar-segments-bound', catalogId: CATALOG_ID},
    },
    {
      version: 'v0.9',
      updateComponents: {
        surfaceId: 'progressbar-segments-bound',
        components: [
          {
            id: 'root',
            component: 'ProgressBar',
            segments: [
              {progress: {path: '/tsShare'}, bg: 'success', label: 'TypeScript'},
              {progress: 30, bg: 'accent', label: 'CSS'},
              {progress: 15, bg: 'attention', label: 'Other'},
            ],
          },
        ],
      },
    },
    {
      version: 'v0.9',
      updateDataModel: {
        surfaceId: 'progressbar-segments-bound',
        path: '/',
        value: {tsShare: 55},
      },
    },
  ],
};
