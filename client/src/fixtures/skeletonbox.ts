import {CATALOG_ID} from 'primer-a2ui-adapter';
import type {Fixture} from './types';

// Default render: all props at their defaults — 1rem tall, fills its container width.
export const skeletonboxFixture: Fixture = {
  name: 'skeletonbox',
  messages: [
    {version: 'v0.9', createSurface: {surfaceId: 'skeletonbox', catalogId: CATALOG_ID}},
    {
      version: 'v0.9',
      updateComponents: {
        surfaceId: 'skeletonbox',
        components: [{id: 'root', component: 'SkeletonBox'}],
      },
    },
  ],
};
