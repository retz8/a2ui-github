import {CATALOG_ID} from 'primer-a2ui-adapter';
import type {Fixture} from './types';

export const iconbuttonDisabledFixture: Fixture = {
  name: 'iconbutton-disabled',
  messages: [
    {version: 'v0.9', createSurface: {surfaceId: 'iconbutton-disabled', catalogId: CATALOG_ID}},
    {
      version: 'v0.9',
      updateComponents: {
        surfaceId: 'iconbutton-disabled',
        components: [
          {
            id: 'root',
            component: 'IconButton',
            icon: 'glyph',
            disabled: true,
            accessibility: {label: 'Delete'},
            action: {event: {name: 'noop', context: {}}},
          },
          {id: 'glyph', component: 'Icon', name: 'trash'},
        ],
      },
    },
  ],
};
