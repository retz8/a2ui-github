import {CATALOG_ID} from 'primer-a2ui-adapter';
import type {Fixture} from './types';

/**
 * hrefBuilder + uncontrolled mode: `currentPage` is a literal (no binding -> no setter), so
 * `onPageChange` never preventDefaults and every page anchor carries the real templated `href`
 * (`{page}` expanded to the page number) — a plain click would navigate. Not baselined; proven by
 * the href render-test assertion.
 */
export const paginationHrefFixture: Fixture = {
  name: 'pagination-href',
  messages: [
    {version: 'v0.9', createSurface: {surfaceId: 'pagination-href', catalogId: CATALOG_ID}},
    {
      version: 'v0.9',
      updateComponents: {
        surfaceId: 'pagination-href',
        components: [
          {
            id: 'root',
            component: 'Pagination',
            pageCount: 5,
            currentPage: 3,
            hrefBuilder: '/issues?page={page}',
          },
        ],
      },
    },
  ],
};
