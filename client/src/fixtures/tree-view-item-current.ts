import {CATALOG_ID} from 'primer-a2ui-adapter';
import type {Fixture} from './types';

// The Item's `current` state: one item marked as the current item (e.g. the selected file).
export const treeViewItemCurrentFixture: Fixture = {
  name: 'tree-view-item-current',
  messages: [
    {version: 'v0.9', createSurface: {surfaceId: 'tree-view-item-current', catalogId: CATALOG_ID}},
    {
      version: 'v0.9',
      updateComponents: {
        surfaceId: 'tree-view-item-current',
        components: [
          {id: 'root', component: 'TreeView', children: ['item-a', 'item-b']},
          {id: 'item-a', component: 'TreeViewItem', current: true, children: ['label-a']},
          {id: 'label-a', component: 'Text', text: 'index.ts'},
          {id: 'item-b', component: 'TreeViewItem', children: ['label-b']},
          {id: 'label-b', component: 'Text', text: 'app.ts'},
        ],
      },
    },
  ],
};
