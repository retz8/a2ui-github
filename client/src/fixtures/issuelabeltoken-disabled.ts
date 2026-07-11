import {CATALOG_ID} from 'primer-a2ui-adapter';
import type {Fixture} from './types';

export const issuelabeltokenDisabledFixture: Fixture = {
  name: 'issuelabeltoken-disabled',
  messages: [
    {
      version: 'v0.9',
      createSurface: {surfaceId: 'issuelabeltoken-disabled', catalogId: CATALOG_ID},
    },
    {
      version: 'v0.9',
      updateComponents: {
        surfaceId: 'issuelabeltoken-disabled',
        components: [
          {
            id: 'root',
            component: 'IssueLabelToken',
            text: 'Disabled',
            disabled: true,
            removeAction: {
              functionCall: {
                call: 'consoleLog',
                args: {message: 'issuelabeltoken-disabled'},
                returnType: 'void',
              },
            },
          },
        ],
      },
    },
  ],
};
