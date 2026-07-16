import {CATALOG_ID} from 'primer-a2ui-adapter';
import type {Fixture} from './types';

// The Item's `expanded` two-way binding: the item's open state is bound to `/openState`, proving
// path binding (the literal-expanded case is covered by tree-view-nested).
export const treeViewItemExpandedBoundFixture: Fixture = {
  name: 'tree-view-item-expanded-bound',
  messages: [
    {
      version: 'v0.9',
      createSurface: {surfaceId: 'tree-view-item-expanded-bound', catalogId: CATALOG_ID},
    },
    {
      version: 'v0.9',
      updateComponents: {
        surfaceId: 'tree-view-item-expanded-bound',
        components: [
          {id: 'root', component: 'TreeView', children: ['item-src']},
          {
            id: 'item-src',
            component: 'TreeViewItem',
            expanded: {path: '/openState'},
            children: ['label-src', 'subtree-src'],
          },
          {id: 'label-src', component: 'Text', text: 'src'},
          {
            id: 'subtree-src',
            component: 'TreeViewSubTree',
            state: 'done',
            children: ['item-index'],
          },
          {id: 'item-index', component: 'TreeViewItem', children: ['label-index']},
          {id: 'label-index', component: 'Text', text: 'index.ts'},
        ],
      },
    },
    {
      version: 'v0.9',
      updateDataModel: {
        surfaceId: 'tree-view-item-expanded-bound',
        path: '/',
        value: {openState: true},
      },
    },
  ],
};
