import {CATALOG_ID} from 'primer-a2ui-adapter';
import type {Fixture} from './types';

// The root's baseline: two top-level items, the first expanded and wrapping a `done` SubTree of
// two child items. Labels are `Text` leaves composed in each item's ChildList, exactly as Primer
// composes them.
export const treeViewNestedFixture: Fixture = {
  name: 'tree-view-nested',
  messages: [
    {version: 'v0.9', createSurface: {surfaceId: 'tree-view-nested', catalogId: CATALOG_ID}},
    {
      version: 'v0.9',
      updateComponents: {
        surfaceId: 'tree-view-nested',
        components: [
          {
            id: 'root',
            component: 'TreeView',
            accessibility: {label: 'Project files'},
            children: ['item-src', 'item-readme'],
          },
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
            state: 'done',
            accessibility: {label: 'src contents'},
            children: ['item-index', 'item-app'],
          },
          {id: 'item-index', component: 'TreeViewItem', children: ['label-index']},
          {id: 'label-index', component: 'Text', text: 'index.ts'},
          {id: 'item-app', component: 'TreeViewItem', children: ['label-app']},
          {id: 'label-app', component: 'Text', text: 'app.ts'},
          {
            id: 'item-readme',
            component: 'TreeViewItem',
            containIntrinsicSize: '0 2rem',
            children: ['label-readme'],
          },
          {id: 'label-readme', component: 'Text', text: 'README.md'},
        ],
      },
    },
  ],
};
