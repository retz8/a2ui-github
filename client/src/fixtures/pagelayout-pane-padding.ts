import {root, contentRegion, paneRegion, surface} from './pagelayout-helpers';
import type {Fixture} from './types';

/** Visual enum — Pane `padding`: one surface per value (padding inside the pane). */
const PADDINGS = ['none', 'condensed', 'normal'] as const;

export const pagelayoutPanePaddingFixture: Fixture = {
  name: 'pagelayout-pane-padding',
  messages: PADDINGS.flatMap(padding =>
    surface(`pagelayout-pane-padding-${padding}`, [
      root({content: 'c', pane: 'p'}),
      ...contentRegion(),
      ...paneRegion({padding}),
    ]),
  ),
};
