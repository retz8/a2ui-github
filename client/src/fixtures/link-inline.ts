import {CATALOG_ID} from 'primer-a2ui-adapter';
import type {Fixture} from './types';

export const linkInlineFixture: Fixture = {
  name: 'link-inline',
  messages: [
    {version: 'v0.9', createSurface: {surfaceId: 'link-inline', catalogId: CATALOG_ID}},
    {
      version: 'v0.9',
      updateComponents: {
        surfaceId: 'link-inline',
        components: [
          {
            id: 'root',
            component: 'Link',
            text: 'Inline link',
            href: 'https://github.com',
            inline: true,
          },
        ],
      },
    },
  ],
};
