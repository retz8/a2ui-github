import {CATALOG_ID} from 'primer-a2ui-adapter';
import type {Fixture} from './types';

/** accessibility axis: the navigation landmark is labelled from `accessibility.label`. */
export const paginationAccessibilityFixture: Fixture = {
  name: 'pagination-accessibility',
  messages: [
    {
      version: 'v0.9',
      createSurface: {surfaceId: 'pagination-accessibility', catalogId: CATALOG_ID},
    },
    {
      version: 'v0.9',
      updateComponents: {
        surfaceId: 'pagination-accessibility',
        components: [
          {
            id: 'root',
            component: 'Pagination',
            pageCount: 5,
            currentPage: 3,
            accessibility: {label: 'Issues pagination'},
          },
        ],
      },
    },
  ],
};
