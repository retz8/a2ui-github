import {CATALOG_ID} from 'primer-a2ui-adapter';
import type {A2uiMessage} from '@a2ui/web_core/v0_9';
import type {Fixture} from './types';

// The 6-value height enum on Popover.Content; each surface is otherwise the base popover.
const HEIGHTS = ['small', 'medium', 'large', 'xlarge', 'auto', 'fit-content'] as const;

function heightSurface(height: (typeof HEIGHTS)[number]): A2uiMessage[] {
  const surfaceId = `content-height-${height}`;
  return [
    {version: 'v0.9', createSurface: {surfaceId, catalogId: CATALOG_ID}},
    {
      version: 'v0.9',
      updateComponents: {
        surfaceId,
        components: [
          {
            id: 'root',
            component: 'Popover',
            open: true,
            relative: true,
            children: ['popover-content'],
          },
          {
            id: 'popover-content',
            component: 'PopoverContent',
            height,
            children: ['popover-heading', 'popover-message'],
          },
          {id: 'popover-heading', component: 'Heading', text: `height: ${height}`},
          {id: 'popover-message', component: 'Text', text: 'Click outside to dismiss'},
        ],
      },
    },
  ];
}

export const contentHeightFixture: Fixture = {
  name: 'content-height',
  messages: HEIGHTS.flatMap(heightSurface),
};
