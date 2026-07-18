import {CATALOG_ID} from 'primer-a2ui-adapter';
import type {Fixture} from './types';

// height preset: medium.
export const anchoredOverlayHeightMediumFixture: Fixture = {
  name: 'anchored-overlay-height-medium',
  messages: [
    {
      version: 'v0.9',
      createSurface: {surfaceId: 'anchored-overlay-height-medium', catalogId: CATALOG_ID},
    },
    {
      version: 'v0.9',
      updateComponents: {
        surfaceId: 'anchored-overlay-height-medium',
        components: [
          {
            id: 'root',
            component: 'AnchoredOverlay',
            anchor: 'trigger',
            open: true,
            children: ['panel-content'],
            height: 'medium',
          },
          {
            id: 'trigger',
            component: 'Button',
            child: 'trigger-label',
            action: {
              functionCall: {
                call: 'consoleLog',
                args: {message: 'trigger (presentational — gestures handled by the overlay)'},
                returnType: 'void',
              },
            },
          },
          {id: 'trigger-label', component: 'Text', text: 'Open panel'},
          {id: 'panel-content', component: 'Text', text: 'Panel content'},
        ],
      },
    },
  ],
};
