import {root, sidebarRegion, contentRegion, surface} from './pagelayout-helpers';
import type {Fixture} from './types';

/**
 * Visually-distinct state — Sidebar `resizable`: `resizable: true` renders a drag handle. The resize
 * write-back is proven by the `currentWidth` render-test assertion + live drag review.
 */
export const pagelayoutSidebarResizableFixture: Fixture = {
  name: 'pagelayout-sidebar-resizable',
  messages: surface('pagelayout-sidebar-resizable', [
    root({sidebar: 's', content: 'c'}),
    ...sidebarRegion({resizable: true}),
    ...contentRegion(),
  ]),
};
