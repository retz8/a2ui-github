import {root, contentRegion, paneRegion, surface} from './pagelayout-helpers';
import type {Fixture} from './types';

/** Visual enum — root `columnGap`: one surface per value; `content` + `pane` (horizontal gap). */
const GAPS = ['none', 'condensed', 'normal'] as const;

export const pagelayoutColumngapFixture: Fixture = {
  name: 'pagelayout-columngap',
  messages: GAPS.flatMap(columnGap =>
    surface(`pagelayout-columngap-${columnGap}`, [
      root({content: 'c', pane: 'p'}, {columnGap}),
      ...contentRegion(),
      ...paneRegion(),
    ]),
  ),
};
