import {CATALOG_ID} from 'primer-a2ui-adapter';
import type {Fixture} from './types';

export const linkMutedFixture: Fixture = {
  name: 'link-muted',
  messages: [
    {version: 'v0.9', createSurface: {surfaceId: 'link-muted', catalogId: CATALOG_ID}},
    {
      version: 'v0.9',
      updateComponents: {
        surfaceId: 'link-muted',
        components: [
          {
            id: 'root',
            component: 'Link',
            text: 'Muted link',
            href: 'https://github.com',
            muted: true,
          },
        ],
      },
    },
  ],
};
