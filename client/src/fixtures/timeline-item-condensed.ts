import {CATALOG_ID} from 'primer-a2ui-adapter';
import type {Fixture} from './types';

// The Item `condensed` state: three items all `condensed: true` (reduced vertical padding, no badge
// background), each a git-commit badge plus a `Text` message — the doc's condensed example.
export const timelineItemCondensedFixture: Fixture = {
  name: 'timeline-item-condensed',
  messages: [
    {version: 'v0.9', createSurface: {surfaceId: 'timeline-item-condensed', catalogId: CATALOG_ID}},
    {
      version: 'v0.9',
      updateComponents: {
        surfaceId: 'timeline-item-condensed',
        components: [
          {id: 'root', component: 'Timeline', children: ['item-1', 'item-2', 'item-3']},
          {
            id: 'item-1',
            component: 'TimelineItem',
            condensed: true,
            children: ['badge-1', 'body-1'],
          },
          {id: 'badge-1', component: 'TimelineBadge', child: 'icon-1'},
          {id: 'icon-1', component: 'Icon', name: 'git-commit'},
          {id: 'body-1', component: 'TimelineBody', children: ['text-1']},
          {id: 'text-1', component: 'Text', text: 'This is a message'},
          {
            id: 'item-2',
            component: 'TimelineItem',
            condensed: true,
            children: ['badge-2', 'body-2'],
          },
          {id: 'badge-2', component: 'TimelineBadge', child: 'icon-2'},
          {id: 'icon-2', component: 'Icon', name: 'git-commit'},
          {id: 'body-2', component: 'TimelineBody', children: ['text-2']},
          {id: 'text-2', component: 'Text', text: 'This is a message'},
          {
            id: 'item-3',
            component: 'TimelineItem',
            condensed: true,
            children: ['badge-3', 'body-3'],
          },
          {id: 'badge-3', component: 'TimelineBadge', child: 'icon-3'},
          {id: 'icon-3', component: 'Icon', name: 'git-commit'},
          {id: 'body-3', component: 'TimelineBody', children: ['text-3']},
          {id: 'text-3', component: 'Text', text: 'This is a message'},
        ],
      },
    },
  ],
};
