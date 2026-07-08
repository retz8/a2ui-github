import {CATALOG_ID} from 'primer-a2ui-adapter';
import type {Fixture} from './types';

// Coarse offset computed at module load: three days before now renders "3 days ago" at any run
// time. The offset is coarse (days) and far from a unit boundary, so the text cannot tick
// between runs — keeping the visual baseline deterministic.
const threeDaysAgo = new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString();

export const relativeTimeFixture: Fixture = {
  name: 'relative-time',
  messages: [
    {version: 'v0.9', createSurface: {surfaceId: 'relative-time', catalogId: CATALOG_ID}},
    {
      version: 'v0.9',
      updateComponents: {
        surfaceId: 'relative-time',
        components: [{id: 'root', component: 'RelativeTime', datetime: threeDaysAgo}],
      },
    },
  ],
};
