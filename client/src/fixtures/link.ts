import {CATALOG_ID} from 'primer-a2ui-adapter';
import type {Fixture} from './types';

export const linkFixture: Fixture = {
  name: 'link',
  messages: [
    {version: 'v0.9', createSurface: {surfaceId: 'link', catalogId: CATALOG_ID}},
    {
      version: 'v0.9',
      updateComponents: {
        surfaceId: 'link',
        components: [
          {id: 'root', component: 'Link', text: 'View on GitHub', href: 'https://github.com'},
        ],
      },
    },
  ],
};
