import {CATALOG_ID} from 'primer-a2ui-adapter';
import type {Fixture} from './types';

export const buttonTrailingActionFixture: Fixture = {
  name: 'button-trailing-action',
  messages: [
    {version: 'v0.9', createSurface: {surfaceId: 'button-trailing-action', catalogId: CATALOG_ID}},
    {
      version: 'v0.9',
      updateComponents: {
        surfaceId: 'button-trailing-action',
        components: [
          {
            id: 'root',
            component: 'Button',
            child: 'label',
            trailingVisual: 'tv',
            trailingAction: 'ta',
            action: {
              functionCall: {
                call: 'consoleLog',
                args: {message: 'trailingAction'},
                returnType: 'void',
              },
            },
          },
          {id: 'label', component: 'Text', text: 'Menu'},
          {id: 'tv', component: 'Icon', name: 'kebab-horizontal'},
          {id: 'ta', component: 'Icon', name: 'triangle-down'},
        ],
      },
    },
  ],
};
