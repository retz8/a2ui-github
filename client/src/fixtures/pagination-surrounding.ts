import {CATALOG_ID} from 'primer-a2ui-adapter';
import type {Fixture} from './types';

/** surroundingPageCount axis: four pages shown on each side of the current page. */
export const paginationSurroundingFixture: Fixture = {
  name: 'pagination-surrounding',
  messages: [
    {version: 'v0.9', createSurface: {surfaceId: 'pagination-surrounding', catalogId: CATALOG_ID}},
    {
      version: 'v0.9',
      updateComponents: {
        surfaceId: 'pagination-surrounding',
        components: [
          {
            id: 'root',
            component: 'Pagination',
            pageCount: 15,
            currentPage: 8,
            surroundingPageCount: 4,
          },
        ],
      },
    },
  ],
};
