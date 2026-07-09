import {CATALOG_ID} from 'primer-a2ui-adapter';
import type {A2uiMessage} from '@a2ui/web_core/v0_9';
import type {Fixture} from './types';

// The formatStyle enum, each on a `format: relative` RelativeTime at a coarse now−3-days offset,
// so the verbosity difference ("3 days ago" vs "3d") is the only variable.
const FORMAT_STYLES = ['long', 'short', 'narrow'] as const;
const threeDaysAgo = new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString();

function formatStyleSurface(formatStyle: (typeof FORMAT_STYLES)[number]): A2uiMessage[] {
  const surfaceId = `relative-time-format-style-${formatStyle}`;
  return [
    {version: 'v0.9', createSurface: {surfaceId, catalogId: CATALOG_ID}},
    {
      version: 'v0.9',
      updateComponents: {
        surfaceId,
        components: [
          {
            id: 'root',
            component: 'RelativeTime',
            datetime: threeDaysAgo,
            format: 'relative',
            formatStyle,
          },
        ],
      },
    },
  ];
}

export const relativeTimeFormatStylesFixture: Fixture = {
  name: 'relative-time-format-styles',
  messages: FORMAT_STYLES.flatMap(formatStyleSurface),
};
