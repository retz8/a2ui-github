import {CATALOG_ID} from 'primer-a2ui-adapter';
import type {Fixture} from './types';

/**
 * Dynamic-template ChildList: `children` is a `{componentId, path}` template. The binder expands
 * `tpl` once per item in the bound `/items` array, each in its own data scope, so the template
 * Button's label Text resolves `{path: 'label'}` relative to that item (a relative JSON pointer,
 * no leading slash). Proves the container's bound-content path (the analog of Text's
 * literal-vs-bound content axis).
 */
export const stackChildrenTemplateFixture: Fixture = {
  name: 'stack-children-template',
  messages: [
    {version: 'v0.9', createSurface: {surfaceId: 'stack-children-template', catalogId: CATALOG_ID}},
    {
      version: 'v0.9',
      updateComponents: {
        surfaceId: 'stack-children-template',
        components: [
          {
            id: 'root',
            component: 'Stack',
            direction: 'horizontal',
            gap: 'normal',
            children: {componentId: 'tpl', path: '/items'},
          },
          {
            id: 'tpl',
            component: 'Button',
            child: 'tpl-label',
            action: {functionCall: {call: 'consoleLog', args: {message: 'tpl'}, returnType: 'void'}},
          },
          {id: 'tpl-label', component: 'Text', text: {path: 'label'}},
        ],
      },
    },
    {
      version: 'v0.9',
      updateDataModel: {
        surfaceId: 'stack-children-template',
        path: '/',
        value: {items: [{label: 'Alpha'}, {label: 'Beta'}, {label: 'Gamma'}]},
      },
    },
  ],
};
