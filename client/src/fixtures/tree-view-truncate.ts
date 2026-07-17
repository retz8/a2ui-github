import {CATALOG_ID} from 'primer-a2ui-adapter';
import type {Fixture} from './types';

// The root's `truncate` prop: a long item label is clipped to a single line instead of wrapping.
export const treeViewTruncateFixture: Fixture = {
  name: 'tree-view-truncate',
  messages: [
    {version: 'v0.9', createSurface: {surfaceId: 'tree-view-truncate', catalogId: CATALOG_ID}},
    {
      version: 'v0.9',
      updateComponents: {
        surfaceId: 'tree-view-truncate',
        components: [
          {id: 'root', component: 'TreeView', truncate: true, children: ['item-long']},
          {id: 'item-long', component: 'TreeViewItem', children: ['label-long']},
          {
            id: 'label-long',
            component: 'Text',
            text: 'a-very-long-file-name-that-should-be-truncated-to-a-single-line-instead-of-wrapping.tsx',
          },
        ],
      },
    },
  ],
};
