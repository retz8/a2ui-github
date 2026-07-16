import {root, sidebarRegion, contentRegion, surface} from './pagelayout-helpers';
import type {Fixture} from './types';

/** Visual enum — Sidebar `divider`: one surface per scalar value (`none`, `line`). */
const DIVIDERS = ['none', 'line'] as const;

export const pagelayoutSidebarDividerFixture: Fixture = {
  name: 'pagelayout-sidebar-divider',
  messages: DIVIDERS.flatMap(divider =>
    surface(`pagelayout-sidebar-divider-${divider}`, [
      root({sidebar: 's', content: 'c'}),
      ...sidebarRegion({divider}),
      ...contentRegion(),
    ]),
  ),
};
