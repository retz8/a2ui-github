import {CATALOG_ID} from 'primer-a2ui-adapter';
import type {Fixture} from './types';

// The root's baseline and the family's shared composition backdrop: three items, each a
// `Badge` (a git-commit `Icon`) on the line plus a `Body` (a `Text` message), exactly as
// Primer composes them. Root defaults (no clipSidebar).
export const timelineDefaultFixture: Fixture = {
  name: 'timeline-default',
  messages: [
    {version: 'v0.9', createSurface: {surfaceId: 'timeline-default', catalogId: CATALOG_ID}},
    {
      version: 'v0.9',
      updateComponents: {
        surfaceId: 'timeline-default',
        components: [
          {id: 'root', component: 'Timeline', children: ['item-1', 'item-2', 'item-3']},
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
          {id: 'item-3', component: 'TimelineItem', children: ['badge-3', 'body-3']},
          {id: 'badge-3', component: 'TimelineBadge', child: 'icon-3'},
          {id: 'icon-3', component: 'Icon', name: 'git-commit'},
          {id: 'body-3', component: 'TimelineBody', children: ['text-3']},
          {id: 'text-3', component: 'Text', text: 'This is a message'},
        ],
      },
    },
  ],
};
