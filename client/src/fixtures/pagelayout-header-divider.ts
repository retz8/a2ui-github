import {root, headerRegion, contentRegion, surface} from './pagelayout-helpers';
import type {Fixture} from './types';

/** Visual enum — Header `divider`: one surface per scalar value (`none`, `line`). */
const DIVIDERS = ['none', 'line'] as const;

export const pagelayoutHeaderDividerFixture: Fixture = {
  name: 'pagelayout-header-divider',
  messages: DIVIDERS.flatMap(divider =>
    surface(`pagelayout-header-divider-${divider}`, [
      root({header: 'h', content: 'c'}),
      ...headerRegion({divider}),
      ...contentRegion(),
    ]),
  ),
};
