import {CATALOG_ID} from 'primer-a2ui-adapter';
import type {Fixture} from './types';

export const iconbuttonLoadingFixture: Fixture = {
  name: 'iconbutton-loading',
  messages: [
    {version: 'v0.9', createSurface: {surfaceId: 'iconbutton-loading', catalogId: CATALOG_ID}},
    {
      version: 'v0.9',
      updateComponents: {
        surfaceId: 'iconbutton-loading',
        components: [
          {
            id: 'root',
            component: 'IconButton',
            icon: 'glyph',
            loading: true,
            loadingAnnouncement: 'Syncing…',
            accessibility: {label: 'Sync'},
            action: {event: {name: 'noop', context: {}}},
          },
          {id: 'glyph', component: 'Icon', name: 'sync'},
        ],
      },
    },
  ],
};
