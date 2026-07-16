import {CATALOG_ID} from 'primer-a2ui-adapter';
import type {Fixture} from './types';

// The Item's `secondaryActions`: a structured array of inline trailing icon-buttons — a Rename
// (functionCall) with a pencil icon and a Delete (event, count 3) with a trash icon. The item's
// `current` is bound to `/rowDeleted` (agent-coupling) so the Delete server write is visible.
export const treeViewItemSecondaryActionsFixture: Fixture = {
  name: 'tree-view-item-secondary-actions',
  messages: [
    {
      version: 'v0.9',
      createSurface: {surfaceId: 'tree-view-item-secondary-actions', catalogId: CATALOG_ID},
    },
    {
      version: 'v0.9',
      updateComponents: {
        surfaceId: 'tree-view-item-secondary-actions',
        components: [
          {id: 'root', component: 'TreeView', children: ['item-src']},
          {
            id: 'item-src',
            component: 'TreeViewItem',
            current: {path: '/rowDeleted'},
            secondaryActions: [
              {
                label: 'Rename',
                icon: 'icon-pencil',
                action: {
                  functionCall: {call: 'consoleLog', args: {message: 'rename'}, returnType: 'void'},
                },
              },
              {
                label: 'Delete',
                icon: 'icon-trash',
                count: '3',
                action: {event: {name: 'delete', context: {}}},
              },
            ],
            children: ['label-src'],
          },
          {id: 'label-src', component: 'Text', text: 'src'},
          {id: 'icon-pencil', component: 'Icon', name: 'pencil'},
          {id: 'icon-trash', component: 'Icon', name: 'trash'},
        ],
      },
    },
    {
      version: 'v0.9',
      updateDataModel: {
        surfaceId: 'tree-view-item-secondary-actions',
        path: '/',
        value: {rowDeleted: false},
      },
    },
  ],
};
