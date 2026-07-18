import {CATALOG_ID} from 'primer-a2ui-adapter';
import type {A2uiMessage} from '@a2ui/web_core/v0_9';
import type {Fixture} from './types';

// The 6-value width enum on Popover.Content; each surface is otherwise the base popover.
const WIDTHS = ['xsmall', 'small', 'medium', 'large', 'xlarge', 'auto'] as const;

function widthSurface(width: (typeof WIDTHS)[number]): A2uiMessage[] {
  const surfaceId = `content-width-${width}`;
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
            width,
            children: ['popover-heading', 'popover-message'],
          },
          {id: 'popover-heading', component: 'Heading', text: `width: ${width}`},
          {id: 'popover-message', component: 'Text', text: 'Click outside to dismiss'},
        ],
      },
    },
  ];
}

export const contentWidthFixture: Fixture = {
  name: 'content-width',
  messages: WIDTHS.flatMap(widthSurface),
};
