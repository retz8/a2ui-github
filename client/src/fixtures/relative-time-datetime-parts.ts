import {CATALOG_ID} from 'primer-a2ui-adapter';
import type {Fixture} from './types';

// Coupled: the eight Intl.DateTimeFormat part props jointly compose one absolute-date shape.
// With `format: datetime` and a fixed ISO string the render is stable (a fixed time zone is
// pinned in playwright.config.ts so the hour/time-zone parts do not drift by runner locale).
export const relativeTimeDatetimePartsFixture: Fixture = {
  name: 'relative-time-datetime-parts',
  messages: [
    {
      version: 'v0.9',
      createSurface: {surfaceId: 'relative-time-datetime-parts', catalogId: CATALOG_ID},
    },
    {
      version: 'v0.9',
      updateComponents: {
        surfaceId: 'relative-time-datetime-parts',
        components: [
          {
            id: 'root',
            component: 'RelativeTime',
            datetime: '2025-01-01T12:00:00Z',
            format: 'datetime',
            weekday: 'long',
            month: 'long',
            day: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            timeZoneName: 'short',
          },
        ],
      },
    },
  ],
};
