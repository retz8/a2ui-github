import {CATALOG_ID} from 'primer-a2ui-adapter';
import type {Fixture} from './types';

/** marginPageCount axis: two pages pinned at each end (against the large-count backdrop). */
export const paginationMarginFixture: Fixture = {
  name: 'pagination-margin',
  messages: [
    {version: 'v0.9', createSurface: {surfaceId: 'pagination-margin', catalogId: CATALOG_ID}},
    {
      version: 'v0.9',
      updateComponents: {
        surfaceId: 'pagination-margin',
        components: [
          {id: 'root', component: 'Pagination', pageCount: 15, currentPage: 8, marginPageCount: 2},
        ],
      },
    },
  ],
};
