import {CATALOG_ID} from 'primer-a2ui-adapter';
import type {A2uiMessage} from '@a2ui/web_core/v0_9';
import type {Fixture} from './types';

// The 12-value caret enum on the root; each surface is otherwise the base popover (open + relative,
// canonical content). One fullPage PNG walks every caret direction.
const CARETS = [
  'top',
  'bottom',
  'left',
  'right',
  'bottom-left',
  'bottom-right',
  'top-left',
  'top-right',
  'left-bottom',
  'left-top',
  'right-bottom',
  'right-top',
] as const;

function caretSurface(caret: (typeof CARETS)[number]): A2uiMessage[] {
  const surfaceId = `popover-caret-${caret}`;
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
            caret,
            children: ['popover-content'],
          },
          {
            id: 'popover-content',
            component: 'PopoverContent',
            children: ['popover-heading', 'popover-message'],
          },
          {id: 'popover-heading', component: 'Heading', text: caret},
          {id: 'popover-message', component: 'Text', text: 'Click outside to dismiss'},
        ],
      },
    },
  ];
}

export const popoverCaretFixture: Fixture = {
  name: 'popover-caret',
  messages: CARETS.flatMap(caretSurface),
};
