import {CATALOG_ID} from 'primer-a2ui-adapter';
import type {Fixture} from './types';

export const tokenLeadingvisualFixture: Fixture = {
  name: 'token-leadingvisual',
  messages: [
    {version: 'v0.9', createSurface: {surfaceId: 'token-leadingvisual', catalogId: CATALOG_ID}},
    {
      version: 'v0.9',
      updateComponents: {
        surfaceId: 'token-leadingvisual',
        components: [
          {id: 'root', component: 'Token', text: 'With icon', leadingVisual: 'glyph'},
          {id: 'glyph', component: 'Icon', name: 'tag'},
        ],
      },
    },
  ],
};
