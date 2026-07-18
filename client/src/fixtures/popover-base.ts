import {CATALOG_ID} from 'primer-a2ui-adapter';
import type {Fixture} from './types';

// The base Popover: root `children` + default `caret` (top) + `open` literal; a default
// Popover.Content (small/fit-content). Baselined `open: true` + `relative: true` (in-flow, no
// anchor) with the canonical Heading + Text + Button content.
export const popoverBaseFixture: Fixture = {
  name: 'popover-base',
  messages: [
    {version: 'v0.9', createSurface: {surfaceId: 'popover-base', catalogId: CATALOG_ID}},
    {
      version: 'v0.9',
      updateComponents: {
        surfaceId: 'popover-base',
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
            children: ['popover-heading', 'popover-message', 'popover-action'],
          },
          {id: 'popover-heading', component: 'Heading', text: 'Popover'},
          {id: 'popover-message', component: 'Text', text: 'Click outside to dismiss'},
          {
            id: 'popover-action',
            component: 'Button',
            child: 'popover-action-label',
            action: {
              functionCall: {
                call: 'consoleLog',
                args: {message: 'popover action'},
                returnType: 'void',
              },
            },
          },
          {id: 'popover-action-label', component: 'Text', text: 'Got it'},
        ],
      },
    },
  ],
};
