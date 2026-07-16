import {CATALOG_ID} from 'primer-a2ui-adapter';
import type {A2uiMessage} from '@a2ui/web_core/v0_9';
import type {Fixture} from './types';

// The preset DirectoryIcon inside a LeadingVisual: two surfaces show the same directory item
// expanded (open folder) and collapsed (closed folder) — the open/closed transition is the whole
// behavior of this leaf.
function directorySurface(expanded: boolean): A2uiMessage[] {
  const surfaceId = `tree-view-directory-icon-${expanded ? 'open' : 'closed'}`;
  return [
    {version: 'v0.9', createSurface: {surfaceId, catalogId: CATALOG_ID}},
    {
      version: 'v0.9',
      updateComponents: {
        surfaceId,
        components: [
          {id: 'root', component: 'TreeView', children: ['item-dir']},
          {
            id: 'item-dir',
            component: 'TreeViewItem',
            expanded,
            children: ['leading', 'label-dir', 'subtree-dir'],
          },
          {id: 'leading', component: 'TreeViewLeadingVisual', child: 'dir-icon'},
          {id: 'dir-icon', component: 'TreeViewDirectoryIcon'},
          {id: 'label-dir', component: 'Text', text: 'src'},
          {
            id: 'subtree-dir',
            component: 'TreeViewSubTree',
            state: 'done',
            children: ['item-child'],
          },
          {id: 'item-child', component: 'TreeViewItem', children: ['label-child']},
          {id: 'label-child', component: 'Text', text: 'index.ts'},
        ],
      },
    },
  ];
}

export const treeViewDirectoryIconFixture: Fixture = {
  name: 'tree-view-directory-icon',
  messages: [...directorySurface(true), ...directorySurface(false)],
};
