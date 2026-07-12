import {CATALOG_ID} from 'primer-a2ui-adapter';
import type {Fixture} from './types';

/**
 * Dynamic-template ChildList: `children` is a `{componentId, path}` template. The binder expands
 * `tpl` once per item in the bound `/tabs` array, each in its own data scope, so the template
 * segment's `label` resolves `{path: 'name'}` relative to that item (a relative JSON pointer, no
 * leading slash). Proves the container's bound-content path.
 */
export const segmentedcontrolChildrenTemplateFixture: Fixture = {
  name: 'segmentedcontrol-children-template',
  messages: [
    {
      version: 'v0.9',
      createSurface: {surfaceId: 'segmentedcontrol-children-template', catalogId: CATALOG_ID},
    },
    {
      version: 'v0.9',
      updateComponents: {
        surfaceId: 'segmentedcontrol-children-template',
        components: [
          {
            id: 'root',
            component: 'SegmentedControl',
            selectedIndex: 0,
            accessibility: {label: 'File view'},
            children: {componentId: 'tpl', path: '/tabs'},
          },
          {id: 'tpl', component: 'SegmentedControlButton', label: {path: 'name'}},
        ],
      },
    },
    {
      version: 'v0.9',
      updateDataModel: {
        surfaceId: 'segmentedcontrol-children-template',
        path: '/',
        value: {tabs: [{name: 'Preview'}, {name: 'Raw'}, {name: 'Blame'}]},
      },
    },
  ],
};
