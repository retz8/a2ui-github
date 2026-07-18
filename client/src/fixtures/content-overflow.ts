import {CATALOG_ID} from 'primer-a2ui-adapter';
import type {A2uiMessage} from '@a2ui/web_core/v0_9';
import type {Fixture} from './types';

// The 4-value overflow enum on Popover.Content, each with a constrained `height: small` box and long
// overflowing content so the overflow strategy is visible. One surface per value.
const OVERFLOWS = ['auto', 'hidden', 'scroll', 'visible'] as const;

const LONG =
  'This popover content box is intentionally longer than its small height so the overflow ' +
  'strategy is visible: auto and scroll add scrollbars, hidden clips the excess, and visible ' +
  'lets it spill beyond the box bounds. Line one. Line two. Line three. Line four. Line five. ' +
  'Line six. Line seven. Line eight. Line nine. Line ten.';

function overflowSurface(overflow: (typeof OVERFLOWS)[number]): A2uiMessage[] {
  const surfaceId = `content-overflow-${overflow}`;
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
            height: 'small',
            overflow,
            children: ['popover-heading', 'popover-message'],
          },
          {id: 'popover-heading', component: 'Heading', text: `overflow: ${overflow}`},
          {id: 'popover-message', component: 'Text', text: LONG},
        ],
      },
    },
  ];
}

export const contentOverflowFixture: Fixture = {
  name: 'content-overflow',
  messages: OVERFLOWS.flatMap(overflowSurface),
};
