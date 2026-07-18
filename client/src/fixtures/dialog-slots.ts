import {CATALOG_ID} from 'primer-a2ui-adapter';
import type {Fixture} from './types';

// All seven sub-leaves composed: slot overrides (Header/Body/Footer) + Title(bound)/Subtitle/CloseButton/Buttons. Agent-coupled save-changes; DialogTitle.text <- /dialog/title.
export const dialogSlotsFixture: Fixture = {
  name: 'dialog-slots',
  messages: [
    {
      version: 'v0.9',
      createSurface: {
        surfaceId: 'dialog-slots',
        catalogId: CATALOG_ID,
      },
    },
    {
      version: 'v0.9',
      updateComponents: {
        surfaceId: 'dialog-slots',
        components: [
          {
            id: 'root',
            component: 'Dialog',
            title: 'Edit notification settings',
            closeAction: {
              functionCall: {
                call: 'consoleLog',
                args: {
                  message: 'dialog closed',
                },
                returnType: 'void',
              },
            },
            children: ['slots-header', 'slots-body', 'slots-footer'],
          },
          {
            id: 'slots-header',
            component: 'DialogHeader',
            children: ['slots-title', 'slots-subtitle', 'slots-close'],
          },
          {
            id: 'slots-title',
            component: 'DialogTitle',
            text: {
              path: '/dialog/title',
            },
          },
          {
            id: 'slots-subtitle',
            component: 'DialogSubtitle',
            text: 'Changes apply to all devices',
          },
          {
            id: 'slots-close',
            component: 'DialogCloseButton',
            closeAction: {
              functionCall: {
                call: 'consoleLog',
                args: {
                  message: 'closebutton',
                },
                returnType: 'void',
              },
            },
          },
          {
            id: 'slots-body',
            component: 'DialogBody',
            children: ['slots-body-text'],
          },
          {
            id: 'slots-body-text',
            component: 'Text',
            text: 'Notification preferences form would render here.',
          },
          {
            id: 'slots-footer',
            component: 'DialogFooter',
            children: ['slots-buttons'],
          },
          {
            id: 'slots-buttons',
            component: 'DialogButtons',
            buttons: [
              {
                content: 'Save',
                buttonType: 'primary',
                action: {
                  event: {
                    name: 'save-changes',
                    context: {},
                  },
                },
              },
              {
                content: 'Cancel',
                buttonType: 'default',
                action: {
                  functionCall: {
                    call: 'consoleLog',
                    args: {
                      message: 'cancelled',
                    },
                    returnType: 'void',
                  },
                },
              },
            ],
          },
        ],
      },
    },
    {
      version: 'v0.9',
      updateDataModel: {
        surfaceId: 'dialog-slots',
        path: '/',
        value: {
          dialog: {
            title: 'Edit notification settings',
          },
        },
      },
    },
  ],
};
