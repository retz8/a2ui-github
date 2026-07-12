import {CATALOG_ID} from 'primer-a2ui-adapter';
import type {Fixture} from './types';

/** currentPage axis: at page 1 the Previous control is disabled. */
export const paginationFirstFixture: Fixture = {
  name: 'pagination-first',
  messages: [
    {version: 'v0.9', createSurface: {surfaceId: 'pagination-first', catalogId: CATALOG_ID}},
    {
      version: 'v0.9',
      updateComponents: {
        surfaceId: 'pagination-first',
        components: [{id: 'root', component: 'Pagination', pageCount: 5, currentPage: 1}],
      },
    },
  ],
};
