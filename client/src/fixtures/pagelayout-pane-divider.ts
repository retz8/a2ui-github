import {root, contentRegion, paneRegion, surface} from './pagelayout-helpers';
import type {Fixture} from './types';

/** Visual enum — Pane `divider`: one surface per scalar value (`none`, `line`). */
const DIVIDERS = ['none', 'line'] as const;

export const pagelayoutPaneDividerFixture: Fixture = {
  name: 'pagelayout-pane-divider',
  messages: DIVIDERS.flatMap(divider =>
    surface(`pagelayout-pane-divider-${divider}`, [
      root({content: 'c', pane: 'p'}),
      ...contentRegion(),
      ...paneRegion({divider}),
    ]),
  ),
};
