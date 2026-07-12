import {CATALOG_ID} from 'primer-a2ui-adapter';
import type {Fixture} from './types';

/** Base: a small page count with no ellipsis, current page in the middle. */
export const paginationFixture: Fixture = {
  name: 'pagination',
  messages: [
    {version: 'v0.9', createSurface: {surfaceId: 'pagination', catalogId: CATALOG_ID}},
    {
      version: 'v0.9',
      updateComponents: {
        surfaceId: 'pagination',
        components: [{id: 'root', component: 'Pagination', pageCount: 5, currentPage: 3}],
      },
    },
  ],
};
