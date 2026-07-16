import {root, sidebarRegion, contentRegion, surface} from './pagelayout-helpers';
import type {Fixture} from './types';

/** Visual enum — Sidebar `position`: one surface per side (`start`, `end`); sidebar + content. */
const POSITIONS = ['start', 'end'] as const;

export const pagelayoutSidebarPositionFixture: Fixture = {
  name: 'pagelayout-sidebar-position',
  messages: POSITIONS.flatMap(position =>
    surface(`pagelayout-sidebar-position-${position}`, [
      root({sidebar: 's', content: 'c'}),
      ...sidebarRegion({position}),
      ...contentRegion(),
    ]),
  ),
};
