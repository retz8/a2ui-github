import {CATALOG_ID} from 'primer-a2ui-adapter';
import type {Fixture} from './types';

/**
 * Dynamic-template ChildList: `children` is a `{componentId, path}` template. The binder expands
 * `tpl` once per item in the bound `/actions` array, each in its own data scope, so the template
 * Button's label Text resolves `{path: 'label'}` relative to that item (a relative JSON pointer,
 * no leading slash). Proves the container's bound-content path.
 */
export const buttonGroupChildrenTemplateFixture: Fixture = {
  name: 'button-group-children-template',
  messages: [
    {
      version: 'v0.9',
      createSurface: {surfaceId: 'button-group-children-template', catalogId: CATALOG_ID},
    },
    {
      version: 'v0.9',
      updateComponents: {
        surfaceId: 'button-group-children-template',
        components: [
          {
            id: 'root',
            component: 'ButtonGroup',
            children: {componentId: 'tpl', path: '/actions'},
          },
          {
            id: 'tpl',
            component: 'Button',
            child: 'tpl-label',
            action: {
              functionCall: {call: 'consoleLog', args: {message: 'tpl'}, returnType: 'void'},
            },
          },
          {id: 'tpl-label', component: 'Text', text: {path: 'label'}},
        ],
      },
    },
    {
      version: 'v0.9',
      updateDataModel: {
        surfaceId: 'button-group-children-template',
        path: '/',
        value: {actions: [{label: 'Edit'}, {label: 'Copy'}, {label: 'Archive'}]},
      },
    },
  ],
};
