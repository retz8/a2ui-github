import {CATALOG_ID} from 'primer-a2ui-adapter';
import type {Fixture} from './types';

/**
 * Dynamic-template ChildList: `children` is a `{componentId, path}` template. The binder expands
 * `crumb` once per item in the bound `/trail` array, each in its own data scope, so the template
 * crumb resolves `label`/`href`/`selected` relative to that item (a relative JSON pointer, no
 * leading slash). Proves the container's bound-content path — the dominant breadcrumb authoring
 * pattern (a trail generated from a bound array).
 */
export const breadcrumbsChildrenTemplateFixture: Fixture = {
  name: 'breadcrumbs-children-template',
  messages: [
    {
      version: 'v0.9',
      createSurface: {surfaceId: 'breadcrumbs-children-template', catalogId: CATALOG_ID},
    },
    {
      version: 'v0.9',
      updateComponents: {
        surfaceId: 'breadcrumbs-children-template',
        components: [
          {
            id: 'root',
            component: 'Breadcrumbs',
            children: {componentId: 'crumb', path: '/trail'},
          },
          {
            id: 'crumb',
            component: 'BreadcrumbsItem',
            label: {path: 'name'},
            href: {path: 'url'},
            selected: {path: 'current'},
          },
        ],
      },
    },
    {
      version: 'v0.9',
      updateDataModel: {
        surfaceId: 'breadcrumbs-children-template',
        path: '/',
        value: {
          trail: [
            {name: 'Home', url: '/', current: false},
            {name: 'Repositories', url: '/repos', current: false},
            {name: 'Settings', url: '/settings', current: true},
          ],
        },
      },
    },
  ],
};
