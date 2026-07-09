import {CATALOG_ID} from 'primer-a2ui-adapter';
import type {A2uiMessage} from '@a2ui/web_core/v0_9';
import type {Fixture} from './types';

// The format enum on a single RelativeTime. `relative`/`duration` use a coarse now−3-days offset
// so their text stays stable; `auto`/`datetime` use a fixed ISO string (absolute rendering does
// not depend on now, and `auto` is past the default P30D threshold, so it renders absolute).
const FORMATS = ['auto', 'relative', 'duration', 'datetime'] as const;
const threeDaysAgo = new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString();
const FIXED = '2025-01-01T12:00:00Z';

function formatSurface(format: (typeof FORMATS)[number]): A2uiMessage[] {
  const surfaceId = `relative-time-format-${format}`;
  const datetime = format === 'relative' || format === 'duration' ? threeDaysAgo : FIXED;
  return [
    {version: 'v0.9', createSurface: {surfaceId, catalogId: CATALOG_ID}},
    {
      version: 'v0.9',
      updateComponents: {
        surfaceId,
        components: [{id: 'root', component: 'RelativeTime', datetime, format}],
      },
    },
  ];
}

export const relativeTimeFormatsFixture: Fixture = {
  name: 'relative-time-formats',
  messages: FORMATS.flatMap(formatSurface),
};
