import {CATALOG_ID} from 'primer-a2ui-adapter';
import type {Fixture} from './types';

/**
 * Controlled mode — two-way write-back: `currentPage` is bound to `/page` (initially 2). Clicking
 * a page link preventDefaults and writes the new page back through the binder's auto-generated
 * setter, moving `aria-current` without navigating. Not visually baselined (pixels are identical
 * to a literal at the same page); behavior is proven in the interaction test (the Checkbox
 * `-bound` precedent).
 */
export const paginationControlledFixture: Fixture = {
  name: 'pagination-controlled',
  messages: [
    {version: 'v0.9', createSurface: {surfaceId: 'pagination-controlled', catalogId: CATALOG_ID}},
    {
      version: 'v0.9',
      updateComponents: {
        surfaceId: 'pagination-controlled',
        components: [
          {id: 'root', component: 'Pagination', pageCount: 5, currentPage: {path: '/page'}},
        ],
      },
    },
    {
      version: 'v0.9',
      updateDataModel: {surfaceId: 'pagination-controlled', path: '/', value: {page: 2}},
    },
  ],
};
