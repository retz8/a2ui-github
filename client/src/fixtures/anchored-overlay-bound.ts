import {CATALOG_ID} from 'primer-a2ui-adapter';
import type {Fixture} from './types';

// open bound via path binding; the data model resolves it to true (panel shown).
export const anchoredOverlayBoundFixture: Fixture = {
  name: 'anchored-overlay-bound',
  messages: [
    {
      version: 'v0.9',
      createSurface: {surfaceId: 'anchored-overlay-bound', catalogId: CATALOG_ID},
    },
    {
      version: 'v0.9',
      updateComponents: {
        surfaceId: 'anchored-overlay-bound',
        components: [
          {
            id: 'root',
            component: 'AnchoredOverlay',
            anchor: 'trigger',
            open: {
              path: '/open',
            },
            children: ['panel-content'],
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
    {
      version: 'v0.9',
      updateDataModel: {
        surfaceId: 'anchored-overlay-bound',
        path: '/',
        value: {
          open: true,
        },
      },
    },
  ],
};
