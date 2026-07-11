import {CATALOG_ID} from 'primer-a2ui-adapter';
import type {Fixture} from './types';

// Explicit geometry: height + width set together (one coupled dimension axis).
export const skeletonboxSizedFixture: Fixture = {
  name: 'skeletonbox-sized',
  messages: [
    {version: 'v0.9', createSurface: {surfaceId: 'skeletonbox-sized', catalogId: CATALOG_ID}},
    {
      version: 'v0.9',
      updateComponents: {
        surfaceId: 'skeletonbox-sized',
        components: [{id: 'root', component: 'SkeletonBox', height: '80px', width: '200px'}],
      },
    },
  ],
};
