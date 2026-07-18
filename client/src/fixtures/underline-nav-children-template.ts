import {CATALOG_ID} from 'primer-a2ui-adapter';
import type {Fixture} from './types';

/**
 * Dynamic-template ChildList: `children` is a `{componentId, path}` template. The binder expands
 * `tab` once per item in the bound `/tabs` array, each in its own data scope, so the template tab
 * resolves `text`/`href` relative to that item (a relative JSON pointer, no leading slash). Proves
 * the container's bound-content path — a tab row generated from a bound array.
 */
export const underlineNavChildrenTemplateFixture: Fixture = {
  name: 'underline-nav-children-template',
  messages: [
    {
      version: 'v0.9',
      createSurface: {surfaceId: 'underline-nav-children-template', catalogId: CATALOG_ID},
    },
    {
      version: 'v0.9',
      updateComponents: {
        surfaceId: 'underline-nav-children-template',
        components: [
          {
            id: 'root',
            component: 'UnderlineNav',
            'aria-label': 'Repository',
            children: {componentId: 'tab', path: '/tabs'},
          },
          {
            id: 'tab',
            component: 'UnderlineNav.Item',
            text: {path: 'label'},
            href: {path: 'url'},
          },
        ],
      },
    },
    {
      version: 'v0.9',
      updateDataModel: {
        surfaceId: 'underline-nav-children-template',
        path: '/',
        value: {
          tabs: [
            {label: 'Code', url: '#/code'},
            {label: 'Issues', url: '#/issues'},
            {label: 'Pull requests', url: '#/pulls'},
          ],
        },
      },
    },
  ],
};
