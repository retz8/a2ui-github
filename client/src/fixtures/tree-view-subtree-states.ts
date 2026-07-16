import {CATALOG_ID} from 'primer-a2ui-adapter';
import type {A2uiMessage} from '@a2ui/web_core/v0_9';
import type {Fixture} from './types';

// The SubTree `state` gallery: one surface per visually-distinct load state — `done` (children
// visible), `loading` (a 3-row skeleton, exercising `count`), and `error` (the error affordance).
// `initial` is omitted as visually redundant with a collapsed item. Each subtree is composed inside
// an expanded item so its contents are revealed.
const STATES = ['done', 'loading', 'error'] as const;

function stateSurface(state: (typeof STATES)[number]): A2uiMessage[] {
  const surfaceId = `tree-view-subtree-${state}`;
  return [
    {version: 'v0.9', createSurface: {surfaceId, catalogId: CATALOG_ID}},
    {
      version: 'v0.9',
      updateComponents: {
        surfaceId,
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
            state,
            count: 3,
            children: ['item-child'],
          },
          {id: 'item-child', component: 'TreeViewItem', children: ['label-child']},
          {id: 'label-child', component: 'Text', text: 'index.ts'},
        ],
      },
    },
  ];
}

export const treeViewSubtreeStatesFixture: Fixture = {
  name: 'tree-view-subtree-states',
  messages: STATES.flatMap(stateSurface),
};
