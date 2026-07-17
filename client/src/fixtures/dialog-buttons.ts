import {CATALOG_ID} from 'primer-a2ui-adapter';
import type {Fixture} from './types';

// footerButtons: content + full buttonType walk + both action shapes (agent-coupled confirm-delete; danger disabled <- /deleted).
export const dialogButtonsFixture: Fixture = {
  name: 'dialog-buttons',
  messages: [
    {
      version: 'v0.9',
      createSurface: {
        surfaceId: 'dialog-buttons',
        catalogId: CATALOG_ID,
      },
    },
    {
      version: 'v0.9',
      updateComponents: {
        surfaceId: 'dialog-buttons',
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
                content: 'Later',
                buttonType: 'default',
                action: {
                  functionCall: {
                    call: 'consoleLog',
                    args: {
                      message: 'later',
                    },
                    returnType: 'void',
                  },
                },
              },
              {
                content: 'Save',
                buttonType: 'primary',
                autoFocus: true,
                action: {
                  functionCall: {
                    call: 'consoleLog',
                    args: {
                      message: 'save',
                    },
                    returnType: 'void',
                  },
                },
              },
              {
                content: 'Delete',
                buttonType: 'danger',
                disabled: {
                  path: '/deleted',
                },
                action: {
                  event: {
                    name: 'confirm-delete',
                    context: {},
                  },
                },
              },
              {
                content: 'Dismiss',
                buttonType: 'normal',
                action: {
                  functionCall: {
                    call: 'consoleLog',
                    args: {
                      message: 'dismiss',
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
    {
      version: 'v0.9',
      updateDataModel: {
        surfaceId: 'dialog-buttons',
        path: '/',
        value: {
          deleted: false,
        },
      },
    },
  ],
};
