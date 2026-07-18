import {CATALOG_ID} from 'primer-a2ui-adapter';
import type {Fixture} from './types';

// `onClickOutside` on the functionCall path: an outside click runs the local `consoleLog` function.
// Otherwise the base popover (open + relative, canonical content).
export const contentClickoutsideFnFixture: Fixture = {
  name: 'content-clickoutside-fn',
  messages: [
    {version: 'v0.9', createSurface: {surfaceId: 'content-clickoutside-fn', catalogId: CATALOG_ID}},
    {
      version: 'v0.9',
      updateComponents: {
        surfaceId: 'content-clickoutside-fn',
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
            onClickOutside: {
              functionCall: {
                call: 'consoleLog',
                args: {message: 'clicked outside'},
                returnType: 'void',
              },
            },
            children: ['popover-heading', 'popover-message'],
          },
          {id: 'popover-heading', component: 'Heading', text: 'Popover'},
          {id: 'popover-message', component: 'Text', text: 'Click outside to dismiss'},
        ],
      },
    },
  ],
};
