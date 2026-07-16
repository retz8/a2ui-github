import {CATALOG_ID} from 'primer-a2ui-adapter';
import type {Fixture} from './types';

/** Isolates the inactive item state (`inactiveText`), inside a realistic NavList. */
export const navlistItemInactiveFixture: Fixture = {
  name: 'navlist-item-inactive',
  messages: [
    {version: 'v0.9', createSurface: {surfaceId: 'navlist-item-inactive', catalogId: CATALOG_ID}},
    {
      version: 'v0.9',
      updateComponents: {
        surfaceId: 'navlist-item-inactive',
        components: [
          {id: 'root', component: 'NavList', 'aria-label': 'Repository', children: ['it']},
          {
            id: 'it',
            component: 'NavList.Item',
            href: '#',
            inactiveText: 'Available once the repository is initialized',
            children: ['it-lv', 'it-label'],
          },
          {id: 'it-lv', component: 'NavList.LeadingVisual', children: ['it-icon']},
          {id: 'it-icon', component: 'Icon', name: 'gear'},
          {id: 'it-label', component: 'Text', text: 'Draft settings'},
        ],
      },
    },
  ],
};
