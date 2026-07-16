import {CATALOG_ID} from 'primer-a2ui-adapter';
import type {Fixture} from './types';

/** Visual state — `disabled: true`. The button renders `aria-disabled` (it stays focusable) and
 * guards its click. */
export const actionBarIconButtonDisabledFixture: Fixture = {
  name: 'action-bar-icon-button-disabled',
  messages: [
    {
      version: 'v0.9',
      createSurface: {surfaceId: 'action-bar-icon-button-disabled', catalogId: CATALOG_ID},
    },
    {
      version: 'v0.9',
      updateComponents: {
        surfaceId: 'action-bar-icon-button-disabled',
        components: [
          {
            id: 'root',
            component: 'ActionBar.IconButton',
            icon: 'glyph',
            accessibility: {label: 'Delete'},
            disabled: true,
            action: {
              functionCall: {call: 'consoleLog', args: {message: 'delete'}, returnType: 'void'},
            },
          },
          {id: 'glyph', component: 'Icon', name: 'trash'},
        ],
      },
    },
  ],
};
