import {CATALOG_ID} from 'primer-a2ui-adapter';
import type {Fixture} from './types';

// The Item's `action` event path: activating the item dispatches a `select-item` event to the
// server. The item's `current` state is bound to `/itemSelected` (agent-coupling) so the server's
// write becomes visible — after the event the row highlights as current.
export const treeViewItemEventFixture: Fixture = {
  name: 'tree-view-item-event',
  messages: [
    {version: 'v0.9', createSurface: {surfaceId: 'tree-view-item-event', catalogId: CATALOG_ID}},
    {
      version: 'v0.9',
      updateComponents: {
        surfaceId: 'tree-view-item-event',
        components: [
          {id: 'root', component: 'TreeView', children: ['item-src']},
          {
            id: 'item-src',
            component: 'TreeViewItem',
            action: {event: {name: 'select-item', context: {id: 'src'}}},
            current: {path: '/itemSelected'},
            children: ['label-src'],
          },
          {id: 'label-src', component: 'Text', text: 'src'},
        ],
      },
    },
    {
      version: 'v0.9',
      updateDataModel: {
        surfaceId: 'tree-view-item-event',
        path: '/',
        value: {itemSelected: false},
      },
    },
  ],
};
