import {CATALOG_ID} from 'primer-a2ui-adapter';
import type {Fixture} from './types';

// onOpen/onClose on the functionCall path: opening logs 'opened', closing logs 'closed' locally.
export const anchoredOverlayActionsFnFixture: Fixture = {
  name: 'anchored-overlay-actions-fn',
  messages: [
    {
      version: 'v0.9',
      createSurface: {surfaceId: 'anchored-overlay-actions-fn', catalogId: CATALOG_ID},
    },
    {
      version: 'v0.9',
      updateComponents: {
        surfaceId: 'anchored-overlay-actions-fn',
        components: [
          {
            id: 'root',
            component: 'AnchoredOverlay',
            anchor: 'trigger',
            open: true,
            children: ['panel-content'],
            onOpen: {
              functionCall: {call: 'consoleLog', args: {message: 'opened'}, returnType: 'void'},
            },
            onClose: {
              functionCall: {call: 'consoleLog', args: {message: 'closed'}, returnType: 'void'},
            },
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
