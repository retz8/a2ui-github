import {root, contentRegion, paneRegion, surface} from './pagelayout-helpers';
import type {Fixture} from './types';

/** Visual enum — Pane `width`: one surface per named size (`small`, `medium`, `large`). */
const WIDTHS = ['small', 'medium', 'large'] as const;

export const pagelayoutPaneWidthFixture: Fixture = {
  name: 'pagelayout-pane-width',
  messages: WIDTHS.flatMap(width =>
    surface(`pagelayout-pane-width-${width}`, [
      root({content: 'c', pane: 'p'}),
      ...contentRegion(),
      ...paneRegion({width}),
    ]),
  ),
};
