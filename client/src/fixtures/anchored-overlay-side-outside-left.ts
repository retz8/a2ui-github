import {CATALOG_ID} from 'primer-a2ui-adapter';
import type {Fixture} from './types';

// side placement: outside-left.
export const anchoredOverlaySideOutsideLeftFixture: Fixture = {
  name: 'anchored-overlay-side-outside-left',
  messages: [
    {
      version: 'v0.9',
      createSurface: {surfaceId: 'anchored-overlay-side-outside-left', catalogId: CATALOG_ID},
    },
    {
      version: 'v0.9',
      updateComponents: {
        surfaceId: 'anchored-overlay-side-outside-left',
        components: [
          {
            id: 'root',
            component: 'AnchoredOverlay',
            anchor: 'trigger',
            open: true,
            children: ['panel-content'],
            side: 'outside-left',
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
