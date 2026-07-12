import {CATALOG_ID} from 'primer-a2ui-adapter';
import type {Fixture} from './types';

/**
 * The tooltip cluster (`description`, `keybindingHint`, `tooltipDirection`) — all config that
 * manifests only inside the hover tooltip, invisible in a static baseline, so it is covered by
 * render-test assertions rather than a PNG. When `description` is set, the accessibility label
 * names the button and the description populates the tooltip.
 */
export const iconbuttonTooltipFixture: Fixture = {
  name: 'iconbutton-tooltip',
  messages: [
    {version: 'v0.9', createSurface: {surfaceId: 'iconbutton-tooltip', catalogId: CATALOG_ID}},
    {
      version: 'v0.9',
      updateComponents: {
        surfaceId: 'iconbutton-tooltip',
        components: [
          {
            id: 'root',
            component: 'IconButton',
            icon: 'glyph',
            accessibility: {label: 'Remove'},
            description: 'Remove this item',
            keybindingHint: 'Mod+Backspace',
            tooltipDirection: 'se',
            action: {event: {name: 'noop', context: {}}},
          },
          {id: 'glyph', component: 'Icon', name: 'trash'},
        ],
      },
    },
  ],
};
