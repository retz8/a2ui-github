import {CATALOG_ID} from 'primer-a2ui-adapter';
import type {Fixture} from './types';

export const issuelabeltokenHideremovebuttonFixture: Fixture = {
  name: 'issuelabeltoken-hideremovebutton',
  messages: [
    {
      version: 'v0.9',
      createSurface: {surfaceId: 'issuelabeltoken-hideremovebutton', catalogId: CATALOG_ID},
    },
    {
      version: 'v0.9',
      updateComponents: {
        surfaceId: 'issuelabeltoken-hideremovebutton',
        components: [
          {
            id: 'root',
            component: 'IssueLabelToken',
            text: 'No button',
            hideRemoveButton: true,
            removeAction: {
              functionCall: {
                call: 'consoleLog',
                args: {message: 'issuelabeltoken-hideremovebutton'},
                returnType: 'void',
              },
            },
          },
        ],
      },
    },
  ],
};
