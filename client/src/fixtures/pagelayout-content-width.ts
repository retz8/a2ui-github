import {root, headerRegion, contentRegion, surface} from './pagelayout-helpers';
import type {Fixture} from './types';

/** Visual enum — Content `width`: one surface per value; content (`Stack` of `Text`) + header. */
const WIDTHS = ['full', 'medium', 'large', 'xlarge'] as const;

export const pagelayoutContentWidthFixture: Fixture = {
  name: 'pagelayout-content-width',
  messages: WIDTHS.flatMap(width =>
    surface(`pagelayout-content-width-${width}`, [
      root({header: 'h', content: 'c'}),
      ...headerRegion(),
      ...contentRegion({width}),
    ]),
  ),
};
