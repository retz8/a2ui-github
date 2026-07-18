import {CATALOG_ID} from 'primer-a2ui-adapter';
import type {Fixture} from './types';

// The Actions positioned wrapper: one item with a git-commit badge, a `Text` body, and an `Actions`
// slot holding a `Button`. The button's own action surface is a local `consoleLog` functionCall —
// `Actions` itself carries no action.
export const timelineActionsFixture: Fixture = {
  name: 'timeline-actions',
  messages: [
    {version: 'v0.9', createSurface: {surfaceId: 'timeline-actions', catalogId: CATALOG_ID}},
    {
      version: 'v0.9',
      updateComponents: {
        surfaceId: 'timeline-actions',
        components: [
          {id: 'root', component: 'Timeline', children: ['item-1']},
          {id: 'item-1', component: 'TimelineItem', children: ['badge-1', 'body-1', 'actions-1']},
          {id: 'badge-1', component: 'TimelineBadge', child: 'icon-1'},
          {id: 'icon-1', component: 'Icon', name: 'git-commit'},
          {id: 'body-1', component: 'TimelineBody', children: ['text-1']},
          {id: 'text-1', component: 'Text', text: 'This is a message'},
          {id: 'actions-1', component: 'TimelineActions', children: ['revert']},
          {
            id: 'revert',
            component: 'Button',
            child: 'revert-label',
            action: {
              functionCall: {
                call: 'consoleLog',
                args: {message: 'revert clicked'},
                returnType: 'void',
              },
            },
          },
          {id: 'revert-label', component: 'Text', text: 'Revert'},
        ],
      },
    },
  ],
};
