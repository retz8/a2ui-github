import {CATALOG_ID} from 'primer-a2ui-adapter';
import type {Fixture} from './types';

// `onClickOutside` on the event path (agent-coupled: popover-dismiss). An outside click fires the
// `popover-dismiss` event; the deterministic agent acknowledges and keeps the popover open,
// writing `/dismissNote` (visible through `Text#popover-message` `text ← /dismissNote`) and
// swapping the heading. Baselined `open: true` + `relative: true`.
export const contentClickoutsideEventFixture: Fixture = {
  name: 'content-clickoutside-event',
  messages: [
    {
      version: 'v0.9',
      createSurface: {surfaceId: 'content-clickoutside-event', catalogId: CATALOG_ID},
    },
    {
      version: 'v0.9',
      updateComponents: {
        surfaceId: 'content-clickoutside-event',
        components: [
          {
            id: 'root',
            component: 'Popover',
            open: true,
            relative: true,
            children: ['popover-content'],
          },
          {
            id: 'popover-content',
            component: 'PopoverContent',
            onClickOutside: {event: {name: 'popover-dismiss', context: {}}},
            children: ['popover-heading', 'popover-message'],
          },
          {id: 'popover-heading', component: 'Heading', text: 'Popover'},
          {id: 'popover-message', component: 'Text', text: {path: '/dismissNote'}},
        ],
      },
    },
    {
      version: 'v0.9',
      updateDataModel: {
        surfaceId: 'content-clickoutside-event',
        path: '/',
        value: {dismissNote: 'Click outside to dismiss'},
      },
    },
  ],
};
