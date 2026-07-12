import {CATALOG_ID} from 'primer-a2ui-adapter';
import type {Fixture} from './types';

/** showPages axis: numbered page buttons hidden, only Previous/Next controls remain. */
export const paginationNoPagesFixture: Fixture = {
  name: 'pagination-no-pages',
  messages: [
    {version: 'v0.9', createSurface: {surfaceId: 'pagination-no-pages', catalogId: CATALOG_ID}},
    {
      version: 'v0.9',
      updateComponents: {
        surfaceId: 'pagination-no-pages',
        components: [
          {id: 'root', component: 'Pagination', pageCount: 5, currentPage: 3, showPages: false},
        ],
      },
    },
  ],
};
