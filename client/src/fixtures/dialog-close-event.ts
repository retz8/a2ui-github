import {CATALOG_ID} from 'primer-a2ui-adapter';
import type {Fixture} from './types';

// closeAction on the event path (agent-coupled: dialog-close), with `open` two-way bound to
// `/dialogOpen`. Dismissing (X / Escape / backdrop) closes the dialog locally, writes `/dialogOpen`
// false, and fires the `dialog-close` event; the deterministic agent replies by reopening it
// (`/dialogOpen` back to true) with the acknowledgement in `subtitle <- /closeStatus` and the body.
export const dialogCloseEventFixture: Fixture = {
  name: 'dialog-close-event',
  messages: [
    {
      version: 'v0.9',
      createSurface: {
        surfaceId: 'dialog-close-event',
        catalogId: CATALOG_ID,
      },
    },
    {
      version: 'v0.9',
      updateComponents: {
        surfaceId: 'dialog-close-event',
        components: [
          {
            id: 'root',
            component: 'Dialog',
            title: 'Notice',
            subtitle: {
              path: '/closeStatus',
            },
            open: {
              path: '/dialogOpen',
            },
            closeAction: {
              event: {
                name: 'dialog-close',
                context: {},
              },
            },
            children: ['dialog-body'],
          },
          {
            id: 'dialog-body',
            component: 'Text',
            text: 'Close this dialog using the X, Escape, or the backdrop.',
          },
        ],
      },
    },
    {
      version: 'v0.9',
      updateDataModel: {
        surfaceId: 'dialog-close-event',
        path: '/',
        value: {
          closeStatus: 'Press Esc, the X, or the backdrop to close',
          dialogOpen: true,
        },
      },
    },
  ],
};
