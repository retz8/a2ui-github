import {CATALOG_ID} from 'primer-a2ui-adapter';
import type {Fixture} from './types';

/**
 * Dynamic-template ChildList: `children` is a `{componentId, path}` template. The binder expands
 * `opt` once per item in the bound `/labels` array, each in its own data scope, so the template
 * SelectOption resolves `{path: 'label'}` / `{path: 'value'}` relative to that item (a relative
 * JSON pointer, no leading slash). Proves the option set can be generated from a bound array.
 */
export const selectChildrenTemplateFixture: Fixture = {
  name: 'select-children-template',
  messages: [
    {
      version: 'v0.9',
      createSurface: {surfaceId: 'select-children-template', catalogId: CATALOG_ID},
    },
    {
      version: 'v0.9',
      updateComponents: {
        surfaceId: 'select-children-template',
        components: [
          {
            id: 'root',
            component: 'Select',
            value: 'feature',
            children: {componentId: 'opt', path: '/labels'},
          },
          {id: 'opt', component: 'SelectOption', text: {path: 'label'}, value: {path: 'value'}},
        ],
      },
    },
    {
      version: 'v0.9',
      updateDataModel: {
        surfaceId: 'select-children-template',
        path: '/',
        value: {
          labels: [
            {label: 'Bug', value: 'bug'},
            {label: 'Feature', value: 'feature'},
            {label: 'Docs', value: 'docs'},
          ],
        },
      },
    },
  ],
};
