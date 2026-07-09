import {CATALOG_ID} from 'primer-a2ui-adapter';
import type {Fixture} from './types';

// `prefix` prepends text to an absolute date. With `format: datetime` and a fixed ISO string
// (absolute rendering does not depend on now), this renders "updated Jan 1, 2025 …".
export const relativeTimePrefixFixture: Fixture = {
  name: 'relative-time-prefix',
  messages: [
    {version: 'v0.9', createSurface: {surfaceId: 'relative-time-prefix', catalogId: CATALOG_ID}},
    {
      version: 'v0.9',
      updateComponents: {
        surfaceId: 'relative-time-prefix',
        components: [
          {
            id: 'root',
            component: 'RelativeTime',
            datetime: '2025-01-01T12:00:00Z',
            format: 'datetime',
            prefix: 'updated',
          },
        ],
      },
    },
  ],
};
