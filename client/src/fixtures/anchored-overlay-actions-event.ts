import {CATALOG_ID} from 'primer-a2ui-adapter';
import type {Fixture} from './types';

// onOpen/onClose on the event path (agent-coupled: panel-open / panel-close). `open` is two-way
// bound to /open (initially false). Opening the panel fires `panel-open`; the deterministic agent
// loads options into `panel-message <- /panel/message` and swaps `panel-status`, both visible in
// the open panel. Closing fires `panel-close`; the agent writes the applied state to the trigger's
// `anchor-label <- /anchor/label` — the only surface visible when the panel is closed.
export const anchoredOverlayActionsEventFixture: Fixture = {
  name: 'anchored-overlay-actions-event',
  messages: [
    {
      version: 'v0.9',
      createSurface: {surfaceId: 'anchored-overlay-actions-event', catalogId: CATALOG_ID},
    },
    {
      version: 'v0.9',
      updateComponents: {
        surfaceId: 'anchored-overlay-actions-event',
        components: [
          {
            id: 'root',
            component: 'AnchoredOverlay',
            anchor: 'trigger',
            open: {
              path: '/open',
            },
            onOpen: {
              event: {
                name: 'panel-open',
                context: {},
              },
            },
            onClose: {
              event: {
                name: 'panel-close',
                context: {},
              },
            },
            children: ['panel-message', 'panel-status'],
          },
          {
            id: 'trigger',
            component: 'Button',
            child: 'anchor-label',
            action: {
              functionCall: {
                call: 'consoleLog',
                args: {message: 'trigger (presentational — gestures handled by the overlay)'},
                returnType: 'void',
              },
            },
          },
          {
            id: 'anchor-label',
            component: 'Text',
            text: {
              path: '/anchor/label',
            },
          },
          {
            id: 'panel-message',
            component: 'Text',
            text: {
              path: '/panel/message',
            },
          },
          {id: 'panel-status', component: 'Text', text: '—'},
        ],
      },
    },
    {
      version: 'v0.9',
      updateDataModel: {
        surfaceId: 'anchored-overlay-actions-event',
        path: '/',
        value: {
          open: false,
          anchor: {label: 'Open panel'},
          panel: {message: 'Loading…'},
        },
      },
    },
  ],
};
