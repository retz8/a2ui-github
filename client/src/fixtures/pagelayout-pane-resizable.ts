import {root, contentRegion, paneRegion, surface} from './pagelayout-helpers';
import type {Fixture} from './types';

/**
 * Visually-distinct state — Pane `resizable`: `resizable: true` renders a drag handle and forces a
 * `'line'` divider (Primer's behavior). The resize write-back is proven by the `currentWidth`
 * render-test assertion + live drag review.
 */
export const pagelayoutPaneResizableFixture: Fixture = {
  name: 'pagelayout-pane-resizable',
  messages: surface('pagelayout-pane-resizable', [
    root({content: 'c', pane: 'p'}),
    ...contentRegion(),
    ...paneRegion({resizable: true}),
  ]),
};
