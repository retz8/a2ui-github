import {CATALOG_ID} from 'primer-a2ui-adapter';
import type {Fixture} from './types';

/** Interaction — functionCall path. A standalone `ActionBar.IconButton` (the overflow registry
 * no-ops without an `ActionBar` parent) whose `action` runs the local `consoleLog`. */
export const actionBarIconButtonFnFixture: Fixture = {
  name: 'action-bar-icon-button-fn',
  messages: [
    {
      version: 'v0.9',
      createSurface: {surfaceId: 'action-bar-icon-button-fn', catalogId: CATALOG_ID},
    },
    {
      version: 'v0.9',
      updateComponents: {
        surfaceId: 'action-bar-icon-button-fn',
        components: [
          {
            id: 'root',
            component: 'ActionBar.IconButton',
            icon: 'glyph',
            accessibility: {label: 'Bold'},
            action: {
              functionCall: {
                call: 'consoleLog',
                args: {message: 'action-bar-icon-button-fn clicked'},
                returnType: 'void',
              },
            },
          },
          {id: 'glyph', component: 'Icon', name: 'bold'},
        ],
      },
    },
  ],
};
