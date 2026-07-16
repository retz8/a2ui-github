import {root, footerRegion, contentRegion, surface} from './pagelayout-helpers';
import type {Fixture} from './types';

/** Visual enum — Footer `divider`: one surface per scalar value (`none`, `line`). */
const DIVIDERS = ['none', 'line'] as const;

export const pagelayoutFooterDividerFixture: Fixture = {
  name: 'pagelayout-footer-divider',
  messages: DIVIDERS.flatMap(divider =>
    surface(`pagelayout-footer-divider-${divider}`, [
      root({content: 'c', footer: 'f'}),
      ...contentRegion(),
      ...footerRegion({divider}),
    ]),
  ),
};
