import {CATALOG_ID} from 'primer-a2ui-adapter';
import type {Fixture} from './types';

// The LeadingVisual and TrailingVisual on one item: a leading file icon and a trailing dot icon,
// each with an accessible `label`. Shared by tree-view-leadingvisual.md and tree-view-trailingvisual.md.
export const treeViewVisualsFixture: Fixture = {
  name: 'tree-view-visuals',
  messages: [
    {version: 'v0.9', createSurface: {surfaceId: 'tree-view-visuals', catalogId: CATALOG_ID}},
    {
      version: 'v0.9',
      updateComponents: {
        surfaceId: 'tree-view-visuals',
        components: [
          {id: 'root', component: 'TreeView', children: ['item-file']},
          {
            id: 'item-file',
            component: 'TreeViewItem',
            children: ['leading', 'label-file', 'trailing'],
          },
          {id: 'leading', component: 'TreeViewLeadingVisual', label: 'File', child: 'icon-file'},
          {id: 'icon-file', component: 'Icon', name: 'file'},
          {id: 'label-file', component: 'Text', text: 'index.ts'},
          {
            id: 'trailing',
            component: 'TreeViewTrailingVisual',
            label: 'Modified',
            child: 'icon-dot',
          },
          {id: 'icon-dot', component: 'Icon', name: 'dot-fill'},
        ],
      },
    },
  ],
};
