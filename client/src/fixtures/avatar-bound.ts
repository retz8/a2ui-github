import {CATALOG_ID} from 'primer-a2ui-adapter';
import type {Fixture} from './types';
import {AVATAR_PLACEHOLDER_SRC} from './avatar-placeholder';

export const avatarBoundFixture: Fixture = {
  name: 'avatar-bound',
  messages: [
    {version: 'v0.9', createSurface: {surfaceId: 'avatar-bound', catalogId: CATALOG_ID}},
    {
      version: 'v0.9',
      updateComponents: {
        surfaceId: 'avatar-bound',
        components: [
          {id: 'root', component: 'Avatar', src: {path: '/avatarUrl'}, alt: 'Bound avatar'},
        ],
      },
    },
    {
      version: 'v0.9',
      updateDataModel: {
        surfaceId: 'avatar-bound',
        path: '/',
        value: {avatarUrl: AVATAR_PLACEHOLDER_SRC},
      },
    },
  ],
};
