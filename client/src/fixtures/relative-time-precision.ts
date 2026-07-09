import {CATALOG_ID} from 'primer-a2ui-adapter';
import type {Fixture} from './types';

// Coupled: `precision` is only meaningful under `format: duration`. At a coarse now−100-days
// offset, `precision: month` renders "3 months" where the default `second` precision would spill
// into days/hours/minutes (and clock-tick between runs).
const hundredDaysAgo = new Date(Date.now() - 100 * 24 * 60 * 60 * 1000).toISOString();

export const relativeTimePrecisionFixture: Fixture = {
  name: 'relative-time-precision',
  messages: [
    {version: 'v0.9', createSurface: {surfaceId: 'relative-time-precision', catalogId: CATALOG_ID}},
    {
      version: 'v0.9',
      updateComponents: {
        surfaceId: 'relative-time-precision',
        components: [
          {
            id: 'root',
            component: 'RelativeTime',
            datetime: hundredDaysAgo,
            format: 'duration',
            precision: 'month',
          },
        ],
      },
    },
  ],
};
