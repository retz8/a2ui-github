import {CATALOG_ID} from 'primer-a2ui-adapter';
import type {Fixture} from './types';

/**
 * Dynamic-template ChildList: `children` is a `{componentId, path}` template. The binder expands
 * `tpl` once per item in the bound `/labels` array, each in its own data scope, so the template
 * `Label`'s text resolves `{path: 'text'}` relative to that item (a relative JSON pointer, no
 * leading slash). Proves the container's bound-content path.
 */
export const labelGroupChildrenTemplateFixture: Fixture = {
  name: 'label-group-children-template',
  messages: [
    {
      version: 'v0.9',
      createSurface: {surfaceId: 'label-group-children-template', catalogId: CATALOG_ID},
    },
    {
      version: 'v0.9',
      updateComponents: {
        surfaceId: 'label-group-children-template',
        components: [
          {id: 'root', component: 'LabelGroup', children: {componentId: 'tpl', path: '/labels'}},
          {id: 'tpl', component: 'Label', text: {path: 'text'}},
        ],
      },
    },
    {
      version: 'v0.9',
      updateDataModel: {
        surfaceId: 'label-group-children-template',
        path: '/',
        value: {labels: [{text: 'bug'}, {text: 'wontfix'}, {text: 'duplicate'}]},
      },
    },
  ],
};
