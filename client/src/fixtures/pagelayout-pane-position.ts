import {root, contentRegion, paneRegion, surface} from './pagelayout-helpers';
import type {Fixture} from './types';

/** Visual enum — Pane `position`: one surface per scalar side (`start`, `end`); content + pane. */
const POSITIONS = ['start', 'end'] as const;

export const pagelayoutPanePositionFixture: Fixture = {
  name: 'pagelayout-pane-position',
  messages: POSITIONS.flatMap(position =>
    surface(`pagelayout-pane-position-${position}`, [
      root({content: 'c', pane: 'p'}),
      ...contentRegion(),
      ...paneRegion({position}),
    ]),
  ),
};
