import {CATALOG_ID} from 'primer-a2ui-adapter';
import type {Fixture} from './types';

/**
 * Dynamic-template body: `children` is a `{componentId, path}` template. The binder expands `tpl`
 * once per item in the bound `/items` array, each in its own data scope, so the template Text
 * resolves `{path: 'label'}` relative to that item (a relative JSON pointer, no leading slash).
 * Proves the disclosure's bound-content body path (the analog of Stack's bound ChildList).
 */
export const detailsChildrenTemplateFixture: Fixture = {
  name: 'details-children-template',
  messages: [
    {
      version: 'v0.9',
      createSurface: {surfaceId: 'details-children-template', catalogId: CATALOG_ID},
    },
    {
      version: 'v0.9',
      updateComponents: {
        surfaceId: 'details-children-template',
        components: [
          {
            id: 'root',
            component: 'Details',
            summary: 'sum',
            children: {componentId: 'tpl', path: '/items'},
            open: true,
          },
          {id: 'sum', component: 'Text', text: 'More info'},
          {id: 'tpl', component: 'Text', text: {path: 'label'}},
        ],
      },
    },
    {
      version: 'v0.9',
      updateDataModel: {
        surfaceId: 'details-children-template',
        path: '/',
        value: {items: [{label: 'Alpha'}, {label: 'Beta'}]},
      },
    },
  ],
};
