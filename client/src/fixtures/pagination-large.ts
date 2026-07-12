import {CATALOG_ID} from 'primer-a2ui-adapter';
import type {Fixture} from './types';

/** pageCount axis: a large count so both leading and trailing ellipses appear (default margins). */
export const paginationLargeFixture: Fixture = {
  name: 'pagination-large',
  messages: [
    {version: 'v0.9', createSurface: {surfaceId: 'pagination-large', catalogId: CATALOG_ID}},
    {
      version: 'v0.9',
      updateComponents: {
        surfaceId: 'pagination-large',
        components: [{id: 'root', component: 'Pagination', pageCount: 15, currentPage: 8}],
      },
    },
  ],
};
