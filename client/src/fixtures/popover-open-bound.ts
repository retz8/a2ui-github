import {CATALOG_ID} from 'primer-a2ui-adapter';
import type {Fixture} from './types';

// `open` two-way bound to `/popoverOpen` (initial `true`): the controlled visibility state resolves
// from the data model. Otherwise the base popover (relative, canonical content).
export const popoverOpenBoundFixture: Fixture = {
  name: 'popover-open-bound',
  messages: [
    {version: 'v0.9', createSurface: {surfaceId: 'popover-open-bound', catalogId: CATALOG_ID}},
    {
      version: 'v0.9',
      updateComponents: {
        surfaceId: 'popover-open-bound',
        components: [
          {
            id: 'root',
            component: 'Popover',
            open: {path: '/popoverOpen'},
            relative: true,
            children: ['popover-content'],
          },
          {
            id: 'popover-content',
            component: 'PopoverContent',
            children: ['popover-heading', 'popover-message'],
          },
          {id: 'popover-heading', component: 'Heading', text: 'Popover'},
          {
            id: 'popover-message',
            component: 'Text',
            text: 'Bound visibility (open ← /popoverOpen)',
          },
        ],
      },
    },
    {
      version: 'v0.9',
      updateDataModel: {surfaceId: 'popover-open-bound', path: '/', value: {popoverOpen: true}},
    },
  ],
};
