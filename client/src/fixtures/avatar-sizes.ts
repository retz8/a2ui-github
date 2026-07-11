import {CATALOG_ID} from 'primer-a2ui-adapter';
import type {A2uiMessage} from '@a2ui/web_core/v0_9';
import type {Fixture} from './types';
import {AVATAR_PLACEHOLDER_SRC} from './avatar-placeholder';

// The documented avatar-size scale on a single canned image; size is the only differing axis.
const SIZES = [16, 20, 24, 28, 32, 40, 48, 64] as const;

function sizeSurface(size: (typeof SIZES)[number]): A2uiMessage[] {
  const surfaceId = `avatar-size-${size}`;
  return [
    {version: 'v0.9', createSurface: {surfaceId, catalogId: CATALOG_ID}},
    {
      version: 'v0.9',
      updateComponents: {
        surfaceId,
        components: [
          {
            id: 'root',
            component: 'Avatar',
            src: AVATAR_PLACEHOLDER_SRC,
            alt: `${size}px avatar`,
            size,
          },
        ],
      },
    },
  ];
}

export const avatarSizesFixture: Fixture = {
  name: 'avatar-sizes',
  messages: SIZES.flatMap(sizeSurface),
};
