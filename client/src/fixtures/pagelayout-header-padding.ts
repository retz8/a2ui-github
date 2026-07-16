import {root, headerRegion, contentRegion, surface} from './pagelayout-helpers';
import type {Fixture} from './types';

/** Visual enum — Header `padding`: one surface per value; header (`Heading`) + filler content. */
const PADDINGS = ['none', 'condensed', 'normal'] as const;

export const pagelayoutHeaderPaddingFixture: Fixture = {
  name: 'pagelayout-header-padding',
  messages: PADDINGS.flatMap(padding =>
    surface(`pagelayout-header-padding-${padding}`, [
      root({header: 'h', content: 'c'}),
      ...headerRegion({padding}),
      ...contentRegion(),
    ]),
  ),
};
