import {CATALOG_ID} from 'primer-a2ui-adapter';
import type {Fixture} from './types';

// width preset: xxlarge.
export const anchoredOverlayWidthXxlargeFixture: Fixture = {
  name: 'anchored-overlay-width-xxlarge',
  messages: [
    {
      version: 'v0.9',
      createSurface: {surfaceId: 'anchored-overlay-width-xxlarge', catalogId: CATALOG_ID},
    },
    {
      version: 'v0.9',
      updateComponents: {
        surfaceId: 'anchored-overlay-width-xxlarge',
        components: [
          {
            id: 'root',
            component: 'AnchoredOverlay',
            anchor: 'trigger',
            open: true,
            children: ['panel-content'],
            width: 'xxlarge',
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
