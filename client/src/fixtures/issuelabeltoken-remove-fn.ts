import {CATALOG_ID} from 'primer-a2ui-adapter';
import type {Fixture} from './types';

export const issuelabeltokenRemoveFnFixture: Fixture = {
  name: 'issuelabeltoken-remove-fn',
  messages: [
    {
      version: 'v0.9',
      createSurface: {surfaceId: 'issuelabeltoken-remove-fn', catalogId: CATALOG_ID},
    },
    {
      version: 'v0.9',
      updateComponents: {
        surfaceId: 'issuelabeltoken-remove-fn',
        components: [
          {
            id: 'root',
            component: 'IssueLabelToken',
            text: 'Remove me',
            removeAction: {
              functionCall: {
                call: 'consoleLog',
                args: {message: 'issue-label-remove clicked'},
                returnType: 'void',
              },
            },
          },
        ],
      },
    },
  ],
};
