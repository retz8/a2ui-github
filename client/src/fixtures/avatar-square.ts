import {CATALOG_ID} from 'primer-a2ui-adapter';
import type {Fixture} from './types';
import {AVATAR_PLACEHOLDER_SRC} from './avatar-placeholder';

export const avatarSquareFixture: Fixture = {
  name: 'avatar-square',
  messages: [
    {version: 'v0.9', createSurface: {surfaceId: 'avatar-square', catalogId: CATALOG_ID}},
    {
      version: 'v0.9',
      updateComponents: {
        surfaceId: 'avatar-square',
        components: [
          {
            id: 'root',
            component: 'Avatar',
            src: AVATAR_PLACEHOLDER_SRC,
            alt: 'Square avatar',
            square: true,
          },
        ],
      },
    },
  ],
};
