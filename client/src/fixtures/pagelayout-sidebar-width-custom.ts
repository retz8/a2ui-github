import {root, sidebarRegion, contentRegion, surface} from './pagelayout-helpers';
import type {Fixture} from './types';

/** Sidebar `width` custom object: a `{min, default, max}` triple of CSS lengths. */
export const pagelayoutSidebarWidthCustomFixture: Fixture = {
  name: 'pagelayout-sidebar-width-custom',
  messages: surface('pagelayout-sidebar-width-custom', [
    root({sidebar: 's', content: 'c'}),
    ...sidebarRegion({width: {min: '200px', default: '280px', max: '360px'}}),
    ...contentRegion(),
  ]),
};
