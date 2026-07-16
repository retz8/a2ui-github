import {CATALOG_ID} from 'primer-a2ui-adapter';
import type {Fixture} from './types';

/**
 * Interaction (event path) + agent coupling. The `pin` event asks the deterministic server to
 * record the pin; it answers by writing `/pinStatus` and swapping the icon (`pin` ->
 * `check-circle-fill`, see agent/deterministic_agent/fixtures/pin.json). The icon swap is
 * self-visible; the `/pinStatus` write is visible through the sibling `status` Text's
 * `text <- /pinStatus` binding — the half that proves two-way data binding.
 *
 * The surface root (id `root`) is a `Stack` hosting `[nav, status]`. The `status` Text is the
 * agent's data-bound surface.
 */
export const navlistTrailingactionEventFixture: Fixture = {
  name: 'navlist-trailingaction-event',
  messages: [
    {
      version: 'v0.9',
      createSurface: {surfaceId: 'navlist-trailingaction-event', catalogId: CATALOG_ID},
    },
    {
      version: 'v0.9',
      updateComponents: {
        surfaceId: 'navlist-trailingaction-event',
        components: [
          {id: 'root', component: 'Stack', align: 'start', children: ['nav', 'status']},
          {id: 'nav', component: 'NavList', 'aria-label': 'Repository', children: ['it']},
          {id: 'it', component: 'NavList.Item', href: '#', children: ['it-lv', 'it-label', 'ta']},
          {id: 'it-lv', component: 'NavList.LeadingVisual', children: ['it-icon']},
          {id: 'it-icon', component: 'Icon', name: 'file'},
          {id: 'it-label', component: 'Text', text: 'README.md'},
          {
            id: 'ta',
            component: 'NavList.TrailingAction',
            icon: 'pin-icon',
            accessibility: {label: 'Pin README'},
            action: {event: {name: 'pin', context: {}}},
          },
          {id: 'pin-icon', component: 'Icon', name: 'pin'},
          {id: 'status', component: 'Text', text: {path: '/pinStatus'}},
        ],
      },
    },
    {
      version: 'v0.9',
      updateDataModel: {
        surfaceId: 'navlist-trailingaction-event',
        path: '/',
        value: {pinStatus: 'Not pinned'},
      },
    },
  ],
};
