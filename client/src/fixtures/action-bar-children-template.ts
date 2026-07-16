import {CATALOG_ID} from 'primer-a2ui-adapter';
import type {Fixture} from './types';

/**
 * Dynamic-template `ChildList`: `children` is a `{componentId, path}` template. The binder expands
 * `tpl` once per item in the bound `/actions` array, each in its own data scope, so the template
 * `ActionBar.IconButton`'s `accessibility.label` resolves `{path: 'label'}` relative to that item
 * (a relative JSON pointer, no leading slash). Proves the container's bound-content path.
 */
export const actionBarChildrenTemplateFixture: Fixture = {
  name: 'action-bar-children-template',
  messages: [
    {
      version: 'v0.9',
      createSurface: {surfaceId: 'action-bar-children-template', catalogId: CATALOG_ID},
    },
    {
      version: 'v0.9',
      updateComponents: {
        surfaceId: 'action-bar-children-template',
        components: [
          {
            id: 'root',
            component: 'ActionBar',
            accessibility: {label: 'Formatting'},
            children: {componentId: 'tpl', path: '/actions'},
          },
          {
            id: 'tpl',
            component: 'ActionBar.IconButton',
            icon: 'tpl-icon',
            accessibility: {label: {path: 'label'}},
            action: {
              functionCall: {call: 'consoleLog', args: {message: 'tpl'}, returnType: 'void'},
            },
          },
          {id: 'tpl-icon', component: 'Icon', name: 'typography'},
        ],
      },
    },
    {
      version: 'v0.9',
      updateDataModel: {
        surfaceId: 'action-bar-children-template',
        path: '/',
        value: {actions: [{label: 'Bold'}, {label: 'Italic'}, {label: 'Underline'}]},
      },
    },
  ],
};
