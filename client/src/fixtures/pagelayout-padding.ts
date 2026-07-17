import {root, headerRegion, contentRegion, surface} from './pagelayout-helpers';
import type {Fixture} from './types';

/** Visual enum — root `padding`: one surface per value (spacing between the container and viewport). */
const PADDINGS = ['none', 'condensed', 'normal'] as const;

export const pagelayoutPaddingFixture: Fixture = {
  name: 'pagelayout-padding',
  messages: PADDINGS.flatMap(padding =>
    surface(`pagelayout-padding-${padding}`, [
      root({header: 'h', content: 'c'}, {padding}),
      ...headerRegion(),
      ...contentRegion(),
    ]),
  ),
};
