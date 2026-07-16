import {root, sidebarRegion, contentRegion, surface} from './pagelayout-helpers';
import type {Fixture} from './types';

/** Visual enum — Sidebar `width`: one surface per named size (`small`, `medium`, `large`). */
const WIDTHS = ['small', 'medium', 'large'] as const;

export const pagelayoutSidebarWidthFixture: Fixture = {
  name: 'pagelayout-sidebar-width',
  messages: WIDTHS.flatMap(width =>
    surface(`pagelayout-sidebar-width-${width}`, [
      root({sidebar: 's', content: 'c'}),
      ...sidebarRegion({width}),
      ...contentRegion(),
    ]),
  ),
};
