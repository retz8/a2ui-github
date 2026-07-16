import {CATALOG_ID} from 'primer-a2ui-adapter';
import type {Fixture} from './types';

/** The TrailingAction loading state, inside a realistic NavList item. */
export const navlistTrailingactionLoadingFixture: Fixture = {
  name: 'navlist-trailingaction-loading',
  messages: [
    {
      version: 'v0.9',
      createSurface: {surfaceId: 'navlist-trailingaction-loading', catalogId: CATALOG_ID},
    },
    {
      version: 'v0.9',
      updateComponents: {
        surfaceId: 'navlist-trailingaction-loading',
        components: [
          {id: 'root', component: 'NavList', 'aria-label': 'Repository', children: ['it']},
          {id: 'it', component: 'NavList.Item', href: '#', children: ['it-lv', 'it-label', 'ta']},
          {id: 'it-lv', component: 'NavList.LeadingVisual', children: ['it-icon']},
          {id: 'it-icon', component: 'Icon', name: 'sync'},
          {id: 'it-label', component: 'Text', text: 'Syncing…'},
          {
            id: 'ta',
            component: 'NavList.TrailingAction',
            icon: 'sync-icon',
            accessibility: {label: 'Sync'},
            loading: true,
            action: {
              functionCall: {call: 'consoleLog', args: {message: 'sync'}, returnType: 'void'},
            },
          },
          {id: 'sync-icon', component: 'Icon', name: 'sync'},
        ],
      },
    },
  ],
};
