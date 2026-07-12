import {CATALOG_ID} from 'primer-a2ui-adapter';
import type {Fixture} from './types';

export const iconbuttonInactiveFixture: Fixture = {
  name: 'iconbutton-inactive',
  messages: [
    {version: 'v0.9', createSurface: {surfaceId: 'iconbutton-inactive', catalogId: CATALOG_ID}},
    {
      version: 'v0.9',
      updateComponents: {
        surfaceId: 'iconbutton-inactive',
        components: [
          {
            id: 'root',
            component: 'IconButton',
            icon: 'glyph',
            inactive: true,
            accessibility: {label: 'Locked'},
            action: {event: {name: 'noop', context: {}}},
          },
          {id: 'glyph', component: 'Icon', name: 'lock'},
        ],
      },
    },
  ],
};
