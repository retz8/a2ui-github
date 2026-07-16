import {root, headerRegion, contentRegion, footerRegion, surface} from './pagelayout-helpers';
import type {Fixture} from './types';

/** Visual enum — root `rowGap`: one surface per value; `header` + `content` + `footer` (vertical gaps). */
const GAPS = ['none', 'condensed', 'normal'] as const;

export const pagelayoutRowgapFixture: Fixture = {
  name: 'pagelayout-rowgap',
  messages: GAPS.flatMap(rowGap =>
    surface(`pagelayout-rowgap-${rowGap}`, [
      root({header: 'h', content: 'c', footer: 'f'}, {rowGap}),
      ...headerRegion(),
      ...contentRegion(),
      ...footerRegion(),
    ]),
  ),
};
