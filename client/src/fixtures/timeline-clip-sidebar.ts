import {CATALOG_ID} from 'primer-a2ui-adapter';
import type {A2uiMessage} from '@a2ui/web_core/v0_9';
import type {Fixture} from './types';

// The root `clipSidebar` gallery: one surface per spelling of the carried union — `true`, `'start'`,
// `'end'`, and `'both'` (`true` and `'both'` render identically). Each surface is two items with a
// badge and body so the clipped ends of the connecting line are visible.
const CLIPS = [true, 'start', 'end', 'both'] as const;

function clipSurface(clip: (typeof CLIPS)[number]): A2uiMessage[] {
  const surfaceId = `timeline-clip-${clip === true ? 'true' : clip}`;
  return [
    {version: 'v0.9', createSurface: {surfaceId, catalogId: CATALOG_ID}},
    {
      version: 'v0.9',
      updateComponents: {
        surfaceId,
        components: [
          {id: 'root', component: 'Timeline', clipSidebar: clip, children: ['item-1', 'item-2']},
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
        ],
      },
    },
  ];
}

export const timelineClipSidebarFixture: Fixture = {
  name: 'timeline-clip-sidebar',
  messages: CLIPS.flatMap(clipSurface),
};
