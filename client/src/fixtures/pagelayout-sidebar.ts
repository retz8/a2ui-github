import {root, sidebarRegion, contentRegion, surface} from './pagelayout-helpers';
import type {Fixture} from './types';

/**
 * Sidebar composition: the `sidebar` full-height region alongside the `content`. Proves the sidebar
 * `ComponentId` slot bridge (`asSlot`) distinct from the content that falls through to `rest`.
 */
export const pagelayoutSidebarFixture: Fixture = {
  name: 'pagelayout-sidebar',
  messages: surface('pagelayout-sidebar', [
    root({sidebar: 's', content: 'c'}),
    ...sidebarRegion(),
    ...contentRegion(),
  ]),
};
