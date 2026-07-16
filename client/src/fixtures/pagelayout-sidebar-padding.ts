import {root, sidebarRegion, contentRegion, surface} from './pagelayout-helpers';
import type {Fixture} from './types';

/** Visual enum — Sidebar `padding`: one surface per value (padding inside the sidebar). */
const PADDINGS = ['none', 'condensed', 'normal'] as const;

export const pagelayoutSidebarPaddingFixture: Fixture = {
  name: 'pagelayout-sidebar-padding',
  messages: PADDINGS.flatMap(padding =>
    surface(`pagelayout-sidebar-padding-${padding}`, [
      root({sidebar: 's', content: 'c'}),
      ...sidebarRegion({padding}),
      ...contentRegion(),
    ]),
  ),
};
