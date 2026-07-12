import {CATALOG_ID} from 'primer-a2ui-adapter';
import type {Fixture} from './types';

/** currentPage axis: at the last page the Next control is disabled. */
export const paginationLastFixture: Fixture = {
  name: 'pagination-last',
  messages: [
    {version: 'v0.9', createSurface: {surfaceId: 'pagination-last', catalogId: CATALOG_ID}},
    {
      version: 'v0.9',
      updateComponents: {
        surfaceId: 'pagination-last',
        components: [{id: 'root', component: 'Pagination', pageCount: 5, currentPage: 5}],
      },
    },
  ],
};
