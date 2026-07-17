import {root, footerRegion, contentRegion, surface} from './pagelayout-helpers';
import type {Fixture} from './types';

/** Visual enum — Footer `padding`: one surface per value; footer (`Text`) + filler content. */
const PADDINGS = ['none', 'condensed', 'normal'] as const;

export const pagelayoutFooterPaddingFixture: Fixture = {
  name: 'pagelayout-footer-padding',
  messages: PADDINGS.flatMap(padding =>
    surface(`pagelayout-footer-padding-${padding}`, [
      root({content: 'c', footer: 'f'}),
      ...contentRegion(),
      ...footerRegion({padding}),
    ]),
  ),
};
