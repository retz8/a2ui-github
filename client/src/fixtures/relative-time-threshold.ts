import {CATALOG_ID} from 'primer-a2ui-adapter';
import type {Fixture} from './types';

// A raised `threshold` of P1Y keeps a coarse now−60-days instant rendering as relative
// ("2 months ago"), where the default P30D threshold would have flipped it to an absolute date.
const sixtyDaysAgo = new Date(Date.now() - 60 * 24 * 60 * 60 * 1000).toISOString();

export const relativeTimeThresholdFixture: Fixture = {
  name: 'relative-time-threshold',
  messages: [
    {version: 'v0.9', createSurface: {surfaceId: 'relative-time-threshold', catalogId: CATALOG_ID}},
    {
      version: 'v0.9',
      updateComponents: {
        surfaceId: 'relative-time-threshold',
        components: [
          {
            id: 'root',
            component: 'RelativeTime',
            datetime: sixtyDaysAgo,
            threshold: 'P1Y',
          },
        ],
      },
    },
  ],
};
