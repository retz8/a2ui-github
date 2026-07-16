import {root, sidebarRegion, contentRegion, surface} from './pagelayout-helpers';
import type {Fixture} from './types';

/**
 * Path binding + two-way write-back: the sidebar's `currentWidth` is bound to `/sidebarWidth`
 * (initially 280) in controlled/resizable mode. A resize drag writes the new width back through the
 * binder's auto-generated setter (Primer's `onResizeEnd`); the drag itself is confirmed by live
 * review. Not visually baselined — behavior is proven in the render tests.
 */
export const pagelayoutSidebarCurrentwidthFixture: Fixture = {
  name: 'pagelayout-sidebar-currentwidth',
  messages: surface(
    'pagelayout-sidebar-currentwidth',
    [
      root({sidebar: 's', content: 'c'}),
      ...sidebarRegion({resizable: true, currentWidth: {path: '/sidebarWidth'}}),
      ...contentRegion(),
    ],
    {sidebarWidth: 280},
  ),
};
