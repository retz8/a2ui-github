import {CATALOG_ID} from 'primer-a2ui-adapter';
import type {Fixture} from './types';

// The Break leaf between entry groups: two items, a `Break`, then two more items (the doc's
// "with a break" shape). Each item is a git-commit badge plus a `Text` message.
export const timelineBreakFixture: Fixture = {
  name: 'timeline-break',
  messages: [
    {version: 'v0.9', createSurface: {surfaceId: 'timeline-break', catalogId: CATALOG_ID}},
    {
      version: 'v0.9',
      updateComponents: {
        surfaceId: 'timeline-break',
        components: [
          {
            id: 'root',
            component: 'Timeline',
            children: ['item-1', 'item-2', 'break', 'item-3', 'item-4'],
          },
          {id: 'item-1', component: 'TimelineItem', children: ['badge-1', 'body-1']},
          {id: 'badge-1', component: 'TimelineBadge', child: 'icon-1'},
          {id: 'icon-1', component: 'Icon', name: 'git-commit'},
          {id: 'body-1', component: 'TimelineBody', children: ['text-1']},
          {id: 'text-1', component: 'Text', text: 'This is a message'},
          {id: 'item-2', component: 'TimelineItem', children: ['badge-2', 'body-2']},
          {id: 'badge-2', component: 'TimelineBadge', child: 'icon-2'},
          {id: 'icon-2', component: 'Icon', name: 'git-commit'},
          {id: 'body-2', component: 'TimelineBody', children: ['text-2']},
          {id: 'text-2', component: 'Text', text: 'This is a message'},
          {id: 'break', component: 'TimelineBreak'},
          {id: 'item-3', component: 'TimelineItem', children: ['badge-3', 'body-3']},
          {id: 'badge-3', component: 'TimelineBadge', child: 'icon-3'},
          {id: 'icon-3', component: 'Icon', name: 'git-commit'},
          {id: 'body-3', component: 'TimelineBody', children: ['text-3']},
          {id: 'text-3', component: 'Text', text: 'This is a message'},
          {id: 'item-4', component: 'TimelineItem', children: ['badge-4', 'body-4']},
          {id: 'badge-4', component: 'TimelineBadge', child: 'icon-4'},
          {id: 'icon-4', component: 'Icon', name: 'git-commit'},
          {id: 'body-4', component: 'TimelineBody', children: ['text-4']},
          {id: 'text-4', component: 'Text', text: 'This is a message'},
        ],
      },
    },
  ],
};
