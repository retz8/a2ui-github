import {CATALOG_ID} from 'primer-a2ui-adapter';
import type {Fixture} from './types';

// The Item's `action` functionCall path: activating the item runs the registered `consoleLog`
// locally (no server round-trip).
export const treeViewItemFnFixture: Fixture = {
  name: 'tree-view-item-fn',
  messages: [
    {version: 'v0.9', createSurface: {surfaceId: 'tree-view-item-fn', catalogId: CATALOG_ID}},
    {
      version: 'v0.9',
      updateComponents: {
        surfaceId: 'tree-view-item-fn',
        components: [
          {id: 'root', component: 'TreeView', children: ['item-src']},
          {
            id: 'item-src',
            component: 'TreeViewItem',
            action: {
              functionCall: {
                call: 'consoleLog',
                args: {message: 'item selected'},
                returnType: 'void',
              },
            },
            children: ['label-src'],
          },
          {id: 'label-src', component: 'Text', text: 'src'},
        ],
      },
    },
  ],
};
