import {CATALOG_ID} from 'primer-a2ui-adapter';
import type {Fixture} from './types';

// The root's `flat` prop: items render without nested indentation guidelines.
export const treeViewFlatFixture: Fixture = {
  name: 'tree-view-flat',
  messages: [
    {version: 'v0.9', createSurface: {surfaceId: 'tree-view-flat', catalogId: CATALOG_ID}},
    {
      version: 'v0.9',
      updateComponents: {
        surfaceId: 'tree-view-flat',
        components: [
          {id: 'root', component: 'TreeView', flat: true, children: ['item-a', 'item-b', 'item-c']},
          {id: 'item-a', component: 'TreeViewItem', children: ['label-a']},
          {id: 'label-a', component: 'Text', text: 'index.ts'},
          {id: 'item-b', component: 'TreeViewItem', children: ['label-b']},
          {id: 'label-b', component: 'Text', text: 'app.ts'},
          {id: 'item-c', component: 'TreeViewItem', children: ['label-c']},
          {id: 'label-c', component: 'Text', text: 'utils.ts'},
        ],
      },
    },
  ],
};
