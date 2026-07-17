import {root, contentRegion, paneRegion, surface} from './pagelayout-helpers';
import type {Fixture} from './types';

/**
 * Path binding + two-way write-back: the pane's `currentWidth` is bound to `/paneWidth` (initially
 * 320) in controlled/resizable mode. A resize drag writes the new width back through the binder's
 * auto-generated setter (Primer's `onResizeEnd`); the drag itself is confirmed by live review. Not
 * visually baselined — behavior is proven in the render tests.
 */
export const pagelayoutPaneCurrentwidthFixture: Fixture = {
  name: 'pagelayout-pane-currentwidth',
  messages: surface(
    'pagelayout-pane-currentwidth',
    [
      root({content: 'c', pane: 'p'}),
      ...contentRegion(),
      ...paneRegion({resizable: true, currentWidth: {path: '/paneWidth'}}),
    ],
    {paneWidth: 320},
  ),
};
