import {CATALOG_ID} from 'primer-a2ui-adapter';
import type {Fixture} from './types';

// The ErrorDialog, composed as Item > SubTree(error) > [ErrorDialog], mirroring how Primer surfaces
// it. The dialog body Text is bound to `/retryMessage` (agent-coupling) so the server's retry write
// is visible; `retryAction` dispatches a `retry-subtree` event, `dismissAction` runs consoleLog.
export const treeViewErrorDialogFixture: Fixture = {
  name: 'tree-view-error-dialog',
  messages: [
    {version: 'v0.9', createSurface: {surfaceId: 'tree-view-error-dialog', catalogId: CATALOG_ID}},
    {
      version: 'v0.9',
      updateComponents: {
        surfaceId: 'tree-view-error-dialog',
        components: [
          {id: 'root', component: 'TreeView', children: ['item-src']},
          {
            id: 'item-src',
            component: 'TreeViewItem',
            expanded: true,
            children: ['label-src', 'subtree-src'],
          },
          {id: 'label-src', component: 'Text', text: 'src'},
          {
            id: 'subtree-src',
            component: 'TreeViewSubTree',
            state: 'error',
            children: ['error-dialog'],
          },
          {
            id: 'error-dialog',
            component: 'TreeViewErrorDialog',
            title: 'Failed to load',
            retryAction: {event: {name: 'retry-subtree', context: {}}},
            dismissAction: {
              functionCall: {call: 'consoleLog', args: {message: 'dismissed'}, returnType: 'void'},
            },
            children: ['dialog-body'],
          },
          {id: 'dialog-body', component: 'Text', text: {path: '/retryMessage'}},
        ],
      },
    },
    {
      version: 'v0.9',
      updateDataModel: {
        surfaceId: 'tree-view-error-dialog',
        path: '/',
        value: {retryMessage: 'Could not load the folder'},
      },
    },
  ],
};
