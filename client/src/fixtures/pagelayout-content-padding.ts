import {root, headerRegion, contentRegion, surface} from './pagelayout-helpers';
import type {Fixture} from './types';

/** Visual enum — Content `padding`: one surface per value (padding inside the content region). */
const PADDINGS = ['none', 'condensed', 'normal'] as const;

export const pagelayoutContentPaddingFixture: Fixture = {
  name: 'pagelayout-content-padding',
  messages: PADDINGS.flatMap(padding =>
    surface(`pagelayout-content-padding-${padding}`, [
      root({header: 'h', content: 'c'}),
      ...headerRegion(),
      ...contentRegion({padding}),
    ]),
  ),
};
