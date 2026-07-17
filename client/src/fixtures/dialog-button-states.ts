import {CATALOG_ID} from 'primer-a2ui-adapter';
import type {Fixture} from './types';

// footerButtons element states: disabled + loading.
export const dialogButtonStatesFixture: Fixture = {
  name: 'dialog-button-states',
  messages: [
    {
      version: 'v0.9',
      createSurface: {
        surfaceId: 'dialog-button-states',
        catalogId: CATALOG_ID,
      },
    },
    {
      version: 'v0.9',
      updateComponents: {
        surfaceId: 'dialog-button-states',
        components: [
          {
            id: 'root',
            component: 'Dialog',
            title: 'Delete this file?',
            subtitle: 'This action cannot be undone',
            closeAction: {
              functionCall: {
                call: 'consoleLog',
                args: {
                  message: 'dialog closed',
                },
                returnType: 'void',
              },
            },
            children: ['dialog-body'],
            footerButtons: [
              {
                content: 'Disabled',
                disabled: true,
                action: {
                  functionCall: {
                    call: 'consoleLog',
                    args: {
                      message: 'noop',
                    },
                    returnType: 'void',
                  },
                },
              },
              {
                content: 'Loading',
                loading: true,
                action: {
                  functionCall: {
                    call: 'consoleLog',
                    args: {
                      message: 'noop',
                    },
                    returnType: 'void',
                  },
                },
              },
            ],
          },
          {
            id: 'dialog-body',
            component: 'Text',
            text: 'The file README.md will be permanently removed.',
          },
        ],
      },
    },
  ],
};
