import {CATALOG_ID} from 'primer-a2ui-adapter';
import type {Fixture} from './types';
import {AVATAR_PLACEHOLDER_SRC} from './avatar-placeholder';

// The Avatar wrapper beside the badge: one item with an `Avatar` (an `Avatar` leaf identifying the
// actor), a git-commit badge, and a `Text` body. Primer's `Timeline.Avatar` lives in a fixed left
// gutter (absolute `left: -72px`), so the item is nested inside a `PageLayout` > `Content` > `Stack`
// that insets it far enough for the avatar to clear the surface edge.
export const timelineAvatarFixture: Fixture = {
  name: 'timeline-avatar',
  messages: [
    {version: 'v0.9', createSurface: {surfaceId: 'timeline-avatar', catalogId: CATALOG_ID}},
    {
      version: 'v0.9',
      updateComponents: {
        surfaceId: 'timeline-avatar',
        components: [
          {id: 'root', component: 'PageLayout', padding: 'normal', content: 'content'},
          {id: 'content', component: 'PageLayout.Content', padding: 'normal', children: ['gutter']},
          {id: 'gutter', component: 'Stack', paddingInline: 'spacious', children: ['tl']},
          {id: 'tl', component: 'Timeline', children: ['item-1']},
          {id: 'item-1', component: 'TimelineItem', children: ['avatar-1', 'badge-1', 'body-1']},
          {id: 'avatar-1', component: 'TimelineAvatar', child: 'octocat'},
          {id: 'octocat', component: 'Avatar', src: AVATAR_PLACEHOLDER_SRC, alt: 'Octocat'},
          {id: 'badge-1', component: 'TimelineBadge', child: 'icon-1'},
          {id: 'icon-1', component: 'Icon', name: 'git-commit'},
          {id: 'body-1', component: 'TimelineBody', children: ['text-1']},
          {id: 'text-1', component: 'Text', text: 'This is a message'},
        ],
      },
    },
  ],
};
