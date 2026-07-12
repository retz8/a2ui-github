import {CATALOG_ID} from 'primer-a2ui-adapter';
import type {Fixture} from './types';

export const iconbuttonBlockFixture: Fixture = {
  name: 'iconbutton-block',
  messages: [
    {version: 'v0.9', createSurface: {surfaceId: 'iconbutton-block', catalogId: CATALOG_ID}},
    {
      version: 'v0.9',
      updateComponents: {
        surfaceId: 'iconbutton-block',
        components: [
          {
            id: 'root',
            component: 'IconButton',
            icon: 'glyph',
            block: true,
            accessibility: {label: 'Add'},
            action: {event: {name: 'noop', context: {}}},
          },
          {id: 'glyph', component: 'Icon', name: 'plus'},
        ],
      },
    },
  ],
};
