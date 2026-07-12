import {CATALOG_ID} from 'primer-a2ui-adapter';
import type {Fixture} from './types';

// Both content channels (text + title) bound to the same data-model path, resolved from
// updateDataModel. The value is long enough to overflow the default 125px max-width.
export const truncateBoundFixture: Fixture = {
  name: 'truncate-bound',
  messages: [
    {version: 'v0.9', createSurface: {surfaceId: 'truncate-bound', catalogId: CATALOG_ID}},
    {
      version: 'v0.9',
      updateComponents: {
        surfaceId: 'truncate-bound',
        components: [
          {
            id: 'root',
            component: 'Truncate',
            text: {path: '/fullText'},
            title: {path: '/fullText'},
          },
        ],
      },
    },
    {
      version: 'v0.9',
      updateDataModel: {
        surfaceId: 'truncate-bound',
        path: '/',
        value: {fullText: 'feature/add-visual-regression-baselines-for-truncate'},
      },
    },
  ],
};
